import { z } from "zod";

/**
 * Structured pipeline schema (pipeline v2, plans/pipeline-v2.md).
 * Zod is the source of truth; types.ts re-exports the inferred types.
 * Free prose lives ONLY in `note` fields; everything else is sortable data.
 */

/** ISO 3166-1 alpha-2. Fixed list: normalizers must pick from it (extend here if a country is genuinely missing). */
export const COUNTRY_CODES = [
  "AE", "AR", "AT", "AU", "BE", "BG", "BR", "CA", "CH", "CL", "CO", "CR", "CY",
  "CZ", "DE", "DK", "EE", "EG", "ES", "FI", "FR", "GB", "GE", "GR", "HK", "HR",
  "HU", "ID", "IE", "IL", "IN", "IS", "IT", "JP", "KE", "KR", "LT", "LU", "LV",
  "MT", "MX", "MY", "NG", "NL", "NO", "NZ", "PE", "PH", "PK", "PL", "PT", "RO",
  "RS", "SA", "SE", "SG", "SI", "SK", "TH", "TR", "TW", "UA", "US", "UY", "VN",
  "ZA",
] as const;
export const CountryCodeSchema = z.enum(COUNTRY_CODES);
export type CountryCode = z.infer<typeof CountryCodeSchema>;

export const SOURCE_CHANNELS = [
  "was",          // Work at a Startup
  "hn",           // HN Who is hiring
  "ashby",
  "greenhouse",
  "lever",
  "workable",
  "remoteok",
  "wwr",          // We Work Remotely
  "wellfound",
  "linkedin",
  "web3career",
  "cryptojobs",   // cryptocurrencyjobs.co
  "company-site",
  "pasted",       // Sujin pasted the link himself
  "other",
] as const;
export const SourceChannelSchema = z.enum(SOURCE_CHANNELS);
export type SourceChannel = z.infer<typeof SourceChannelSchema>;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD")
  .refine((s) => !Number.isNaN(Date.parse(s)), "not a real calendar date");

export const PostedSchema = z.object({
  /** Listing publish date. null when genuinely unknown (precision then "unknown"). */
  date: isoDate.nullable(),
  precision: z.enum(["day", "month", "unknown"]),
  /** Kept-open-forever listing; freshness scoring treats these separately. */
  evergreen: z.boolean(),
  /** Last date the listing was confirmed still live. */
  verifiedLiveAt: isoDate.nullable(),
  note: z.string().optional(),
});
export type Posted = z.infer<typeof PostedSchema>;

/** ISO 4217 currency the listing quotes. */
export const CurrencySchema = z.enum(["USD", "EUR", "GBP", "SGD", "CHF", "CAD", "AUD", "INR", "JPY", "AED"]);

export const CompensationSchema = z
  .object({
    /** Annual base band in the original currency. null when not listed. */
    min: z.number().positive().nullable(),
    max: z.number().positive().nullable(),
    currency: CurrencySchema,
    /** Derived at normalization time; rough FX is fine, used only for sort/filter. */
    minUsd: z.number().positive().nullable(),
    maxUsd: z.number().positive().nullable(),
    equity: z.boolean(),
    /** null = unknown */
    sponsorship: z.boolean().nullable(),
    confidence: z.enum(["published", "third_party", "estimated", "unknown"]),
    /** Original listing text, third-party caveats, equity ranges, etc. */
    note: z.string().optional(),
  })
  .refine((c) => c.min === null || c.max === null || c.min <= c.max, "min > max")
  .refine(
    (c) => (c.min === null) === (c.minUsd === null) && (c.max === null) === (c.maxUsd === null),
    "usd fields must be derived whenever original amounts exist",
  );
export type Compensation = z.infer<typeof CompensationSchema>;

/** Where the company sits. Informational only, never filtered on. */
export const HqSchema = z.object({
  city: z.string().optional(),
  country: CountryCodeSchema.optional(),
});
export type Hq = z.infer<typeof HqSchema>;

/** Where they will actually hire from. THE filterable eligibility field. */
export const HiringSchema = z.object({
  countries: z.union([z.literal("worldwide"), z.array(CountryCodeSchema).min(1)]),
  mode: z.enum(["remote", "hybrid", "onsite"]),
  /** e.g. "reasonable overlap with US Pacific; async considered" */
  timezoneNote: z.string().optional(),
  usAuthRequired: z.boolean().nullable(),
  note: z.string().optional(),
});
export type Hiring = z.infer<typeof HiringSchema>;

/** Headcount band; small bands = startup targets. */
export const SIZE_BANDS = ["1-10", "10-30", "30-50", "50-100", "100-500", "500+"] as const;
export const SizeBandSchema = z.enum(SIZE_BANDS);
export type SizeBand = z.infer<typeof SizeBandSchema>;

export const SourceSchema = z.object({
  channel: SourceChannelSchema,
  /** Board/listing URL when distinct from jdUrl (e.g. the HN comment). */
  url: z.string().url().optional(),
});
export type Source = z.infer<typeof SourceSchema>;

export const PrioritySchema = z.object({
  level: z.enum(["high", "medium", "low"]),
  reason: z.string(),
  /** 1-10 across all proposed candidates; only the top 10 carry one. */
  rank: z.number().int().min(1).max(10).optional(),
});

export const STATUS_ORDER = [
  "proposed",
  "researching",
  "page_draft",
  "build",
  "pages_ready",
  "outreach",
  "applied",
] as const;
export const StatusSchema = z.enum([...STATUS_ORDER, "rejected"]);
export type PipelineStatus = z.infer<typeof StatusSchema>;

