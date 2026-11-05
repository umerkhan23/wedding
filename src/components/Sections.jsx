import React, { useEffect, useState } from 'react'
import { Icon } from './Art'
import HeroCopy from './HeroCopy'
import { EMAILJS } from '../emailjs'
import {
  welcome, saveTheDate, countdownTitle, timeline, venue, dressCode,
  preWedding, transportation, accommodation, gifts,
} from '../data'

const GALLERY_SLIDES = [
  '/gallery-1.jpg?v=1',
  '/gallery-2.jpg?v=1',
  '/gallery-3.jpg?v=1',
  '/gallery-4.jpg?v=1',
]

export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span />
      <Icon.heart width="10" height="10" />
      <span />
    </div>
  )
}

function Title({ icon: I, children }) {
  return (
    <div className="title-block">
      {I && <I className="sec-icon" width="22" height="22" />}
      <h2 className="script-title">{children}</h2>
      <div className="mini-heart">
        <Icon.heart width="8" height="8" />
      </div>
    </div>
  )
}

/* ---------------- Hero ---------------- */
export function Hero({ play }) {
  return (
    <section className={`hero ${play ? 'play' : ''}`}>
      <img
        className="hero-frame"
        src="/hero-frame.jpg?v=2"
        alt=""
        aria-hidden="true"
        draggable="false"
      />
      <HeroCopy />
    </section>
  )
}

/* ---------------- Welcome ---------------- */
export function Welcome() {
  return (
    <section className="section welcome reveal">
      <Divider />
      <p className="body-text large">{welcome}</p>
      <Divider />
    </section>
  )
}

