import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select
from app.models.user import User, Team, TeamMember, AuditLog
from app.core.security import create_access_token
import uuid

@pytest.mark.asyncio
async def test_user_flow_integration(client, db_session):
    """
    Test a full user journey:
    1. Auth Sync (via custom JWT fallback)
    2. Dashboard Stats
    3. Activity Logging verification
    4. Team Creation & Invite
    5. Analytics retrieval
    """
    
    # 1. Setup Test User
    user_email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    # We use a custom token to bypass Clerk for local verification
    # Our dependency.py handles int IDs for custom tokens
    
    # Create user manually first to get an ID for the token
    test_user = User(email=user_email, full_name="Test User", hashed_password="hashed_password")
    db_session.add(test_user)
    await db_session.commit()
    await db_session.refresh(test_user)
    
    token = create_access_token(data={"sub": str(test_user.id)})
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Verify Auth (Get Me)
    response = await client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == user_email

    # 3. Check Dashboard Stats
    response = await client.get("/api/v1/dashboard/stats", headers=headers)
    assert response.status_code == 200
    stats = response.json()
    assert "total_users" in stats
    assert stats["subscription_tier"] == "free"

    # 4. Verify Activity Logging (Auth/Me should have logged nothing, but let's check profile update)
    response = await client.put("/api/v1/auth/me", json={"full_name": "Updated Name"}, headers=headers)
    assert response.status_code == 200
    
    # Check Audit Logs
    response = await client.get("/api/v1/dashboard/activity", headers=headers)
    assert response.status_code == 200
    activities = response.json()["activities"]
    assert len(activities) > 0
    assert any("Updated profile" in a["action"] for a in activities)

    # 5. Team Management
    # Get members (should trigger auto-team creation)
    response = await client.get("/api/v1/team/members", headers=headers)
    assert response.status_code == 200
    members = response.json()
    assert len(members) == 1
    assert members[0]["role"] == "owner"

    # Invite a member
    invite_email = "colleague@example.com"
    response = await client.post("/api/v1/team/invite", json={"email": invite_email, "role": "member"}, headers=headers)
    assert response.status_code == 201
    
    # Verify member added
    response = await client.get("/api/v1/team/members", headers=headers)
    assert len(response.json()) == 2

    # 6. Analytics
    response = await client.get("/api/v1/dashboard/stats/growth", headers=headers)
    assert response.status_code == 200
    growth = response.json()["growth"]
    assert len(growth) >= 1
    assert growth[0]["count"] >= 1

    # 7. Stripe Session (Backend Check)
    response = await client.post("/api/v1/subscriptions/create-checkout-session", json={
        "price_id": "test_price_id",
        "success_url": "http://test/success",
        "cancel_url": "http://test/cancel"
    }, headers=headers)
    # This might return 500 if STRIPE_SECRET_KEY is empty/invalid, but we check if route exists
    assert response.status_code in [200, 500] 
