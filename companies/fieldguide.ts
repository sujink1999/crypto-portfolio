import type { CompanyPitch } from "./types";

export const fieldguide: CompanyPitch = {
  slug: "fieldguide",
  company: "Fieldguide",
  role: "Software Engineer",
  accent: "#34d17c",
  accentFrom: "#8ceab5",
  hook: "Most software gets to pick its users. You're building for practitioners stuck with tools that are decades old, and you set the bar at lovable. That's a fight worth joining.",
  story: [
    "**6+ years** of shipping: a YC-backed trading app built solo to **10M+ downloads**, DeFi frontends holding **$10M**, and Vanta, a health platform I co-founded and built end to end.",
    "Audit software is document software. I've built that twice: Vanta's lab report pipeline, and before that a fintech backend that **OCR'd receipts** into clean transactions.",
    "You're hiring across levels. This page just shows the work, you decide the scope.",
  ],
  requirements: [
    {
      label: "TS / React / Node",
      need: "Familiarity with modern web technologies such as TypeScript, React, Node.js, Python, and GraphQL",
      proofs: ["vanta-os", "mudrex", "keom"],
      claim: "6+ years across the stack: Mudrex built solo to 10M+ downloads, Vanta on Next.js 16, React 19 and Express.",
      stackMatch: ["Next.js 16", "React 19", "TypeScript", "Express 5", "React Native"],
    },
    {
      label: "Documents",
      need: "Architecting systems for document-heavy workflows, including ingestion, processing, and retrieval",
      proofs: ["vanta-os", "society-mobile"],
      claim: "Vanta ingests lab results into PDF report viewers: biomarkers, DEXA, genetics. FincorpX ran OCR on receipts via Azure Form Recognizer.",
      stackMatch: ["Drizzle", "Express 5"],
    },
    {
      label: "ML systems",
      need: "Integrating or building ML-powered systems for document understanding or search",
      proofs: ["vanta-os", "beans"],
      claim: "Vanta generates daily plans with LLM pipelines behind an eval harness. FincorpX classified transactions with Python and word2vec.",
      stackMatch: ["LLM pipelines"],
    },
    {
      label: "Ownership",
      need: "Ownership mindset - following work through from ideation to production and iteration",
      proofs: ["mudrex", "vanta-os"],
      claim: "Carried Mudrex from pre-seed through Series A. Co-founded Vanta and shipped the whole ecosystem as its sole technical owner.",
      stackMatch: ["React Native", "Next.js 16"],
    },
    {
      label: "Tested code",
      need: "Writing maintainable, well-tested, and observable code",
      proofs: ["keom", "beans"],
      claim: "Keom held $10M TVL with Cypress e2e coverage. Beans runs an on-chain program under bankrun simulation tests.",
      stackMatch: ["Cypress", "Rust / Anchor"],
    },
  ],
  closing: {
    line: "That's the case. If it maps to what you need, the door is open.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    resumeUrl: "/Sujin-K-Resume.pdf",
    whatsapp: "+91 7299603606",
  },
  unlisted: true,
};
