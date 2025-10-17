# AI Agent Evaluation Framework

A comprehensive multi-tenant web application for evaluating and monitoring AI agent performance built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- 🔐 **Authentication**: Secure user authentication with Supabase Auth
- 📊 **Dashboard**: Real-time KPIs and trend charts (7-day and 30-day views)
- 📝 **Evaluation Management**: View and manage up to 20,000+ evaluation records with pagination
- ⚙️ **Settings**: Configure evaluation policies, sampling rates, and PII obfuscation
- 🔒 **Row Level Security**: User data isolation with Supabase RLS
- 📈 **Analytics**: Track latency, success rates, scores, and more
- 🎨 **Modern UI**: Beautiful interface with Shadcn/UI components and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS + Shadcn/UI
- **Charts**: Recharts
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ 
- A Supabase account and project
- npm or yarn package manager

## Getting Started

### 1. Clone the repository

```bash
cd ai-agent-evaluation-framework
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Go to SQL Editor and run the schema from `supabase/schema.sql`

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Seed the database (Optional)

To populate your database with 20,000 sample evaluation records:

```bash
npm run seed
```

This will create a test user with credentials:
- **Email**: test@example.com
- **Password**: TestPassword123!

## Project Structure

```
ai-agent-evaluation-framework/
├── app/
│   ├── api/
│   │   └── evals/
│   │       └── ingest/          # API endpoint for ingesting evaluations
│   ├── dashboard/               # Dashboard with KPIs and charts
│   ├── evaluations/             # Evaluations list and detail pages
│   │   └── [id]/               # Individual evaluation detail page
│   ├── login/                   # Authentication page
│   ├── settings/                # User settings page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page (redirects to dashboard)
├── components/
│   ├── ui/                      # Shadcn/UI components
│   └── navigation.tsx           # Navigation component
├── lib/
│   ├── supabase/                # Supabase client utilities
│   └── utils.ts                 # Helper functions
├── scripts/
│   └── seed.js                  # Database seeding script
├── supabase/
│   └── schema.sql               # Database schema and RLS policies
└── middleware.ts                # Auth middleware
```

## Database Schema

### Tables

**evaluation_settings**
- User-specific evaluation configuration
- Run policies, sampling rates, PII obfuscation settings

**evaluations**
- Individual evaluation records
- Stores prompts, responses, scores, latency, flags, etc.

See `supabase/schema.sql` for complete schema details and RLS policies.

## API Endpoints

### POST /api/evals/ingest

Ingest a new evaluation record.

**Request Body:**
```json
{
  "interaction_id": "string",
  "prompt": "string",
  "response": "string",
  "score": 0.95,
  "latency_ms": 1234,
  "flags": ["optional", "array"],
  "pii_tokens_redacted": 0
}
```

**Authentication Required**: Yes (via Supabase Auth)

## Features Walkthrough

### Dashboard
- View key metrics: Total Evaluations, Average Latency, Success Rate, Average Score
- Interactive charts showing 7-day and 30-day trends
- Real-time data updates

### Evaluations
- Paginated table view (50 records per page)
- Filter and sort capabilities
- Detailed view for each evaluation
- PII obfuscation support

### Settings
- Configure run policy (always or sampled)
- Set sample rate percentage
- Toggle PII obfuscation
- Set daily evaluation limits

## Development

### Build for production

```bash
npm run build
```

### Run production build

```bash
npm start
```

### Linting

```bash
npm run lint
```

## Security

- Row Level Security (RLS) enabled on all tables
- User authentication required for all operations
- Environment variables for sensitive data
- PII obfuscation support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ by Sujay
