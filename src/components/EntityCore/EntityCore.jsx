import { useEffect, useRef } from 'react'
import './EntityCore.css'

const RINGS=46
const DPR_CAP=1.5
const TAU=Math.PI*2

function clamp(v,min,max){
  return Math.max(min,Math.min(max,v))
}

function tintPrefix(r){
  const mix=clamp((r-0.24)/0.75,0,1)
  const g=Math.round(238-116*mix)
  const rr=Math.round(24+14*(1-mix))
  return `rgba(${rr},${g},255,`
}

function makeDot(k){
  const tt =Math.pow(k/RINGS,0.9)
  const r=0.2+tt*0.92+(Math.random()-0.5)*0.011

  const nd=22+(k%7)*7
  const sg=Math.floor(Math.random()*nd)
  const a=(sg/nd)*TAU+(Math.random()-0.5)*(TAU/nd)*0.7+k*0.21

  const sect=
  0.5+
  0.32*Math.sin(a*3+1.05)+
  0.2 * Math.sin(a * 5 - 2.1) +
  0.14 * Math.sin(a * 2 + 0.4)
  let al=(0.2+0.8*clamp(sect,0.06,1))*(1-tt*0.34)

  const hot=Math.random()<0.035

  if(hot) al*=1.7
return{
  r,a,
  va: (0.05 / (0.32 + r)) * (0.85 + Math.random() * 0.3), // inner rings orbit faster
    ph: Math.random() * TAU,
    ws: 0.25 + Math.random() * 0.6,
    tw: 0.7 + Math.random() * 2.6,
    al: al * (0.6 + Math.random() * 0.6),
    s: hot ? 1.8 + Math.random() * 1.3 : r < 0.45 ? 0.9 + Math.random() * 1.1 : 0.8 + Math.random(),
    c: tintPrefix(r),
}
}

function makeDots(count){
  const dots=new Array(count)
  for (let i=0;i<count;i++)
  {
    dots[i]=makeDot(Math.floor(Math.random()*RINGS))
  }
  return dots
}

function EntityCore() {
  const canvasRef=useRef(null)
  useEffect(()=>{
    const canvas=canvasRef.current
    const ctx=canvas.getContext('2d')
    let dots=[]
    let width=0
    let height=0
    function resize(){
      width=window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.round(5200 * clamp(width / 1600, 0.55, 1.15))
      dots = makeDots(count)
    }
     resize()
    window.addEventListener('resize', resize)

    let time = 0
    let spin = 0
    let lastNow = performance.now()
    let rafId

    function step(now) {
      const dt = Math.min(0.05, (now - lastNow) / 1000)
      lastNow = now
      time += dt
      spin += dt * 0.024 // spinRate = 1 while idle

      const cx = width * 0.5
      const cy = height * 0.46
      const breathe = 1 + 0.014 * Math.sin(time * 0.34) + 0.006 * Math.sin(time * 0.83 + 1.1)
      const R = Math.min(width * 0.3, height * 0.46) * breathe

      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      for (const dot of dots) {
        const wobble =
          1 + 0.02 * Math.sin(time * dot.ws + dot.ph) + 0.012 * Math.sin(dot.a * 3.1 + time * 0.31)
        const twinkle = 0.58 + 0.42 * Math.sin(time * dot.tw + dot.ph)
        const angle = dot.a + time * dot.va + spin

        const radius = dot.r * wobble * R
        const x = cx + Math.cos(angle) * radius
        const y = cy + Math.sin(angle) * radius
        const alpha = dot.al * twinkle

        ctx.fillStyle = `${dot.c}${alpha.toFixed(3)})`
        ctx.fillRect(x - dot.s / 2, y - dot.s / 2, dot.s, dot.s)
      }

      // Punch a hole of pure background over the center — without this the
      // whole thing reads as a glowing disc, not an eye.
      ctx.globalCompositeOperation = 'source-over'
      const halo = R * 0.042 * 2.2
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
    }
  }, [] 
  )
  return <canvas ref={canvasRef} className="entity-core-canvas" aria-hidden="true" />
}

export default EntityCore