import './Grain.css'

// feTurbulence generates procedural noise in-browser — no image file needed.
// type="fractalNoise" gives the soft, cloudy variant (vs. "turbulence"'s
// harsher look); baseFrequency controls the grain size.
function Grain() {
  return (
    <svg className="grain" aria-hidden="true">
      <filter id="grain-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-noise)" />
    </svg>
  )
}

export default Grain
