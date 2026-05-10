import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from svix.webhooks import Webhook, WebhookVerificationError

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.services.activity_service import log_activity

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])
logger = logging.getLogger(__name__)


@router.post("/clerk")
async def clerk_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Clerk webhook events."""
    if not settings.CLERK_WEBHOOK_SECRET:
        logger.error("CLERK_WEBHOOK_SECRET not configured")
        raise HTTPException(status_code=500, detail="Webhook secret not configured")

    payload = await request.body()
    headers = request.headers

    # Verify webhook signature
    wh = Webhook(settings.CLERK_WEBHOOK_SECRET)
    try:
        msg = wh.verify(payload.decode(), headers)
    except WebhookVerificationError as e:
        logger.error(f"Error verifying Clerk webhook: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_type = msg.get("type")
    data = msg.get("data")

    if event_type == "user.created":
        await handle_user_created(data, db)
    elif event_type == "user.updated":
        await handle_user_updated(data, db)
    elif event_type == "user.deleted":
        await handle_user_deleted(data, db)

    return {"received": True}


async def handle_user_created(data: dict, db: AsyncSession):
    """Sync user creation from Clerk."""
    clerk_id = data.get("id")
    email_addresses = data.get("email_addresses", [])
    primary_email = next(
        (
            e.get("email_address")
            for e in email_addresses
            if e.get("id") == data.get("primary_email_address_id")
        ),
        email_addresses[0].get("email_address") if email_addresses else None,
    )

    if not primary_email:
        logger.error(f"No email found for Clerk user {clerk_id}")
        return

    # Check if user already exists
    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalar_one_or_none()

    if not user:
        # Create user
        user = User(
            clerk_id=clerk_id,
            email=primary_email,
            full_name=f"{data.get('first_name', '')} {data.get('last_name', '')}".strip()
            or None,
            avatar_url=data.get("image_url"),
            is_verified=True,
        )
        db.add(user)
        await db.flush()
        await db.refresh(user)

        try:
            await log_activity(db, user.id, "Account synced via Clerk webhook")
        except Exception:
            pass

        logger.info(f"User created via webhook: {primary_email}")


async def handle_user_updated(data: dict, db: AsyncSession):
    """Sync user updates from Clerk."""
    clerk_id = data.get("id")

    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalar_one_or_none()

    if user:
        user.full_name = (
            f"{data.get('first_name', '')} {data.get('last_name', '')}".strip()
            or user.full_name
        )
        user.avatar_url = data.get("image_url") or user.avatar_url

        await db.flush()
        logger.info(f"User updated via webhook: {user.email}")


async def handle_user_deleted(data: dict, db: AsyncSession):
    """Sync user deletion from Clerk."""
    clerk_id = data.get("id")

    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalar_one_or_none()

    if user:
        # Soft delete in production, hard delete for now
        await db.delete(user)
        await db.flush()
        logger.info(f"User deleted via webhook: {clerk_id}")
