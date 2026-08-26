import { useTargetLock } from '../../hooks/useTargetLock'
import './InteractionHint.css'

function InteractionHint({
  text = 'MOVE CURSOR TO TARGET // CLICK TO INITIALIZE',
  targetedText,
  variant = 'home',
}) {
  const targeted = useTargetLock()
  const shown = targeted && targetedText ? targetedText : text

  return (
    <div
      className={`interaction-hint interaction-hint--${variant}${targeted ? ' is-targeted' : ''}`}
      aria-hidden="true"
    >
      {shown}
    </div>
  )
}

export default InteractionHint
