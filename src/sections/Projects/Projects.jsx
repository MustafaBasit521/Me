import PageEyebrow from '../../components/PageEyebrow/PageEyebrow'
import PageTransition from '../../components/PageTransition/PageTransition'
import './Projects.css'

// Placeholder projects — edit this array with your real ones. `url` is
// optional; leave it out (or set to null) and no link renders.
const PROJECTS = [
  {
    title: 'PROJECT TITLE ONE',
    tags: 'PYTHON // PYTORCH',
    desc: 'One line on what it does and why it was hard.',
    url: null,
  },
  {
    title: 'PROJECT TITLE TWO',
    tags: 'REACT // LLM API',
    desc: 'One line on what it does and why it was hard.',
    url: 'https://github.com/your-handle/project-two',
  },
  {
    title: 'PROJECT TITLE THREE',
    tags: 'C++ // SYSTEMS',
    desc: 'One line on what it does and why it was hard.',
    url: null,
  },
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
            {project.url && (
              <a className="project-link" href={project.url} target="_blank" rel="noreferrer">
                VIEW ON GITHUB ↗
              </a>
            )}
          </div>
        ))}
      </div>

      <p className="page-hint">SEND ME YOUR REAL PROJECTS AND I WILL FILL THESE IN</p>
    </PageTransition>
  )
}

export default Projects
