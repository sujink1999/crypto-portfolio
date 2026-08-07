import type { CompanyPitch } from "./types";

export const numeral: CompanyPitch = {
  slug: "numeral",
  company: "Numeral",
  role: "Software Engineer (AI)",
  accent: "#E7E5E4",
  accentFrom: "#FAFAF9",
  story: [
    "You filed **150,000+ sales tax returns** and processed **$5B+ in volume** before turning the work over to agents. Building the manual version first is how automation earns trust.",
    "I've spent the last year living in this stack: **tool-calling agents, orchestration, durable memory, evals**, all hand-built and in production, plus agents writing a big share of the code I ship.",
    "An agent that files real returns can't be a demo: it needs **guardrails, evals, and a human yes** on anything that matters. Here's your JD mapped to what I've shipped.",
  ],
  requirements: [
    {
      label: "LLM systems",
      need: "2+ years of working with LLMs; design, build, and operate production AI systems: tool-calling agents, orchestration, RAG",
      proofs: ["vanta-os"],
      claim:
        "Vanta's coach is a tool-calling agent with 18+ tools, durable memory with supersession, shipped behind an eval harness.",
      stackMatch: ["LLM pipelines"],
    },
    {
      label: "Postgres / Redis / AWS",
      need: "Proficiency with PostgreSQL, Redis, and AWS",
      proofs: ["beans", "vanta-os"],
      claim:
        "Postgres with Drizzle behind everything at Vanta. Beans ran Bull and Redis workers moving $100k+ an hour on AWS.",
      stackMatch: ["Drizzle", "Express 5"],
    },
    {
      label: "TypeScript",
      need: "Experience with TypeScript",
      proofs: ["vanta-os", "society-mobile", "beans"],
      claim:
        "TypeScript at every layer for six years: Vanta's Next.js 16 frontend and Express APIs, Beans workers, React Native apps.",
      stackMatch: ["Next.js 16", "React 19", "Expo / React Native"],
    },
    {
      label: "7+ years, high growth",
      need: "7+ years of experience building products in high-growth settings",
      proofs: ["mudrex", "keom"],
      claim:
        "Mudrex solo from pre-seed through Series A to 10M+ downloads. Then DeFi frontends holding $10M. 6+ years shipping.",
    },
    {
      label: "Product sensibility",
      need: "Demonstrated product sensibility",
      proofs: ["society-mobile", "mudrex"],
      claim:
        "Two consumer apps shipped to the stores: Mudrex at 10M+ downloads, Vanta Society live on the App Store.",
    },
  ],
  closing: {
    line: "You made the least glamorous problem in commerce an AI product. I'd like to build the next piece.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    whatsapp: "+91 7299603606",
    resumeUrl: "/Sujin-K-Resume.pdf",
  },
  unlisted: true,
};
