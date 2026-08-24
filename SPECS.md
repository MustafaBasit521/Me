# Entity Portfolio — Build Spec

Handoff doc for Claude Code. Everything below matches `standalone/index.html`.

---

## 1. Color palette

### Core tokens
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#07090E` | Page base (near-black, blue-shifted) |
| `--bg2` | `#0A0D14` | Center of the radial background |
| `--bg3` | `#05070B` | Outer edge of the radial background |
| `--cyan` | `#00F0FF` | Primary accent — active underline, frame corners, glows |
| `--cyan-soft` | `#7FE9FF` | Secondary accent — labels, icons, meta text |
| `--green` | `#3DFF9E` | Status dot only (live indicator) |
| `--text` | `#FFFFFF` | Headings, key values |
| `--muted` | `#A0AEC0` | Body copy, inactive nav |

Page background is not a flat fill:
```css
background: radial-gradient(140% 110% at 50% 44%, #0A0D14 0%, #07090E 62%, #05070B 100%);
```

### Alpha values (the palette is mostly transparency, not new hues)
Never introduce a new hue — dim the existing ones.
- Hairlines / dividers: `rgba(255,255,255,0.07)`
- Cyan hairlines: `rgba(0,240,255,0.14)` → `0.20` on borders
- HUD grid lines: `rgba(0,240,255,0.045)` – `0.05`
- HUD micro-labels: `rgba(160,174,192,0.28)` – `0.45`
- Body copy: `rgba(160,174,192,0.78)` – `0.82`
- Tag borders: `rgba(255,255,255,0.09)`, hover `rgba(0,240,255,0.5)`
- Row hover fill: `rgba(0,240,255,0.05)`
- Glass panel: `linear-gradient(180deg, rgba(11,17,26,0.72), rgba(7,10,16,0.62))` + `1px solid rgba(0,240,255,0.16)` + `backdrop-filter: blur(10px)`

### Particle colors (canvas)
Particles are tinted by radius — inner particles are cyan, outer ones shift blue:
```js
const mix = clamp((r - 0.24) / 0.75, 0, 1);
`rgba(${24 + 14*(1-mix)}, ${238 - 116*mix}, 255, alpha)`
// inner ≈ rgb(38,238,255)   outer ≈ rgb(24,122,255)
```
Other canvas strokes: rings `rgba(0,205,255,α)`, petals `rgba(60,225,255,α)` with `rgba(210,250,255,α)` cores, filaments `rgba(140,215,255,α)`, ripples `rgba(160,242,255,α)`, dial ticks `rgba(150,240,255,α)`.

### Rules
- Max 2 accent hues (cyan + the green dot). No purple, no gradients as decoration.
- Everything glowing uses `box-shadow: 0 0 Npx rgba(0,240,255,0.x)` — never a border-radius blob.
- All canvas drawing uses `globalCompositeOperation = 'lighter'` (additive), which is what produces the bloom look.

---

## 2. Typography
- **Display:** Space Grotesk, weight 300 only. Headings, name, project titles. `letter-spacing: 0.09em–0.20em`.
- **Mono:** JetBrains Mono. Everything else — nav, labels, body, HUD.
- Uppercase + wide tracking (`0.20em–0.32em`) for all labels; sentence case only for paragraph copy.
- Sizes: name `clamp(28px,3.4vw,66px)`, section h2 `clamp(24px,2.1vw,34px)`, row titles `19px`, body `12–12.5px`, labels `9–10px`.

---

## 3. Functionality

### 3.1 Page system
Six pages, one array, no router:
```js
const PAGES = ['home','about','skills','experience','projects','contact'];
```
- `.page` sections are `display:none`; the active one gets `.on`.
- `render(page)` swaps the section, nav active state, status text, HUD visibility, and the NEXT label.
- `history.replaceState` writes `#about` etc. so pages are linkable; on load, a matching hash jumps straight there.

### 3.2 Navigation — four ways in
1. **Nav buttons** (top left) — jump to any page.
2. **The eye** — clicking within `R * 0.34` of the iris center advances to the next page in sequence. Works on every page, cycling back to Home from Contact. Cursor becomes `pointer` and a label appears under the core when you're within the hit zone.
3. **NEXT // label** (bottom right) — same as the eye.
4. **Keyboard** — `→` next, `←` previous, `Esc` home.

### 3.3 Transition sequence (`goTo`)
All timings in ms from the click:
| t | What happens |
|---|---|
| 0 | Audio fires. Shockwave ripple pushed (`{r:.04, v:2.5, a:1.45}`). Flash set to 0.8. Iris spin rate ×5. Targets set: `scale 0.6`, `dim 0.3`, `centerX 0.74` (or `1 / 1 / 0.5` for Home). Content fades out. |
| 260 | `render(page)` — DOM swap happens while the screen is washed out. |
| 300 | Aperture relaxes, second softer ripple. |
| 420 | Transition unlocks; scan beam starts (`scanT = 0`). |

