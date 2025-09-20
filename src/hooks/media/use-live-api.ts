import { useState, useEffect } from 'react'
import { useLiveAPI } from '../../contexts/LiveAPIContext'

export const useLiveAPIHook = () => {
  const { isConnected, connect, disconnect, apiState } = useLiveAPI()
  const [lastMessage, setLastMessage] = useState<string>('')
  const [messageHistory, setMessageHistory] = useState<string[]>([])

  const sendMessage = async (message: string) => {
    if (!isConnected) {
      throw new Error('Not connected to Live API')
    }

    // Simulate API call
    setLastMessage(message)
    setMessageHistory(prev => [...prev, `User: ${message}`])
    
    // Simulate AI response
    setTimeout(() => {
      const response = `AI: I received your message: "${message}". How can I help you with your reselling business?`
      setMessageHistory(prev => [...prev, response])
    }, 1000)
  }

  const clearHistory = () => {
    setMessageHistory([])
    setLastMessage('')
  }

  useEffect(() => {
    if (!isConnected) {
      setLastMessage('')
    }
  }, [isConnected])

  return {
    isConnected,
    connect,
    disconnect,
    apiState,
    sendMessage,
    lastMessage,
    messageHistory,
    clearHistory
  }
}