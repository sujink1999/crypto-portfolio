# Pipeline v2: Structured Data, DB, and the Drafter System

Status: STEPS 1-5 BUILT AND LIVE (2026-08-06). See "Status and deviations" at the
bottom for what changed during the build. Steps 6-9 pending (6 blocked on Sujin's
reference picks), step 10 held.
Constraint from Sujin: nothing gets built until the relevant piece is approved. The
drafter structure, the data schema (with the compensation/location corrections), and
the DB-for-everything + scratch-file model ARE approved. The reference picker page
was explicitly requested and is approved to build.

## 1. The problem

Everything in `pipeline/*.json` is a free-text string, including things that must be
sortable/filterable. Real examples found in the 39 current files:

- `postedAt`: `"~2026-07-22 (posted 2 weeks ago as of 2026-08-05)"`, `"live 2026-08-05 on Work at a Startup"`, `"not listed (live posting, checked 2026-08-03)"`, `"?"`, `"Jul 2026"`, `"evergreen listing since 2023-03-09, live-checked 2026-08-03"`
- `salary`: `"$150k - $230k + 0.75% - 3.0% equity (published)"`, `"$191,100 SGD (~$142k USD) base, company-published band"`, `"not listed (Series C unicorn; credibly $150k+)"`, `"175K - $300K (published), will sponsor"`, `"not listed (YC placeholder range shown: $1-$200K)"`
- `location`: `"HQ Los Angeles, CA (role itself not location-restricted per posting)"`, `"San Francisco / Remote, hires remotely Everywhere"`, `"United States (posting) / fully remote team, 120+ teammates worldwide (company HQ: Boston, MA)"`
- `locationPreference`: `"Remote excludes Asia, Oceania, Africa"`, `"Remote, anywhere with reasonable timezone overlap; async considered for exceptional candidates"`
- `source`: ad-hoc convention strings like `"sourced:was"`, `"sourced:hn-whoishiring-july-2026"`

Board.tsx `postedLabel()` does `Date.parse()` and silently renders the raw sentence
when parsing fails. No sorting or filtering by date/salary/location exists because
the data physically cannot support it. `lib/pipeline/store.ts` does raw
`JSON.parse`/`writeFileSync` with zero runtime validation. Eligibility signals
(US-auth required, region exclusions, staleness) are buried in `priority.reason`
prose instead of derivable fields.

Goal: Sujin filters and sorts on values; he never has to READ a field to know what
it means.

## 2. Structured schema

Replaces `salary` / `location` / `locationPreference` / `postedAt` / `source`.
Display prose survives only in optional `note` fields. Zod-validated at every
read/write so bad data fails loudly instead of shipping to the board.

```ts
posted: {
  date: string | null;            // "YYYY-MM-DD"
  precision: "day" | "month" | "unknown";
  evergreen: boolean;
  verifiedLiveAt: string | null;  // "YYYY-MM-DD" last confirmed still open
  note?: string;
}

compensation: {
  min: number | null;             // in original currency (could be EUR, SGD, ...)
  max: number | null;
  currency: string;               // ISO 4217: "USD" | "EUR" | "SGD" | ...
  minUsd: number | null;          // derived at normalization time, rough
  maxUsd: number | null;          // conversion is fine, sort/filter only
  equity: boolean;
  sponsorship: boolean | null;    // null = unknown
  confidence: "published" | "third_party" | "estimated" | "unknown";
  note?: string;                  // original text preserved here
}

// Location was conflating two different things. Split:
hq: { city?: string; country?: string }   // where the company sits, informational

hiring: {                                  // where they will actually hire from.
  countries: CountryCode[] | "worldwide";  // THE filterable field (Singapore
  mode: "remote" | "hybrid" | "onsite";    // eligibility is the whole point)
  timezoneNote?: string;                   // e.g. "reasonable overlap; async ok"
  usAuthRequired: boolean | null;
  note?: string;
}

source: { channel: SourceChannel; url?: string }  // enum of the boards we use
// SourceChannel: "was" | "hn" | "ashby" | "greenhouse" | "lever" | "remoteok"
//   | "wwr" | "wellfound" | "linkedin" | "web3career" | "cryptojobs" | "pasted" | ...
```

