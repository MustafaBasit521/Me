import { useEffect, useRef } from 'react'
import './EntityCore.css'
import { eyeCenterFraction, eyeScaleTarget, eyeDimTarget } from '../../lib/eyeGeometry'
import { playRippleSound, playClickSound } from '../../lib/audio'

const RINGS = 46
const DPR_CAP = 1.5
const TAU = Math.PI * 2

// Five slow, barely-visible breathing ellipses — from
// CLAUDE-CODE-BRIEF.md section 5.4, given verbatim.
const WAVE_RINGS = [
  { r: 0.3, a: 0.11, sp: 0.5, ph: 0.4, sq: 0.99, rot: 0.2, rs: 0.02, lw: 1.4 },
  { r: 0.46, a: 0.08, sp: 0.36, ph: 1.9, sq: 0.985, rot: 1.1, rs: -0.015, lw: 1 },
  { r: 0.62, a: 0.06, sp: 0.28, ph: 3.1, sq: 0.99, rot: 2.2, rs: 0.012, lw: 1 },
  { r: 0.8, a: 0.045, sp: 0.22, ph: 5, sq: 0.995, rot: 0.6, rs: -0.01, lw: 1 },
  { r: 0.98, a: 0.032, sp: 0.18, ph: 2.2, sq: 0.99, rot: 3.4, rs: 0.008, lw: 1 },
]

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

// rgba() prefix (alpha filled in per-draw) — inner particles cyan, outer
// particles shift blue. From CLAUDE-CODE-BRIEF.md section 2.
function tintPrefix(r) {
  const mix = clamp((r - 0.24) / 0.75, 0, 1)
  const g = Math.round(238 - 116 * mix)
  const rr = Math.round(24 + 14 * (1 - mix))
  return `rgba(${rr},${g},255,`
}

// One dot on ring k (of 46), quantized into angular segments — this is what
// produces visible ring structure instead of noise soup.
// From CLAUDE-CODE-BRIEF.md section 5.1.
function makeDot(k) {
  const tt = Math.pow(k / RINGS, 0.9)
  const r = 0.2 + tt * 0.92 + (Math.random() - 0.5) * 0.011

  const nd = 22 + (k % 7) * 7
  const seg = Math.floor(Math.random() * nd)
  const a = (seg / nd) * TAU + (Math.random() - 0.5) * (TAU / nd) * 0.7 + k * 0.21

  const sect =
    0.5 +
    0.32 * Math.sin(a * 3 + 1.05) +
    0.2 * Math.sin(a * 5 - 2.1) +
    0.14 * Math.sin(a * 2 + 0.4)
  let al = (0.2 + 0.8 * clamp(sect, 0.06, 1)) * (1 - tt * 0.34)

  const hot = Math.random() < 0.035
  if (hot) al *= 1.7

  return {
    r,
    a,
    va: (0.05 / (0.32 + r)) * (0.85 + Math.random() * 0.3), // inner rings orbit faster
    ph: Math.random() * TAU,
    ws: 0.25 + Math.random() * 0.6,
    tw: 0.7 + Math.random() * 2.6,
    al: al * (0.6 + Math.random() * 0.6),
    s: hot ? 1.8 + Math.random() * 1.3 : r < 0.45 ? 0.9 + Math.random() * 1.1 : 0.8 + Math.random(),
    c: tintPrefix(r),
  }
}

function makeDots(count) {
  const dots = new Array(count)
  for (let i = 0; i < count; i++) {
    dots[i] = makeDot(Math.floor(Math.random() * RINGS))
  }
  return dots
}

// 155 curved fibers radiating through the iris. From brief section 5.2.
function makePetals(count) {
  const petals = new Array(count)
  for (let i = 0; i < count; i++) {
    const w = 1.4 + Math.pow(Math.random(), 1.5) * 4.2 // mostly thin, few thick
    petals[i] = {
      a: (i / count) * TAU + (Math.random() - 0.5) * 0.09, // evenly spaced, slight jitter
      r: 0.23 + Math.random() * 0.2,
      len: 0.055 + Math.random() * 0.14,
      wid: w,
      ph: Math.random() * TAU,
      bend: (Math.random() - 0.5) * 0.95,
      al: (0.055 + Math.random() * 0.13) * (w > 3.6 ? 1.3 : 1),
      core: w > 3.4, // thick ones get a bright inner stroke
    }
  }
  return petals
}

