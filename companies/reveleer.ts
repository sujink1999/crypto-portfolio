import type { CompanyPitch } from "./types";

export const reveleer: CompanyPitch = {
  slug: "reveleer",
  company: "Reveleer",
  role: "Full Stack AI Engineer",
  accent: "#E15B44",
  accentFrom: "#F4907C",
  story: [
    "Getting AI to read medical records is one of the **highest stakes problems** in software right now. You shipped **EVE** with **3,300+ clinician-authored rules** behind it, so every suspected diagnosis stays **checkable by a human**.",
    "I co-founded Vanta, a health platform, and built its AI coach: a **tool-calling agent with 18+ tools** reasoning over months of biomarkers and **Garmin and WHOOP** data. It proposes actions and protocols backed by the user's own **medical history** and **clinically validated research**.",
    "You're hiring one engineer to move across the whole stack, **React to Node to the model layer**. Everything below is that work.",
  ],
  requirements: [
    {
      label: "React / TypeScript",
      need: "Hands-on experience with ReactJS, CSS, JavaScript and TypeScript",
      proofs: ["vanta-os", "keom", "society-mobile"],
      claim:
        "Vanta ships on Next.js 16 and React 19: biomarker dashboards, PDF lab viewers, the coach UI. React since 2019.",
      stackMatch: ["Next.js 16", "React 19", "TypeScript"],
    },
    {
      label: "Node / MongoDB",
      need: "Hands-on experience with NodeJS and MongoDB",
      proofs: ["vanta-os", "beans"],
      claim:
        "Six years of Node in production: Vanta's Express APIs, Beans workers moving $100k+ an hour, a document-AI backend on MongoDB.",
      stackMatch: ["Express 5", "Drizzle"],
    },
    {
      label: "Large-scale systems",
      need: "5+ years building high quality code and infrastructure; 3+ years working on large-scale systems",
      proofs: ["mudrex", "keom"],
      claim:
        "Mudrex, built solo, scaled to 10M+ downloads. Keom's frontends held $10M TVL. 6+ years across the stack.",
    },
    {
      label: "AWS / Cloud",
      need: "2+ years hands-on experience with AWS and Google Cloud",
      proofs: ["beans"],
      claim:
        "Beans decoded on-chain events through Lambda and SQS on AWS. Caddi's bridge API ran on Elastic Beanstalk across 15 mainnets.",
    },
    {
      label: "End-to-end ownership",
      need: "Passion for building customer-centric product experiences, backend to delightful frontend UX, partnering on ML-driven systems",
      proofs: ["vanta-os", "society-mobile"],
      claim:
        "I co-founded Vanta and built all of it: agentic coach, data model, Express APIs, dashboards, App Store app.",
    },
  ],
  closing: {
    line: "You're building AI clinicians can audit. I'd like to build it with you.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    whatsapp: "+91 7299603606",
    resumeUrl: "/Sujin-K-Resume.pdf",
  },
  unlisted: true,
};
