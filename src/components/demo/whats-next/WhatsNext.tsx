import React, { useState, useEffect } from 'react'
import { CONVERSATION_STARTERS } from '../../../lib/prompts'

interface NextStepItem {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'inventory' | 'marketing' | 'customer-service' | 'pricing' | 'growth'
  icon: string
  action?: string
}

const WhatsNext: React.FC = () => {
  const [nextSteps, setNextSteps] = useState<NextStepItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentView, setCurrentView] = useState<'overview' | 'detailed'>('overview')

  // Enhanced AI-generated next steps for resellers with actionable prompts
  const generateNextSteps = (): NextStepItem[] => {
    const steps: NextStepItem[] = [
      {
        id: '1',
        title: 'Optimize Product Listings',
        description: 'Review and enhance your top 5 products with better descriptions and keywords',
        priority: 'high',
        category: 'marketing',
        icon: '📝',
        action: 'Help me optimize my product descriptions for better search ranking'
      },
      {
        id: '2',
        title: 'Check Inventory Levels',
        description: 'Monitor stock for trending items - summer accessories are selling fast',
        priority: 'high',
        category: 'inventory',
        icon: '📦',
        action: 'Do you need help with inventory management or pricing?'
      },
      {
        id: '3',
        title: 'Follow Up on Customer Reviews',
        description: 'Respond to recent reviews and reach out to satisfied customers',
        priority: 'medium',
        category: 'customer-service',
        icon: '⭐',
        action: 'Would you like assistance with customer service or marketing?'
      },
      {
        id: '4',
        title: 'Analyze Competitor Pricing',
        description: 'Review pricing strategy for jewelry and accessories categories',
        priority: 'medium',
        category: 'pricing',
        icon: '💰',
        action: 'Help me analyze competitor pricing and optimize my strategy'
      },
      {
        id: '5',
        title: 'Plan Social Media Content',
        description: 'Create content calendar for next week featuring new arrivals',
        priority: 'low',
        category: 'marketing',
        icon: '📱',
        action: 'Help me create a social media content strategy for my products'
      },
      {
        id: '6',
        title: 'Expand to New Platforms',
        description: 'Consider listing popular items on TikTok Shop for younger audience',
        priority: 'low',
        category: 'growth',
        icon: '🚀',
        action: 'What products are you looking to optimize or automate?'
      },
      {
        id: '7',
        title: 'Update Seasonal Products',
        description: 'Refresh your fall/winter collection and remove summer items',
        priority: 'high',
        category: 'inventory',
        icon: '🍂',
        action: 'Help me manage seasonal inventory transitions'
      },
      {
        id: '8',
        title: 'Automate Order Processing',
        description: 'Set up automated responses and order confirmations',
        priority: 'medium',
        category: 'growth',
        icon: '⚙️',
        action: 'How can I help you automate your order processing workflow?'
      }
    ]

    // Simulate some randomization for different recommendations
    return steps.sort(() => Math.random() - 0.5).slice(0, 4)
  }

  const refreshRecommendations = () => {
    setIsLoading(true)
    // Simulate AI processing time
    setTimeout(() => {
      setNextSteps(generateNextSteps())
      setIsLoading(false)
    }, 1500)
  }

  const startTask = (step: NextStepItem) => {
    // In a real app, this would trigger the AI agent with the specific prompt
    const prompt = step.action || CONVERSATION_STARTERS[Math.floor(Math.random() * CONVERSATION_STARTERS.length)]
    alert(`Starting "${step.title}" task...\n\nAI Agent Prompt: "${prompt}"\n\n(This would connect to your AI assistant to help with this specific task)`)
  }

  useEffect(() => {
    refreshRecommendations()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff6b6b'
      case 'medium': return '#ffd93d'
      case 'low': return '#51cf66'
      default: return '#868e96'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'inventory': return '#228be6'
      case 'marketing': return '#fa5252'
      case 'customer-service': return '#40c057'
      case 'pricing': return '#fd7e14'
      case 'growth': return '#9c88ff'
      default: return '#868e96'
    }
  }

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'inventory': return 'Stock Management'
      case 'marketing': return 'Brand & Sales'
      case 'customer-service': return 'Customer Care'
      case 'pricing': return 'Profit Optimization'
      case 'growth': return 'Business Expansion'
      default: return category
    }
  }

  return (
    <div className="whats-next">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0' }}>🎯 What's Next for Your Business</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            AI-powered recommendations to grow your reselling empire
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setCurrentView(currentView === 'overview' ? 'detailed' : 'overview')}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          >
            {currentView === 'overview' ? '📊 Details' : '📋 Overview'}
          </button>
          <button 
            onClick={refreshRecommendations}
            disabled={isLoading}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          >
            {isLoading ? '🔄 Analyzing...' : '✨ Refresh'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Your AI assistant is analyzing your business data...</p>
          <div style={{ 
            width: '200px', 
            height: '4px', 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '2px', 
            margin: '1rem auto',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, #646cff, #535bf2)',
              borderRadius: '2px',
              animation: 'slide 1.5s ease-in-out infinite'
            }} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {nextSteps.map((step, index) => (
            <div 
              key={step.id}
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'left',
                position: 'relative',
                transform: isLoading ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.3s ease',
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{step.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{step.title}</h4>
                    <span 
                      style={{ 
                        background: getPriorityColor(step.priority),
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '12px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold'
                      }}
                    >
                      {step.priority}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                    {step.description}
                  </p>
                  {currentView === 'detailed' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span 
                        style={{ 
                          background: getCategoryColor(step.category),
                          color: 'white',
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '8px',
                          textTransform: 'capitalize'
                        }}
                      >
                        {getCategoryDescription(step.category)}
                      </span>
                      <button 
                        style={{ 
                          fontSize: '0.7rem', 
                          padding: '0.3rem 0.6rem',
                          background: 'transparent',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '4px'
                        }}
                        onClick={() => startTask(step)}
                      >
                        🤖 Ask AI Assistant
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem', 
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          💡 <strong>AI Insight:</strong> Based on your recent activity and market trends, 
          focusing on high-priority tasks will give you the biggest impact this week. 
          Connect with your AI assistant for personalized guidance on each recommendation.
        </p>
      </div>
    </div>
  )
}

export default WhatsNext