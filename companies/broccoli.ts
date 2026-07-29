import type { CompanyPitch } from "./types";

export const broccoli: CompanyPitch = {
  slug: "broccoli",
  company: "Broccoli AI",
  role: "Senior Software Engineer",
  accent: "#a78bfa",
  accentFrom: "#8bc53f",
  hook: "You want engineers who operate like mini founders. I've co-founded one, with 6+ years of production systems behind it - including a YC 0-to-1 run, solo-carrying an app to 10M downloads.",
  story: [
    "Most AI companies demo agents. You went **door-to-door in Sacramento**, met 100+ contractors, and built agents that actually answer the phone and book the job - that's the right order.",
    "I've spent **6+ years shipping production systems** - solo-carried a YC startup's app to **10M+ downloads**, and **co-founded Vanta**, a health platform built the same way you build: direct customer contact, then ship.",
    "And $0 to millions in ARR in under a year means the engineering has to hold up in the real world. That's the kind of pressure I want.",
  ],
  requirements: [
    {
      label: "Own product end-to-end",
      need: "Own major product areas end-to-end - from problem definition to production",
      proofs: ["vanta-os", "society-mobile"],
      claim: "I co-founded Vanta and owned its products from problem definition to production - frontend, Express backend, data model, App Store app.",
    },
    {
      label: "Backend, frontend, integrations",
      need: "Design and build scalable systems across backend, frontend, and integrations (e.g., ServiceTitan)",
      proofs: ["vanta-os", "keom"],
      claim: "Every layer in production: wearable-data reconciliation engine, Shopify integration, Auth0/KYC flows, Express APIs, and the frontends on top.",
      stackMatch: ["TypeScript", "Next.js 16", "Express 5", "Node.js"],
    },
    {
      label: "AI that does the work",
      need: "AI agents that actually do the work - answering phones, booking jobs, driving revenue",
      proofs: ["vanta-os", "beans"],
      claim: "Shipped LLM daily-plan generation with an eval harness, and Claude-driven agent pipelines with human-in-loop review.",
    },
    {
      label: "0 → 1 → scale",
      need: "Ability to operate in ambiguity and move from 0 → 1 → scale",
      proofs: ["mudrex", "beans"],
      claim: "Built Mudrex's app solo (YC W19) - 10M+ downloads, and it carried the company from pre-seed to Series A.",
    },
    {
      label: "Customers → product decisions",
      need: "Work directly with customers to understand workflows and translate them into product decisions",
      proofs: ["society-mobile", "vanta-os"],
      claim: "At Vanta I talked to users directly and turned it into shipped product - 39 phased rollouts logged on one engine alone.",
    },
  ],
  plan90: [
    {
      phase: "Days 1-30",
      goal: "Ship in the core product",
      detail: "Take real tickets across the agent stack and the ServiceTitan integration; learn contractor workflows by shipping in them.",
    },
    {
      phase: "Days 31-60",
      goal: "Own a product area",
      detail: "Take a major surface end-to-end - problem definition, architecture, production - and put evals around its agent behavior.",
    },
    {
      phase: "Days 61-90",
      goal: "Raise reliability",
      detail: "Harden the highest-stakes flows (calls booked, jobs scheduled) and set patterns the team can build on.",
    },
  ],
  closing: {
    line: "You're building the front office for the people who keep homes running - I want in.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    resumeUrl: "/Sujin-K-Resume.pdf",
    whatsapp: "+91 7299603606",
  },
  unlisted: true,
};
