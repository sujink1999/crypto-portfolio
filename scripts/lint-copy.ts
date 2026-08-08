/**
 * Mechanical copy linter (pipeline v2). Enforces every string-checkable rule
 * from CLAUDE.md / copy-corpus so drafts self-correct before any human review.
 *
 *   npx dotenv -e .env.local -- npx tsx scripts/lint-copy.ts <slug>
 *       lint the DB row's draft + pageDraft copy
 *   npx tsx scripts/lint-copy.ts --text "..."    lint a raw string (quick check, no DB)
 *
 * Exit 0 = clean. Errors print with exact location so a drafter agent can fix
 * the failing paragraph and re-run. Warnings do not fail the run.
 */
import { readCompany } from "../lib/pipeline/store";

const EVIDENCE_WHITELIST = new Set(["vanta-os", "beans", "keom", "society-mobile", "mudrex"]);

interface Finding {
  where: string;
  rule: string;
  message: string;
  level: "error" | "warn";
}
const findings: Finding[] = [];
const report = (level: Finding["level"], where: string, rule: string, message: string) =>
  findings.push({ where, rule, message, level });

function lintText(where: string, text: string, opts: { claim?: boolean } = {}) {
  if (text.includes("—"))
    report("error", where, "em-dash", `em dash found: "...${excerpt(text, "—")}..." — restructure into separate sentences or use a comma/colon`);
  if (/\s-\s/.test(text) || text.includes("–"))
    report("error", where, "hyphen-punctuation", `hyphen used as punctuation: "...${excerpt(text, /\s-\s|–/)}..." — banned, rewrite`);

  // Verdict-tail: an observation followed by a self-referential verdict sentence.
  const verdictTail = /(?:^|[.!?]\s+)(That(?:'s| is| was)\s(?:how|the|what|why|where|my|exactly)\s[^.!?]*[.!?])/m.exec(text);
  if (verdictTail)
    report("error", where, "verdict-tail", `banned verdict-tail sentence: "${verdictTail[1].trim()}" — state the fact and stop, or fold the stance into the same sentence`);

  // Repo internals as evidence
  if (/\b\d+\s+(?:of\s+\d+\s+)?commits?\b/i.test(text))
    report("error", where, "repo-internals", "commit counts are banned as evidence; use product outcomes");
  if (/\bPR\s*#?\d+\b/.test(text))
    report("error", where, "repo-internals", "PR numbers are banned as evidence");
  if (/\bphased\s+rollouts?\b/i.test(text))
    report("error", where, "repo-internals", "phased-rollout counts are banned as evidence");
  if (/\b\d+\s+(?:unit\s+|integration\s+)?tests?\s+(?:pass|passing|written)\b/i.test(text))
    report("error", where, "repo-internals", "test counts are banned as evidence");

  // Vanta framing
  if (/\b(?:I['’]?m|I am)\s+(?:a\s+)?co-?founder\b/i.test(text))
    report("error", where, "vanta-present-tense", `present-tense founder framing: say "I co-founded Vanta", never "I'm a co-founder"`);

  if (opts.claim) {
    const words = text.replace(/\*\*/g, "").trim().split(/\s+/).filter(Boolean).length;
    if (words < 12 || words > 24)
      report("error", where, "claim-length", `claim is ${words} words; target ~15-22 (hard band 12-24)`);
    else if (words < 15 || words > 22)
      report("warn", where, "claim-length", `claim is ${words} words; target ~15-22`);
    if (!/\d|Vanta|Mudrex|Beans|Keom|0VIX|Society/i.test(text))
      report("warn", where, "claim-facts", "claim carries no number or named project; claims must hold 1-2 concrete facts");
  }
}

function excerpt(text: string, needle: string | RegExp): string {
  const idx = typeof needle === "string" ? text.indexOf(needle) : (text.search(needle) ?? -1);
  if (idx < 0) return "";
  return text.slice(Math.max(0, idx - 25), idx + 25).replace(/\n/g, " ");
}

async function lintCompany(slug: string) {
  const c = await readCompany(slug);
  if (!c) {
    console.error(`unknown slug "${slug}" (DB row required; archive JSONs are no longer linted)`);
    process.exit(2);
  }

  const dv = c.draft;
  if (dv) {
    dv.story.forEach((line, beat) => lintText(`draft.story[${beat}]`, line));
    dv.claims.forEach((claim, ci) =>
      lintText(`draft.claims[${ci}] (${claim.label})`, claim.text, { claim: true }),
    );
  }

  const pd = c.pageDraft as {
    story?: string[];
    requirements?: { claim?: string; proofs?: string[]; label?: string }[];
    closing?: { line?: string };
  } | undefined;
  if (pd) {
    (pd.story ?? []).forEach((s: string, i: number) => lintText(`pageDraft.story[${i}]`, s));
    (pd.requirements ?? []).forEach((r: { claim?: string; proofs?: string[]; label?: string }, i: number) => {
      if (r.claim) lintText(`pageDraft.requirements[${i}].claim (${r.label ?? "?"})`, r.claim, { claim: true });
      (r.proofs ?? []).forEach((p) => {
        if (!EVIDENCE_WHITELIST.has(p))
          report("error", `pageDraft.requirements[${i}].proofs`, "evidence-whitelist", `"${p}" is not a registered exhibit; allowed: ${[...EVIDENCE_WHITELIST].join(", ")}`);
      });
    });
    if (pd.closing?.line) lintText("pageDraft.closing.line", pd.closing.line);
  }
  if (!dv && !pd) console.log("(no copy fields present; nothing to lint)");
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error(`usage: lint-copy.ts <slug> | --text "..." | --claim "..."`);
    process.exit(2);
  }
  if (arg === "--text") lintText("text", process.argv[3] ?? "", { claim: false });
  else if (arg === "--claim") lintText("claim", process.argv[3] ?? "", { claim: true });
  else await lintCompany(arg);

  for (const f of findings)
  console[f.level === "error" ? "error" : "log"](
      `${f.level.toUpperCase().padEnd(5)} [${f.rule}] ${f.where}: ${f.message}`,
    );

  const errors = findings.filter((f) => f.level === "error").length;
  if (errors > 0) {
    console.error(`\n${errors} error(s), ${findings.length - errors} warning(s)`);
    process.exit(1);
  }
  console.log(`clean (${findings.length} warning(s))`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
