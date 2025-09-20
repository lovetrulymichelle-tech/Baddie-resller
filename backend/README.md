# Backend

Node.js/Express backend API for the Baddie Reseller platform.

## Features

- RESTful API with Express.js
- TypeScript for type safety
- Database integration (MongoDB/PostgreSQL)
- Authentication and authorization
- AI automation endpoints
- Third-party integrations

## Getting Started

```bash
cd backend
npm install
npm run dev
```

## Structure

```
backend/
├── src/
│   ├── controllers/   # Request handlers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Express middleware
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript types
├── config/            # Configuration files
└── tests/            # Backend tests
```

## API Endpoints

- `/api/auth` - Authentication
- `/api/products` - Product management
- `/api/orders` - Order tracking
- `/api/inventory` - Inventory management
- `/api/ai` - AI automation
- `/api/integrations` - Third-party integrations