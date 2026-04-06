# 🎯 SaaS Application Architecture

## System Overview

This is a modern, full-stack SaaS application built with a decoupled architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages &    │  │   UI         │  │   State      │  │
│  │   Routes     │  │   Components │  │   Management │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                         │                               │
│              ┌──────────┴──────────┐                   │
│              │   API Client        │                   │
│              │   (Axios)           │                   │
│              └──────────┬──────────┘                   │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTP/REST
┌─────────────────────────┼───────────────────────────────┐
│                    Backend (FastAPI)                     │
│                         │                               │
│  ┌──────────────┐  ┌───┴────────────┐  ┌────────────┐ │
│  │   API        │  │   Business     │  │   Auth     │ │
│  │   Routes     │  │   Logic        │  │   & JWT    │ │
│  └──────────────┘  └────────────────┘  └────────────┘ │
│                         │                               │
│              ┌──────────┴──────────┐                   │
│              │   Database          │                   │
│              │   (SQLAlchemy)      │                   │
│              └──────────┬──────────┘                   │
└─────────────────────────┼───────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────┐
│                    External Services                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Stripe   │  │ Resend   │  │ Supabase │  │ Sentry │ │
│  │Payments  │  │ Emails   │  │ Storage  │  │ Errors │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Authentication**: Clerk
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Analytics**: PostHog

### Backend
- **Framework**: FastAPI (Python)
- **Language**: Python 3.11+
- **Database ORM**: SQLAlchemy (Async)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Passlib (bcrypt)
- **Payment Processing**: Stripe
- **Email Service**: Resend
- **Error Monitoring**: Sentry

### Infrastructure
- **Database**: PostgreSQL 15
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway
- **Database Hosting**: Supabase / Neon
- **Container**: Docker & Docker Compose
- **CI/CD**: GitHub Actions (recommended)

## Database Schema

### Users Table
```sql
id               INTEGER PRIMARY KEY
email            VARCHAR(255) UNIQUE
hashed_password  VARCHAR(255)
full_name        VARCHAR(255)
is_active        BOOLEAN
is_verified      BOOLEAN
is_superuser     BOOLEAN
subscription_tier ENUM (free, basic, pro)
stripe_customer_id VARCHAR(255)
stripe_subscription_id VARCHAR(255)
avatar_url       VARCHAR(500)
created_at       TIMESTAMP
updated_at       TIMESTAMP
last_login       TIMESTAMP
```

### Subscriptions Table
```sql
id                       INTEGER PRIMARY KEY
user_id                  INTEGER
stripe_subscription_id   VARCHAR(255) UNIQUE
stripe_price_id          VARCHAR(255)
status                   VARCHAR(50)
current_period_start     TIMESTAMP
current_period_end       TIMESTAMP
cancel_at_period_end     BOOLEAN
created_at               TIMESTAMP
updated_at               TIMESTAMP
```

### Audit Logs Table
```sql
id            INTEGER PRIMARY KEY
user_id       INTEGER
action        VARCHAR(100)
entity_type   VARCHAR(50)
entity_id     INTEGER
ip_address    VARCHAR(45)
user_agent    TEXT
created_at    TIMESTAMP
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `GET /api/v1/auth/me` - Get current user info
- `PUT /api/v1/auth/me` - Update user profile
- `POST /api/v1/auth/change-password` - Change password

### Subscriptions
- `POST /api/v1/subscriptions/create-checkout-session` - Create Stripe checkout
- `POST /api/v1/subscriptions/create-portal-session` - Create billing portal
- `POST /api/v1/subscriptions/webhook` - Stripe webhook handler

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/dashboard/activity` - Get recent activity

### Health
- `GET /health` - Health check
- `GET /` - API info

## Authentication Flow

### 1. Frontend Authentication (Clerk)
```
User → Clerk Sign In → Clerk Issues Session → Frontend Stores Token
```

### 2. Backend Authentication (JWT)
```
User → Login Endpoint → Validate Credentials → Issue JWT → Client Uses JWT
```

### 3. API Requests
```
Frontend → Attach JWT Token → Backend Validates Token → Process Request
```

## Payment Flow

### Subscription Purchase
```
1. User clicks "Upgrade" in frontend
2. Frontend calls /api/v1/subscriptions/create-checkout-session
3. Backend creates Stripe Checkout Session
4. User redirected to Stripe payment page
5. User completes payment
6. Stripe sends webhook to /api/v1/subscriptions/webhook
7. Backend updates user subscription tier
8. User redirected back to success URL
```

### Subscription Management
```
1. User clicks "Manage Billing"
2. Frontend calls /api/v1/subscriptions/create-portal-session
3. Backend creates Stripe Billing Portal session
4. User redirected to Stripe portal
5. User manages subscription/payment methods
6. User returns to application
```

## Email Notifications

### Automated Emails
- **Welcome Email**: Sent on user registration
- **Password Reset**: Sent when user requests password reset
- **Subscription Confirmation**: Sent after successful payment

## Security Features

### Frontend
- Clerk handles authentication securely
- HTTP-only cookies for session management
- CSRF protection built-in
- Content Security Policy headers

### Backend
- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration
- SQL injection prevention (SQLAlchemy ORM)
- Input validation (Pydantic)
- Rate limiting (recommended to add)

### Database
- Parameterized queries (SQLAlchemy)
- Connection pooling
- Encrypted connections (SSL)

## Deployment Architecture

```
┌─────────────────┐
│   Users/Browser │
└────────┬────────┘
         │
    ┌────▼─────┐
    │  Vercel  │ (Frontend)
    │  (CDN)   │
    └────┬─────┘
         │ API Calls
    ┌────▼─────┐
    │ Railway  │ (Backend API)
    │  or AWS  │
    └────┬─────┘
         │
    ┌────▼─────┐
    │ Supabase │ (PostgreSQL)
    │   / Neon │
    └──────────┘
```

## Environment Variables

See [SETUP.md](SETUP.md) for complete environment variable documentation.

## Development Guidelines

### Code Style
- **Frontend**: ESLint + Prettier
- **Backend**: Black + Flake8 (recommended)

### Testing
- **Frontend**: Jest + React Testing Library (recommended)
- **Backend**: Pytest (recommended)

### Git Workflow
1. Feature branches from `main`
2. Pull requests for review
3. Squash merge to keep history clean
4. Semantic commit messages

## Performance Optimization

### Frontend
- Next.js automatic code splitting
- Image optimization
- Static generation where possible
- React Query caching

### Backend
- Async database operations
- Connection pooling
- API response caching (recommended)
- Database indexing

## Monitoring & Analytics

### Error Tracking
- Sentry for both frontend and backend
- Automatic error capturing
- User context attached to errors

### Analytics
- PostHog for product analytics
- User behavior tracking
- Feature flag support

## Future Enhancements

- [ ] Add comprehensive test suite
- [ ] Implement API rate limiting
- [ ] Add real-time notifications (WebSockets)
- [ ] Implement role-based access control
- [ ] Add multi-tenancy support
- [ ] GraphQL API option
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework
- [ ] Internationalization (i18n)

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Write/update tests
5. Submit pull request

## License

MIT License
