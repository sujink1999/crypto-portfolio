import type { CompanyPitch } from "./types";

export const zeitlabs: CompanyPitch = {
  "slug": "zeitlabs",
  "company": "Zeitlabs",
  "role": "Senior Frontend Engineer",
  "accent": "#38bdf8",
  "accentFrom": "#a5f3fc",
  "story": [
    "**10M+ downloads** on a YC-backed app I built solo. Then Vanta, the health platform I co-founded and built end to end: Next.js 16, Express, dashboards, a mobile app.",
    "You've been shipping Arabic RTL on Open edX since 2014, years before it was table stakes. I've done that kind of unglamorous, load-bearing frontend work too, and I like it.",
    "So you're looking for a senior frontend engineer to bring a legacy React codebase and a modern Next.js app under one component library. Here's the mapping."
  ],
  "requirements": [
    {
      "label": "Component library",
      "need": "Own key parts of our frontend platform, including our shared component library strategy, across a legacy React codebase and a modern Next.js (App Router) app",
      "proofs": [
        "vanta-os",
        "society-mobile"
      ],
      "claim": "Vanta runs one shared component language across a Next.js 16 web app and a React Native mobile app. I built both ends.",
      "stackMatch": [
        "Next.js 16",
        "React 19"
      ]
    },
    {
      "label": "RTL/LTR i18n",
      "need": "Building RTL/LTR (Arabic + English) interfaces with next-intl",
      "proofs": [
        "keom"
      ],
      "claim": "I shipped production i18n on Keom's live lending frontend, real internationalization on a product with $10M sitting behind it.",
      "stackMatch": [
        "TypeScript",
        "Cypress"
      ]
    },
    {
      "label": "Next.js + AI stack",
      "need": "Stack: Next.js, TypeScript, Tailwind v3/v4, Radix UI, Zustand/Jotai, TanStack Query, Vercel AI SDK + OpenAI APIs, Jest/Testing Library",
      "proofs": [
        "vanta-os",
        "beans"
      ],
      "claim": "Vanta ships on Next.js 16, TypeScript and Tailwind, with an LLM pipeline on OpenAI's APIs behind an eval harness.",
      "stackMatch": [
        "Next.js 16",
        "TypeScript",
        "Drizzle / PostgreSQL",
        "LLM pipelines"
      ]
    },
    {
      "label": "Independent, async",
      "need": "5+ yrs frontend experience, strong async communication, proven ability to drive work to completion independently in a distributed team",
      "proofs": [
        "mudrex",
        "vanta-os"
      ],
      "claim": "Six years of driving work to done on my own: Mudrex's app solo to 10M+ downloads, then all of Vanta.",
      "stackMatch": [
        "React Native",
        "Next.js 16"
      ]
    }
  ],
  "closing": {
    "line": "That's the JD, requirement by requirement. If it reads like a fit, I'm easy to reach.",
    "email": "lksujins@gmail.com",
    "github": "https://github.com/sujink1999",
    "whatsapp": "+91 7299603606",
    "resumeUrl": "/Sujin-K-Resume.pdf"
  },
  "unlisted": true
};
