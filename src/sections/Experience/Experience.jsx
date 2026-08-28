import PageEyebrow from '../../components/PageEyebrow/PageEyebrow'
import PageTransition from '../../components/PageTransition/PageTransition'
import './Experience.css'

const ENTRIES = [
  {
    start: '2026',
    end: 'PRESENT',
    role: 'IT INTERN',
    org: 'NESPAK // LAHORE, PAKISTAN',
    desc: 'Working within the New Ventures department on OCR technology and internal workflows; currently building Fast Connect, an internal social/collaboration platform.',
    current: true,
  },
]

function Experience() {
  return (
    <PageTransition className="experience page-content" stopClicks>
      <PageEyebrow index={4} label="EXPERIENCE" />
      <h2 className="page-heading">SERVICE RECORD</h2>

      <div className="experience-timeline">
        {ENTRIES.map((entry) => (
          <div className={`experience-row${entry.current ? ' is-current' : ''}`} key={entry.role}>
            <div className="experience-date">
              <span>{entry.start} –</span>
              <span>{entry.end}</span>
            </div>
            <div className="experience-spine">
              <span className="experience-dot" />
            </div>
            <div className="experience-content">
              <h3>{entry.role}</h3>
              <p className="experience-org">{entry.org}</p>
              <p className="experience-desc">{entry.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  )
}

export default Experience
