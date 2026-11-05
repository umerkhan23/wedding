# Zayn & Nora — Wedding Invitation (React + Vite)

## Run it
```bash
npm install
npm run dev      # local preview
npm run build    # production build in /dist
```

## Edit content
All text, dates, events and venue live in `src/data.js`.

## Music
Put an mp3 at `public/music.mp3` — it starts when the guest taps "Tap to Open".
The speaker button (top-right) mutes/unmutes.

## Structure
- `src/components/Intro.jsx` — green embossed doors + seal, then cream curtains opening
- `src/components/Sections.jsx` — hero (curtains, names, garden), welcome, gallery, countdown,
  timeline, venue map, dress code, pre-wedding events, transport, accommodation, gifts, RSVP
- `src/components/ScratchHeart.jsx` — scratch-to-reveal heart, confetti, Save the Date (.ics)
- `src/components/Art.jsx` — all SVG artwork (seal, leaves, curtains, roses, fountain, icons)
- `src/styles.css` — colours, fonts, animations
