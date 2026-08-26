import './Reticle.css'

// Static for now — target-lock (brightening to opacity 1 near the cursor)
// is cursor-interaction behavior, built in Phase 7.
function Reticle() {
  return (
    <div className="reticle" aria-hidden="true">
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
