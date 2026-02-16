# Crypto Portfolio — Project Guide

## Project Overview
A high-end, crypto-focused personal portfolio website that positions the owner as an elite full-stack crypto engineer and systems builder. This is NOT a resume or job-seeking profile — it functions as proof of real engineering capability, technical depth, and the ability to design and ship complex systems.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **UI**: React 19
- **Styling**: Tailwind CSS v4 (with `@theme inline` configuration)
- **Fonts**: Geist Sans + Geist Mono
- **Build**: PostCSS with `@tailwindcss/postcss`
- **Linting**: ESLint 9 (flat config) with core-web-vitals + TypeScript rules

## Project Structure
```
app/              → Next.js App Router pages and layouts
  layout.tsx      → Root layout (fonts, metadata)
  page.tsx        → Home page
  globals.css     → Global styles + Tailwind theme
public/           → Static assets (SVGs, images)
```

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Path Aliases
- `@/*` maps to the project root

## Site Architecture

### Sections
1. **Hero / Identity** — Name, one-line positioning, animated systems/network background
2. **Projects** — Core section. Immersive project showcases with architecture flows, visual storytelling
3. **Capabilities** — Engineering strengths grouped by domain (not tool lists)
4. **About** — Short, calm, humanizing note
5. **Contact** — Email, GitHub, minimal

### Design Philosophy
- **Tone**: Calm, confident, technical, minimal
- **Animations**: Smooth, controlled, purposeful — reinforcing technical depth
- **Layout**: Feels like exploring a living system, not browsing a portfolio
- **Avoid**: Resume layouts, gimmicky motion, heavy decoration, template structures, skill lists, overuse of text

### Color Scheme
- Dark-first design (background: #0a0a0a, foreground: #ededed)
- Light mode supported via `prefers-color-scheme`

### Interaction Patterns
- Scroll-driven storytelling
- Subtle system/network motion
- Smooth transitions between project environments
- Interactive architecture/system flows
- Light parallax for depth
- UI elements activating during exploration

## Coding Conventions
- Use Tailwind utility classes for styling (no CSS modules)
- Use `@/*` path alias for imports
- Components go in `components/` directory
- Prefer server components; use `"use client"` only when needed
- Keep animations performant — prefer CSS transforms and `will-change`
- No emoji in code or UI unless explicitly requested
