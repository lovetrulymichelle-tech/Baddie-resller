import { useState, useEffect } from 'react'

export const useFace = () => {
  const [expression, setExpression] = useState('😊')
  const [isAnimating, setIsAnimating] = useState(false)

  const changeExpression = (newExpression: string) => {
    setIsAnimating(true)
    setExpression(newExpression)
    
    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  useEffect(() => {
    // Auto-cycle through expressions for demo
    const interval = setInterval(() => {
      const expressions = ['😊', '🤔', '😎', '😴']
      const randomExpression = expressions[Math.floor(Math.random() * expressions.length)]
      changeExpression(randomExpression)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return {
    expression,
    isAnimating,
    setExpression: changeExpression
  }
}