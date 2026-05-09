import logging
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import AuditLog

logger = logging.getLogger(__name__)


async def log_activity(
    db: AsyncSession,
    user_id: Optional[int],
    action: str,
    entity_type: Optional[str] = None,
    entity_id: Optional[int] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
):
    """
    Log a user activity to the database.
    This function should be called within a request scope where db session is active.
    """
    if not user_id:
        return

    try:
        new_log = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        db.add(new_log)
        # We use flush instead of commit to keep it within the parent transaction
        await db.flush()
        logger.info(f"Activity logged: {action} for user {user_id}")
    except Exception as e:
        logger.error(f"Failed to log activity: {str(e)}")
        # We don't want to crash the request if logging fails

