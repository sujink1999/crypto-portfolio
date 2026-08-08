/**
 * Validate pipeline/<slug>.json STAGING FILES against the v2 schema. This is
 * the pre-import check in the scout flow (file -> validate -> import); it never
 * reads the DB. Live rows are validated on every store.ts write; do not use
 * this script to audit live state.
 *
 *   npx tsx scripts/validate-pipeline.ts <slug>   validate one staging file
 *   npx tsx scripts/validate-pipeline.ts --all    validate every file in pipeline/
 *
 * Exit 0 = valid. Non-zero prints exact field-level errors so a scout/normalizer
 * agent can self-correct and re-run.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { PipelineCompanySchema, USD_RATE } from "../lib/pipeline/schema";
import { PIPELINE_DIR } from "../lib/pipeline/dir";

function validateFile(path: string): string[] {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    return [`not valid JSON: ${(e as Error).message}`];
  }
  const result = PipelineCompanySchema.safeParse(raw);
  const errors = result.success
    ? []
    : result.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`);

  // Cross-field sanity beyond zod refinements
  if (result.success) {
    const c = result.data;
    for (const [side, orig, usd] of [
      ["min", c.compensation.min, c.compensation.minUsd],
      ["max", c.compensation.max, c.compensation.maxUsd],
    ] as const) {
      if (orig !== null && usd !== null) {
        const expected = orig * USD_RATE[c.compensation.currency];
        if (usd < expected * 0.7 || usd > expected * 1.3) {
          errors.push(
            `compensation.${side}Usd: ${usd} is not a plausible USD conversion of ${orig} ${c.compensation.currency} (expected ~${Math.round(expected)})`,
          );
        }
      }
    }
    if (c.posted.precision === "day" && c.posted.date === null)
      errors.push(`posted.date: null but precision is "day"`);
    if (c.posted.date !== null && c.posted.precision === "unknown")
      errors.push(`posted.precision: "unknown" but a date is set; use "day" or "month"`);
  }
  return errors;
}

const arg = process.argv[2];
if (!arg) {
  console.error("usage: validate-pipeline.ts <slug> | --all");
  process.exit(2);
}

const files =
  arg === "--all"
    ? readdirSync(PIPELINE_DIR).filter((f) => f.endsWith(".json")).map((f) => join(PIPELINE_DIR, f))
    : [join(PIPELINE_DIR, `${arg}.json`)];

let failed = 0;
for (const file of files) {
  if (!existsSync(file)) {
    console.error(`MISSING ${file}`);
    failed++;
    continue;
  }
  const errors = validateFile(file);
  const name = file.split("/").pop();
  if (errors.length === 0) {
    console.log(`OK    ${name}`);
  } else {
    failed++;
    console.error(`FAIL  ${name}`);
    for (const e of errors) console.error(`      - ${e}`);
  }
}
if (failed > 0) {
  console.error(`\n${failed}/${files.length} file(s) invalid`);
  process.exit(1);
}
