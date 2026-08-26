import PageEyebrow from '../../components/PageEyebrow/PageEyebrow'
import './About.css'

// Placeholder copy/values — real bio, photo, and stats land in Phase 9
// (data-driven content). Structure/positioning follows
// CLAUDE-CODE-BRIEF.md section 11 and Design/AboutMe.png.
const STATS = [
  { label: 'FOCUS', value: 'AI // SOFTWARE' },
  { label: 'STATUS', value: 'OPEN TO WORK' },
  { label: 'BASED', value: '— ADD LOCATION' },
  { label: 'DEGREE', value: 'BS COMPUTER SCIENCE' },
]

function About() {
  return (
    <div className="about page-content" onClick={(e) => e.stopPropagation()}>
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
            I build software that thinks — AI systems, tooling and interfaces where the
            machine does real work instead of decorating a screen. Currently studying
            computer science and shipping side projects that push into machine learning,
            systems and interaction design.
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
    </div>
  )
}

export default About
