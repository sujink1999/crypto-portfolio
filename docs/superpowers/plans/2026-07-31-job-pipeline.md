# Job Application Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** File-backed batch pipeline (state in gitignored `pipeline/` JSON) with a dev-only black dashboard for reviewing/approving pitch-page drafts, application text, and connection notes, plus logo fetching and logo-based OG images.

**Architecture:** State lives in one JSON file per company under `pipeline/`, read/written by a small lib (`lib/pipeline/`). A dev-only API route exposes list + patch; `app/pipeline` renders the board and per-company detail with sequential approval gates. Page-copy drafts reuse the existing `CompanyPitch` type so approved drafts convert directly into `companies/<slug>.ts` configs. A tsx script fetches logos into `public/logos/`; `app/[company]/opengraph-image.tsx` embeds the logo when present.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, `node:test` via `tsx --test` (existing pattern in `lib/condition-tree`).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-31-job-pipeline-design.md`.
- `pipeline/` is gitignored; `public/logos/` IS committed (needed by deployed OG images).
- Dashboard and its API return 404 when `process.env.NODE_ENV === "production"`.
- Design language: near-black (#050505 bg, #0d0d0d cards), hairline borders `border-white/10`, muted gray text, white for key facts, accent only on active states, Space Grotesk (default site font) + Geist Mono.
- No emoji in code or UI. No em dashes or " - " punctuation in any user-facing copy.
- `@/*` path alias; Tailwind utilities only; server components unless interactivity requires `"use client"`.
- After each task: `npm run lint` and `npm test` pass; `npm run build` must pass at Tasks 5 and 7.

---

### Task 1: Pipeline state types + file store

**Files:**
- Create: `lib/pipeline/types.ts`
- Create: `lib/pipeline/store.ts`
- Test: `lib/pipeline/store.test.ts`
- Modify: `.gitignore` (add `pipeline/` and `!pipeline/.gitkeep` lines), `package.json` (test script)

**Interfaces:**
- Produces: `PipelineCompany`, `PipelineStatus`, `STATUS_ORDER`, `readAll(dir): PipelineCompany[]`, `readCompany(dir, slug): PipelineCompany | null`, `writeCompany(dir, company): void`, `patchCompany(dir, slug, patch): PipelineCompany` (deep-shallow merge: top-level keys replaced), `canAdvance(from, to): boolean`.

- [ ] **Step 1: Write types**

```ts
// lib/pipeline/types.ts
import type { CompanyPitch } from "@/companies/types";

export const STATUS_ORDER = [
  "proposed",
  "researching",
  "page_draft",
  "page_approved",
  "app_text",
  "notes",
  "build",
  "pages_ready",
  "applied",
] as const;

export type PipelineStatus = (typeof STATUS_ORDER)[number] | "rejected";

export type Persona = "engineer" | "cto" | "ceo" | "recruiter";

export interface PersonaNote {
  persona: Persona;
  /** target human, if known (e.g. "Penny, recruiter") */
  target?: string;
  text: string;
  approved: boolean;
  sent: boolean;
}

export interface PipelineCompany {
  slug: string;
  company: string;
  role: string;
  source: string; // "was" | "linkedin" | "wellfound" | "sourced:<board>"
  jdUrl?: string;
  jdText?: string;
  domain?: string;
  status: PipelineStatus;
  logo?: { sourceUrl: string; path: string; approved: boolean };
  research?: {
    summary: string;
    hook: string;
    humans: { name: string; role: string; url?: string }[];
    widgetConcept?: { key: string; description: string };
  };
  /** Full draft page copy, same shape the build step turns into companies/<slug>.ts */
  pageDraft?: CompanyPitch;
  appText?: { variants: { label: string; text: string }[]; approvedIndex?: number };
  notes?: PersonaNote[];
  applied?: { done: boolean; date?: string };
  updatedAt: string;
}
```

- [ ] **Step 2: Write failing tests**

```ts
// lib/pipeline/store.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readAll, readCompany, writeCompany, patchCompany, canAdvance } from "./store";
import type { PipelineCompany } from "./types";

const base = (): PipelineCompany => ({
  slug: "acme",
  company: "Acme",
  role: "Full Stack Engineer",
  source: "was",
  status: "proposed",
  updatedAt: "2026-07-31T00:00:00.000Z",
});

