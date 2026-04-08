
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
![GitHub last commit](https://img.shields.io/github/last-commit/LEVELING2108/SaaSForge)
![GitHub repo size](https://img.shields.io/github/repo-size/LEVELING2108/SaaSForge)

![Stripe](https://img.shields.io/badge/Stripe-626CD6?style=flat&logo=stripe&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)

---

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** Shadcn UI
- **Authentication:** Clerk
- **State Management:** React Query (TanStack Query)
- **Analytics:** PostHog

### Backend
- **Framework:** FastAPI (Python)
- **Database ORM:** SQLAlchemy (Async)
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Payments:** Stripe
- **Emails:** Resend
- **Storage:** Supabase Storage
- **Error Monitoring:** Sentry

### Infrastructure
- **Deployment:** Vercel (Frontend) + Railway (Backend)
- **Container:** Docker & Docker Compose
- **CI/CD:** GitHub Actions (ready to configure)

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ User registration & login (Clerk)
- ✅ Email verification
- ✅ Password reset
- ✅ JWT token-based API authentication
- ✅ Secure session management
- ✅ Protected routes & API endpoints

### 💳 Subscription & Payments
- ✅ Stripe integration for payments
- ✅ Subscription plans (Free, Basic, Pro)
- ✅ Checkout flow with Stripe Checkout
- ✅ Customer portal for billing management
- ✅ Webhook handling for payment events
- ✅ Automatic subscription updates

### 📊 Dashboard & Analytics
- ✅ User dashboard with statistics
- ✅ Real-time data visualization
- ✅ Activity tracking
- ✅ Team member management
- ✅ Billing & subscription overview

### 📧 Email Notifications
- ✅ Welcome emails (Resend)
- ✅ Password reset emails
- ✅ Subscription confirmation emails
- ✅ Template-based email system

### 🎨 User Interface
- ✅ Beautiful landing page with pricing
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Modern UI components (Shadcn UI)
- ✅ Smooth animations & transitions

### 🛠️ Developer Experience
- ✅ Auto-generated API documentation (Swagger)
- ✅ TypeScript for type safety
- ✅ Docker for local development
- ✅ Environment-based configuration
- ✅ Comprehensive error handling
- ✅ Logging & monitoring

---

## 🔄 How It Works - User Journey

### **Scenario: New User Signs Up and Subscribes**

#### **Step 1: User Visits Website**
```
User opens: https://yourapp.com
↓
Sees landing page with:
  - Hero section
  - Features list
  - Pricing plans (Free, Basic $19, Pro $49)
  - "Get Started Free" button
```

#### **Step 2: User Creates Account**
```
User clicks "Get Started Free"
↓
Clerk handle sign-up:
  - User enters email + password
  - Clerk validates and creates account
  - Clerk sends verification email
  - User clicks verification link
↓
Clerk issues session token
↓
User redirected to: /dashboard
```

#### **Step 3: User Sees Dashboard**
```
Frontend calls: GET /api/v1/dashboard/stats
↓
Backend:
  1. Validates JWT token from request
  2. Queries database for user stats
  3. Returns JSON:
     {
       "total_users": 150,
       "new_users_this_week": 23,
       "subscription_tier": "free",
       "account_status": "active"
     }
↓
Frontend displays:
  - Welcome message
  - Stats cards
  - Quick actions
  - Recent activity
```

#### **Step 4: User Upgrades to Paid Plan**
```
User clicks "Upgrade to Basic" ($19/month)
↓
Frontend calls: POST /api/v1/subscriptions/create-checkout-session
↓
Backend:
  1. Validates user token
  2. Creates/gets Stripe customer ID
  3. Creates Stripe Checkout Session
  4. Returns: { "url": "https://checkout.stripe.com/pay/..." }
↓
User redirected to Stripe's secure payment page
↓
User enters credit card and pays $19
↓
Stripe sends webhook to backend
↓
Backend updates user subscription tier
↓
User redirected back to dashboard
↓
Confirmation email sent via Resend
```

---

## 📁 Project Structure

```
SAAS_project/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── page.tsx     # Landing page
│   │   │   ├── dashboard/   # Dashboard pages
│   │   │   ├── sign-in/     # Authentication
│   │   │   └── sign-up/     # Registration
│   │   ├── components/      # React components
│   │   │   ├── ui/          # UI components (Button, Card)
│   │   │   └── layouts/     # Page layouts
│   │   └── lib/             # Utilities and API client
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/      # API endpoints
│   │   │   │   ├── auth.py          # Authentication
│   │   │   │   ├── subscriptions.py # Stripe payments
│   │   │   │   └── dashboard.py     # Stats
│   │   │   └── dependencies.py      # Auth middleware
│   │   ├── core/            # Configuration
│   │   │   ├── config.py    # Environment variables
│   │   │   ├── database.py  # Database connection
│   │   │   └── security.py  # JWT handling
│   │   ├── models/          # Database models
│   │   ├── schemas/         # Pydantic schemas
│   │   └── services/        # Business logic
│   │       └── email_service.py
│   └── requirements.txt
│
├── docker-compose.yml       # Local development setup
├── README.md               # This file
├── QUICKSTART.md           # 5-minute setup guide
├── SETUP.md               # Detailed setup guide
├── ARCHITECTURE.md        # System architecture
└── ENVIRONMENT.md         # Environment variables reference
```

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login and get JWT token |
| GET | `/api/v1/auth/me` | Get current user info |
| PUT | `/api/v1/auth/me` | Update user profile |
| POST | `/api/v1/auth/change-password` | Change password |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/subscriptions/create-checkout-session` | Create Stripe checkout |
| POST | `/api/v1/subscriptions/create-portal-session` | Create billing portal |
| POST | `/api/v1/subscriptions/webhook` | Stripe webhook handler |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard/stats` | Get dashboard statistics |
| GET | `/api/v1/dashboard/activity` | Get recent activity |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API info |

📚 **Interactive API Docs:** http://localhost:8000/docs (when running)

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

### Backend (Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
cd backend
railway login
railway deploy
```

### Database (Supabase)
1. Create project at https://supabase.com
2. Get connection string
3. Update `DATABASE_URL` in backend environment variables

---

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes
- **[SETUP.md](SETUP.md)** - Complete setup guide (400+ lines)
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture & design
- **[ENVIRONMENT.md](ENVIRONMENT.md)** - Environment variables reference

---

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL
- Docker (optional)

### Quick Setup (Windows)
```bash
# Run setup script
setup.bat

# Start with Docker
start.bat

# Stop services
stop.bat
```

### Manual Setup
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Clerk](https://clerk.com/) - Authentication & user management
- [Stripe](https://stripe.com/) - Payment processing
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - Beautiful UI components

---

## 📞 Support

- 📖 Read the docs: [QUICKSTART.md](QUICKSTART.md) | [SETUP.md](SETUP.md)
- 🐛 Report bugs: [GitHub Issues](https://github.com/LEVELING2108/SAAS_project/issues)
- 💬 Ask questions: [GitHub Discussions](https://github.com/LEVELING2108/SAAS_project/discussions)

---

**Built with ❤️ by [LEVELING2108](https://github.com/LEVELING2108)**

⭐ **Star this repo if you find it helpful!**
