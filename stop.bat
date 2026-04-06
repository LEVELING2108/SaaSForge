@echo off
echo ========================================
echo   Stopping SaaS Application...
echo ========================================
echo.

docker-compose down

echo.
echo All services stopped.
echo.
pause
