import type { CompanyPitch } from "./types";

export const railway: CompanyPitch = {
  "slug": "railway",
  "company": "Railway",
  "role": "Product Engineer (Full-Stack)",
  "accent": "#a78bfa",
  "accentFrom": "#dcd0fb",
  "story": [
    "You rebuilt your logging stack for **1B logs a day**, then shipped **Git for infrastructure**. Twenty-one people, almost no meetings. That is how I think software should be built.",
    "The closest thing I've built to your Temporal jobs is **Beans**: Bull and Redis workers that executed token launches, trades, and withdrawals unattended, moving more than **$100k an hour** in production.",
    "Give one engineer the **whole feature**, dashboard to worker, and hold them to the outcome. That is how everything I've shipped got shipped."
  ],
  "requirements": [
    {
      "label": "End-to-end ownership",
      "need": "Build features end-to-end, from the UI in our dashboard to orchestrating workflows that interact with our microservices using Temporal.",
      "proofs": [
        "vanta-os",
        "mudrex",
        "society-mobile"
      ],
      "claim": "I built Vanta end to end: data model, Express APIs, dashboards, App Store release. Before that: Mudrex, solo, to 10M+ downloads.",
      "stackMatch": [
        "Next.js 16",
        "Express 5",
        "Drizzle / PostgreSQL"
      ]
    },
    {
      "label": "Async job pipelines",
      "need": "Experience managing complex asynchronous backend jobs for something like a build/deploy pipeline.",
      "proofs": [
        "beans",
        "vanta-os"
      ],
      "claim": "Beans ran launches, buys, and withdrawals unattended on Bull and Redis workers: idempotent jobs, distributed locks, automatic on-chain refunds on failure.",
      "stackMatch": [
        "Bull",
        "Redis",
        "AWS Lambda",
        "SQS"
      ]
    },
    {
      "label": "Frontend architecture",
      "need": "A strong understanding of frontend architecture to build interactivity-rich systems for fetching, mutating, and rendering data effectively.",
      "proofs": [
        "keom",
        "vanta-os",
        "society-mobile"
      ],
      "claim": "I grew a lending protocol frontend from $500k to $10M TVL: live oracle prices, multi-wallet, Cypress e2e coverage.",
      "stackMatch": [
        "React",
        "TypeScript",
        "Pyth oracles",
        "Cypress"
      ]
    },
    {
      "label": "Rust / open source",
      "need": "Experience with, or at least the desire to learn Rust to contribute to our open-source repositories (CLI, Nixpacks, etc).",
      "proofs": [
        "beans"
      ],
      "claim": "Beans runs an Anchor program in Rust on Solana mainnet: launches, betting rounds, staking, tested with bankrun simulations.",
      "stackMatch": [
        "Rust / Anchor"
      ]
    },
    {
      "label": "Autonomy, front to back",
      "need": "An ability to autonomously lead, design, and implement great product experiences, from front to back.",
      "proofs": [
        "mudrex",
        "vanta-os"
      ],
      "claim": "At Mudrex, a YC startup, I built the app solo from scratch to 10M+ downloads, pre-seed through Series A.",
      "stackMatch": [
        "React Native",
        "Next.js 16"
      ]
    }
  ],
  "closing": {
    "line": "You make engineers higher leverage. I'd like to help build the thing that does that.",
    "email": "lksujins@gmail.com",
    "github": "https://github.com/sujink1999",
    "resumeUrl": "/Sujin-K-Resume.pdf",
    "whatsapp": "+91 7299603606"
  },
  "unlisted": true
};
