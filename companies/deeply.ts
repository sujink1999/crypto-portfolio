import type { CompanyPitch } from "./types";

export const deeply: CompanyPitch = {
  slug: "deeply",
  company: "Deeply",
  greetName: "Felix",
  role: "Senior Product Builder",
  accent: "#608958",
  accentFrom: "#93b48d",
  story: [
    "The assessment is a strong **acquisition** play. Seven minutes and a couple knows their **bottleneck**. But conversion and retention live in what happens after, and I think that part is **accountability made into a game**, two people with a real reason to come back every day.",
    "I've built exactly that, and I **love this problem**. **Vanta Society** is an accountability app live on the App Store, built to keep people showing up for their health. Before it I built **Mudrex**, a YC trading app, **solo to 10M+ downloads**.",
    "You're hiring one person to carry the whole loop, insight to shipped product. The rest of this page is your JD mapped to what I've built.",
  ],
  requirements: [
    {
      label: "Own the whole loop",
      need: "Owned an end-to-end product loop: customer insight through production, with real decisions made as a founder or early employee",
      proofs: ["vanta-os", "mudrex", "society-mobile"],
      claim:
        "I co-founded Vanta and built it end to end: data model, Express APIs, dashboards, App Store app. One person, whole loop.",
      stackMatch: ["Next.js 16", "Express 5", "Expo / React Native"],
    },
    {
      label: "AI tools with judgment",
      need: "Fluent, judgment-driven use of AI coding tools: knowing when to trust and when to override the output",
      proofs: ["vanta-os", "beans"],
      claim:
        "My whole workflow runs on Claude Code; Vanta and this page were built with it. I know exactly what it can't do.",
      stackMatch: ["LLM pipelines", "Drizzle"],
    },
    {
      label: "Founder background",
      need: "A founder or very-early-employee background: someone who has made product decisions alone and lived with them",
      proofs: ["beans", "mudrex", "vanta-os"],
      claim:
        "Co-founded Vanta. Senior founding engineer at Beans, a launchpad moving over $100k an hour. Mudrex: solo, pre-seed to Series A.",
      stackMatch: ["Rust / Anchor", "React Native"],
    },
    {
      label: "Consumer product craft",
      need: "Turn customer insight into a product people feel: UX, prototype, implementation, iteration",
      proofs: ["society-mobile", "mudrex"],
      claim:
        "Vanta Society is live on the App Store: community, streaks, shareable cards, a full atomic design system in Skia, built and iterated by me.",
      stackMatch: ["Shopify Skia", "Expo / React Native", "FlashList"],
    },
  ],
  closing: {
    line: "The assessment finds what's stuck. I'd love to build what keeps people showing up to fix it.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    whatsapp: "+91 7299603606",
    resumeUrl: "/Sujin-K-Resume.pdf",
  },
  unlisted: true,
};
