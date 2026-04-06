from fastapi import APIRouter
from app.api.routes import auth, subscriptions, dashboard

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router)
api_router.include_router(subscriptions.router)
api_router.include_router(dashboard.router)