test("write then read round-trips", () => {
  const dir = mkdtempSync(join(tmpdir(), "pipe-"));
  writeCompany(dir, base());
  assert.equal(readCompany(dir, "acme")?.company, "Acme");
  assert.equal(readAll(dir).length, 1);
});

test("readCompany returns null for missing slug", () => {
  const dir = mkdtempSync(join(tmpdir(), "pipe-"));
  assert.equal(readCompany(dir, "nope"), null);
});

test("readAll on missing dir returns empty", () => {
  assert.deepEqual(readAll(join(tmpdir(), "does-not-exist-xyz")), []);
});

test("patchCompany replaces top-level keys and bumps updatedAt", () => {
  const dir = mkdtempSync(join(tmpdir(), "pipe-"));
  writeCompany(dir, base());
  const out = patchCompany(dir, "acme", { status: "researching" });
  assert.equal(out.status, "researching");
  assert.notEqual(out.updatedAt, "2026-07-31T00:00:00.000Z");
  assert.equal(readCompany(dir, "acme")?.status, "researching");
});

test("patchCompany throws for unknown slug", () => {
  const dir = mkdtempSync(join(tmpdir(), "pipe-"));
  assert.throws(() => patchCompany(dir, "ghost", { status: "rejected" }));
});

test("canAdvance allows forward, rejected-from-anywhere, and backward for redo", () => {
  assert.equal(canAdvance("proposed", "researching"), true);
  assert.equal(canAdvance("page_draft", "page_approved"), true);
  assert.equal(canAdvance("app_text", "rejected"), true);
  assert.equal(canAdvance("page_approved", "page_draft"), true); // needs changes
  assert.equal(canAdvance("proposed", "applied"), false); // no skipping
});
```

- [ ] **Step 3: Run tests, verify failure**

Run: `npx tsx --test lib/pipeline/store.test.ts`
Expected: FAIL (cannot find `./store`)

- [ ] **Step 4: Implement store**

```ts
// lib/pipeline/store.ts
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { STATUS_ORDER, type PipelineCompany, type PipelineStatus } from "./types";

export function readAll(dir: string): PipelineCompany[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")) as PipelineCompany)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function readCompany(dir: string, slug: string): PipelineCompany | null {
  const file = join(dir, `${slug}.json`);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf8")) as PipelineCompany;
}

