# 🚀 Quick Start Guide

Get your SaaS application running in 5 minutes!

## Option 1: Docker (Easiest - Recommended)

### Prerequisites
- Docker installed ([Get Docker](https://www.docker.com/get-started))

### Steps

1. **Double-click** `start.bat` (or run):
   ```bash
   docker-compose up -d
   ```

2. **Wait** 1-2 minutes for services to start

3. **Open** your browser:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

4. **Configure** environment variables (see below)

5. **Done!** 🎉

---

## Option 2: Manual Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL

### Steps

#### 1. Run Setup Script
Double-click `setup.bat` or run:
```bash
# Windows
setup.bat

# macOS/Linux
chmod +x setup.sh
./setup.sh
```

#### 2. Start PostgreSQL
```bash
# Option A: Using Docker
docker run --name saas-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=saas_db -p 5432:5432 -d postgres:15-alpine

# Option B: Using local PostgreSQL
# Make sure PostgreSQL is running
```

#### 3. Start Backend
```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
uvicorn app.main:app --reload
```

#### 4. Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

#### 5. Open Browser
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

## Required Configuration

Before the app works fully, you need to set up:

### 1. Clerk (Authentication)
- Sign up: https://clerk.com
- Create app
- Copy keys to:
  - Backend `.env`: Not needed
  - Frontend `.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`

### 2. Stripe (Payments) - Optional for testing
- Sign up: https://stripe.com
- Copy secret key to backend `.env`: `STRIPE_SECRET_KEY`

### 3. Resend (Emails) - Optional for testing
- Sign up: https://resend.com
- Copy API key to backend `.env`: `RESEND_API_KEY`

### Minimum to Test Locally
Just update these in `frontend\.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key
```

And in `backend\.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saas_db
SECRET_KEY=your-secret-key-change-in-production
```

---

## Verify Everything Works

### Test Frontend
1. Open http://localhost:3000
2. You should see the landing page
3. Click "Get Started Free"
4. Sign up with Clerk authentication

### Test Backend
1. Open http://localhost:8000/docs
2. You should see the Swagger API documentation
3. Test the health endpoint: http://localhost:8000/health

### Test Database
1. Backend will auto-create tables on first run
2. Check logs for "Database initialized" message

---

## Common Issues

### "Port already in use"
```bash
# Change ports in docker-compose.yml or stop conflicting services
```

### "Database connection error"
```bash
# Make sure PostgreSQL is running
# Check DATABASE_URL in backend .env
```

### "Clerk authentication error"
```bash
# Verify NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is correct
# Check that CLERK_SECRET_KEY is set
```

---

## Next Steps

✅ Read [SETUP.md](SETUP.md) for detailed setup instructions
✅ Review [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
✅ Customize the application for your needs
✅ Deploy to production (see deployment section)

---

## Need Help?

1. Check the logs:
   ```bash
   # Docker
   docker-compose logs -f
   
   # Backend
   # Check terminal output
   
   # Frontend
   # Check terminal output
   ```

2. Review [SETUP.md](SETUP.md) troubleshooting section

3. Verify all environment variables are set correctly

---

**You're all set! Start building your SaaS empire! 🚀**
