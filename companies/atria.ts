import type { CompanyPitch } from "./types";

export const atria: CompanyPitch = {
  "slug": "atria",
  "company": "Atria",
  "role": "Software Engineer, Product",
  "accent": "#5ec99a",
  "accentFrom": "#c9f5df",
  "story": [
    "I had health issues for **eight years**. What finally worked was **tracking everything** and treating my body like a data problem.",
    "So I co-founded **Vanta**: biomarker dashboards, lab report viewers, wearable reconciliation, an agent reading months of one person's health history. No clinics, just the data problem.",
    "Before that: a trading app built solo to **10M+ downloads**, DeFi frontends holding **$10M TVL**. This page maps your JD to what I shipped."
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
      "claim": "Five years of production zero to one: Mudrex solo to 10M+ downloads, then Beans, a Solana launcher on my own Anchor program.",
      "stackMatch": [
        "React Native",
        "Next.js",
        "Rust / Anchor"
      ]
    }
  ],
  "closing": {
    "line": "I've built pieces of this already. I'd like to build the rest with you.",
    "email": "lksujins@gmail.com",
    "github": "https://github.com/sujink1999",
    "resumeUrl": "/Sujin-K-Resume.pdf",
    "whatsapp": "+91 7299603606"
  },
  "unlisted": true,
  "evidenceOverrides": {
    "vanta-os": {
      "period": "Nov 2025 – present",
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
