/**
 * Import pipeline/<slug>.json files (v2 schema) into Neon.
 *
 *   npx dotenv -e .env.local -- npx tsx scripts/import-pipeline.ts            import NEW slugs only
 *   npx dotenv -e .env.local -- npx tsx scripts/import-pipeline.ts <slug>...  import specific slugs (upsert)
 *
 * Default mode SKIPS slugs already in the DB: the DB is the source of truth
 * and old JSON files are a migration archive that must never clobber live
 * state (statuses, outreach check-offs). Scouts import their new finds either
 * by naming the slugs or via the new-only default.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { PIPELINE_DIR } from "../lib/pipeline/dir";
import { readAll, writeCompany } from "../lib/pipeline/store";
import { PipelineCompanySchema } from "../lib/pipeline/schema";
import type { PipelineCompany } from "../lib/pipeline/types";

async function main() {
  const args = process.argv.slice(2);
  const existing = new Set((await readAll()).map((c) => c.slug));

  let files: string[];
  if (args.length > 0) {
    files = args.map((slug) => {
      const f = join(PIPELINE_DIR, `${slug}.json`);
      if (!existsSync(f)) {
        console.error(`MISSING ${f}`);
        process.exit(1);
      }
      return f;
    });
  } else {
    files = readdirSync(PIPELINE_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => join(PIPELINE_DIR, f));
  }

  let imported = 0;
  let skipped = 0;
  for (const file of files) {
    const data = JSON.parse(readFileSync(file, "utf8"));
    const company = PipelineCompanySchema.parse(data) as PipelineCompany;
    const explicit = args.includes(company.slug);
    if (!explicit && existing.has(company.slug)) {
      skipped++;
      continue;
    }
    await writeCompany(company);
    imported++;
    console.log(`imported ${company.slug}`);
  }
  console.log(`\n${imported} imported, ${skipped} skipped (already in DB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
