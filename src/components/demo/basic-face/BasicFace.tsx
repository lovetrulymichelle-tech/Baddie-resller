import React from 'react'
import { useFace } from '../../../hooks/demo/use-face'
import { useHover } from '../../../hooks/demo/use-hover'
import { useTilt } from '../../../hooks/demo/use-tilt'

const BasicFace: React.FC = () => {
  const { expression, setExpression } = useFace()
  const { isHovered, hoverHandlers } = useHover()
  const { tiltStyle, tiltHandlers } = useTilt()

  const faceStyle = {
    ...tiltStyle,
    transform: `${tiltStyle.transform} scale(${isHovered ? 1.1 : 1})`,
    transition: 'transform 0.3s ease',
  }

  return (
    <div 
      className="basic-face" 
      style={faceStyle}
      {...hoverHandlers}
      {...tiltHandlers}
    >
      <span style={{ fontSize: '4rem' }}>
        {expression}
      </span>
      
      <div style={{ position: 'absolute', bottom: '-3rem', left: '50%', transform: 'translateX(-50%)' }}>
        <button onClick={() => setExpression('😊')}>Happy</button>
        <button onClick={() => setExpression('😴')}>Sleepy</button>
        <button onClick={() => setExpression('🤔')}>Thinking</button>
        <button onClick={() => setExpression('😎')}>Cool</button>
      </div>
    </div>
  )
}

export default BasicFace