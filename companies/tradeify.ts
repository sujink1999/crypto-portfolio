import type { CompanyPitch } from "./types";

export const tradeify: CompanyPitch = {
  slug: "tradeify",
  company: "Tradeify",
  role: "Full Stack Engineer",
  accent: "#4ade80",
  story: [
    "Trading interfaces are where I grew up as an engineer. **Live prices, real money**, users who notice every dropped frame.",
    "I've built a margin protocol that grew to **$10M TVL**, a live token-launch game, and a trading app with **10M+ downloads**.",
    "A prop firm where **performance is the product** - that's exactly the room I want to be in.",
  ],
  requirements: [
    {
      label: "Full-stack React / Next.js",
      need: "4+ years full-stack; strong frontend with React or Next.js, strong backend with Node.js",
      proofs: ["vanta-os", "keom", "beans"],
      claim: "Six years shipping React/Next frontends and the Node backends behind them - both ends, same role, every time.",
      stackMatch: ["React", "Next.js", "TypeScript", "Express 5"],
    },
    {
      label: "Real-time trading interfaces",
      need: "Implement real-time dashboards, analytics views, and trading interfaces; REST APIs and WebSocket services",
      proofs: ["keom", "beans", "mudrex"],
      claim: "Live-price margin trading, streaming launch feeds, oracle-driven dashboards - all shipped, all live.",
    },
    {
      label: "Databases, caching, events",
      need: "PostgreSQL, Redis; caching layers and event-driven architectures",
      proofs: ["beans", "vanta-os"],
      claim: "Postgres with Drizzle, Redis-backed queue workers, event-driven pipelines - built and run in production.",
    },
    {
      label: "Fintech, trading, crypto",
      need: "Experience in fintech, trading, crypto, or financial systems; real-time market data",
      proofs: ["keom", "mudrex", "beans"],
      claim: "DeFi money markets, margin trading, a 10M-download trading app - six years of it.",
    },
  ],
  plan90: [
    {
      phase: "Days 1-30",
      goal: "Ship in the hot path",
      detail: "Take real tickets across the trader-facing dashboards and the services behind them - learn the stack by shipping in it.",
    },
    {
      phase: "Days 31-60",
      goal: "Own a surface end to end",
      detail: "Take one trading surface - UI, API, data layer - and make it measurably faster and more reliable.",
    },
    {
      phase: "Days 61-90",
      goal: "Raise the bar",
      detail: "Leave behind performance budgets, observability, and patterns the whole team ships faster on.",
    },
  ],
  closing: {
    line: "You're building for traders who feel every millisecond - I'd like to build with you.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    resumeUrl: "/Sujin-K-Resume.pdf",
    whatsapp: "+91 7299603606",
  },
  unlisted: true,
};
