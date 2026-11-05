import React, { useCallback, useEffect, useRef, useState } from 'react'
import Intro from './components/Intro'
import ScratchHeart from './components/ScratchHeart'
import { Icon } from './components/Art'
import {
  Hero, Welcome, Gallery, Countdown, Venue, RSVP,
} from './components/Sections'

const MUSIC_SRC = '/song.mp3'

function useScrollReveal(enabled) {
  useEffect(() => {
    if (!enabled) return
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.18 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [enabled])
}

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const [heroPlay, setHeroPlay] = useState(false)
  const [muted, setMuted] = useState(false)
  const audio = useRef(null)

  useScrollReveal(introDone)

  useEffect(() => {
    document.body.style.overflow = introDone ? '' : 'hidden'
  }, [introDone])

  const onOpenStart = useCallback(() => {
    const a = audio.current
    if (a) {
      a.volume = 0.6
      a.play().catch(() => {})
    }
  }, [])

  // Curtains begin gathering open → start hero text in sync
  const onCurtainsStart = useCallback(() => {
    setHeroPlay(true)
  }, [])

  const onDone = useCallback(() => setIntroDone(true), [])

  const toggleSound = () => {
    const a = audio.current
    if (!a) return
    a.muted = !muted
    if (a.paused) a.play().catch(() => {})
    setMuted(!muted)
  }

  return (
    <div className={`page ${introDone ? 'opened' : ''}`}>
      <audio ref={audio} src={MUSIC_SRC} loop preload="auto" />
      <button className="sound-btn" onClick={toggleSound} aria-label={muted ? 'Unmute music' : 'Mute music'}>
        {muted ? <Icon.mute width="16" height="16" /> : <Icon.sound width="16" height="16" />}
      </button>

      <Intro onOpenStart={onOpenStart} onCurtainsStart={onCurtainsStart} onDone={onDone} />

      <main className="invite">
        <Hero play={heroPlay} />
        <div className="paper">
          <Welcome />
          <ScratchHeart />
          <Gallery />
          <Countdown />
          <Venue />
          <RSVP />
        </div>
      </main>
    </div>
  )
}
