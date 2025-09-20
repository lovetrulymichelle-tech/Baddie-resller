import { useState } from 'react'

export const useHover = () => {
  const [isHovered, setIsHovered] = useState(false)

  const hoverHandlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  }

  return {
    isHovered,
    hoverHandlers
  }
}