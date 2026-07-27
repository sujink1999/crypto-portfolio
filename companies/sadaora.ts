import type { CompanyPitch } from "./types";

export const sadaora: CompanyPitch = {
  slug: "sadaora",
  company: "Sadaora",
  role: "Founding Product Engineer (Frontend)",
  accent: "#f0c75e",
  hook: "You're building an AI platform that helps people improve their lives. I've spent the last year shipping exactly that.",
  story: [
    "I read the Idii pitch twice, because it sounded familiar -",
    "an AI-native product for **making better decisions and continuously improving**.",
    "I've spent the last year building that exact category: **biomarker dashboards, an AI coach, LLM pipelines with evals** - end to end, in production.",
    "So this isn't a translation exercise. It's the same problem, and I already love it.",
  ],

  requirements: [
    {
      label: "Elegant, responsive user experiences",
      need: "Designing and building elegant, responsive user experiences; developing design systems and interaction patterns; improving performance and responsiveness",
      proofs: ["vanta-os", "beans"],
      claim: "Elegant, responsive experiences are my whole portfolio - design systems that survived five app surfaces.",
    },
    {
      label: "5+ years production React",
      need: "5+ years building production React applications with strong expertise in modern JavaScript and TypeScript; frontend architecture and state management",
      proofs: ["keom", "mudrex"],
      claim: "Six years of production React and TypeScript - all of it live, all of it mine.",
      stackMatch: ["React", "TypeScript", "React Native"],
    },
    {
      label: "Intuitive interfaces for AI workflows",
      need: "Creating intuitive interfaces for AI-powered workflows, collaborating with AI engineers to translate complex intelligence into simple, delightful experiences",
      proofs: ["vanta-os", "keom"],
      claim: "I've already built the intuitive interface between an LLM and a person's daily life.",
    },
    {
      label: "The future mobile experience",
      need: "Helping define the future mobile experience for Idii. (React Native)",
      proofs: ["society-mobile", "mudrex"],
      claim: "Two consumer apps shipped to the stores - your mobile roadmap isn't hypothetical to me.",
    },
  ],
  plan90: [
    {
      phase: "The pilot",
      goal: "Ship for your first customers",
      detail: "Take real surface area in the strategic pilot - features shipped, performance tightened, no ramp-up theater.",
    },
    {
      phase: "Then",
      goal: "Own the product experience",
      detail: "Component library, interaction patterns, the standard for how Idii feels - the frontend becomes a lane, not a queue.",
    },
    {
      phase: "If we fit",
      goal: "Founding engineer, for real",
      detail: "You said shared execution over interviews. Same. Let the pilot be the interview.",
    },
  ],
  closing: {
    line: "You're looking for proof through execution. This page is the warm-up - let's do the real thing.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    resumeUrl: "/Sujin-K-Resume.pdf",
    whatsapp: "+91 7299603606",
  },
  unlisted: true,
};
