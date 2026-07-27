import type { CompanyPitch } from "./types";

export const fluent: CompanyPitch = {
  slug: "fluent",
  company: "Fluent",
  role: "Frontend Engineer",
  accent: "#e2e2e2",
  hook: "You need frontend execution that ships pixel-accurate, works on mobile the first time, and speaks EVM natively. That's been my whole career.",
  story: [
    "You're building the chain for consumer culture - and I've already **shipped culture onchain**:",
    "a token launcher played as a **retro desktop game**, DeFi frontends holding **$10M TVL**, consumer apps live on the stores.",
    "Crypto UIs that feel like products, not dashboards. That's the exact craft you're hiring for.",
  ],
  requirements: [
    {
      label: "Pixel-accurate UI, production-quality",
      need: "Implement pixel-accurate UI from detailed design specifications; translate prototypes into production-quality interfaces; motion and micro-interactions",
      proofs: ["vanta-os", "society-mobile"],
      claim: "Pixel-accurate, motion included - I ship the design, not an approximation of it.",
      stackMatch: ["React", "TypeScript"],
    },
    {
      label: "Onchain data and wallets (EVM)",
      need: "Experience integrating onchain data and wallets using web3 libraries used in EVM environments (e.g. viem, wagmi, Privy)",
      proofs: ["keom", "beans"],
      claim: "Years of production EVM: wallets, oracles, multi-chain - $10M of live value ran through my frontends.",
    },
    {
      label: "Real, consumer-facing products",
      need: "Has shipped and maintained real, consumer-facing products (not only dashboards or internal tools); mobile works correctly on first implementation",
      proofs: ["society-mobile", "mudrex"],
      claim: "Real consumers, real stores: a 10M-download app and a live App Store product.",
    },
    {
      label: "LLM tooling, shipping velocity",
      need: "Leverages LLM tooling to improve shipping velocity and maintains continual awareness of emerging tooling",
      proofs: ["beans", "vanta-os"],
      claim: "My whole workflow runs on Claude - and I ship LLM systems in the product too.",
    },
  ],
  plan90: [
    {
      phase: "Days 1-30",
      goal: "Collapse the review cycles",
      detail: "Take prototypes to production-ready in one or two passes - self-QA'd, mobile-correct, no interpretation back-and-forth.",
    },
    {
      phase: "Days 31-60",
      goal: "Own the frontend surface",
      detail: "Full ownership of user-facing products - scoped realistically, shipped on predictable timelines, regressions caught before review.",
    },
    {
      phase: "Days 61-90",
      goal: "Make the frontend the clarity layer",
      detail: "Complex onchain data rendered so the product gets easier to understand - and UX gaps flagged before they ship.",
    },
  ],
  closing: {
    line: "You want 'ready for review' to mean production-ready. Same. Let's ship.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    whatsapp: "+91 7299603606",
    resumeUrl: "/Sujin-K-Resume.pdf",
  },
  unlisted: true,
};
