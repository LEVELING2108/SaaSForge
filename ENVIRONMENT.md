# 📝 Environment Variables Reference

Complete reference for all environment variables used in the SaaS application.

## Backend Variables (backend/.env)

### Required Variables

#### Database
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saas_db
```
- **Format**: PostgreSQL connection string
- **Components**: `postgresql://[user]:[password]@[host]:[port]/[database]`
- **Get from**: Your PostgreSQL instance
- **Example Production**: `postgresql://postgres:MyS3cureP4ss@db.xyz.supabase.co:5432/postgres`

#### Security
```env
SECRET_KEY=your-secret-key-change-in-production
```
- **Purpose**: JWT token signing
- **Generate**: Use a random string generator
- **Production**: Use a cryptographically secure random string (64+ chars)
- **Example**: `openssl rand -hex 32`

### Optional Variables

#### Authentication
```env
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```
- **ALGORITHM**: JWT signing algorithm (default: HS256)
- **ACCESS_TOKEN_EXPIRE_MINUTES**: Token validity duration (default: 30)

#### Stripe (Payments)
```env
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_PRICE_ID_BASIC=price_your_basic_price_id
STRIPE_PRICE_ID_PRO=price_your_pro_price_id
```
- **STRIPE_SECRET_KEY**: From Stripe Dashboard > Developers > API keys
- **STRIPE_WEBHOOK_SECRET**: From Stripe CLI or Dashboard webhook configuration
- **STRIPE_PRICE_ID_***: Create in Stripe Dashboard > Products
- **Get from**: https://dashboard.stripe.com

#### Email (Resend)
```env
RESEND_API_KEY=re_your_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```
- **RESEND_API_KEY**: From Resend Dashboard
- **RESEND_FROM_EMAIL**: Verified domain email address
- **Get from**: https://resend.com

#### Supabase (Storage)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
SUPABASE_BUCKET=user-uploads
```
- **SUPABASE_URL**: From Project Settings > API
- **SUPABASE_KEY**: Project API key (service role for backend)
- **SUPABASE_BUCKET**: Storage bucket name (create in Storage tab)
- **Get from**: https://app.supabase.com

#### Error Monitoring (Sentry)
```env
SENTRY_DSN=https://your-sentry-dsn
```
- **Purpose**: Automatic error tracking and reporting
- **Get from**: https://sentry.io > Project Settings > Client Keys (DSN)

#### CORS
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```
- **Purpose**: Allowed origins for cross-origin requests
- **Format**: Comma-separated list of URLs
- **Production**: Your actual domain(s)

#### API Configuration
```env
API_V1_PREFIX=/api/v1
```
- **Purpose**: URL prefix for all API routes
- **Default**: `/api/v1`

---

## Frontend Variables (frontend/.env.local)

### Required Variables

#### Clerk (Authentication)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key
```
- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: Public key for client-side
- **CLERK_SECRET_KEY**: Secret key for server-side (middleware)
- **Get from**: https://dashboard.clerk.com > API Keys
- **Note**: `NEXT_PUBLIC_` prefix makes it available in browser

### Optional Variables

#### Backend API
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
- **Purpose**: Backend API base URL
- **Development**: http://localhost:8000
- **Production**: Your deployed backend URL
- **Default**: http://localhost:8000

#### Stripe (Payments)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```
- **Purpose**: Client-side Stripe integration
- **Get from**: https://dashboard.stripe.com > Developers > API keys
- **Note**: Use publishable key (not secret key)

#### Analytics (PostHog)
```env
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
```
- **Purpose**: Product analytics and feature flags
- **Get from**: https://app.posthog.com > Project Settings
- **Optional**: Remove if not using PostHog

---

## Variable Priority