// 230 short curls near the pupil. Brief section 5.3 gives the aperture
// formula but not full field ranges — sized to sit close to the pupil and
// stay visually consistent with the petals.
function makeFilaments(count) {
  const filaments = new Array(count)
  for (let i = 0; i < count; i++) {
    filaments[i] = {
      a: Math.random() * TAU,
      r0: 0.14 + Math.random() * 0.08,
      len: 0.02 + Math.random() * 0.04,
      wid: 0.4 + Math.random() * 0.55,
      bend: (Math.random() - 0.5) * 0.7,
      ph: Math.random() * TAU,
      al: 0.05 + Math.random() * 0.09,
    }
  }
  return filaments
}

// A curved stroke from r0 to r1 at the given angle, bent sideways by
// `bend`. Shared shape logic for petals and filaments.
function drawFiber(ctx, cx, cy, angle, r0, r1, bend) {
  const x0 = cx + Math.cos(angle) * r0
  const y0 = cy + Math.sin(angle) * r0
  const x1 = cx + Math.cos(angle) * r1
  const y1 = cy + Math.sin(angle) * r1

  const nx = -Math.sin(angle) // perpendicular to the ray direction
  const ny = Math.cos(angle)
  const bendPx = bend * 0.4 * (r1 - r0)
  const midR = (r0 + r1) / 2
  const ctrlX = cx + Math.cos(angle) * midR + nx * bendPx
  const ctrlY = cy + Math.sin(angle) * midR + ny * bendPx

  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.quadraticCurveTo(ctrlX, ctrlY, x1, y1)
  ctx.stroke()
}

function drawPetal(ctx, cx, cy, R, spin, time, dim, p) {
  const angle = p.a + spin
  const r0 = p.r * R
  const r1 = (p.r + p.len) * R
  const twinkle = 0.75 + 0.25 * Math.sin(time * 0.6 + p.ph)
  const alpha = p.al * twinkle * dim

  ctx.strokeStyle = `rgba(60,225,255,${alpha.toFixed(3)})`
  ctx.lineWidth = p.wid
  drawFiber(ctx, cx, cy, angle, r0, r1, p.bend)

  if (p.core) {
    ctx.strokeStyle = `rgba(210,250,255,${(alpha * 0.5).toFixed(3)})`
    ctx.lineWidth = p.wid * 0.2
    drawFiber(ctx, cx, cy, angle, r0, r1, p.bend)
  }
}

function drawFilament(ctx, cx, cy, R, spin, time, ap, dim, f) {
  const angle = f.a + spin
  const r0 = f.r0 * R * (1 + ap * 2.4) // stretches outward as the pupil dilates (Phase 8)
  const r1 = r0 + f.len * R
  const twinkle = 0.7 + 0.3 * Math.sin(time * 0.8 + f.ph)
  const alpha = f.al * twinkle * dim

  ctx.strokeStyle = `rgba(140,215,255,${alpha.toFixed(3)})`
  ctx.lineWidth = f.wid
  drawFiber(ctx, cx, cy, angle, r0, r1, f.bend)
}

function drawWaveRings(ctx, cx, cy, R, time) {
  for (const wr of WAVE_RINGS) {
    const rad = wr.r * R * (1 + 0.02 * Math.sin(time * wr.sp + wr.ph))
    const rot = wr.rot + time * wr.rs // counter-rotating per-ring

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(rot)
    ctx.beginPath()
    ctx.ellipse(0, 0, rad, rad * wr.sq, 0, 0, TAU)
    ctx.strokeStyle = `rgba(0,205,255,${wr.a})`
    ctx.lineWidth = wr.lw
    ctx.stroke()
    ctx.restore()
  }
}

