"""
💎✨ Baddie Reseller AI Agent - Main Entry Point ✨💎
Step 10 Implementation: Deployment & Monitoring
"""

import os
import sys
import logging
from datetime import datetime
from config import BaddieConfig
from cli import BaddieCLI

# Configure logging
def setup_logging():
    """Set up logging configuration"""
    log_level = getattr(logging, BaddieConfig.LOG_LEVEL)
    
    # Create logs directory if it doesn't exist
    os.makedirs("logs", exist_ok=True)
    
    # Configure logging
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(f"logs/baddie_agent_{datetime.now().strftime('%Y%m%d')}.log"),
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    logger = logging.getLogger(__name__)
    logger.info("💎 Baddie Reseller AI Agent logging initialized ✨")

def check_environment():
    """Check if environment is properly configured"""
    logger = logging.getLogger(__name__)
    
    if not BaddieConfig.validate_config():
        logger.error("❌ Environment configuration is invalid!")
        print("\n🚨 CONFIGURATION ERROR 🚨")
        print("─" * 40)
        print("Please set up your environment:")
        print("1. Copy .env.example to .env")
        print("2. Add your OPENAI_API_KEY to .env")
        print("3. Optionally add other API keys for integrations")
        print("─" * 40)
        return False
    
    logger.info("✅ Environment configuration is valid")
    return True

def print_startup_info():
    """Print startup information"""
    print("\n" + "="*60)
    print("💎✨ BADDIE RESELLER AI AGENT ✨💎")
    print("="*60)
    print(f"🤖 Agent: {BaddieConfig.AGENT_NAME}")
    print(f"🌍 Environment: {BaddieConfig.DEPLOYMENT_ENV}")
    print(f"🧠 Memory Type: {BaddieConfig.STORAGE_TYPE}")
    print(f"📊 Memory Limit: {BaddieConfig.MEMORY_LIMIT}")
    print(f"📝 Log Level: {BaddieConfig.LOG_LEVEL}")
    
    if BaddieConfig.DEPLOYMENT_ENV == "development":
        print("🔧 Development Mode - All features enabled")
    else:
        print("🚀 Production Mode - Optimized for performance")
    
    print("="*60)

def main():
    """Main entry point for Baddie Reseller AI Agent"""
    try:
        # Setup logging
        setup_logging()
        logger = logging.getLogger(__name__)
        
        # Print startup info
        print_startup_info()
        
        # Check environment
        if not check_environment():
            sys.exit(1)
        
        # Start CLI interface
        logger.info("🚀 Starting Baddie Reseller AI Agent CLI...")
        cli = BaddieCLI()
        cli.run()
        
    except KeyboardInterrupt:
        print("\n👋 Baddie Reseller AI Agent shutting down gracefully...")
        logger = logging.getLogger(__name__)
        logger.info("💋 Agent shutdown via keyboard interrupt")
        
    except Exception as e:
        logger = logging.getLogger(__name__)
        logger.error(f"💥 Fatal error: {str(e)}", exc_info=True)
        print(f"\n❌ Fatal Error: {str(e)}")
        print("Please check the logs for more details.")
        sys.exit(1)

if __name__ == "__main__":
    main()