import { brickbookDraft } from "./brickbook";
import { parlorDraft } from "./parlor";
import { meridianDraft } from "./meridian";

/**
 * Drafter-lab output: drafts written by the drafter agent against imaginary
 * companies, one file per slug. Reviewed on /scripter-lab, never shipped.
 * ONE version per beat/claim (the variant system was removed 2026-08-08); the
 * three pre-removal lab files still store variants and are collapsed to their
 * first variant here. New lab entries use the single-version shape directly.
 */
export interface LabDraft {
  slug: string;
  company: string;
  role: string;
  /** size band, e.g. "1-10" */
  size: string;
  register: "tiny" | "startup" | "big";
  jdSummary: string;
  /** one line per story beat */
  story: string[];
  claims: { label: string; need: string; text: string }[];
}

/** Pre-2026-08-08 lab shape (variant era); kept only to type the old files. */
interface OldVariant {
  angle: string;
  text: string;
}
export interface OldLabDraft extends Omit<LabDraft, "story" | "claims"> {
  story: OldVariant[][];
  claims: { label: string; need: string; variants: OldVariant[] }[];
}

function collapse(d: OldLabDraft): LabDraft {
  return {
    ...d,
    story: d.story.map((variants) => variants[0].text),
    claims: d.claims.map((c) => ({ label: c.label, need: c.need, text: c.variants[0].text })),
  };
}

const oldDrafts: OldLabDraft[] = [brickbookDraft, parlorDraft, meridianDraft];
export const LAB_DRAFTS: LabDraft[] = oldDrafts.map(collapse);
