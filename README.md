# 🚀 SaaSForge

![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Backend CI](https://img.shields.io/github/actions/workflow/status/LEVELING2108/SaaSForge/backend-ci.yml?label=backend&logo=python)
![Frontend CI](https://img.shields.io/github/actions/workflow/status/LEVELING2108/SaaSForge/frontend-ci.yml?label=frontend&logo=next.js)
![Docker](https://img.shields.io/github/actions/workflow/status/LEVELING2108/SaaSForge/docker-publish.yml?label=docker&logo=docker)

![Stripe](https://img.shields.io/badge/Stripe-626CD6?style=flat&logo=stripe&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)

---

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS + Shadcn UI
- **Authentication:** Clerk (Client-side & Middleware)
- **Data Fetching:** Native fetch with concurrent `Promise.all` optimizations

### Backend
- **Framework:** FastAPI (Python 3.12+)
- **Database ORM:** SQLAlchemy 2.0 (Async)
- **Migrations:** Alembic (Async template)
- **Authentication:** Hybrid Clerk JWT + Custom JWT fallback
- **Payments:** Stripe (Checkout + Webhooks)
- **Emails:** Resend
- **Error Monitoring:** Sentry

### Infrastructure
- **Deployment:** Vercel (Frontend) + Railway/Any Cloud (Backend)
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions with Black/isort formatting checks

---

## ✨ Key Features

### 📊 Enhanced Dashboard (New)
- **Live Analytics:** Real-time growth trends visualized with **Recharts**.
- **Interactive Stats:** Dynamic calculation of user growth, subscriptions, and system health.
- **Activity Timeline:** A beautiful, real-time audit log of system and user events.
- **Quick Actions:** One-click access to billing, team settings, and API docs.

### 🔐 Enterprise-Grade Authentication
- **Clerk Integration:** Seamless sign-in/up with automatic identity syncing to local PostgreSQL.
- **Hybrid Bridge:** Backend verifies Clerk RS256 tokens using live JWKS fetching.
- **Strict Authorization:** Granular role-based access control (Owner, Admin, Member).

### 💳 Subscription Lifecycle (with Dev Mode)
- **Stripe Integration:** Pre-built checkout sessions and billing portal.
- **🛠️ Dev Mode Bypass:** Test PRO features instantly without a Stripe account. Simulate checkouts with a single click.
- **Webhook Engine:** Automated tier updates (`FREE`, `BASIC`, `PRO`) via secure Stripe events.

### 👥 Persistent Team Management
- **Database-Backed Teams:** Create teams, invite members, and manage roles permanently.
- **Auto-Provisioning:** Automatic team creation for new users on their first dashboard visit.

---

## 📁 Project Structure

```
SAAS_project/
├── frontend/                 # Next.js 14 application
│   ├── src/
│   │   ├── app/             # App Router (Dashboard, Auth, Landing)
│   │   ├── components/      # UI components (Shadcn + Recharts)
│   │   └── lib/             # API Client & Utilities
│
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/routes/      # Auth, Team, Dashboard, Subscriptions (with Dev Mode)
│   │   ├── core/            # Security (Clerk Bridge), Database, Config
│   │   ├── models/          # SQLAlchemy Async Models (User, Team, AuditLog)
│   │   ├── schemas/         # Pydantic V2 Type Safety
│   │   └── services/        # Activity Logging, Email, Business Logic
│   ├── migrations/          # Alembic Async Migration Scripts
│   ├── tests/               # Pytest Suite
│   └── manage_user.py      # (Local) CLI for manual user upgrades
│
├── docker-compose.yml       # Containerized Orchestration
├── README.md               # You are here
└── ENVIRONMENT.md         # Env var reference
```

---

## 🛠️ Quick Start

### 1. Prerequisites
- Node.js 18+ & Python 3.12+
- PostgreSQL instance (Local or Supabase)

### 2. Manual Setup (Recommended for Local Dev)

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your PostgreSQL credentials
uvicorn app.main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Add your Clerk API keys to .env.local
npm run dev
```

### 3. Docker Setup (Alternative)
```bash
docker-compose up -d
```

---

## 🧪 Development Mode (Bypassing Stripe)

If you don't have a Stripe account or are restricted by region (e.g., India), you can use the built-in **Dev Mode**:

1.  Leave `STRIPE_SECRET_KEY` empty or as the default in `backend/.env`.
2.  Click **"Upgrade"** on the dashboard.
3.  The backend will detect the missing key, simulate a successful payment, and upgrade your user to the **PRO** tier automatically.

---

## 🤝 Contributing
1. Fork the repo.
2. Create a feature branch.
3. Ensure formatting: `cd backend && isort . && black .`.
4. Submit a PR.

---

**Built with ❤️ by [LEVELING2108](https://github.com/LEVELING2108)**
"Empowering developers to ship faster, safer, and smarter."
