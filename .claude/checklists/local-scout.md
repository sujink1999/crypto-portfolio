---
name: local-scout
description: Checklist for the local scouting pass - sweeps the browser-gated job boards for NEW companies and fetches their application form questions. Intake only; never touches accepted companies. Main-session checklist, not a dispatchable subagent.
tools: Bash, Read, Write, ToolSearch, WebFetch, WebSearch
model: sonnet
---

IMPORTANT: the claude-in-chrome extension tools are MAIN-SESSION ONLY; subagents cannot load them via ToolSearch. This file is a CHECKLIST for the main session to execute inline. Dispatch only non-browser parts (DB writes, validation) if needed.

You are the local scout for Sujin's application pipeline. Intake ONLY: find new companies on the browser-gated boards and fetch their application forms. You never touch companies already accepted (anything past "proposed"); that is /local-research's job. Chrome is a single shared resource: work STRICTLY SEQUENTIALLY, one tab, one task at a time. Create your own tab via tabs_create_mcp; close it when done.

Read lib/pipeline/schema.ts first; every DB write must conform to it. The DB is the source of truth.

## Job 1: blocked-board sweep

The boards headless runs cannot reach: Wellfound (wellfound.com/remote, Worldwide facet, newest first), Work at a Startup, We Work Remotely (Anywhere-in-the-World category), cryptojobslist.com/remote, crypto.jobs, cryptocurrencyjobs.co, remote3.co, startup.jobs, superteam.fun/earn, topstartups.io.

We Work Remotely: Sujin has a PAID annual candidate account (since 2026-08-07; Chrome is logged in). Sweep WWR logged-in, not via the public RSS. Full job details and the apply target are visible to this account, so for every WWR candidate also record the real apply channel (external ATS URL, email, or WWR-native form) in the proposal at intake time; WWR listings decay fast (Reveleer closed within a day of verification), so anything strong should be flagged for same-day action. Sweep newest-first using each board's date sort/filter; stop a board when listings age past ~3 weeks. Skip any board the user names as recently covered.

Apply the full job-scout screen: read .claude/agents/job-scout.md for the profile, eligibility rules, tiers, and output schema. Dedupe against DB slugs via lib/pipeline/store.ts readAll, never files. Verify each JD is live at the company's own ATS posting and link THAT as jdUrl. Write pipeline/<slug>.json in the v2 schema (include the size band), validate with scripts/validate-pipeline.ts until OK, then import only your new slugs: npx dotenv -e .env.local -- npx tsx scripts/import-pipeline.ts <slugs>.

## Job 2: application form fetch for new proposals

For each company YOU just proposed in Job 1, plus any existing "proposed" row missing an `application` field with a known ATS/portal URL: open the application form in the browser, extract the REAL questions (label, input type, options for selects, required flags). Map input types: text -> "short", textarea -> "long", select/radio -> "select", file upload -> "file", checkbox -> "checkbox". Write to the company row as `application: { formUrl, fetchedAt, questions: [...] }`; each question needs an `id` (stable snake_case slug of the label, e.g. "cover_letter") plus `draft: null, status: "pending"` via a tsx script using lib/pipeline/store.ts patchCompany. This gives Sujin the real application context while reviewing proposals. Do NOT fill anything into the actual form, do NOT create accounts, do NOT submit. If a form is login-gated, record nothing and report it ("needs Sujin: login-gated form").

## Priority pass (final step)

Re-run the priority pass over ALL proposed rows per CLAUDE.md Pipeline Intake Rules: levels + one-sentence reasons for everyone, ranks 1-10 for the top ten only, re-numbered from scratch, via patchCompany.

## Reporting

One final report: ranked table of proposals, a coverage line per board (newest posting seen, or the skip/failure reason), forms fetched (slug -> question count, plus login-gated ones), near-misses with reasons. If a browser tool fails 2-3 times on the same site, skip it and report; do not loop.

Run log: if the RUN_ID env var is set (the session was launched by pipeline-runner), also record each board's coverage line into the runs table: `cd ~/Development/sujin/pipeline-runner && npx dotenv -e .env -- npx tsx src/record-source.ts <board> <newest-posted-date|-> "<note>"` once per board swept. Skip silently when RUN_ID is unset.
