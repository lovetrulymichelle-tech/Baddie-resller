"""
💎✨ Baddie Reseller AI Agent Tests ✨💎
Step 9 Implementation: Testing & Refinement Framework
"""

import pytest
import json
import os
import tempfile
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime

# Import modules to test
from config import BaddieConfig
from memory import BaddieMemory
from agent import BaddieAgent
from automation import BaddieAutomation

class TestBaddieConfig:
    """Test configuration management"""
    
    def test_config_initialization(self):
        """Test that config initializes with defaults"""
        assert BaddieConfig.AGENT_NAME == "Baddie Reseller AI"
        assert BaddieConfig.STORAGE_TYPE == "json"
        assert BaddieConfig.MEMORY_LIMIT == 100
        
    def test_brand_style_configuration(self):
        """Test brand style settings"""
        brand_style = BaddieConfig.BRAND_STYLE
        assert "tone" in brand_style
        assert "emojis" in brand_style
        assert "keywords" in brand_style
        assert brand_style["tone"] == "glamorous, confident, empowering"
        
    def test_system_prompt_generation(self):
        """Test system prompt generation"""
        prompt = BaddieConfig.get_system_prompt()
        assert "Baddie Reseller AI" in prompt
        assert "💎✨" in prompt
        assert "glamorous" in prompt
        assert "queen" in prompt

class TestBaddieMemory:
    """Test memory system functionality"""
    
    @pytest.fixture
    def temp_memory_dir(self):
        """Create temporary directory for testing"""
        with tempfile.TemporaryDirectory() as temp_dir:
            yield temp_dir
    
    @pytest.fixture
    def memory_instance(self, temp_memory_dir, monkeypatch):
        """Create memory instance with temporary directory"""
        monkeypatch.setattr(BaddieConfig, 'MEMORY_DIR', temp_memory_dir)
        return BaddieMemory()
    
    def test_memory_initialization(self, memory_instance):
        """Test memory system initialization"""
        assert os.path.exists(memory_instance.memory_dir)
        assert os.path.exists(memory_instance.conversation_file)
        assert os.path.exists(memory_instance.context_file)
        assert os.path.exists(memory_instance.outputs_file)
    
    def test_save_conversation(self, memory_instance):
        """Test saving conversations"""
        conv_id = memory_instance.save_conversation(
            user_input="Test question",
            ai_response="Test response",
            task_type="test"
        )
        
        assert conv_id.startswith("baddie_")
        
        # Check conversation was saved
        conversations = memory_instance.get_recent_conversations(1)
        assert len(conversations) == 1
        assert conversations[0]["user_input"] == "Test question"
        assert conversations[0]["ai_response"] == "Test response"
        assert conversations[0]["task_type"] == "test"
    
    def test_save_context(self, memory_instance):
        """Test saving context data"""
        memory_instance.save_context("test_key", {"data": "test_value"})
        
        # Retrieve context
        context_data = memory_instance.get_context("test_key")
        assert context_data == {"data": "test_value"}
    
    def test_memory_limit(self, memory_instance):
        """Test memory limit enforcement"""
        # Set a small limit for testing
        memory_instance.memory_limit = 3
        
        # Add more conversations than the limit
        for i in range(5):
            memory_instance.save_conversation(f"Question {i}", f"Response {i}")
        
        # Should only keep the last 3
        conversations = memory_instance.get_recent_conversations(10)
        assert len(conversations) == 3
        assert conversations[0]["user_input"] == "Question 2"
        assert conversations[-1]["user_input"] == "Question 4"
    
    def test_memory_stats(self, memory_instance):
        """Test memory statistics"""
        # Add some data
        memory_instance.save_conversation("Test", "Response")
        memory_instance.save_context("test", "data")
        
        stats = memory_instance.get_memory_stats()
        assert stats["conversations_count"] == 1
        assert stats["context_entries"] == 1
        assert "memory_limit" in stats
    
    def test_clear_memory(self, memory_instance):
        """Test clearing memory"""
        # Add some data
        memory_instance.save_conversation("Test", "Response")
        
        # Clear conversations
        memory_instance.clear_memory("conversations")
        
        # Should be empty now
        conversations = memory_instance.get_recent_conversations()
        assert len(conversations) == 0

class TestBaddieAutomation:
    """Test automation framework"""
    
    @pytest.fixture
    def automation_instance(self):
        """Create automation instance"""
        return BaddieAutomation()
    
    def test_automation_initialization(self, automation_instance):
        """Test automation system initialization"""
        assert hasattr(automation_instance, 'available_integrations')
        assert "content_posting" in automation_instance.available_integrations
        assert "data_export" in automation_instance.available_integrations
    
    def test_get_automation_types(self, automation_instance):
        """Test getting available automation types"""
        types = automation_instance.get_automation_types()
        assert "content_post" in types
        assert "data_export" in types
        assert "email_send" in types
    
    def test_content_post_automation(self, automation_instance):
        """Test content posting automation"""
        content_data = {
            "content": "Test post content 💎",
            "platforms": ["instagram", "twitter"],
            "hashtags": ["#test", "#baddie"]
        }
        
        result = automation_instance.execute_automation("content_post", content_data)
        assert result["success"] is True
        assert "Content scheduled" in result["message"]
        assert result["post_data"]["content"] == content_data["content"]
    
    def test_data_export_automation(self, automation_instance):
        """Test data export automation"""
        export_data = {
            "type": "json",
            "data": {"test": "data"},
            "filename": "test_export"
        }
        
        result = automation_instance.execute_automation("data_export", export_data)
        assert result["success"] is True
        assert "Data export queued" in result["message"]
        assert result["export_data"]["type"] == "json"
    
    def test_shopify_product_automation_without_config(self, automation_instance):
        """Test Shopify automation without configuration"""
        product_data = {
            "title": "Test Product",
            "description": "Test Description",
            "price": "29.99"
        }
        
        result = automation_instance.execute_automation("shopify_product", product_data)
        # Should work even without API keys (placeholder implementation)
        if "shopify" not in automation_instance.available_integrations:
            assert result["success"] is False
            assert "not configured" in result["error"]
        else:
            assert result["success"] is True
    
    def test_validation_automation_data(self, automation_instance):
        """Test automation data validation"""
        # Valid data
        valid_data = {
            "content": "Test content",
            "platforms": ["instagram"]
        }
        
        validation = automation_instance.validate_automation_data("content_post", valid_data)
        assert validation["valid"] is True
        
        # Invalid data (missing required fields)
        invalid_data = {"content": "Test content"}  # Missing platforms
        
        validation = automation_instance.validate_automation_data("content_post", invalid_data)
        assert validation["valid"] is False
        assert "platforms" in validation["missing_fields"]

