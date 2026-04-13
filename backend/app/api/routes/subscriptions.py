import logging

import stripe
from app.api.dependencies import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.user import SubscriptionTier, User
from app.schemas.user import (CreateCheckoutSession, SubscriptionResponse,
                              UserInDB)
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])
logger = logging.getLogger(__name__)

# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


@router.post("/create-checkout-session")
async def create_checkout_session(
    session_data: CreateCheckoutSession,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """Create a Stripe checkout session."""
    try:
        # Get or create Stripe customer
        if not current_user.stripe_customer_id:
            customer = stripe.Customer.create(
                email=current_user.email,
                name=current_user.full_name,
                metadata={"user_id": current_user.id},
            )

            # Update user with Stripe customer ID
            user = await db.get(User, current_user.id)
            user.stripe_customer_id = customer.id
            await db.flush()
        else:
            customer_id = current_user.stripe_customer_id

        # Create checkout session
        checkout_session = stripe.checkout.Session.create(
            customer=current_user.stripe_customer_id or customer_id,
            payment_method_types=["card"],
            line_items=[{"price": session_data.price_id, "quantity": 1}],
            mode="subscription",
            success_url=session_data.success_url,
            cancel_url=session_data.cancel_url,
            metadata={"user_id": current_user.id},
        )

        logger.info(f"Checkout session created for user {current_user.id}")
        return {"url": checkout_session.url}

    except Exception as e:
        logger.error(f"Error creating checkout session: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error creating checkout session: {str(e)}"
        )


@router.post("/create-portal-session")
async def create_portal_session(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """Create a Stripe billing portal session."""
    try:
        if not current_user.stripe_customer_id:
            raise HTTPException(status_code=400, detail="No Stripe customer found")

        portal_session = stripe.billing_portal.Session.create(
            customer=current_user.stripe_customer_id,
            return_url=str(request.base_url),
        )

        return {"url": portal_session.url}

    except Exception as e:
        logger.error(f"Error creating portal session: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error creating portal session: {str(e)}"
        )


@router.post("/webhook", status_code=200)
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Stripe webhook events."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        await handle_checkout_completed(session, db)

    elif event["type"] == "customer.subscription.updated":
        subscription = event["data"]["object"]
        await handle_subscription_updated(subscription, db)

    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        await handle_subscription_deleted(subscription, db)

    return {"received": True}


async def handle_checkout_completed(session, db: AsyncSession):
    """Handle checkout.session.completed event."""
    user_id = session.get("metadata", {}).get("user_id")
    if not user_id:
        return

    user = await db.get(User, int(user_id))
    if not user:
        return

    # Update user subscription tier
    subscription_id = session.get("subscription")
    customer_id = session.get("customer")

    user.stripe_subscription_id = subscription_id
    user.stripe_customer_id = customer_id

    # Determine tier based on price
    if session.get("amount_total", 0) > 2000:  # More than $20
        user.subscription_tier = SubscriptionTier.PRO
    else:
        user.subscription_tier = SubscriptionTier.BASIC

    await db.flush()
    logger.info(f"Subscription completed for user {user_id}")


async def handle_subscription_updated(subscription, db: AsyncSession):
    """Handle customer.subscription.updated event."""
    # Find user by stripe_subscription_id
    from sqlalchemy import select

    result = await db.execute(
        select(User).where(User.stripe_subscription_id == subscription.id)
    )
    user = result.scalar_one_or_none()

    if not user:
        return

    # Update subscription status
    status = subscription.get("status")
    cancel_at_period_end = subscription.get("cancel_at_period_end", False)

    if status == "active":
        user.subscription_tier = (
            SubscriptionTier.PRO
            if subscription.get("items", {})
            .get("data", [{}])[0]
            .get("price", {})
            .get("unit_amount", 0)
            > 2000
            else SubscriptionTier.BASIC
        )
    elif status == "canceled" or status == "unpaid":
        user.subscription_tier = SubscriptionTier.FREE

    await db.flush()
    logger.info(f"Subscription updated for user {user.id}")


async def handle_subscription_deleted(subscription, db: AsyncSession):
    """Handle customer.subscription.deleted event."""
    from sqlalchemy import select

    result = await db.execute(
        select(User).where(User.stripe_subscription_id == subscription.id)
    )
    user = result.scalar_one_or_none()

    if not user:
        return

    user.subscription_tier = SubscriptionTier.FREE
    user.stripe_subscription_id = None

    await db.flush()
    logger.info(f"Subscription deleted for user {user.id}")
