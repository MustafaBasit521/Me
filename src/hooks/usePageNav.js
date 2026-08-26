import { useCallback, useEffect, useState } from 'react'

// From CLAUDE-CODE-BRIEF.md section 7 — six pages, one array, no router.
export const PAGES = ['home', 'about', 'skills', 'experience', 'projects', 'contact']

export const PAGE_LABELS = {
  home: 'HOME',
  about: 'ABOUT ME',
  skills: 'SKILLS',
  experience: 'EXPERIENCE',
  projects: 'PROJECTS',
  contact: 'CONTACT',
}

function pageFromHash() {
  const id = window.location.hash.replace('#', '')
  return PAGES.includes(id) ? id : 'home'
}

// The page state machine — nav buttons, the eye, the NEXT control, and
// keyboard arrows all end up calling goTo()/next()/prev() from here.
export function usePageNav() {
  const [page, setPage] = useState(pageFromHash)
  const [visited, setVisited] = useState(() => new Set([pageFromHash()]))

  const goTo = useCallback((id) => {
    if (!PAGES.includes(id)) return
    setPage(id)
    setVisited((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
    window.history.replaceState(null, '', `#${id}`)
  }, [])

  const step = useCallback(
    (delta) => {
      const i = PAGES.indexOf(page)
      goTo(PAGES[(i + delta + PAGES.length) % PAGES.length])
    },
    [page, goTo]
  )

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'Escape') goTo('home')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [step, goTo])

  // Browsers don't reload the page for a same-document hash change (address
  // bar edit, an <a href="#x"> elsewhere, back/forward) — replaceState()
  // itself never fires this, so there's no feedback loop with goTo() above.
  useEffect(() => {
    function handleHashChange() {
      const id = pageFromHash()
      setPage(id)
      setVisited((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return { page, visited, goTo, next: () => step(1), prev: () => step(-1) }
}
