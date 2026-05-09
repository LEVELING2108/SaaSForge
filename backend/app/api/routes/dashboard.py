import logging
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import AuditLog, User
from app.schemas.user import UserInDB, UserResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
logger = logging.getLogger(__name__)


@router.get("/stats")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """Get dashboard statistics."""
    # Get user count
    result = await db.execute(select(func.count(User.id)))
    total_users = result.scalar()

    # Get recent users (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    result = await db.execute(
        select(func.count(User.id)).where(User.created_at >= seven_days_ago)
    )
    new_users_this_week = result.scalar()

    return {
        "total_users": total_users,
        "new_users_this_week": new_users_this_week,
        "subscription_tier": current_user.subscription_tier.value,
        "account_status": "active" if current_user.is_active else "inactive",
    }


@router.get("/activity")
async def get_recent_activity(
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
    limit: int = 10
):
    """Get recent user activity."""
    # Ensure limit is reasonable
    limit = min(max(1, limit), 50)

    result = await db.execute(
        select(AuditLog)
        .where(AuditLog.user_id == current_user.id)
        .order_by(desc(AuditLog.created_at))
        .limit(limit)
    )
    activities = result.scalars().all()

    return {
        "activities": [
            {
                "id": act.id,
                "action": act.action,
                "timestamp": act.created_at.isoformat(),
                "entity_type": act.entity_type,
                "entity_id": act.entity_id
            }
            for act in activities
        ]
    }
