import type { CompanyPitch } from "./types";

export const errgo: CompanyPitch = {
  slug: "errgo",
  company: "Errgo",
  role: "Senior Frontend Engineer, Query Builder & Editor Core",
  accent: "#818cf8",
  hook: "You're hiring someone to build a condition-tree engine with undo/redo. I read the JD, then built it - it's live on this site.",
  story: [
    "Most frontend roles are about surfaces. Yours is about **the engine underneath one** - pure TypeScript, React just renders and dispatches. That division is exactly how I like to build.",
    "So instead of telling you I can do it, I did it: **an immutable AND/OR condition tree with command-history undo/redo, coalescing, validation and canonical serialization** - written for this application, tests included.",
    "The rest of this page is the track record behind it.",
  ],
  requirements: [
    {
      label: "Immutable recursive structures",
      need: "Strong TypeScript and real comfort with immutable, recursive data structures",
      proofs: ["condition-tree", "beans"],
      claim: "Add, remove, duplicate, move, group - every op returns a new tree with untouched branches shared by reference. Try it live, then read the source.",
      stackMatch: ["TypeScript"],
    },
    {
      label: "Undo / redo + validation",
      need: "Experience implementing undo/redo or a command pattern, plus validation",
      proofs: ["condition-tree", "vanta-os"],
      claim: "Bounded command history, rapid edits coalesced into one undo step, redo cleared the moment a new edit lands - ids and time injected, so it's fully deterministic under test.",
    },
    {
      label: "Careful, well-typed code",
      need: "Careful, well-typed code and good test habits",
      proofs: ["condition-tree", "keom", "beans"],
      claim: "Six years of strict TypeScript where bugs meant drained funds - lending and margin frontends at $10M TVL, on-chain programs with simulation tests.",
      stackMatch: ["TypeScript", "Cypress"],
    },
    {
      label: "Builders + serialization",
      need: "Built a query or segment builder before, and comfortable with serialization and canonical forms",
      proofs: ["condition-tree", "vanta-os"],
      claim: "The engine normalizes trees to a canonical form - two builds that mean the same thing serialize identically. Same instinct behind Vanta's wearable-data reconciliation engine.",
    },
  ],
  plan90: [
    {
      phase: "Days 1-30",
      goal: "Own the tree",
      detail: "Learn the existing builder's real-world edge cases from analysts' usage, and get the operation layer fully typed and tested.",
    },
    {
      phase: "Days 31-60",
      goal: "Make undo/redo feel right",
      detail: "Tune coalescing and normalization against how analysts actually edit, with the command history as a proper reviewed spec.",
    },
    {
      phase: "Days 61-90",
      goal: "Harden the format",
      detail: "Versioned canonical serialization with migration paths, so stored audiences survive every future engine change.",
    },
  ],
  closing: {
    line: "You wrote the spec. I shipped the first draft. Let's build the real one.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    resumeUrl: "/Sujin-K-Resume.pdf",
    whatsapp: "+91 7299603606",
  },
  unlisted: true,
};
