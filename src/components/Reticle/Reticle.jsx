import { useTargetLock } from '../../hooks/useTargetLock'
import './Reticle.css'

function Reticle() {
  const targeted = useTargetLock()
  return (
    <div className={`reticle${targeted ? ' is-targeted' : ''}`} aria-hidden="true">
      <span className="reticle-ring" />
      <span className="reticle-tick reticle-tick--n" />
      <span className="reticle-tick reticle-tick--e" />
      <span className="reticle-tick reticle-tick--s" />
      <span className="reticle-tick reticle-tick--w" />
      <span className="reticle-corner reticle-corner--tl" />
      <span className="reticle-corner reticle-corner--tr" />
      <span className="reticle-corner reticle-corner--bl" />
      <span className="reticle-corner reticle-corner--br" />
    </div>
  )
}

export default Reticle
