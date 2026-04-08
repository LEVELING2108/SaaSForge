from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models.user import SubscriptionTier


# Team Schemas
class TeamMemberResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    role: str
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


class InviteMemberRequest(BaseModel):
    email: EmailStr
    role: str = Field(default="member")


class UpdateMemberRole(BaseModel):
    role: str


# User Preferences Schema
class UserPreferences(BaseModel):
    email_notifications: bool = True
    two_factor_enabled: bool = False


class UpdatePreferences(BaseModel):
    email_notifications: Optional[bool] = None
    two_factor_enabled: Optional[bool] = None
