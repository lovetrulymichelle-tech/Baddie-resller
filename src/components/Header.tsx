import React, { useState } from 'react'
import UserSettings from './UserSettings'
import AgentEdit from './AgentEdit'
import AgentImport from './AgentImport'

const Header: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false)
  const [showAgentEdit, setShowAgentEdit] = useState(false)
  const [showAgentImport, setShowAgentImport] = useState(false)

  return (
    <div className="header">
      <h1>💎 Baddie Reseller</h1>
      <div>
        <button onClick={() => setShowAgentEdit(true)}>
          Edit Agent
        </button>
        <button onClick={() => setShowAgentImport(true)}>
          Import Agent
        </button>
        <button onClick={() => setShowSettings(true)}>
          Settings
        </button>
      </div>
      
      {showSettings && (
        <UserSettings onClose={() => setShowSettings(false)} />
      )}
      
      {showAgentEdit && (
        <AgentEdit onClose={() => setShowAgentEdit(false)} />
      )}
      
      {showAgentImport && (
        <AgentImport onClose={() => setShowAgentImport(false)} />
      )}
    </div>
  )
}

export default Header