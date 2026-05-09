import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import Team, TeamMember, User
from app.schemas.team import InviteMemberRequest, TeamMemberResponse, UpdateMemberRole
from app.schemas.user import UserInDB
from app.services.activity_service import log_activity

router = APIRouter(prefix="/team", tags=["Team"])
logger = logging.getLogger(__name__)


async def get_or_create_user_team(user_id: int, db: AsyncSession) -> Team:
    """Get the user's team or create one if they don't have one."""
    # Find if user is already in a team
    result = await db.execute(
        select(Team)
        .join(TeamMember, Team.id == TeamMember.team_id)
        .where(TeamMember.user_id == user_id)
    )
    team = result.scalar_one_or_none()

    if not team:
        # Create a new team
        new_team = Team(name=f"Team {user_id}")
        db.add(new_team)
        await db.flush()
        await db.refresh(new_team)

        # Add user as owner
        owner_member = TeamMember(team_id=new_team.id, user_id=user_id, role="owner")
        db.add(owner_member)
        await db.flush()
        team = new_team

    return team


@router.get("/members", response_model=list[TeamMemberResponse])
async def get_team_members(
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """Get all team members for the current user's team."""
    team = await get_or_create_user_team(current_user.id, db)

    # Query all members of this team joining with User for details
    result = await db.execute(
        select(User.id, User.email, User.full_name, TeamMember.role, User.avatar_url)
        .join(TeamMember, User.id == TeamMember.user_id)
        .where(TeamMember.team_id == team.id)
    )

    members = []
    for row in result.all():
        members.append(
            TeamMemberResponse(
                id=row.id,
                email=row.email,
                full_name=row.full_name,
                role=row.role,
                avatar_url=row.avatar_url,
            )
        )

    return members


@router.post("/invite", status_code=status.HTTP_201_CREATED)
async def invite_team_member(
    invite_data: InviteMemberRequest,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """Invite a new member to the team."""
    team = await get_or_create_user_team(current_user.id, db)

    # Check if user already exists
    result = await db.execute(select(User).where(User.email == invite_data.email))
    user = result.scalar_one_or_none()

    if not user:
        # In production: Send email invitation
        # For now: Auto-create a placeholder user
        user = User(email=invite_data.email, hashed_password="", is_active=True)
        db.add(user)
        await db.flush()
        await db.refresh(user)

    # Check if already in team
    result = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team.id, TeamMember.user_id == user.id
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User already in team"
        )

    # Add to team
    new_member = TeamMember(team_id=team.id, user_id=user.id, role=invite_data.role)
    db.add(new_member)
    await db.flush()

    try:
        await log_activity(
            db,
            current_user.id,
            f"Invited {invite_data.email} to team",
            entity_type="team",
            entity_id=team.id,
        )
    except Exception as e:
        logger.error(f"Failed to log invite activity: {str(e)}")

    logger.info(f"Team member invited: {invite_data.email} to team {team.id}")
    return {"message": f"Invitation sent to {invite_data.email}"}


@router.patch("/members/{member_id}/role")
async def update_member_role(
    member_id: int,
    role_data: UpdateMemberRole,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """Update a team member's role."""
    team = await get_or_create_user_team(current_user.id, db)

    # Verify current user is admin/owner
    result = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team.id, TeamMember.user_id == current_user.id
        )
    )
    current_member = result.scalar_one_or_none()
    if not current_member or current_member.role not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Update role
    result = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team.id, TeamMember.user_id == member_id
        )
    )
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    member.role = role_data.role
    await db.flush()

    try:
        await log_activity(
            db,
            current_user.id,
            f"Updated role for member {member_id}",
            entity_type="team",
            entity_id=team.id,
        )
    except Exception as e:
        logger.error(f"Failed to log update role activity: {str(e)}")

    logger.info(f"Role updated for member {member_id} to {role_data.role}")
    return {"message": "Role updated successfully"}


@router.delete("/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_team_member(
    member_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserInDB = Depends(get_current_user),
):
    """Remove a team member from the team."""
    team = await get_or_create_user_team(current_user.id, db)

    # 1. Fetch current user's role in the team
    result = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team.id, TeamMember.user_id == current_user.id
        )
    )
    current_member = result.scalar_one_or_none()
    if not current_member:
        raise HTTPException(status_code=403, detail="Not a member of this team")

    # 2. Fetch the target member
    result = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team.id, TeamMember.user_id == member_id
        )
    )
    target_member = result.scalar_one_or_none()
    if not target_member:
        raise HTTPException(status_code=404, detail="Member not found in this team")

    # 3. Authorization Logic:
    # - A user can always remove themselves (leaving)
    # - An owner can remove anyone except themselves (they must delete team or transfer ownership)
    # - An admin can remove members, but not owners or other admins
    is_self = current_user.id == member_id
    can_manage = current_member.role in ["admin", "owner"]

    if not is_self:
        if not can_manage:
            raise HTTPException(status_code=403, detail="Not authorized to remove members")

        # Admins cannot remove owners or other admins
        if current_member.role == "admin" and target_member.role in ["admin", "owner"]:
            raise HTTPException(
                status_code=403, detail="Admins cannot remove other admins or owners"
            )

    # 4. Perform Removal
    await db.delete(target_member)
    await db.flush()

    # 5. Logging
    action = (
        "Left team"
        if is_self
        else f"Removed member {member_id} from team"
    )
    try:
        await log_activity(
            db, current_user.id, action, entity_type="team", entity_id=team.id
        )
    except Exception as e:
        logger.error(f"Failed to log removal activity: {str(e)}")

    logger.info(f"Team member removed: {member_id} from team {team.id}")
    return None
