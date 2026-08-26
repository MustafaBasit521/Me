import PageEyebrow from '../../components/PageEyebrow/PageEyebrow'
import './Experience.css'

// Placeholder roles — real ones land in Phase 9 (data-driven content).
// From CLAUDE-CODE-BRIEF.md section 11 and Design/Experience.png.
const ENTRIES = [
  {
    start: '2025',
    end: 'PRESENT',
    role: 'ROLE TITLE',
    org: 'COMPANY OR LAB // LOCATION',
    desc: 'What you owned and what shipped because of it — one or two lines, results first.',
    current: true,
  },
  {
    start: '2024',
    end: '2025',
    role: 'INTERNSHIP TITLE',
    org: 'COMPANY // LOCATION',
    desc: 'One line on the work and the measurable outcome.',
  },
  {
    start: '2023',
    end: '2024',
    role: 'FREELANCE / SOCIETY ROLE',
    org: 'ORGANIZATION // REMOTE',
    desc: 'One line on the work and the measurable outcome.',
  },
]

function Experience() {
  return (
    <div className="experience page-content" onClick={(e) => e.stopPropagation()}>
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

      <p className="page-hint">SEND ME YOUR REAL ROLES AND DATES</p>
    </div>
  )
}

export default Experience
