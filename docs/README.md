# 🔥 Baddie Reseller AI SaaS Starter

**Manifested by HustleNHeal** - Complete AI-powered product generation platform for digital entrepreneurs and resellers.

## 🚀 Quick Start

### Backend (Flask + Railway)
1. **Setup Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   cp .env.example .env
   # Configure your environment variables
   python app.py
   ```

2. **Deploy to Railway**
   - Connect GitHub repo to Railway
   - Set environment variables in Railway dashboard
   - Deploy automatically on push

### Frontend (Next.js + Vercel)
1. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Configure your environment variables
   npm run dev
   ```

2. **Deploy to Vercel**
   - Connect GitHub repo to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push

## 🏗️ Architecture

### Backend Stack
- **Flask** - Python web framework
- **SQLite** - Database (easily upgradeable to PostgreSQL)
- **OpenAI GPT-4o-mini** - AI product generation
- **Stripe** - Payment processing ($1 trial + subscriptions)
- **Flask-JWT-Extended** - Authentication
- **Railway** - Deployment platform

### Frontend Stack
- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety
- **Heroicons** - Beautiful icons
- **Vercel** - Deployment platform

## 💳 Stripe Integration

### Setup Process
1. **Create Stripe Account** at https://stripe.com
2. **Create Products & Prices**:
   - Trial Product: $1 for 7 days
   - Subscription Product: $29/month recurring
3. **Configure Webhooks**:
   - Add webhook endpoint: `your-backend-url/api/payments/webhook`
   - Events: `customer.subscription.*`, `invoice.payment_*`
4. **Set Environment Variables**:
   - `STRIPE_PUBLISHABLE_KEY` (frontend)
   - `STRIPE_SECRET_KEY` (backend)
   - `STRIPE_WEBHOOK_SECRET` (backend)
   - `STRIPE_TRIAL_PRICE_ID` (backend)
   - `STRIPE_SUBSCRIPTION_PRICE_ID` (backend)

## 🤖 AI Integration

### OpenAI Setup
1. Get API key from https://platform.openai.com
2. Set `OPENAI_API_KEY` in backend environment
3. The system uses GPT-4o-mini for cost-effective product generation

### AI Features
- **Product Generation**: Creates titles, descriptions, pricing
- **SEO Optimization**: Includes relevant keywords
- **Baddie Aesthetic**: Specialized prompts for trendy products
- **Smart Pricing**: Market-aware price suggestions

## 📱 Features

### User Authentication
- ✅ Email/password registration and login
- ✅ Magic link authentication (passwordless)
- ✅ JWT-based session management
- ✅ Secure password hashing with bcrypt

### Subscription Management
- ✅ $1 trial for 7 days
- ✅ Automatic conversion to $29/month
- ✅ Stripe Checkout integration
- ✅ Webhook handling for subscription updates
- ✅ Cancel at any time

### AI Product Generator
- ✅ Unlimited generation for subscribers
- ✅ Category-based product creation
- ✅ SEO-optimized descriptions
- ✅ Keyword suggestions
- ✅ Pricing recommendations

### Dashboard
- ✅ Product management interface
- ✅ Analytics and statistics
- ✅ Subscription status
- ✅ Product history and editing

## 🎨 Branding

### Design System
- **Primary Colors**: Pink (#EC4899) to Purple (#8B5CF6)
- **Typography**: Inter font family
- **Style**: Modern, gradient-heavy, baddie aesthetic
- **Mascot**: Diamond emoji (💎) placeholder

### Brand Voice
- Empowering and confident
- Target audience: Digital entrepreneurs, resellers
- Focus on automation and scaling
- "Baddie empire" messaging

## 🔧 Configuration

### Backend Environment Variables
```env
# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

# Database
DATABASE_URL=sqlite:///baddie_reseller.db

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_TRIAL_PRICE_ID=price_trial_id
STRIPE_SUBSCRIPTION_PRICE_ID=price_subscription_id

# Frontend URL
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend Environment Variables
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable
```

## 🚀 Deployment

### Railway (Backend)
1. **Create Railway Account**: https://railway.app
2. **Connect GitHub Repository**
3. **Set Environment Variables** in Railway dashboard
4. **Deploy**: Automatic on git push to main branch

### Vercel (Frontend)
1. **Create Vercel Account**: https://vercel.com
2. **Import GitHub Repository**
3. **Set Environment Variables** in Vercel dashboard
4. **Deploy**: Automatic on git push to main branch

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/magic-link` - Send magic link
- `POST /api/auth/magic-login` - Login with magic link
- `GET /api/auth/me` - Get current user

### Products
- `POST /api/products/generate` - Generate AI product
- `GET /api/products` - Get user products
- `GET /api/products/stats` - Get product statistics
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Payments
- `POST /api/payments/create-trial-session` - Start $1 trial
- `POST /api/payments/create-subscription-session` - Full subscription
- `POST /api/payments/verify-session` - Verify payment
- `GET /api/payments/subscription-status` - Subscription info
- `POST /api/payments/cancel-subscription` - Cancel subscription
- `POST /api/payments/webhook` - Stripe webhook handler

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/  # Add tests as needed
```

### Frontend Testing
```bash
cd frontend
npm run test  # Add tests as needed
```

## 📈 Scaling Considerations

### Database
- Start with SQLite for simplicity
- Upgrade to PostgreSQL for production scale
- Add Redis for caching and sessions

### AI Costs
- Monitor OpenAI usage and costs
- Consider rate limiting for free users
- Add usage analytics

### Performance
- Add CDN for static assets
- Implement caching strategies
- Consider serverless functions for API

## 🔒 Security

### Best Practices Implemented
- JWT token authentication
- Password hashing with bcrypt
- SQL injection prevention with SQLAlchemy
- CORS configuration
- Environment variable security
- Stripe webhook signature verification

## 📞 Support & Maintenance

### Monitoring
- Add error tracking (Sentry)
- Monitor API performance
- Track user engagement
- Watch Stripe webhooks

### Updates
- Regular dependency updates
- AI model improvements
- Feature additions based on user feedback
- Performance optimizations

---

## 🎯 Next Steps

1. **Launch MVP**: Deploy basic version with core features
2. **User Feedback**: Gather feedback from early users
3. **Feature Expansion**: Add more AI models, export formats
4. **Marketing**: Content marketing, social media presence
5. **Scale**: Optimize performance, add advanced features

**Ready to build your baddie reselling empire? Let's get started! 💎✨**