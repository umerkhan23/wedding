// Hand-drawn SVG artwork: seal, embossed leaves, curtains, roses, garden + fountain.
import React from 'react'

/* ---------------- helpers ---------------- */
function scallopPath(cx, cy, rx, ry, bumps, depth) {
  const pts = []
  const steps = bumps * 12
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const k = 1 + depth * Math.abs(Math.sin((t * bumps) / 2))
    pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k])
  }
  return 'M' + pts.map((p) => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join('L') + 'Z'
}

/* ---------------- Seal (Tap to open) ---------------- */
export function Seal() {
  const outer = scallopPath(100, 120, 78, 98, 18, 0.07)
  const inner = scallopPath(100, 120, 66, 85, 18, 0.06)
  return (
    <svg viewBox="0 0 200 240" className="seal-svg" aria-hidden="true">
      <defs>
        <radialGradient id="sealFill" cx="45%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#f6ead6" />
          <stop offset="70%" stopColor="#ead6b6" />
          <stop offset="100%" stopColor="#d9bf96" />
        </radialGradient>
        <filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#2e3a24" floodOpacity="0.35" />
        </filter>
      </defs>
      <path d={outer} fill="url(#sealFill)" stroke="#b9956a" strokeWidth="2" filter="url(#sealShadow)" />
      <path d={inner} fill="none" stroke="#b9956a" strokeWidth="1.2" strokeDasharray="1 4" strokeLinecap="round" />
      <ellipse cx="100" cy="120" rx="52" ry="68" fill="none" stroke="#c9a77a" strokeWidth="0.8" />
      {/* top sprig */}
      <g stroke="#8f7350" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M100 62 L100 92" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path d={`M100 ${70 + i * 8} q-9 -4 -12 -10`} />
            <path d={`M100 ${70 + i * 8} q9 -4 12 -10`} />
          </g>
        ))}
      </g>
      <text x="100" y="117" textAnchor="middle" className="seal-text">TAP TO</text>
      <text x="100" y="134" textAnchor="middle" className="seal-text">OPEN</text>
      {/* bottom sprig */}
      <g stroke="#8f7350" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M100 148 L100 176" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path d={`M100 ${170 - i * 8} q-9 4 -12 10`} />
            <path d={`M100 ${170 - i * 8} q9 4 12 10`} />
          </g>
        ))}
      </g>
    </svg>
  )
}

/* ---------------- Embossed leaf pattern for the green doors ---------------- */
function Sprig({ x, y, s = 1, r = 0 }) {
  const leaves = []
  for (let i = 0; i < 6; i++) {
    const ty = -i * 14
    const side = i % 2 ? 1 : -1
    leaves.push(
      <ellipse key={i} cx={side * 9} cy={ty - 4} rx="9" ry="4.2" transform={`rotate(${side * -35} ${side * 9} ${ty - 4})`} />
    )
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 10 Q2 -40 -2 -88" fill="none" strokeWidth="1.4" />
      {leaves}
      <ellipse cx="-1" cy="-92" rx="4" ry="8" />
    </g>
  )
}

