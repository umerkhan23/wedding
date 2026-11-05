import React, { useEffect, useState } from 'react'
import { Seal, LeafPattern } from './Art'
import HeroCopy from './HeroCopy'

/**
 * Stage flow:
 *  cover    -> green doors closed, seal pulsing ("Tap to Open")
 *  doors    -> doors slide apart; closed cream curtains stay shut
 *  curtains -> closed curtains gather into the open hero frame (same art + text)
 *  done     -> overlay removed; real hero underneath matches exactly
 */
export default function Intro({ onOpenStart, onCurtainsStart, onDone }) {
  const [stage, setStage] = useState('cover')
  const play = stage === 'curtains'

  useEffect(() => {
    if (stage === 'doors') {
      const t = setTimeout(() => setStage('curtains'), 1900)
      return () => clearTimeout(t)
    }
    if (stage === 'curtains') {
      onCurtainsStart?.()
      const t = setTimeout(() => {
        setStage('done')
        onDone?.()
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [stage, onCurtainsStart, onDone])

  if (stage === 'done') return null

  const open = () => {
    if (stage !== 'cover') return
    onOpenStart?.()
    setStage('doors')
  }

  return (
    <div className={`intro stage-${stage}`}>
      {/* Open hero — becomes visible as closed curtains gather open */}
      <div className={`reveal-hero ${play ? 'play' : ''}`} aria-hidden="true">
        <img src="/hero-frame.jpg?v=2" alt="" draggable="false" />
        <HeroCopy />
      </div>

      {/* Closed curtains that gather into the open frame above */}
      <div className="closed-curtains" aria-hidden="true">
        <div className="cc-half cc-left" />
        <div className="cc-half cc-right" />
      </div>

      {/* Green embossed doors */}
      <div className="doors" onClick={open} role="button" aria-label="Tap to open the invitation">
        <div className="door door-left">
          <LeafPattern id="leafL" />
          <span className="door-edge" />
          <div className="seal-wrap">
            <Seal />
          </div>
        </div>
        <div className="door door-right">
          <LeafPattern id="leafR" />
          <span className="door-edge" />
          <div className="seal-wrap">
            <Seal />
          </div>
        </div>
      </div>
    </div>
  )
}
