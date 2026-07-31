import type { CompanyPitch } from "./types";

export const deeptune: CompanyPitch = {
  slug: "deeptune",
  company: "Deeptune",
  role: "Member of Technical Staff",
  accent: "#818cf8",
  accentFrom: "#c7d2fe",
  story: [
    "**6+ years** of shipping zero to one: a YC-backed trading app built solo to **10M+ downloads**, DeFi frontends holding **$10M TVL**, and Vanta, a health platform I co-founded and built end to end.",
    "At Vanta I run **LLM pipelines behind an eval harness**, so I've felt the gap you're closing: agents don't improve without an environment that scores them.",
    "Your process starts with why I'm interested. This page is that answer, mapped to the JD.",
  ],
  requirements: [
    {
      label: "Backend & infra",
      need: "You're a strong developer across backend and infrastructure (Python, Go, TypeScript, etc.)",
      proofs: ["vanta-os", "beans", "keom"],
      claim: "TypeScript end to end: Vanta's Express APIs and data model, BullMQ/Redis worker pipelines, and an on-chain Rust program under simulation tests.",
      stackMatch: ["Express 5", "Drizzle", "Rust / Anchor", "TypeScript"],
    },
    {
      label: "Agentic AI",
      need: "A deep interest in agentic AI",
      proofs: ["vanta-os"],
      claim: "Vanta's coach agent plans each user's day behind an eval harness, and I run multiple agents daily in my own personal workflows.",
      stackMatch: ["LLM pipelines"],
    },
    {
      label: "Founding DNA",
      need: "You've been a founding engineer, founded your own company, or had a major impact at a top-tier company",
      proofs: ["mudrex", "vanta-os"],
      claim: "Founding engineer at Mudrex, pre-seed through Series A, app built solo to 10M+ downloads. Then CTO roles, then co-founded Vanta.",
      stackMatch: ["React Native", "Next.js 16"],
    },
    {
      label: "Ownership",
      need: "You are motivated by ownership, impact, and building frontier tech",
      proofs: ["vanta-os", "society-mobile"],
      claim: "Vanta is one pair of hands: product, backend, data model, mobile, App Store release. 39 phased rollouts logged on the reconciliation engine alone.",
      stackMatch: ["Next.js 16", "Express 5", "Expo / React Native"],
    },
    {
      label: "Thrives in ambiguity",
      need: "You thrive in ambiguity and love hard problems",
      proofs: ["beans", "keom"],
      claim: "I believe risk is where the reward lives, so the hardest problem in the room is the first one I ask for.",
      stackMatch: ["Rust / Anchor", "Pyth"],
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
