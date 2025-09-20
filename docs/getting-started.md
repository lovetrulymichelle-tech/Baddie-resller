# Getting Started with Baddie Reseller

This guide will help you set up and run the Baddie Reseller AI-powered application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MongoDB** (v6.0 or higher)
- **Git**

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lovetrulymichelle-tech/Baddie-resller.git
   cd Baddie-resller
   ```

2. **Install dependencies for all modules**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   **Backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your actual values
   ```

   **Frontend:**
   ```bash
   cd ../frontend
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

## Configuration

### Database Setup

1. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **Verify MongoDB connection**
   ```bash
   mongo --eval "db.adminCommand('ismaster')"
   ```

### API Keys Setup

You'll need to obtain API keys for the following services:

1. **OpenAI API Key**
   - Visit [OpenAI API](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add to `backend/.env` as `OPENAI_API_KEY`

2. **Stripe Keys**
   - Visit [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Get your publishable and secret keys
   - Add to respective environment files

3. **Shopify Integration**
   - Create a Shopify Partner account
   - Create a new app and get API credentials
   - Add to `backend/.env`

## Running the Application

### Development Mode

1. **Start all services**
   ```bash
   npm run dev
   ```
   This command starts both frontend and backend concurrently.

2. **Or start services individually**
   
   **Backend only:**
   ```bash
   npm run dev:backend
   ```
   
   **Frontend only:**
   ```bash
   npm run dev:frontend
   ```

### Production Mode

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health

## Features Overview

### 🤖 AI Automation
- **Auto-refill Products**: Intelligent inventory management
- **Demand Prediction**: ML-powered sales forecasting
- **Price Optimization**: Dynamic pricing strategies

### 📊 Dashboard
- **Real-time Analytics**: Sales, inventory, and performance metrics
- **Order Management**: Track and fulfill orders efficiently
- **Inventory Alerts**: Low stock and reorder notifications

### 🔌 Integrations
- **Shopify**: Sync products and orders
- **Stripe**: Payment processing
- **Hosting Platforms**: Deploy to Railway, Vercel, etc.

## Testing

Run the test suite:

```bash
# All tests
npm test

# Frontend tests only
npm run test:frontend

# Backend tests only
npm run test:backend
```

## Linting

Ensure code quality:

```bash
# Lint all code
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify database permissions

2. **API Key Errors**
   - Verify all API keys are correctly set
   - Check API key permissions and quotas
   - Ensure no trailing spaces in environment variables

3. **Port Conflicts**
   - Default ports: Frontend (3000), Backend (3001)
   - Change ports in environment variables if needed

4. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear Next.js cache: `rm -rf .next`
   - Verify all TypeScript types are correct

### Getting Help

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## Next Steps

1. **Configure Integrations**: Set up Shopify, Stripe, and hosting platforms
2. **Import Products**: Add your first products through the dashboard
3. **Set Up AI Features**: Configure automatic refilling and optimization
4. **Deploy**: Use the deployment guide to go live

For more detailed information, see:
- [API Documentation](./api.md)
- [Integration Guide](./integrations.md)
- [Deployment Guide](./deployment.md)