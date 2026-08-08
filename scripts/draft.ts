/**
 * Scratch pull/push for chat editing of DB drafts (pipeline v2 step 9).
 *
 *   npx dotenv -e .env.local -- npx tsx scripts/draft.ts pull <slug>   DB draft -> pipeline/scratch/<slug>.json
 *   npx dotenv -e .env.local -- npx tsx scripts/draft.ts push <slug>   scratch file -> DB, then delete the file
 *   npx dotenv -e .env.local -- npx tsx scripts/draft.ts list          show open scratch files
 *
 * Hard cap: 3 scratch files at a time; pulling a 4th fails until one is
 * pushed. Push zod-validates through the store layer, so a broken edit fails
 * loudly and the file survives for another round. Scratch dir is inside
 * /pipeline/ which is gitignored.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PIPELINE_DIR } from "../lib/pipeline/dir";
import { readCompany, patchCompany } from "../lib/pipeline/store";
import { DraftCopySchema } from "../lib/pipeline/schema";
import type { PipelineCompany } from "../lib/pipeline/types";

const SCRATCH_DIR = join(PIPELINE_DIR, "scratch");
const CAP = 3;

interface ScratchFile {
  slug: string;
  status: "editing"; // push deletes the file instead of marking it done
  pulledAt: string;
  draft?: PipelineCompany["draft"];
  pageDraft?: PipelineCompany["pageDraft"];
}

function scratchPath(slug: string) {
  return join(SCRATCH_DIR, `${slug}.json`);
}

function openScratch(): string[] {
  if (!existsSync(SCRATCH_DIR)) return [];
  return readdirSync(SCRATCH_DIR).filter((f) => f.endsWith(".json"));
}

async function pull(slug: string) {
  const open = openScratch();
  if (open.includes(`${slug}.json`)) {
    console.error(`scratch file for "${slug}" already open: ${scratchPath(slug)}`);
    process.exit(1);
  }
  if (open.length >= CAP) {
    console.error(`scratch cap reached (${CAP}): ${open.join(", ")} — push one before pulling another`);
    process.exit(1);
  }
  const c = await readCompany(slug);
  if (!c) {
    console.error(`unknown slug "${slug}"`);
    process.exit(1);
  }
  if (!c.draft && !c.pageDraft) {
    console.error(`"${slug}" has no draft or pageDraft to edit`);
    process.exit(1);
  }
  const file: ScratchFile = {
    slug,
    status: "editing",
    pulledAt: new Date().toISOString(),
    ...(c.draft ? { draft: c.draft } : {}),
    ...(c.pageDraft ? { pageDraft: c.pageDraft } : {}),
  };
  mkdirSync(SCRATCH_DIR, { recursive: true });
  writeFileSync(scratchPath(slug), JSON.stringify(file, null, 2) + "\n");
  console.log(`pulled -> ${scratchPath(slug)} (${open.length + 1}/${CAP} open)`);
}

async function push(slug: string) {
  const path = scratchPath(slug);
  if (!existsSync(path)) {
    console.error(`no scratch file for "${slug}" (${path})`);
    process.exit(1);
  }
  const file = JSON.parse(readFileSync(path, "utf8")) as ScratchFile;
  if (file.slug !== slug) {
    console.error(`scratch file slug mismatch: file says "${file.slug}"`);
    process.exit(1);
  }
  const patch: Partial<PipelineCompany> = {};
  if (file.draft) patch.draft = DraftCopySchema.parse(file.draft);
  if (file.pageDraft) patch.pageDraft = file.pageDraft;
  if (Object.keys(patch).length === 0) {
    console.error("scratch file has no draft or pageDraft; nothing to push");
    process.exit(1);
  }
  await patchCompany(slug, patch); // zod-validates the full row; throws on bad data
  rmSync(path);
  console.log(`pushed "${slug}" to DB, scratch file deleted (${openScratch().length}/${CAP} open)`);
}

function list() {
  const open = openScratch();
  if (open.length === 0) {
    console.log("no open scratch files");
    return;
  }
  for (const f of open) {
    const file = JSON.parse(readFileSync(join(SCRATCH_DIR, f), "utf8")) as ScratchFile;
    console.log(`${file.slug}  status=${file.status}  pulled=${file.pulledAt}`);
  }
  console.log(`${open.length}/${CAP} open`);
}

async function main() {
  const [cmd, slug] = process.argv.slice(2);
  if (cmd === "list") return list();
  if ((cmd !== "pull" && cmd !== "push") || !slug) {
    console.error("usage: draft.ts pull <slug> | push <slug> | list");
    process.exit(2);
  }
  if (cmd === "pull") await pull(slug);
  else await push(slug);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
