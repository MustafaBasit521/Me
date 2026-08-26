import { useEffect } from 'react'
import Grain from './components/Grain/Grain'
import Vignette from './components/Vignette/Vignette'
import HUD from './components/HUD/HUD'
import Header from './components/Header/Header'
import StatusBar from './components/StatusBar/StatusBar'
import SocialNav from './components/SocialNav/SocialNav'
import EntityCore from './components/EntityCore/EntityCore'
import Reticle from './components/Reticle/Reticle'
import InteractionHint from './components/InteractionHint/InteractionHint'
import ScanBeam from './components/ScanBeam/ScanBeam'
import PageNext from './components/PageNext/PageNext'
import Home from './sections/Home/Home'
import About from './sections/About/About'
import Skills from './sections/Skills/Skills'
import Experience from './sections/Experience/Experience'
import Projects from './sections/Projects/Projects'
import Contact from './sections/Contact/Contact'
import { usePageNav, PAGES, PAGE_LABELS } from './hooks/usePageNav'
import { eyeCenterFraction, eyeScaleTarget, eyeBaseRadius } from './lib/eyeGeometry'

// Inner-page sections. Home is handled separately since it has no content
// column / scan beam.
const SECTIONS = {
  about: About,
  skills: Skills,
  experience: Experience,
  projects: Projects,
  contact: Contact,
}

function App() {
  const { page, goTo, next } = usePageNav()
  const isHome = page === 'home'
  const ActiveSection = SECTIONS[page]

  // Click-to-advance: works on every page, per CLAUDE-CODE-BRIEF.md section
  // 7 — clicking within R*0.34 of the eye's current center advances to the
  // next page. Content elements stopPropagation() so reading text doesn't
  // trigger it (see About.jsx, Skills.jsx, ...).
  useEffect(() => {
    function handleClick(e) {
      const w = window.innerWidth
      const h = window.innerHeight
      const cx = w * eyeCenterFraction(isHome, w)
      const cy = h * 0.46
      const R = eyeBaseRadius(w, h) * eyeScaleTarget(isHome, w)
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
      if (dist < R * 0.34) next()
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [isHome, next])

  const statusText = isHome
    ? 'SYSTEM INITIALIZED // STATUS: ACTIVE'
    : `ENTITY LINKED // ${PAGE_LABELS[page]}`

  const nextLabel = PAGE_LABELS[PAGES[(PAGES.indexOf(page) + 1) % PAGES.length]]
  const hintText = isHome ? 'MOVE CURSOR TO TARGET // CLICK TO INITIALIZE' : `ADVANCE // ${nextLabel}`

  return (
    <>
      <EntityCore isHome={isHome} />
      <Grain />
      <Vignette />
      <HUD showGrid={isHome} />
      {isHome && <Reticle />}
      <InteractionHint
        text={hintText}
        targetedText={isHome ? 'TARGET LOCKED // CLICK TO INITIALIZE' : undefined}
        variant={isHome ? 'home' : 'inner'}
      />

      {isHome && <Home />}
      {ActiveSection && (
        <>
          <ActiveSection />
          <ScanBeam trigger={page} />
        </>
      )}

      {!isHome && <PageNext page={page} onNext={next} />}

      <div className="top-bar">
        <Header activePage={page} onNavigate={goTo} />
        <StatusBar statusText={statusText} />
      </div>
      <SocialNav />
    </>
  )
}

export default App
