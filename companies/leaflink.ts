import type { CompanyPitch } from "./types";

export const leaflink: CompanyPitch = {
  slug: "leaflink",
  company: "LeafLink",
  role: "Senior Full Stack Engineer (Frontend Leaning)",
  accent: "#8b93ff",
  story: [
    "A wholesale marketplace is one of the hardest frontend problems there is - **dense data, real money**, users who live in it all day.",
    "I've spent six years shipping exactly that: **trading UIs holding $10M**, marketplaces, daily dashboards.",
    'And yes, I\'m genuinely curious about the business of "grass" from your JD xD',
  ],
  requirements: [
    {
      label: "Vue 3, TypeScript, reusable components",
      need: "Deep experience with Vue.js (Vue 3, Composition API), strong TypeScript; reusable components, patterns, and frontend architecture that improve developer velocity",
      proofs: ["society-mobile", "keom", "mudrex"],
      claim: "Vue 3, TypeScript, reusable components - design systems that survived five app surfaces.",
      stackMatch: ["TypeScript", "Vue"],
    },
    {
      label: "Rich, complex user experiences",
      need: "5+ years working in rich, complex, and ever-evolving front-end user experiences; improve application performance, accessibility, responsiveness, and reliability",
      proofs: ["vanta-os", "keom", "beans"],
      claim: "Six years of rich, complex front-end experiences - live, fast, and mine end to end.",
    },
    {
      label: "Backend services and APIs in Python",
      need: "Professional experience building backend services and APIs in Python; relational databases; high-quality tests across the stack",
      proofs: ["beans", "vanta-os"],
      claim: "I build the backend services and APIs behind my frontends - tested across the stack.",
    },
    {
      label: "AI-powered development, Claude",
      need: "Use AI-powered development tools, including Claude, to accelerate design, implementation, testing, debugging, and review",
      proofs: ["keom", "vanta-os", "beans"],
      claim: "Claude isn't a tool I've tried - it's how I ship, and I build with LLMs in the product too.",
    },
  ],
  plan90: [
    {
      phase: "Days 1-30",
      goal: "Ship inside the overhaul",
      detail: "Take real tickets in the platform buildout - learn the Vue 3 codebase by contributing to it, not by reading about it.",
    },
    {
      phase: "Days 31-60",
      goal: "Own a surface",
      detail: "Take a product surface end to end - UI, API, Python service - and leave reusable components and patterns behind me.",
    },
    {
      phase: "Days 61-90",
      goal: "Raise the velocity",
      detail: "Contribute AI workflows, testing patterns, and review standards the whole team ships faster on.",
    },
  ],
  closing: {
    line: "You're rebuilding the platform an industry runs on - I'd like to help carry it.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    resumeUrl: "/Sujin-K-Resume.pdf",
    whatsapp: "+91 7299603606",
  },
  unlisted: true,
};
