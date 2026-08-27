// Minimal Web Audio slice — a synthesized "pulse" tone that fires whenever
// a ripple appears in the eye (ambient auto-ripples, and the sharper
// shockwave/follow-up ripples from page transitions). No audio files, per
// CLAUDE-CODE-BRIEF.md section 9's "zero audio files" constraint — this is
// a deliberately small first slice of that section, not the full spec
// (no ambient hum / transition sweep / hover ticks yet).

const STORAGE_KEY = 'entity-audio-muted'

let ctx = null
let muted = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'true'

function getContext() {
  if (!ctx) {
    const Ctor = window.AudioContext || window.webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

// Call on the first real user gesture (click/keydown) — AudioContext can't
// start before one, per browser autoplay policy. Safe to call repeatedly.
export function primeAudio() {
  getContext()
}

export function isMuted() {
  return muted
}

export function setMuted(next) {
  muted = next
  try {
    localStorage.setItem(STORAGE_KEY, String(next))
  } catch {
    // localStorage unavailable (private mode, etc.) — mute state just
    // won't persist across reloads, not worth failing over.
  }
}

export function toggleMuted() {
  setMuted(!muted)
  return muted
}

// A short, soft blip — pitch and volume scale with the ripple's own
// intensity (its `a`/alpha, roughly 0.5 idle, up to ~1.45 for a shockwave),
// so a page-transition ripple reads as a bigger "pulse" than an ambient
// one. Gain always ramps from 0.0001, never set to a hard 0, and never
// starts/stops at zero — an exponential ramp to/from true zero throws.
export function playPulse(intensity = 0.5) {
  if (muted) return
  const audioCtx = getContext()
  if (!audioCtx) return
  // Note: no `audioCtx.state !== 'running'` bail-out here. resume() is
  // asynchronous — right after calling it, `state` can still legitimately
  // read 'suspended' for a few milliseconds, so checking it synchronously
  // here would silently drop sound on a browser that doesn't resolve the
  // resume instantly (Chrome mostly resumes synchronously when the
  // context is *created* inside a real gesture, which is why this wasn't
  // obvious in testing — but it's not guaranteed everywhere). A source
  // scheduled while still technically suspended plays fine once the
  // context actually resumes moments later; nothing is lost by not
  // gating on the check.

  const now = audioCtx.currentTime
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  const filter = audioCtx.createBiquadFilter()

  // Triangle instead of pure sine — a bit more harmonic content, which
  // reads as noticeably louder than a sine at the same gain on small
  // laptop/phone speakers.
  osc.type = 'triangle'
  const freq = 220 + intensity * 260
  osc.frequency.setValueAtTime(freq, now)
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.6), now + 0.5)

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(1800, now)

  const peak = Math.min(0.5, 0.16 + intensity * 0.24)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(audioCtx.destination)

  osc.start(now)
  osc.stop(now + 0.65)
}
