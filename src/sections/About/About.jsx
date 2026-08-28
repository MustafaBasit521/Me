import PageEyebrow from '../../components/PageEyebrow/PageEyebrow'
import PageTransition from '../../components/PageTransition/PageTransition'
import './About.css'

const STATS = [
  { label: 'FOCUS', value: 'AI // SOFTWARE' },
  { label: 'STATUS', value: 'OPEN TO WORK' },
  { label: 'BASED', value: 'LAHORE, PAKISTAN' },
  { label: 'DEGREE', value: 'BS COMPUTER SCIENCE — FAST-NUCES' },
]

function About() {
  return (
    <PageTransition className="about page-content" stopClicks>
      <PageEyebrow index={2} label="ABOUT ME" />

      <div className="about-body">
        <div className="about-photo">
          <div className="about-photo-frame">
            <span className="about-photo-placeholder">AWAITING OPERATOR IMAGE</span>
          </div>
          <span className="about-photo-caption">OPERATOR IMAGE // 0x01</span>
        </div>

        <div className="about-text">
          <h2>COMPUTER SCIENCE STUDENT &amp; BUILDER</h2>
          <p>
            I'm a computer science student who likes building things that actually work —
            computer vision systems, full-stack platforms, and the occasional game on the
            side. Currently interning at NESPAK on OCR technology and internal tooling,
            while shipping personal projects across machine learning, systems, and
            interaction design.
          </p>

          <dl className="about-stats">
            {STATS.map((stat) => (
              <div className="about-stat" key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </PageTransition>
  )
}

export default About
