import type { CompanyPitch } from "./types";

export const colonist: CompanyPitch = {
  "slug": "colonist",
  "company": "Colonist",
  "role": "Product Engineer",
  "accent": "#2f9ce0",
  "accentFrom": "#aee0fb",
  "story": [
    "Players spent **3,037 years** inside Colonist last year: **60 million games**, **3.6 million players**, run by a small async guild. That a team that small carries it is the part that impressed me.",
    "I know what consumer scale does to software. I built Mudrex's app **solo** at a YC startup and carried it to **10M+ downloads**, pre-seed through Series A, keeping it fast the whole way.",
    "I've spent **6+ years** keeping consumer products quick while real numbers hit them. A game millions of people play is the best version of that problem."
  ],
  "requirements": [
    {
      "label": "Own features end to end",
      "need": "Develop and enhance game modes and features, owning full-stack development from backend logic to polished UI.",
      "proofs": [
        "vanta-os",
        "mudrex",
        "society-mobile"
      ],
      "claim": "I built Vanta end to end: Express APIs, PostgreSQL data model, React dashboards, and a mobile app live on the App Store.",
      "stackMatch": [
        "Next.js 16",
        "React 19",
        "Express 5"
      ]
    },
    {
      "label": "High-performance UIs",
      "need": "Skilled in React, TypeScript, CSS, and building high-performance UIs.",
      "proofs": [
        "society-mobile",
        "keom"
      ],
      "claim": "Society draws custom Skia graphics over FlashList feeds on the App Store. Before that, trading UIs on live oracle prices.",
      "stackMatch": [
        "React",
        "TypeScript",
        "Shopify Skia",
        "FlashList"
      ]
    },
    {
      "label": "Performance under load",
      "need": "Optimize performance under heavy load.",
      "proofs": [
        "mudrex",
        "beans"
      ],
      "claim": "Mudrex stayed fast and stable through 10M+ downloads. Beans' pipeline processed over $100k an hour without a human watching.",
      "stackMatch": [
        "React Native",
        "Bull",
        "Redis"
      ]
    },
    {
      "label": "Databases & REST APIs",
      "need": "Experience with relational databases and REST APIs.",
      "proofs": [
        "beans",
        "vanta-os"
      ],
      "claim": "Beans materialized on-chain events into MySQL through Lambda and SQS. Vanta runs Express REST APIs on PostgreSQL with Drizzle.",
      "stackMatch": [
        "Express 5",
        "Drizzle / PostgreSQL",
        "MySQL"
      ]
    },
    {
      "label": "Async, distributed team",
      "need": "Fully remote, asynchronous team across multiple continents; strong async written communication.",
      "proofs": [
        "keom",
        "vanta-os"
      ],
      "claim": "6+ years shipping remote: DeFi frontends holding $10M TVL with distributed teams, then Vanta built end to end, coordinated in writing.",
      "stackMatch": [
        "TypeScript",
        "Next.js 16"
      ]
    }
  ],
  "closing": {
    "line": "60 million games last year. I'd like to help build the next 60 million.",
    "email": "lksujins@gmail.com",
    "github": "https://github.com/sujink1999",
    "resumeUrl": "/Sujin-K-Resume.pdf",
    "whatsapp": "+91 7299603606"
  },
  "unlisted": true
};
