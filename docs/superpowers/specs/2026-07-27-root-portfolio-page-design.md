# Root Portfolio Page (`/`) — Design

**Date:** 2026-07-27
**Status:** Approved pending user review

## Purpose

A generic, recruiter-agency-facing portfolio at the site root. Unlike the per-company pitch pages (`/[company]`), it is not addressed to a specific reviewer and has no JD to mirror. It is the link Sujin sends to recruiting agencies: `yourdomain.com`, nothing more.

Goals: look hireable and expensive, be a ~2-minute read, show the person behind the work (fit, well-traveled, has taste) without ever saying so explicitly.

## Route & indexing

- `app/page.tsx` (server component) — restores a root page (currently deleted; root 404s via `not-found.tsx` / `WrongDoor`).
- **Indexable**: no `noindex` (unlike pitch routes). Root gets normal metadata + the existing OG image.
- `NavbarGate` / `WrongDoor` behavior updated so `/` renders the portfolio instead of the closed-door treatment. Unknown slugs still 404.
- No per-company accent — default site accent.

## Page structure (in order)

### 1. Hero
The pre-existing `Hero` component restored as the opener: `hero-bg.webp` background, animating `HeroTitle`, `DashboardWireframe` on the right, existing recruiter-generic copy ("I build fast, polished interfaces that make complex systems feel simple…"). CTA buttons: View Projects → `#work`, Contact → `#contact`.

### 2. What I do (strengths)
Replaces the JD ledger. 4–5 of the strongest claims adapted from `companies/acme.ts`, without "you asked for X" framing, revealed with `ScrollReveal`:

- Six-plus years of React, TypeScript and Node — all in production.
- I write the on-chain programs, I don't just call them.
- Serverless in production — Lambda, end to end.
- Data model to pixels — I own the whole slice.
- Queues, retries, backups, tests — by default.

Each claim keeps its one-line supporting note (adapted from the acme `note` fields).

### 3. Work (`#work`)
Project exhibits reusing the story/pitch exhibit components (`ExhibitStage` / `ProjectCase` / device frames) with media sourced from `companies/evidence.ts`: Vanta OS, Beans, Keom, Caddi. No JD framing — one relevant line each.

### 4. About me
A personal editorial section. Media pieces (files to be added under `public/about/`):

1. **Gym mirror selfie** (`IMG_4095.jpg` → `public/about/gym.jpg`) — caption tone: "Most mornings start here."
2. **Beach gym at sunset** (`IMG_3721.HEIC` → converted to `public/about/beach-gym.jpg`) — "…wherever 'here' happens to be." (location caption TBD by user — Koh Samui?)
3. **MBS Singapore night loop** (`IMG_4588.MOV` → trimmed to a few stable seconds, muted, compressed webm/mp4 at `public/about/mbs.(webm|mp4)`) — "Singapore, between builds."
4. **Lana Del Rey b&w image** (user-supplied, `public/about/lana.jpg`) as the backdrop for an "ON REPEAT" track list, styled in Geist Mono, muted, accent-on-hover:
   - Heroin — Lana Del Rey
   - Cinnamon Girl — Lana Del Rey
   - Gods & Monsters — Lana Del Rey
   (Optionally each links to Spotify. User acknowledges the image is a third-party photo and may swap it later.)

Copy: 3–4 short lines total — trains daily, builds from wherever, Lana on repeat, loves shipping. Specific, zero bragging. The "has money / is cool" signal is carried entirely by restraint, media quality, and specificity — never stated.

Image treatment matches the site: dark, editorial sizing, grayscale/muted grading where it helps cohesion.

### 5. Quiet close (`#contact`)
One line + email / GitHub / calendar. Same restraint as pitch closes (reuse closing patterns from the pitch page).

## Media pipeline (one-time prep during implementation)

- Convert HEIC → web-sized JPEG (sips/ffmpeg), resize to ~1600px max.
- Trim + mute + compress MOV → short loop (target < 3 MB), `playsInline muted loop autoplay` with poster.
- Copy gym selfie and Lana image into `public/about/`.

## Non-goals

- No smoke shader / beat-driven story engine on this page — plain scroll with `ScrollReveal`; the cinematic engine stays exclusive to `/[company]`.
- No changes to pitch routes, configs, or the story engine.
- No skill lists, resume layout, or crypto-terminal aesthetics (per CLAUDE.md).

## Error handling / performance

- All media lazy-loaded below the fold; video `preload="none"` with poster.
- Page must stay fast: images sized/compressed at build prep time, no client JS beyond existing components.

## Testing

- `npm run build` + `npm run lint` pass.
- Manual: `/` renders all five sections, video loops muted, unknown company slugs still 404, pitch pages unaffected, mobile layout has no horizontal overflow.
