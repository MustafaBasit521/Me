// Shared eye geometry targets — used by both EntityCore's canvas loop and
// App.jsx's click-to-advance hit test, so the clickable zone always
// matches what's actually drawn on screen instead of the two silently
// drifting apart. Idle/inner values from CLAUDE-CODE-BRIEF.md section 6.3;
// the mobile case is our own addition — the desktop cxf=0.74 puts the eye
// directly under the content column once that column takes up most of a
// narrow screen's width, so mobile pushes the eye further right, smaller,
// and dimmer to stay clear of the text.
const MOBILE_BREAKPOINT = 720

export function isMobileWidth(width) {
  return width < MOBILE_BREAKPOINT
}

export function eyeCenterFraction(isHome, width) {
  if (isHome) return 0.5
  return isMobileWidth(width) ? 0.92 : 0.74
}

export function eyeScaleTarget(isHome, width) {
  if (isHome) return 1
  return isMobileWidth(width) ? 0.45 : 0.6
}

export function eyeDimTarget(isHome, width) {
  if (isHome) return 1
  return isMobileWidth(width) ? 0.22 : 0.3
}

export function eyeBaseRadius(width, height) {
  return Math.min(width * 0.3, height * 0.46)
}
