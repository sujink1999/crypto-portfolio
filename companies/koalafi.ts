import type { CompanyPitch } from "./types";

export const koalafi: CompanyPitch = {
  slug: "koalafi",
  company: "Koalafi",
  role: "Fullstack Engineer",
  accent: "#7a5af8",
  accentFrom: "#b09aff",
  hook: "Financing for the 40% of people banks turn away, delivered in the ten seconds they're standing at checkout. Unglamorous, load-bearing, genuinely useful. My kind of product.",
  story: [
    "I've been shipping for **6+ years**: a YC-backed trading app built solo to **10M+ downloads**, DeFi frontends holding **$10M**, and Vanta, a health platform I co-founded and built end to end.",
    "A lot of that work rhymes with yours: Express APIs and queue workers in production, OCR and transaction classification at FincorpX, KYC and compliance flows at TokenFolio. Money software, where a misread number costs someone real dollars.",
    "One honest note: my backend languages are Node and Python, not Go yet. The APIs, data models, and distributed patterns transfer; the syntax is the small part.",
  ],
  requirements: [
    {
      label: "React / TS",
      need: "Experience developing web applications with modern frontend frameworks such as React and TypeScript",
      proofs: ["vanta-os", "mudrex", "keom"],
      claim: "6+ years of it: Mudrex built solo to 10M+ downloads, then Vanta on Next.js 16 and React 19.",
      stackMatch: ["React 19", "Next.js 16", "TypeScript", "React Native"],
    },
    {
      label: "Backend APIs",
      need: "Proficiency in building backend services using Golang; REST APIs, HTTP/JSON, authentication mechanisms",
      proofs: ["vanta-os", "beans", "keom"],
      claim: "Express 5 APIs at Vanta, Lambda microservices at Caddi, a document-AI backend at FincorpX.",
      stackMatch: ["Express 5", "AWS Lambda", "Node.js", "Drizzle"],
    },
    {
      label: "Event-driven",
      need: "Participate in the design and implementation of distributed systems, workflows, and event-driven architectures",
      proofs: ["beans", "vanta-os"],
      claim: "Built a BullMQ and Redis launch pipeline that ran unattended: workers, retries, backups, tests. Shipped in weeks.",
      stackMatch: ["BullMQ", "Redis", "Jest", "Serverless"],
    },
    {
      label: "Fintech",
      need: "Contribute to security, compliance, and audit activities; deliver seamless, reliable, and secure financial services",
      proofs: ["keom", "mudrex"],
      claim: "FincorpX: OCR plus ML transaction classification in production. TokenFolio: Onfido KYC, Auth0, allocation and staking mechanics.",
      stackMatch: ["Azure Form Recognizer", "Onfido", "Auth0", "Python / sklearn"],
    },
    {
      label: "Ownership",
      need: "Ability to navigate existing codebases and contribute effectively to both new and established systems",
      proofs: ["keom", "vanta-os"],
      claim: "Inherited keom-dapp with $10M TVL live and became its author: 84 of 91 commits, oracles, bridges, e2e tests.",
      stackMatch: ["React", "TypeScript", "Cypress", "Pyth"],
    },
  ],
  closing: {
    line: "The checkout moment only works if everything behind it does. That's the part I want to build.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    resumeUrl: "/Sujin-K-Resume.pdf",
    whatsapp: "+91 7299603606",
  },
  unlisted: true,
};