// Two soft low-alpha bands that fill the gap between the pupil and the
// fibers, so the center doesn't look hollow. From brief section 5.5.
function drawHaloBands(ctx, cx, cy, R) {
  ctx.beginPath()
  ctx.arc(cx, cy, R * 0.32, 0, TAU)
  ctx.strokeStyle = 'rgba(0,190,255,0.045)'
  ctx.lineWidth = R * 0.17
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(cx, cy, R * 0.3, 0, TAU)
  ctx.strokeStyle = 'rgba(120,235,255,0.035)'
  ctx.lineWidth = R * 0.06
  ctx.stroke()
}

// A single expanding, fading ring — auto-spawned every 5-9s, and also
// brightens any dots it passes through (see the rb calc in the dot loop).
// From brief section 6.5.
function drawRipple(ctx, cx, cy, R, rp) {
  const rad = rp.r * R

  ctx.beginPath()
  ctx.arc(cx, cy, rad, 0, TAU)
  ctx.strokeStyle = `rgba(160,242,255,${rp.a.toFixed(3)})`
  ctx.lineWidth = 1 + rp.a * 2.6
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(cx, cy, rad, 0, TAU)
  ctx.strokeStyle = `rgba(0,180,255,${(rp.a * 0.5).toFixed(3)})`
  ctx.lineWidth = R * 0.05 * rp.a
  ctx.stroke()
}

