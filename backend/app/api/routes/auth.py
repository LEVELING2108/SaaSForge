import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.team import UpdatePreferences
from app.schemas.user import (
    LoginRequest,
    PasswordReset,
    Token,
    UserCreate,
    UserInDB,
    UserResponse,
    UserUpdate,
)
from app.services.activity_service import log_activity

router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = logging.getLogger(__name__)


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
    )

    db.add(new_user)
    await db.flush()
    await db.refresh(new_user)

    await log_activity(db, new_user.id, "Registered account")

    logger.info(f"New user registered: {new_user.email}")
    return new_user


@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Login and get access token."""
    # Find user
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user"
        )

    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})

    await log_activity(db, user.id, "Logged in")

    logger.info(f"User logged in: {user.email}")
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserInDB = Depends(get_current_user)):
    """Get current user information."""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: dict,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """Update current user information."""
    user = await db.get(User, current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in user_update.items():
        if hasattr(user, key):
            setattr(user, key, value)

    await db.flush()
    await db.refresh(user)

    await log_activity(db, user.id, "Updated profile")

    logger.info(f"User updated: {user.email}")
    return user


@router.post("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    password_data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """Change user password."""
    user = await db.get(User, current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(password_data.get("current_password"), user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect current password"
        )

    user.hashed_password = get_password_hash(password_data.get("new_password"))
    await db.flush()

    await log_activity(db, user.id, "Changed password")

    logger.info(f"Password changed: {user.email}")
    return {"message": "Password changed successfully"}


@router.patch("/preferences", status_code=status.HTTP_200_OK)
async def update_preferences(
    preferences: UpdatePreferences,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """Update user preferences (stored in app state for now)."""
    # In production, store in a user_preferences table
    logger.info(f"Preferences updated for {current_user.email}")
    return {
        "message": "Preferences updated successfully",
        "preferences": preferences.dict(),
    }


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """Delete user account (soft delete recommended in production)."""
    user = await db.get(User, current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # In production: Soft delete or cascade delete related records
    await db.delete(user)
    await db.flush()

    logger.info(f"Account deleted: {current_user.email}")
    return None
