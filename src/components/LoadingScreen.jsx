import { useState, useEffect } from 'react'
import './LoadingScreen.css'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('loading')

  useEffect(() => {
    const stages = [
      { target: 20, duration: 150 },
      { target: 45, duration: 200 },
      { target: 70, duration: 180 },
      { target: 88, duration: 150 },
      { target: 100, duration: 120 },
    ]

    let currentIndex = 0
    let timeout

    const animate = () => {
      if (currentIndex >= stages.length) {
        setPhase('complete')
        setTimeout(() => onComplete?.(), 400)
        return
      }

      const stage = stages[currentIndex]
      setProgress(stage.target)
      currentIndex++
      timeout = setTimeout(animate, stage.duration)
    }

    timeout = setTimeout(animate, 200)
    return () => clearTimeout(timeout)
  }, [onComplete])

  return (
    <div className={`loading-screen ${phase}`}>
      <div className="loading-content">
        <div className="loading-logo">
          <svg viewBox="0 0 32 32" className="logo-svg">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1b5e20"/>
                <stop offset="100%" stopColor="#4caf50"/>
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="6" fill="url(#logoGrad)"/>
            <path d="M6 20 Q10 16 16 20 Q22 24 26 18" stroke="#a5d6a7" strokeWidth="2" strokeLinecap="round" fill="none" className="logo-line"/>
            <circle cx="6" cy="20" r="2" fill="#fff" className="logo-dot"/>
            <circle cx="16" cy="20" r="2.5" fill="#fff" className="logo-dot"/>
            <circle cx="26" cy="18" r="2" fill="#fff" className="logo-dot"/>
            <path d="M10 12 L10 20 M16 8 L16 20 M22 14 L22 20" stroke="#4caf50" strokeWidth="1.5" strokeLinecap="round" className="logo-bar"/>
          </svg>
        </div>
        
        <div className="loading-text">
          <span className="loading-brand">AG-FI</span>
          <span className="loading-subtitle">Agricultural Finance</span>
        </div>

        <div className="progress-container">
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
            <div 
              className="progress-glow"
              style={{ left: `${progress}%` }}
            />
          </div>
          <span className="progress-value">{progress}%</span>
        </div>
      </div>
    </div>
  )
}