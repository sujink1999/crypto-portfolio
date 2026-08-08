# Pipeline Runbook

> **PARTIALLY STALE (2026-08-08). Read this first.** The full rewrite is step 10 of
> plans/pipeline-v2.md and is HELD; until then, these corrections OVERRIDE anything
> below that contradicts them:
> - State lives in **Neon Postgres** via `lib/pipeline/store.ts`. `pipeline/*.json`
>   is an inert migration archive; never read or write it as state. New scout finds
>   use it only as staging: file -> validate-pipeline.ts -> import-pipeline.ts.
> - Statuses `page_approved`, `app_text`, `notes` were **removed from the schema**;
>   writing them fails zod. Flow: proposed -> researching -> page_draft -> build ->
>   pages_ready -> outreach -> applied (rejected from anywhere).
> - The appText and generated-PersonaNotes gates below are **dead concepts**. Current
>   flow: drafter writes ONE optimized `draft` per company (variant system removed
>   2026-08-08) -> copy-verifier lands `draft.verifierNotes` -> the MAIN SESSION then
>   sets status `page_draft` (= draft ready for review) -> Sujin reviews/edits on
>   /pipeline/<slug> (DraftReview) and clicks "Approve copy, start build" (-> `build`)
>   -> page assembly in chat -> build. Application answers live in
>   `application.questions` (ApplicationPanel) and are drafted by
>   .claude/agents/answer-drafter.md (Fable) ONLY after copy approval (status
>   build+); outreach notes are template-computed in the Runsheet.
> - The drafter reads the rolling reference pack (scripts/draft-refs.ts) +
>   career-facts + evidence whitelist, not the old five-file chain.
> - Local browser passes are `/local-scout` (intake) and `/local-research`
>   (accepted companies), run BY SUJIN in his own `claude --model sonnet` session.

This is the operating procedure for the job-application pipeline. It is written for a future
Claude session: when Sujin says "run the pipeline" (optionally pasting job links), work through
the steps below in order.

State lives in `pipeline/<slug>.json`, one file per company, shaped by `PipelineCompany` in
`lib/pipeline/types.ts`. The human-facing view is the dashboard at `/pipeline` (board of all
companies) and `/pipeline/<slug>` (detail page with gates for that company).

## Example state file

A minimal `pipeline/<slug>.json` looks like this. See `lib/pipeline/types.ts` for the full shape
(research, pageDraft, appText, notes, logo, applied).

```json
{
  "slug": "acme",
  "company": "Acme",
  "role": "Full-Stack Engineer",
  "source": "was",
  "jdUrl": "https://workatastartup.com/jobs/123456",
  "domain": "acme.com",
  "status": "proposed",
  "updatedAt": "2026-07-31T00:00:00.000Z"
}
```

`status` must be one of the values in `STATUS_ORDER` (`lib/pipeline/types.ts`). The live flow
(2026-08-03) is: `proposed` -> `researching` -> `page_draft` (research + page copy shown, Sujin
approves) -> `build` (Claude writes companies/<slug>.ts) -> `pages_ready` (dashboard embeds the
live /<slug> page for review) -> `outreach` (people from research + application text + notes,
all copy-ready) -> `applied`. Terminal: `rejected`. Legacy statuses `page_approved`, `app_text`,
`notes` remain valid in the type for old files but the dashboard no longer routes through them.
The detail page renders ONLY the current step's content.

## 0. State check

Read every file in `pipeline/*.json`. Report to Sujin:

- Companies awaiting Sujin at a step (status `page_draft`, `pages_ready`, or `outreach`, plus
  `proposed` awaiting an accept/reject decision, i.e. work is done and a decision is needed
  before the pipeline can advance them).
- Companies mid-build (status `researching` or `build`; `build` means Claude owes a config).
- Batch capacity: the target is 5 companies active at once, where "active" means any status
  before `applied` or `rejected`. If fewer than 5 are active, there is room to intake more.

## 1. Intake

Fill open batch slots up to 5 active companies, in this order:

