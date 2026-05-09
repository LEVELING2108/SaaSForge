import logging
from typing import Any, Dict, Optional

import httpx
from jose import jwt

from app.core.config import settings

logger = logging.getLogger(__name__)

# Cache for JWKS
_jwks: Optional[Dict[str, Any]] = None


async def get_jwks() -> Dict[str, Any]:
    """Fetch JWKS from Clerk."""
    global _jwks
    if _jwks is not None:
        return _jwks

    if not settings.CLERK_JWKS_URL:
        logger.error("CLERK_JWKS_URL not configured")
        return {}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(settings.CLERK_JWKS_URL)
            response.raise_for_status()
            _jwks = response.json()
            return _jwks
    except Exception as e:
        logger.error(f"Error fetching JWKS from Clerk: {str(e)}")
        return {}


async def verify_clerk_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify a Clerk JWT token."""
    jwks = await get_jwks()
    if not jwks:
        return None

    try:
        # Decode and verify token
        # Clerk uses RS256
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            issuer=settings.CLERK_ISSUER,
            options={
                "verify_aud": False
            },  # aud can vary depending on frontend configuration
        )
        return payload
    except Exception as e:
        logger.error(f"Error verifying Clerk token: {str(e)}")
        return None
