import React, { useState } from 'react'
import Modal from './Modal'

interface AgentEditProps {
  onClose: () => void
}

const AgentEdit: React.FC<AgentEditProps> = ({ onClose }) => {
  const [agentName, setAgentName] = useState('Baddie Assistant')
  const [personality, setPersonality] = useState('helpful')
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant for resellers.')

  const handleSave = () => {
    // Save agent configuration logic here
    console.log('Saving agent:', { agentName, personality, systemPrompt })
    onClose()
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Agent">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Agent Name:</label>
          <input
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
          />
        </div>
        
        <div>
          <label>Personality:</label>
          <select
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
          >
            <option value="helpful">Helpful</option>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="assertive">Assertive</option>
          </select>
        </div>
        
        <div>
          <label>System Prompt:</label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save Agent</button>
        </div>
      </div>
    </Modal>
  )
}

export default AgentEdit