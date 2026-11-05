import React, { useEffect, useRef, useState } from 'react'
import { Icon } from './Art'
import { saveTheDate } from '../data'

const HEART = 'M150 268 C150 268 22 190 12 104 C4 40 52 8 96 12 C124 15 142 34 150 52 C158 34 176 15 204 12 C248 8 296 40 288 104 C278 190 150 268 150 268 Z'
const W = 300
const H = 280
/** Reveal when about 25% of the cover remains (75% scratched). */
const REVEAL_REMAINING = 0.25

export default function ScratchHeart() {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const last = useRef(null)
  const revealedRef = useRef(false)
  const [revealed, setRevealed] = useState(false)
  const [confetti, setConfetti] = useState([])

  // paint the glittery sage heart
  useEffect(() => {
    const c = canvasRef.current
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    c.width = W * dpr
    c.height = H * dpr
    const ctx = c.getContext('2d')
    ctx.scale(dpr, dpr)
    const p = new Path2D(HEART)
    const g = ctx.createRadialGradient(110, 90, 10, 150, 140, 190)
    g.addColorStop(0, '#dfe5cf')
    g.addColorStop(0.35, '#a7b48f')
    g.addColorStop(0.75, '#7b8b66')
    g.addColorStop(1, '#5f6f4d')
    ctx.fillStyle = g
    ctx.fill(p)
    // glitter
    ctx.save()
    ctx.clip(p)
    for (let i = 0; i < 1600; i++) {
      const x = Math.random() * W
      const y = Math.random() * H
      const a = Math.random()
      ctx.fillStyle = a > 0.6 ? `rgba(255,255,240,${0.35 + Math.random() * 0.5})` : `rgba(60,72,45,${Math.random() * 0.35})`
      ctx.fillRect(x, y, Math.random() * 1.6 + 0.4, Math.random() * 1.6 + 0.4)
    }
    // glossy highlight
    const hl = ctx.createRadialGradient(95, 70, 2, 95, 70, 70)
    hl.addColorStop(0, 'rgba(255,255,255,0.55)')
    hl.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = hl
    ctx.fillRect(0, 0, W, H)
    ctx.restore()
  }, [])

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }
  }

  const scratch = (pt) => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 38
    ctx.beginPath()
    const from = last.current || pt
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(pt.x, pt.y)
    ctx.stroke()
    last.current = pt
  }

  const checkProgress = () => {
    if (revealedRef.current) return
    const c = canvasRef.current
    const ctx = c.getContext('2d', { willReadFrequently: true })
    const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height)

    // Sample only pixels inside the heart shape
    const path = new Path2D(HEART)
    const dpr = c.width / W
    let filled = 0
    let total = 0
    const step = 4
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const lx = x / dpr
        const ly = y / dpr
        if (!ctx.isPointInPath(path, lx, ly)) continue
        total++
        const a = data[(y * width + x) * 4 + 3]
        if (a > 20) filled++
      }
    }
    if (total > 0 && filled / total <= REVEAL_REMAINING) reveal()
  }

  const reveal = () => {
    if (revealedRef.current) return
    revealedRef.current = true
    setRevealed(true)
    const colors = ['#2f3f2b', '#4c5e3f', '#b39a6b', '#8a8a7a', '#d8c7a6']
    setConfetti(
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 3 + Math.random() * 6,
        delay: Math.random() * 0.8,
        dur: 2.4 + Math.random() * 2,
        drift: (Math.random() - 0.5) * 80,
        color: colors[i % colors.length],
      }))
    )
  }

  const down = (e) => {
    if (revealedRef.current) return
    drawing.current = true
    last.current = null
    e.currentTarget.setPointerCapture?.(e.pointerId)
    scratch(pos(e))
  }
  const move = (e) => {
    if (!drawing.current || revealedRef.current) return
    scratch(pos(e))
    checkProgress()
  }
  const up = () => {
    if (!drawing.current) return
    drawing.current = false
    last.current = null
    checkProgress()
  }

  return (
    <section className="section scratch-section reveal">
      <div className="confetti-layer" aria-hidden="true">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="confetti"
            style={{
              left: c.left + '%',
              width: c.size,
              height: c.size,
              background: c.color,
              animationDelay: c.delay + 's',
              animationDuration: c.dur + 's',
              '--drift': c.drift + 'px',
            }}
          />
        ))}
      </div>

      <h2 className="script-title swap-title">
        <span className={revealed ? 'out' : ''}>{saveTheDate.scratchTitle}</span>
        <span className={revealed ? '' : 'out'}>{saveTheDate.revealedTitle}</span>
      </h2>
      <div className="mini-heart">
        <Icon.heart width="9" height="9" />
      </div>

      <div className="scratch-box">
        <svg viewBox={`0 0 ${W} ${H}`} className="heart-under">
          <path d={HEART} fill="#faf8f2" stroke="#d6d2c6" strokeWidth="1.5" />
          <text x="150" y="100" textAnchor="middle" className="std-label">{saveTheDate.label}</text>
          <text x="150" y="138" textAnchor="middle" className="std-date">{saveTheDate.dateText}</text>
          <text x="150" y="168" textAnchor="middle" className="std-small">{saveTheDate.day}</text>
          <text x="150" y="194" textAnchor="middle" className="std-small">{saveTheDate.time}</text>
        </svg>
        <canvas
          ref={canvasRef}
          className={`scratch-canvas ${revealed ? 'gone' : ''}`}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onPointerLeave={up}
        />
      </div>
    </section>
  )
}
