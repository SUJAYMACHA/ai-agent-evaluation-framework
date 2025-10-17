# 🚀 Quick Start Guide

Welcome to the AI Agent Evaluation Framework! This guide will get you up and running in minutes.

## 📦 What You've Got

A complete, production-ready web application with:
- ✅ User authentication
- ✅ Interactive dashboard with charts
- ✅ Evaluation management (20,000+ records supported)
- ✅ Settings configuration
- ✅ REST API for data ingestion
- ✅ Beautiful UI with Tailwind CSS
- ✅ Database with Row Level Security

## 🎯 30-Second Overview

```powershell
# 1. Install dependencies
npm install

# 2. Set up environment variables (see below)
# Create .env.local with your Supabase credentials

# 3. Run the app
npm run dev

# 4. Open http://localhost:3000
```

## ⚡ Quick Setup (5 Minutes)

### Step 1: Install Dependencies (1 min)
```powershell
npm install
```

### Step 2: Set Up Supabase (2 min)

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Go to SQL Editor → Run the SQL from `supabase/schema.sql`
3. Go to Settings → API → Copy your credentials

### Step 3: Configure Environment (1 min)

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-key-here
```

### Step 4: Run the App (1 min)
```powershell
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and create your account!

## 🎨 What You Can Do

### 1. Dashboard (`/dashboard`)
View real-time metrics:
- Total evaluations (last 30 days)
- Average latency
- Success rate
- Average score
- 7-day and 30-day trend charts

### 2. Evaluations (`/evaluations`)
- Browse all evaluation records
- Paginated view (50 per page)
- Click any row to see details
- Filter by date, score, flags

### 3. Settings (`/settings`)
Configure how evaluations are processed:
- Run policy (always or sampled)
- Sample rate (0-100%)
- PII obfuscation (on/off)
- Daily evaluation limit

### 4. API Integration
Send evaluation data programmatically:

```javascript
fetch('/api/evals/ingest', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    interaction_id: 'unique-id',
    prompt: 'User input',
    response: 'AI response',
    score: 0.95,
    latency_ms: 250,
    flags: [],
    pii_tokens_redacted: 0
  })
});
```

## 🧪 Testing with Sample Data

Want to see the app with data? Run the seed script:

```powershell
npm run seed
```

This creates:
- 1 test user (test@example.com / TestPassword123!)
- 20,000 sample evaluation records

Login with the test account to see populated dashboards!

## 📁 Project Structure

```
ai-agent-evaluation-framework/
├── app/
│   ├── api/evals/ingest/     # API endpoint
│   ├── dashboard/            # Main dashboard
│   ├── evaluations/          # List & detail views
│   ├── login/                # Auth page
│   └── settings/             # Settings page
├── components/
│   ├── ui/                   # Shadcn components
│   └── navigation.tsx        # Nav bar
├── lib/
│   ├── supabase/             # DB clients
│   └── utils.ts              # Helper functions
├── scripts/
│   └── seed.js               # Database seeder
└── supabase/
    └── schema.sql            # Database schema
```

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (Supabase keys) |
| `supabase/schema.sql` | Database tables and RLS policies |
| `app/api/evals/ingest/route.ts` | API endpoint for data ingestion |
| `scripts/seed.js` | Generate 20k sample records |
| `components/navigation.tsx` | App navigation bar |

## 🎓 Next Steps

### For Development
1. ✅ Follow SETUP.md for detailed setup instructions
2. ✅ Read API.md to understand the API
3. ✅ Customize the dashboard metrics
4. ✅ Add your own evaluation flags
5. ✅ Integrate with your AI agent

### For Production
1. ✅ Read DEPLOYMENT.md
2. ✅ Deploy to Vercel (recommended)
3. ✅ Configure custom domain
4. ✅ Set up monitoring
5. ✅ Enable backups

## 💡 Common Tasks

### Add a New Page
```typescript
// app/my-page/page.tsx
export default function MyPage() {
  return <div>My content</div>
}
```

### Add a New API Endpoint
```typescript
// app/api/my-endpoint/route.ts
export async function GET() {
  return Response.json({ message: 'Hello' })
}
```

### Modify Dashboard Metrics
Edit `app/dashboard/dashboard-content.tsx` - the KPIs are calculated there.

### Change Color Scheme
Edit `app/globals.css` - modify the CSS variables under `:root`.

### Add a Database Column
1. Add SQL migration to Supabase SQL Editor
2. Update TypeScript types
3. Update forms/displays

## 🐛 Troubleshooting

### "Cannot find module" errors
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### Database connection fails
- Check `.env.local` has correct credentials
- Verify SQL schema was executed
- Check Supabase project is active

### Login doesn't work
- Check environment variables
- Verify email confirmation (check spam)
- Clear browser cookies

### Port 3000 in use
```powershell
npm run dev -- -p 3001
```

## 📚 Documentation

- **SETUP.md** - Detailed setup instructions
- **DEPLOYMENT.md** - Production deployment guide
- **API.md** - Complete API reference
- **README.md** - Feature overview

## 🆘 Need Help?

1. Check the documentation files
2. Review Supabase docs: [supabase.com/docs](https://supabase.com/docs)
3. Check Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
4. Open an issue on GitHub

## 🎉 You're Ready!

The framework is set up and ready to use. Start by:
1. Creating your account
2. Configuring settings
3. Ingesting evaluation data
4. Monitoring your AI agent's performance

Happy evaluating! 🚀

---

**Built with:** Next.js 14 • Supabase • Tailwind CSS • Shadcn/UI • Recharts  
**Author:** Sujay  
**License:** MIT
