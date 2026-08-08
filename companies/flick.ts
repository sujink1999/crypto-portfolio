import type { CompanyPitch } from "./types";

/**
 * Flick (YC F25) - AI-native filmmaking platform. "We Handle AI. You Direct
 * Films." Founding frontend engineer role: architect the editor UI from
 * scratch (canvas, timeline, node graph, playback). Story leads with the
 * context insight; reel-editor is the collision exhibit.
 */
export const flick: CompanyPitch = {
  slug: "flick",
  company: "Flick",
  role: "Senior/Staff Frontend Engineer",
  accent: "#f0b429",
  story: [
    "Every shot in your workspace **costs real money** to generate. So the system has to remember what it already has, in detail. **The cut is downstream of context.**",
    "I built **my own editor** on that idea. Cheap models read every clip once, **word by word, frame by frame**, into a database. The AI writes the cut by querying that memory, not by rewatching video.",
    "The rest of this page is **your JD, mapped to what I've shipped**.",
  ],
  requirements: [
    {
      label: "Editor-grade interfaces",
      need: "Architect and develop the editor UI from scratch: canvas, timeline, node graph, playback",
      proofs: ["reel-editor", "beans", "vanta-os"],
      claim:
        "I built an AI editor that reads every take's transcript, writes the cut, and renders the reel. 40+ videos shipped through it.",
      stackMatch: ["Remotion", "Next.js 15", "React 19"],
    },
    {
      label: "Performance and client state",
      need: "High-performance web apps with scalable UI architecture and large client-side state",
      proofs: ["keom", "beans"],
      claim:
        "Keom's margin dApp held oracle prices, open positions, and multi-wallet state consistent live, a stale frame costing real money.",
      stackMatch: ["React", "TypeScript"],
    },
    {
      label: "Modern React and TypeScript",
      need: "Strong modern front-end tooling: React, TypeScript, build systems, code quality practices",
      proofs: ["vanta-os", "society-mobile"],
      claim:
        "Vanta ships on Next.js 16, React 19, and Tailwind, server components in production across the Health OS dashboards and coach.",
      stackMatch: ["Next.js 16", "React 19"],
    },
    {
      label: "Founding ownership",
      need: "Critical technical and product decisions as part of the founding team",
      proofs: ["vanta-os", "mudrex"],
      claim:
        "I co-founded Vanta and took the community app, the Health OS, and the marketplace from idea to production.",
      stackMatch: ["LLM pipelines", "React Native"],
    },
  ],
  closing: {
    line: "You're changing what film creation even means. I'd like to build that with you.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    whatsapp: "+91 7299603606",
    resumeUrl: "/Sujin-K-Resume.pdf",
  },
  unlisted: true,
};
