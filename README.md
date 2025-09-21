# Baddie Reseller 💎✨

AI-Powered Refiller App for Digital Entrepreneurs and Resellers

[![CI/CD Pipeline](https://github.com/lovetrulymichelle-tech/Baddie-resller/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/lovetrulymichelle-tech/Baddie-resller/actions/workflows/ci-cd.yml)
[![Coverage Status](https://codecov.io/gh/lovetrulymichelle-tech/Baddie-resller/branch/main/graph/badge.svg)](https://codecov.io/gh/lovetrulymichelle-tech/Baddie-resller)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Overview

Baddie Reseller is an AI-powered platform designed to help digital entrepreneurs and resellers automate product refilling, listings, and operations. Built with React 18, TypeScript, and the Gemini AI Live API, it provides real-time voice interaction, automated customer service, and intelligent business optimization.

## ✨ Features

- **AI-Powered Product Recommendations** - Smart suggestions based on market trends
- **Automated Listing Management** - Streamline your product listings across platforms
- **Real-Time Voice Interaction** - Natural language processing with audio input/output
- **Customer Service Automation** - AI agents for handling customer inquiries
- **Inventory Optimization** - Smart inventory management and alerts
- **Marketing Campaign Generation** - AI-driven marketing content creation

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with modern features
- **AI Integration**: Gemini AI Live API
- **Audio Processing**: Web Audio API with AudioWorklets
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + TypeScript ESLint
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel, Railway, AWS

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm or yarn
- Modern browser with Web Audio API support (Chrome >= 88, Firefox >= 78, Safari >= 14, Edge >= 88)

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/lovetrulymichelle-tech/Baddie-resller.git
cd Baddie-resller

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env.local

# Configure your environment variables
# Edit .env.local with your API keys and settings
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview

# Health check
npm run health-check
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Required
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GEMINI_MODEL=gemini-pro
VITE_ENABLE_DEBUG_MODE=true
```

### Audio Configuration

The application supports various audio configurations:

```typescript
export const AUDIO_CONFIG = {
  sampleRate: 16000,     // Audio sample rate
  channels: 1,           // Mono audio
  bufferSize: 1024,      // Buffer size for processing
  maxRecordingTime: 300000 // 5 minutes max recording
}
```

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
npm run deploy:vercel
```

### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy to Railway
npm run deploy:railway
```

### AWS Deployment

See [aws-deployment.md](./aws-deployment.md) for detailed AWS deployment instructions using CloudFormation.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Test Coverage

Current test coverage targets:
- Statements: 50%
- Branches: 50%
- Functions: 50%
- Lines: 50%

### Writing Tests

Tests are located in `__tests__` directories alongside source files. Example:

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

## 🔒 Security

### Content Security Policy

The application implements a strict CSP:

```
default-src 'self'; 
script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
style-src 'self' 'unsafe-inline'; 
img-src 'self' data: blob:; 
connect-src 'self' wss: ws:; 
worker-src 'self' blob:;
```

### Security Headers

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 📊 Monitoring & Analytics

### Health Checks

Health check endpoint available at `/health.json`:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "frontend": "healthy",
    "build": "success"
  }
}
```

### Error Reporting

The application includes an error boundary component for production error handling. Configure Sentry or similar services for error monitoring.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow TypeScript strict mode
- Use semantic commit messages
- Ensure all CI checks pass
- Update documentation as needed

## 📝 API Documentation

### Agent Management

```typescript
// Create a custom agent
const agent = createCustomAgent(
  'My Custom Agent',
  'helpful and professional',
  'You are a specialized assistant for...'
);

// Use preset agents
const expert = getPresetAgent('reseller-expert');
```

### AI Client Usage

```typescript
const client = new GenAILiveClient({
  apiKey: 'your-api-key',
  model: 'gemini-pro'
});

await client.connect();
const response = await client.sendMessage('How can I optimize my inventory?');
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Gemini AI for providing the AI capabilities
- React team for the excellent framework
- Vite team for the fast build tool
- All contributors and supporters

## 📞 Support

- 📧 Email: support@baddie-reseller.com
- 💬 Discord: [Join our community](https://discord.gg/baddie-reseller)
- 📖 Documentation: [Full documentation](https://docs.baddie-reseller.com)
- 🐛 Issues: [GitHub Issues](https://github.com/lovetrulymichelle-tech/Baddie-resller/issues)

---

**Made with 💎 by the Baddie Tech Team**
