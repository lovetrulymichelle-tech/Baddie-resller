import React from 'react'

interface ErrorScreenProps {
  error: string
  onRetry?: () => void
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry }) => {
  return (
    <div className="error-screen">
      <h2>⚠️ Error</h2>
      <p>{error}</p>
      {onRetry && (
        <button onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorScreen