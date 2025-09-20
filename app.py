"""
💎✨ Baddie Reseller AI Agent Web App ✨💎
Optional web interface for deployment
"""

from flask import Flask, request, jsonify, render_template_string
import os
from agent import BaddieAgent
from config import BaddieConfig

app = Flask(__name__)

# Initialize agent
try:
    agent = BaddieAgent()
except Exception as e:
    print(f"Failed to initialize agent: {e}")
    agent = None

# Simple web interface template
WEB_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>💎 Baddie Reseller AI Agent ✨</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            background: linear-gradient(135deg, #ff69b4, #ffd700);
            margin: 0; padding: 20px; color: #333;
        }
        .container { 
            max-width: 800px; margin: 0 auto; 
            background: white; padding: 30px; 
            border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 { text-align: center; color: #ff1493; }
        .chat-container { 
            height: 400px; overflow-y: auto; 
            border: 2px solid #ff69b4; padding: 20px; 
            border-radius: 15px; margin: 20px 0;
            background: #f9f9f9;
        }
        .input-container { display: flex; gap: 10px; }
        input[type="text"] { 
            flex: 1; padding: 15px; border: 2px solid #ff69b4; 
            border-radius: 10px; font-size: 16px;
        }
        button { 
            padding: 15px 30px; background: #ff1493; color: white; 
            border: none; border-radius: 10px; cursor: pointer; font-size: 16px;
        }
        button:hover { background: #ff69b4; }
        .message { margin: 10px 0; padding: 10px; border-radius: 10px; }
        .user-message { background: #e6e6fa; text-align: right; }
        .ai-message { background: #ffd700; }
        .task-selector { margin: 20px 0; }
        select { 
            padding: 10px; border: 2px solid #ff69b4; 
            border-radius: 10px; font-size: 16px; width: 100%;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💎✨ Baddie Reseller AI Agent ✨💎</h1>
        <p style="text-align: center; font-style: italic;">Your glamorous AI assistant for digital reselling success!</p>
        
        <div class="task-selector">
            <label for="taskType">Choose Task Type:</label>
            <select id="taskType">
                <option value="general">General Business Advice</option>
                <option value="product_ideas">Product Ideas & Research</option>
                <option value="content_creation">Content Creation</option>
                <option value="automation">Automation & Workflows</option>
                <option value="customer_service">Customer Service</option>
            </select>
        </div>
        
        <div class="chat-container" id="chatContainer">
            <div class="message ai-message">
                💎 Hey queen! I'm your Baddie Reseller AI assistant. What can I help you slay today? ✨
            </div>
        </div>
        
        <div class="input-container">
            <input type="text" id="userInput" placeholder="Ask me anything about your reselling business..." 
                   onkeypress="if(event.key==='Enter') sendMessage()">
            <button onclick="sendMessage()">Send 💅</button>
        </div>
    </div>

    <script>
        async function sendMessage() {
            const input = document.getElementById('userInput');
            const taskType = document.getElementById('taskType').value;
            const chatContainer = document.getElementById('chatContainer');
            
            if (!input.value.trim()) return;
            
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'message user-message';
            userMessage.innerHTML = `<strong>You:</strong> ${input.value}`;
            chatContainer.appendChild(userMessage);
            
            const userInput = input.value;
            input.value = '';
            
            // Show loading
            const loadingMessage = document.createElement('div');
            loadingMessage.className = 'message ai-message';
            loadingMessage.innerHTML = '✨ Thinking like a boss...';
            chatContainer.appendChild(loadingMessage);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        message: userInput, 
                        task_type: taskType 
                    })
                });
                
                const data = await response.json();
                
                // Remove loading message
                chatContainer.removeChild(loadingMessage);
                
                // Add AI response
                const aiMessage = document.createElement('div');
                aiMessage.className = 'message ai-message';
                aiMessage.innerHTML = `<strong>Baddie AI:</strong> ${data.response}`;
                chatContainer.appendChild(aiMessage);
                
            } catch (error) {
                // Remove loading message
                chatContainer.removeChild(loadingMessage);
                
                const errorMessage = document.createElement('div');
                errorMessage.className = 'message ai-message';
                errorMessage.innerHTML = '❌ Sorry queen, something went wrong! Please try again.';
                chatContainer.appendChild(errorMessage);
            }
            
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    </script>
</body>
</html>
"""

@app.route('/')
def home():
    """Serve the web interface"""
    return render_template_string(WEB_TEMPLATE)

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat requests"""
    if not agent:
        return jsonify({
            'success': False,
            'error': 'Agent not initialized. Please check configuration.'
        }), 500
    
    data = request.get_json()
    message = data.get('message', '')
    task_type = data.get('task_type', 'general')
    
    if not message:
        return jsonify({
            'success': False,
            'error': 'No message provided'
        }), 400
    
    try:
        result = agent.process_request(message, task_type)
        
        if result['success']:
            response_text = result['response']['text'] if isinstance(result['response'], dict) else result['response']
            return jsonify({
                'success': True,
                'response': response_text,
                'task_type': task_type
            })
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Unknown error')
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/capabilities')
def get_capabilities():
    """Get agent capabilities"""
    if not agent:
        return jsonify({'error': 'Agent not initialized'}), 500
    
    return jsonify(agent.get_capabilities())

@app.route('/api/status')
def get_status():
    """Get agent status"""
    return jsonify({
        'status': 'online' if agent else 'offline',
        'agent_name': BaddieConfig.AGENT_NAME,
        'environment': BaddieConfig.DEPLOYMENT_ENV,
        'version': '1.0.0'
    })

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': str(datetime.now())})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', BaddieConfig.PORT))
    debug = BaddieConfig.DEPLOYMENT_ENV == 'development'
    
    print(f"🚀 Starting Baddie Reseller AI Agent web server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)