# 📐 Project Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
├─────────────────────────────────────────────────────────────────┤
│  http://localhost:3000                                          │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Dashboard│  │Evaluations│  │ Settings │  │  Login   │      │
│  │   Page   │  │   Page    │  │   Page   │  │   Page   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 14 APP                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   APP ROUTER                            │   │
│  │                                                         │   │
│  │  /dashboard   → Dashboard Component → Server Data      │   │
│  │  /evaluations → Table Component → Server Data + Pagination│
│  │  /settings    → Settings Form → Update User Settings   │   │
│  │  /login       → Auth Form → Supabase Auth              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API ROUTES                           │   │
│  │                                                         │   │
│  │  POST /api/evals/ingest → Validate → Insert to DB      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   MIDDLEWARE                            │   │
│  │                                                         │   │
│  │  • Auth Cookie Management                               │   │
│  │  • Session Refresh                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ Supabase Client
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   AUTHENTICATION                         │  │
│  │  • User Sign Up / Sign In                                │  │
│  │  • Email Confirmation                                    │  │
│  │  • Session Management                                    │  │
│  │  • JWT Tokens                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   POSTGRESQL DATABASE                    │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │ evaluation_settings                             │    │  │
│  │  │ ─────────────────────────────────────────────── │    │  │
│  │  │ • id (uuid, PK)                                 │    │  │
│  │  │ • user_id (uuid, FK → auth.users)              │    │  │
│  │  │ • run_policy (text)                             │    │  │
│  │  │ • sample_rate_pct (integer)                     │    │  │
│  │  │ • obfuscate_pii (boolean)                       │    │  │
│  │  │ • max_eval_per_day (integer)                    │    │  │
│  │  │ • updated_at (timestamp)                        │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │ evaluations                                     │    │  │
│  │  │ ─────────────────────────────────────────────── │    │  │
│  │  │ • id (uuid, PK)                                 │    │  │
│  │  │ • user_id (uuid, FK → auth.users)              │    │  │
│  │  │ • interaction_id (text)                         │    │  │
│  │  │ • prompt (text)                                 │    │  │
│  │  │ • response (text)                               │    │  │
│  │  │ • score (numeric)                               │    │  │
│  │  │ • latency_ms (integer)                          │    │  │
│  │  │ • flags (jsonb)                                 │    │  │
│  │  │ • pii_tokens_redacted (integer)                 │    │  │
│  │  │ • created_at (timestamp)                        │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  │                                                          │  │
│  │  Indexes:                                                │  │
│  │  • idx_evaluations_user_created (user_id, created_at)   │  │
│  │  • idx_evaluations_user_id (user_id)                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              ROW LEVEL SECURITY (RLS)                    │  │
│  │  • Users can only see their own data                     │  │
│  │  • Policy: (auth.uid() = user_id)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Registration Flow
```
User → /login → Sign Up Form → Supabase Auth
                                      ↓
                              Email Confirmation
                                      ↓
                              User Account Created
                                      ↓
                              Redirect to Dashboard
```

### 2. Authentication Flow
```
User → /login → Sign In Form → Supabase Auth
                                      ↓
                              Validate Credentials
                                      ↓
                              Create Session (JWT)
                                      ↓
                              Set Cookie
                                      ↓
                              Redirect to Dashboard
```

### 3. Dashboard Data Flow
```
User → /dashboard → Server Component
                          ↓
                    Fetch User Data
                          ↓
                    Query Evaluations
                    (last 30 days)
                          ↓
                    Calculate KPIs:
                    • Total count
                    • Avg latency
                    • Success rate
                    • Avg score
                          ↓
                    Generate Chart Data
                    (7-day & 30-day)
                          ↓
                    Render Dashboard
```

### 4. Evaluations List Flow
```
User → /evaluations?page=1 → Server Component
                                   ↓
                             Get page number
                                   ↓
                             Calculate offset
                             (page-1) * 50
                                   ↓
                             Query Database
                             LIMIT 50 OFFSET x
                                   ↓
                             Get total count
                                   ↓
                             Calculate pages
                                   ↓
                             Render Table
                             + Pagination
```

### 5. Settings Update Flow
```
User → /settings → Load Current Settings
                          ↓
                    Edit Form Values
                          ↓
                    Submit Form
                          ↓
                    Client Component
                          ↓
                    Supabase.update()
                          ↓
                    Update DB Row
                          ↓
                    Success Message
                          ↓
                    Refresh Page
```

### 6. API Ingestion Flow
```
External System → POST /api/evals/ingest
                          ↓
                    Check Authentication
                    (JWT Token)
                          ↓
                    Validate Request Body
                    • interaction_id
                    • prompt
                    • response
                    • score (0-1)
                    • latency_ms
                          ↓
                    Insert into Database
                    (evaluations table)
                          ↓
                    Return 201 Created
                    { success: true, data: {...} }
```

## Component Architecture

