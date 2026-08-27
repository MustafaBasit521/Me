import { useState } from 'react'
import PageEyebrow from '../../components/PageEyebrow/PageEyebrow'
import PageTransition from '../../components/PageTransition/PageTransition'
import './Contact.css'

// Placeholder links — real ones land in Phase 9 (data-driven content).
// From CLAUDE-CODE-BRIEF.md section 11 and Design/Contact.png.
const EMAIL = 'mustafa@example.com'
const GITHUB_HANDLE = 'github.com/your-handle'
const LINKEDIN_HANDLE = 'linkedin.com/in/your-handle'

function Contact() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fail quietly,
      // the email is still readable/selectable on the page.
    }
  }

  return (
    <PageTransition className="contact page-content" stopClicks>
      <PageEyebrow index={6} label="CONTACT" />
      <h2 className="page-heading">OPEN CHANNEL</h2>
      <p className="contact-intro">
        Internships, collaborations, or an interesting problem — the channel is open.
      </p>

      <div className="contact-channels">
        <div className="contact-row">
          <span className="contact-key">EMAIL</span>
          <span className="contact-value">{EMAIL}</span>
          <button type="button" className="contact-action" onClick={handleCopy}>
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>

        <div className="contact-row">
          <span className="contact-key">GITHUB</span>
          <span className="contact-value">{GITHUB_HANDLE}</span>
          <a
            className="contact-action"
            href={`https://${GITHUB_HANDLE}`}
            target="_blank"
            rel="noreferrer"
          >
            OPEN
          </a>
        </div>

        <div className="contact-row">
          <span className="contact-key">LINKEDIN</span>
          <span className="contact-value">{LINKEDIN_HANDLE}</span>
          <a
            className="contact-action"
            href={`https://${LINKEDIN_HANDLE}`}
            target="_blank"
            rel="noreferrer"
          >
            OPEN
          </a>
        </div>
      </div>
    </PageTransition>
  )
}

export default Contact