### Must Have (App Won't Start Without)
- ✅ `DATABASE_URL` (backend)
- ✅ `SECRET_KEY` (backend)
- ✅ `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (frontend)
- ✅ `CLERK_SECRET_KEY` (frontend)

### Should Have (App Starts But Features Break)
- ⚠️ `STRIPE_SECRET_KEY` - Payments won't work
- ⚠️ `RESEND_API_KEY` - Emails won't send
- ⚠️ `SUPABASE_URL` - Storage won't work

### Nice to Have (Optional Features)
- 🔵 `SENTRY_DSN` - Error monitoring
- 🔵 `NEXT_PUBLIC_POSTHOG_KEY` - Analytics

---

## Production Checklist

### Backend Production Variables
- [ ] `DATABASE_URL` - Point to production database
- [ ] `SECRET_KEY` - Generate new secure key
- [ ] `STRIPE_SECRET_KEY` - Use live key (not test)
- [ ] `STRIPE_WEBHOOK_SECRET` - Production webhook secret
- [ ] `RESEND_API_KEY` - Production email key
- [ ] `RESEND_FROM_EMAIL` - Verified production domain
- [ ] `SUPABASE_URL` - Production Supabase URL
- [ ] `SENTRY_DSN` - Production Sentry DSN
- [ ] `CORS_ORIGINS` - Your production domain(s)

### Frontend Production Variables
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Production key
- [ ] `CLERK_SECRET_KEY` - Production secret
- [ ] `NEXT_PUBLIC_API_URL` - Production backend URL
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Live Stripe key
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` - Production analytics

---

## How to Set Variables

### Local Development
1. Copy `.env.example` to `.env` (backend) or `.env.local` (frontend)
2. Edit the file with your values
3. Restart the application

### Docker
1. Edit `docker-compose.yml` environment section
2. Or create `.env` file in project root
3. Run `docker-compose up -d`

### Vercel (Frontend)
1. Go to Project Settings > Environment Variables
2. Add each variable
3. Deploy

### Railway (Backend)
1. Go to Variables tab
2. Add each variable
3. Deploy

---

## Security Best Practices

### DO:
✅ Use different keys for development/staging/production
✅ Generate secure random strings for secrets
✅ Never commit `.env` files to Git (they're in `.gitignore`)
✅ Use environment-specific keys for each deployment
✅ Rotate keys regularly

### DON'T:
❌ Commit `.env` files to version control
❌ Share secret keys in plain text
❌ Use production keys in development
❌ Hardcode keys in source code
❌ Use weak/predictable secret keys

---

## Generate Secure Keys

### SECRET_KEY (Backend)
```bash
# macOS/Linux
openssl rand -hex 32

# Python
python -c "import secrets; print(secrets.token_hex(32))"

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### JWT Best Practices
- Use 256-bit (32 byte) keys minimum
- Store securely (password manager, secrets manager)
- Different key per environment
- Rotate every 90 days

---

## Troubleshooting

### "Missing environment variable" error
- Check the variable is in your `.env` file
- Restart the application after adding
- Check for typos in variable name

### "Invalid DATABASE_URL" error
- Verify PostgreSQL is running
- Check connection string format
- Ensure database exists
- Check credentials

### "Clerk not working" error
- Verify both publishable and secret keys are set
- Check keys match your environment (test vs production)
- Ensure redirect URLs are configured in Clerk dashboard

### "Stripe payments fail" error
- Check `STRIPE_SECRET_KEY` is set (backend)
- Verify webhook is configured and working
- Ensure price IDs exist in Stripe

---

## Quick Reference

| Variable | Service | Required | Where to Get |
|----------|---------|----------|--------------|
| DATABASE_URL | PostgreSQL | ✅ | Your DB host |
| SECRET_KEY | JWT Auth | ✅ | Generate |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Clerk | ✅ | clerk.com |
| CLERK_SECRET_KEY | Clerk | ✅ | clerk.com |
| STRIPE_SECRET_KEY | Stripe | ⚠️ | stripe.com |
| RESEND_API_KEY | Resend | ⚠️ | resend.com |
| SUPABASE_URL | Supabase | ⚠️ | supabase.com |
| SENTRY_DSN | Sentry | 🔵 | sentry.io |

✅ Required | ⚠️ Features break without it | 🔵 Optional

---

For detailed setup instructions, see [SETUP.md](SETUP.md)
