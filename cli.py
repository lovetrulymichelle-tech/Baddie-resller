#!/usr/bin/env python3
"""
💎✨ Baddie Reseller AI Agent CLI ✨💎
Command-line interface for the Baddie Reseller AI Agent
Step 8 Implementation: Basic CLI Interface
"""

import sys
import json
from typing import Dict, Any
from agent import BaddieAgent
from config import BaddieConfig

class BaddieCLI:
    """Command-line interface for Baddie Reseller AI Agent"""
    
    def __init__(self):
        try:
            self.agent = BaddieAgent()
            self.running = True
            self.print_welcome()
        except Exception as e:
            print(f"❌ Failed to initialize Baddie Agent: {e}")
            print("💡 Make sure you have set your OPENAI_API_KEY in .env file")
            sys.exit(1)
    
    def print_welcome(self):
        """Print welcome message with Baddie style"""
        print("\n" + "="*60)
        print("💎✨ WELCOME TO BADDIE RESELLER AI AGENT ✨💎")
        print("="*60)
        print(f"🤖 Agent: {BaddieConfig.AGENT_NAME}")
        print("👑 Your glamorous AI assistant for reselling success!")
        print("\n💅 Available Commands:")
        print("  • 'help' - Show all commands")
        print("  • 'capabilities' - Show what I can do")
        print("  • 'memory' - Check memory stats")
        print("  • 'clear' - Clear conversation memory")
        print("  • 'quit' or 'exit' - Leave (but why would you? 😘)")
        print("\n🛍️ Task Types:")
        print("  • product_ideas - Generate product ideas")
        print("  • content_creation - Create social media content")  
        print("  • automation - Workflow automation help")
        print("  • customer_service - Customer inquiry responses")
        print("  • general - General business advice")
        print("\nExample: 'task:content_creation Help me write an Instagram post about trendy jewelry'")
        print("="*60 + "\n")
    
    def run(self):
        """Main CLI loop"""
        while self.running:
            try:
                user_input = input("💎 Baddie > ").strip()
                
                if not user_input:
                    continue
                
                # Handle commands
                if user_input.lower() in ['quit', 'exit', 'bye']:
                    self.handle_quit()
                elif user_input.lower() == 'help':
                    self.handle_help()
                elif user_input.lower() == 'capabilities':
                    self.handle_capabilities()
                elif user_input.lower() == 'memory':
                    self.handle_memory()
                elif user_input.lower() == 'clear':
                    self.handle_clear()
                else:
                    # Process AI request
                    self.process_ai_request(user_input)
                    
            except KeyboardInterrupt:
                print("\n💋 Caught you trying to leave! Type 'quit' to exit properly.")
            except Exception as e:
                print(f"❌ Error: {e}")
    
    def process_ai_request(self, user_input: str):
        """Process user request through the AI agent"""
        # Parse task type if specified
        task_type = "general"
        actual_input = user_input
        
        if user_input.lower().startswith("task:"):
            parts = user_input.split(" ", 1)
            if len(parts) > 1:
                task_type = parts[0][5:]  # Remove "task:" prefix
                actual_input = parts[1]
        
        print("✨ Processing your request...")
        
        # Send to agent
        result = self.agent.process_request(actual_input, task_type)
        
        if result["success"]:
            self.display_response(result)
        else:
            print(f"❌ Error processing request: {result.get('error', 'Unknown error')}")
    
    def display_response(self, result: Dict[str, Any]):
        """Display the AI agent's response with styling"""
        print("\n" + "─"*50)
        print(f"💎 Task Type: {result['task_type'].title()}")
        print("─"*50)
        
        response = result["response"]
        
        if isinstance(response, dict):
            # Display formatted response
            print(response.get("text", ""))
            
            # Show additional formatting if available
            if "social_media_ready" in response:
                print("\n📱 Social Media Versions:")
                for platform, content in response["social_media_ready"].items():
                    print(f"  🔹 {platform.title()}: {content}")
            
            if "product_list" in response:
                print("\n🛍️ Product Ideas Extracted:")
                for i, idea in enumerate(response["product_list"], 1):
                    print(f"  {i}. {idea}")
        else:
            print(response)
        
        print("─"*50)
        print(f"⏰ Response ID: {result.get('output_id', 'N/A')}")
        if result.get("action_taken"):
            print("🤖 Automation action available!")
        print("─"*50 + "\n")
    
    def handle_help(self):
        """Display help information"""
        print("\n💅 BADDIE RESELLER AI COMMANDS:")
        print("─"*40)
        print("🔹 help - Show this help message")
        print("🔹 capabilities - List what I can do for you")
        print("🔹 memory - Show memory usage stats")
        print("🔹 clear - Clear conversation memory")
        print("🔹 quit/exit - Exit the application")
        print("\n💎 TASK TYPES:")
        print("🔹 task:product_ideas [request] - Product research & ideas")
        print("🔹 task:content_creation [request] - Social media content")
        print("🔹 task:automation [request] - Workflow automation")
        print("🔹 task:customer_service [request] - Customer responses")
        print("🔹 [any request] - General business advice")
        print("\n✨ EXAMPLES:")
        print("• task:product_ideas What trending jewelry should I sell?")
        print("• task:content_creation Write a post about summer fashion")
        print("• How do I increase my profit margins?")
        print("─"*40 + "\n")
    
    def handle_capabilities(self):
        """Display agent capabilities"""
        capabilities = self.agent.get_capabilities()
        print("\n👑 MY BADDIE CAPABILITIES:")
        print("─"*40)
        for key, description in capabilities.items():
            emoji = self.get_capability_emoji(key)
            print(f"{emoji} {key.replace('_', ' ').title()}")
            print(f"   └─ {description}")
        print("─"*40 + "\n")
    
    def handle_memory(self):
        """Display memory statistics"""
        stats = self.agent.get_memory_stats()
        print("\n🧠 MEMORY STATS:")
        print("─"*30)
        print(f"💬 Conversations: {stats['conversations_count']}")
        print(f"📊 Outputs Saved: {stats['outputs_count']}")
        print(f"🗂️ Context Entries: {stats['context_entries']}")
        print(f"📝 Memory Limit: {stats['memory_limit']}")
        print(f"💾 Storage Type: {stats['storage_type']}")
        print("─"*30 + "\n")
    
    def handle_clear(self):
        """Clear conversation memory"""
        confirm = input("🗑️ Clear conversation memory? (y/N): ").lower()
        if confirm in ['y', 'yes']:
            self.agent.clear_memory("conversations")
            print("✨ Conversation memory cleared! Fresh start, queen! 💅")
        else:
            print("💎 Memory preserved!")
    
    def handle_quit(self):
        """Handle quit command"""
        print("\n💋 Thanks for using Baddie Reseller AI!")
        print("👑 Keep slaying in your business, queen!")
        print("✨ Come back anytime for more fabulous advice! 💎")
        self.running = False
    
    def get_capability_emoji(self, capability: str) -> str:
        """Get emoji for capability type"""
        emoji_map = {
            "product_ideas": "🛍️",
            "content_creation": "✨", 
            "automation": "🤖",
            "customer_service": "💬",
            "optimization": "💰"
        }
        return emoji_map.get(capability, "💎")

def main():
    """Main entry point"""
    try:
        cli = BaddieCLI()
        cli.run()
    except Exception as e:
        print(f"❌ Failed to start Baddie CLI: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()