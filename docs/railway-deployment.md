# 🚀 Railway Backend Deployment Guide

## Prerequisites
- Railway account (https://railway.app)
- GitHub repository with backend code
- Stripe account setup
- OpenAI API key

## Step-by-Step Deployment

### 1. Create Railway Project
1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository and select the `backend` folder

### 2. Configure Environment Variables
In Railway dashboard, go to Variables tab and add:

```env
# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
JWT_SECRET_KEY=your-jwt-secret-key-here-also-long-and-random

# Database (Railway will provide PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-from-platform-openai-com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your-live-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-live-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret-from-stripe-dashboard
STRIPE_TRIAL_PRICE_ID=price_your_trial_price_id_from_stripe
STRIPE_SUBSCRIPTION_PRICE_ID=price_your_subscription_price_id_from_stripe

# Frontend URL (update after deploying frontend)
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 3. Add PostgreSQL Database
1. In Railway dashboard, click "New Service"
2. Select "PostgreSQL"
3. Railway will automatically set `DATABASE_URL` variable

### 4. Configure Deployment Settings
1. Go to Settings tab
2. Set **Root Directory** to `backend`
3. Set **Start Command** to `gunicorn app:app`
4. **Port** should be auto-detected as `$PORT`

### 5. Deploy
1. Click "Deploy" or push to your main branch
2. Railway will automatically build and deploy
3. Get your backend URL from the Railway dashboard

### 6. Configure Stripe Webhooks
1. Go to Stripe Dashboard > Webhooks
2. Add new webhook endpoint: `https://your-backend-url.railway.app/api/payments/webhook`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET` variable

### 7. Test Deployment
- Visit `https://your-backend-url.railway.app/api/health`
- Should return: `{"status": "healthy", "app": "Baddie Reseller API", "version": "1.0.0"}`

## Troubleshooting

### Common Issues

**Build Failures**
- Check that `requirements.txt` is in backend folder
- Ensure Python version is specified in `runtime.txt`
- Check Railway build logs for specific errors

**Database Connection Issues**
- Verify PostgreSQL service is running
- Check that `DATABASE_URL` variable is set correctly
- Ensure Flask-Migrate is working properly

**Environment Variables**
- Double-check all required variables are set
- Ensure no trailing spaces in variable values
- Use Railway's variable referencing for database URL

**Stripe Integration**
- Verify webhook endpoint URL is correct
- Check webhook secret matches environment variable
- Ensure all required Stripe price IDs are set

### Performance Optimization

**Production Settings**
```python
# In config.py
class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_POOL_SIZE = 10
    SQLALCHEMY_POOL_TIMEOUT = 20
    SQLALCHEMY_POOL_RECYCLE = -1
```

**Scaling**
- Railway auto-scales based on traffic
- Monitor resource usage in Railway dashboard
- Consider upgrading plan for higher traffic

### Monitoring
- Check Railway logs for errors
- Monitor Stripe webhook delivery
- Set up alerts for critical failures

## Security Checklist
- [ ] All environment variables use secure values
- [ ] DEBUG is set to False in production
- [ ] Database URL uses SSL connection
- [ ] CORS is configured for your frontend domain only
- [ ] Stripe webhook signatures are verified
- [ ] JWT secrets are long and random

## Backup Strategy
- Railway PostgreSQL includes automatic backups
- Consider additional backup solutions for critical data
- Test restore procedures regularly

---

**Your backend is now live! Next: Deploy the frontend to Vercel.**