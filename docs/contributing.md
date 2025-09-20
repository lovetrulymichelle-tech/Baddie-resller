# Contributing to Baddie Reseller

Thank you for your interest in contributing to the Baddie Reseller project! This guide will help you get started with contributing to our AI-powered reseller platform.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Coding Standards](#coding-standards)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic knowledge of React, Node.js, and TypeScript
- Understanding of RESTful APIs
- Familiarity with AI/ML concepts (for AI engine contributions)

### Development Setup

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/Baddie-resller.git
   cd Baddie-resller
   ```

2. **Install Dependencies**
   ```bash
   npm run install:all
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Servers**
   ```bash
   npm run dev
   ```

## Contributing Guidelines

### Types of Contributions

We welcome contributions in the following areas:

1. **Bug Fixes**: Fix existing issues
2. **Features**: Add new functionality
3. **Documentation**: Improve or add documentation
4. **AI Improvements**: Enhance AI algorithms and models
5. **Integrations**: Add new third-party integrations
6. **Testing**: Add or improve tests
7. **Performance**: Optimize code and improve performance

### Before You Start

1. Check existing issues and pull requests
2. Create an issue to discuss major changes
3. Follow our coding standards
4. Write tests for new functionality
5. Update documentation as needed

## Pull Request Process

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Your Changes

- Follow coding standards
- Add tests for new functionality
- Update documentation
- Ensure all tests pass

### 3. Commit Your Changes

```bash
git add .
git commit -m "feat: add product recommendation algorithm"
```

#### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(ai): add inventory prediction model
fix(api): resolve authentication token expiry issue
docs(readme): update installation instructions
```

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear title and description
- Link to related issues
- Screenshots for UI changes
- Test instructions

### 5. Review Process

- All PRs require review from maintainers
- Address review feedback promptly
- Keep PRs focused and small when possible
- Ensure CI checks pass

## Issue Reporting

### Bug Reports

When reporting bugs, include:

1. **Environment Information**
   - OS and version
   - Node.js version
   - Browser (if frontend issue)

2. **Steps to Reproduce**
   - Clear, numbered steps
   - Expected behavior
   - Actual behavior

3. **Additional Context**
   - Screenshots or videos
   - Error messages
   - Relevant logs

### Feature Requests

For feature requests, provide:

1. **Problem Description**
   - What problem does this solve?
   - Who would benefit?

2. **Proposed Solution**
   - Detailed description
   - Alternative solutions considered

3. **Additional Context**
   - Mockups or diagrams
   - Related issues or discussions

## Coding Standards

### TypeScript/JavaScript

```typescript
// Use TypeScript for type safety
interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
}

// Use meaningful names
const calculateTotalRevenue = (orders: Order[]): number => {
  return orders.reduce((total, order) => total + order.amount, 0);
};

// Add JSDoc comments for complex functions
/**
 * Optimizes product pricing based on market data and competition
 * @param product - The product to optimize
 * @param marketData - Current market analysis data
 * @returns Optimized price and confidence score
 */
async function optimizeProductPricing(
  product: Product,
  marketData: MarketData
): Promise<PriceOptimization> {
  // Implementation
}
```

### React Components

```tsx
// Use functional components with TypeScript
interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete
}) => {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onEdit(product)}>Edit</button>
      <button onClick={() => onDelete(product.id)}>Delete</button>
    </div>
  );
};
```

### API Routes

```typescript
// Use proper error handling and validation
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  category: z.enum(['electronics', 'clothing', 'books'])
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createProductSchema.parse(body);
    
    const product = await createProduct(validatedData);
    
    return Response.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Failed to create product:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Testing

```typescript
// Write comprehensive tests
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    category: 'electronics' as const
  };

  it('displays product information correctly', () => {
    render(
      <ProductCard
        product={mockProduct}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    
    render(
      <ProductCard
        product={mockProduct}
        onEdit={onEdit}
        onDelete={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(mockProduct);
  });
});
```

## AI/ML Contributions

### Python Code Standards

```python
"""
AI Engine module for inventory prediction
"""
import numpy as np
import pandas as pd
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class InventoryPrediction:
    """Represents an inventory prediction result"""
    product_id: str
    predicted_quantity: int
    confidence_score: float
    suggested_reorder_date: str

class InventoryPredictor:
    """Predicts inventory needs using machine learning"""
    
    def __init__(self, model_path: Optional[str] = None):
        """Initialize the predictor with optional pre-trained model"""
        self.model = self._load_model(model_path)
    
    def predict_inventory_needs(
        self, 
        sales_data: pd.DataFrame,
        current_inventory: Dict[str, int]
    ) -> List[InventoryPrediction]:
        """
        Predict inventory needs for the next period
        
        Args:
            sales_data: Historical sales data
            current_inventory: Current inventory levels
            
        Returns:
            List of inventory predictions
        """
        # Implementation here
        pass
```

### Model Development Guidelines

1. **Data Preprocessing**: Clean and validate all input data
2. **Model Validation**: Use cross-validation and proper metrics
3. **Documentation**: Document model architecture and parameters
4. **Versioning**: Track model versions and performance
5. **Testing**: Include unit tests for all functions

## Resources

- [Project Roadmap](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Integration Guide](./docs/integrations.md)

## Getting Help

- Create an issue for bugs or feature requests
- Join our Discord community (link coming soon)
- Email the maintainers: dev@baddie-reseller.com

## Recognition

Contributors will be recognized in our README and receive contributor badges. Significant contributions may be eligible for special recognition.

Thank you for contributing to Baddie Reseller! 🚀💎