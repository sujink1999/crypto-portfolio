import type { CompanyPitch } from "./types";

/** Demo/prototype pitch - used to lock the design. Not a real application. */
export const acme: CompanyPitch = {
  slug: "acme",
  company: "Acme",
  role: "Senior Full-Stack Engineer",
  accent: "#7c8cf8",
  hook: "You're building onchain infra people actually use. I've shipped that, end to end.",
  story: [
    "I've been following what you're building -",
    "real onchain infrastructure, shipped fast, without the noise.",
    "That's exactly how I like to work.",
  ],
  requirements: [
    {
      label: "React / TS / Node",
      need: "5+ years building production web apps with React / TypeScript / Node",
      proofs: ["keom", "vanta-os", "mudrex"],
      claim: "Six-plus years of React, TypeScript and Node - all of it in production.",
      stackMatch: ["React", "TypeScript", "Node", "Next.js"],
      note: "Near-solo author on live-TVL DeFi frontends for two years - 84 of 91 commits on the margin dApp. Production wasn't a milestone, it was the default state.",
    },
    {
      label: "On-chain programs",
      need: "Deep experience with onchain programs and DeFi protocols",
      proofs: ["beans", "keom", "caddi-lambda"],
      claim: "I write the on-chain programs. I don't just call them.",
      note: "Wrote the Anchor program myself - launches, betting, staking, NFT claims - plus the bonding-curve math and a homegrown client layer on top.",
    },
    {
      label: "Serverless backend",
      need: "Design and operate serverless backend services",
      proofs: ["caddi-lambda", "queues", "beans"],
      claim: "Serverless in production - Lambda, end to end.",
      note: "Caddi's swap-and-bridge widget ran entirely on AWS Lambda microservices in production - route comparison across providers with not a single always-on server.",
    },
    {
      label: "End-to-end ownership",
      need: "Own features end-to-end, from data model to pixels",
      proofs: ["vanta-os", "society-mobile", "beans"],
      claim: "Data model to pixels. I own the whole slice.",
      note: "Vanta OS is mine end to end: schema, reconciliation engine, LLM pipeline with evals, and every micro-interaction on top of it.",
    },
    {
      label: "Reliability",
      need: "Care about reliability: queues, retries, tests",
      proofs: ["queues", "keom", "oss"],
      claim: "Queues, retries, backups, tests - by default.",
      note: "BullMQ workers with retries, backups and Jest coverage - built in weeks, run like it matters.",
    },
  ],
  plan90: [
    {
      phase: "Days 1–30",
      goal: "Ship something real",
      detail: "Small surface, full depth - one feature through your whole stack to learn how you build.",
    },
    {
      phase: "Days 31–60",
      goal: "Own a lane",
      detail: "Take a subsystem off someone's plate completely - including the pager for it.",
    },
    {
      phase: "Days 61–90",
      goal: "Raise the ceiling",
      detail: "The thing that's been on the backlog because nobody had bandwidth - that's mine.",
    },
  ],
  closing: {
    line: "That's the case. I'd love to talk.",
    email: "lksujins@gmail.com",
    calendarUrl: "https://cal.com/sujink",
    whatsapp: "https://wa.me/10000000000",
    github: "https://github.com/sujink1999",
  },
  unlisted: true,
};
