import os

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.core.config import settings
from app.core.database import Base, async_session_maker, engine
from app.main import app


@pytest.fixture(autouse=True, scope="session")
def override_settings():
    """Override settings for testing at the session level."""
    os.environ["DATABASE_URL"] = "postgresql://testuser:testpass@localhost:5432/testdb"
    os.environ["SECRET_KEY"] = "test-secret-key"
    os.environ["CLERK_JWKS_URL"] = ""
    os.environ["CLERK_ISSUER"] = ""
    yield


@pytest_asyncio.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@pytest_asyncio.fixture(scope="function")
async def db_session():
    """Create a fresh database session for each test."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
