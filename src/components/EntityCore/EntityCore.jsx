import './EntityCore.css'

// Placeholder for Phase 2 — a static circle standing in for the eye.
// The real canvas particle engine replaces this in Phase 6, but every
// page from here on reads position/scale off this same fixed spot.
function EntityCore() {
  return (
    <div className="entity-core" aria-hidden="true">
      <div className="entity-core-ring" />
      <div className="entity-core-pupil" />
    </div>
  )
}

export default EntityCore
