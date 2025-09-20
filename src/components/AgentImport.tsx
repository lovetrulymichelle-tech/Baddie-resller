import React, { useState } from 'react'
import Modal from './Modal'

interface AgentImportProps {
  onClose: () => void
}

const AgentImport: React.FC<AgentImportProps> = ({ onClose }) => {
  const [importData, setImportData] = useState('')
  const [importMethod, setImportMethod] = useState<'json' | 'url'>('json')

  const handleImport = () => {
    try {
      if (importMethod === 'json') {
        const data = JSON.parse(importData)
        console.log('Importing agent from JSON:', data)
      } else {
        console.log('Importing agent from URL:', importData)
      }
      onClose()
    } catch (error) {
      alert('Invalid JSON format')
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Import Agent">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Import Method:</label>
          <select
            value={importMethod}
            onChange={(e) => setImportMethod(e.target.value as 'json' | 'url')}
            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
          >
            <option value="json">JSON Configuration</option>
            <option value="url">From URL</option>
          </select>
        </div>
        
        <div>
          <label>
            {importMethod === 'json' ? 'JSON Configuration:' : 'Agent URL:'}
          </label>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder={
              importMethod === 'json' 
                ? '{"name": "Agent Name", "personality": "helpful", ...}'
                : 'https://example.com/agent-config.json'
            }
            rows={importMethod === 'json' ? 6 : 2}
            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleImport}>Import Agent</button>
        </div>
      </div>
    </Modal>
  )
}

export default AgentImport