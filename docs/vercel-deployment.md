# 🚀 Vercel Frontend Deployment Guide

## Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository with frontend code
- Backend deployed to Railway
- Stripe publishable key

## Step-by-Step Deployment

### 1. Import Project to Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as root directory

### 2. Configure Build Settings
Vercel will auto-detect Next.js. Verify settings:
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`

### 3. Set Environment Variables
In project settings, add environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-live-stripe-publishable-key
```

### 4. Deploy
1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Get your frontend URL from Vercel dashboard

### 5. Update Backend CORS
Update your backend's `FRONTEND_URL` environment variable in Railway:
```env
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 6. Configure Custom Domain (Optional)
1. In Vercel dashboard, go to Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned

## Environment Variables Explained

### NEXT_PUBLIC_API_URL
- Points to your Railway backend URL
- Must include protocol (https://)
- No trailing slash

### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- Use live key for production (`pk_live_...`)
- Use test key for development (`pk_test_...`)
- This key is safe to expose in frontend

## Testing Your Deployment

### 1. Basic Functionality
- [ ] Landing page loads correctly
- [ ] Registration flow works
- [ ] Login flow works  
- [ ] Magic link authentication works
- [ ] Dashboard loads for authenticated users

### 2. Payment Flow
- [ ] Trial signup redirects to Stripe
- [ ] Payment completion redirects back to dashboard
- [ ] Subscription status updates correctly
- [ ] AI product generation works for subscribed users

### 3. API Integration
- [ ] All API calls work correctly
- [ ] CORS allows frontend domain
- [ ] Authentication tokens work
- [ ] Error handling displays properly

## Performance Optimization

### Next.js Optimizations
Already included in the setup:
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Next.js Font optimization
- **Code Splitting**: Automatic with Next.js
- **Static Generation**: Where applicable

### Additional Optimizations
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = nextConfig
```

### Analytics Setup
Add Vercel Analytics:
```bash
npm install @vercel/analytics
```

```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Security Configuration

### Content Security Policy
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' your-backend-url.railway.app api.stripe.com;",
          },
        ],
      },
    ]
  },
}
```

### Environment Variables Security
- Never commit `.env.local` to version control
- Use Vercel's environment variable system
- Rotate API keys regularly
- Use different keys for different environments

## Monitoring & Analytics

### Vercel Analytics
- Real-time traffic metrics
- Performance insights
- Core Web Vitals tracking

### Error Monitoring
Consider adding Sentry:
```bash
npm install @sentry/nextjs
```

### Custom Logging
```javascript
// lib/logger.js
export const logError = (error, context) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to monitoring service
    console.error('[ERROR]', { error, context, timestamp: new Date().toISOString() })
  } else {
    console.error(error)
  }
}
```

## Troubleshooting

### Common Issues

**Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check TypeScript errors
- Review build logs in Vercel dashboard

**API Connection Issues**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS configuration on backend
- Ensure backend is running and accessible
- Test API endpoints directly

**Stripe Integration Issues**
- Verify publishable key is correct
- Check browser console for Stripe errors
- Ensure backend Stripe configuration matches
- Test with Stripe test mode first

**Environment Variables**
- Variables must be prefixed with `NEXT_PUBLIC_` for client access
- Redeploy after changing environment variables
- Check variable values in Vercel dashboard

### Performance Issues
- Check Core Web Vitals in Vercel dashboard
- Optimize images and fonts
- Review bundle size and code splitting
- Use Next.js profiling tools

## Continuous Deployment

### Automatic Deployments
- Production: Deploy from `main` branch
- Preview: Deploy from feature branches
- Vercel automatically builds and deploys on Git push

### Branch Protection
Recommended branch protection rules:
- Require pull request reviews
- Require status checks to pass
- Restrict pushes to main branch

### Deploy Hooks
Set up deploy hooks for external triggers:
1. Go to Vercel project settings
2. Git tab > Deploy Hooks
3. Create hook for specific branch

---

**Your frontend is now live! Test the complete user flow from registration to product generation.**