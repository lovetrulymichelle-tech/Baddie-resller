import React from 'react'
import { useLiveAPI } from '../../contexts/LiveAPIContext'

interface QuickAction {
  title: string
  description: string
  icon: string
  action: () => void
  color: string
}

const QuickActions: React.FC = () => {
  const { isConnected } = useLiveAPI()

  const actions: QuickAction[] = [
    {
      title: 'Product Research',
      description: 'Find trending products to resell',
      icon: '🔍',
      action: () => console.log('Product research'),
      color: '#3b82f6'
    },
    {
      title: 'Price Optimization',
      description: 'Optimize pricing for maximum profit',
      icon: '💹',
      action: () => console.log('Price optimization'),
      color: '#10b981'
    },
    {
      title: 'Inventory Sync',
      description: 'Sync inventory across platforms',
      icon: '🔄',
      action: () => console.log('Inventory sync'),
      color: '#f59e0b'
    },
    {
      title: 'AI Assistant',
      description: 'Get help with reselling strategies',
      icon: '🤖',
      action: () => console.log('AI assistant'),
      color: '#8b5cf6'
    },
    {
      title: 'Bulk Listing',
      description: 'List multiple products at once',
      icon: '📋',
      action: () => console.log('Bulk listing'),
      color: '#ef4444'
    },
    {
      title: 'Analytics',
      description: 'View sales and performance metrics',
      icon: '📊',
      action: () => console.log('Analytics'),
      color: '#06b6d4'
    }
  ]

  return (
    <div className="quick-actions">
      <h2>Quick Actions</h2>
      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className="action-card"
            onClick={action.action}
            style={{ borderTopColor: action.color }}
            disabled={!isConnected && action.title === 'AI Assistant'}
          >
            <div className="action-icon" style={{ color: action.color }}>
              {action.icon}
            </div>
            <div className="action-content">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions