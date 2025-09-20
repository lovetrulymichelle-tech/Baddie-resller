"""
💎✨ Baddie Reseller AI Agent Core ✨💎
The main AI agent implementation following the 10-step checklist.
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from openai import OpenAI
from config import BaddieConfig
from memory import BaddieMemory

# Set up logging
logging.basicConfig(level=getattr(logging, BaddieConfig.LOG_LEVEL))
logger = logging.getLogger(__name__)

class BaddieAgent:
    """
    💎 The Baddie Reseller AI Agent 💎
    
    Step 4 Implementation: Input → Add Context → AI → Output → Action → Save
    """
    
    def __init__(self):
        # Validate configuration
        if not BaddieConfig.validate_config():
            raise ValueError("Invalid configuration. Please check your .env file.")
        
        # Initialize OpenAI client
        self.client = OpenAI(api_key=BaddieConfig.OPENAI_API_KEY)
        self.model = BaddieConfig.OPENAI_MODEL
        
        # Initialize memory system
        self.memory = BaddieMemory()
        
        # Step 1: Agent capabilities
        self.capabilities = {
            "product_ideas": "Generate stunning product ideas and market research",
            "content_creation": "Create fabulous content for websites & social media",
            "automation": "Automate Shopify/Stripe tasks and workflows",
            "customer_service": "Respond to customer inquiries with style",
            "optimization": "Optimize reselling operations and strategies"
        }
        
        logger.info(f"💎 {BaddieConfig.AGENT_NAME} initialized successfully! ✨")
    
    def process_request(self, user_input: str, task_type: str = "general") -> Dict[str, Any]:
        """
        Main workflow: Input → Add Context → AI → Output → Action → Save
        
        Args:
            user_input: The user's request or question
            task_type: Type of task (product_ideas, content_creation, automation, etc.)
        
        Returns:
            Dict containing the processed response and metadata
        """
        try:
            # Step 1: Input received
            logger.info(f"Processing request: {task_type}")
            
            # Step 2: Add Context
            context = self._add_context(user_input, task_type)
            
            # Step 3: AI Processing
            ai_response = self._get_ai_response(user_input, context, task_type)
            
            # Step 4: Format Output
            formatted_output = self._format_output(ai_response, task_type)
            
            # Step 5: Take Action (if needed)
            action_result = self._take_action(formatted_output, task_type)
            
            # Step 6: Save to Memory
            conversation_id = self.memory.save_conversation(
                user_input=user_input,
                ai_response=ai_response,
                task_type=task_type
            )
            
            # Save output data
            output_data = {
                "user_input": user_input,
                "ai_response": ai_response,
                "formatted_output": formatted_output,
                "action_result": action_result,
                "task_type": task_type
            }
            
            output_id = self.memory.save_output(output_data, task_type)
            
            return {
                "success": True,
                "response": formatted_output,
                "task_type": task_type,
                "conversation_id": conversation_id,
                "output_id": output_id,
                "action_taken": action_result is not None,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error processing request: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "task_type": task_type,
                "timestamp": datetime.now().isoformat()
            }
    
    def _add_context(self, user_input: str, task_type: str) -> Dict[str, Any]:
        """Add relevant context from memory and configuration"""
        context = {
            "agent_capabilities": self.capabilities,
            "task_type": task_type,
            "brand_style": BaddieConfig.BRAND_STYLE,
            "recent_conversations": self.memory.get_recent_conversations(limit=5),
            "relevant_context": self.memory.get_context(task_type)
        }
        
        # Add task-specific context
        if task_type == "product_ideas":
            context["focus"] = "trending products, market demand, profitability"
        elif task_type == "content_creation":
            context["focus"] = "engaging copy, visual descriptions, call-to-actions"
        elif task_type == "automation":
            context["focus"] = "workflow optimization, API integrations, efficiency"
        elif task_type == "customer_service":
            context["focus"] = "professional responses, problem-solving, satisfaction"
        
        return context
    
    def _get_ai_response(self, user_input: str, context: Dict[str, Any], task_type: str) -> str:
        """Get response from OpenAI with Baddie branding"""
        system_prompt = BaddieConfig.get_system_prompt()
        
        # Add context to the prompt
        context_prompt = f"""
        
        CURRENT TASK: {task_type}
        FOCUS AREA: {context.get('focus', 'general assistance')}
        
        RECENT CONVERSATION CONTEXT:
        {self._format_conversation_context(context.get('recent_conversations', []))}
        
        Please respond with your signature Baddie style while being helpful and actionable.
        """
        
        messages = [
            {"role": "system", "content": system_prompt + context_prompt},
            {"role": "user", "content": user_input}
        ]
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        return response.choices[0].message.content
    
    def _format_output(self, ai_response: str, task_type: str) -> Dict[str, Any]:
        """Format the AI response for different output types"""
        formatted = {
            "text": ai_response,
            "task_type": task_type,
            "timestamp": datetime.now().isoformat(),
            "formatted_for": []
        }
        
        # Add task-specific formatting
        if task_type == "content_creation":
            formatted["social_media_ready"] = self._format_for_social_media(ai_response)
            formatted["formatted_for"].append("social_media")
        
        if task_type == "product_ideas":
            formatted["product_list"] = self._extract_product_ideas(ai_response)
            formatted["formatted_for"].append("product_research")
        
        return formatted
    
    def _take_action(self, formatted_output: Dict[str, Any], task_type: str) -> Optional[Dict[str, Any]]:
        """Take automated actions based on the output (placeholder for future integrations)"""
        # This is where Step 7 automation would be implemented
        # For now, we'll just log the action that would be taken
        
        potential_actions = {
            "content_creation": "Could auto-post to social media platforms",
            "product_ideas": "Could add to product research database",
            "automation": "Could trigger workflow automation",
            "customer_service": "Could send automated response to customer"
        }
        
        if task_type in potential_actions:
            logger.info(f"Action available: {potential_actions[task_type]}")
            return {
                "action_type": "logged",
                "description": potential_actions[task_type],
                "status": "ready_for_implementation"
            }
        
        return None
    
    def _format_conversation_context(self, conversations: List[Dict[str, Any]]) -> str:
        """Format recent conversations for context"""
        if not conversations:
            return "No recent conversation history."
        
        context_lines = []
        for conv in conversations[-3:]:  # Last 3 conversations
            context_lines.append(f"User: {conv.get('user_input', '')[:100]}...")
            context_lines.append(f"Assistant: {conv.get('ai_response', '')[:100]}...")
        
        return "\n".join(context_lines)
    
    def _format_for_social_media(self, content: str) -> Dict[str, str]:
        """Format content for different social media platforms"""
        # Extract key points and create platform-specific versions
        return {
            "instagram": f"📸 {content[:280]}... #BaddieReseller #Entrepreneur",
            "twitter": f"🔥 {content[:250]}... #BossUp #Reseller",
            "linkedin": f"Professional insight: {content[:500]}...",
            "tiktok": f"💎 Quick tip: {content[:150]}... #BusinessTips"
        }
    
    def _extract_product_ideas(self, content: str) -> List[str]:
        """Extract product ideas from AI response"""
        # Simple extraction - could be enhanced with more sophisticated parsing
        lines = content.split('\n')
        ideas = []
        
        for line in lines:
            if any(indicator in line.lower() for indicator in ['•', '-', '1.', '2.', '3.', 'product:', 'idea:']):
                cleaned = line.strip('•-1234567890. ').strip()
                if cleaned and len(cleaned) > 10:
                    ideas.append(cleaned)
        
        return ideas[:10]  # Limit to top 10 ideas
    
    def get_capabilities(self) -> Dict[str, str]:
        """Return agent capabilities"""
        return self.capabilities
    
    def get_memory_stats(self) -> Dict[str, Any]:
        """Get memory usage statistics"""
        return self.memory.get_memory_stats()
    
    def clear_memory(self, memory_type: str = "conversations"):
        """Clear specific memory type"""
        self.memory.clear_memory(memory_type)
        logger.info(f"Cleared {memory_type} memory")