CountryCode is ISO-3166 alpha-2 from a fixed list in the schema. Cards display
computed labels ("posted Jul 22"), never pasted prose.

Priority rules stay as-is (CLAUDE.md Pipeline Intake Rules) but freshness /
eligibility inputs now come from these fields instead of prose.

## 3. Storage: Postgres for everything, repo for code only

Deployment constraint that decided this: the pipeline will run as a **scheduled
Claude routine** in an ephemeral cloud environment. Files it writes vanish unless
it commits+pushes each run (merge noise, push races, git pull required locally).
So:

- **Neon Postgres** (Vercel Marketplace) + **Drizzle**. Real columns for every
  filterable field; `jsonb` for blobs (research, draft, notes, appText).
- `lib/pipeline/store.ts` remains the single access layer; nothing else touches
  storage. (It was the only file that would have changed in a later swap, and the
  routine constraint moved the swap to now.)
- **Drafts live in the DB too** (not repo files), because the routine must write
  them autonomously without manual triggering. Rejected alternative for the
  record: drafts-as-repo-files was easy to edit in chat but forced the routine to
  git-push and Sujin to git-pull.
- Repo keeps only real code and master content: `companies/<slug>.ts` built pages,
  content/*.md sources, prompt files.
- Status changes become DB updates; store.ts gets a one-liner helper so advancing
  a gate from chat is trivial.

### Scratch files (chat editing without DB friction)

Editing copy through chat works on a local mirror, not the DB directly:

- `npx tsx scripts/draft.ts pull <slug>` mirrors the DB draft into
  `pipeline/scratch/<slug>.json`; edit with normal Write/Edit; `draft.ts push
  <slug>` writes back, board updates instantly.
- Each scratch file has a `status: "editing" | "done"`.
- **Hard cap: 3 scratch files at a time.** Pulling a 4th fails until one is pushed.
- `push` marks done and **deletes the file**. Scratch dir is gitignored.

### Local change awareness: `pipeline/dblog.jsonl`

Sujin edits on the board; local Claude must know what changed without polling the
DB. Every DB write made by the locally-running app appends
`{ts, slug, action, detail}` lines, e.g. `action: "draft.select" | "draft.edit" |
"status.change"`. Local-only (env-gated), gitignored. Claude reads the log tail
when working, fetches only rows that changed. Optionally a session hook surfaces
new lines automatically each turn.

## 4. Agent workflow split (intake/research)

The orchestrator populates NOTHING. Two roles:

1. **Scout/research agent (Sonnet)** — research only. Gathers everything (dates,
   comp, remote policy, timezone prefs, humans, hooks, JD), fetches the logo via
   `scripts/fetch-logo.ts`. Writes its findings as free prose research context
   (stored in the DB research column; in the pre-DB interim, as
   `pipeline/context/<slug>.md`). Does NOT write structured records.
2. **Normalizer agent (Haiku/Sonnet)** — reads the research context, emits the
   structured record, then runs `npx tsx scripts/validate-pipeline.ts <slug>`
   which zod-validates and fails with exact field-level errors so the agent
   self-corrects in a loop until exit 0. Only then is intake done.

Migration: fan normalizer agents over the 39 existing entries; the current messy
strings are sufficient context. Workflow fields (status, pageDraft, notes,
research) carried over untouched.

## 5. The drafter system (approved shape)

> SUPERSEDED IN PART (2026-08-08): the 3-variants-per-section model below was
> removed the same day it shipped review; see "VARIANT SYSTEM REMOVED" and
> "ANSWER DRAFTER ADDED" in the status log. Current shape: ONE optimized
> version per section (DraftCopySchema), answer-drafter after copy approval.

### What exists today and why it fails

- The Fable writing pass and Sonnet verify pass have NO prompt files; they are
  prose paragraphs in `content/pipeline-runbook.md` (only `.claude/agents/
  job-scout.md` exists). Every run re-improvises the prompt; quality drifts.
- One mega-pass writes everything (story + claims + appText + notes); a weak
  section means regenerating a giant blob. No variants.
- All hard rules (em dashes, claim word count, 5-evidence-id whitelist, banned
  verdict-tail pattern) are prose bans; every one exists because a violation
  shipped, and none is enforced by tooling.
- Verify pass leaves no artifact; no proof a draft was actually verified.
- The five-file read chain (work-index -> career-facts -> asset-inventory ->
  evidence.ts -> copy-corpus -> CLAUDE.md) is honor-system and expensive; it
  exists because an agent shortcut it once and invented "Founding engineer at
  Mudrex".
- `app/scripter-lab` is a dev-only harness (5 fictional companies) for judging
  copy inside the real page frame. It is a testbed, not automation. KEEP it for
  testing prompt changes before they touch real companies.

### Key insight from Sujin (drives the prompt design)

Voice rules alone are weak. What works is **references**: show the agent approved
exemplar paragraphs and say "this is how you draft", with rules as constraints on
top. The reference layer is the highest-leverage piece and Sujin curates it
himself (see section 6, the reference picker).

### Draft data model (jsonb on the company row)

```ts
draft: {
  status: "drafted" | "in_review" | "approved";
  story: [
    { id: "beat-1",
      variants: [{ text, origin: "drafter" }, ...],  // 3, each a different ANGLE
      selectedIndex: number | null,
      editedText: string | null },                    // overrides everything
    ...
  ];
  requirements: [ /* same variant shape per claim, 3 variants each */ ];
  appText:      [ /* 2-3 variants */ ];
  notes:        [ /* per persona */ ];
  lint:   { passedAt, version };
  verify: { findings: [{section, paragraph, issue, severity}], rounds, passedAt };
}
// final copy for a paragraph = editedText ?? variants[selectedIndex].text
```

### Files (versioned in repo)

- `.claude/agents/drafter.md` — drafter prompt: task shape, variant requirements
  (different angles, not rewordings), reference-driven instructions, hard rules.
- `.claude/agents/copy-verifier.md` — judgment-only checks: competitor-swap test,
  variant diversity (kills same-idea-reworded sets), fact accuracy vs
  career-facts, theme repetition across the page.
- `content/drafting-references.md` — per-paragraph-type exemplars, generated from
  Sujin's picks in the reference picker. Sujin approves before first use.
- `scripts/lint-copy.ts` — mechanical enforcement: em dashes / hyphens-as-
  punctuation, claim 15-22 word band, evidence-id whitelist (5 ids), banned
  sentence patterns, repo-internal citations (commit counts etc.),
  present-tense-Vanta phrasing. Exact positional errors. Exit 0 required.

### The flow (runs in the routine after research; identical prompts run locally
### for redrafts, so quality does not depend on where it ran)

SCOPE CHANGE (Sujin, 2026-08-05 evening):
- appText is OUT of the drafter. Every portal form differs; application text is a
  chat-only flow (Sujin pastes the actual form questions, Fable answers from that
  company's research + references). Schema keeps the field for the record; no
  agent pre-generates it; the appText gate is gone.
- notes/outreach are OUT of the drafter. The two connection-note variants are
  locked templates (CLAUDE.md Connection Notes); only company/role/slug vary.
  The detail page renders both filled-in variants with copy buttons, straight
  from the company row. No LLM. Sujin messages more people than research finds,
  so per-person generated notes were the wrong shape anyway.
- Net: the drafter writes STORY + REQUIREMENT CLAIMS only (variants per plan).

```
research row (DB)
   |
