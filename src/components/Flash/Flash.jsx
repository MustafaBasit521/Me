import { useEffect, useRef } from 'react'
import './Flash.css'

// The white-out burst at the start of every page transition. From
// CLAUDE-CODE-BRIEF.md section 8: flash jumps to 0.8 (0.62 for Home) the
// instant navigation fires, then decays exponentially — same
// value *= Math.exp(-dt*rate) pattern as everything else in this project
// (see EntityCore's ripples). Fires whenever `page` changes, skipping the
// very first mount.
function Flash({ page }) {
  const elRef = useRef(null)
  const prevPageRef = useRef(page)
  const flashRef = useRef(0)
  const rafRef = useRef(null)
  const lastRef = useRef(0)

  useEffect(() => {
    if (prevPageRef.current === page) return
    const goingHome = page === 'home'
    prevPageRef.current = page
    flashRef.current = goingHome ? 0.62 : 0.8
    lastRef.current = performance.now()

    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    function tick(now) {
      const dt = Math.min(0.05, (now - lastRef.current) / 1000)
      lastRef.current = now
      flashRef.current *= Math.exp(-dt * 5)

      const el = elRef.current
      if (el) el.style.opacity = String(flashRef.current)

      if (flashRef.current > 0.005) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [page])

  return <div ref={elRef} className="flash" aria-hidden="true" />
}

export default Flash
