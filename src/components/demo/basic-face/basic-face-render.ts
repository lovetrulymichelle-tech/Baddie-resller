// Basic face rendering utilities
export interface FaceConfig {
  expression: string
  size: number
  color: string
}

export const renderFaceExpression = (expression: string): string => {
  const expressions: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    thinking: '🤔',
    sleeping: '😴',
    cool: '😎',
    excited: '🤩',
    neutral: '😐'
  }
  
  return expressions[expression] || expressions.neutral
}

export const getFaceAnimationStyle = (expression: string): React.CSSProperties => {
  const animations: Record<string, React.CSSProperties> = {
    happy: { animation: 'bounce 2s infinite' },
    excited: { animation: 'pulse 1s infinite' },
    thinking: { animation: 'wobble 3s infinite' },
    sleeping: { opacity: 0.7, filter: 'blur(1px)' }
  }
  
  return animations[expression] || {}
}

export const createFaceGradient = (expression: string): string => {
  const gradients: Record<string, string> = {
    happy: 'linear-gradient(45deg, #FFD700, #FFA500)',
    sad: 'linear-gradient(45deg, #87CEEB, #4682B4)',
    thinking: 'linear-gradient(45deg, #DDA0DD, #9370DB)',
    sleeping: 'linear-gradient(45deg, #2F4F4F, #708090)',
    cool: 'linear-gradient(45deg, #00CED1, #1E90FF)',
    excited: 'linear-gradient(45deg, #FF69B4, #FF1493)',
    neutral: 'linear-gradient(45deg, #646cff, #535bf2)'
  }
  
  return gradients[expression] || gradients.neutral
}