import PageEyebrow from '../../components/PageEyebrow/PageEyebrow'
import PageTransition from '../../components/PageTransition/PageTransition'
import './Skills.css'

// Placeholder stack — real skills land in Phase 9 (data-driven content).
// From CLAUDE-CODE-BRIEF.md section 11 and Design/Skills.png.
const CATEGORIES = [
  { label: 'LANGUAGES', tags: ['PYTHON', 'C++', 'JAVASCRIPT', 'SQL'] },
  { label: 'AI & ML', tags: ['PYTORCH', 'LLM APIS', 'COMPUTER VISION', 'RAG'] },
  { label: 'TOOLS', tags: ['GIT', 'DOCKER', 'LINUX', 'REACT'] },
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

      <p className="page-hint">SWAP THESE TAGS FOR YOUR REAL STACK</p>
    </PageTransition>
  )
}

export default Skills