All motion is exponential easing toward targets in the animation loop, not CSS transitions:
```js
this.sc += (this.tSc - this.sc) * (1 - Math.exp(-dt * 4.6));
```
This is why it feels weighted rather than linear. Scale velocity (`vsc`) drives **radial particle streaking** — when the iris is contracting fast, particles render as short lines instead of dots.

### 3.4 Audio (Web Audio API — zero audio files)
Everything is synthesized at runtime. `EntityAudio` class:
- **`transition(back)`** — three layers: (a) sine sub-bass 132→34 Hz over 620ms, (b) white-noise burst through a bandpass sweeping 2400→340 Hz, (c) two sine shimmers at 1046/1568 Hz. When `back` is true the sweep reverses (700→2200 Hz) so backwards navigation sounds different.
- **`tick()`** — 1180 Hz triangle, 70ms, on hover of any interactive element.
- **`setHum(on)`** — ambient drone: three sines (55, 55.4, 110.2 Hz) through a 220 Hz lowpass, with a 0.08 Hz LFO on the gain. Fades in over 3s.
- Muting persists in `localStorage['entity-audio-muted']`. AudioContext is created lazily on first gesture (browser autoplay policy).

### 3.5 Canvas engine
Three stacked canvases, one draw pass:
1. `#core` — full resolution (capped at DPR 1.5).
2. `#bloom` — the core downscaled ÷4, `filter: blur(13px)`.
3. `#bloomWide` — downscaled ÷10, `filter: blur(46px)`.

Downscale-plus-CSS-blur is a cheap fake bloom — far faster than a real shader and visually identical at this scale.

Four particle systems, all polar (`radius`, `angle`) around a moving center:
- **~5200 dots** on 46 discrete rings, quantized into angular segments so you see ring structure, not soup. 3.5% are "hot" (bigger, 1.7× brighter).
- **155 petals** — quadratic curves radiating from `r 0.23–0.43`, wide ones get a bright inner core stroke.
- **230 filaments** — thin short curls near the pupil, they extend as the aperture opens.
- **5 wave rings** — slow breathing ellipses.

Per-frame effects:
- **Ripples** — auto-spawn every 5–9s, plus one per transition. Each brightens particles within `±0.075` radius as it passes and nudges them outward.
- **Cursor repulsion** — particles within `R*0.42` of the cursor are pushed away by `(1-d)²·26 px` and brightened up to 1.9×.
- **Proximity boost** — the whole iris brightens as the cursor nears the center.
- **Breathing** — radius oscillates ±1.4% on two sine periods.
- **Pupil** — a radial gradient of pure background punched over the center in `source-over`, which is what makes it read as an eye rather than a disc.

### 3.6 The page dial (unique element #1)
Six tick marks drawn at `R * 1.16`, one per page, starting at 12 o'clock:
- Current page: long tick (`R*0.075`), 2px, 85% alpha, plus a dot beyond it.
- Visited pages: medium tick, 34% alpha — the entity remembers where you've been.
- Unvisited: short tick, 14% alpha.
The whole dial brightens when the cursor is over the core, so it surfaces only when relevant.

### 3.7 Scan beam (unique element #2)
On every page open, a 118px gradient bar sweeps down the content once over ~670ms, easing out (`1-(1-p)^2.2`), opacity following `sin(p·π)`. Reads as the entity scanning the file.

**Implementation warning:** the beam must live in its own overlay div that is a *sibling* of the scrolling content, not a child. A transformed child inflates the parent's `scrollHeight` in Chrome, which creates a phantom scrollbar and steals content width.

### 3.8 The animation loop
```js
frame(now){
  try { this.step(now); } catch(err){ console.error(err); }
  requestAnimationFrame(this.frame.bind(this));   // always re-schedules
}
```
The re-schedule is outside the try. If it isn't, one thrown frame silently kills the entire animation forever.

### 3.9 Responsive behavior
- Content column: `width: min(720px, 56vw)`, `max-height: calc(100vh - clamp(150px,20vh,196px))`, `overflow-y: auto` as a safety net.
- About photo: `clamp(150px,17vw,236px)` and the text column wraps beneath it below ~820px.
- Skills grid: `repeat(auto-fit, minmax(150px, 1fr))`.
- All vertical rhythm uses `clamp()` against `vh`, so short laptop screens compress instead of clipping.
- Particle count scales with viewport width (`×(w/1600)`, clamped 0.55–1.15).

---

## 4. Performance notes
- Single `requestAnimationFrame` loop; nothing else animates in JS.
- DPR capped at 1.5 — above that the particle fill rate stops paying for itself.
- Bloom canvases are 1/4 and 1/10 scale, so the blur cost is trivial.
- ~5800 draw calls per frame, all `fillRect`/`stroke` on one context. Holds 60fps on integrated graphics.
- No dependencies, no build step, no network requests except the two Google Fonts.
