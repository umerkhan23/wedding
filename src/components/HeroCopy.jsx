import React from 'react'
import { Icon } from './Art'
import { couple } from '../data'

/** Shared hero text — used by Intro morph layer and the real Hero. */
export default function HeroCopy() {
  const { groom, bride } = couple
  return (
    <div className="hero-content">
      <Icon.heart className="hero-heart a1" width="18" height="18" />
      <p className="invite-line a2">{couple.inviteLine}</p>
      <p className="for-the a2">{couple.forThe}</p>
      <h2 className="event-name a3">{couple.event}</h2>
      <p className="of-line a4">{couple.of}</p>
      <div className="tiny-rule a4">
        <span />
        <Icon.heart width="6" height="6" />
        <span />
      </div>
      <h1 className="name name-full a5">{groom.name}</h1>
      <p className="amp a6">&amp;</p>
      <h1 className="name name-full a7">{bride.name}</h1>
    </div>
  )
}
