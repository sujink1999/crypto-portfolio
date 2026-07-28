import type { CompanyPitch } from "./types";

export const fixd: CompanyPitch = {
  slug: "fixd",
  company: "FIXD",
  role: "Senior Engineer, React Native",
  accent: "#34d399",
  hook: "You want one engineer to own AppraisalPRO end to end. That's how I've always shipped React Native apps - one of them hit 10M downloads.",
  story: [
    "I like tools that stop people from getting ripped off - a dealer seeing the **real recon cost** before the deal, not after.",
    "I've been shipping React Native apps for years: one grew to **10M+ downloads**, the latest is **live on the App Store** right now.",
    "Owning a greenfield mobile app end to end is the job I do best.",
  ],
  requirements: [
    {
      label: "Production React Native",
      need: "5+ years building and shipping production React Native apps for iOS and Android",
      proofs: ["mudrex", "society-mobile", "vanta-os"],
      claim: "Years of React Native apps built from scratch and shipped - Mudrex to 10M+ downloads, Vanta Society to the App Store.",
      stackMatch: ["React Native", "Expo / React Native", "EAS"],
    },
    {
      label: "App Store & Play Store",
      need: "Experience shipping to the App Store and Google Play",
      proofs: ["society-mobile", "mudrex"],
      claim: "Full EAS pipeline to the App Store at Vanta; Play Store releases at Mudrex through pre-seed to Series A.",
    },
    {
      label: "JavaScript / TypeScript",
      need: "Strong JavaScript/TypeScript",
      proofs: ["vanta-os", "keom", "beans"],
      claim: "Six years of TypeScript across mobile, web, and Node backends - same language, every layer.",
      stackMatch: ["TypeScript", "React", "Next.js 16"],
    },
    {
      label: "APIs & across the stack",
      need: "Building and consuming REST APIs; comfort working across the stack where needed",
      proofs: ["vanta-os", "keom", "beans"],
      claim: "I build the API and the app that consumes it - Express backends, data models, and the mobile surfaces on top.",
    },
    {
      label: "AI coding tools",
      need: "Comfortable using AI coding tools to work efficiently",
      proofs: ["vanta-os", "beans"],
      claim: "AI tooling is my daily driver - I've shipped LLM pipelines with eval harnesses, not just used the autocomplete.",
    },
  ],
  plan90: [
    {
      phase: "Days 1-30",
      goal: "Ship in the current app",
      detail: "Take real AppraisalPRO tickets, learn the scanning flow and dealer workflows by shipping in them.",
    },
    {
      phase: "Days 31-60",
      goal: "Own the greenfield architecture",
      detail: "Set the technical direction for the new app - navigation, state, native module boundaries - and ship the first surfaces on it.",
    },
    {
      phase: "Days 61-90",
      goal: "Harden the SDK",
      detail: "Make the partner-facing React Native SDK something a partner can integrate in an afternoon - docs, examples, release process.",
    },
  ],
  closing: {
    line: "You need someone to own AppraisalPRO - I'm ready when you are.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    resumeUrl: "/Sujin-K-Resume.pdf",
    whatsapp: "+91 7299603606",
  },
  unlisted: true,
};
