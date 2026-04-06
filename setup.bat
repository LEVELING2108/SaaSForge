@echo off
echo ========================================
echo   SaaS Application - Setup Script
echo ========================================
echo.

echo [1/6] Setting up Backend...
cd backend

echo [2/6] Creating Python virtual environment...
python -m venv venv
call venv\Scripts\activate

echo [3/6] Installing Python dependencies...
pip install -r requirements.txt

echo [4/6] Creating .env file from template...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please edit it with your configuration.
)

cd ..

echo.
echo [5/6] Setting up Frontend...
cd frontend

echo Installing Node.js dependencies...
call npm install

echo [6/6] Creating .env.local file from template...
if not exist .env.local (
    copy .env.example .env.local
    echo .env.local file created. Please edit it with your configuration.
)

cd ..

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit backend\.env with your configuration
echo 2. Edit frontend\.env.local with your configuration
echo 3. Ensure PostgreSQL is running
echo 4. Run: docker-compose up -d (or start services manually)
echo.
echo See SETUP.md for detailed instructions.
echo.
pause
