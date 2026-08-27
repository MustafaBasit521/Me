// Audio: two custom sound files (your own downloads — drop them in
// public/audio/, see the filenames below) plus a synthesized fallback
// "pulse" tone, used only if a file hasn't loaded (or wasn't added yet).
// This deliberately breaks CLAUDE-CODE-BRIEF.md section 9's "no audio
// files" constraint — that was the brief's plan for a different, fully
// synthesized approach; this project uses real sound files instead, by
// explicit request.
//
// - RIPPLE_SRC plays for every ripple in the eye: the slow ambient ones
//   that auto-spawn every 5-9s, and the softer follow-up ripple 300ms
//   into a page transition.
// - CLICK_SRC plays once, immediately, at the instant a page transition
//   starts (the shockwave moment) — the "clicking" sound.

const STORAGE_KEY = 'entity-audio-muted'
const RIPPLE_SRC = '/audio/ripple.mp3'
const CLICK_SRC = '/audio/click.mp3'

let ctx = null
let muted = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'true'

let rippleBuffer = null
let clickBuffer = null
let loadStarted = false

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

async function loadBuffer(url) {
  const audioCtx = getContext()
  if (!audioCtx) return null
  try {
    const res = await fetch(url)
    if (!res.ok) return null // file not added yet — fall back to the synth pulse
    const arrayBuffer = await res.arrayBuffer()
    return await audioCtx.decodeAudioData(arrayBuffer)
  } catch {
    return null
  }
}

// Kicks off loading both files, once. Safe to call repeatedly (e.g. from
// primeAudio() on every gesture) — only the first call does anything.
function loadCustomSounds() {
  if (loadStarted) return
  loadStarted = true
  loadBuffer(RIPPLE_SRC).then((buf) => {
    rippleBuffer = buf
  })
  loadBuffer(CLICK_SRC).then((buf) => {
    clickBuffer = buf
  })
}

// Call on the first real user gesture (click/keydown) — AudioContext can't
// start before one, per browser autoplay policy. Also kicks off loading
// the custom sound files. Safe to call repeatedly.
export function primeAudio() {
  getContext()
  loadCustomSounds()
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

function playBuffer(buffer, gainValue) {
  const audioCtx = getContext()
  if (!audioCtx) return false
  const source = audioCtx.createBufferSource()
  const gain = audioCtx.createGain()
  source.buffer = buffer
  gain.gain.value = gainValue
  source.connect(gain)
  gain.connect(audioCtx.destination)
  source.start()
  return true
}

// A short synthesized blip — the fallback for whichever custom sound
// hasn't loaded yet. Pitch/volume scale with `intensity` (roughly the
// triggering ripple's alpha, 0.5 idle up to ~1.45 for a shockwave).
function playSynthPulse(intensity) {
  const audioCtx = getContext()
  if (!audioCtx) return

  const now = audioCtx.currentTime
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  const filter = audioCtx.createBiquadFilter()

  osc.type = 'triangle'
  const freq = 220 + intensity * 260
  osc.frequency.setValueAtTime(freq, now)
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.6), now + 0.5)

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(1800, now)

  // Gain always ramps from 0.0001, never a hard 0 — an exponential ramp
  // to/from true zero throws.
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

// Plays for every ripple — ambient and the transition's softer follow-up.
export function playRippleSound(intensity = 0.5) {
  if (muted) return
  if (!rippleBuffer || !playBuffer(rippleBuffer, Math.min(1, 0.5 + intensity * 0.3))) {
    playSynthPulse(intensity)
  }
}

// Plays once, immediately, at the start of a page transition.
export function playClickSound(intensity = 1) {
  if (muted) return
  if (!clickBuffer || !playBuffer(clickBuffer, Math.min(1, 0.6 + intensity * 0.3))) {
    playSynthPulse(intensity)
  }
}
