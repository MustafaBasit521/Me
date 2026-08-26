import { useEffect, useState } from 'react'
import './Home.css'

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

// Same particle-count formula EntityCore uses, so this readout always
// matches what's actually on screen.
function currentNodeCount() {
  return Math.round(5200 * clamp(window.innerWidth / 1600, 0.55, 1.15))
}

function randomCycle() {
  return Math.floor(1000 + Math.random() * 9000)
}

function Home() {
  const [nodes, setNodes] = useState(currentNodeCount)
  const [cycle, setCycle] = useState(randomCycle)

  useEffect(() => {
    function handleResize() {
      setNodes(currentNodeCount())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setCycle(randomCycle()), 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="home">
      <div className="home-coords" aria-hidden="true">
        <span>LAT 41.902</span>
        <span>LON 12.496</span>
      </div>

      <div className="home-title">
        <h1>MUSTAFA</h1>
        <p className="home-subtitle">
          <span className="home-subtitle-dash" />
          COMPUTER SCIENCE // AI // SOFTWARE
        </p>
      </div>

      <div className="home-stats" aria-hidden="true">
        <span>NODES {nodes}</span>
        <span>LATENCY 0.004 MS</span>
        <span>CYCLE {cycle}</span>
      </div>

      <div className="home-sector" aria-hidden="true">
        <span className="home-sector-line" />
        SECTOR 04 // OBSERVATION
        <span className="home-sector-line" />
      </div>
    </div>
  )
}

export default Home