```
app/
├── layout.tsx (Root Layout)
│   ├── globals.css (Tailwind Styles)
│   └── <children> (Page Content)
│
├── page.tsx (Home - redirects to /dashboard)
│
├── login/
│   └── page.tsx (Client Component)
│       └── Supabase Auth UI
│
├── dashboard/
│   ├── page.tsx (Server Component)
│   │   ├── Fetch user data
│   │   ├── Query evaluations
│   │   └── Pass to DashboardContent
│   │
│   └── dashboard-content.tsx (Client Component)
│       ├── Calculate KPIs
│       ├── Generate chart data
│       └── Render with Recharts
│
├── evaluations/
│   ├── page.tsx (Server Component)
│   │   ├── Get page param
│   │   ├── Query with pagination
│   │   └── Pass to EvaluationsTable
│   │
│   ├── evaluations-table.tsx (Client Component)
│   │   ├── Render table
│   │   └── Pagination controls
│   │
│   └── [id]/
│       ├── page.tsx (Server Component)
│       │   ├── Fetch evaluation
│       │   ├── Fetch settings (for PII)
│       │   └── Pass to EvaluationDetail
│       │
│       └── evaluation-detail.tsx (Client Component)
│           ├── Apply PII obfuscation
│           └── Render details
│
├── settings/
│   ├── page.tsx (Server Component)
│   │   ├── Fetch current settings
│   │   └── Pass to SettingsForm
│   │
│   └── settings-form.tsx (Client Component)
│       ├── Form state management
│       ├── Handle submit
│       └── Update database
│
└── api/
    └── evals/
        └── ingest/
            └── route.ts (API Route Handler)
                ├── Authenticate user
                ├── Validate body
                ├── Insert to DB
                └── Return response
```

## Security Architecture

```
┌──────────────────────────────────────────────────┐
│             SECURITY LAYERS                      │
├──────────────────────────────────────────────────┤
│                                                  │
│  Layer 1: Environment Variables                  │
│  ────────────────────────────────────────────    │
│  • .env.local (not committed)                    │
│  • Service role key server-side only             │
│  • Public keys for client                        │
│                                                  │
│  Layer 2: Supabase Authentication                │
│  ────────────────────────────────────────────    │
│  • JWT tokens                                    │
│  • Email confirmation                            │
│  • Secure password hashing                       │
│  • Session management                            │
│                                                  │
│  Layer 3: Middleware                             │
│  ────────────────────────────────────────────    │
│  • Cookie validation                             │
│  • Session refresh                               │
│  • Auth state management                         │
│                                                  │
│  Layer 4: Row Level Security (RLS)               │
│  ────────────────────────────────────────────    │
│  • Database-level isolation                      │
│  • Policy: auth.uid() = user_id                  │
│  • Enforced on all queries                       │
│                                                  │
│  Layer 5: API Validation                         │
│  ────────────────────────────────────────────    │
│  • Request body validation                       │
│  • Type checking                                 │
│  • Range validation (score 0-1)                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────┐
│           FRONTEND                          │
├─────────────────────────────────────────────┤
│ • Next.js 14.2.33 (React Framework)         │
│ • React 18.2 (UI Library)                   │
│ • TypeScript (Type Safety)                  │
│ • Tailwind CSS (Styling)                    │
│ • Shadcn/UI (Component Library)             │
│ • Recharts (Data Visualization)             │
│ • Lucide React (Icons)                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│           BACKEND                           │
├─────────────────────────────────────────────┤
│ • Next.js API Routes (REST API)             │
│ • Supabase Client (Database & Auth)         │
│ • Server Components (SSR)                   │
│ • Middleware (Auth Management)              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│           DATABASE                          │
├─────────────────────────────────────────────┤
│ • Supabase (PostgreSQL)                     │
│ • Row Level Security (RLS)                  │
│ • Real-time subscriptions                   │
│ • Automatic backups                         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│           AUTHENTICATION                    │
├─────────────────────────────────────────────┤
│ • Supabase Auth                             │
│ • JWT Tokens                                │
│ • Email/Password                            │
│ • Session Management                        │
└─────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌───────────────────────────────────────────────────┐
│                  VERCEL                           │
├───────────────────────────────────────────────────┤
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │         Edge Network (CDN)                  │ │
│  │  • Static assets cached                     │ │
│  │  • Images optimized                         │ │
│  │  • Global distribution                      │ │
│  └─────────────────────────────────────────────┘ │
│                      ↓                            │
│  ┌─────────────────────────────────────────────┐ │
│  │         Next.js App                         │ │
│  │  • Server-side rendering                    │ │
│  │  • API routes                               │ │
│  │  • Client components                        │ │
│  └─────────────────────────────────────────────┘ │
│                      ↓                            │
└───────────────────────────────────────────────────┘
                       ↓
┌───────────────────────────────────────────────────┐
│                 SUPABASE                          │
├───────────────────────────────────────────────────┤
│  • PostgreSQL Database                            │
│  • Authentication Service                         │
│  • Real-time Engine                               │
│  • Storage (if needed)                            │
└───────────────────────────────────────────────────┘
```

---

**This architecture provides:**
- ✅ Scalability (serverless functions)
- ✅ Security (RLS + JWT + environment vars)
- ✅ Performance (edge caching + indexes)
- ✅ Reliability (managed services)
- ✅ Developer Experience (TypeScript + hot reload)
