@echo off
echo ========================================
echo   Starting SaaS Application...
echo ========================================
echo.

echo Starting PostgreSQL, Backend, and Frontend...
echo This may take a few moments...
echo.

docker-compose up -d

echo.
echo ========================================
echo   Services Started!
echo ========================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:8000
echo API Docs:  http://localhost:8000/docs
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.
pause
