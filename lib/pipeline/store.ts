import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { companies, type CompanyRow } from "./db/schema";
import { PipelineCompanySchema, STATUS_ORDER } from "./schema";
import type { PipelineCompany, PipelineStatus } from "./types";

/**
 * Single access layer for pipeline state (Neon Postgres). Everything —
 * board, API routes, scripts, agents — goes through these functions.
 * Writes are zod-validated; malformed data fails loudly.
 */

function toRow(c: PipelineCompany): typeof companies.$inferInsert {
  return {
    slug: c.slug,
    company: c.company,
    role: c.role,
    status: c.status,
    tier: c.tier ?? null,
    domain: c.domain ?? null,
    jdUrl: c.jdUrl ?? null,
    jdText: c.jdText ?? null,
    sourceChannel: c.source.channel,
    sourceUrl: c.source.url ?? null,
    postedDate: c.posted.date,
    postedPrecision: c.posted.precision,
    evergreen: c.posted.evergreen,
    verifiedLiveAt: c.posted.verifiedLiveAt,
    postedNote: c.posted.note ?? null,
    compMin: c.compensation.min === null ? null : Math.round(c.compensation.min),
    compMax: c.compensation.max === null ? null : Math.round(c.compensation.max),
    compCurrency: c.compensation.currency,
    compMinUsd: c.compensation.minUsd === null ? null : Math.round(c.compensation.minUsd),
    compMaxUsd: c.compensation.maxUsd === null ? null : Math.round(c.compensation.maxUsd),
    equity: c.compensation.equity,
    sponsorship: c.compensation.sponsorship,
    compConfidence: c.compensation.confidence,
    compNote: c.compensation.note ?? null,
    size: c.size ?? null,
    hqCity: c.hq.city ?? null,
    hqCountry: c.hq.country ?? null,
    hiringCountries: c.hiring.countries === "worldwide" ? null : c.hiring.countries,
    hiringMode: c.hiring.mode,
    timezoneNote: c.hiring.timezoneNote ?? null,
    usAuthRequired: c.hiring.usAuthRequired,
    hiringNote: c.hiring.note ?? null,
    priority: c.priority ?? null,
    logo: c.logo ?? null,
    research: c.research ?? null,
    pageDraft: c.pageDraft ?? null,
    draft: c.draft ?? null,
    application: c.application ?? null,
    outreach: c.outreach ?? null,
    applied: c.applied ?? null,
    updatedAt: c.updatedAt,
  };
}

function fromRow(r: CompanyRow): PipelineCompany {
  const c = {
    slug: r.slug,
    company: r.company,
    role: r.role,
    status: r.status,
    tier: r.tier ?? undefined,
    domain: r.domain ?? undefined,
    jdUrl: r.jdUrl ?? undefined,
    jdText: r.jdText ?? undefined,
    source: { channel: r.sourceChannel, url: r.sourceUrl ?? undefined },
    posted: {
      date: r.postedDate,
      precision: r.postedPrecision,
      evergreen: r.evergreen,
      verifiedLiveAt: r.verifiedLiveAt,
      note: r.postedNote ?? undefined,
    },
    compensation: {
      min: r.compMin,
      max: r.compMax,
      currency: r.compCurrency,
      minUsd: r.compMinUsd,
      maxUsd: r.compMaxUsd,
      equity: r.equity,
      sponsorship: r.sponsorship,
      confidence: r.compConfidence,
      note: r.compNote ?? undefined,
    },
    hq: { city: r.hqCity ?? undefined, country: r.hqCountry ?? undefined },
    size: r.size ?? null,
    hiring: {
      countries: r.hiringCountries === null ? "worldwide" : r.hiringCountries,
      mode: r.hiringMode,
      timezoneNote: r.timezoneNote ?? undefined,
      usAuthRequired: r.usAuthRequired,
      note: r.hiringNote ?? undefined,
    },
    priority: r.priority ?? undefined,
    logo: r.logo ?? undefined,
    research: r.research ?? undefined,
    pageDraft: r.pageDraft ?? undefined,
    draft: r.draft ?? undefined,
    application: r.application ?? undefined,
    outreach: r.outreach ?? undefined,
    applied: r.applied ?? undefined,
    updatedAt: r.updatedAt,
  };
  return PipelineCompanySchema.parse(c) as PipelineCompany;
}

/** One malformed row must not take down the whole board: skip it loudly instead of throwing. */
export async function readAll(): Promise<PipelineCompany[]> {
  const rows = await getDb().select().from(companies).orderBy(companies.slug);
  const out: PipelineCompany[] = [];
  for (const r of rows) {
    try {
      out.push(fromRow(r));
    } catch (e) {
      console.error(`pipeline: skipping malformed row "${r.slug}":`, e instanceof Error ? e.message : e);
    }
  }
  return out;
}

export async function readCompany(slug: string): Promise<PipelineCompany | null> {
  const rows = await getDb().select().from(companies).where(eq(companies.slug, slug));
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function writeCompany(
  company: PipelineCompany,
  opts: { log?: boolean } = {},
): Promise<void> {
  const valid = PipelineCompanySchema.parse(company) as PipelineCompany;
  const row = toRow(valid);
  await getDb()
    .insert(companies)
    .values(row)
    .onConflictDoUpdate({ target: companies.slug, set: row });
  if (opts.log !== false) logChange(valid.slug, ["upsert"]);
}

export async function patchCompany(
  slug: string,
  patch: Partial<PipelineCompany>,
): Promise<PipelineCompany> {
  const existing = await readCompany(slug);
  if (!existing) throw new Error(`pipeline: unknown slug "${slug}"`);
  const next = { ...existing, ...patch, slug, updatedAt: new Date().toISOString() };
  await writeCompany(next as PipelineCompany, { log: false });
  logChange(slug, Object.keys(patch));
  return next as PipelineCompany;
}

/** Remove a row entirely (dedupe merges). Deliberate API: agents should not reach into drizzle. */
export async function deleteCompany(slug: string): Promise<void> {
  await getDb().delete(companies).where(eq(companies.slug, slug));
  logChange(slug, ["delete"]);
}

/**
 * Local change log (pipeline/dblog.jsonl): one line per DB mutation so a chat
 * session can see what changed on the board without polling the DB. Local runs
 * only; on Vercel (no writable repo dir) this silently no-ops.
 */
function logChange(slug: string, keys: string[]): void {
  if (process.env.VERCEL) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { appendFileSync } = require("node:fs") as typeof import("node:fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { join } = require("node:path") as typeof import("node:path");
    const line = JSON.stringify({ ts: new Date().toISOString(), slug, keys });
    appendFileSync(join(process.cwd(), "pipeline", "dblog.jsonl"), line + "\n");
  } catch {
    // best-effort; never block a DB write on the log
  }
}

/**
 * Any move between two valid statuses is allowed, forward or backward, in one
 * jump (deliberate: redos and corrections happen). "rejected" is reachable from
 * anywhere; leaving it goes back to "proposed". Unknown statuses always fail.
 * There is NO adjacency guard - a typo'd status lands wherever it says.
 */
export function canAdvance(from: PipelineStatus, to: PipelineStatus): boolean {
  if (to === "rejected") return true;
  if (from === "rejected") return to === "proposed";
  const a = STATUS_ORDER.indexOf(from as (typeof STATUS_ORDER)[number]);
  const b = STATUS_ORDER.indexOf(to as (typeof STATUS_ORDER)[number]);
  if (a === -1 || b === -1) return false;
  return true; // any forward or backward move between valid statuses
}