export function LeafPattern({ id }) {
  const sprigs = [
    { x: 40, y: 110, r: -25, s: 1 },
    { x: 150, y: 70, r: 30, s: 0.8 },
    { x: 110, y: 230, r: 10, s: 1.1 },
    { x: 30, y: 300, r: -40, s: 0.9 },
    { x: 170, y: 330, r: 35, s: 1 },
    { x: 80, y: 400, r: -15, s: 0.85 },
  ]
  const g = (cls, dx, dy) => (
    <g className={cls} transform={`translate(${dx} ${dy})`}>
      {sprigs.map((p, i) => (
        <Sprig key={i} {...p} />
      ))}
    </g>
  )
  return (
    <svg className="leaf-pattern" aria-hidden="true">
      <defs>
        <pattern id={id} width="200" height="420" patternUnits="userSpaceOnUse">
          {g('emboss-dark', 1.2, 1.6)}
          {g('emboss-light', -0.8, -1)}
          {g('emboss-mid', 0, 0)}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/* ---------------- Pleat fill used by all curtain shapes ---------------- */
export function PleatDefs({ id, w = 22 }) {
  return (
    <defs>
      <linearGradient id={id + 'g'} x1="0" x2="1">
        <stop offset="0" stopColor="#e2cdae" />
        <stop offset="0.3" stopColor="#f6ead8" />
        <stop offset="0.55" stopColor="#fbf3e6" />
        <stop offset="0.8" stopColor="#ead8bd" />
        <stop offset="1" stopColor="#d9c19e" />
      </linearGradient>
      <pattern id={id} width={w} height="10" patternUnits="userSpaceOnUse">
        <rect width={w} height="10" fill={`url(#${id}g)`} />
      </pattern>
    </defs>
  )
}

/* ---------------- Valance (swags) + tied-back side curtains ---------------- */
function SideCurtain({ side }) {
  const id = 'pl' + side
  // drawn for the LEFT side; mirrored for the right
  const outline = 'M0 0 L100 0 C92 22 58 42 30 56 C46 70 64 86 74 100 L0 100 Z'
  const edge = 'M100 0 C92 22 58 42 30 56 C46 70 64 86 74 100'
  return (
    <svg className={`side-curtain ${side}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <PleatDefs id={id} w={9} />
      <path d={outline} fill={`url(#${id})`} />
      {[18, 36, 54].map((x, i) => (
        <path key={i} d={`M${x} 0 C${x - 2} 20 ${20 + i * 2} 44 ${18 + i * 3} 56 C${26 + i * 6} 70 ${30 + i * 10} 86 ${30 + i * 12} 100`} fill="none" stroke="#d3ba95" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.8" />
      ))}
      <path d={edge} className="beads" vectorEffect="non-scaling-stroke" />
      <path d="M74 100 L0 100" className="beads small" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function HeroCurtains() {
  const swags = [
    [0, 140],
    [130, 270],
    [260, 400],
  ]
  return (
    <div className="hero-curtains" aria-hidden="true">
      <SideCurtain side="left" />
      <SideCurtain side="right" />
      <span className="tieback left" />
      <span className="tieback right" />
      <svg className="valance" viewBox="0 0 400 130" preserveAspectRatio="xMidYMin meet">
        <PleatDefs id="plv" w={9} />
        <defs>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#8a6a45" floodOpacity="0.3" />
          </filter>
        </defs>
        <g filter="url(#softShadow)">
          <rect x="0" y="0" width="400" height="12" fill="#ecdcc2" />
          {swags.map(([a, b], i) => {
            const m = (a + b) / 2
            return (
              <g key={i}>
                <path d={`M${a} 0 Q${m} 140 ${b} 0 Z`} fill="url(#plv)" />
                <path d={`M${a + 10} 4 Q${m} 110 ${b - 10} 4`} fill="none" stroke="#d6bf9c" strokeWidth="1.2" />
                <path d={`M${a + 20} 4 Q${m} 84 ${b - 20} 4`} fill="none" stroke="#d6bf9c" strokeWidth="1" />
                <path d={`M${a} 0 Q${m} 140 ${b} 0`} className="beads" />
              </g>
            )
          })}
          {[0, 135, 265, 400].map((x, i) => (
            <g key={i}>
              <path d={`M${x - 13} 0 L${x + 13} 0 L${x + 9} 64 Q${x} 76 ${x - 9} 64 Z`} fill="url(#plv)" />
              <path d={`M${x + 9} 64 Q${x} 76 ${x - 9} 64`} className="beads small" />
              <circle cx={x} cy="8" r="7" fill="#f3e6d0" stroke="#c4a47a" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

/* ---------------- Roses & leaves ---------------- */
const ROSE = {
  blush: ['#f2d3c6', '#e3ab98', '#c97d6b'],
  cream: ['#fbf3e6', '#efdcc0', '#c9ac85'],
  dusty: ['#eac0b3', '#d29584', '#a8604f'],
}
export function Rose({ x, y, r = 12, tone = 'blush' }) {
  const [l, m, d] = ROSE[tone]
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={m} />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={r * 0.55} cy="0" rx={r * 0.55} ry={r * 0.42} fill={l} opacity="0.9" transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.55} fill={m} />
      <path
        d={`M0 0 m-${r * 0.35} 0 a${r * 0.35} ${r * 0.35} 0 1 1 ${r * 0.5} ${r * 0.2} a${r * 0.2} ${r * 0.2} 0 1 1 -${r * 0.25} -${r * 0.25}`}
        fill="none"
        stroke={d}
        strokeWidth={r * 0.1}
        strokeLinecap="round"
      />
    </g>
  )
}
function Leaf({ x, y, s = 1, r = 0, c = '#5f7350' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0 Q8 -6 18 0 Q8 6 0 0 Z" fill={c} />
      <path d="M1 0 L16 0" stroke="#3f4f35" strokeWidth="0.5" />
    </g>
  )
}
function Cypress({ x, y, h = 120, w = 22 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-2" y="-8" width="4" height="12" fill="#6b5a45" />
      <path d={`M0 ${-h} C${w * 0.7} ${-h * 0.7} ${w * 0.6} ${-h * 0.2} ${w * 0.45} -6 L${-w * 0.45} -6 C${-w * 0.6} ${-h * 0.2} ${-w * 0.7} ${-h * 0.7} 0 ${-h} Z`} fill="#3e5236" />
      <path d={`M0 ${-h + 8} C${w * 0.4} ${-h * 0.65} ${w * 0.35} ${-h * 0.25} ${w * 0.25} -10`} stroke="#5a7049" strokeWidth="3" fill="none" opacity="0.6" />
      <rect x={-w * 0.55} y="-6" width={w * 1.1} height="16" rx="2" fill="#e8d6bc" stroke="#c9b08c" />
    </g>
  )
}

export function FlowerBush({ x, y, s = 1, flip = false, seed = 1 }) {
  const rnd = (n) => {
    const v = Math.sin(seed * 999 + n * 77.7) * 10000
    return v - Math.floor(v)
  }
  const leaves = Array.from({ length: 22 }, (_, i) => ({
    x: (rnd(i) - 0.5) * 120,
    y: (rnd(i + 50) - 0.5) * 60,
    r: rnd(i + 100) * 360,
    s: 0.8 + rnd(i + 150) * 0.7,
    c: i % 3 ? '#5f7350' : '#7d8f62',
  }))
  const tones = ['blush', 'cream', 'dusty', 'cream', 'blush']
  const roses = Array.from({ length: 9 }, (_, i) => ({
    x: (rnd(i + 200) - 0.5) * 100,
    y: (rnd(i + 250) - 0.5) * 44,
    r: 7 + rnd(i + 300) * 7,
    tone: tones[i % tones.length],
  }))
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {leaves.map((l, i) => (
        <Leaf key={i} {...l} />
      ))}
      {roses.map((r, i) => (
        <Rose key={i} {...r} />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} cx={(rnd(i + 400) - 0.5) * 110} cy={(rnd(i + 450) - 0.5) * 56} r="2" fill="#f7efe2" />
      ))}
    </g>
  )
}

/* ---------------- Garden + fountain scene ---------------- */
export function Garden() {
  return (
    <svg className="garden" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        <radialGradient id="water" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#c4d2cf" />
          <stop offset="0.7" stopColor="#8fa6a3" />
          <stop offset="1" stopColor="#6e8784" />
        </radialGradient>
        <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6ecdc" />
          <stop offset="1" stopColor="#dcc6a5" />
        </linearGradient>
        <linearGradient id="fadeTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0e2cf" stopOpacity="0" />
          <stop offset="1" stopColor="#ead9c1" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* ground */}
      <rect x="0" y="150" width="400" height="150" fill="url(#fadeTop)" />

      {/* balustrade */}
      <g>
        <rect x="0" y="118" width="400" height="8" fill="url(#stone)" stroke="#cdb48f" strokeWidth="0.6" />
        {Array.from({ length: 26 }, (_, i) => (
          <path key={i} d={`M${8 + i * 15.5} 126 q-4 8 0 14 q4 6 0 12 h6 q-4 -6 0 -12 q4 -6 0 -14 z`} fill="#efe1cb" stroke="#d1b994" strokeWidth="0.5" />
        ))}
        <rect x="0" y="152" width="400" height="6" fill="url(#stone)" stroke="#cdb48f" strokeWidth="0.6" />
      </g>

      {/* cypress trees */}
      <Cypress x={30} y={150} h={135} w={24} />
      <Cypress x={74} y={156} h={110} w={20} />
      <Cypress x={326} y={156} h={110} w={20} />
      <Cypress x={370} y={150} h={135} w={24} />

      {/* fountain */}
      <g transform="translate(200 215)">
        <ellipse cx="0" cy="18" rx="128" ry="34" fill="#c9b08c" opacity="0.35" />
        <ellipse cx="0" cy="8" rx="122" ry="34" fill="url(#stone)" stroke="#c4a77f" />
        <ellipse cx="0" cy="4" rx="106" ry="26" fill="url(#water)" />
        <path d="M-80 4 q20 -6 40 0 t40 0 t40 0 t40 0" stroke="#e5eeec" strokeWidth="1" fill="none" opacity="0.7" />
        <path d="M-60 12 q20 -5 40 0 t40 0 t40 0" stroke="#e5eeec" strokeWidth="1" fill="none" opacity="0.5" />
        <rect x="-7" y="-42" width="14" height="46" fill="url(#stone)" stroke="#c4a77f" />
        <ellipse cx="0" cy="-42" rx="24" ry="7" fill="url(#stone)" stroke="#c4a77f" />
        <ellipse cx="0" cy="-43" rx="18" ry="4" fill="url(#water)" />
        <g className="fountain-jet">
          <path d="M0 -46 q-14 -18 -24 2" stroke="#dce7e5" strokeWidth="1.5" fill="none" />
          <path d="M0 -46 q14 -18 24 2" stroke="#dce7e5" strokeWidth="1.5" fill="none" />
          <path d="M0 -46 v-16" stroke="#dce7e5" strokeWidth="1.5" />
        </g>
      </g>

      {/* flower bushes */}
      <FlowerBush x={40} y={205} s={0.9} seed={2} />
      <FlowerBush x={360} y={205} s={0.9} flip seed={5} />
      <FlowerBush x={30} y={272} s={1.15} seed={3} />
      <FlowerBush x={370} y={272} s={1.15} flip seed={7} />
      <FlowerBush x={120} y={290} s={0.7} seed={11} />
      <FlowerBush x={280} y={290} s={0.7} flip seed={13} />
    </svg>
  )
}

/* ---------------- Gallery illustrations (draped backdrop + florals) ---------------- */
export function GalleryScene({ variant = 0 }) {
  const bg = [
    ['#e9d3c0', '#cfae95'],
    ['#efe0cf', '#d2b79c'],
    ['#e6cfc0', '#c59f88'],
    ['#efe4d6', '#d7c0a6'],
  ][variant % 4]
  return (
    <svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" className="gallery-svg" aria-hidden="true">
      <PleatDefs id={'gp' + variant} w={12} />
      <defs>
        <linearGradient id={'gb' + variant} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bg[0]} />
          <stop offset="1" stopColor={bg[1]} />
        </linearGradient>
        <radialGradient id={'gl' + variant} cx="50%" cy="30%" r="60%">
          <stop offset="0" stopColor="#fff8ee" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fff8ee" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="220" fill={`url(#gb${variant})`} />
      {/* drapes */}
      <path d="M0 0 H120 C100 80 70 160 60 220 H0 Z" fill={`url(#gp${variant})`} opacity="0.85" />
      <path d="M320 0 H200 C220 80 250 160 260 220 H320 Z" fill={`url(#gp${variant})`} opacity="0.85" />
      <rect width="320" height="220" fill={`url(#gl${variant})`} />
      {/* table */}
      <rect x="40" y="160" width="240" height="60" fill="#f4e9da" />
      <rect x="40" y="156" width="240" height="8" fill="#fbf4ea" />
      {/* candles */}
      {[70, 100, 230, 255].map((cx, i) => (
        <g key={i}>
          <rect x={cx - 3} y={120 + (i % 2) * 10} width="6" height={36 - (i % 2) * 10} fill="#fffaf2" />
          <ellipse cx={cx} cy={116 + (i % 2) * 10} rx="2.5" ry="5" fill="#ffd9a0" className="flame" />
        </g>
      ))}
      {/* florals */}
      <g transform="translate(160 140)">
        <FlowerBush x={0} y={0} s={variant % 2 ? 1.2 : 1} seed={variant + 21} />
        {variant % 2 === 0 &&
          Array.from({ length: 7 }, (_, i) => (
            <path key={i} d={`M${-40 + i * 13} -10 q${4 - i} -50 ${10 - i * 3} -${70 + (i % 3) * 12}`} stroke="#b08a63" strokeWidth="1.2" fill="none" />
          ))}
      </g>
    </svg>
  )
}

/* ---------------- Small line icons ---------------- */
export const Icon = {
  heart: (p) => (
    <svg viewBox="0 0 24 24" {...p}><path d="M12 21s-7.5-4.6-9.4-9.3C1.2 8.2 3.4 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.6 0 5.8 3.7 4.4 7.2C19.5 16.4 12 21 12 21z" fill="currentColor" /></svg>
  ),
  clock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M12 21s-6-6.1-6-11a6 6 0 1112 0c0 4.9-6 11-6 11z" /><circle cx="12" cy="10" r="2.2" /></svg>
  ),
  shirt: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" {...p}><path d="M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3c0 2-1.8 3-4 3S8 5 8 3z" /></svg>
  ),
  party: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><path d="M4 20l5-13 8 8-13 5z" /><path d="M14 4v2M19 9h2M17 6l2-2M12 8c1-1 1-3 0-4M16 12c1-1 3-1 4 0" /></svg>
  ),
  bus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><rect x="4" y="3" width="16" height="15" rx="2" /><path d="M4 11h16M7 18v2M17 18v2" /><circle cx="8" cy="14.5" r="1" /><circle cx="16" cy="14.5" r="1" /></svg>
  ),
  hotel: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4" /></svg>
  ),
  gift: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><rect x="3" y="8" width="18" height="4" /><rect x="5" y="12" width="14" height="9" /><path d="M12 8v13M12 8c-2-4-6-4-6-1.5S10 8 12 8zM12 8c2-4 6-4 6-1.5S14 8 12 8z" /></svg>
  ),
  mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
  ),
  calendar: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></svg>
  ),
  sound: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" /><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11" /></svg>
  ),
  mute: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" /><path d="M17 9l5 6M22 9l-5 6" /></svg>
  ),
}
