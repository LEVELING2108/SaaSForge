# 🚀 SaaSForge - Quick Start Guide

Get your SaaS application running in 5 minutes!

---

## ⚡ Option 1: Docker (Easiest - Recommended)

### Prerequisites
- Docker installed ([Get Docker](https://www.docker.com/get-started))

### Steps

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/LEVELING2108/SAAS_project.git
   cd SAAS_project
   ```

2. **Run the services**:
   ```bash
   docker-compose up -d
   ```

3. **Wait** 1-2 minutes for services to start

4. **Open** your browser:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

5. **Configure** environment variables (see below)

6. **Done!** 🎉

---

## 💻 Option 2: Manual Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL

### Steps

#### 1. Setup Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

#### 2. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
```

#### 3. Start PostgreSQL
```bash
# Option A: Using Docker
docker run --name saas-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=saas_db -p 5432:5432 -d postgres:15-alpine

# Option B: Using local PostgreSQL
# Make sure PostgreSQL is running
```

#### 4. Start Backend
```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
uvicorn app.main:app --reload
```

#### 5. Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

#### 6. Open Browser
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

## 🔑 Required Configuration

Before the app works fully, you need to set up:

### 1. Clerk (Authentication) - REQUIRED
- Sign up: https://clerk.com
- Create app
- Copy keys to:
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

## ✅ Verify Everything Works

### Test Frontend
1. Open http://localhost:3000
2. You should see the SaaSForge landing page
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

## 🔧 Common Issues

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

### "Module not found"
```bash
# Backend: Run pip install -r requirements.txt
# Frontend: Run npm install
```

---

## 📚 Next Steps

✅ Read [SETUP.md](SETUP.md) for detailed setup instructions  
✅ Review [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system  
✅ Review [ENVIRONMENT.md](ENVIRONMENT.md) for all configuration options  
✅ Customize the application for your needs  
✅ Deploy to production (see deployment section)  

---

## 🆘 Need Help?

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

4. Open an issue: https://github.com/LEVELING2108/SAAS_project/issues

---

**You're all set! Start building your SaaS empire with SaaSForge! 🚀**
