#!/bin/bash
# 💎✨ Baddie Reseller AI Agent Runner ✨💎

echo "💎✨ Starting Baddie Reseller AI Agent ✨💎"
echo "============================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Run ./setup.sh first to set up the environment."
    exit 1
fi

# Check if OPENAI_API_KEY is set
if ! grep -q "OPENAI_API_KEY=.*[^[:space:]]" .env; then
    echo "⚠️  OPENAI_API_KEY not set in .env file!"
    echo "Please add your OpenAI API key to .env file:"
    echo "OPENAI_API_KEY=your_api_key_here"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Ask user which interface to use
echo "Choose interface:"
echo "1) CLI (Command Line Interface)"
echo "2) Web App (Browser Interface)"
echo "3) Run Tests"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Starting CLI interface..."
        python3 main.py
        ;;
    2)
        echo "🌐 Starting web interface..."
        echo "Open http://localhost:8000 in your browser"
        python3 app.py
        ;;
    3)
        echo "🧪 Running tests..."
        python3 -m pytest test_baddie_agent.py -v
        ;;
    *)
        echo "❌ Invalid choice. Defaulting to CLI..."
        python3 main.py
        ;;
esac