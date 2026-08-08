/**
 * One-off migration (2026-08-08): variant system removed.
 * 1. Renames column draft_variants -> draft (skips if already renamed).
 * 2. Collapses each variant-shaped draft to a single version, keeping Sujin's
 *    selected variant where one was picked, else the first.
 *
 *   npx dotenv -e .env.local -- npx tsx scripts/migrate-draft-single.ts
 */
import { neon } from "@neondatabase/serverless";

interface OldVariant { angle: string; text: string }
interface OldDraft {
  register: string;
  story: OldVariant[][];
  claims: { label: string; need: string; variants: OldVariant[] }[];
  selected?: { story: number[]; claims: number[] };
  verifierNotes?: string;
  generatedAt: string;
}

async function main() {
  const q = neon(process.env.DATABASE_URL!);

  const cols = await q`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'pipeline_companies' AND column_name IN ('draft_variants', 'draft')`;
  const names = cols.map((c) => c.column_name as string);
  if (names.includes("draft_variants")) {
    await q`ALTER TABLE pipeline_companies RENAME COLUMN draft_variants TO draft`;
    console.log("renamed draft_variants -> draft");
  } else if (names.includes("draft")) {
    console.log("column already renamed");
  } else {
    throw new Error("neither draft_variants nor draft column found");
  }

  const rows = await q`SELECT slug, draft FROM pipeline_companies WHERE draft IS NOT NULL`;
  const pick = (arr: OldVariant[], sel: number | undefined) =>
    arr[sel !== undefined && sel >= 0 && sel < arr.length ? sel : 0].text;

  for (const r of rows) {
    const old = r.draft as OldDraft;
    const isOldShape = Array.isArray(old.story?.[0]) && typeof old.story[0][0]?.text === "string";
    if (!isOldShape) {
      console.log(`${r.slug}: already single-version, skip`);
      continue;
    }
    const next = {
      register: old.register,
      story: old.story.map((variants, i) => pick(variants, old.selected?.story?.[i])),
      claims: old.claims.map((c, i) => ({
        label: c.label,
        need: c.need,
        text: pick(c.variants, old.selected?.claims?.[i]),
      })),
      ...(old.verifierNotes ? { verifierNotes: old.verifierNotes } : {}),
      generatedAt: old.generatedAt,
    };
    await q`UPDATE pipeline_companies SET draft = ${JSON.stringify(next)}::jsonb WHERE slug = ${r.slug}`;
    console.log(`${r.slug}: migrated (${next.story.length} beats, ${next.claims.length} claims)`);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
