# Integrations

Third-party service integrations for the Baddie Reseller platform.

## Supported Integrations

### Payment Processing
- **Stripe**: Complete payment processing solution
  - Payment processing
  - Subscription management
  - Webhook handling
  - Fraud detection

### E-commerce Platforms
- **Shopify**: Store management and automation
  - Product synchronization
  - Order management
  - Inventory updates
  - Customer data sync

### Hosting Platforms
- **Webflow**: Website integration and management
- **Framer**: Design and deployment integration
- **Hostinger**: Hosting and domain management
- **Railway**: Cloud deployment and scaling

## Structure

```
integrations/
├── stripe/          # Stripe payment integration
├── shopify/         # Shopify store integration
├── webflow/         # Webflow website integration
├── framer/          # Framer design integration
├── hostinger/       # Hostinger hosting integration
├── railway/         # Railway deployment integration
├── common/          # Shared integration utilities
└── tests/          # Integration tests
```

## Getting Started

Each integration has its own setup requirements and API keys. See individual integration directories for specific setup instructions.

## Configuration

Create a `.env` file with the following variables:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_SECRET=your_shopify_secret
WEBFLOW_API_TOKEN=your_webflow_token
FRAMER_API_KEY=your_framer_key
HOSTINGER_API_KEY=your_hostinger_key
RAILWAY_API_TOKEN=your_railway_token
```