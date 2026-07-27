import type { Requirement } from "./types";

/**
 * The recruiter-facing home page is project-led: each beat is one shipped
 * thing, named tech, real numbers. Vanta leads. Proofs are limited to
 * entries with a real exhibit (video, live iframe or screenshot).
 */
export const GENERIC_REQUIREMENTS: Requirement[] = [
  {
    label: "Vanta",
    need: "Health-tech ecosystem: Vanta OS, the Society platform, and a live App Store app",
    proofs: ["vanta-os", "society-mobile"],
    claim: "Co-founded Vanta. Built the OS, the platform, and the mobile app.",
    note: "Next.js 16, React 19, Express 5, Drizzle, Expo. LLM daily-plan pipeline with an eval harness, a wearable-data reconciliation engine, and the Society app live on the App Store.",
  },
  {
    label: "Beans",
    need: "Solana token launcher rendered as a Windows-95 desktop",
    proofs: ["beans"],
    claim: "Wrote the Anchor program in Rust: launches, betting, staking, NFT claims.",
    note: "Custom bonding-curve math with bankrun simulation tests, multi-DEX routing across Jupiter, Raydium and pump.fun. Next.js frontend with matter-js physics.",
  },
  {
    label: "Keom / 0VIX",
    need: "Money-market and margin-trading protocol frontends on Polygon zkEVM",
    proofs: ["keom"],
    claim: "Grew DeFi frontends from $500k to $10M TVL. 84 of 91 commits mine.",
    note: "React, TypeScript, Pyth oracles, Celer bridge, Cypress e2e. Primary author on the margin-trading frontend too - 55 of 61 commits, Algebra AMM, i18n.",
  },
  {
    label: "Caddi",
    need: "Chrome extension: swap and bridge from any website",
    proofs: ["caddi-lambda"],
    claim: "Swap-and-bridge extension running fully on AWS Lambda microservices.",
    note: "Route comparison across aggregators with zero always-on servers. Next.js, browser extension APIs, and Farcaster Frames back when they launched in early 2024.",
  },
];
