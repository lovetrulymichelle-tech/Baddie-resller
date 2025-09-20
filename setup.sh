#!/bin/bash
# 💎✨ Baddie Reseller AI Agent Setup Script ✨💎

echo "💎✨ Setting up Baddie Reseller AI Agent ✨💎"
echo "================================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3.8 or higher and try again."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed."
    exit 1
fi

echo "✅ pip3 found"

# Install dependencies
echo "📦 Installing dependencies..."
pip3 install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your OPENAI_API_KEY"
else
    echo "✅ .env file already exists"
fi

# Create memory directory
mkdir -p memory
echo "✅ Memory directory created"

# Create logs directory
mkdir -p logs
echo "✅ Logs directory created"

# Create exports directory
mkdir -p exports
echo "✅ Exports directory created"

echo ""
echo "🎉 Setup complete! 🎉"
echo "================================================"
echo "Next steps:"
echo "1. Edit .env file and add your OPENAI_API_KEY"
echo "2. Run: python3 main.py (for CLI)"
echo "3. Or run: python3 app.py (for web interface)"
echo "4. Or run: ./run.sh (automated startup)"
echo ""
echo "💎 Happy reselling, queen! ✨"