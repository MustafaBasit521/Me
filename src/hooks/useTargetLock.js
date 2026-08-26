import { useEffect, useState } from 'react'

// True when the cursor is within R*0.34 of the eye's center — the eye's
// click-to-advance hit zone, per CLAUDE-CODE-BRIEF.md section 7. Used by
// the Reticle (brightens to opacity 1) and the cue text (swaps to
// "TARGET LOCKED"). Also flips the cursor to a pointer while inside the zone.
export function useTargetLock() {
  const [targeted, setTargeted] = useState(false)

  useEffect(() => {
    function handleMove(e) {
      const cx = window.innerWidth * 0.5
      const cy = window.innerHeight * 0.46
      const R = Math.min(window.innerWidth * 0.3, window.innerHeight * 0.46)
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
      setTargeted(dist < R * 0.34)
    }
    function handleLeave() {
      setTargeted(false)
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  useEffect(() => {
    document.body.style.cursor = targeted ? 'pointer' : ''
  }, [targeted])

  return targeted
}
