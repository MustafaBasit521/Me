import PageEyebrow from '../../components/PageEyebrow/PageEyebrow'
import PageTransition from '../../components/PageTransition/PageTransition'
import './Skills.css'

const CATEGORIES = [
  { label: 'LANGUAGES', tags: ['C++', 'C#', 'PYTHON', 'JAVASCRIPT'] },
  { label: 'AI & ML', tags: ['OPENCV', 'MEDIAPIPE', 'TENSORFLOW / KERAS'] },
  { label: 'TOOLS', tags: ['REACT', 'NODE.JS', 'SFML', 'VISUAL STUDIO', 'VS CODE', 'UNITY', 'GIT'] },
]

function Skills() {
  return (
    <PageTransition className="skills page-content" stopClicks>
      <PageEyebrow index={3} label="SKILLS" />
      <h2 className="page-heading">STACK MAP</h2>

      <div className="skills-grid">
        {CATEGORIES.map((cat) => (
          <div className="skills-column" key={cat.label}>
            <h3 className="skills-column-label">{cat.label}</h3>
            <div className="skills-tags">
              {cat.tags.map((tag) => (
                <span className="skills-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  )
}

export default Skills
