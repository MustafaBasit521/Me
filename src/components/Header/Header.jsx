import { PAGES, PAGE_LABELS } from '../../hooks/usePageNav'
import './Header.css'

function Header({ activePage = 'home', onNavigate }) {
  return (
    <header className="header">
      <nav className="header-nav" aria-label="Primary">
        {PAGES.map((id) => (
          <button
            key={id}
            type="button"
            className={`header-nav-item${id === activePage ? ' is-active' : ''}`}
            onClick={() => onNavigate?.(id)}
          >
            {PAGE_LABELS[id]}
          </button>
        ))}
      </nav>
    </header>
  )
}

export default Header
