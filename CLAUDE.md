# Portfolio & Pitch Pages - Project Guide

## Project Overview
Sujin's personal portfolio + per-company job-pitch site. NOT crypto-branded - Sujin pitches as a full-stack / frontend engineer; crypto work (Beans, Keom/0VIX) is just part of the evidence, not the identity.

The core product is the **per-company pitch page** at `/[company]` (e.g. `/mem0`): a cinematic, premium, story-driven experience addressed directly to a reviewer at that company, mapping their job description to real shipped work.

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

## UI Rules
- ALWAYS use the frontend-design skill when making UI changes, including internal tools like the pipeline dashboard. No raw text where an icon belongs ("back"), no default-looking controls. Internal UI gets the same design care as the public site.

## Git Rules
- NEVER commit unless Sujin explicitly asks. Make the changes, verify them, and stop. He decides when things get committed and what goes in a commit.

## Coding Conventions
- Use Tailwind utility classes for styling (no CSS modules)
- Use `@/*` path alias for imports
- Components go in `components/` directory
- Prefer server components; use `"use client"` only when needed
- Keep animations performant - prefer CSS transforms and `will-change`
- No emoji in code or UI unless explicitly requested

## Evidence Rules (hard)
- Requirement `proofs` may ONLY use these evidence ids: `vanta-os`, `beans`, `keom`, `society-mobile`, `mudrex`. Every other id in evidence.ts has no registered exhibit and renders as an empty frame. vanta-os leads frontend/product beats.
- Career facts (roles, titles, dates) come ONLY from content/career-facts.md. If a fact is not in that file, DO NOT state it; write around it or ask Sujin. Never invent or infer job titles. ("Founding engineer at Mudrex" shipped on real pages because an agent invented it and nothing checked it.)

## Copywriting Rules
- Requirement `claim` lines render as big display text. One or two short sentences, ~15-22 words total. Not longer: a skimming reviewer won't read three sentences of display text. Not shorter either: a bare slogan with no facts reads as vague. Every claim carries 1-2 concrete facts (numbers, named projects, real stack), like "I built Vanta end to end: data model, Express APIs, dashboards, App Store. Before that: Mudrex, solo, to 10M+ downloads."
- Don't repeat the page's one big theme (e.g. memory for Mem0) across multiple claims. Say it once in the requirement where it belongs; the other claims prove different strengths with different evidence.
- Story beats follow the locked shape: beat 1 is about THEM (one specific true thing), beat 2 is the collision (the one piece of Sujin's work that meets it), beat 3 pivots to the mapping. Never open with a credentials dump; the claims below carry the numbers. A number appears in the story only when it is the collision itself. Never write the same opener across pages.
- NEVER cite repo internals as evidence: commit counts ("84 of 91 commits"), phased-rollout counts, PR numbers, test counts. Evidence is product outcomes a reviewer can feel: downloads, TVL, revenue, users, shipped features, App Store releases.
- The voice reference is content/copy-corpus.md: previously approved copy verbatim. Writers match it, not their own instincts.
- NEVER use em dashes (—) or hyphens-as-punctuation ( - ) in any copy: pitch pages, outreach, cover letters, UI text, story lines. They read as AI-written. Restructure into separate sentences, or use commas, colons, or periods instead.

## Connection Notes (LinkedIn outreach)
- Never pitch credentials in a connection note (no downloads, YC, years of experience).
- Locked format (Pax/Penny note, 2026-07-30):

  Hey [Name], I applied for the [Role] role. Instead of a cover letter I built a page mapping your JD to work I've shipped:

  https://sujin.tech/[slug]

  Two minute read, curious what you think.

- Link always with https://, on its own line.
- Closer varies by persona: CEO/founder and recruiter get "Two minute read, curious what you think." Software engineer (peer): never ask them to review it, no hedging ("if it feels worth it") — say "It would be great if you could put it in front of the team."

## Chat Output Formatting
- When giving copy-paste text (outreach messages, notes, emails), NEVER use blockquotes — the left border makes terminal copying painful. Use plain fenced code blocks instead.
