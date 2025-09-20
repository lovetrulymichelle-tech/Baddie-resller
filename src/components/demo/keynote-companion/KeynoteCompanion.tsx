import React, { useState } from 'react'

const KeynoteCompanion: React.FC = () => {
  const [isPresenting, setIsPresenting] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(1)
  const [totalSlides] = useState(5)

  const nextSlide = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  return (
    <div className="keynote-companion">
      <h3>📈 Keynote Companion</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => setIsPresenting(!isPresenting)}
          style={{ 
            backgroundColor: isPresenting ? '#ff6b6b' : '#51cf66',
            color: 'white'
          }}
        >
          {isPresenting ? 'Stop Presentation' : 'Start Presentation'}
        </button>
      </div>

      {isPresenting && (
        <div>
          <div style={{ margin: '1rem 0' }}>
            <span>Slide {currentSlide} of {totalSlides}</span>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={prevSlide} disabled={currentSlide === 1}>
              ⬅️ Previous
            </button>
            <button onClick={nextSlide} disabled={currentSlide === totalSlides}>
              Next ➡️
            </button>
          </div>
          
          <div style={{ margin: '1rem 0', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            <strong>Slide {currentSlide} Content:</strong>
            <p>This is the content for slide {currentSlide}. Your AI companion is ready to help explain this slide!</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default KeynoteCompanion