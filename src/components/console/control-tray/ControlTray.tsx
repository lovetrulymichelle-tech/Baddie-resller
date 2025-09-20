import React from 'react'
import { useLiveAPI } from '../../../contexts/LiveAPIContext'

const ControlTray: React.FC = () => {
  const { isConnected, connect, disconnect, apiState } = useLiveAPI()

  return (
    <div className="control-tray">
      <button 
        onClick={isConnected ? disconnect : connect}
        disabled={apiState === 'connecting'}
      >
        {apiState === 'connecting' ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
      </button>
      
      <button disabled={!isConnected}>
        Start Recording
      </button>
      
      <button disabled={!isConnected}>
        Generate Response
      </button>
      
      <div style={{ marginLeft: '1rem' }}>
        Status: <span style={{ color: isConnected ? 'green' : 'orange' }}>
          {apiState}
        </span>
      </div>
    </div>
  )
}

export default ControlTray