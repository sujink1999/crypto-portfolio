# Job Application Pipeline — Design

Date: 2026-07-31
Status: Approved pending user review

## Problem

Applying to 2 companies currently takes ~2 hours, most of it Sujin waiting on
Claude to process things serially in chat. Target: 5 companies/day where Sujin
only shows up at defined review gates and everything else runs as background
batch work.

## Overview

A batch pipeline with file-based state in the repo, a dev-only dashboard for
review/approval, and parallel research/build agents. Sujin's touchpoints:
accept/reject proposed companies, approve page copy, approve application text,
approve connection notes, review live pages, then apply/send manually.

## State model (source of truth)

- `pipeline/` folder at repo root, **gitignored**.
- One JSON file per company: `pipeline/<slug>.json`.
- Fields:
  - **Identity**: slug, company name, role title, source (`was` | `linkedin` |
    `wellfound` | `sourced:<board>`), JD URL, JD full text, company domain.
  - **Logo**: source URL, local path (`public/logos/<slug>.png`), approved flag.
  - **Status**: `proposed → researching → page_draft → page_approved →
    app_text → notes → build → pages_ready → applied` (plus `rejected`).
  - **Page draft**: full pitch-page copy in page order — greeting, why-you
    lines, JD requirements with mapped evidence ids and claim lines, project
    sections, close. Custom widget concept (name + one-line description +
    pointer to mock component) when the pitch needs one (Mem0-style).
  - **Application draft**: portal text (e.g. WaS "why us") with 2-3 variants.
  - **Connection notes**: per persona — engineer / CTO / CEO / recruiter —
    following the locked note format in CLAUDE.md.
  - **Done flags**: applied (bool + date), outreach sent per persona (bool).
    No reply/follow-up tracking in v1.
- Any Claude session reads `pipeline/` at start to know exact state; no
  re-explaining between sessions.

## Dashboard

- `app/pipeline/page.tsx` + small dev-only API route for writebacks.
- **Dev-only**: returns 404 when `process.env.NODE_ENV === "production"`;
  state folder is gitignored so nothing ships.
- Views:
  1. **Board**: cards grouped by status. `proposed` cards show JD summary +
     Accept/Reject buttons. Logo shown on every card (against the dark card
     background, so bad/dark logos are caught early).
  2. **Company detail**: sequential review gates rendered in order:
     - Page copy preview: actual page text in page order, plus live render of
       any custom widget mock. Approve / Needs changes.
     - After page approval: application text variants with copy buttons.
       Approve.
     - After that: connection notes per persona with copy buttons. Approve.
  3. **Done tracking**: applied / sent checkmarks only.
- "Needs changes" happens in chat; dashboard just marks the state.

### Design language

Minimal black dashboard (reference: Beast Insights style). Near-black
background with slightly lighter card surfaces and hairline borders; muted
gray secondary text, white reserved for key facts; company logos and small
visuals instead of text labels where possible; slim sidebar or top nav;
Space Grotesk / Geist Mono from the existing site. No color except status
accents used sparingly (Linear-style accent-only-on-active).

## Daily flow

1. **Kickoff** (one command, e.g. "run the pipeline"): Sujin pastes any links;
   Claude tops up to 5 total with sourced candidates; research agents fan out
   in parallel, one per accepted company.
2. **Research output per company**: parsed JD (3-5 requirements), company
   research + genuine hook, two humans to contact (founder/EM + engineer),
   logo fetched, full page-copy draft, widget concept + mock if needed.
   Written to the state file as `page_draft`.
3. **Gate 1**: Sujin reviews page drafts on dashboard. All 5 settle before
   build (batch gate). Changes via chat.
4. On page approval, application text variants are generated (or pre-drafted
   and revealed); **Gate 2** approves them. Then connection notes; **Gate 3**.
5. **Build**: `companies/<slug>.ts` configs, custom components, OG images —
   parallel where possible. `npm run lint` + `npm run build` must pass.
6. **Gate 4**: Sujin reviews live pages, applies on portals (paste-ready
   text), sends DMs (paste-ready per persona), ticks done flags.

## Sourcing

- Sujin's pasted links always take priority (WaS, LinkedIn, Wellfound).
- Top-up sources (public, no auth): Work at a Startup, HN Who's Hiring
  (monthly), Greenhouse/Lever/Ashby boards of target companies, RemoteOK,
  WeWorkRemotely, web3.career, cryptocurrencyjobs.co.
- LinkedIn/Wellfound can't be searched; pasted links are fetched best-effort,
  else Sujin pastes JD text.
- Criteria for sourced candidates: US remote-friendly, ~$100k+ base,
  full-stack / frontend / product-engineer, plausible alongside Vanta.
  Crypto-native and dev-tools companies prioritized.
- Sourced candidates enter as `proposed` only — no deep research until
  accepted.

## Logo fetching

Order of preference, executed by the research agent:
1. Logo image embedded in the JD page (WaS/Wellfound have these).
2. Company homepage: `apple-touch-icon`, then `og:image`/header logo.
3. Favicon service fallback (Google `s2/favicons?sz=256`), last resort.

Downloaded to `public/logos/<slug>.png`, shown on dashboard for approval.

## OG image

`app/[company]/opengraph-image.tsx` embeds the company logo (via
`ImageResponse`) instead of company-name text when an approved logo exists;
falls back to the current pill-seal text design otherwise.

## Out of scope (v1)

- Reply/DM-response tracking and follow-up radar (later).
- Auto-submission to portals; sending DMs/emails (stays manual on purpose).
- LinkedIn search automation.

## Constraints

- All copy obeys CLAUDE.md rules: claim-line length, no em dashes, Vanta
  framing, connection-note format, voice profile memory.
- Free tooling only.
- Pitch routes stay noindex/unlisted; pipeline data never committed.
