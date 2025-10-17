# Deployment Guide

This guide will help you deploy the AI Agent Evaluation Framework to production.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest option as it's made by the Next.js team.

#### Steps:

1. **Push your code to GitHub**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/ai-agent-eval.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next
   
3. **Add Environment Variables**
   - In the Vercel dashboard, go to your project settings
   - Click "Environment Variables"
   - Add your three environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```
   - Make sure to add them for all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

#### Automatic Deployments
- Every push to `main` branch will automatically deploy to production
- Pull requests will create preview deployments

### Option 2: Netlify

1. **Push code to GitHub** (same as Vercel)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign up/login
   - Click "Add new site" > "Import an existing project"
   - Connect to GitHub and select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
     - Functions directory: `.netlify/functions`

3. **Add Environment Variables**
   - Go to Site settings > Environment variables
   - Add your Supabase credentials

4. **Deploy**
   - Click "Deploy site"

### Option 3: Self-Hosted (Docker)

1. **Create Dockerfile**

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

2. **Update next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
```

3. **Build and run**

```bash
docker build -t ai-agent-eval .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your-url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  -e SUPABASE_SERVICE_ROLE_KEY=your-service-key \
  ai-agent-eval
```

### Option 4: AWS (Elastic Beanstalk)

1. Install AWS CLI and EB CLI
2. Initialize EB application
3. Configure environment variables
4. Deploy with `eb deploy`

See AWS documentation for detailed steps.

## 🔧 Production Checklist

### Before Deploying

- [ ] Test build locally: `npm run build && npm start`
- [ ] Verify all environment variables are set
- [ ] Check that database migrations ran successfully
- [ ] Test authentication flow
- [ ] Verify RLS policies are working
- [ ] Remove any test/debug code
- [ ] Update CORS settings if needed

### Supabase Production Settings

1. **Email Settings**
   - Go to Authentication > Email Templates
   - Customize confirmation and reset password emails
   - Update email sender (Supabase Pro required for custom domain)

2. **URL Configuration**
   - Go to Authentication > URL Configuration
   - Set Site URL to your production domain
   - Add Redirect URLs for auth callbacks

3. **Rate Limiting**
   - Consider enabling rate limiting for API endpoints
   - Configure in Supabase dashboard under API settings

4. **Database Backups**
   - Enable automatic backups (Supabase Pro)
   - Or manually backup with `pg_dump`

5. **Monitoring**
   - Enable logging in Supabase dashboard
   - Set up alerts for errors

### Security Hardening

1. **Environment Variables**
   - Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
   - Use server-side API routes for sensitive operations
   - Rotate keys periodically

2. **Authentication**
   - Enable email confirmation requirement
   - Set up password complexity requirements
   - Consider adding 2FA
   - Set session timeout appropriately

3. **Database**
   - Review and test all RLS policies
   - Limit API request size
   - Enable SSL/TLS for database connections

4. **CORS**
   - Configure CORS to only allow your domain
   - Disable CORS for sensitive endpoints

## 📊 Performance Optimization

### Next.js Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Configure image domains in `next.config.js`

2. **Caching**
   - Implement ISR (Incremental Static Regeneration)
   - Cache API responses where appropriate
   - Use React Query for client-side caching

3. **Code Splitting**
   - Use dynamic imports for large components
   - Lazy load heavy dependencies

### Database Optimization

1. **Indexes**
   - Already included in schema.sql
   - Monitor slow queries and add indexes as needed

2. **Query Optimization**
   - Use select() to limit returned columns
   - Implement pagination for large datasets
   - Use database functions for complex calculations

3. **Connection Pooling**
   - Supabase handles this automatically
   - Use connection pooling for self-hosted databases

## 🔍 Monitoring

### Vercel Analytics

```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Supabase Monitoring

- Enable logging in Supabase dashboard
- Set up webhooks for critical events
- Monitor API usage and rate limits

## 🚨 Disaster Recovery

### Backup Strategy

1. **Database Backups**
   ```bash
   # Manual backup
   pg_dump -h db.your-project.supabase.co -U postgres dbname > backup.sql
   ```

2. **Automated Backups**
   - Supabase Pro includes daily backups
   - Set up additional backup scripts if needed

3. **Code Backups**
   - Keep code in Git (GitHub, GitLab, etc.)
   - Tag releases: `git tag v1.0.0`

### Recovery Plan

1. **Database Restore**
   ```bash
   psql -h db.your-project.supabase.co -U postgres dbname < backup.sql
   ```

2. **Rollback Deployment**
   - Vercel: Go to Deployments > Previous deployment > Promote to Production
   - Git: `git revert` or `git reset` and redeploy

## 📈 Scaling Considerations

### When to Scale

- Response times > 2 seconds
- Database CPU > 80% consistently
- Error rate > 1%
- Growing beyond 100k evaluations/day

### Scaling Options

1. **Vertical Scaling**
   - Upgrade Supabase plan for better database performance
   - Upgrade Vercel plan for better compute resources

2. **Horizontal Scaling**
   - Next.js scales automatically on Vercel
   - Consider database read replicas for heavy read workloads

3. **Optimization**
   - Implement Redis for caching
   - Use CDN for static assets
   - Optimize database queries

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      # Deploy step depends on your platform
```

## 📝 Post-Deployment

1. **Test Everything**
   - Sign up flow
   - Login flow
   - Create/read/update operations
   - API endpoints
   - Charts and visualizations

2. **Monitor**
   - Check error logs
   - Monitor performance metrics
   - Watch for unusual activity

3. **Document**
   - Update README with production URL
   - Document any production-specific configurations
   - Share credentials securely with team

---

## 🆘 Troubleshooting Production Issues

### Build Fails

- Check build logs for errors
- Verify all dependencies are in `package.json`
- Test build locally: `npm run build`

### Authentication Not Working

- Verify environment variables are set correctly
- Check Supabase URL configuration
- Ensure redirect URLs are configured

### Database Connection Issues

- Check connection string
- Verify database is accessible from deployment platform
- Check RLS policies aren't blocking queries

### Performance Issues

- Enable caching
- Optimize database queries
- Add indexes to frequently queried columns
- Consider upgrading your plan

---

Good luck with your deployment! 🚀
