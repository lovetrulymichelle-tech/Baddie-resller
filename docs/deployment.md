# Deployment Guide

This guide covers deploying Baddie Reseller to various hosting platforms.

## Deployment Options

### 1. Railway (Recommended)

Railway offers seamless deployment with automatic scaling and built-in databases.

#### Frontend Deployment

1. **Connect Repository**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize project
   railway init
   ```

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Start command: `npm start`
   - Root directory: `frontend`

3. **Set Environment Variables**
   ```bash
   railway variables set NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   railway variables set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

#### Backend Deployment

1. **Create Backend Service**
   ```bash
   railway init baddie-reseller-backend
   ```

2. **Configure Database**
   ```bash
   # Add MongoDB plugin
   railway add mongodb
   ```

3. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set MONGODB_URI=${{MongoDB.MONGO_URL}}
   railway variables set JWT_SECRET=your-jwt-secret
   railway variables set OPENAI_API_KEY=sk-...
   railway variables set STRIPE_SECRET_KEY=sk_live_...
   ```

4. **Deploy**
   ```bash
   railway up
   ```

### 2. Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Select `frontend` as root directory

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Output directory: `.next`
   - Install command: `npm install`

3. **Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   NEXT_PUBLIC_APP_NAME=Baddie Reseller
   ```

#### Backend on Railway

Follow the Railway backend deployment steps above.

### 3. Docker Deployment

#### Create Dockerfiles

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY backend ./backend
COPY shared ./shared

# Build the application
WORKDIR /app/backend
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY frontend ./frontend
COPY shared ./shared

# Build the application
WORKDIR /app/frontend
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: baddie
      MONGO_INITDB_ROOT_PASSWORD: reseller123
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    restart: unless-stopped
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://baddie:reseller123@mongodb:27017/baddie-reseller?authSource=admin
      JWT_SECRET: your-super-secret-jwt-key
      OPENAI_API_KEY: sk-your-openai-key
      STRIPE_SECRET_KEY: sk_live_your-stripe-key
    depends_on:
      - mongodb
    ports:
      - "3001:3001"

  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_live_your-stripe-key
    depends_on:
      - backend
    ports:
      - "3000:3000"

volumes:
  mongodb_data:
```

### 4. AWS Deployment

#### Using AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize Application**
   ```bash
   eb init baddie-reseller
   ```

3. **Create Environment**
   ```bash
   eb create production
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

#### Using AWS ECS with Fargate

1. **Build and Push Images**
   ```bash
   # Build images
   docker build -t baddie-reseller-backend ./backend
   docker build -t baddie-reseller-frontend ./frontend
   
   # Tag for ECR
   docker tag baddie-reseller-backend:latest 123456789012.dkr.ecr.region.amazonaws.com/baddie-reseller-backend:latest
   docker tag baddie-reseller-frontend:latest 123456789012.dkr.ecr.region.amazonaws.com/baddie-reseller-frontend:latest
   
   # Push to ECR
   docker push 123456789012.dkr.ecr.region.amazonaws.com/baddie-reseller-backend:latest
   docker push 123456789012.dkr.ecr.region.amazonaws.com/baddie-reseller-frontend:latest
   ```

2. **Create ECS Task Definitions**
3. **Set up Application Load Balancer**
4. **Create ECS Service**

## Environment-Specific Configurations

### Production Environment Variables

**Backend (.env.production):**
```env
NODE_ENV=production
PORT=3001

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/baddie-reseller

# Security
JWT_SECRET=your-super-secure-jwt-secret-key
CORS_ORIGIN=https://your-frontend-domain.com

# API Keys
OPENAI_API_KEY=sk-live-your-openai-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
SHOPIFY_API_KEY=your-live-shopify-api-key
SHOPIFY_API_SECRET=your-live-shopify-api-secret

# Email
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=baddie-reseller-prod
AWS_REGION=us-east-1

# Redis
REDIS_URL=redis://your-redis-instance:6379

# Logging
LOG_LEVEL=info
```

**Frontend (.env.production):**
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_APP_NAME=Baddie Reseller
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

## SSL/HTTPS Setup

### Using Let's Encrypt with Nginx

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain Certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name your-domain.com www.your-domain.com;

       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Monitoring and Health Checks

### Health Check Endpoints

- **Backend**: `GET /health`
- **Frontend**: `GET /api/health`

### Basic Monitoring Script

```bash
#!/bin/bash
# monitor.sh

check_service() {
    local url=$1
    local name=$2
    
    if curl -f -s "$url" > /dev/null; then
        echo "✅ $name is healthy"
    else
        echo "❌ $name is down"
        # Add notification logic here
    fi
}

check_service "https://api.your-domain.com/health" "Backend API"
check_service "https://your-domain.com" "Frontend"
```

## Rollback Strategy

### Quick Rollback Commands

**Railway:**
```bash
# List deployments
railway status

# Rollback to previous deployment
railway rollback
```

**Vercel:**
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url]
```

**Docker:**
```bash
# Rollback to previous image version
docker service update --image your-repo:previous-tag your-service
```

## Troubleshooting Deployment Issues

### Common Issues

1. **Build Failures**
   - Check build logs for dependency issues
   - Verify Node.js version compatibility
   - Ensure all environment variables are set

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network security groups/firewall rules
   - Ensure database user has proper permissions

3. **API Integration Failures**
   - Verify API keys are production-ready
   - Check rate limiting and quotas
   - Ensure webhook URLs are accessible

4. **Performance Issues**
   - Monitor memory and CPU usage
   - Implement caching strategies
   - Optimize database queries
   - Use CDN for static assets

For additional support, check the [troubleshooting guide](./troubleshooting.md) or create an issue on GitHub.