class TestBaddieAgentIntegration:
    """Integration tests for the complete agent system"""
    
    @pytest.fixture
    def mock_openai_client(self):
        """Mock OpenAI client for testing"""
        mock_client = Mock()
        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message.content = "💎 This is a test response from your Baddie AI! ✨"
        mock_client.chat.completions.create.return_value = mock_response
        return mock_client
    
    @pytest.fixture
    def temp_memory_dir(self):
        """Create temporary directory for testing"""
        with tempfile.TemporaryDirectory() as temp_dir:
            yield temp_dir
    
    @patch.dict(os.environ, {"OPENAI_API_KEY": "test_key"})
    def test_agent_initialization_with_api_key(self, temp_memory_dir, monkeypatch):
        """Test agent initialization with API key"""
        monkeypatch.setattr(BaddieConfig, 'MEMORY_DIR', temp_memory_dir)
        
        with patch('agent.OpenAI') as mock_openai:
            agent = BaddieAgent()
            assert agent.model == BaddieConfig.OPENAI_MODEL
            assert hasattr(agent, 'memory')
            assert hasattr(agent, 'capabilities')
    
    def test_agent_initialization_without_api_key(self, temp_memory_dir, monkeypatch):
        """Test agent initialization without API key should fail"""
        monkeypatch.setattr(BaddieConfig, 'MEMORY_DIR', temp_memory_dir)
        monkeypatch.setattr(BaddieConfig, 'OPENAI_API_KEY', None)
        
        with pytest.raises(ValueError, match="Invalid configuration"):
            BaddieAgent()
    
    @patch.dict(os.environ, {"OPENAI_API_KEY": "test_key"})
    def test_agent_capabilities(self, temp_memory_dir, monkeypatch):
        """Test agent capabilities"""
        monkeypatch.setattr(BaddieConfig, 'MEMORY_DIR', temp_memory_dir)
        
        with patch('agent.OpenAI'):
            agent = BaddieAgent()
            capabilities = agent.get_capabilities()
            
            assert "product_ideas" in capabilities
            assert "content_creation" in capabilities
            assert "automation" in capabilities
            assert "customer_service" in capabilities
            assert "optimization" in capabilities

class TestBaddieWorkflow:
    """Test the complete workflow: Input → Context → AI → Output → Action → Save"""
    
    @pytest.fixture
    def temp_memory_dir(self):
        """Create temporary directory for testing"""
        with tempfile.TemporaryDirectory() as temp_dir:
            yield temp_dir
    
    @patch.dict(os.environ, {"OPENAI_API_KEY": "test_key"})
    def test_complete_workflow(self, temp_memory_dir, monkeypatch):
        """Test the complete agent workflow"""
        monkeypatch.setattr(BaddieConfig, 'MEMORY_DIR', temp_memory_dir)
        
        # Mock OpenAI response
        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message.content = "💎 Here's a fabulous product idea: Crystal phone cases! ✨"
        
        with patch('agent.OpenAI') as mock_openai:
            mock_openai.return_value.chat.completions.create.return_value = mock_response
            
            agent = BaddieAgent()
            
            # Test complete workflow
            result = agent.process_request(
                user_input="Give me some trending product ideas",
                task_type="product_ideas"
            )
            
            assert result["success"] is True
            assert result["task_type"] == "product_ideas"
            assert "conversation_id" in result
            assert "output_id" in result
            assert result["response"]["text"] == "💎 Here's a fabulous product idea: Crystal phone cases! ✨"
            
            # Verify memory was saved
            stats = agent.get_memory_stats()
            assert stats["conversations_count"] == 1
            assert stats["outputs_count"] == 1

def test_brand_consistency():
    """Test that brand elements are consistent across modules"""
    # Check that all modules use consistent emojis and style
    system_prompt = BaddieConfig.get_system_prompt()
    brand_emojis = BaddieConfig.BRAND_STYLE["emojis"]
    
    # Should contain diamond and sparkle emojis
    assert "💎" in brand_emojis
    assert "✨" in brand_emojis
    
    # System prompt should reflect brand style
    assert "glamorous" in system_prompt.lower()
    assert "queen" in system_prompt.lower()
    assert "💎" in system_prompt
    assert "✨" in system_prompt

if __name__ == "__main__":
    pytest.main([__file__, "-v"])