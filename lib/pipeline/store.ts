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

/** Forward any number of steps, backward for redo, or rejected from anywhere; unknown statuses always fail. */
export function canAdvance(from: PipelineStatus, to: PipelineStatus): boolean {
  if (to === "rejected") return true;
  if (from === "rejected") return to === "proposed";
  const a = STATUS_ORDER.indexOf(from as (typeof STATUS_ORDER)[number]);
  const b = STATUS_ORDER.indexOf(to as (typeof STATUS_ORDER)[number]);
  if (a === -1 || b === -1) return false;
  return true; // any forward or backward move between valid statuses
}