/** Research is agent-gathered prose + structured extras; keep permissive but typed where stable. */
export const ResearchSchema = z
  .object({
    summary: z.string(),
    /** Legacy v1 field (hook concept removed 2026-07-31); tolerated on old rows, never written or shown. */
    hook: z.string().optional(),
    companyLinkedIn: z.string().optional(),
    humans: z.array(z.object({ name: z.string(), role: z.string(), url: z.string().optional() })),
    widgetConcept: z.object({ key: z.string(), description: z.string() }).optional(),
  })
  .passthrough(); // agents attach extras (mustHaves, accent, formQuestions, ...)

/** A real question extracted from the company's application portal. */
export const ApplicationQuestionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(["short", "long", "select", "file", "checkbox"]),
  options: z.array(z.string()).optional(),
  required: z.boolean(),
  /** One Fable-written answer (forms want one good answer, not variants). */
  draft: z.string().nullable(),
  status: z.enum(["pending", "drafted", "approved", "submitted"]),
});
export const ApplicationSchema = z.object({
  formUrl: z.string().url(),
  fetchedAt: z.string(),
  questions: z.array(ApplicationQuestionSchema),
});
export type Application = z.infer<typeof ApplicationSchema>;

/** A human worth messaging; harvested locally (extension) or from research. */
export const OutreachTargetSchema = z.object({
  name: z.string(),
  role: z.string(),
  url: z.string().url(),
  /** senior: CEO/founder/recruiter note; peer: engineer note; null: bare connect, no note. */
  noteKind: z.enum(["senior", "peer"]).nullable(),
  status: z.enum(["to_send", "sent", "replied", "connected"]),
  sentAt: z.string().optional(),
  /** One line of evidence this person matters for THIS req (e.g. "posted the listing", "hiring in headline"). Harvesters must fill it; UI shows it so Sujin can judge the pick. */
  signal: z.string().optional(),
});
export type OutreachTarget = z.infer<typeof OutreachTargetSchema>;

/**
 * Drafter output awaiting Sujin's review on the detail page: ONE version per
 * section, written to be the strongest fit for THIS application. (The
 * 3-variants-per-section system was removed 2026-08-08: variant pressure made
 * the drafter differentiate by rotating projects instead of optimizing copy.)
 */
export const DraftCopySchema = z.object({
  register: z.enum(["tiny", "startup", "big"]),
  /** One line per story beat. */
  story: z.array(z.string()),
  claims: z.array(z.object({ label: z.string(), need: z.string(), text: z.string() })),
  /** Condensed verifier findings shown alongside the draft. */
  verifierNotes: z.string().optional(),
  generatedAt: z.string(),
});
export type DraftCopy = z.infer<typeof DraftCopySchema>;

/**
 * Loose runtime shape for pageDraft (CompanyPitch). Full typing happens at
 * build time in companies/<slug>.ts; this guard exists so a hand-edited
 * scratch push or bad agent write cannot land junk that crashes the board.
 * Passthrough: extra CompanyPitch fields (accent, storyWidget, ...) survive.
 */
export const PageDraftSchema = z
  .object({
    slug: z.string(),
    company: z.string(),
    role: z.string(),
    story: z.array(z.string()),
    requirements: z.array(
      z
        .object({
          label: z.string(),
          need: z.string(),
          proofs: z.array(z.string()),
          claim: z.string(),
        })
        .passthrough(),
    ),
    closing: z.object({ line: z.string(), email: z.string() }).passthrough(),
  })
  .passthrough();

export const PipelineCompanySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  company: z.string().min(1),
  role: z.string().min(1),
  source: SourceSchema,
  jdUrl: z.string().url().optional(),
  jdText: z.string().optional(),
  domain: z.string().optional(),
  posted: PostedSchema,
  compensation: CompensationSchema,
  hq: HqSchema,
  /** Company headcount band (from LinkedIn/research); null = unknown. */
  size: SizeBandSchema.nullable().optional(),
  hiring: HiringSchema,
  status: StatusSchema,
  tier: z.enum(["match", "longshot"]).optional(),
  priority: PrioritySchema.optional(),
  logo: z.object({ sourceUrl: z.string(), path: z.string(), approved: z.boolean() }).optional(),
  research: ResearchSchema.optional(),
  /** Full draft page copy; CompanyPitch-shaped. Loose runtime guard here, full TS typing at build time. */
  pageDraft: PageDraftSchema.optional(),
  /** Drafter copy awaiting review; cleared when pageDraft is assembled. */
  draft: DraftCopySchema.optional(),
  application: ApplicationSchema.optional(),
  outreach: z.array(OutreachTargetSchema).optional(),
  applied: z.object({ done: z.boolean(), date: isoDate.optional() }).optional(),
  updatedAt: z.string(),
});
export type PipelineCompany = z.infer<typeof PipelineCompanySchema>;

/** Rough FX to USD for sort/filter only (plan: hardcoded table is acceptable). */
export const USD_RATE: Record<z.infer<typeof CurrencySchema>, number> = {
  USD: 1,
  EUR: 1.1,
  GBP: 1.3,
  SGD: 0.75,
  CHF: 1.15,
  CAD: 0.73,
  AUD: 0.66,
  INR: 0.012,
  JPY: 0.0065,
  AED: 0.27,
};
