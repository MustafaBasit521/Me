import { useEffect, useRef } from 'react'
import './ScanBeam.css'

// Sweeps a bright bar down the content column once, every time `trigger`
// changes. From CLAUDE-CODE-BRIEF.md section 10.2 — the exact easing/
// opacity formulas are transcribed, not tuned by eye.
function ScanBeam({ trigger }) {
  const barRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let scanT = 0
    let last = performance.now()
    let rafId

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      scanT += dt * 1.5 // ~670ms total

      const p = Math.min(1, scanT)
      const e = 1 - Math.pow(1 - p, 2.2) // ease-out
      bar.style.transform = `translateY(${e * 460 - 118}px)`
      bar.style.opacity = String(Math.sin(p * Math.PI) * 0.85)

      if (p < 1) rafId = requestAnimationFrame(frame)
    }

    rafId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafId)
  }, [trigger])

  return (
    <div className="scan-beam-overlay" aria-hidden="true">
      <div ref={barRef} className="scan-beam-bar" />
    </div>
  )
}

export default ScanBeam
