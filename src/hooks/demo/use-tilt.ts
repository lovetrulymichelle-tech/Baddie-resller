import { useState, MouseEvent } from 'react'

export const useTilt = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    const tiltX = (mouseY / (rect.height / 2)) * -10
    const tiltY = (mouseX / (rect.width / 2)) * 10
    
    setTilt({ x: tiltX, y: tiltY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const tiltStyle = {
    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
  }

  const tiltHandlers = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave
  }

  return {
    tilt,
    tiltStyle,
    tiltHandlers
  }
}