/* ---------------- Gallery ---------------- */
export function Gallery() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % GALLERY_SLIDES.length), 3500)
    return () => clearInterval(t)
  }, [])
  return (
    <section className="section gallery reveal">
      <div className="gallery-frame">
        <div className="gallery-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {GALLERY_SLIDES.map((src, s) => (
            <div className="gallery-slide" key={src}>
              <img className="gallery-photo" src={src} alt="" draggable="false" />
            </div>
          ))}
        </div>
        <div className="dots">
          {GALLERY_SLIDES.map((src, s) => (
            <button key={src} className={s === i ? 'on' : ''} onClick={() => setI(s)} aria-label={`Slide ${s + 1}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Countdown ---------------- */
function useCountdown(iso) {
  const target = new Date(iso).getTime()
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const d = Math.max(0, target - now)
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor(d / 3600000) % 24,
    minutes: Math.floor(d / 60000) % 60,
    seconds: Math.floor(d / 1000) % 60,
  }
}

export function Countdown() {
  const c = useCountdown(saveTheDate.iso)
  const items = [
    ['days', 'Days'],
    ['hours', 'Hours'],
    ['minutes', 'Minutes'],
    ['seconds', 'Seconds'],
  ]
  return (
    <section className="section reveal">
      <Title>{countdownTitle}</Title>
      <div className="countdown">
        {items.map(([k, label]) => (
          <div className="cd-item" key={k}>
            <div className="cd-box">{String(c[k]).padStart(2, '0')}</div>
            <div className="cd-label">{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Timeline ---------------- */
export function Timeline() {
  return (
    <section className="section reveal">
      <Title icon={Icon.clock}>Program Timeline</Title>
      <ul className="timeline">
        {timeline.map((t) => (
          <li key={t.title}>
            <span className="dot" />
            <h3>{t.title}</h3>
            <p className="when">{t.when}</p>
            <p className="note">{t.note}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------- Venue ---------------- */
export function Venue() {
  const q = encodeURIComponent(venue.mapQuery)
  return (
    <section className="section reveal">
      <Title icon={Icon.pin}>Venue</Title>
      <h3 className="item-title">{venue.name}</h3>
      <p className="body-text">{venue.address}</p>
      <a
        className="map-wrap"
        href={venue.mapsUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Open venue in Google Maps"
      >
        <iframe
          title="Venue map"
          src={`https://maps.google.com/maps?q=${q}&z=15&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          tabIndex={-1}
        />
        <span className="map-click" aria-hidden="true" />
      </a>
    </section>
  )
}

/* ---------------- Dress code ---------------- */
export function DressCode() {
  return (
    <section className="section reveal">
      <Title icon={Icon.shirt}>Dress Code</Title>
      {dressCode.map((d) => (
        <div className="stack-item" key={d.who}>
          <h3 className="item-title">{d.who}</h3>
          <p className="body-text">{d.text}</p>
        </div>
      ))}
    </section>
  )
}

/* ---------------- Pre-wedding events ---------------- */
export function PreWedding() {
  return (
    <section className="section reveal">
      <Title icon={Icon.party}>Pre-Wedding Events</Title>
      {preWedding.map((e) => (
        <div className="stack-item" key={e.title}>
          <h3 className="item-title">{e.title}</h3>
          <p className="body-text small">{e.when}</p>
          <p className="body-text small">{e.where}</p>
        </div>
      ))}
    </section>
  )
}

/* ---------------- Simple info blocks ---------------- */
export function Info({ icon, title, text }) {
  return (
    <section className="section reveal">
      <Title icon={icon}>{title}</Title>
      <p className="body-text">{text}</p>
    </section>
  )
}

export const Transportation = () => <Info icon={Icon.bus} title="Transportation" text={transportation} />
export const Accommodation = () => <Info icon={Icon.hotel} title="Accommodation" text={accommodation} />
export const Gifts = () => <Info icon={Icon.gift} title="Gifts" text={gifts} />

/* ---------------- RSVP ---------------- */
export function RSVP() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [attending, setAttending] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)
    const form = e.currentTarget
    const data = {
      subject: 'Mehndi Invitation',
      title: 'Mehndi Invitation',
      message: 'Mehndi Invitation',
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      attending: form.attending.value,
      guest_count: form.guest_count?.value?.trim() || '—',
      guest_names: form.guest_names?.value?.trim() || '—',
    }
    try {
      const emailjs = await import('@emailjs/browser')
      await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, data, {
        publicKey: EMAILJS.publicKey,
      })
      setSent(true)
    } catch (err) {
      console.error(err)
      setError('Could not send your RSVP. Please try again in a moment.')
    } finally {
      setSending(false)
    }
  }

  const coming = attending === 'Joyfully accept'

  return (
    <section className="section reveal">
      <Title icon={Icon.mail}>RSVP</Title>
      {sent ? (
        <p className="body-text large thanks">Thank you! Your response has been received.</p>
      ) : (
        <form className="rsvp" onSubmit={submit}>
          <label>
            Your Name *
            <input name="name" required placeholder="Your full name" autoComplete="name" />
          </label>
          <label>
            Email *
            <input name="email" required type="email" placeholder="you@example.com" autoComplete="email" />
          </label>
          <label>
            Will you be attending? *
            <select
              name="attending"
              required
              value={attending}
              onChange={(e) => setAttending(e.target.value)}
            >
              <option value="" disabled>Select</option>
              <option>Joyfully accept</option>
              <option>Regretfully decline</option>
            </select>
          </label>
          {coming && (
            <>
              <label>
                Number of people attending *
                <input
                  name="guest_count"
                  required
                  type="number"
                  min="1"
                  max="20"
                  placeholder="e.g. 2"
                />
              </label>
              <label>
                Names of people attending *
                <textarea
                  name="guest_names"
                  required
                  rows="3"
                  placeholder="Full names of everyone attending"
                />
              </label>
            </>
          )}
          {error && <p className="rsvp-error">{error}</p>}
          <button className="send-btn" type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send RSVP'}
          </button>
        </form>
      )}
    </section>
  )
}

export function Footer() { // optional, not used by default

  return (
    <footer className="footer reveal">
      <Divider />
      <p className="script-title small">{couple.groom.name} &amp; {couple.bride.name}</p>
      <p className="body-text small">{saveTheDate.dateText}</p>
    </footer>
  )
}
