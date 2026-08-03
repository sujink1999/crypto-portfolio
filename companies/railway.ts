import type { CompanyPitch } from "./types";

export const railway: CompanyPitch = {
  "slug": "railway",
  "company": "Railway",
  "role": "Product Engineer (Full-Stack)",
  "accent": "#a970ff",
  "accentFrom": "#e0aaff",
  "story": [
    "Founding engineer at **Mudrex**, a YC company, app built solo to **10M+ downloads**. Then years on DeFi frontends holding **$10M TVL**. Then I co-founded Vanta, a health platform, and built it end to end.",
    "You rebuilt your logging stack to handle **1B logs a day**, then shipped **Git for infrastructure**. That's the instinct I run on: take the hard thing, give it a clean interface.",
    "**21 people**, hundreds of thousands of users, high ownership, almost no meetings. That's the setup I do my best work in."
  ],
  "requirements": [
    {
      "label": "End-to-end ownership",
      "need": "Build features end-to-end, from the UI in our dashboard to orchestrating workflows that interact with our microservices using Temporal.",
      "proofs": [
        "vanta-os",
        "mudrex"
      ],
      "claim": "I built Vanta end to end: data model, Express APIs, dashboards, App Store release. Before that: Mudrex, solo, to 10M+ downloads.",
      "stackMatch": [
        "Next.js 16",
        "Express 5",
        "Drizzle / PostgreSQL"
      ]
    },
    {
      "label": "Frontend architecture",
      "need": "A strong understanding of frontend architecture to build interactivity-rich systems for fetching, mutating, and rendering data effectively.",
      "proofs": [
        "vanta-os",
        "society-mobile"
      ],
      "claim": "Vanta OS runs on Next.js 16 and React 19: biomarker dashboards, an AI coach, plus a mobile app with custom Skia UI.",
      "stackMatch": [
        "Next.js 16",
        "React 19",
        "Expo / React Native"
      ]
    },
    {
      "label": "Async job pipelines",
      "need": "Experience managing complex asynchronous backend jobs for something like a build/deploy pipeline.",
      "proofs": [
        "queues",
        "beans"
      ],
      "claim": "Beans' launch pipeline ran unattended in production: BullMQ and Redis workers with retries, backups and test coverage, shipped solo in weeks.",
      "stackMatch": [
        "BullMQ",
        "Redis"
      ]
    },
    {
      "label": "Rust / systems",
      "need": "Experience with, or at least the desire to learn Rust to contribute to our open-source repositories (CLI, Nixpacks, etc).",
      "proofs": [
        "beans"
      ],
      "claim": "I shipped a production Anchor program in Rust for Beans: bonding curves, staking, NFT claims, tested with bankrun simulations.",
      "stackMatch": [
        "Rust / Anchor"
      ]
    },
    {
      "label": "Ownership & autonomy",
      "need": "An ability to autonomously lead, design, and implement great product experiences, from front to back.",
      "proofs": [
        "mudrex",
        "vanta-os"
      ],
      "claim": "Founding engineer at Mudrex, pre-seed through Series A, app built solo to 10M+ downloads. Then years leading DeFi frontends, then co-founding Vanta.",
      "stackMatch": [
        "Next.js 16",
        "React Native"
      ]
    }
  ],
  "closing": {
    "line": "You're 21 people who own everything you ship. I'd like to be the 22nd.",
    "email": "lksujins@gmail.com",
    "github": "https://github.com/sujink1999",
    "resumeUrl": "/Sujin-K-Resume.pdf",
    "whatsapp": "+91 7299603606"
  },
  "unlisted": true
};
