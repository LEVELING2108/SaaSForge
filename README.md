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

### 🔐 Enterprise-Grade Authentication
- **Clerk Integration:** Seamless sign-in/up with automatic identity syncing to local PostgreSQL.
- **Hybrid Bridge:** Backend verifies Clerk RS256 tokens using live JWKS fetching.
- **Strict Authorization:** Granular role-based access control (Owner, Admin, Member).

### 💳 Subscription Lifecycle
- **Stripe Integration:** Pre-built checkout sessions and billing portal.
- **Webhook Engine:** Automated tier updates (`FREE`, `BASIC`, `PRO`) via secure Stripe events.
- **Pricing Abstraction:** Easily configurable pricing logic based on transaction amounts.

### 👥 Persistent Team Management
- **Database-Backed Teams:** Create teams, invite members, and manage roles permanently.
- **Auto-Provisioning:** Automatic team creation for new users on their first dashboard visit.
- **Safety First:** Protected deletion logic preventing "orphaned" teams.

### 📊 Live Activity Tracking
- **Unified Audit Logs:** Real-time logging of logins, profile changes, and team events.
- **Dashboard Feed:** High-performance concurrent fetching of user stats and recent actions.
- **Optimized Queries:** Indexed database columns for lightning-fast activity retrieval.

### 🏗️ Production Infrastructure
- **Alembic Migrations:** Version-controlled database schema evolutions.
- **CI/CD Ready:** Automated linting, formatting, and unit tests.
- **Async Architecture:** Fully non-blocking backend for maximum scalability.

---

## 📁 Project Structure

```
SAAS_project/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router (Dashboard, Auth, Landing)
│   │   ├── components/      # UI components (Shadcn)
│   │   └── lib/             # API Client & Utilities
│
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/routes/      # Auth, Team, Dashboard, Subscriptions
│   │   ├── core/            # Security (Clerk Bridge), Database, Config
│   │   ├── models/          # SQLAlchemy Async Models (User, Team, AuditLog)
│   │   ├── schemas/         # Pydantic V2 Type Safety
│   │   └── services/        # Activity Logging, Email, Business Logic
│   ├── migrations/          # Alembic Async Migration Scripts
│   ├── tests/               # Pytest Suite
│   └── requirements.txt     # Python Dependencies
│
├── docker-compose.yml       # Orchestration
├── README.md               # You are here
└── ENVIRONMENT.md         # Env var reference
```

---

## 🌐 Core API Endpoints

### 🔐 Authentication & Identity
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/auth/me` | Get synced profile |
| PUT | `/api/v1/auth/me` | Update profile + Log activity |

### 👥 Team Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/team/members` | List team with roles |
| POST | `/api/v1/team/invite` | Invite via email |
| DELETE | `/api/v1/team/members/{id}` | Secure removal/Leave team |

### 📈 Dashboard & Activity
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard/stats` | Live system statistics |
| GET | `/api/v1/dashboard/activity` | Recent user audit logs |

---

## 🛠️ Quick Start

### 1. Prerequisites
- Node.js 18+ & Python 3.12+
- PostgreSQL instance

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
# Run migrations
alembic upgrade head
# Start server
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🤝 Contributing
1. Fork the repo.
2. Create a feature branch.
3. Ensure formatting: `cd backend && isort . && black .`.
4. Submit a PR.

---

**Built with ❤️ by [LEVELING2108](https://github.com/LEVELING2108)**
"Empowering developers to ship faster, safer, and smarter."
