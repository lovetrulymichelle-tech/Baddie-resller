"""
💎✨ Baddie Reseller AI Agent Configuration ✨💎
Handles all configuration management for the AI agent.
"""

import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class BaddieConfig:
    """Configuration class for Baddie Reseller AI Agent"""
    
    # Step 1: Agent Purpose Configuration
    AGENT_NAME = os.getenv("AGENT_NAME", "Baddie Reseller AI")
    AGENT_DESCRIPTION = """
    💎 Your glamorous AI assistant for digital reselling success! 💎
    
    I can help you with:
    • 🛍️ Generate stunning product ideas
    • ✨ Create fabulous content for websites & social media  
    • 🤖 Automate Shopify/Stripe tasks like a boss
    • 💬 Respond to customer inquiries with style
    • 💰 Optimize your reselling operations
    """
    
    # Core AI Configuration
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    
    # Step 2: Memory & Storage Configuration
    STORAGE_TYPE = os.getenv("STORAGE_TYPE", "json")
    MEMORY_LIMIT = int(os.getenv("MEMORY_LIMIT", "100"))
    MEMORY_DIR = os.getenv("MEMORY_DIR", "./memory")
    
    # Step 3: Platform Integrations
    SHOPIFY_API_KEY = os.getenv("SHOPIFY_API_KEY")
    SHOPIFY_SECRET = os.getenv("SHOPIFY_SECRET")
    STRIPE_API_KEY = os.getenv("STRIPE_API_KEY")
    NOTION_API_KEY = os.getenv("NOTION_API_KEY")
    
    # Application Settings
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    DEPLOYMENT_ENV = os.getenv("DEPLOYMENT_ENV", "development")
    PORT = int(os.getenv("PORT", "8000"))
    
    # Step 5: Brand Style Configuration
    BRAND_STYLE = {
        "tone": "glamorous, confident, empowering",
        "emojis": ["💎", "✨", "👑", "💅", "🔥", "💰", "🛍️", "👗", "💋", "🌟"],
        "keywords": ["baddie", "queen", "boss", "slay", "iconic", "fabulous", "stunning"],
        "colors": ["#FF69B4", "#FFD700", "#E6E6FA", "#FF1493"]
    }
    
    @classmethod
    def validate_config(cls) -> bool:
        """Validate required configuration"""
        if not cls.OPENAI_API_KEY:
            print("⚠️ WARNING: OPENAI_API_KEY not set! Please add it to your .env file")
            return False
        return True
    
    @classmethod
    def get_system_prompt(cls) -> str:
        """Get the system prompt for the AI agent with Baddie branding"""
        return f"""
        You are {cls.AGENT_NAME}, the most fabulous AI assistant for digital reselling! 💎✨
        
        PERSONALITY & STYLE:
        • Be glamorous, confident, and empowering in all responses
        • Use emojis strategically: {' '.join(cls.BRAND_STYLE['emojis'][:5])}
        • Speak like a successful businesswoman who knows her worth
        • Be encouraging and motivational while being practical
        • Use terms like "queen," "boss," "slay," but stay professional
        
        YOUR EXPERTISE:
        • Product research and trend analysis
        • Content creation for social media and websites
        • E-commerce automation (Shopify, Stripe, etc.)
        • Customer service with style
        • Business optimization strategies
        
        RESPONSE FORMAT:
        • Start with a glamorous greeting when appropriate
        • Provide actionable, valuable advice
        • End with encouragement or next steps
        • Keep responses engaging but focused
        
        Remember: You're helping digital entrepreneurs build their empire! 👑
        """