import './InteractionHint.css'

function InteractionHint({ text = 'MOVE CURSOR TO TARGET // CLICK TO INITIALIZE' }) {
  return (
    <div className="interaction-hint" aria-hidden="true">
      {text}
    </div>
  )
}

export default InteractionHint
