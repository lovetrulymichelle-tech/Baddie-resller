import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LiveAPIContextType {
  isConnected: boolean
  connect: () => void
  disconnect: () => void
  apiState: 'idle' | 'connecting' | 'connected' | 'error'
}

const LiveAPIContext = createContext<LiveAPIContextType | undefined>(undefined)

interface LiveAPIProviderProps {
  children: ReactNode
}

export const LiveAPIProvider: React.FC<LiveAPIProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [apiState, setApiState] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')

  const connect = () => {
    setApiState('connecting')
    // Simulate connection
    setTimeout(() => {
      setIsConnected(true)
      setApiState('connected')
    }, 1000)
  }

  const disconnect = () => {
    setIsConnected(false)
    setApiState('idle')
  }

  const value = {
    isConnected,
    connect,
    disconnect,
    apiState
  }

  return (
    <LiveAPIContext.Provider value={value}>
      {children}
    </LiveAPIContext.Provider>
  )
}

export const useLiveAPI = (): LiveAPIContextType => {
  const context = useContext(LiveAPIContext)
  if (!context) {
    throw new Error('useLiveAPI must be used within a LiveAPIProvider')
  }
  return context
}