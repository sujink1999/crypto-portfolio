import type { CompanyPitch } from "./types";

export const supabase: CompanyPitch = {
  slug: "supabase",
  company: "Supabase",
  role: "Frontend Engineer",
  accent: "#3ECF8E",
  accentFrom: "#7DE6B5",
  story: [
    "Spinning up a backend used to be the slowest week of every project. You made it **minutes on top of Postgres**. I've built **two apps on Supabase** and felt that speed firsthand.",
    "I built Mudrex's app **solo to 10M+ downloads**, then co-founded Vanta, where an **AI coach ships behind an eval harness**: agents write a big share of the code, and checks decide what lands.",
    "I've spent six years on exactly this kind of surface: **data-heavy dashboards where developers live all day**. Here's your JD mapped to what I've shipped.",
  ],
  requirements: [
    {
      label: "0 to 1, then iterate",
      need: "A track record of taking a product from 0 to 1: launched something real, put it in front of users, and iterated on how they actually used it",
      proofs: ["mudrex", "vanta-os", "society-mobile"],
      claim:
        "Mudrex: built solo from zero to 10M+ downloads, pre-seed through Series A. Vanta: co-founded, built end to end, in production.",
      stackMatch: ["React Native", "Next.js 16", "Express 5"],
    },
    {
      label: "Deep React fundamentals",
      need: "TypeScript and React, plus a real understanding of the modern landscape (SSR, streaming, server components, edge)",
      proofs: ["vanta-os", "keom", "society-mobile"],
      claim:
        "Vanta ships on Next.js 16 and React 19, server components in production. Before that: DeFi frontends holding $10M TVL.",
      stackMatch: ["Next.js 16", "React 19", "TypeScript"],
    },
    {
      label: "Quality as tooling",
      need: "Treats tests, types, and CI as tools that let you and AI agents move faster; opinions on where checks should run",
      proofs: ["keom", "vanta-os", "beans"],
      claim:
        "Keom ran Cypress e2e on a margin dApp holding $10M. Vanta's coach ships behind an eval harness that gates releases.",
      stackMatch: ["Cypress", "Drizzle", "LLM pipelines"],
    },
    {
      label: "AI agents in the loop",
      need: "Comfort working with AI coding agents: reviewing what they produce, tightening architecture where they overreach, giving them guardrails",
      proofs: ["vanta-os", "beans"],
      claim:
        "Agents are how I ship, and what I ship: Vanta's tool-calling coach runs 18+ tools behind evals and confirmation guardrails.",
      stackMatch: ["LLM pipelines", "Express 5"],
    },
  ],
  closing: {
    line: "You use what you ship. I'd like what I ship next to be your dashboard.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    whatsapp: "+91 7299603606",
    resumeUrl: "/Sujin-K-Resume.pdf",
  },
  unlisted: true,
};
