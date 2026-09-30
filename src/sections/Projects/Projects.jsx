import PageEyebrow from '../../components/PageEyebrow/PageEyebrow'
import PageTransition from '../../components/PageTransition/PageTransition'
import './Projects.css'

// `url` is optional — set the real repo link whenever you have it; leave
// it null and no "VIEW ON GITHUB" link renders for that row.
// `live` is optional — a deployed demo; renders a "LIVE DEMO" link.
const PROJECTS = [
  {
    title: 'FAST CONNECT',
    tags: 'REACT // FASTAPI // MONGODB // GEMINI',
    desc: 'Full-stack social network for a university community — JWT auth, posts, friends, messaging, blogs, content reports with server-side proof snapshots, a separate admin moderation portal, and an AI companion. Backend tests and CI included.',
    url: 'https://github.com/MustafaBasit521/Fast_Connect',
    live: 'https://fast-connect-frontend-three.vercel.app',
  },
  {
    title: 'COMMIT GUARD',
    tags: 'PYTHON // GITLEAKS // SEMGREP // RUFF',
    desc: 'Git pre-commit security gate that scans staged changes for leaked secrets and insecure code patterns, blocks serious findings, and reuses the same engine in CI with SARIF output.',
    url: 'https://github.com/MustafaBasit521/commit-guard',
  },
  {
    title: 'HAND GESTURE RECOGNITION',
    tags: 'PYTHON // OPENCV // MEDIAPIPE // PYTORCH',
    desc: 'Real-time digit classifier from mid-air finger gestures — MediaPipe hand tracking feeds a PyTorch CNN trained on MNIST, with a live confidence chart and an open-palm gesture to clear the canvas.',
    url: 'https://github.com/MustafaBasit521/Hand_Gesture_Recognition',
  },
  {
    title: 'RESORA',
    tags: 'REACT // NODE.JS',
    desc: 'Role-based campus resource booking platform with conflict-detecting REST APIs and separate dashboards for Admin, Teacher/TA, and Student.',
    url: 'https://github.com/orgs/Campus-Resource-Allocation/repositories',
  },
  {
    title: 'EXPECT THE UNEXPECTED',
    tags: 'C++ // SFML',
    desc: '6-level platformer with unpredictable obstacle patterns and a custom physics/gravity engine, inspired by Level Devil.',
    url: 'https://github.com/SubhanNoor/1st-semester-project',
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
            {project.live && (
              <a
                className="project-link"
                style={{ marginLeft: 18 }}
                href={project.live}
                target="_blank"
                rel="noreferrer"
              >
                LIVE DEMO ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </PageTransition>
  )
}

export default Projects
