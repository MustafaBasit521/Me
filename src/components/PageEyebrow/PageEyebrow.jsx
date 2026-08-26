import './PageEyebrow.css'

// The "02 // ABOUT ME" + fading rule every inner page opens with.
// From CLAUDE-CODE-BRIEF.md section 11.
function PageEyebrow({ index, label }) {
  return (
    <div className="page-eyebrow">
      <span>
        {String(index).padStart(2, '0')} // {label}
      </span>
      <span className="page-eyebrow-rule" />
    </div>
  )
}

export default PageEyebrow
