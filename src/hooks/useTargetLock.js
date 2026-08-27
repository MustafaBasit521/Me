import { useEffect, useState } from 'react'

// True when the cursor (or a touch) is within R*0.34 of the eye's center —
// the eye's click-to-advance hit zone, per CLAUDE-CODE-BRIEF.md section 7.
// Used by the Reticle (brightens to opacity 1) and the cue text (swaps to
// "TARGET LOCKED"). Also flips the cursor to a pointer while inside the
// zone (has no visible effect on a touch device, but is harmless there).
export function useTargetLock() {
  const [targeted, setTargeted] = useState(false)

  useEffect(() => {
    function checkPoint(x, y) {
      const cx = window.innerWidth * 0.5
      const cy = window.innerHeight * 0.46
      const R = Math.min(window.innerWidth * 0.3, window.innerHeight * 0.46)
      const dist = Math.hypot(x - cx, y - cy)
      setTargeted(dist < R * 0.34)
    }
    function handleMove(e) {
      checkPoint(e.clientX, e.clientY)
    }
    function handleLeave() {
      setTargeted(false)
    }
    function handleTouchMove(e) {
      const touch = e.touches[0]
      if (touch) checkPoint(touch.clientX, touch.clientY)
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseleave', handleLeave)
    window.addEventListener('touchstart', handleTouchMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleLeave, { passive: true })
    window.addEventListener('touchcancel', handleLeave, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
      window.removeEventListener('touchstart', handleTouchMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleLeave)
      window.removeEventListener('touchcancel', handleLeave)
    }
  }, [])

  useEffect(() => {
    document.body.style.cursor = targeted ? 'pointer' : ''
  }, [targeted])

  return targeted
}
