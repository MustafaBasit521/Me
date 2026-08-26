import './Header.css'

const NAV_ITEMS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT ME' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'contact', label: 'CONTACT' },
]

function Header({ activePage = 'home' }) {
  return (
    <header className="header">
      <nav className="header-nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`header-nav-item${item.id === activePage ? ' is-active' : ''}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

export default Header
