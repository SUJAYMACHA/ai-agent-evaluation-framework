# Setup Instructions

Follow these step-by-step instructions to set up and run the AI Agent Evaluation Framework.

## 📋 Prerequisites

Before you begin, make sure you have:
- Node.js 18 or higher installed
- A Supabase account (free tier is fine)
- Git (optional, for version control)

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

This will install all required packages including Next.js, Supabase, Tailwind CSS, Shadcn/UI, and Recharts.

### Step 2: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - Project name: `ai-agent-evaluation`
   - Database password: (create a strong password)
   - Region: Choose closest to you
4. Wait for the project to be created (2-3 minutes)

### Step 3: Set Up Database Schema

1. In your Supabase project dashboard, go to **SQL Editor** (in the left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql` from this project
4. Paste it into the SQL Editor
5. Click "Run" to execute the SQL
6. You should see success messages confirming tables were created

### Step 4: Get Supabase Credentials

1. In your Supabase project, go to **Project Settings** (gear icon in bottom left)
2. Click on **API** in the settings menu
3. You'll see:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY) - click "Reveal" to see it

### Step 5: Configure Environment Variables

1. In the project root, create a file named `.env.local`
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

⚠️ **Important**: Replace the placeholder values with your actual Supabase credentials from Step 4.

### Step 6: Run the Development Server

```powershell
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### Step 7: Create Your First User

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You'll be redirected to the login page
3. Click "Don't have an account? Sign up"
4. Enter your email and a password (minimum 6 characters)
5. Check your email for the confirmation link (check spam folder)
6. Click the confirmation link
7. Return to the app and login

### Step 8: (Optional) Seed Sample Data

To populate your database with 20,000 sample evaluation records:

```powershell
npm run seed
```

This creates a test user:
- **Email**: test@example.com
- **Password**: TestPassword123!

The script will take 2-5 minutes to complete.

## 🎯 Verify Everything Works

1. **Login**: You should be able to login and see the dashboard
2. **Dashboard**: Check that KPIs are displayed (will be 0 if no data)
3. **Settings**: Go to Settings and save your evaluation configuration
4. **Evaluations**: Navigate to Evaluations page

## 🧪 Testing the API

You can test the ingestion API endpoint using curl or Postman:

```powershell
# First, get your auth token from the browser developer tools
# Application > Cookies > sb-[project-id]-auth-token

curl -X POST http://localhost:3000/api/evals/ingest `
  -H "Content-Type: application/json" `
  -H "Cookie: sb-[your-project]-auth-token=[your-token]" `
  -d '{
    "interaction_id": "test-123",
    "prompt": "What is AI?",
    "response": "AI is artificial intelligence...",
    "score": 0.95,
    "latency_ms": 250,
    "flags": [],
    "pii_tokens_redacted": 0
  }'
```

## 📱 Application Pages

After setup, you can access:

- **Dashboard** (`/dashboard`): View KPIs and charts
- **Evaluations** (`/evaluations`): Browse all evaluation records
- **Settings** (`/settings`): Configure evaluation settings
- **Evaluation Detail** (`/evaluations/[id]`): View individual evaluation details

## 🔧 Troubleshooting

### "Cannot find module" errors
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Database connection errors
- Verify your `.env.local` file has correct credentials
- Check that you're using the correct Supabase URL and keys
- Make sure the SQL schema was executed successfully

### "Unauthorized" errors
- Clear browser cookies and login again
- Check that RLS policies were created correctly in Supabase
- Verify your user is confirmed (check email)

### Port already in use
```powershell
# Kill the process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
# Or use a different port
npm run dev -- -p 3001
```

## 🏗️ Building for Production

```powershell
# Create production build
npm run build

# Run production server
npm start
```

## 📊 Database Management

To view and manage your data:
1. Go to your Supabase dashboard
2. Click **Table Editor** to view data
3. Click **Authentication** to manage users

## 🔐 Security Notes

- Never commit `.env.local` to version control
- The `service_role` key has admin privileges - keep it secret
- Enable email confirmation in Supabase settings for production
- Consider enabling 2FA in Supabase for your account

## 📚 Next Steps

1. Customize the dashboard metrics based on your needs
2. Modify the seed script to generate data that matches your use case
3. Add custom flags for evaluation tracking
4. Implement additional API endpoints as needed
5. Deploy to Vercel or your preferred hosting platform

## 🆘 Getting Help

- Check the main README.md for feature documentation
- Review Supabase docs: [https://supabase.com/docs](https://supabase.com/docs)
- Review Next.js docs: [https://nextjs.org/docs](https://nextjs.org/docs)

---

Happy evaluating! 🚀