1. **Pasted links first.** If Sujin pastes job links, process those before sourcing anything new.
   Fetch each JD: Work at a Startup and Wellfound JD pages are public and can be fetched directly;
   LinkedIn is best-effort (if the fetch fails or is blocked, ask Sujin to paste the JD text
   instead).
   Board access recipes (2026-08-05): job boards block bare scripted fetches. Scouts must use,
   in order of preference: (a) official ATS JSON APIs — Ashby `api.ashbyhq.com/posting-api/job-board/<slug>`,
   Greenhouse `boards-api.greenhouse.io/v1/boards/<slug>/jobs?content=true`, Lever
   `api.lever.co/v0/postings/<slug>?mode=json`, RemoteOK `remoteok.com/api`, Remotive
   `remotive.com/api/remote-jobs`, HN via the Algolia API, WeWorkRemotely via RSS; (b) curl with
   full browser headers (`-A "Mozilla/5.0 ... Chrome/126"` plus Accept/Accept-Language,
   `--compressed`) — this unblocks cryptocurrencyjobs.co; (c) Wellfound, Work at a Startup, and
   cryptojobslist.com are Cloudflare/login-gated and only reachable via the claude-in-chrome
   extension in Sujin's browser session — sweep those in-session, not from a headless scout.
   Wellfound specifically (learned 2026-08-05, after missing Deeply): never judge it by the
   default "Recommended" sort, which front-loads promoted agency spam. Sort by newest, page
   through with a salary-floor eye, and run separate searches for "product engineer",
   "product builder", and "founding engineer" in addition to the Engineering facet — the best
   generalist roles are often categorized under Product, not Engineering. A sweep that samples
   only the top of a feed must be reported as a sample, not as coverage.

2. **Top up with sourced candidates** from: Work at a Startup search, the current HN Who's Hiring
   thread, Greenhouse/Lever/Ashby boards of known target companies, RemoteOK, WeWorkRemotely,
   web3.career, and cryptocurrencyjobs.co.
3. **Selection criteria:** US remote-friendly, roughly $100k+ base, full-stack / frontend /
   product engineer roles, plausible to hold alongside Vanta. Prefer crypto-native and dev-tools
   companies first.

Write each accepted company as `pipeline/<slug>.json`, and fetch its logo immediately at intake
(`npx tsx scripts/fetch-logo.ts <slug> <jd-url> <domain>`, stdout is the `logo.path` value) so
even `proposed` cards render with a logo on the board:

- Sourced candidates start at status `"proposed"` (they still need Sujin's go-ahead before deep
  research begins; see the note in step 2).