function EntityCore({ isHome = true, page = 'home' }) {
  const canvasRef = useRef(null)
  const bloomRef = useRef(null)
  const bloomWideRef = useRef(null)
  const isHomeRef = useRef(isHome)

  // Transition state, pushed in from outside the RAF loop by the effect
  // below. Refs (not React state) because the loop reads them every frame
  // without wanting a re-render for it.
  const prevPageRef = useRef(page)
  const pendingRipplesRef = useRef([])
  const spinRateTargetRef = useRef(1)
  const apTargetRef = useRef(0)

  useEffect(() => {
    isHomeRef.current = isHome
  }, [isHome])

  // The transition sequence — CLAUDE-CODE-BRIEF.md section 8, minus the
  // audio layer (not built yet) and the DOM-swap-during-flash trick (React
  // already swaps the section synchronously; AnimatePresence in App.jsx
  // handles the content fade separately). Skips the very first mount so
  // navigating straight to a page on load doesn't fire a spurious burst.
  useEffect(() => {
    if (prevPageRef.current === page) return
    prevPageRef.current = page

    pendingRipplesRef.current.push({ r: 0.04, v: 2.5, a: 1.45 }) // shockwave
    spinRateTargetRef.current = 5
    apTargetRef.current = 1
    playClickSound(1.45)

    const relax = setTimeout(() => {
      pendingRipplesRef.current.push({ r: 0.08, v: 0.9, a: 0.6 }) // softer follow-up
      apTargetRef.current = 0
      playRippleSound(0.6)
    }, 300)
    const spinDown = setTimeout(() => {
      spinRateTargetRef.current = 1
    }, 420)

    return () => {
      clearTimeout(relax)
      clearTimeout(spinDown)
    }
  }, [page])

  useEffect(() => {
    const canvas = canvasRef.current
    const bloomCanvas = bloomRef.current
    const bloomWideCanvas = bloomWideRef.current
    const ctx = canvas.getContext('2d')
    const bloomCtx = bloomCanvas.getContext('2d')
    const bloomWideCtx = bloomWideCanvas.getContext('2d')

    let dots = []
    let petals = []
    let filaments = []
    let width = 0
    let height = 0

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Bloom canvases stay the same CSS size (so they overlay exactly) but
      // their internal pixel buffer is much smaller — that mismatch is the
      // entire "bloom" trick: draw the sharp core into a tiny buffer, let
      // the browser upscale it, then blur it with CSS.
      bloomCanvas.width = Math.round(canvas.width / 4)
      bloomCanvas.height = Math.round(canvas.height / 4)
      bloomCanvas.style.width = `${width}px`
      bloomCanvas.style.height = `${height}px`

      bloomWideCanvas.width = Math.round(canvas.width / 10)
      bloomWideCanvas.height = Math.round(canvas.height / 10)
      bloomWideCanvas.style.width = `${width}px`
      bloomWideCanvas.style.height = `${height}px`

      const count = Math.round(5200 * clamp(width / 1600, 0.55, 1.15))
      dots = makeDots(count)
      petals = makePetals(155)
      filaments = makeFilaments(230)
    }

    resize()
    window.addEventListener('resize', resize)

    const mouse = { x: 0, y: 0, has: false }
    function handleMouseMove(e) {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.has = true
    }
    function handleMouseLeave() {
      mouse.has = false
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Touch devices never fire mousemove, so without this the repulsion/
    // proximity effects (driven entirely by the `mouse` object above)
    // simply never trigger on a phone — dragging a finger did nothing.
    function handleTouchMove(e) {
      const touch = e.touches[0]
      if (!touch) return
      mouse.x = touch.clientX
      mouse.y = touch.clientY
      mouse.has = true
    }
    function handleTouchEnd() {
      mouse.has = false
    }
    window.addEventListener('touchstart', handleTouchMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    let time = 0
    let spin = 0
    let spinRate = 1 // multiplier on the spin accumulator — spikes to 5 on transition
    let ap = 0 // pupil aperture — pulses to 1 on transition, opens the pupil + filaments
    let prox = 0
    let sc = 1 // iris scale — 1 idle, 0.6 on inner pages
    let dim = 1 // global brightness — 1 idle, 0.3 on inner pages
    let cxf = 0.5 // center-x as a fraction of width — 0.5 idle, 0.74 on inner pages
    let lastNow = performance.now()
    let nextRippleAt = 5 + Math.random() * 4
    let ripples = []
    let rafId

    // Frame-rate-independent easing toward a target — CLAUDE-CODE-BRIEF.md
    // section 6.2. Closes `rate` fraction of the remaining gap per second,
    // which is why it feels weighted instead of linear.
    function ease(current, target, rate, dt) {
      return current + (target - current) * (1 - Math.exp(-dt * rate))
    }

    function step(now) {
      const dt = Math.min(0.05, (now - lastNow) / 1000)
      lastNow = now
      time += dt
      spinRate = ease(spinRate, spinRateTargetRef.current, 3.4, dt)
      spin += dt * 0.024 * spinRate
      ap = ease(ap, apTargetRef.current, 7, dt)

      const home = isHomeRef.current
      sc = ease(sc, eyeScaleTarget(home, width), 4.6, dt)
      dim = ease(dim, eyeDimTarget(home, width), 4.6, dt)
      cxf = ease(cxf, eyeCenterFraction(home, width), 3.4, dt)

      const cx = width * cxf
      const cy = height * 0.46
      const breathe = 1 + 0.014 * Math.sin(time * 0.34) + 0.006 * Math.sin(time * 0.83 + 1.1)
      const R = Math.min(width * 0.3, height * 0.46) * breathe * sc

      // Ripples: auto-spawn every 5-9s, then expand/fade/cull. Transition
      // shockwaves are queued in from the effect above, outside this loop.
      if (pendingRipplesRef.current.length) {
        ripples.push(...pendingRipplesRef.current)
        pendingRipplesRef.current = []
      }
      if (time >= nextRippleAt) {
        ripples.push({ r: 0.16, v: 0.2, a: 0.5 })
        nextRippleAt = time + 5 + Math.random() * 4
        playRippleSound(0.5)
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        rp.r += rp.v * dt
        rp.v *= Math.exp(-dt * 0.5)
        rp.a *= Math.exp(-dt * 0.62)
        if (rp.r > 1.9 || rp.a < 0.015) ripples.splice(i, 1)
      }

      // Proximity: the whole iris brightens as the cursor nears the center.
      const dcen = mouse.has ? Math.hypot(mouse.x - cx, mouse.y - cy) : Infinity
      const proxTarget = mouse.has ? Math.max(0, 1 - dcen / (R * 1.1 + 1)) : 0
      prox += (proxTarget - prox) * 0.08
      const boost = 1 + prox * 0.5

      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      drawHaloBands(ctx, cx, cy, R)
      drawWaveRings(ctx, cx, cy, R, time)
      for (const rp of ripples) drawRipple(ctx, cx, cy, R, rp)

      for (const p of petals) drawPetal(ctx, cx, cy, R, spin, time, dim, p)
      for (const f of filaments) drawFilament(ctx, cx, cy, R, spin, time, ap, dim, f)

      const infl = R * 0.42
      for (const dot of dots) {
        const wobble =
          1 + 0.02 * Math.sin(time * dot.ws + dot.ph) + 0.012 * Math.sin(dot.a * 3.1 + time * 0.31)
        const twinkle = 0.58 + 0.42 * Math.sin(time * dot.tw + dot.ph)
        const angle = dot.a + time * dot.va + spin

        // Ripple brightening: how close is this dot's ring to a passing ripple?
        let rb = 0
        for (const rp of ripples) {
          const dr = Math.abs(dot.r - rp.r)
          if (dr < 0.075) rb += (1 - dr / 0.075) * rp.a
        }

        const radius = dot.r * wobble * (1 + rb * 0.03) * R
        let x = cx + Math.cos(angle) * radius
        let y = cy + Math.sin(angle) * radius

        // Cursor repulsion: dots within the influence radius flee the cursor.
        let extra = 1
        if (mouse.has) {
          const dx = x - mouse.x
          const dy = y - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < infl && dist > 0.0001) {
            const f = 1 - dist / infl
            x += (dx / dist) * f * f * 26
            y += (dy / dist) * f * f * 26
            extra = 1 + f * 0.9
          }
        }

        const alpha = dot.al * twinkle * (1 + rb * 2.1) * extra * boost * dim

        ctx.fillStyle = `${dot.c}${alpha.toFixed(3)})`
        ctx.fillRect(x - dot.s / 2, y - dot.s / 2, dot.s, dot.s)
      }

      // Punch a hole of pure background over the center — without this the
      // whole thing reads as a glowing disc, not an eye. `ap` (aperture)
      // swells this during transitions; `targeting` swells it slightly
      // when the cursor sits in the click-to-advance hit zone.
      ctx.globalCompositeOperation = 'source-over'
      const targeting = dcen < R * 0.34
      const halo = (R * (0.042 + 0.05 * ap) + (targeting ? 2.5 : 0)) * 2.2
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, halo)
      g.addColorStop(0, 'rgba(0,0,0,1)')
      g.addColorStop(0.45, 'rgba(0,0,0,1)')
      g.addColorStop(0.58, 'rgba(2,5,10,0.82)')
      g.addColorStop(0.78, 'rgba(4,9,16,0.32)')
      g.addColorStop(1, 'rgba(5,10,18,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(cx, cy, halo, 0, TAU)
      ctx.fill()

      // Bloom pass: downscale the sharp core into the two small buffers —
      // drawImage scales automatically because the destination canvas is
      // smaller than the source. CSS blur() does the rest.
      bloomCtx.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height)
      bloomCtx.drawImage(canvas, 0, 0, bloomCanvas.width, bloomCanvas.height)
      bloomWideCtx.clearRect(0, 0, bloomWideCanvas.width, bloomWideCanvas.height)
      bloomWideCtx.drawImage(canvas, 0, 0, bloomWideCanvas.width, bloomWideCanvas.height)

      const bloomOpacity = clamp((0.85 + prox * 0.3) * dim, 0, 1)
      bloomCanvas.style.opacity = String(bloomOpacity)
      bloomWideCanvas.style.opacity = String(bloomOpacity)
    }

    function frame(now) {
      try {
        step(now)
      } catch (err) {
        console.error('entity loop', err)
      }
      rafId = requestAnimationFrame(frame) // outside the try — always reschedules
    }

    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('touchstart', handleTouchMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [])

  return (
    <>
      <canvas ref={bloomWideRef} className="entity-core-canvas entity-core-canvas--bloom-wide" aria-hidden="true" />
      <canvas ref={bloomRef} className="entity-core-canvas entity-core-canvas--bloom" aria-hidden="true" />
      <canvas ref={canvasRef} className="entity-core-canvas entity-core-canvas--core" aria-hidden="true" />
    </>
  )
}

export default EntityCore
