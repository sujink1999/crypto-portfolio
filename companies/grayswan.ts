import type { CompanyPitch } from "./types";

export const grayswan: CompanyPitch = {
  slug: "grayswan",
  company: "Gray Swan",
  role: "Full Stack Software Engineer",
  accent: "#ef4444",
  hook: "You're writing the threat model for AI. I've spent six years shipping in crypto, where the attacker is part of the spec.",
  story: [
    "Red-teaming frontier models is the most interesting security problem there is right now, and you're doing it with **~50 people**.",
    "I've built end to end my whole career - frontend, APIs, data layer, same person - most of it in **DeFi, where a bug means drained funds** and someone is always probing.",
    "Small team, no hand-holding, real adversaries. That's the room I work best in.",
  ],
  requirements: [
    {
      label: "TypeScript + frontend",
      need: "Proficiency in TypeScript; experience with frontend frameworks such as React, Vue, or Svelte; solid HTML and CSS",
      proofs: ["vanta-os", "beans", "keom"],
      claim: "Six years of TypeScript frontends, shipped and live - the work is below, take a look.",
      stackMatch: ["React", "Next.js 16", "TypeScript"],
    },
    {
      label: "Backend APIs + databases",
      need: "Hands-on experience building backend APIs; knowledge of database systems (SQL or NoSQL)",
      proofs: ["vanta-os", "beans", "keom"],
      claim: "Express APIs, Postgres with Drizzle, Redis queue workers, serverless on Lambda - built and run in production, same role as the frontend.",
    },
    {
      label: "AI-driven applications",
      need: "Collaborate with our ML research team to integrate AI experiences into our products",
      proofs: ["vanta-os", "beans"],
      claim: "LLM daily-plan generation with an eval harness, an AI chat coach, Claude-driven media pipelines with human-in-loop review - shipped, not prototyped.",
    },
    {
      label: "Security mindset",
      need: "Applying your security mindset to AI, where the threat model is still being written",
      proofs: ["keom", "beans", "vanta-os"],
      claim: "Grew a lending protocol frontend from $500k to $10M TVL - every input hostile, every bug an exploit. Adversarial thinking came with the territory.",
    },
    {
      label: "Owning work, moving fast",
      need: "Comfortable owning work without a lot of process or hand-holding; balance speed with sustainability",
      proofs: ["vanta-os", "mudrex", "society-mobile"],
      claim: "Built Mudrex's app solo from zero to 10M+ downloads. Co-founded Vanta and shipped the whole product surface - 39 phased rollouts logged.",
    },
  ],
  plan90: [
    {
      phase: "Days 1-30",
      goal: "Ship in the product",
      detail: "Take real tickets across the arena/platform UI and the APIs behind it - learn Svelte and the stack by shipping in it.",
    },
    {
      phase: "Days 31-60",
      goal: "Own a surface",
      detail: "Take one product surface end to end - UI, API, Mongo - and make it faster and easier to build on.",
    },
    {
      phase: "Days 61-90",
      goal: "Bridge to research",
      detail: "Pair with the ML team on one research-to-product integration and leave the pipeline better documented than I found it.",
    },
  ],
  closing: {
    line: "You're deciding how the world deploys AI safely - I'd like to build that with you.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    resumeUrl: "/Sujin-K-Resume.pdf",
    whatsapp: "+91 7299603606",
  },
  unlisted: true,
};
