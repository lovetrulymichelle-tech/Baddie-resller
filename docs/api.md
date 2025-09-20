# API Documentation

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://api.baddie-reseller.com/api`

## Authentication

All API requests require authentication using JWT tokens.

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Endpoints

### Authentication
#### POST `/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "reseller"
  }
}
```

#### POST `/auth/register`
Register a new user account.

#### POST `/auth/refresh`
Refresh authentication token.

### Products
#### GET `/products`
Get all products with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category
- `status`: Filter by status (active, inactive)

**Response:**
```json
{
  "products": [
    {
      "id": "product_id",
      "name": "Product Name",
      "price": 29.99,
      "category": "electronics",
      "status": "active",
      "inventory": 150,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### POST `/products`
Create a new product.

#### GET `/products/:id`
Get product by ID.

#### PUT `/products/:id`
Update product.

#### DELETE `/products/:id`
Delete product.

### Orders
#### GET `/orders`
Get all orders with filtering and pagination.

#### POST `/orders`
Create a new order.

#### GET `/orders/:id`
Get order details.

#### PUT `/orders/:id/status`
Update order status.

### Inventory
#### GET `/inventory`
Get inventory status for all products.

#### POST `/inventory/:productId/refill`
Trigger automatic refill for a product.

#### GET `/inventory/alerts`
Get low inventory alerts.

### AI Automation
#### POST `/ai/optimize-pricing`
Trigger AI price optimization.

**Request:**
```json
{
  "productIds": ["id1", "id2"],
  "strategy": "maximize_profit"
}
```

#### POST `/ai/generate-listing`
Generate optimized product listing.

#### GET `/ai/predictions/inventory`
Get inventory predictions.

### Integrations
#### GET `/integrations/shopify/sync`
Sync with Shopify store.

#### POST `/integrations/stripe/webhook`
Handle Stripe webhooks.

#### GET `/integrations/status`
Get integration status for all services.

## Error Responses

All errors follow this format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
```

### Error Codes
- `VALIDATION_ERROR`: Request validation failed
- `AUTHENTICATION_ERROR`: Authentication failed
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```