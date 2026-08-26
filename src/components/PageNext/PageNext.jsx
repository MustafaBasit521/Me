import { PAGES, PAGE_LABELS } from '../../hooks/usePageNav'
import './PageNext.css'

// Bottom-right "NEXT //" control — one of the four required navigation
// methods (CLAUDE-CODE-BRIEF.md section 7).
function PageNext({ page, onNext }) {
  const index = PAGES.indexOf(page)
  const nextLabel = PAGE_LABELS[PAGES[(index + 1) % PAGES.length]]

  return (
    <button type="button" className="page-next" onClick={onNext}>
      <span className="page-next-count">
        {String(index + 1).padStart(2, '0')} / {String(PAGES.length).padStart(2, '0')}
      </span>
      <span className="page-next-line" />
      <span className="page-next-label">NEXT // {nextLabel}</span>
    </button>
  )
}

export default PageNext
