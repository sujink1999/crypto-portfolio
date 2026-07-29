import type { CompanyPitch } from "./types";

export const pax: CompanyPitch = {
  slug: "pax",
  company: "Pax",
  role: "Senior Software Engineer",
  accent: "#7c5cf0",
  accentFrom: "#57a9dd",
  hook: "You picked a 200-year-old paperwork problem where AI recovers real dollars. That's the kind of unglamorous-but-huge bet I want to build on.",
  story: [
    "Most AI startups are demos looking for a problem. You found **billions a year sitting unclaimed** and built the thing that files it.",
    "I've been shipping for **6+ years**: a trading app built solo to **10M+ downloads**, a lending protocol that held **$10M**, and Vanta - a health platform I co-founded and built end to end.",
    "The common thread is turning messy real-world data into numbers people trust. This page is me showing, not telling.",
  ],
  requirements: [
    {
      label: "End-to-end ownership",
      need: "Own real features end-to-end: API design, backend logic, frontend UI, and everything in between",
      proofs: ["vanta-os", "mudrex"],
      claim: "I built Vanta end to end - data model, Express APIs, dashboards, App Store. Before that: Mudrex, solo, to 10M+ downloads.",
      stackMatch: ["Next.js 16", "Express 5", "Drizzle"],
    },
    {
      label: "Crisp UI + deep backend",
      need: "Can go deep on backend architecture and also cares that the UI feels crisp",
      proofs: ["vanta-os", "beans"],
      claim: "The page you're reading is the frontend exhibit. Behind my products: queue workers, reconciliation jobs, 39 phased rollouts.",
      stackMatch: ["Next.js 16", "React 19", "BullMQ", "Redis"],
    },
    {
      label: "Building with LLMs",
      need: "Build with LLMs to solve real problems for real businesses, not imaginary ones",
      proofs: ["vanta-os", "society-mobile"],
      claim: "Vanta's daily-plan engine runs on LLM pipelines with an eval harness - structured outputs, human review, not prompt-and-pray.",
      stackMatch: ["LLM pipelines"],
    },
    {
      label: "Money-grade data",
      need: "Secure data handling and ledger keeping for sensitive financial and trade data",
      proofs: ["keom", "beans"],
      claim: "I ran the frontend of a lending protocol holding $10M, where a reconciliation bug loses real money. Same muscle as refund claims.",
      stackMatch: ["React", "TypeScript", "Pyth"],
    },
    {
      label: "Ships in ambiguity",
      need: "Is comfortable with ambiguity and thrives in early-stage environments",
      proofs: ["vanta-os", "mudrex", "beans"],
      claim: "Co-founded Vanta as the only engineer. Carried Mudrex from pre-seed through Series A. Week-one shipping is how I've always worked.",
      stackMatch: ["Next.js 16", "React Native"],
    },
  ],
  closing: {
    line: "You ship a real feature in week one. I'd like week one to start soon.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    resumeUrl: "/Sujin-K-Resume.pdf",
    whatsapp: "+91 7299603606",
  },
  unlisted: true,
  evidenceOverrides: {
    "vanta-os": {
      period: "Nov 2025 – 2026",
      stack: [
        "Next.js 16",
        "React 19",
        "Express 5",
        "Drizzle / PostgreSQL",
        "LLM pipelines",
      ],
    },
    "keom": {
      stack: ["React", "TypeScript", "Pyth oracles", "Celer bridge", "Cypress"],
    },
  },
};
