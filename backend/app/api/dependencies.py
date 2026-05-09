from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.clerk import verify_clerk_token
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.schemas.user import UserInDB

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)
) -> UserInDB:
    """
    Get the current authenticated user (supports Clerk and custom JWT).

    If a Clerk token is provided, it is verified against Clerk's JWKS.
    If the user does not exist locally, they are synchronized (created).
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        raise credentials_exception

    # 1. Try Clerk Verification first
    try:
        clerk_payload = await verify_clerk_token(token)
        if clerk_payload:
            clerk_id = clerk_payload.get("sub")
            if not clerk_id:
                raise credentials_exception

            # Fetch or Sync User
            result = await db.execute(select(User).where(User.clerk_id == clerk_id))
            user = result.scalar_one_or_none()

            if not user:
                # Sync user: Create local user if they exist in Clerk but not here
                email = clerk_payload.get("email") or f"{clerk_id}@clerk.user"
                user = User(
                    clerk_id=clerk_id,
                    email=email,
                    hashed_password=None,  # Clerk users don't have local passwords
                    is_verified=True,
                )
                db.add(user)
                await db.flush()
                await db.refresh(user)

            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user"
                )

            return UserInDB.model_validate(user)
    except Exception as e:
        # Log error but don't fail immediately, try fallback
        pass

    # 2. Fallback to Custom JWT
    try:
        payload = decode_access_token(token)
        if payload:
            user_id: Optional[int] = payload.get("sub")
            if user_id:
                result = await db.execute(select(User).where(User.id == int(user_id)))
                user = result.scalar_one_or_none()
                if user:
                    if not user.is_active:
                        raise HTTPException(
                            status_code=status.HTTP_403_FORBIDDEN,
                            detail="Inactive user",
                        )
                    return UserInDB.model_validate(user)
    except Exception:
        pass

    raise credentials_exception


async def get_current_active_superuser(
    current_user: UserInDB = Depends(get_current_user),
) -> UserInDB:
    """Get the current superuser."""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
    return current_user
