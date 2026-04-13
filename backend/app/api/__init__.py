from app.api.routes import auth, dashboard, subscriptions, team
from fastapi import APIRouter

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router)
api_router.include_router(subscriptions.router)
api_router.include_router(dashboard.router)
api_router.include_router(team.router)
