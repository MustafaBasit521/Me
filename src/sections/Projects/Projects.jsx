import PageEyebrow from '../../components/PageEyebrow/PageEyebrow'
import PageTransition from '../../components/PageTransition/PageTransition'
import './Projects.css'

// Placeholder projects — real ones land in Phase 9 (data-driven content).
// From CLAUDE-CODE-BRIEF.md section 11 and Design/Projects.png.
const PROJECTS = [
  { title: 'PROJECT TITLE ONE', tags: 'PYTHON // PYTORCH', desc: 'One line on what it does and why it was hard.' },
  { title: 'PROJECT TITLE TWO', tags: 'REACT // LLM API', desc: 'One line on what it does and why it was hard.' },
  { title: 'PROJECT TITLE THREE', tags: 'C++ // SYSTEMS', desc: 'One line on what it does and why it was hard.' },
]

function Projects() {
  return (
    <PageTransition className="projects page-content" stopClicks>
      <PageEyebrow index={5} label="PROJECTS" />
      <h2 className="page-heading">BUILD LOG</h2>

      <div className="projects-log">
        {PROJECTS.map((project, i) => (
          <div className="project-row" key={project.title}>
            <div className="project-row-top">
              <span className="project-number">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="project-title">{project.title}</h3>
              <span className="project-tags">{project.tags}</span>
            </div>
            <p className="project-desc">{project.desc}</p>
          </div>
        ))}
      </div>

      <p className="page-hint">SEND ME YOUR REAL PROJECTS AND I WILL FILL THESE IN</p>
    </PageTransition>
  )
}

export default Projects
