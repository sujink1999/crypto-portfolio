import {
  pgTable,
  text,
  boolean,
  integer,
  date,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * Pipeline storage (pipeline v2). Real columns for everything the board
 * filters/sorts on; jsonb for the blobs. Row <-> PipelineCompany mapping and
 * zod validation live in store.ts — nothing else touches this table.
 */
export const companies = pgTable("pipeline_companies", {
  slug: text("slug").primaryKey(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull(),
  tier: text("tier"),
  domain: text("domain"),
  jdUrl: text("jd_url"),
  jdText: text("jd_text"),

  sourceChannel: text("source_channel").notNull(),
  sourceUrl: text("source_url"),

  postedDate: date("posted_date"),
  postedPrecision: text("posted_precision").notNull(),
  evergreen: boolean("evergreen").notNull(),
  verifiedLiveAt: date("verified_live_at"),
  postedNote: text("posted_note"),

  compMin: integer("comp_min"),
  compMax: integer("comp_max"),
  compCurrency: text("comp_currency").notNull(),
  compMinUsd: integer("comp_min_usd"),
  compMaxUsd: integer("comp_max_usd"),
  equity: boolean("equity").notNull(),
  sponsorship: boolean("sponsorship"),
  compConfidence: text("comp_confidence").notNull(),
  compNote: text("comp_note"),

  size: text("size"),
  hqCity: text("hq_city"),
  hqCountry: text("hq_country"),

  /** ["US","CA"] or null meaning worldwide */
  hiringCountries: jsonb("hiring_countries").$type<string[] | null>(),
  hiringMode: text("hiring_mode").notNull(),
  timezoneNote: text("timezone_note"),
  usAuthRequired: boolean("us_auth_required"),
  hiringNote: text("hiring_note"),

  priority: jsonb("priority"),
  logo: jsonb("logo"),
  research: jsonb("research"),
  pageDraft: jsonb("page_draft"),
  draft: jsonb("draft"),
  application: jsonb("application"),
  outreach: jsonb("outreach"),
  applied: jsonb("applied"),

  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull(),
});

export type CompanyRow = typeof companies.$inferSelect;
