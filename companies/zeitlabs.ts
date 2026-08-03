import type { CompanyPitch } from "./types";

export const zeitlabs: CompanyPitch = {
  "slug": "zeitlabs",
  "company": "Zeitlabs",
  "role": "Senior Frontend Engineer",
  "accent": "#1f9dff",
  "accentFrom": "#bfe6ff",
  "story": [
    "Your JD says it plainly: **real-complexity work, not greenfield**. A legacy React codebase, a modern App Router app, one component library serving both in **Arabic and English**. I like that honesty; most JDs hide the legacy.",
    "I shipped fully internationalized frontends on a margin protocol that grew from **$500k to $10M TVL**. Then I co-founded **Vanta**, a health platform, and built its design system twice: a web library across **five app surfaces**, a mobile atomic system in **Skia**.",
    "Owning a platform piece alone, async, and driving it to done: I've been doing exactly that for **6+ years**."
  ],
  "requirements": [
    {
      "label": "Shared component library",
      "need": "Own our shared component library strategy across a legacy React codebase and a modern Next.js (App Router) app.",
      "proofs": [
        "vanta-os",
        "society-mobile"
      ],
      "claim": "One design system built twice: Society's mobile atomic system in Skia, and Vanta's web component library across five app surfaces.",
      "stackMatch": [
        "React 19",
        "Next.js 16",
        "Shopify Skia"
      ]
    },
    {
      "label": "RTL/LTR internationalization",
      "need": "Building RTL/LTR (Arabic + English) interfaces with next-intl.",
      "proofs": [
        "keom"
      ],
      "claim": "The margin-trading frontend I authored shipped fully internationalized and Cypress tested, on a protocol that grew from $500k to $10M TVL.",
      "stackMatch": [
        "TypeScript",
        "i18n",
        "Cypress"
      ]
    },
    {
      "label": "Next.js + AI stack",
      "need": "Stack: Next.js, TypeScript, Tailwind v3/v4, Radix UI, Zustand/Jotai, TanStack Query, Vercel AI SDK + OpenAI APIs.",
      "proofs": [
        "vanta-os",
        "society-mobile"
      ],
      "claim": "Vanta ships on Next.js 16, React 19, TypeScript, and Tailwind, with LLM pipelines running behind an eval harness in production.",
      "stackMatch": [
        "Next.js 16",
        "TypeScript",
        "Tailwind",
        "LLM pipelines"
      ]
    },
    {
      "label": "Testing discipline",
      "need": "Jest/Testing Library across a codebase other engineers build on.",
      "proofs": [
        "keom",
        "beans"
      ],
      "claim": "Keom shipped behind Cypress e2e suites. Beans runs an on-chain program under bankrun simulation tests. Testing is how I ship alone.",
      "stackMatch": [
        "Cypress",
        "Jest"
      ]
    },
    {
      "label": "Independent, async delivery",
      "need": "5+ years frontend experience, strong async communication, proven ability to drive work to completion independently in a distributed team.",
      "proofs": [
        "mudrex",
        "vanta-os"
      ],
      "claim": "At Mudrex I built the app solo to 10M+ downloads, pre-seed through Series A. Vanta I carried the same way.",
      "stackMatch": [
        "React Native",
        "Next.js 16"
      ]
    }
  ],
  "closing": {
    "line": "Two codebases, two directions of text, one library. If that is the hard part of this role, it is the part I want.",
    "email": "lksujins@gmail.com",
    "github": "https://github.com/sujink1999",
    "whatsapp": "+91 7299603606",
    "resumeUrl": "/Sujin-K-Resume.pdf"
  },
  "unlisted": true
};
