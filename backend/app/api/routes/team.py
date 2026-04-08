from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.schemas.user import UserInDB
from app.schemas.team import (
    InviteMemberRequest,
    UpdateMemberRole,
    TeamMemberResponse,
)
import logging

router = APIRouter(prefix="/team", tags=["Team"])
logger = logging.getLogger(__name__)

# Mock team storage (replace with DB model in production)
mock_team_members = {}


@router.get("/members", response_model=list[TeamMemberResponse])
async def get_team_members(
    current_user: UserInDB = Depends(get_current_user)
):
    """Get all team members for the current user's team."""
    # In production, query the database for team members
    # For now, return mock data
    return [
        TeamMemberResponse(
            id=current_user.id,
            email=current_user.email,
            full_name=current_user.full_name or "You",
            role="owner",
            avatar_url=current_user.avatar_url,
        )
    ]


@router.post("/invite", status_code=status.HTTP_201_CREATED)
async def invite_team_member(
    invite_data: InviteMemberRequest,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Invite a new member to the team."""
    # Check if user already exists in team
    if invite_data.email in mock_team_members:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already invited to team"
        )

    # In production:
    # 1. Create invitation record in DB
    # 2. Send invitation email
    # 3. Create team member if they accept

    # Mock: Add to team
    mock_team_members[invite_data.email] = {
        "email": invite_data.email,
        "role": invite_data.role,
        "invited_by": current_user.id,
    }

    logger.info(f"Team member invited: {invite_data.email} by {current_user.email}")
    return {"message": f"Invitation sent to {invite_data.email}"}


@router.patch("/members/{member_id}/role")
async def update_member_role(
    member_id: int,
    role_data: UpdateMemberRole,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a team member's role."""
    # In production: Update team member role in DB
    logger.info(f"Role updated for member {member_id} to {role_data.role}")
    return {"message": "Role updated successfully"}


@router.delete("/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_team_member(
    member_id: int,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Remove a team member from the team."""
    # In production: Delete team member from DB
    logger.info(f"Team member removed: {member_id} by {current_user.email}")
    return None
