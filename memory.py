"""
💎✨ Baddie Reseller AI Agent Memory System ✨💎
Handles storage and retrieval of conversation history and context.
"""

import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from config import BaddieConfig

class BaddieMemory:
    """Memory management system for the Baddie Reseller AI Agent"""
    
    def __init__(self):
        self.memory_dir = BaddieConfig.MEMORY_DIR
        self.memory_limit = BaddieConfig.MEMORY_LIMIT
        self.storage_type = BaddieConfig.STORAGE_TYPE
        
        # Create memory directory if it doesn't exist
        os.makedirs(self.memory_dir, exist_ok=True)
        
        # Initialize memory files
        self.conversation_file = os.path.join(self.memory_dir, "conversations.json")
        self.context_file = os.path.join(self.memory_dir, "context.json")
        self.outputs_file = os.path.join(self.memory_dir, "outputs.json")
        
        self._initialize_memory_files()
    
    def _initialize_memory_files(self):
        """Initialize memory files if they don't exist"""
        files_to_init = [self.conversation_file, self.context_file, self.outputs_file]
        
        for file_path in files_to_init:
            if not os.path.exists(file_path):
                with open(file_path, 'w') as f:
                    json.dump([], f)
    
    def save_conversation(self, user_input: str, ai_response: str, task_type: str = "general") -> str:
        """Save a conversation exchange to memory"""
        conversation_entry = {
            "id": self._generate_id(),
            "timestamp": datetime.now().isoformat(),
            "user_input": user_input,
            "ai_response": ai_response,
            "task_type": task_type,
            "session_id": self._get_current_session_id()
        }
        
        # Load existing conversations
        conversations = self._load_json_file(self.conversation_file)
        
        # Add new conversation
        conversations.append(conversation_entry)
        
        # Maintain memory limit
        if len(conversations) > self.memory_limit:
            conversations = conversations[-self.memory_limit:]
        
        # Save back to file
        self._save_json_file(self.conversation_file, conversations)
        
        return conversation_entry["id"]
    
    def save_output(self, output_data: Dict[str, Any], output_type: str = "general") -> str:
        """Save AI output data for future reference"""
        output_entry = {
            "id": self._generate_id(),
            "timestamp": datetime.now().isoformat(),
            "output_type": output_type,
            "data": output_data,
            "session_id": self._get_current_session_id()
        }
        
        # Load existing outputs
        outputs = self._load_json_file(self.outputs_file)
        
        # Add new output
        outputs.append(output_entry)
        
        # Maintain memory limit
        if len(outputs) > self.memory_limit:
            outputs = outputs[-self.memory_limit:]
        
        # Save back to file
        self._save_json_file(self.outputs_file, outputs)
        
        return output_entry["id"]
    
    def save_context(self, context_key: str, context_data: Any):
        """Save contextual information that persists across sessions"""
        context_entry = {
            "key": context_key,
            "data": context_data,
            "timestamp": datetime.now().isoformat(),
            "updated_by": self._get_current_session_id()
        }
        
        # Load existing context
        context = self._load_json_file(self.context_file)
        
        # Update or add context
        updated = False
        for i, entry in enumerate(context):
            if entry["key"] == context_key:
                context[i] = context_entry
                updated = True
                break
        
        if not updated:
            context.append(context_entry)
        
        # Save back to file
        self._save_json_file(self.context_file, context)
    
    def get_recent_conversations(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent conversation history"""
        conversations = self._load_json_file(self.conversation_file)
        return conversations[-limit:] if conversations else []
    
    def get_context(self, context_key: str = None) -> Any:
        """Get stored context data"""
        context = self._load_json_file(self.context_file)
        
        if context_key:
            for entry in context:
                if entry["key"] == context_key:
                    return entry["data"]
            return None
        
        return context
    
    def get_conversation_history(self, task_type: str = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Get conversation history, optionally filtered by task type"""
        conversations = self._load_json_file(self.conversation_file)
        
        if task_type:
            filtered = [conv for conv in conversations if conv.get("task_type") == task_type]
            return filtered[-limit:] if filtered else []
        
        return conversations[-limit:] if conversations else []
    
    def clear_memory(self, memory_type: str = "all"):
        """Clear memory data"""
        if memory_type == "all" or memory_type == "conversations":
            self._save_json_file(self.conversation_file, [])
        
        if memory_type == "all" or memory_type == "outputs":
            self._save_json_file(self.outputs_file, [])
        
        if memory_type == "all" or memory_type == "context":
            self._save_json_file(self.context_file, [])
    
    def get_memory_stats(self) -> Dict[str, Any]:
        """Get memory usage statistics"""
        conversations = self._load_json_file(self.conversation_file)
        outputs = self._load_json_file(self.outputs_file)
        context = self._load_json_file(self.context_file)
        
        return {
            "conversations_count": len(conversations),
            "outputs_count": len(outputs),
            "context_entries": len(context),
            "memory_limit": self.memory_limit,
            "storage_type": self.storage_type,
            "memory_dir": self.memory_dir
        }
    
    def _load_json_file(self, file_path: str) -> List[Dict[str, Any]]:
        """Load data from JSON file"""
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []
    
    def _save_json_file(self, file_path: str, data: List[Dict[str, Any]]):
        """Save data to JSON file"""
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
    
    def _generate_id(self) -> str:
        """Generate a unique ID for memory entries"""
        return f"baddie_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
    
    def _get_current_session_id(self) -> str:
        """Get current session ID"""
        return f"session_{datetime.now().strftime('%Y%m%d_%H%M')}"