export function writeCompany(dir: string, company: PipelineCompany): void {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${company.slug}.json`), JSON.stringify(company, null, 2) + "\n");
}

export function patchCompany(
  dir: string,
  slug: string,
  patch: Partial<PipelineCompany>,
): PipelineCompany {
  const existing = readCompany(dir, slug);
  if (!existing) throw new Error(`pipeline: unknown slug "${slug}"`);
  const next = { ...existing, ...patch, slug, updatedAt: new Date().toISOString() };
  writeCompany(dir, next);
  return next;
}

/** Forward one-or-more steps, backward for redo, or rejected from anywhere. */
export function canAdvance(from: PipelineStatus, to: PipelineStatus): boolean {
  if (to === "rejected") return true;
  if (from === "rejected") return to === "proposed";
  const a = STATUS_ORDER.indexOf(from as (typeof STATUS_ORDER)[number]);
  const b = STATUS_ORDER.indexOf(to as (typeof STATUS_ORDER)[number]);
  if (a === -1 || b === -1) return false;
  return b === a + 1 || b < a; // one step forward, or any step back for redo
}
```

- [ ] **Step 5: Run tests, verify pass** — `npx tsx --test lib/pipeline/store.test.ts` → all PASS. Note the `canAdvance("proposed","applied")` test expects `false`, and backward (`b < a`) is allowed: implementation matches.

- [ ] **Step 6: Wire up test script, gitignore, commit**

In `package.json` change the test script to: `"test": "tsx --test lib/condition-tree/*.test.ts lib/pipeline/*.test.ts"`.
Append to `.gitignore`:

```
# job pipeline state (private)
/pipeline/
```

Create `pipeline/` locally (no gitkeep needed since ignored). Run `npm test`, then:

```bash
git add lib/pipeline .gitignore package.json
git commit -m "feat: pipeline state types and file store"
```

---

### Task 2: Dev-only pipeline API route

**Files:**
- Create: `app/api/pipeline/route.ts`
- Create: `lib/pipeline/dir.ts`

**Interfaces:**
- Consumes: `readAll`, `patchCompany`, `writeCompany` from `lib/pipeline/store`.
- Produces: `GET /api/pipeline` → `{ companies: PipelineCompany[] }`; `PATCH /api/pipeline` body `{ slug: string, patch: Partial<PipelineCompany> }` → `{ company: PipelineCompany }`; `PIPELINE_DIR` constant.

- [ ] **Step 1: Implement**

```ts
// lib/pipeline/dir.ts
import { join } from "node:path";
export const PIPELINE_DIR = join(process.cwd(), "pipeline");
```

```ts
// app/api/pipeline/route.ts
import { NextResponse } from "next/server";
import { readAll, patchCompany } from "@/lib/pipeline/store";
import { PIPELINE_DIR } from "@/lib/pipeline/dir";

const gone = () => new NextResponse(null, { status: 404 });
const isProd = () => process.env.NODE_ENV === "production";

export const dynamic = "force-dynamic";

export async function GET() {
  if (isProd()) return gone();
  return NextResponse.json({ companies: readAll(PIPELINE_DIR) });
}

export async function PATCH(req: Request) {
  if (isProd()) return gone();
  const { slug, patch } = await req.json();
  if (typeof slug !== "string" || !patch || typeof patch !== "object") {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  try {
    return NextResponse.json({ company: patchCompany(PIPELINE_DIR, slug, patch) });
  } catch {
    return NextResponse.json({ error: "unknown slug" }, { status: 404 });
  }
}
```

- [ ] **Step 2: Verify manually**

Seed a sample file, hit the route:

```bash
cat > pipeline/sample.json <<'EOF'
{ "slug": "sample", "company": "Sample Co", "role": "Full Stack Engineer",
  "source": "was", "status": "proposed", "updatedAt": "2026-07-31T00:00:00.000Z" }
EOF
npm run dev &
curl -s localhost:3000/api/pipeline | head -c 300
curl -s -X PATCH localhost:3000/api/pipeline -H 'content-type: application/json' \
  -d '{"slug":"sample","patch":{"status":"researching"}}'
```

Expected: GET lists sample; PATCH returns status `researching`; `pipeline/sample.json` updated on disk.

- [ ] **Step 3: Lint + commit**

```bash
npm run lint
git add app/api/pipeline lib/pipeline/dir.ts
git commit -m "feat: dev-only pipeline API (list + patch)"
```

---

### Task 3: Dashboard board view

**Files:**
- Create: `app/pipeline/page.tsx` (server shell, prod 404)
- Create: `components/pipeline/Board.tsx` (client)
- Create: `components/pipeline/StatusPill.tsx`

**Interfaces:**
- Consumes: `GET /api/pipeline`, `PATCH /api/pipeline`, `PipelineCompany`, `STATUS_ORDER`.
- Produces: `/pipeline` route; `<StatusPill status={PipelineStatus} />` reused by Task 4.

- [ ] **Step 1: Server shell with prod guard**

```tsx
// app/pipeline/page.tsx
import { notFound } from "next/navigation";
import Board from "@/components/pipeline/Board";

export const metadata = { title: "Pipeline", robots: { index: false, follow: false } };

export default function PipelinePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Board />;
}
```

- [ ] **Step 2: Status pill**

```tsx
// components/pipeline/StatusPill.tsx
import type { PipelineStatus } from "@/lib/pipeline/types";

const LABELS: Record<PipelineStatus, string> = {
  proposed: "Proposed", researching: "Researching", page_draft: "Page draft",
  page_approved: "Page approved", app_text: "App text", notes: "Notes",
  build: "Build", pages_ready: "Pages ready", applied: "Applied", rejected: "Rejected",
};

export default function StatusPill({ status }: { status: PipelineStatus }) {
  const active = status === "page_draft" || status === "app_text" || status === "notes" || status === "pages_ready";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wide ${
        status === "rejected"
          ? "border-white/10 text-white/30"
          : active
            ? "border-white/25 text-white"
            : "border-white/10 text-white/50"
      }`}
    >
      {LABELS[status]}
    </span>
  );
}
```

- [ ] **Step 3: Board (client)**

```tsx
// components/pipeline/Board.tsx
"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { PipelineCompany } from "@/lib/pipeline/types";
import StatusPill from "./StatusPill";

