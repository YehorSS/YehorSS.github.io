# GEKKO-MO

Portfolio site of Yehor Kudinchykov, told as the recovered archive of a drifting colony ark.
Live at **https://yehorss.github.io/**.

- One page, four decks: bridge, archive (projects), engineering (skills), comms (contacts)
- English and Ukrainian, picked from the browser language and switchable
- Damage grows with depth: archive integrity drops as you scroll, records go from intact to corrupted
- Respects `prefers-reduced-motion`: no boot sequence, no glitches

## Stack

Vite, TypeScript, plain CSS. No UI framework, about 13 KB of JS and CSS gzipped.
Vitest for logic, Playwright for layout checks.

## Run

```
npm install
npm run dev       # local server
npm test          # unit tests
npm run build     # production build in dist/
npm run shots     # screenshots at 1440 / 1280 / 390 px in both languages, fails on overflow; writes public/og.png
```

Pushing to `main` deploys to GitHub Pages through `.github/workflows/pages.yml`.

## Content

All text, projects, skills and contacts live in `src/content.ts`.
