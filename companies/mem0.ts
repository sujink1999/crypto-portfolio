import type { CompanyPitch } from "./types";

export const mem0: CompanyPitch = {
  slug: "mem0",
  company: "Mem0",
  role: "Full Stack Engineer",
  accent: "#a78bfa",
  accentFrom: "#f0abfc",
  story: [
    "Every AI product forgets its user the moment the turn ends. You're building the missing piece: **memory as infrastructure**.",
    "I hit your exact problem at Vanta, the health platform I co-founded: an agent that has to remember **months of a person's health**. So I built ChatGPT-style memory by hand.",
  ],
  storyWidget: "memory",
  requirements: [
    {
      label: "Agent memory",
      need: "Experience building AI-native products using LLMs, RAG, embeddings, or vector databases",
      proofs: ["vanta-os", "society-mobile"],
      claim: "I've built what you sell: agent memory with durable facts, rollups and snapshots, shipped inside Vanta.",
      stackMatch: ["Agent memory", "LLM pipelines"],
    },
    {
      label: "End-to-end ownership",
      need: "Ship end-to-end features: design APIs, build intuitive UIs, implement backend services, own data models, and deploy production-ready software",
      proofs: ["vanta-os", "mudrex"],
      claim: "I built Vanta end to end: data model, Express APIs, dashboards, App Store. Before that: Mudrex, solo, to 10M+ downloads.",
      stackMatch: ["Next.js 16", "Express 5", "Drizzle / PostgreSQL"],
    },
    {
      label: "Scale and speed",
      need: "Optimize latency, caching, database queries, and application performance to deliver fast, reliable user experiences",
      proofs: ["mudrex", "beans"],
      claim: "Mudrex scaled to 10M+ downloads. Beans ran its launch pipeline unattended on Redis queue workers.",
      stackMatch: ["React Native", "Bull", "Redis"],
    },
    {
      label: "Quality and operations",
      need: "Write comprehensive tests, operate production systems with logging, metrics and monitoring, and keep the codebase clean",
      proofs: ["keom", "beans"],
      claim: "I ran the frontend of a lending protocol holding $10M, e2e tested, where a bug loses real money. 39 phased rollouts logged at Vanta.",
      stackMatch: ["TypeScript", "Cypress", "Jest"],
    },
    {
      label: "Next.js + backend stack",
      need: "Experience building with Next.js, React, REST APIs, PostgreSQL, Redis, background job systems, and modern backend frameworks",
      proofs: ["vanta-os", "beans"],
      claim: "Vanta ships on Next.js 16, Express and PostgreSQL. Beans ran Bull and Redis workers in production.",
      stackMatch: ["Next.js 16", "React 19", "Drizzle / PostgreSQL", "Bull", "Redis"],
    },
  ],
  closing: {
    line: "Every serious AI product will need what you're building. I'd like to build it with you.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    resumeUrl: "/Sujin-K-Resume.pdf",
    whatsapp: "+91 7299603606",
  },
  unlisted: true,
  evidenceOverrides: {
    "vanta-os": {
      period: "Nov 2025 – present",
      proofPoints: [
        "Hand-built agent memory: durable facts, weekly rollups, cache-stable snapshots",
        "LLM daily-plan generation with an eval harness",
        "End-to-end ownership: product, backend, data model, micro-interactions",
      ],
      stack: [
        "Next.js 16",
        "React 19",
        "Express 5",
        "Drizzle / PostgreSQL",
        "Agent memory",
        "LLM pipelines",
      ],
    },
    "beans": {
      stack: ["Next.js", "Bull", "Redis", "Rust / Anchor", "Jest"],
    },
    "keom": {
      stack: ["React", "TypeScript", "Pyth oracles", "Cypress"],
    },
  },
};