const GROUPS: { title: string; statuses: PipelineCompany["status"][] }[] = [
  { title: "Proposed", statuses: ["proposed"] },
  { title: "In research", statuses: ["researching"] },
  { title: "Awaiting your review", statuses: ["page_draft", "app_text", "notes", "pages_ready"] },
  { title: "Approved, building", statuses: ["page_approved", "build"] },
  { title: "Applied", statuses: ["applied"] },
  { title: "Rejected", statuses: ["rejected"] },
];

export default function Board() {
  const [companies, setCompanies] = useState<PipelineCompany[]>([]);
  const load = useCallback(async () => {
    const res = await fetch("/api/pipeline");
    const data = await res.json();
    setCompanies(data.companies);
  }, []);
  useEffect(() => { load(); }, [load]);

  const decide = async (slug: string, accept: boolean) => {
    await fetch("/api/pipeline", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug, patch: { status: accept ? "researching" : "rejected" } }),
    });
    load();
  };

  return (
    <main className="min-h-screen bg-[#050505] px-8 py-10 text-white">
      <h1 className="text-xl font-medium tracking-tight">Pipeline</h1>
      <p className="mt-1 font-mono text-xs text-white/40">{companies.length} companies</p>
      <div className="mt-8 flex flex-col gap-10">
        {GROUPS.map((g) => {
          const list = companies.filter((c) => g.statuses.includes(c.status));
          if (list.length === 0) return null;
          return (
            <section key={g.title}>
              <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-white/40">{g.title}</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((c) => (
                  <div key={c.slug} className="rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
                    <div className="flex items-center gap-3">
                      {c.logo?.path ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={c.logo.path} alt="" className="h-8 w-8 rounded-md object-contain" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 font-mono text-xs text-white/40">
                          {c.company[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="truncate font-medium">{c.company}</div>
                        <div className="truncate text-xs text-white/50">{c.role}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <StatusPill status={c.status} />
                      {c.status === "proposed" ? (
                        <div className="flex gap-2">
                          <button onClick={() => decide(c.slug, true)} className="rounded-md border border-white/25 px-2.5 py-1 text-xs hover:bg-white hover:text-black">Accept</button>
                          <button onClick={() => decide(c.slug, false)} className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-white/50 hover:border-white/25">Reject</button>
                        </div>
                      ) : (
                        <Link href={`/pipeline/${c.slug}`} className="font-mono text-xs text-white/50 hover:text-white">open</Link>
                      )}
                    </div>
                    {c.status === "proposed" && c.research?.summary && (
                      <p className="mt-3 text-xs leading-relaxed text-white/50">{c.research.summary}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Verify** — with `pipeline/sample.json` present, visit `localhost:3000/pipeline`: card renders, Accept moves it to "In research" group, Reject to "Rejected".

- [ ] **Step 5: Lint + commit**

```bash
npm run lint
git add app/pipeline components/pipeline
git commit -m "feat: pipeline dashboard board view"
```

---

### Task 4: Company detail view with sequential gates

**Files:**
- Create: `app/pipeline/[slug]/page.tsx` (server shell, prod 404)
- Create: `components/pipeline/Detail.tsx` (client)
- Create: `components/pipeline/CopyBlock.tsx` (client, copy-to-clipboard)
- Create: `components/pipeline/mocks/index.tsx` (widget mock registry)

**Interfaces:**
- Consumes: `GET/PATCH /api/pipeline`, `PipelineCompany`, `StatusPill`, `CompanyPitch`.
- Produces: `/pipeline/[slug]` route; `WIDGET_MOCKS: Record<string, ComponentType>` registry that research-time mock components get added to (key matches `research.widgetConcept.key`).

- [ ] **Step 1: Server shell**

```tsx
// app/pipeline/[slug]/page.tsx
import { notFound } from "next/navigation";
import Detail from "@/components/pipeline/Detail";

export const metadata = { title: "Pipeline", robots: { index: false, follow: false } };

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { slug } = await params;
  return <Detail slug={slug} />;
}
```

- [ ] **Step 2: CopyBlock**

```tsx
// components/pipeline/CopyBlock.tsx
"use client";
import { useState } from "react";

export default function CopyBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">{label}</span>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded-md border border-white/15 px-2.5 py-1 font-mono text-xs text-white/60 hover:border-white/40 hover:text-white"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">{text}</p>
    </div>
  );
}
```

- [ ] **Step 3: Widget mock registry**

```tsx
// components/pipeline/mocks/index.tsx
import type { ComponentType } from "react";

/**
 * Research-stage widget mocks. Each pipeline batch that proposes a custom
 * page widget adds a lightweight mock component here under the key stored
 * in research.widgetConcept.key. Real implementations live in
 * components/pitch once approved and built.
 */
export const WIDGET_MOCKS: Record<string, ComponentType> = {};
```

- [ ] **Step 4: Detail (client)** — renders by furthest gate reached; earlier approved sections stay visible, collapsed.

```tsx
// components/pipeline/Detail.tsx
"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { PipelineCompany } from "@/lib/pipeline/types";
import StatusPill from "./StatusPill";
import CopyBlock from "./CopyBlock";
import { WIDGET_MOCKS } from "./mocks";

export default function Detail({ slug }: { slug: string }) {
  const [c, setC] = useState<PipelineCompany | null>(null);
  const load = useCallback(async () => {
    const res = await fetch("/api/pipeline");
    const data = await res.json();
    setC(data.companies.find((x: PipelineCompany) => x.slug === slug) ?? null);
  }, [slug]);
  useEffect(() => { load(); }, [load]);

  const patch = async (p: Partial<PipelineCompany>) => {
    await fetch("/api/pipeline", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug, patch: p }),
    });
    load();
  };

  if (!c) return <main className="min-h-screen bg-[#050505] p-8 font-mono text-xs text-white/40">loading</main>;

  const d = c.pageDraft;
  const Mock = c.research?.widgetConcept ? WIDGET_MOCKS[c.research.widgetConcept.key] : undefined;
  const gate = (name: string) => (
    <h2 className="mb-3 mt-10 font-mono text-xs uppercase tracking-[0.2em] text-white/40">{name}</h2>
  );
  const approveBtn = (label: string, p: Partial<PipelineCompany>) => (
    <button onClick={() => patch(p)} className="rounded-md border border-white/25 px-3 py-1.5 text-xs hover:bg-white hover:text-black">
      {label}
    </button>
  );

  return (
    <main className="min-h-screen bg-[#050505] px-8 py-10 text-white">
      <Link href="/pipeline" className="font-mono text-xs text-white/40 hover:text-white">back</Link>
      <div className="mt-4 flex items-center gap-4">
        {c.logo?.path && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={c.logo.path} alt="" className="h-10 w-10 rounded-md object-contain" />
        )}
        <div>
          <h1 className="text-xl font-medium tracking-tight">{c.company}</h1>
          <p className="text-sm text-white/50">{c.role}</p>
        </div>
        <StatusPill status={c.status} />
      </div>

      {c.research && (
        <>
          {gate("Research")}
          <div className="max-w-2xl rounded-xl border border-white/10 bg-[#0d0d0d] p-4 text-sm leading-relaxed text-white/70">
            <p>{c.research.summary}</p>
            <p className="mt-2 text-white/90">Hook: {c.research.hook}</p>
            <ul className="mt-2 list-inside list-disc text-white/60">
              {c.research.humans.map((h) => (
                <li key={h.name}>
                  {h.name}, {h.role}{" "}
                  {h.url && <a href={h.url} target="_blank" rel="noreferrer" className="underline decoration-white/30">profile</a>}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {d && (
        <>
          {gate("Gate 1: page copy")}
          <div className="max-w-2xl space-y-6 rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
            <p className="text-2xl font-medium">Hey {d.company},</p>
            <p className="text-lg text-white/80">{d.hook}</p>
            {d.story.map((s, i) => <p key={i} className="text-sm leading-relaxed text-white/70">{s}</p>)}
            {Mock && (
              <div className="rounded-lg border border-white/10 p-4">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                  widget mock: {c.research?.widgetConcept?.key}
                </p>
                <Mock />
              </div>
            )}
            {d.requirements.map((r) => (
              <div key={r.label} className="border-t border-white/10 pt-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{r.label}</p>
                <p className="mt-1 text-xs italic text-white/40">{r.need}</p>
                <p className="mt-2 text-base text-white/90">{r.claim}</p>
                <p className="mt-1 font-mono text-[11px] text-white/40">proofs: {r.proofs.join(", ")}</p>
              </div>
            ))}
            <p className="border-t border-white/10 pt-4 text-sm text-white/70">{d.closing.line}</p>
          </div>
          {c.status === "page_draft" && (
            <div className="mt-4 flex gap-3">
              {approveBtn("Approve page copy", { status: "page_approved" })}
              <span className="self-center font-mono text-xs text-white/40">changes: come to chat</span>
            </div>
          )}
        </>
      )}

      {c.appText && c.status !== "page_draft" && (
        <>
          {gate("Gate 2: application text")}
          <div className="max-w-2xl space-y-3">
            {c.appText.variants.map((v, i) => (
              <div key={v.label} className={c.appText?.approvedIndex === i ? "rounded-xl ring-1 ring-white/40" : ""}>
                <CopyBlock label={`${v.label}${c.appText?.approvedIndex === i ? " (approved)" : ""}`} text={v.text} />
                {c.status === "app_text" && (
                  <div className="mt-2">
                    {approveBtn(`Approve "${v.label}"`, { status: "notes", appText: { ...c.appText!, approvedIndex: i } })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {c.notes && (c.status === "notes" || c.status === "build" || c.status === "pages_ready" || c.status === "applied") && (
        <>
          {gate("Gate 3: connection notes")}
          <div className="max-w-2xl space-y-3">
            {c.notes.map((n) => (
              <CopyBlock key={n.persona} label={`${n.persona}${n.target ? `: ${n.target}` : ""}`} text={n.text} />
            ))}
          </div>
          {c.status === "notes" && (
            <div className="mt-4">
              {approveBtn("Approve notes, start build", {
                status: "build",
                notes: c.notes.map((n) => ({ ...n, approved: true })),
              })}
            </div>
          )}
        </>
      )}

      {c.status === "pages_ready" && (
        <>
          {gate("Gate 4: review live page and apply")}
          <div className="flex items-center gap-3">
            <a href={`/${c.slug}`} target="_blank" className="rounded-md border border-white/25 px-3 py-1.5 text-xs hover:bg-white hover:text-black">
              open /{c.slug}
            </a>
            {approveBtn("Mark applied", { status: "applied", applied: { done: true, date: new Date().toISOString().slice(0, 10) } })}
          </div>
        </>
      )}
    </main>
  );
}
```

- [ ] **Step 5: Verify with a full seed file** — extend `pipeline/sample.json` with `research`, `pageDraft` (valid `CompanyPitch`, copy fields from `companies/acme.ts` shape), `appText` with 2 variants, `notes` with 4 personas; walk every gate in the browser: approve page → variants appear → approve variant → notes appear → approve notes → set status `pages_ready` via curl → Gate 4 renders → Mark applied.

- [ ] **Step 6: Lint + commit**

```bash
npm run lint
git add app/pipeline components/pipeline
git commit -m "feat: pipeline company detail with sequential approval gates"
```

---

### Task 5: Logo fetch script

**Files:**
- Create: `scripts/fetch-logo.ts`
- Test: manual (network-dependent)

**Interfaces:**
- Produces: CLI `npx tsx scripts/fetch-logo.ts <slug> <jd-or-company-url> [domain]` → writes `public/logos/<slug>.png` (or `.svg`/`.jpg` by content type, path printed to stdout). Research agents call this and store the printed path in `logo.path`.

- [ ] **Step 1: Implement**

```ts
// scripts/fetch-logo.ts
// Usage: npx tsx scripts/fetch-logo.ts <slug> <page-url> [domain]
// Tries, in order: og:image / logo <img> on the given page, apple-touch-icon
// on the domain homepage, then Google favicon service.
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const [slug, pageUrl, domainArg] = process.argv.slice(2);
if (!slug || !pageUrl) {
  console.error("usage: fetch-logo <slug> <page-url> [domain]");
  process.exit(1);
}

const UA = { "user-agent": "Mozilla/5.0 (logo fetch for job pipeline)" };

async function html(url: string): Promise<string> {
  const res = await fetch(url, { headers: UA, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function extract(re: RegExp, s: string): string | null {
  const m = s.match(re);
  return m ? m[1] : null;
}

function absolute(src: string, base: string): string {
  return new URL(src, base).href;
}

async function candidates(): Promise<string[]> {
  const out: string[] = [];
  try {
    const page = await html(pageUrl);
    for (const re of [
      /<img[^>]+class="[^"]*logo[^"]*"[^>]+src="([^"]+)"/i,
      /<img[^>]+src="([^"]+)"[^>]+class="[^"]*logo[^"]*"/i,
      /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i,
      /<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i,
    ]) {
      const hit = extract(re, page);
      if (hit) out.push(absolute(hit, pageUrl));
    }
  } catch (e) {
    console.error(`jd page failed: ${e}`);
  }
  const domain = domainArg ?? null;
  if (domain) {
    try {
      const home = await html(`https://${domain}`);
      for (const re of [
        /<link[^>]+rel="apple-touch-icon[^"]*"[^>]+href="([^"]+)"/i,
        /<link[^>]+href="([^"]+)"[^>]+rel="apple-touch-icon[^"]*"/i,
      ]) {
        const hit = extract(re, home);
        if (hit) out.push(absolute(hit, `https://${domain}`));
      }
    } catch (e) {
      console.error(`homepage failed: ${e}`);
    }
    out.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`);
  }
  return out;
}

const EXT: Record<string, string> = {
  "image/png": ".png", "image/jpeg": ".jpg", "image/svg+xml": ".svg", "image/webp": ".webp",
};

for (const url of await candidates()) {
  try {
    const res = await fetch(url, { headers: UA, redirect: "follow" });
    if (!res.ok) continue;
    const type = (res.headers.get("content-type") ?? "").split(";")[0];
    const ext = EXT[type];
    if (!ext) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1024) continue; // skip tiny/broken favicons
    mkdirSync(join(process.cwd(), "public", "logos"), { recursive: true });
    const rel = join("public", "logos", `${slug}${ext}`);
    writeFileSync(join(process.cwd(), rel), buf);
    console.log(`/${rel.replace("public/", "logos/")}  (from ${url}, ${buf.length} bytes)`);
    process.exit(0);
  } catch { /* try next candidate */ }
}
console.error("no usable logo found");
process.exit(2);
```

- [ ] **Step 2: Verify** — `npx tsx scripts/fetch-logo.ts mem0 https://mem0.ai mem0.ai` writes a file under `public/logos/` and prints its public path. Open the file to eyeball it.

- [ ] **Step 3: Build check + commit** — `npm run lint && npm run build`, then:

```bash
git add scripts/fetch-logo.ts public/logos
git commit -m "feat: logo fetch script (jd page, homepage icon, favicon fallback)"
```

---

### Task 6: OG image embeds logo when present

**Files:**
- Modify: `app/[company]/opengraph-image.tsx`

**Interfaces:**
- Consumes: `public/logos/<slug>.png|.jpg|.webp` on disk at build time (svg is NOT supported by `ImageResponse` `<img>` reliably; skip `.svg` here).
- Produces: OG card with logo centered above/instead of wordmark; unchanged pill-seal wordmark fallback.

- [ ] **Step 1: Add logo lookup + render**

In `app/[company]/opengraph-image.tsx`, add before the component:

```tsx
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function logoDataUri(slug: string): string | null {
  for (const [ext, mime] of [
    ["png", "image/png"], ["jpg", "image/jpeg"], ["webp", "image/webp"],
  ] as const) {
    const p = join(process.cwd(), "public", "logos", `${slug}.${ext}`);
    if (existsSync(p)) return `data:${mime};base64,${readFileSync(p).toString("base64")}`;
  }
  return null;
}
```

Inside `OgImage`, after `const accent = pitch.accent;` add `const logo = logoDataUri(company);` and replace the wordmark `<div>` with a conditional: when `logo` is set render

```tsx
<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img src={logo} width={200} height={200} style={{ borderRadius: 32, objectFit: "contain" }} alt="" />
  <div style={{ display: "flex", fontSize: 64, fontWeight: 600, color: "#ffffff", letterSpacing: "-0.02em" }}>
    {name}
    <span style={{ color: accent }}>.</span>
  </div>
</div>
```

else keep the existing large-wordmark block exactly as is. Keep the CLASSIFIED stamp and corner marks untouched in both branches.

- [ ] **Step 2: Verify** — with a logo present for one slug (from Task 5), run `npm run dev`, open `localhost:3000/<slug>/opengraph-image`. Expected: logo above a smaller wordmark; a slug with no logo still shows the big wordmark.

- [ ] **Step 3: Build + commit**

```bash
npm run lint && npm run build
git add app/[company]/opengraph-image.tsx
git commit -m "feat: OG card embeds company logo when available"
```

---

### Task 7: Pipeline runbook (the operating procedure)

**Files:**
- Create: `content/pipeline-runbook.md`

**Interfaces:**
- Consumes: everything above. This file is what a future Claude session reads when Sujin says "run the pipeline".

- [ ] **Step 1: Write the runbook** — must contain, concretely:

```markdown
# Pipeline Runbook

Trigger: Sujin says "run the pipeline", optionally pasting job links.

## 0. State check
Read every pipeline/*.json. Report: companies awaiting Sujin at a gate,
companies mid-build, batch capacity (target 5 active, statuses before
"applied"/"rejected").

## 1. Intake
- Pasted links first. Fetch each (WaS and Wellfound JD pages are public;
  LinkedIn best-effort, else ask Sujin to paste JD text).
- Top up to 5 with sourced candidates from: Work at a Startup search, the
  current HN Who's Hiring thread, Greenhouse/Lever/Ashby boards of known
  targets, RemoteOK, WeWorkRemotely, web3.career, cryptocurrencyjobs.co.
- Criteria: US remote-friendly, ~$100k+ base, full-stack / frontend /
  product engineer, plausible alongside Vanta. Crypto-native and dev-tools
  companies first.
- Write each as pipeline/<slug>.json with status "proposed" (pasted links
  may skip straight to "researching": Sujin already chose them).

## 2. Research fan-out (one agent per accepted company, parallel)
Each agent produces, into the state file, moving status to "page_draft":
- research.summary (3-4 sentences), research.hook (genuine, specific)
- research.humans: founder/EM + one team engineer, with URLs
- logo: run `npx tsx scripts/fetch-logo.ts <slug> <jd-url> <domain>`
- pageDraft: a full CompanyPitch (companies/types.ts) obeying CLAUDE.md
  copy rules (claim length, no em dashes, Vanta framing, evidence rules
  memory: vanta-os leads frontend beats, only the 5 strong exhibits)
- appText.variants: 2-3 portal-text variants (different angles, same facts)
- notes: engineer / cto / ceo / recruiter, locked format from CLAUDE.md
- widget concept if the company's product begs one (Mem0-style): add key +
  description to research.widgetConcept AND a mock component registered in
  components/pipeline/mocks/index.tsx
Do not deep-research "proposed" sourced candidates before Sujin accepts.

## 3. Gates (Sujin, on /pipeline)
Gate 1 page copy → Gate 2 app text variant → Gate 3 notes. Changes come
through chat; edit the state file and leave status where it was. Build
waits until every active company passed Gate 3 (batch gate).

## 4. Build (parallel where possible)
Per company: companies/<slug>.ts from pageDraft, register in
companies/index.ts, build approved widget for real (components/pitch),
verify logo/OG. Then `npm run lint && npm run build && npm test`.
Set status "pages_ready".

## 5. Sujin: review live page, apply with approved app text, send notes,
Mark applied on the dashboard. Manual on purpose.
```

- [ ] **Step 2: Commit**

```bash
git add content/pipeline-runbook.md
git commit -m "docs: pipeline runbook"
```

---

## Self-review notes

- Spec coverage: state model (T1), API (T2), board incl. accept/reject + logo check (T3), detail gates incl. widget mocks and copy buttons (T4), logo fetching (T5), OG embedding (T6), sourcing rules + daily flow + agent procedure (T7 runbook). Done-flags: applied via Gate 4 button; per-persona "sent" flags exist in the type, surfacing them in UI deferred (v1 tracks applied only, per "we don't need to track responses").
- Types consistent: `PipelineCompany`, `patchCompany`, `canAdvance` names match across tasks; `pageDraft` is a `CompanyPitch`.
- Dashboard status writes use full-status patches (no server-side canAdvance enforcement in the API; `canAdvance` exists for agents/scripts to respect order — acceptable for a single-user dev tool).
