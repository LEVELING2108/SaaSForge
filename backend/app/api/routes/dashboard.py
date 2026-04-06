from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.schemas.user import UserInDB, UserResponse
from app.models.user import User
from datetime import datetime, timedelta
import logging

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
logger = logging.getLogger(__name__)


@router.get("/stats")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user)
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
    current_user: UserInDB = Depends(get_current_user)
):
    """Get recent user activity."""
    # This is a placeholder - implement based on your needs
    return {
        "activities": [
            {"action": "Logged in", "timestamp": datetime.utcnow().isoformat()},
            {"action": "Updated profile", "timestamp": datetime.utcnow().isoformat()},
        ]
    }