- Sourcing agents do the intake themselves (Sujin's rule, 2026-08-05): the scout writes each
  accepted candidate's `pipeline/<slug>.json` directly and runs the fetch-logo script itself
  (verifying the fetched image is actually that company's logo), returning only a summary. The
  main session reviews the resulting files; it never transcribes agent prose into state files
  field by field.
- Pasted links Sujin already chose can skip straight to status `"researching"`.

## 2. Research fan-out (one agent per accepted company, parallel)

Model policy (Sujin's rule, 2026-08-03): research agents run on SONNET and gather facts only
(summary, hook material, humans, JD, logo, salary/stage data). All prose the reviewer or a
company will read (pageDraft copy, appText variants, connection notes) is written by FABLE in a
second pass from that research. Sonnet must not write the final copy; Fable must not be spent on
fact-gathering.

Writer inputs (2026-08-03): the Fable writing pass starts by reading `content/work-index.md`
and every source it lists, in order. Never hand a writer a curated subset of Sujin's work;
full knowledge, index-first. After the writer finishes, a SONNET verify agent audits the copy
against the same sources plus the corpus rules and returns findings; the writer (or Fable in
session) fixes before anything reaches Sujin's review.

Do not deep-research a `"proposed"` sourced candidate until Sujin accepts it. Once a company is
accepted (status `"researching"` or later), run one research agent per company, in parallel. Each
agent writes its results directly into that company's state file and moves its status to
`"page_draft"` when done (after the Fable writing pass). Each agent produces:

- Logo is mandatory, and the page's `accent` / `accentFrom` MUST be derived from the logo's
  actual brand colors (accent: the dominant brand color, accentFrom: a lighter tint of it).
  Never invent a palette; look at the fetched logo file and the company's site.
- `research.companyLinkedIn`: the company's LinkedIn page URL (linkedin.com/company/...).
- `research.summary`: 3-4 sentences on the company.
- `research.hook`: a genuine, specific line about the company (not generic flattery).
- `research.humans`: the founder/EM plus one team engineer, each with a URL (LinkedIn, GitHub,
  personal site, whatever is findable).
- `logo`: run `npx tsx scripts/fetch-logo.ts <slug> <jd-url> <domain>`. Its stdout is exactly
  `/logos/<slug>.<ext>`; that string is the value for `logo.path`.
- `pageDraft`: a full `CompanyPitch` object (shape defined in `companies/types.ts`), obeying the
  copy rules in `CLAUDE.md`: claim length (roughly 15-22 words, 1-2 concrete facts), no em dashes,
  the locked Vanta framing, and the evidence rules from memory (vanta-os always leads frontend
  beats, use only the 5 strong exhibits).
- `appText.variants`: 2-3 portal-text variants covering different angles but the same underlying
  facts.
- Free-text form questions: Greenhouse/Lever/Ashby postings render the application form on the
  JD page itself, so the research agent records any free-text questions (e.g. "why us") it finds
  there, and answers are drafted alongside `appText` for gate 2. A "why us" answer is hook +
  connection + value in 3-5 sentences: open with one specific true fact about them (a recent
  launch, a technical bet; never the mission statement), then the genuine reason it resonates,
  then one concrete accomplishment proving fit. Must fail the competitor-swap test (CLAUDE.md).
  Gated flows (Workable step 2, Wellfound, LinkedIn, custom portals) can't be pre-drafted; Sujin
  hits the field while applying and it comes back as a clipboard-style request, drafted then with
  the same structure.
- Which JD bullets deserve page beats: must-haves only. A bullet is a must-have if it sits in the
  top third of the requirements list or is repeated across sections (responsibilities +
  qualifications + prose). Hedged items ("preferred", "a plus", "familiarity with") are
  nice-to-haves: skip them or fold them into another beat. Mine the "About the team / What you'll
  do" prose for the team's real pain point; that is the story-hook material.
- `notes`: one `PersonaNote` per relevant persona (engineer, cto, ceo, recruiter), following the
  locked connection-note format in `CLAUDE.md`.
- `research.widgetConcept` (optional): if the company's product begs for an interactive widget in
  the Mem0 style, add a `{ key, description }` here and register a matching mock component in
  `components/pipeline/mocks/index.tsx` so it can be previewed during the gate review.

## 3. Gates (Sujin, on /pipeline)

> **DEAD SECTION (2026-08-08): do not execute.** Gates 2/3, `appText`, `notes`,
> `page_approved`, and `app_text` no longer exist (removed from the schema; writes
> fail zod). The live flow is ONE gate: Sujin reviews the drafter's `draft` on
> /pipeline/<slug> (DraftReview), approves -> status `build`. Application answers
> are drafted by answer-drafter AFTER that approval and reviewed in the
> ApplicationPanel; outreach notes are template-computed in the Runsheet. Build is
> per-company, not a batch gate. Kept below only as history until the step-10
> rewrite:

There are three sequential gates, each reviewed by Sujin on the `/pipeline/<slug>` detail page:

1. **Gate 1**: page copy (`pageDraft`).
2. **Gate 2**: app text variant (`appText`, picks `approvedIndex`).
3. **Gate 3**: notes (`notes`, per persona).

Feedback comes through chat, not the UI. When Sujin gives feedback on a gate, edit the state file
directly and leave `status` where it was (do not advance status until the gate is actually
approved).

Approving Gate 1 (page copy) moves status directly from `page_draft` to `app_text` (the
transient `page_approved` status is not set by the UI; it exists in `STATUS_ORDER` for manual/
build-tooling use only).

Build is a **batch gate**: it does not start until every active company has passed Gate 3.

## 4. Build (parallel where possible)

For each company that has passed all three gates:

1. Create `companies/<slug>.ts` from `pageDraft`.
2. Register the new company in `companies/index.ts`.
3. If a widget concept was approved, build it for real under `components/pitch` (the mock in
   `components/pipeline/mocks/index.tsx` was only for gate review).
4. Verify the logo renders on the pitch page and in the OG image.
5. Run `npm run lint && npm run build && npm test`.
6. Set status to `"pages_ready"`.

## 5. Apply (Sujin, manual)

Sujin reviews the live page, applies using the approved app text variant, and sends the approved
notes. Once applied, Sujin marks the company `"applied"` on the `/pipeline` dashboard. This step
is manual on purpose: nothing in the pipeline sends an application or a message on Sujin's behalf.
