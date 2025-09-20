# Deployment Guide

## Overview

This guide covers deployment options for the Baddie Reseller platform across different environments and hosting providers.

## Prerequisites

- Node.js 18+
- npm or yarn
- Git repository access
- Environment variables configured

## Environment Setup

### Environment Variables

Create `.env` files for each environment:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/baddie-reseller
POSTGRES_URL=postgresql://user:pass@localhost:5432/baddie_reseller

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# API Keys
STRIPE_SECRET_KEY=sk_test_...
SHOPIFY_API_KEY=your_shopify_key
WEBFLOW_API_TOKEN=your_webflow_token

# Application
NODE_ENV=production
PORT=3000
API_BASE_URL=https://api.baddie-reseller.com
```

## Railway Deployment

Railway is the recommended platform for deployment.

### Setup

1. **Connect Repository**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize project
   railway init
   ```

2. **Configure Services**
   ```yaml
   # railway.json
   {
     "deploy": {
       "startCommand": "npm start",
       "healthcheckPath": "/health"
     }
   }
   ```

3. **Deploy**
   ```bash
   # Deploy to production
   railway up
   
   # Set environment variables
   railway variables set NODE_ENV=production
   railway variables set DATABASE_URL=$DATABASE_URL
   ```

### Database Setup on Railway

```bash
# Add PostgreSQL
railway add postgresql

# Add Redis for caching
railway add redis

# Get connection strings
railway variables
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mongodb://mongo:27017/baddie-reseller
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  mongo_data:
  redis_data:
```

## AWS Deployment

### EC2 Deployment

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Security group with ports 80, 443, 22

2. **Setup Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/lovetrulymichelle-tech/Baddie-resller.git
   cd Baddie-resller
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### ECS Deployment

1. **Create ECS Cluster**
2. **Build and Push Docker Image**
   ```bash
   # Build image
   docker build -t baddie-reseller .
   
   # Tag for ECR
   docker tag baddie-reseller:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/baddie-reseller:latest
   
   # Push to ECR
   docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/baddie-reseller:latest
   ```

3. **Create ECS Service**

## Vercel Deployment (Frontend)

For Next.js frontend deployment:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

### Vercel Configuration

```json
{
  "name": "baddie-reseller-frontend",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.baddie-reseller.com"
  }
}
```

## Database Deployment

### MongoDB Atlas

1. Create cluster on MongoDB Atlas
2. Configure network access
3. Create database user
4. Get connection string

### PostgreSQL (Railway/AWS RDS)

```bash
# Railway
railway add postgresql

# AWS RDS
aws rds create-db-instance \
  --db-instance-identifier baddie-reseller-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password password \
  --allocated-storage 20
```

## CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Railway
      uses: railway/cli@v3
      with:
        command: up
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Monitoring and Logging

### Application Monitoring

```javascript
// Add to your app
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Checks

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version
  });
});
```

## SSL/HTTPS Setup

### Certbot (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.baddie-reseller.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Backup Strategy

### Database Backups

```bash
# MongoDB backup
mongodump --uri="mongodb://user:pass@host:port/dbname" --out=/backups/

# PostgreSQL backup
pg_dump $DATABASE_URL > backup.sql
```

### Automated Backups

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$DATABASE_URL" --out="/backups/backup_$DATE"
aws s3 cp "/backups/backup_$DATE" "s3://your-backup-bucket/" --recursive
```

## Performance Optimization

1. **Enable Gzip Compression**
2. **Use CDN for Static Assets**
3. **Implement Caching Strategy**
4. **Database Indexing**
5. **Load Balancing**

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] API rate limiting enabled
- [ ] Input validation implemented
- [ ] Security headers configured
- [ ] Regular security updates
- [ ] Backup encryption enabled