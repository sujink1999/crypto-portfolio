export type EvidenceId = string;

export interface Evidence {
  id: EvidenceId;
  title: string;
  period: string;
  what: string;
  stack: string[];
  proofPoints: string[];
  /** One big number/fact headlined in the case view (e.g. "TVL $500k → $10M") */
  metric?: string;
  link?: string;
  media?: { kind: "image" | "video"; src: string; alt: string };
  /** Which drawn device frame the project renders inside */
  device?: "laptop" | "phone" | "extension";
}

export interface Requirement {
  /** Short distilled heading for the nav, 2-4 words (e.g. "React / TS / Node") */
  label: string;
  /** The JD bullet, verbatim - shown as subtext under the active label */
  need: string;
  /** Evidence library entries that prove it - first one is the lead */
  proofs: EvidenceId[];
  /** ONE short, loud line answering the requirement - the only big text in the rail */
  claim: string;
  /** For stack-focused requirements: techs to light up on the exhibits' stack tags */
  stackMatch?: string[];
  /** Optional context connecting the proof to their need - not rendered by the current design */
  note?: string;
  loom?: string;
}

export interface CompanyPitch {
  slug: string;
  company: string;
  /** Overrides the name in "Hey X," / "An invitation for X" (e.g. a founder's first name); company still brands the OG card */
  greetName?: string;
  role: string;
  /** Hex color used to theme the page (defaults to site accent) */
  accent?: string;
  /** Greeting gradient start color - the "Hey Company," ramp runs accentFrom → accent (defaults to white) */
  accentFrom?: string;
  /** Short intro paragraphs, story-style, speaking directly to them */
  story: string[];
  /**
   * Opt-in interactive chip rendered under the story lines.
   * "memory" opens the Vanta agent-memory constellation overlay.
   */
  storyWidget?: "memory";
  requirements: Requirement[];
  /** Optional 30/60/90 plan (config-only: not rendered by the current design) */
  plan90?: { phase: string; goal: string; detail: string }[];
  closing: {
    line: string;
    email: string;
    calendarUrl?: string;
    github?: string;
    /** phone number in display form (e.g. "+91 72996 03606") - copied to clipboard */
    whatsapp?: string;
    /** path to the resume PDF (in /public) */
    resumeUrl?: string;
  };
  /** noindex + excluded from sitemaps (default true) */
  unlisted?: boolean;
  /**
   * Per-company tweaks to evidence entries (e.g. stack tags reworded for
   * this reviewer). Merged over the library entry; everything else inherits.
   */
  evidenceOverrides?: Record<EvidenceId, Partial<Evidence>>;
}
