import type { CompanyPitch } from "@/companies/types";

export const STATUS_ORDER = [
  "proposed",
  "researching",
  "page_draft",
  "page_approved",
  "app_text",
  "notes",
  "build",
  "pages_ready",
  "applied",
] as const;

export type PipelineStatus = (typeof STATUS_ORDER)[number] | "rejected";

export type Persona = "engineer" | "cto" | "ceo" | "recruiter";

export interface PersonaNote {
  persona: Persona;
  /** target human, if known (e.g. "Penny, recruiter") */
  target?: string;
  text: string;
  approved: boolean;
  sent: boolean;
}

export interface PipelineCompany {
  slug: string;
  company: string;
  role: string;
  source: string; // "was" | "linkedin" | "wellfound" | "sourced:<board>"
  jdUrl?: string;
  /** display strings for the board card, extracted from the listing */
  salary?: string;
  location?: string;
  /** e.g. "Remote worldwide", "Remote UTC+3", "US hybrid" */
  locationPreference?: string;
  /** when the listing was posted, display form (e.g. "2026-07-01" or "Jul 2026") */
  postedAt?: string;
  jdText?: string;
  domain?: string;
  status: PipelineStatus;
  /**
   * match: clears every screen rule. longshot: breaks a rule (geo wording,
   * stack stretch, seniority band) but worth a swing on profile strength.
   */
  tier?: "match" | "longshot";
  logo?: { sourceUrl: string; path: string; approved: boolean };
  research?: {
    summary: string;
    hook: string;
    humans: { name: string; role: string; url?: string }[];
    widgetConcept?: { key: string; description: string };
  };
  /** Full draft page copy, same shape the build step turns into companies/<slug>.ts */
  pageDraft?: CompanyPitch;
  appText?: { variants: { label: string; text: string }[]; approvedIndex?: number };
  notes?: PersonaNote[];
  applied?: { done: boolean; date?: string };
  updatedAt: string;
}
