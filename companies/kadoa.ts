import type { CompanyPitch } from "./types";

export const kadoa: CompanyPitch = {
  "slug": "kadoa",
  "company": "Kadoa",
  "role": "Senior Software Engineer",
  "accent": "#38bdf8",
  "accentFrom": "#bae6fd",
  "story": [
    "**6+ years** shipping zero to one: a YC-backed trading app built solo to **10M+ downloads**, DeFi frontends holding **$10M TVL**, and Vanta, a health platform I co-founded and built end to end.",
    "Your founders still write **scraping and ETL code almost every day**. Same here. Vanta is one pair of hands: data model, Express APIs, mobile, the App Store release.",
    "I have pulled data out of messy sources my whole career: exchanges, chains, wearables. The hard part was never extraction, it was making the output **trustworthy enough to ship**. The rest of this page maps your JD to that work."
  ],
  "requirements": [
    {
      "label": "LLM in production",
      "need": "experience working with LLMs and putting them in production",
      "proofs": [
        "vanta-os"
      ],
      "claim": "At Vanta I run LLM pipelines behind an eval harness: daily plan generation scored before it ships, not after.",
      "stackMatch": [
        "LLM pipelines"
      ]
    },
    {
      "label": "TypeScript / Node.js",
      "need": "You're a strong developer across backend and infrastructure (TypeScript, Node.js, Python, Docker, Kubernetes, GCP)",
      "proofs": [
        "vanta-os",
        "beans"
      ],
      "claim": "TypeScript end to end: Vanta's Express APIs and data model, plus BullMQ and Redis workers running Beans' launch queue unattended.",
      "stackMatch": [
        "Express 5",
        "Drizzle / PostgreSQL",
        "BullMQ",
        "Redis"
      ]
    },
    {
      "label": "Data pipelines & accuracy",
      "need": "experience with data pipelines, and world-class accuracy and performance",
      "proofs": [
        "keom",
        "beans"
      ],
      "claim": "I ran the frontend of a lending protocol holding $10M TVL, e2e tested with Cypress, where a data bug loses real money.",
      "stackMatch": [
        "TypeScript",
        "Cypress",
        "Jest"
      ]
    },
    {
      "label": "Low-ego generalist",
      "need": "low-ego generalists with high agency who can help build a platform combining the most intuitive UX with world-class accuracy and performance",
      "proofs": [
        "mudrex",
        "vanta-os"
      ],
      "claim": "Founding engineer at Mudrex, solo to 10M+ downloads pre Series A. Now I own Vanta end to end: product, backend, data model, mobile.",
      "stackMatch": [
        "React Native",
        "Next.js 16"
      ]
    },
    {
      "label": "Shipped product",
      "need": "help build a platform combining the most intuitive UX with world-class accuracy and performance",
      "proofs": [
        "vanta-os",
        "society-mobile"
      ],
      "claim": "Vanta's reconciliation engine turns noisy wearable streams into numbers users trust. Society shipped to the App Store on a Skia-built design system.",
      "stackMatch": [
        "Next.js 16",
        "Expo / React Native"
      ]
    }
  ],
  "closing": {
    "line": "You still write the scrapers yourselves. I build the same way, hands on everything I ship. If that maps to what you need, the door is open.",
    "email": "lksujins@gmail.com",
    "github": "https://github.com/sujink1999",
    "whatsapp": "+91 7299603606",
    "resumeUrl": "/Sujin-K-Resume.pdf"
  },
  "unlisted": true,
  "evidenceOverrides": {
    "vanta-os": {
      "period": "Nov 2025 – 2026",
      "proofPoints": [
        "LLM daily-plan generation with an eval harness",
        "Wearable-data reconciliation engine merging noisy device streams into one clean timeline",
        "End-to-end ownership: product, backend, data model, micro-interactions"
      ],
      "stack": [
        "Next.js 16",
        "React 19",
        "Express 5",
        "Drizzle / PostgreSQL",
        "LLM pipelines"
      ]
    },
    "beans": {
      "stack": [
        "Next.js",
        "BullMQ",
        "Redis",
        "Rust / Anchor",
        "Jest"
      ]
    },
    "keom": {
      "stack": [
        "React",
        "TypeScript",
        "Pyth oracles",
        "Cypress"
      ]
    }
  }
};
