import type { CompanyPitch } from "./types";

export const material: CompanyPitch = {
  slug: "material",
  company: "Material",
  role: "Full-Stack Software Engineer",
  accent: "#6d3df5",
  story: [
    "At Vanta I built the **whole commerce stack** myself - the Shopify store, the admin dashboards, the backend, and the integrations that tie them together.",
    "Before that: a margin protocol that grew to **$10M TVL**, and a trading app I built from scratch to **10M+ downloads**.",
    "A small team shipping straight to real merchants - that's the setup I've done my best work in.",
  ],
  requirements: [
    {
      label: "Node.js backend services",
      need: "Strong proficiency in JavaScript/Node.js and building backend services",
      proofs: ["beans", "vanta-os"],
      claim: "Six years of Node in production - Express APIs, Redis queue workers, LLM pipelines - built and run by me.",
      stackMatch: ["Node.js", "Express", "Redis"],
    },
    {
      label: "PostgreSQL + ORM",
      need: "Comfortable with relational databases (PostgreSQL) and an ORM (we use Sequelize)",
      proofs: ["vanta-os", "beans"],
      claim: "Postgres behind everything I ship at Vanta - schema design, migrations, and the ORM layer on top.",
      stackMatch: ["PostgreSQL", "Drizzle"],
    },
    {
      label: "Third-party integrations",
      need: "Experience building or consuming REST APIs and integrating with third-party services (payments, webhooks, OAuth, etc.)",
      proofs: ["beans", "vanta-os", "society-mobile"],
      claim: "Shopify embedded apps, wearable APIs, Strava, multi-DEX routing - most of what I shipped this year was integrations.",
      stackMatch: ["Shopify App Bridge", "Strava", "Jupiter", "Raydium"],
    },
    {
      label: "React frontend",
      need: "Solid front-end skills with a modern framework (we use React/Redux)",
      proofs: ["vanta-os", "keom", "mudrex"],
      claim: "React since 2019 - biomarker dashboards, admin panels, and a lending dApp that held $10M.",
      stackMatch: ["React"],
    },
    {
      label: "Ships end to end",
      need: "You can take a project to completion independently and deliver it end-to-end",
      proofs: ["mudrex", "vanta-os", "society-mobile"],
      claim: "Mudrex: built solo to 10M+ downloads. Vanta: co-founded - data model to App Store, all mine.",
      stackMatch: ["Next.js", "React Native", "EAS"],
    },
  ],
  closing: {
    line: "Small team, real merchants, a backlog of integrations - I'd like to build them with you.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    resumeUrl: "/Sujin-K-Resume.pdf",
    whatsapp: "+91 7299603606",
  },
  unlisted: true,
  evidenceOverrides: {
    "vanta-os": {
      stack: [
        "Next.js 16",
        "React 19",
        "Node.js / Express 5",
        "Drizzle / PostgreSQL",
        "Shopify App Bridge",
      ],
    },
    "beans": {
      stack: ["Next.js", "Node.js / BullMQ / Redis", "Rust / Anchor", "Jupiter", "Raydium"],
    },
    "society-mobile": {
      stack: ["Expo / React Native", "Shopify Skia", "FlashList", "Strava API", "EAS"],
    },
  },
};
