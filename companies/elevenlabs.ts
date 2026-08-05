import type { CompanyPitch } from "./types";

export const elevenlabs: CompanyPitch = {
  "slug": "elevenlabs",
  "company": "ElevenLabs",
  "role": "Full-Stack Engineer",
  "accent": "#E8E8E8",
  "accentFrom": "#8A8A8A",
  "story": [
    "You closed 2025 past **$330M ARR**, and your JD still reads like a seed startup: **lean autonomous teams** scoping proof-of-concept products directly with partner customers.",
    "At Vanta, the health platform I co-founded, I scoped and shipped a **conversational coach agent** myself: a tool-calling loop with **18+ tools**, durable memory, and the web and App Store apps around it.",
    "**6+ years** owning features from the React frontend to the pipeline behind them. The rest of this page maps your JD to what shipped."
  ],
  "requirements": [
    {
      "label": "Python",
      "need": "Expertise in Python",
      "proofs": [
        "vanta-os"
      ],
      "claim": "I shipped Python ML at FincorpX: FastAPI, word2vec embeddings, chained scikit-learn classifiers in production. At Vanta I run LLM pipelines daily.",
      "stackMatch": [
        "LLM pipelines"
      ]
    },
    {
      "label": "TypeScript / React",
      "need": "Experience with web development using TypeScript/React",
      "proofs": [
        "vanta-os",
        "keom",
        "society-mobile"
      ],
      "claim": "6+ years of TypeScript and React: Vanta ships on Next.js 16 and React 19, and my lending frontend grew to $10M TVL.",
      "stackMatch": [
        "Next.js 16",
        "React 19",
        "React",
        "TypeScript"
      ]
    },
    {
      "label": "End-to-end ownership",
      "need": "Ship end-to-end features across front and back ends with high ownership",
      "proofs": [
        "mudrex",
        "vanta-os",
        "beans"
      ],
      "claim": "Built Mudrex's app solo to 10M+ downloads, pre-seed through Series A. Co-founded Vanta and built everything: APIs, data model, App Store.",
      "stackMatch": [
        "React Native",
        "Express 5",
        "Drizzle"
      ]
    },
    {
      "label": "Infrastructure that holds",
      "need": "Maintain internal infrastructure for scalability, performance, and security",
      "proofs": [
        "beans",
        "keom"
      ],
      "claim": "Beans ran Bull and Redis workers executing launches, trades, and withdrawals unattended, auto-refunding participants on-chain when a launch failed.",
      "stackMatch": [
        "Rust / Anchor"
      ]
    }
  ],
  "closing": {
    "line": "You build the voice layer for millions of people. I'd like to build the products that carry it to them.",
    "email": "lksujins@gmail.com",
    "github": "https://github.com/sujink1999",
    "resumeUrl": "/Sujin-K-Resume.pdf",
    "whatsapp": "+91 7299603606"
  },
  "unlisted": true
};
