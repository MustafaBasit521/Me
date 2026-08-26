# BUILD BRIEF — "Entity" Portfolio Site

Paste this whole file to Claude Code as the task. It is a complete specification: follow it literally.
Companion file: `SPEC.md` (palette + functional reference). Reference implementation: `standalone/index.html`.

---

## 0. What you are building

A single-page portfolio for **Muhammad Mustafa Basit** (computer science student — AI / software).

The entire site is one dark screen containing a **living particle iris** — a giant eye rendered on `<canvas>` — that acts as both the hero visual and the navigation control. Six content pages fade in over it. The eye reacts to the cursor, breathes, ripples, contracts and dilates during page changes, and remembers which pages you've visited via tick marks drawn around itself.

Reference: the Entity from *Mission: Impossible — Dead Reckoning / Final Reckoning*. Cold, surveillant, precise. **Not** neon-cyberpunk, not glossy, no gradients-as-decoration, no emoji, no rounded card UI.

### Hard constraints
- **No framework. No build step. No npm dependencies.** Plain HTML + CSS + vanilla JS in ONE file.
- **Canvas 2D only.** Do not use Three.js/WebGL — the iris is 2D particles and Canvas 2D is faster here.
- **No audio files.** All sound is synthesized with the Web Audio API at runtime.
- Only external requests allowed: two Google Fonts.
- Must hold 60fps on integrated graphics.

### Deliverable
```
index.html      ← everything (HTML + CSS + JS inline)
me.jpg          ← the user's photo (they supply it)
```
Deployable by dragging the folder onto Netlify Drop. Nothing else.

---

## 1. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Markup/style | HTML5 + hand-written CSS with custom properties | One screen; a framework would delay the first paint of the hero |
| Animation | Canvas 2D + a single `requestAnimationFrame` loop | ~5800 draw calls/frame, all `fillRect`/`stroke` |
| Bloom | Two downscaled canvases + CSS `filter: blur()` | Cheap fake bloom, visually identical to a shader at this scale |
| Audio | Web Audio API, synthesized | Zero payload, procedural variation |
| State | One JS class + a `PAGES` array | Six pages don't need a router |
| Persistence | `localStorage` (audio mute) + `location.hash` (deep links) | |
| Fonts | Space Grotesk 300 + JetBrains Mono | |
| Hosting | Netlify / Vercel / GitHub Pages, static | |

---

## 2. Color palette

Declare as CSS custom properties on `:root`.

```css
--bg:        #07090E;   /* page base, near-black blue-shifted */
--bg2:       #0A0D14;   /* radial center */
--bg3:       #05070B;   /* radial edge */
--cyan:      #00F0FF;   /* primary accent: active underline, frame corners, glows */
--cyan-soft: #7FE9FF;   /* secondary: labels, icons, meta */
--green:     #3DFF9E;   /* status dot ONLY */
--text:      #FFFFFF;   /* headings, key values */
--muted:     #A0AEC0;   /* body copy, inactive nav */
```

Background is never a flat fill:
```css
background: radial-gradient(140% 110% at 50% 44%, #0A0D14 0%, #07090E 62%, #05070B 100%);
```

### Alpha discipline — the palette is mostly transparency, not new hues
**Never introduce a new hue. Dim an existing one.**

| Purpose | Value |
|---|---|
| Hairlines / row dividers | `rgba(255,255,255,0.07)` |
| Cyan borders | `rgba(0,240,255,0.14)` → `0.20` |
| HUD grid lines | `rgba(0,240,255,0.045)`–`0.05` |
| HUD micro-labels | `rgba(160,174,192,0.28)`–`0.45` |
| Body copy | `rgba(160,174,192,0.78)`–`0.82` |
| Tag border → hover | `rgba(255,255,255,0.09)` → `rgba(0,240,255,0.5)` |
| Row hover fill | `rgba(0,240,255,0.05)` |
| Glass panel | `linear-gradient(180deg,rgba(11,17,26,.72),rgba(7,10,16,.62))` + `1px solid rgba(0,240,255,.16)` + `backdrop-filter: blur(10px)` |

Glow is always `box-shadow: 0 0 Npx rgba(0,240,255,0.x)` — never a blurred blob div.

