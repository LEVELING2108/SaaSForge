# SaaS Application

A modern, full-stack SaaS application built with Next.js and FastAPI.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS
- **UI Components:** Shadcn UI
- **Authentication:** Clerk
- **Analytics:** PostHog

### Backend
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Emails:** Resend
- **Storage:** Supabase Storage

### Infrastructure
- **Deployment:** Vercel (Frontend) + Railway (Backend)
- **Monitoring:** Sentry
- **Container:** Docker & Docker Compose

## 📁 Project Structure

```
SAAS_PROJECT/
├── frontend/                 # Next.js application
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and configs
│   └── public/              # Static assets
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core config
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   └── tests/              # Test files
├── docker-compose.yml       # Local development
└── README.md
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL
- Docker (optional)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Fill in your environment variables
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Fill in your environment variables
npm run dev
```

### Docker Setup

```bash
docker-compose up -d
```

## 🔑 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/saas_db
SECRET_KEY=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 📝 Features

- ✅ User Authentication
- ✅ Subscription Management (Stripe)
- ✅ Dashboard & Analytics
- ✅ User Profiles
- ✅ Email Notifications
- ✅ Admin Panel
- ✅ API Rate Limiting
- ✅ Error Monitoring

## 🚀 Deployment

### Frontend (Vercel)
```bash
vercel deploy
```

### Backend (Railway)
```bash
railway login
railway deploy
```

## 📄 License

MIT
