import type { CompanyPitch } from "./types";

export const atria: CompanyPitch = {
  "slug": "atria",
  "company": "Atria",
  "role": "Software Engineer, Product",
  "accent": "#d9b47a",
  "accentFrom": "#f6ead6",
  "story": [
    "I dealt with **health issues for eight years**. Saw plenty of doctors, tried the medications. What finally moved the needle was **tracking everything** and treating my own body like a data problem.",
    "That is why I built **Vanta**, a health platform I co-founded: biomarker dashboards, lab report viewers, wearable reconciliation, an agent reading months of one person's health history. No clinics, no physicians, just the data problem.",
    "Before that: a YC-backed trading app built solo to **10M+ downloads**, DeFi frontends holding **$10M TVL**. You're moving medicine from reactive to preventive, and I have been on both sides of that shift. This page maps your JD to what I shipped."
  ],
  "requirements": [
    {
      "label": "Health data",
      "need": "Nice to have: EHR, wearables integrations, or health data platform exposure",
      "proofs": [
        "vanta-os",
        "society-mobile"
      ],
      "claim": "I built Vanta's wearable reconciliation engine, live in production, plus the biomarker and lab report viewers reading that same longitudinal data.",
      "stackMatch": [
        "Wearable integrations",
        "Express 5",
        "Drizzle / MySQL"
      ]
    },
    {
      "label": "End-to-end delivery",
      "need": "Own complete feature delivery: design, implementation, testing, rollout, and iteration",
      "proofs": [
        "vanta-os",
        "mudrex"
      ],
      "claim": "I built Vanta end to end: data model, Express APIs, dashboards, App Store. Before that: Mudrex, solo, to 10M+ downloads.",
      "stackMatch": [
        "Next.js 16",
        "Express 5",
        "React Native"
      ]
    },
    {
      "label": "TypeScript + React",
      "need": "Proficiency with TypeScript and modern frontend frameworks, ideally React",
      "proofs": [
        "vanta-os",
        "keom"
      ],
      "claim": "TypeScript end to end: React 19 surfaces, Express 5 APIs, one schema across Vanta. Keom's React frontend held $10M TVL.",
      "stackMatch": [
        "TypeScript",
        "React 19",
        "Express 5"
      ]
    },
    {
      "label": "Reliability",
      "need": "Build with reliability and performance priorities; define failure modes and optimize queries",
      "proofs": [
        "keom",
        "beans"
      ],
      "claim": "I ran the frontend of a lending protocol holding $10M TVL, Cypress e2e tested, where a missed failure mode costs someone real money.",
      "stackMatch": [
        "Cypress",
        "TypeScript",
        "Redis"
      ]
    },
    {
      "label": "Years of product",
      "need": "4+ years of professional software engineering experience building product experiences in production environments",
      "proofs": [
        "mudrex",
        "beans"
      ],
      "claim": "Six years of production zero to one: Mudrex solo to 10M+ downloads, then Beans, a Solana launcher on my own Anchor program.",
      "stackMatch": [
        "React Native",
        "Next.js",
        "Rust / Anchor"
      ]
    }
  ],
  "closing": {
    "line": "You're building the software that makes prevention hold. I've shipped pieces of it already. I'd like to build the rest with you.",
    "email": "lksujins@gmail.com",
    "github": "https://github.com/sujink1999",
    "resumeUrl": "/Sujin-K-Resume.pdf",
    "whatsapp": "+91 7299603606"
  },
  "unlisted": true,
  "evidenceOverrides": {
    "vanta-os": {
      "period": "Nov 2025 – 2026",
      "what": "The Vanta ecosystem: a preventive health product with biomarker dashboards, lab and DEXA report viewers, wearable integrations and an AI coach, plus the Society platform (store, labs, admin) and an App Store mobile app.",
      "proofPoints": [
        "Wearable-data reconciliation engine merging device streams into one member timeline",
        "Biomarker, DEXA and genetics report viewers over longitudinal member data",
        "LLM coach with a durable fact store and an eval harness",
        "End-to-end ownership: product, backend, data model, micro-interactions"
      ],
      "stack": [
        "TypeScript",
        "React 19",
        "Next.js 16",
        "Express 5",
        "Drizzle / MySQL",
        "Wearable integrations"
      ]
    },
    "keom": {
      "stack": [
        "React",
        "TypeScript",
        "Cypress",
        "Pyth oracles"
      ]
    },
    "beans": {
      "stack": [
        "Next.js",
        "TypeScript",
        "Redis",
        "Rust / Anchor",
        "Jest"
      ]
    }
  }
};