### Particle color: tinted by radius
Inner particles are cyan; outer particles shift toward blue. This radial gradient across the iris is essential — do not use one flat color.
```js
const mix = Math.min(1, Math.max(0, (r - 0.24) / 0.75));
const color = `rgba(${Math.round(24 + 14*(1-mix))},${Math.round(238 - 116*mix)},255,`;
// inner ≈ rgb(38,238,255)  →  outer ≈ rgb(24,122,255)
```
Other canvas strokes:
- wave rings `rgba(0,205,255,α)`
- petals `rgba(60,225,255,α)`, bright cores `rgba(210,250,255,α)`
- filaments `rgba(140,215,255,α)`
- ripples `rgba(160,242,255,α)` + wide soft pass `rgba(0,180,255,α)`
- dial ticks `rgba(150,240,255,α)`

---

## 3. Typography

- **Display — Space Grotesk, weight 300 ONLY.** Name, section headings, project/role titles. `letter-spacing: 0.09em–0.20em`.
- **Mono — JetBrains Mono.** Everything else: nav, labels, body copy, HUD readouts.
- ALL CAPS + wide tracking (`0.20em–0.32em`) for every label. Sentence case only for paragraph copy.
- Sizes: name `clamp(28px,3.4vw,66px)` · section `h2` `clamp(24px,2.1vw,34px)` · row titles `19px` · body `12–12.5px` · labels `9–10px`.
- Paragraphs get `text-wrap: pretty`.

---

## 4. Layout

All page-edge spacing derives from one token: `--edge: clamp(30px, 5.2vw, 100px)`.

```
┌──────────────────────────────────────────────────────────┐
│ ⌐            nav (6 items)        status ● | AUDIO ON  ¬ │
│   0x7F                                          0xA9     │
│                    ╭─────────────╮                       │
│  LAT 41.902        │  the iris   │                  ┌──┐ │
│  LON 12.496        │  (canvas)   │                  │GH│ │
│  ┌─ content ─┐     ╰─────────────╯                  │IN│ │
│  │ page copy │       reticle + cue                  │IG│ │
│  └───────────┘                                      │@ │ │
│                                                     └──┘ │
│   NAME                              NODES / LATENCY /    │
│   ── tagline                                CYCLE        │
│   0x3C      SECTOR 04 // OBSERVATION            0x9A     │
│ ⌐                                                      ¬ │
└──────────────────────────────────────────────────────────┘
```

Z-index ladder (respect exactly): canvases `1` · grain `2` · vignette `3` · HUD + frame `4` · reticle `6` · cue/dial label `7` · identity/telemetry `8` · content + scan overlay `9` · header + NEXT `10` · social rail `11` · flash `20`.

- **Iris center:** `x = w * cxf`, `y = h * 0.46` (animated — see §6.4). Above true center; the identity block occupies the lower left.
- **Iris radius:** `R = min(w*0.30, h*0.46) * scale * breathing`.
- **Grain:** inline SVG `feTurbulence` at `opacity 0.05`, `mix-blend-mode: overlay`.
- **Vignette:** `radial-gradient(120% 100% at 50% 46%, transparent 45%, rgba(3,5,9,.5) 84%, rgba(2,3,6,.9) 100%)`.
- **HUD:** two vertical rules at 18%/82%, two horizontal at 24%/76%, all `rgba(0,240,255,0.05)`; L-bracket corners inset 34px; hex labels `0x7F/0xA9/0x3C/0x9A` inset 36px/72px. HUD hides on inner pages.
- **Content column:** `left: var(--edge)`, `top: clamp(94px,13vh,122px)`, `width: min(720px,56vw)`, `max-height: calc(100vh - clamp(150px,20vh,196px))`, `overflow-y: auto` as a safety net.
- **Social rail:** right edge, vertically centered, glass pill, 4 inline SVG icons (GitHub, LinkedIn, Instagram, Email) at 17px, `--cyan-soft` → white on hover with `scale(1.1)`.

---

## 5. The iris — construction

Three stacked canvases, filling the viewport, one draw pass per frame:

| Canvas | Resolution | CSS filter |
|---|---|---|
| `#core` | full, DPR capped at **1.5** | none |
| `#bloom` | core ÷ 4 | `blur(13px) saturate(1.1)` |
| `#bloomWide` | core ÷ 10 | `blur(46px) saturate(1.35)` |

Each frame, after drawing `#core`, `drawImage` it into both bloom canvases (they downscale automatically) and set their opacity from cursor proximity. **This downscale-plus-CSS-blur is the entire bloom pipeline** — no shaders.

**All iris drawing uses `ctx.globalCompositeOperation = 'lighter'` (additive).** This is what makes overlapping particles bloom into hot white. Switch back to `'source-over'` only for the pupil (§5.6).

All four systems are polar — store `radius` (normalized 0–1, multiplied by `R` at draw time) and `angle`.

### 5.1 Dots — ~5200 particles, the body of the iris
Count scales with viewport: `Math.round(5200 * clamp(w/1600, 0.55, 1.15))`.

Critical detail: particles sit on **46 discrete rings** and are **quantized into angular segments**, which is what produces visible ring structure instead of noise soup.

```js
const RINGS = 46;
const k  = Math.floor(Math.random() * RINGS);      // which ring
const tt = Math.pow(k / RINGS, 0.9);               // bias inward
const r  = 0.2 + tt * 0.92 + (Math.random() - 0.5) * 0.011;

const nd  = 22 + (k % 7) * 7;                      // 22–64 slots on this ring
const seg = Math.floor(Math.random() * nd);
const a   = (seg/nd) * 6.2832 + (Math.random()-0.5) * (6.2832/nd) * 0.7 + k * 0.21;

// three-harmonic angular density → uneven, organic sectors
const sect = 0.5 + 0.32*Math.sin(a*3 + 1.05) + 0.2*Math.sin(a*5 - 2.1) + 0.14*Math.sin(a*2 + 0.4);
let al = (0.2 + 0.8*clamp(sect,0.06,1)) * (1 - tt*0.34);

const hot = Math.random() < 0.035;                 // 3.5% "hot" particles
if (hot) al *= 1.7;

dots.push({
  r, a,
  va: (0.05 / (0.32 + r)) * (0.85 + Math.random()*0.3),  // inner rings orbit FASTER
  ph: Math.random()*6.283,                                // phase offset
  ws: 0.25 + Math.random()*0.6,                           // wobble speed
  tw: 0.7  + Math.random()*2.6,                           // twinkle speed
  al: al * (0.6 + Math.random()*0.6),
  s:  hot ? 1.8+Math.random()*1.3 : (r<0.45 ? 0.9+Math.random()*1.1 : 0.8+Math.random()),
  c:  radiusTintedColorPrefix(r)
});
```
`va` scaling by `1/(0.32+r)` gives **differential rotation** — the core spins faster than the rim, like a galaxy. This is a large part of why it reads as alive.

Drawn as `fillRect(x-s/2, y-s/2, s, s)` — squares, not `arc()`. Circles are ~4× slower and indistinguishable at 1–3px.

### 5.2 Petals — 155 curved strokes, the iris fibers
```js
const w = 1.4 + Math.pow(Math.random(),1.5)*4.2;   // mostly thin, few thick
petals.push({
  a: (i/155)*6.2832 + (Math.random()-0.5)*0.09,     // evenly spaced, slight jitter
  r: 0.23 + Math.random()*0.2,
  len: 0.055 + Math.random()*0.14,
  wid: w,
  ph: Math.random()*6.283,
  bend: (Math.random()-0.5)*0.95,
  al: (0.055 + Math.random()*0.13) * (w > 3.6 ? 1.3 : 1),
  core: w > 3.4                                      // thick ones get a bright inner stroke
});
```
Draw each as a `quadraticCurveTo` from `r0` to `r1` with the control point offset by `bend*0.4`. If `core`, stroke a second time at `lineWidth * 0.2` in `rgba(210,250,255,α*0.5)` — a hot filament inside the soft one.

### 5.3 Filaments — 230 short curls near the pupil
Thin (`0.4–0.95px`), short, tight to the center. Their inner radius **extends outward with the aperture value**: `r0 = f.r0 * R * (1 + ap * 2.4)` — so when the eye dilates, the filaments stretch away from the pupil.

### 5.4 Wave rings — 5 slow breathing ellipses
```js
[{r:.30,a:.11,sp:.5,ph:.4,sq:.99,rot:.2,rs:.02,lw:1.4},
 {r:.46,a:.08,sp:.36,ph:1.9,sq:.985,rot:1.1,rs:-.015,lw:1},
 {r:.62,a:.06,sp:.28,ph:3.1,sq:.99,rot:2.2,rs:.012,lw:1},
 {r:.80,a:.045,sp:.22,ph:5,sq:.995,rot:.6,rs:-.01,lw:1},
 {r:.98,a:.032,sp:.18,ph:2.2,sq:.99,rot:3.4,rs:.008,lw:1}]
```
Ellipses (`sq` ≈ 0.99 squash) counter-rotating at `rs`, radius oscillating on `sp`. Barely visible individually; they give the field structure.

### 5.5 Two soft halo bands
Behind the petals, two thick low-alpha arcs at `R*0.32` (`lineWidth R*0.17`, `rgba(0,190,255,0.045)`) and `R*0.30` (`lineWidth R*0.06`, `rgba(120,235,255,0.035)`). These fill the gap between pupil and fibers so the iris doesn't look hollow.

### 5.6 The pupil — how the eye reads as an eye
After all additive drawing, switch to `'source-over'` and **punch a hole of pure background** over the center:
```js
const halo = (R*(0.042 + 0.05*ap) + (targeting ? 2.5 : 0)) * 2.2;
const g = ctx.createRadialGradient(cx,cy,0,cx,cy,halo);
g.addColorStop(0,    'rgba(0,0,0,1)');
g.addColorStop(0.45, 'rgba(0,0,0,1)');     // hard black core
g.addColorStop(0.58, 'rgba(2,5,10,0.82)'); // fast falloff
g.addColorStop(0.78, 'rgba(4,9,16,0.32)');
g.addColorStop(1,    'rgba(5,10,18,0)');   // dissolves into the iris
ctx.fillStyle = g;
ctx.beginPath(); ctx.arc(cx,cy,halo,0,6.2832); ctx.fill();
```
The two identical opaque stops at 0 and 0.45 give a **solid black pupil with a soft edge** rather than a fading smudge. Without this hole the whole thing looks like a glowing disc, not an eye.

**This is also the dilation mechanism.** `ap` (aperture, 0–1) scales `halo` — driving `ap` toward 1 opens the pupil, and because it multiplies into the filament inner radius too (§5.3), the fibers retract from the growing pupil in the same motion. Real dilation, not a scale transform.

---

## 6. Motion — the animation loop

### 6.1 One loop, crash-proof
```js
frame(now){
  try { this.step(now); } catch(err){ console.error('entity loop', err); }
  requestAnimationFrame(this.frame.bind(this));   // ← OUTSIDE the try
}
```
**The re-schedule must be outside the try/catch.** If it's inside, a single thrown frame silently kills the animation for the rest of the session. This bug cost real debugging time — do not reintroduce it.

### 6.2 Exponential easing, not CSS transitions
Every animated scalar has a `value` and a `target`, and closes the gap frame-rate-independently:
```js
value += (target - value) * (1 - Math.exp(-dt * RATE));
```
Rates: scale/dim `4.6` · centerX `3.4` · aperture `7` · spin-rate `3.4` · dial glow `6` · cursor proximity `0.08` (per-frame lerp). Flash decays `flash *= Math.exp(-dt * 5)`.

This is why motion feels weighted and physical. **Do not replace it with CSS transitions or linear tweens** — the character of the whole piece lives here.

Clamp `dt` to `0.05` max so a background-tab stall doesn't teleport everything.

### 6.3 Animated state variables
| Var | Idle | Inner page | Meaning |
|---|---|---|---|
| `sc` | `1` | `0.6` | iris scale |
| `dim` | `1` | `0.3` | global brightness |
| `cxf` | `0.5` | `0.74` | center X as a fraction of width |
| `ap` | `0` | `0` (pulses to 1) | pupil aperture |
| `spinRate` | `1` | `5` while transitioning | rotation multiplier |

### 6.4 Continuous idle motion
- **Breathing:** `R *= 1 + 0.014*sin(t*0.34) + 0.006*sin(t*0.83 + 1.1)` — two incommensurate periods, so it never visibly loops.
- **Global rotation:** `spin += dt * 0.024 * spinRate`, added to every particle's angle.
- **Per-particle wobble:** `1 + 0.02*sin(t*ws + ph) + 0.012*sin(a*3.1 + t*0.31)`.
- **Twinkle:** `alpha *= 0.58 + 0.42*sin(t*tw + ph)`.
- **Ripples:** auto-spawn every 5–9s.

### 6.5 Ripples
```js
ripples.push({ r: 0.16, v: 0.2, a: 0.5 });         // ambient
// per frame:
rp.r += rp.v*dt;  rp.v *= Math.exp(-dt*0.5);  rp.a *= Math.exp(-dt*0.62);
// cull when rp.r > 1.9 || rp.a < 0.015
```
Drawn as two concentric strokes — a sharp `1 + a*2.6` px line and a wide soft `R*0.05*a` glow.

Each ripple also **brightens the particles it passes through**:
```js
let rb = 0;
for (const rp of ripples){
  const dr = Math.abs(dot.r - rp.r);
  if (dr < 0.075) rb += (1 - dr/0.075) * rp.a;
}
const r = dot.r * wobble * (1 + rb*0.03) * R;   // nudged outward
alpha *= (1 + rb*2.1);                           // and up to 3× brighter
```
This is the single most important "alive" effect. A wave of light visibly travels outward through the particle field.

### 6.6 Cursor interaction
```js
// repulsion: particles flee the cursor
const infl = R * 0.42;
if (dist < infl){
  const f = 1 - dist/infl;
  x += (dx/dist) * f*f*26;      // quadratic falloff, up to 26px
  y += (dy/dist) * f*f*26;
  alpha *= 1 + f*0.9;
}
// proximity: whole iris brightens as you approach center
prox += ((mouse.has ? max(0, 1 - dcen/(R*1.1+1)) : 0) - prox) * 0.08;
const boost = 1 + prox*0.5;
const dim   = this.dim * (1 + prox*0.12);
// bloom canvases also brighten with prox
```

### 6.7 Particle streaking during contraction
Track scale velocity and stretch particles radially when the iris moves fast:
```js
this.vsc = (this.sc - prevSc) / Math.max(dt, 0.001);
const st  = Math.min(R*0.22, Math.abs(this.vsc)*R*0.5 + rb*R*0.02);
const sgn = this.vsc < 0 ? 1 : -1;
if (st > 1.5) {
  // stroke a line from (x,y) outward along the radial unit vector by st*sgn
} else {
  // normal fillRect dot
}
```
Motion blur for free. It's what makes the transition feel like the eye *snaps*.

---

## 7. Page system & navigation

```js
const PAGES  = ['home','about','skills','experience','projects','contact'];
const LABELS = {home:'HOME',about:'ABOUT ME',skills:'SKILLS',
                experience:'EXPERIENCE',projects:'PROJECTS',contact:'CONTACT'};
```
`.page` sections are `display:none`; the active one gets `.on`. `render(page)` swaps the section, nav active state, status text, HUD/identity/telemetry visibility, and the NEXT label, then `history.replaceState(null,'','#'+page)`. On load, a matching hash navigates straight there.

### Four ways to navigate — all four required
1. **Nav buttons** (top left) — jump to any page.
2. **The eye** — a click within `R * 0.34` of the iris center advances to the next page in sequence, cycling Contact → Home. Works on *every* page. Cursor becomes `pointer` inside the hit zone and a label (`ADVANCE // SKILLS`) appears below the core.
3. **`NEXT //` control**, bottom right, with a `01 / 06` index.
4. **Keyboard** — `→` next, `←` previous, `Esc` home.

Content clicks must `stopPropagation()` so reading text doesn't fire the eye.

---

## 8. The transition — exact timeline

Triggered by `goTo(page)`. All times in ms from the click.

| t | Action |
|---|---|
| **0** | `audio.transition(back)`. Push shockwave `{r:0.04, v:2.5, a:1.45}`. `flash = 0.8` (`0.62` for home). `spinRate` target → `5`. Targets set: `tSc = home?1:0.6`, `tDim = home?1:0.3`, `tCxf = home?0.5:0.74`, `tAp = 1`. Content fades out (`opacity 0.32s`, `translateY(16px)`), identity/telemetry/reticle fade. `fading = true`. |
| **260** | `render(page)` — the DOM swap happens *while the screen is washed out by the flash*, so it's invisible. |
| **300** | `tAp = 0` (pupil relaxes). Second softer ripple `{r:0.08, v:0.9, a:0.6}`. |
| **420** | `fading = false`. If not home, `scanT = 0` → scan beam fires. |

What the viewer perceives: shockwave bursts from the pupil → white flash → the iris spins up and snaps smaller with particles streaking radially → pupil dilates and settles → the eye slides right and dims to 30% → content rises in → a beam of light sweeps down it.

The flash element is a full-screen `radial-gradient(60% 60% at 50% 46%, rgba(255,255,255,.85), rgba(120,240,255,.45) 34%, transparent 74%)` whose opacity is driven from JS by the decaying `flash` scalar.

Backward navigation passes `back = true`, which reverses the audio sweep so it sounds different from going forward.

---

## 9. Audio — Web Audio API, fully synthesized

Class `EntityAudio`. `AudioContext` is created **lazily on first user gesture** (autoplay policy). Master gain `0.9`. Mute state persists in `localStorage['entity-audio-muted']`.

### `transition(back)` — three simultaneous layers
1. **Sub-bass thump** — `sine`, `132 → 34 Hz` exponential over 620ms (reversed: `82 → 46`). Gain `0.0001 → 0.3` in 20ms, decay to silence by 700ms.
2. **Air sweep** — a generated white-noise buffer (0.85s, linear fade-out baked in) through a `bandpass` (`Q = 1.1`) sweeping `2400 → 340 Hz` forward, `700 → 2200 Hz` backward. Peak gain `0.085`.
3. **Shimmer** — two `sine` oscillators at `1046 Hz` and `1568 Hz` (C6 + G6), staggered 50ms apart, peak gain `0.024`.

### `tick()` — hover feedback
`triangle` at `1180 Hz`, gain `0.02`, total 70ms. Fires on hover of any nav item, social icon, or the NEXT control. Only if the context already exists.

### `setHum(on)` — ambient entity drone
Three `sine` oscillators at **55, 55.4, 110.2 Hz** (the 0.4 Hz detune creates a slow beating) through a `lowpass` at `220 Hz`, with a `0.08 Hz` LFO modulating gain by `±0.006`. Fades in to `0.016` over 3 seconds. Starts after the first transition. Fades out over 600ms when muted, oscillators stopped 800ms later.

Always ramp gains with `exponentialRampToValueAtTime` from `0.0001` — never `setValueAtTime(0)` on an exponential ramp, and never start/stop a gain at zero (it throws or clicks).

**UI:** `AUDIO ON / AUDIO OFF` toggle top-right, four-bar equalizer glyph, bars drop to `opacity 0.35` when muted.

---

## 10. Two signature details (both required)

### 10.1 The page dial — the eye *is* the progress indicator
Six tick marks drawn on the canvas at `R * 1.16`, one per page, first at 12 o'clock (`angle = -π/2 + i/6 * 2π`):

| State | Length | Alpha |
|---|---|---|
| current page | `R*0.075`, 2px wide, + a 1.8px dot beyond it | `0.85` |
| visited | `R*0.042` | `0.34` |
| unvisited | `R*0.026` | `0.14` |

Multiply all by `(0.55 + 0.45*dialGlow) * (0.6 + 0.4*dim)` — so the dial **surfaces only when the cursor is near the core** and stays quiet otherwise. Track visits in a `visited` object. The eye remembers where you've been.

### 10.2 The scan beam — the entity reads the page to you
On every inner-page open, a 118px-tall gradient bar sweeps down the content column once:
```js
scanT += dt * 1.5;                                  // ~670ms total
const p = Math.min(1, scanT);
const e = 1 - Math.pow(1 - p, 2.2);                 // ease-out
el.style.transform = `translateY(${e*460 - 118}px)`;
el.style.opacity   = Math.sin(p*Math.PI) * 0.85;    // fade in and out
```
Gradient: `linear-gradient(180deg, transparent, rgba(0,240,255,.05) 62%, rgba(150,245,255,.5) 92%, rgba(220,252,255,.85) 99%, transparent)` — a soft body with a hot leading edge.

> **⚠ Implementation trap:** the beam MUST live in its own `overflow:hidden` overlay div that is a **sibling** of the scrolling content column — never a child. A transformed child inflates the parent's `scrollHeight` in Chrome, producing a phantom scrollbar and stealing content width. Position the overlay to match the content box exactly (`left: calc(var(--edge) - 24px)`, same `top`, `width: calc(min(720px,56vw) + 48px)`, same height).

---

## 11. Page content

Each page opens with an eyebrow (`02 // ABOUT ME` + a fading cyan rule) and a Space Grotesk 300 heading.

- **HOME** — no content panel. Name bottom-left at `clamp(28px,3.4vw,66px)`, `letter-spacing 0.18em`, plus a cyan rule and the tagline. Telemetry bottom-right: `NODES <particle count>`, `LATENCY 0.004 MS`, `CYCLE <random 4-digit, refreshed every 2.8s>`. Reticle over the iris (thin ring, four crosshair ticks, four corner brackets) at `opacity 0.42`, going to `1` on target lock. Cue text below: `MOVE CURSOR TO TARGET // CLICK TO INITIALIZE` → `TARGET LOCKED // CLICK TO INITIALIZE` in `--cyan-soft`.
- **ABOUT ME** — `02`. Photo frame left: `clamp(150px,17vw,236px)` × `clamp(188px,21vw,296px)`, 7px padding, `1px solid rgba(0,240,255,.2)`, cyan L-brackets top-left and bottom-right, caption `OPERATOR IMAGE // 0x01` positioned at `top:100%; margin-top:9px; white-space:nowrap` (**below** the frame — inside it, the caption wraps and rides the border). Image `object-fit: cover`, `filter: saturate(.9) contrast(1.05)`. Right: heading, bio paragraph, and a 2×2 stat grid (FOCUS / STATUS / BASED / DEGREE). Below ~820px the text column wraps beneath the photo.
- **SKILLS** — `03`, "STACK MAP". Three columns (`repeat(auto-fit, minmax(150px,1fr))`): LANGUAGES / AI & ML / TOOLS. Tags are 1px-bordered rectangles, `7px 11px`, border → `rgba(0,240,255,.5)` and text → white on hover.
- **EXPERIENCE** — `04`, "SERVICE RECORD". Vertical timeline: 92px right-aligned date column, a 1px spine with a node dot, then role / org / one-line result. The most recent row gets a filled glowing cyan node and a gradient spine; older rows get hollow nodes.
- **PROJECTS** — `05`, "BUILD LOG". Numbered rows (`01`, `02`, `03`) with title, one-line description, and a right-aligned stack label. Hover fills `rgba(0,240,255,.05)`.
- **CONTACT** — `06`, "OPEN CHANNEL". Three channel rows: 90px key column, value, right-aligned action (`SEND` / `OPEN`). Real `mailto:` and profile links.

Leave the user's real details as clearly-marked placeholders. Do not invent employers, dates, or metrics.

---

## 12. Responsive & performance

- Particle count scales with width: `× clamp(w/1600, 0.55, 1.15)`.
- DPR capped at **1.5** — above that the particle fill rate stops paying for itself.
- Every vertical rhythm value uses `clamp()` against `vh` so short laptop screens compress instead of clipping.
- Content column has a bounded height and quiet scrolling (`scrollbar-width: thin`, `scrollbar-color: rgba(0,240,255,.3) transparent`).
- Rebuild canvas sizes and particle counts on `resize`.
- Squares (`fillRect`) not circles (`arc`) for dots.
- Bloom canvases are 1/4 and 1/10 scale, so their blur cost is trivial.
- One `requestAnimationFrame` loop; nothing else animates in JS.

---

## 13. Acceptance checklist

- [ ] One `index.html`, no dependencies, no build step, opens from `file://`.
- [ ] Iris visibly rotates differentially, breathes, twinkles, and sends a ripple every 5–9s.
- [ ] Moving the cursor through the field pushes particles away and brightens them.
- [ ] Approaching the center brightens the whole iris and lights the reticle to full.
- [ ] Clicking the pupil advances pages; clicking outside `R*0.34` does nothing.
- [ ] Transition: shockwave → flash → streaking contraction → pupil dilation → slide right + dim → content in → scan beam.
- [ ] All six pages reachable four ways (nav, eye, NEXT, keyboard). `Esc` returns home.
- [ ] Audio: transition sweep, hover ticks, ambient hum; toggle persists across reloads; reverse navigation sounds different.
- [ ] Page dial shows current page lit, visited half-lit, and brightens only near the core.
- [ ] No phantom scrollbar on any page; About caption never touches the frame border.
- [ ] 60fps at 1920×1080; no console errors; one thrown frame cannot kill the loop.
- [ ] `#projects` in the URL deep-links correctly.
