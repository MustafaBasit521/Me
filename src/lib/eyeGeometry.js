// Shared eye geometry targets — used by both EntityCore's canvas loop and
// App.jsx's click-to-advance hit test, so the clickable zone always
// matches what's actually drawn on screen instead of the two silently
// drifting apart. Idle/inner values from CLAUDE-CODE-BRIEF.md section 6.3;
// the mobile case is our own addition — the desktop cxf=0.74 sits the eye
// beside the content column, which there's no spare width for on a phone.
// By design, mobile instead sits the eye partly *behind* the text — dimmed
// down as background atmosphere, centered enough that its right portion
// sits under the content column, its left portion in the open space
// beside it, while staying clear of the social rail at the right edge.
const MOBILE_BREAKPOINT = 720

export function isMobileWidth(width) {
  return width < MOBILE_BREAKPOINT
}

export function eyeCenterFraction(isHome, width) {
  if (isHome) return 0.5
  return isMobileWidth(width) ? 0.58 : 0.74
}

export function eyeScaleTarget(isHome, width) {
  if (isHome) return 1
  return isMobileWidth(width) ? 0.55 : 0.6
}

export function eyeDimTarget(isHome, width) {
  if (isHome) return 1
  return isMobileWidth(width) ? 0.2 : 0.3
}

export function eyeBaseRadius(width, height) {
  return Math.min(width * 0.3, height * 0.46)
}
