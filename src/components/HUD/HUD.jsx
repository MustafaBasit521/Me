import './HUD.css'

// The four hex codes are pure decoration — cosmetic "system" flavor text,
// not real data. They stay fixed regardless of page.
const HEX = { tl: '0x7F', tr: '0xA9', bl: '0x3C', br: '0x9A' }

// Corners/hex labels appear on every page (confirmed against
// Design/AboutMe.png, Design/Experience.png, Design/Contact.png). Only the
// faint grid rules are page-dependent, per CLAUDE-CODE-BRIEF.md section 4.
function HUD({ showGrid = true }) {
  return (
    <div className="hud" aria-hidden="true">
      <div className={`hud-grid${showGrid ? '' : ' is-hidden'}`}>
        <span className="hud-rule hud-rule--v" style={{ left: '18%' }} />
        <span className="hud-rule hud-rule--v" style={{ left: '82%' }} />
        <span className="hud-rule hud-rule--h" style={{ top: '24%' }} />
        <span className="hud-rule hud-rule--h" style={{ top: '76%' }} />
      </div>

      <span className="hud-corner hud-corner--tl" />
      <span className="hud-corner hud-corner--tr" />
      <span className="hud-corner hud-corner--bl" />
      <span className="hud-corner hud-corner--br" />

      <span className="hud-hex hud-hex--tl">{HEX.tl}</span>
      <span className="hud-hex hud-hex--tr">{HEX.tr}</span>
      <span className="hud-hex hud-hex--bl">{HEX.bl}</span>
      <span className="hud-hex hud-hex--br">{HEX.br}</span>
    </div>
  )
}

export default HUD
