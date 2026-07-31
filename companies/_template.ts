import type { CompanyPitch } from "./types";

/**
 * Copy this file to companies/<slug>.ts, fill the TODOs (~25 min),
 * then register it in companies/index.ts. Evidence ids come from
 * companies/evidence.ts - add a new entry there if nothing fits.
 */
export const template: CompanyPitch = {
  slug: "TODO-company-slug",
  company: "TODO Company",
  role: "TODO Role title from the JD",
  accent: "#4ade80", // TODO their brand color
  story: [
    "TODO 2-3 short paragraphs. Speak to the reviewer directly: what about their product/JD caught you, and why this page exists.",
  ],
  requirements: [
    {
      label: "TODO 2-4 word heading",
      need: "TODO paste the JD bullet",
      proofs: ["beans"],
      claim: "TODO one short loud line answering this requirement.",
      note: "TODO 1-2 sentences: exactly how this work proves that requirement.",
    },
  ],
  plan90: [
    { phase: "Days 1–30", goal: "TODO", detail: "TODO" },
    { phase: "Days 31–60", goal: "TODO", detail: "TODO" },
    { phase: "Days 61–90", goal: "TODO", detail: "TODO" },
  ],
  closing: {
    line: "TODO direct ask, one sentence.",
    email: "lksujins@gmail.com",
    calendarUrl: "TODO or remove",
    whatsapp: "TODO wa.me link or remove",
    github: "https://github.com/sujink1999",
  },
  unlisted: true,
};
