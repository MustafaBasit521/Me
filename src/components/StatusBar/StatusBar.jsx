import { useState } from 'react'
import './StatusBar.css'

function StatusBar({ statusText = 'SYSTEM INITIALIZED // STATUS: ACTIVE' }) {
  const [audioOn, setAudioOn] = useState(true)

  return (
    <div className="status-bar">
      <span className="status-dot" />
      <span className="status-text">{statusText}</span>
      <button
        type="button"
        className="audio-toggle"
        onClick={() => setAudioOn((on) => !on)}
        aria-pressed={audioOn}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 10v4h4l5 5V5L8 10H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M16 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        AUDIO {audioOn ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}

export default StatusBar
