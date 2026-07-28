# Portfolio & Pitch Pages - Project Guide

## Project Overview
Sujin's personal portfolio + per-company job-pitch site. NOT crypto-branded - Sujin pitches as a full-stack / frontend engineer; crypto work (Beans, Keom/0VIX) is just part of the evidence, not the identity.

The core product is the **per-company pitch page** at `/[company]` (e.g. `/acme`): a cinematic, premium, story-driven experience addressed directly to a reviewer at that company, mapping their job description to real shipped work. `acme` is the demo/prototype config used to lock the design.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **UI**: React 19
- **Styling**: Tailwind CSS v4 (with `@theme inline` configuration)
- **Fonts**: Space Grotesk + Geist Mono (see `app/layout.tsx`)
- **Build**: PostCSS with `@tailwindcss/postcss`
- **Linting**: ESLint 9 (flat config) with core-web-vitals + TypeScript rules

## Project Structure
```
app/                → App Router pages
  [company]/        → Per-company pitch route (static params from companies/index.ts, 404 unknown slugs, noindex)
  showcase/         → Interactive project showcase prototypes
companies/          → Pitch configs: types.ts, evidence.ts (master evidence library), <slug>.ts per company, index.ts registry
components/pitch/   → Pitch page components
components/story/   → Cinematic story engine (preloader, smoke shader, typed text, beat controller)
components/showcase/→ Project showcase prototypes (society, ovix, …)
content/            → asset-inventory.md (master list of Sujin's work), showcase specs
public/             → Static assets
```

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Path Aliases
- `@/*` maps to the project root

## Pitch Page Experience (the design)

A **cinematic beat-driven story**, not a scrolling page. The reader advances beats via click / scroll / space / swipe; text animates in letter-by-letter; scenes change through a programmable WebGL smoke shader. "Premium 3D feel" comes from camera language (perspective, Z-depth falloff, parallax, blur layering, film grain, breathing light field) - NOT from 3D objects or meshes.

### Sequence
1. **Preloader - "The Invitation"**: black screen, film grain, thin line draws itself (doubles as asset preload progress), `AN INVITATION FOR [COMPANY]` in letter-spaced caps, bloom, dissolve into smoke → hero
2. **Hero - "The Greeting"**: centered text beats - `Hey [Company],` / `I'm Sujin.` → a genuine line about the company → smoke swallows screen
3. **JD chapter**: out of the smoke - `So you're looking for a [role].` → their JD materializes center, docks left; requirements highlight one by one with matching proof on the right
4. **Project cards**: premium cards with tabs and auto-playing screen recordings (e.g. Vanta card: OS / Collection / Society tabs), one relevant line each
5. **Tech stack**: stack icons; hover highlights projects using it, with full-screen detail animation
6. **Quiet close**: one line + email/GitHub/calendar

### Smoke shader rules (performance)
- Raw WebGL fullscreen quad, fbm-style noise, driven by a `density` uniform tweened per beat
- Half-resolution canvas upscaled via CSS; devicePixelRatio capped at 1
- ≤3 noise octaves; sleep/throttle rAF when idle or density ~0; stop when tab hidden
- Rest state keeps a faint haze (density ~0.1–0.15), never fully clears

### Design Philosophy
- **Tone**: calm, confident, cinematic, expensive. Black room, one living light source, restraint everywhere.
- **References**: Apple product pages, Linear (accent-only-on-active), Snow Fall, The Pudding, luxury-brand sites
- **Avoid**: resume layouts, floating 3D objects/meshes ("beginner 3D"), gimmicky motion, skill lists, template structures, crypto-terminal aesthetics
- Per-company accent color (`pitch.accent`) themes the light field and highlights

## Coding Conventions
- Use Tailwind utility classes for styling (no CSS modules)
- Use `@/*` path alias for imports
- Components go in `components/` directory
- Prefer server components; use `"use client"` only when needed
- Keep animations performant - prefer CSS transforms and `will-change`
- No emoji in code or UI unless explicitly requested

## Chat Output Formatting
- When giving copy-paste text (outreach messages, notes, emails), NEVER use blockquotes — the left border makes terminal copying painful. Use plain fenced code blocks instead.
