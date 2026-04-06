# 🚀 SaaS Application - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Environment Variables](#environment-variables)
6. [Database Setup](#database-setup)
7. [Third-Party Services](#third-party-services)
8. [Running with Docker](#running-with-docker)
9. [Development Workflow](#development-workflow)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.11 or higher) - [Download](https://www.python.org/)
- **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/)
- **Git** - [Download](https://git-scm.com/)
- **Docker** (optional, for containerized development) - [Download](https://www.docker.com/)

---

## Quick Start

For the impatient developer who wants to get running ASAP:

```bash
# Clone the repository (if not already done)
cd SAAS_PROJECT

# Start with Docker (easiest)
docker-compose up -d

# Or run locally
# Terminal 1 - Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Create virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and fill in your configuration (see [Environment Variables](#environment-variables))

### 5. Initialize database
```bash
# The database tables will be created automatically when the app starts
# Make sure PostgreSQL is running and DATABASE_URL is correct in .env
```

### 6. Run the backend
```bash
uvicorn app.main:app --reload --port 8000
```

The server will start with auto-reload enabled. API documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your configuration (see [Environment Variables](#environment-variables))

### 4. Run the frontend
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saas_db

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_PRICE_ID_BASIC=price_your_basic_price_id
STRIPE_PRICE_ID_PRO=price_your_pro_price_id

# Email (Resend)
RESEND_API_KEY=re_your_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
SUPABASE_BUCKET=user-uploads

# Sentry (Error Monitoring)
SENTRY_DSN=https://your-sentry-dsn

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# API
API_V1_PREFIX=/api/v1
```

### Frontend (.env.local)

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Analytics (PostHog)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
```

---

## Database Setup

### Option 1: Using PostgreSQL Locally

1. Install PostgreSQL
2. Create database:
```bash
psql -U postgres
CREATE DATABASE saas_db;
\q
```

3. Update `DATABASE_URL` in backend `.env`

### Option 2: Using Supabase (Recommended for Production)

1. Create account at https://supabase.com
2. Create new project
3. Get your database URL from Settings > Database
4. Update `DATABASE_URL` in backend `.env`:
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres
```

### Option 3: Using Docker

```bash
docker run --name saas-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=saas_db \
  -p 5432:5432 \
  -d postgres:15-alpine
```

---

## Third-Party Services

### 1. Clerk (Authentication)

1. Sign up at https://clerk.com
2. Create new application
3. Go to API Keys
4. Copy publishable and secret keys
5. Configure redirect URLs:
   - http://localhost:3000/sign-in
   - http://localhost:3000/sign-up

### 2. Stripe (Payments)

1. Sign up at https://stripe.com
2. Go to Developers > API keys
3. Copy secret key
4. Create products and prices:
   ```bash
   # Use Stripe CLI or Dashboard to create products
   # Basic Plan: $19/month
   # Pro Plan: $49/month
   ```
5. Set up webhook:
   ```bash
   # Local development
   stripe listen --forward-to localhost:8000/api/v1/subscriptions/webhook
   ```

### 3. Resend (Email)

1. Sign up at https://resend.com
2. Get API key from Dashboard
3. Verify your domain (for production)
4. Update `RESEND_API_KEY` and `RESEND_FROM_EMAIL`

### 4. Supabase (Database & Storage)

1. Sign up at https://supabase.com
2. Create new project
3. Get URL and keys from Settings
4. Create storage bucket for user uploads

### 5. PostHog (Analytics)

1. Sign up at https://posthog.com
2. Get project API key
3. Add to frontend `.env.local`

---

## Running with Docker

### Start all services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Backend on port 8000
- Frontend on port 3000

### View logs

```bash
docker-compose logs -f
```

### Stop services

```bash
docker-compose down
```

### Rebuild after changes

```bash
docker-compose up -d --build
```

---

## Development Workflow

### Backend Development

1. Make changes to backend code
2. The server auto-reloads with uvicorn
3. Test API at http://localhost:8000/docs
4. Run tests:
```bash
pytest
```

### Frontend Development

1. Make changes to frontend code
2. Next.js hot reloads automatically
3. View at http://localhost:3000
4. Run linter:
```bash
npm run lint
```

### Database Migrations

When you change models, the tables are recreated on startup. For production migrations:

```bash
# Generate migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head
```

---

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy!

```bash
# Or use Vercel CLI
vercel --prod
```

### Backend (Railway)

1. Push code to GitHub
2. Connect repository to Railway
3. Set environment variables
4. Deploy!

```bash
# Or use Railway CLI
railway login
railway deploy
```

### Database (Supabase/Neon)

For production, use managed PostgreSQL:
- **Supabase**: https://supabase.com
- **Neon**: https://neon.tech
- **AWS RDS**: https://aws.amazon.com/rds

---

## Troubleshooting

### Backend Issues

**Problem**: Database connection error
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check DATABASE_URL in .env
# Ensure database exists
```

**Problem**: Module not found
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**Problem**: npm install fails
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Clerk authentication errors
```bash
# Check NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is correct
# Ensure CLERK_SECRET_KEY is set
# Verify redirect URLs in Clerk dashboard
```

### Docker Issues

**Problem**: Port already in use
```bash
# Change ports in docker-compose.yml
# Or stop conflicting services
```

**Problem**: Container won't start
```bash
# View logs
docker-compose logs [service-name]

# Rebuild
docker-compose up -d --build
```

---

## Next Steps

✅ Set up CI/CD pipeline with GitHub Actions
✅ Add comprehensive tests
✅ Configure monitoring and alerting
✅ Set up staging environment
✅ Implement rate limiting
✅ Add API documentation
✅ Configure backup strategy

---

## Support

For issues and questions:
- Check the troubleshooting section above
- Review API docs at http://localhost:8000/docs
- Check backend and frontend logs

---

## License

MIT License - feel free to use this for your projects!
