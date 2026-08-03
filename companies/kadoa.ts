import type { CompanyPitch } from "./types";

export const kadoa: CompanyPitch = {
  "slug": "kadoa",
  "company": "Kadoa",
  "role": "Senior Software Engineer",
  "accent": "#fd7412",
  "accentFrom": "#ffcda3",
  "story": [
    "Your founders still write **scraping and ETL code** almost every day, because that is what the product is: pulling structure out of **messy, hostile data**. I've spent years in exactly that kind of work.",
    "At **Vanta**, the health platform I co-founded, I reconcile noisy **Garmin and WHOOP** streams into one clean record, and every LLM output ships behind an **eval harness**. Before that: DeFi frontends where a data bug loses real money, **$500k to $10M TVL**.",
    "Lean team, no egos, everyone **close to the thing that breaks**. I've never worked any other way."
  ],
  "requirements": [
    {
      "label": "LLMs in production",
      "need": "Experience working with LLMs and putting them in production.",
      "proofs": [
        "vanta-os"
      ],
      "claim": "Vanta's daily-plan engine runs on LLM pipelines with an eval harness: structured outputs scored before a user ever sees them.",
      "stackMatch": [
        "LLM pipelines",
        "Express 5"
      ]
    },
    {
      "label": "TypeScript / Node.js",
      "need": "TypeScript, Node.js, Python, Docker, Kubernetes, GCP, SQL databases.",
      "proofs": [
        "beans",
        "vanta-os"
      ],
      "claim": "Node in production for years: Beans' Bull and Redis workers executed launches, trades, and withdrawals unattended, over $100k an hour.",
      "stackMatch": [
        "Node.js",
        "Bull",
        "Redis",
        "Express 5"
      ]
    },
    {
      "label": "Data pipelines",
      "need": "Experience with data pipelines for deterministic, world-class accuracy.",
      "proofs": [
        "beans",
        "vanta-os",
        "keom"
      ],
      "claim": "Beans decoded on-chain events in Lambda, dispatched them through SQS, and materialized them into MySQL. Nothing double-processed, ever.",
      "stackMatch": [
        "AWS Lambda",
        "SQS",
        "MySQL / Drizzle"
      ]
    },
    {
      "label": "Low-ego generalist",
      "need": "A lean remote team looking for low-ego generalists with high agency.",
      "proofs": [
        "mudrex",
        "vanta-os",
        "society-mobile"
      ],
      "claim": "One pair of hands since Mudrex, built solo to 10M+ downloads, through co-founding Vanta and shipping its entire stack.",
      "stackMatch": [
        "React Native",
        "Next.js 16"
      ]
    },
    {
      "label": "Intuitive UX, accurate numbers",
      "need": "Help build a platform combining the most intuitive UX with world-class accuracy and performance.",
      "proofs": [
        "keom",
        "society-mobile"
      ],
      "claim": "Keom held $10M TVL under Cypress e2e coverage. Society shipped to the App Store on custom Skia graphics.",
      "stackMatch": [
        "TypeScript",
        "Cypress",
        "Expo / React Native"
      ]
    }
  ],
  "closing": {
    "line": "Deterministic pipelines built from a non-deterministic component is a hard, honest problem. I'd like to work on it with you.",
    "email": "lksujins@gmail.com",
    "github": "https://github.com/sujink1999",
    "whatsapp": "+91 7299603606",
    "resumeUrl": "/Sujin-K-Resume.pdf"
  },
  "unlisted": true,
  "evidenceOverrides": {
    "vanta-os": {
      "period": "Nov 2025 \u2013 2026",
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
