import { useTargetLock } from '../../hooks/useTargetLock'
import './InteractionHint.css'

function InteractionHint({ text = 'MOVE CURSOR TO TARGET // CLICK TO INITIALIZE', targetedText, left = '50%' }) {
  const targeted = useTargetLock()
  const shown = targeted && targetedText ? targetedText : text

  return (
    <div className={`interaction-hint${targeted ? ' is-targeted' : ''}`} style={{ left }} aria-hidden="true">
      {shown}
    </div>
  )
}

export default InteractionHint
