import React, { useState } from 'react'
import Modal from './Modal'

interface UserSettingsProps {
  onClose: () => void
}

const UserSettings: React.FC<UserSettingsProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState('')
  const [theme, setTheme] = useState('dark')
  const [autoConnect, setAutoConnect] = useState(true)

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', { apiKey, theme, autoConnect })
    onClose()
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="User Settings">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>API Key:</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
          />
        </div>
        
        <div>
          <label>Theme:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        
        <div>
          <label>
            <input
              type="checkbox"
              checked={autoConnect}
              onChange={(e) => setAutoConnect(e.target.checked)}
            />
            Auto-connect on startup
          </label>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </Modal>
  )
}

export default UserSettings