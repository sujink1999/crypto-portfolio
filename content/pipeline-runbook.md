# Pipeline Runbook

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
2. **Top up with sourced candidates** from: Work at a Startup search, the current HN Who's Hiring
   thread, Greenhouse/Lever/Ashby boards of known target companies, RemoteOK, WeWorkRemotely,
   web3.career, and cryptocurrencyjobs.co.
3. **Selection criteria:** US remote-friendly, roughly $100k+ base, full-stack / frontend /
   product engineer roles, plausible to hold alongside Vanta. Prefer crypto-native and dev-tools
   companies first.

Write each accepted company as `pipeline/<slug>.json`:

- Sourced candidates start at status `"proposed"` (they still need Sujin's go-ahead before deep
  research begins; see the note in step 2).
- Pasted links Sujin already chose can skip straight to status `"researching"`.

## 2. Research fan-out (one agent per accepted company, parallel)

Model policy (Sujin's rule, 2026-08-03): research agents run on SONNET and gather facts only
(summary, hook material, humans, JD, logo, salary/stage data). All prose the reviewer or a
company will read (pageDraft copy, appText variants, connection notes) is written by FABLE in a
second pass from that research. Sonnet must not write the final copy; Fable must not be spent on
fact-gathering.

Do not deep-research a `"proposed"` sourced candidate until Sujin accepts it. Once a company is
accepted (status `"researching"` or later), run one research agent per company, in parallel. Each
agent writes its results directly into that company's state file and moves its status to
`"page_draft"` when done (after the Fable writing pass). Each agent produces:

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
- `notes`: one `PersonaNote` per relevant persona (engineer, cto, ceo, recruiter), following the
  locked connection-note format in `CLAUDE.md`.
- `research.widgetConcept` (optional): if the company's product begs for an interactive widget in
  the Mem0 style, add a `{ key, description }` here and register a matching mock component in
  `components/pipeline/mocks/index.tsx` so it can be previewed during the gate review.

## 3. Gates (Sujin, on /pipeline)

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
