/**
 * draft-refs.ts — builds the rolling reference pack for the drafter.
 *
 *   npx dotenv -e .env.local -- npx tsx scripts/draft-refs.ts <size-band>
 *
 * <size-band>: one of 1-10 | 10-30 | 30-50 | 50-100 | 100-500 | 500+
 * Prints JSON: { bucket, register, exact, companies, refs } where refs is the
 * last ~5 APPROVED pages (shipped configs in companies/, ordered by DB
 * updatedAt desc) in the matching register bucket, split per paragraph type.
 * If the bucket is thin (<3 pages) it tops up from the nearest bucket and
 * sets exact=false so the drafter knows no exact-register exemplar exists.
 */
import { readAll } from "../lib/pipeline/store";
import { COMPANIES } from "../companies";
import type { SizeBand } from "../lib/pipeline/schema";

const BUCKETS: Record<string, { name: "tiny" | "startup" | "big"; register: string }> = {
  "1-10": {
    name: "tiny",
    register:
      "INSIGHT register: specific observations about THEIR product and concretely how Sujin can help. Consultant-opener energy, not application energy. Excitement stated plainly.",
  },
  "10-30": {
    name: "startup",
    register:
      "OWNERSHIP register: end-to-end shipping, wearing every hat, carrying features alone from insight to release.",
  },
  "30-50": {
    name: "startup",
    register:
      "OWNERSHIP register: end-to-end shipping, wearing every hat, carrying features alone from insight to release.",
  },
  "50-100": {
    name: "startup",
    register:
      "OWNERSHIP register: end-to-end shipping, wearing every hat, carrying features alone from insight to release.",
  },
  "100-500": {
    name: "big",
    register:
      "EXPERIENCE register: proof of operating at scale, credible senior IC. Capability and judgment over hunger.",
  },
  "500+": {
    name: "big",
    register:
      "EXPERIENCE register: proof of operating at scale, credible senior IC. Capability and judgment over hunger.",
  },
};

const NEAREST: Record<string, string[]> = {
  tiny: ["startup", "big"],
  startup: ["tiny", "big"],
  big: ["startup", "tiny"],
};

async function main() {
  const band = process.argv[2] as SizeBand | undefined;
  if (!band || !BUCKETS[band]) {
    console.error("usage: draft-refs.ts <1-10|10-30|30-50|50-100|100-500|500+>");
    process.exit(2);
  }
  const bucket = BUCKETS[band];

  const rows = await readAll();
  // Approved = a shipped config exists in companies/. Order by DB recency.
  const shipped = rows
    .filter((r) => COMPANIES[r.slug])
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .map((r) => ({
      slug: r.slug,
      bucket: r.size ? BUCKETS[r.size]?.name ?? null : null,
      updatedAt: r.updatedAt,
    }));

  let picks = shipped.filter((s) => s.bucket === bucket.name).slice(0, 5);
  let exact = picks.length >= 3;
  if (picks.length < 3) {
    for (const nb of NEAREST[bucket.name]) {
      if (picks.length >= 5) break;
      picks = picks.concat(
        shipped.filter((s) => s.bucket === nb && !picks.some((p) => p.slug === s.slug)),
      );
    }
    // Unknown-size shipped pages last, so an empty DB-size backfill still yields refs.
    picks = picks.concat(
      shipped.filter((s) => s.bucket === null && !picks.some((p) => p.slug === s.slug)),
    );
    picks = picks.slice(0, 5);
  }

  const refs = picks.map(({ slug }) => {
    const p = COMPANIES[slug];
    return {
      slug,
      company: p.company,
      beat1: p.story?.[0] ?? null,
      beat2: p.story?.[1] ?? null,
      beat3: p.story?.[2] ?? null,
      claims: (p.requirements ?? []).map((r) => r.claim),
      closing: p.closing?.line ?? null,
    };
  });

  console.log(
    JSON.stringify(
      { band, bucket: bucket.name, register: bucket.register, exact, companies: picks.map((p) => p.slug), refs },
      null,
      2,
    ),
  );
}

main();