1. DRAFTER (Fable), one agent PER SECTION:
   story | requirements
   each: reads references + career-facts + evidence whitelist,
   writes -> runs lint-copy.ts -> fixes failing paragraphs -> loops to exit 0
   |
2. VERIFIER (Sonnet), whole draft at once (cross-section view)
   findings persisted on the draft record
   blocking findings -> drafter re-invoked on exactly those paragraphs
   max 2 revision rounds, then flag for Sujin
   |
3. draft.status = "drafted"; lint + verify results stored (audit trail)
   |
4. SUJIN REVIEWS ON THE BOARD (/pipeline/<slug>):
   per paragraph: 3 variants, click to select, inline edit, Save -> DB + dblog
   chat: "redraft beat 2, angle X" -> targeted re-run of ONE section agent
   |
5. draft.status = "approved" -> build gate (unchanged: companies/<slug>.ts,
   register in index, lint/build/test, pages_ready)
```

### How lint issues actually get FIXED (not just flagged)

- The linter is inside the drafter's loop like a failing test: exact actionable
  errors ("claim in requirement 3 is 31 words, max 22"), drafter rewrites just
  the failing paragraphs, cannot finish until exit 0.
- Only trivially mechanical things auto-fix in the script (typo normalization);
  anything needing a rewrite stays an error for the drafter, because
  auto-"fixing" prose would wreck it.
- Verifier findings follow the same pattern: structured findings -> drafter
  revision pass targeted at exactly those paragraphs.
- By the time a draft reaches the board, rule-class errors are gone; Sujin's
  review is taste and variant-picking only.

### Read-chain decision

The drafter's diet shrinks to: drafting-references + career-facts + evidence
whitelist. The linter now catches what the full five-file chain was defending
against. copy-corpus.md remains the SOURCE the references are built from, not a
per-run read.

## 6. Reference picker page (explicitly requested)

A dev-only page like scripter-lab where Sujin curates the reference layer:

- Pulls every paragraph from the EXISTING applications (`companies/*.ts` pages /
  approved pageDrafts), grouped by paragraph type: beat 1, beat 2, beat 3,
  requirement claims, closings, appText.
- Each type shows the full list of candidates; **click selects, click again
  deselects**. Selections persist (JSON via API route, later DB).
- Selected sets are what `content/drafting-references.md` is generated from; the
  drafter reads only Sujin-picked exemplars. "You use that later on": the picker
  output feeds every future drafter run.
- Internal UI, but per CLAUDE.md UI rules gets frontend-design treatment.

## 7. Board upgrades

- Sort by posted date and salary (maxUsd); filter by country, remote scope,
  US-auth, min salary. Rank chip / priority sorting unchanged.
- Fact rows computed from structured fields (dashboard-compact-facts memory:
  fact rows + link, never prose).
- Draft review UI per section 5 (variant picker, inline edit, save).

## 7b. Runner system (separate repo)

The scheduler/visibility system lives in ITS OWN REPO, not this one: local
launchd runner for the extension-gated boards (Wellfound, WAS, WWR,
cryptojobslist, startup.jobs, superteam, topstartups — verified bot-blocked
headlessly 2026-08-05), run logging into a `runs` table in the same Neon DB
(started/finished, where it ran, sources covered + newest posting seen, outcome),
and a dashboard of ran/scheduled with per-source freshness. This repo only keeps
the agent prompts and scripts the runner invokes. Cloud routine covers the 13
headless-safe sources. DB: Sujin's own Neon account (direct), NOT the Vercel
Marketplace resource (removed — double billing).

## 7c. Application forms + outreach tracking module (agreed 2026-08-05 night)

Capability split is by WHERE THE RUN HAPPENS, not who runs it:
- In a local chat session, Fable can run EVERYTHING (headless work + Chrome
  extension work). No split locally.
- The cloud routine is the degraded copy for when the machine is asleep: only
  the headless subset (13 safe sources, research, normalize, draft, re-rank).
  Extension-dependent work it marks in the DB as "needs local".

Extension-dependent work (the "local sweep" — ONE agent call per session run,
strictly sequential because Chrome is a single shared resource; skip the agent
and do it inline when the queue is 1-2 items):
1. Blocked-board sweeps (Wellfound, WAS, WWR, cryptojobslist, startup.jobs,
   superteam, topstartups)
2. Application form fetching: open the portal, extract real questions
3. LinkedIn people harvesting per accepted company (read/search ONLY - never
   auto-connect or auto-message; sending is always Sujin's finger)
The DB queue ("needs local: form, people") is the handoff between routine and
session. Local sweep agent gets its own prompt file like job-scout.

New jsonb on the company row:

application: {
  formUrl, fetchedAt,
  questions: [{ id, label, type: "short"|"long"|"select"|"file"|"checkbox",
    options?, required,
    draft,                      // Fable, ONE variant per question (forms want
                                // one good answer), from research + references
    status: "drafted"|"approved"|"submitted" }]
}
// replaces the dead appText concept; review happens on the detail page;
// pasting into the portal and submitting stays manual.

outreach: [{ name, role, url, persona, withNote,
  status: "to_send"|"sent"|"replied"|"connected", sentAt }]
// /outreach page (existing runsheet UI: numbered people, filled template note,
// OPEN / COPY NOTE, check-offs) becomes DB-driven: harvested people flow in,
// check-offs persist, sent->replied gives real per-persona conversion stats.

## 8. Routine deployment notes

- Routine does the whole front half autonomously: source -> research -> normalize
  -> draft (all sections, variants) -> verify -> status "drafted". Zero repo
  writes, zero git. Sujin wakes up to drafts on the board.
- Manual/local remains: gate reviews, targeted redrafts, build step (writes real
  code, committed as usual), outreach and applying (always manual, per runbook).

## 9. Build order

1. Schema + zod + Drizzle + Neon provisioning + store.ts rewrite (single access
   layer preserved)
2. `scripts/validate-pipeline.ts` + normalizer agent prompt; migrate 39 entries
3. `scripts/lint-copy.ts`
4. Reference picker page; Sujin picks; generate `content/drafting-references.md`;
   Sujin approves it
5. `.claude/agents/drafter.md` + `.claude/agents/copy-verifier.md`; test in
   scripter-lab against fictional companies
6. Board: filters/sort + draft variant review UI + dblog.jsonl wiring
7. `scripts/draft.ts` pull/push with 3-file cap
8. Runbook rewrite reflecting all of the above; routine wiring
9. Deprecate legacy statuses (page_approved/app_text/notes) in the same pass

## Status and deviations (as of 2026-08-06)

DONE (steps 1-5 + extras):
1. Schema + zod + validate-pipeline.ts: live. ADDED since plan: `size` headcount
   band ("1-10"|"10-30"|"30-50"|"50-100"|"100-500"|"500+", null = unknown) for
   startup targeting; scouts fill it from LinkedIn/YC/about pages, never guess.
2. Migration: all 42 files (not 39) converted and validated.
3. DB: DEVIATION - NOT Marketplace Neon. Provisioned resource was us-east-1 and
   double-billed vs Sujin's existing Neon account; deleted. Live DB is Sujin's
   own Neon project `job-pipeline` in ap-southeast-1 (Singapore), DATABASE_URL
   set locally + all Vercel envs, /api/pipeline pinned to sin1.
   import-pipeline.ts defaults to NEW-slugs-only (old JSONs are an inert archive
   and must never clobber live DB state; explicit slugs = upsert).
4. Board: filters (country/salary/US-auth) + sorts live, plus a full
   minimal-premium redesign (underline tabs, ghost filters, computed fact rows,
   uppercase mono CTAs, loading/press/hover states, centered SVG loader).
   Detail page + reference picker restyled to match.
5. lint-copy.ts: live; caught real violations in shipped copy (stacksync beat 3,
   albert appText + claim length) - flagged, not fixed (approved copy).

DELETED CONCEPTS: appText and generated PersonaNotes are fully gone - schema
fields, DB columns, and UI removed (plan 7c originally said "schema keeps the
field for the record"; superseded - the record concept is application.questions).
Outreach notes are template-computed in the runsheet.

OUTREACH: standalone /outreach page was a prototype and is deleted; the runsheet
(DB-backed `outreach` targets, per-person filled notes, persistent check-offs)
lives on /pipeline/<slug> as the company's final step. Respan/Seeq seeded.

SCOUT CHANGES: priority re-scoring + top-10 rerank is now the SCOUT's final step
every run (not the orchestrator's). Ranks live only on proposed rows. Source
lanes re-verified by real sweeps 2026-08-06: headless-viable is only web3.career,
HN Algolia, ATS APIs, and weak Himalayas/Remotive/RemoteOK feeds; crypto.jobs,
cryptocurrencyjobs, remote3, dynamitejobs, hirebasis are JS-gated = local lane.

LOCAL SWEEP ARCHITECTURE (hard platform constraint, discovered 2026-08-06):
claude-in-chrome tools are MAIN-SESSION ONLY - subagents cannot load them. So
the local sweep is not a dispatchable agent; it runs as the main loop of a
dedicated cheap session: `claude --model sonnet` + `/local-sweep` (slash command
at .claude/commands/local-sweep.md). local-sweep.md is the checklist. Proven
end-to-end 2026-08-06: 6 fresh candidates landed via headless scout + local
sweeps in one day.

DONE 2026-08-08: step 6 (superseded by the rolling bucketed reference design;
scripts/draft-refs.ts is the generator, /reference-picker demoted to future
pin/exclude), step 7 (drafter.md + copy-verifier.md, battle-tested on 3 lab
companies through 3 rounds; known-failure-modes list baked in; "beat 1 makes a
reading, not a list" + 25-35-word beat cap added from Sujin's lab review), step
8 core (DraftVariantsSchema + draft_variants DB column, VariantPicker on the
detail page: angle chips, click-to-edit text, save picks, verifier notes
toggle; pipeline/dblog.jsonl appended on every patchCompany, local only,
gitignored). Real-company flow: drafter patches draftVariants into the row,
verifier patches condensed verifierNotes, Sujin picks on /pipeline/<slug>;
page assembly from picks happens in chat (start of the build stage).

DONE 2026-08-08 (afternoon): step 9 (scripts/draft.ts pull/push/list, 3-file
cap, push zod-validates then deletes; scratch dir inside gitignored /pipeline/),
lint-copy.ts <slug> mode now reads the DB row (lints draftVariants AND
pageDraft; --text/--claim unchanged, so agent prompts unaffected; archive JSONs
no longer linted), 7c UI (ApplicationPanel on /pipeline/<slug>, rendered
whenever the row has `application`: per-question inline edit with auto
pending->drafted, click-to-cycle status chip, copy button, save to DB;
verified live against atria's 9 Workable questions), and 7b (new repo
~/Development/sujin/pipeline-runner: runs table created in the same Neon DB,
run.ts wrapper that logs start/outcome around `claude --model sonnet -p
"/local-scout"` exporting RUN_ID, record-source.ts for per-source freshness
(local-scout.md reporting section now calls it when RUN_ID is set), status.ts
CLI dashboard. Launchd plist is documented in its README for Sujin to install
by hand — the harness blocks Claude from creating standing scheduled jobs. Web
dashboard deferred; the CLI is the v1).

PENDING: step 10 (runbook rewrite + cloud routine wiring) - HELD per Sujin.
Legacy statuses page_approved/app_text/notes REMOVED from schema 2026-08-08
(build kept, it is live).

SCOUT SPLIT 2026-08-06: the single job-scout agent kept running out of context
(the crypto deep run triaged away its site: ATS web-search pass). Restructured:
job-scout.md is now a LANE scout - one invocation covers one lane (crypto /
yc-ai / boards, named in the task prompt), each lane does its own file ->
validate -> import, no priority work. A scout run = launch the 3 lanes in
parallel, then run job-scout-rerank.md once (new agent): cross-lane dedupe by
name/domain, then the priority level + top-10 rank pass over all proposed. The
site: ATS web-search pass is a MANDATORY early step in the crypto and yc-ai
lanes so it can never be triaged away again.

DRAFTER ECONOMY 2026-08-07 (after a subagent-heavy day tripped the usage
warning): one drafter agent per BATCH (all companies in a run, cap 4; fresh
reference pack per company; no shared openers/phrases across the batch), one
verifier agent per batch (adds a cross-draft same-opener check), verify ONCE
after drafting (no verify->fix->reverify cycles; Sujin is the final gate in
step 8). Main session does trivial edits directly instead of spawning fixers.
Haiku for mechanical spawns. Fable remains drafter-only.

REFERENCE DESIGN LOCKED 2026-08-07 (replaces the manual /reference-picker
flow for step 6): drafter references are a ROLLING WINDOW, BUCKETED BY COMPANY
SIZE, self-maintained from approved pages. No static corpus, no up-front manual
picking.
- Buckets and registers (approved by Sujin):
  - big (100-500, 500+): experience and capability register. Proof of operating
    at scale, credible senior IC.
  - startup (30-50, 50-100, and funded 10-30): ownership register. End-to-end
    shipping, wearing every hat.
  - tiny (1-10, e.g. deeply): insight register. Specific observations about
    THEIR product and concretely how Sujin can help; consultant-opener energy,
    not application energy.
- Per-run reference pack the drafter receives: (a) CLAUDE.md copywriting rules,
  (b) the register instruction for the target company's size bucket, (c) the
  last ~5 APPROVED pages in that bucket pulled fresh from companies/*.ts at
  draft time, split per paragraph type (beat1/beat2/beat3/claims/closing). Thin
  bucket -> fall back to nearest bucket + tell the drafter no exact-register
  exemplar exists.
- Tone note (Sujin, 2026-08-07): the recent pages deliberately run a bit
  emotional and excited ("I love this problem", "highest stakes problems"),
  strongest on small companies. This is approved voice direction; the rolling
  window carries it naturally, and the register instructions should name it
  (excitement stated plainly, never hype adjectives).
- content/copy-corpus.md retires when this ships (it is stale: contains
  now-banned verdict-tail lines, e.g. Grayswan "That's the room I work best
  in"). /reference-picker becomes a pin/exclude override on the window, not a
  requirement.

LOCAL SPLIT 2026-08-07: /local-sweep (bundled 3 jobs) replaced by two commands,
split by pipeline stage instead of by browser constraint. /local-scout = intake
only: blocked-board sweep for NEW companies + application-form question fetch
for new/proposed rows (form context helps Sujin judge proposals) + priority
pass. /local-research = accepted companies only, runs after approval as part of
research: LinkedIn people harvesting (<6 targets) + form-fetch backfill.
Checklists at .claude/checklists/local-scout.md / local-research.md, commands at
.claude/commands/. Old local-sweep.md files deleted. "Run the scout" now means
scouting alone, never research. Note: headless lane scouts cannot fetch forms,
so headless-sourced companies get forms backfilled by /local-research after
acceptance.

AUDIT 2026-08-06 (agent cross-check of this plan vs repo): four fixes applied -
local-sweep.md Job-1 flow aligned with the /local-sweep command (file ->
validate -> import; DB-direct only for forms/people), job-scout dedupe moved to
the DB, CLAUDE.md intake rules corrected to DB-based priority, orphaned
CopyBlock.tsx deleted. KNOWN REMAINING: (a) FIXED 2026-08-08 (lint-copy.ts now
reads the DB); (b) runbook staleness stays until step 10 (held). Archive is 49
files now, all validating.

VARIANT SYSTEM REMOVED 2026-08-08 (evening, Sujin): 3-variants-per-section made
the drafter differentiate variants by rotating projects instead of optimizing
the copy for the application. Now ONE version per section, explicitly optimized
per requirement (same flagship evidence across claims is fine when it is the
best proof). DraftVariantsSchema -> DraftCopySchema ({register, story: string[],
claims: [{label, need, text}], verifierNotes?, generatedAt}); DB column
draft_variants renamed to draft (scripts/migrate-draft-single.ts, run against
live DB; the 8 existing drafts collapsed to their selected-or-first variant);
VariantPicker replaced by DraftReview (inline edit + save, no picking);
drafter.md/copy-verifier.md rewritten (verifier gained an EVIDENCE FIT check
replacing variant divergence). Section 5's variant plan is superseded.

ANSWER DRAFTER ADDED 2026-08-08 (evening, Sujin): application-form answers now
have an owner: .claude/agents/answer-drafter.md (Fable). Runs ONLY after the
page copy is finalized (status build+), one answer per pending question, written
to agree with the approved draft/pageDraft, linted, patched in place as
"drafted"; Sujin reviews in the ApplicationPanel. The main session dispatches it
when a company with a fetched form passes the copy-approval gate. This closes
the 7c remainder ("application answer drafting" had no owner; the panel's
"draft in chat" was the only path).

## 10. Open items

- Neon vs other Postgres was recommended, not mandated; confirm at provisioning.
- FX conversion source for minUsd/maxUsd: hardcoded rough table is acceptable
  (sort/filter only).
- Session hook for auto-surfacing dblog lines: optional, decide when wiring.
- Evidence whitelist (5 ids) vs rich asset-inventory tension noted by the audit:
  drafters see rich material they cannot cite as proofs; unresolved, revisit
  after first drafter runs.
