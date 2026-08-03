import type { CompanyPitch } from "./types";

export const colonist: CompanyPitch = {
  "slug": "colonist",
  "company": "Colonist",
  "role": "Product Engineer",
  "accent": "#e0793c",
  "accentFrom": "#f4c98b",
  "story": [
    "**3.6 million people** play your game every year. I've shipped consumer software at that scale: Mudrex, a YC-backed app I built solo to **10M+ downloads**.",
    "After Mudrex I co-founded Vanta, a health platform I own down to the **animation curve**. A board game lives or dies on that same feel.",
    "And I've worked distributed and async for years, so a guild spread across continents is a shape I already know from the inside."
  ],
  "requirements": [
    {
      "label": "End-to-end ownership",
      "need": "Develop and enhance game modes and features, own full-stack development from backend logic to polished UI",
      "proofs": [
        "vanta-os",
        "mudrex"
      ],
      "claim": "I built Vanta end to end: data model, Express APIs, UI polish, App Store release. Before that: Mudrex, solo, to 10M+ downloads.",
      "stackMatch": [
        "Next.js 16",
        "Express 5",
        "React 19"
      ]
    },
    {
      "label": "React / TypeScript UI",
      "need": "Skilled in React, TypeScript, CSS, and building high-performance UIs",
      "proofs": [
        "society-mobile",
        "keom"
      ],
      "claim": "Society ships custom Skia graphics and celebration flows to the App Store. Keom's live lending dApp was mine, essentially solo, holding $10M TVL.",
      "stackMatch": [
        "React",
        "TypeScript",
        "Expo / React Native",
        "Shopify Skia"
      ]
    },
    {
      "label": "Scale under heavy load",
      "need": "Optimize performance under heavy load",
      "proofs": [
        "mudrex",
        "beans"
      ],
      "claim": "Mudrex stayed fast and stable through 10M+ downloads. Beans ran its Solana launch pipeline unattended on BullMQ and Redis workers.",
      "stackMatch": [
        "React Native",
        "BullMQ",
        "Redis"
      ]
    },
    {
      "label": "Databases & REST APIs",
      "need": "Experience with relational databases and REST APIs",
      "proofs": [
        "vanta-os",
        "keom"
      ],
      "claim": "Vanta runs on Express REST APIs and PostgreSQL via Drizzle. Keom's frontend served a protocol scaling from $500k to $10M TVL.",
      "stackMatch": [
        "Express 5",
        "Drizzle / PostgreSQL",
        "REST APIs"
      ]
    },
    {
      "label": "Async, remote-first team",
      "need": "Fully remote, asynchronous team spread across multiple continents; strong async written communication",
      "proofs": [
        "vanta-os",
        "beans"
      ],
      "claim": "I've shipped async for years: Mudrex solo to 10M+ downloads, then all of Vanta, decisions logged in writing, no meetings."
    }
  ],
  "closing": {
    "line": "I've spent years making products feel right under real load. I'd like to do that for a game millions of people love.",
    "email": "lksujins@gmail.com",
    "github": "https://github.com/sujink1999",
    "resumeUrl": "/Sujin-K-Resume.pdf",
    "whatsapp": "+91 7299603606"
  },
  "unlisted": true
};
