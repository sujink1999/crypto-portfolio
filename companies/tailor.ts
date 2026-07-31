import type { CompanyPitch } from "./types";

export const tailor: CompanyPitch = {
  slug: "tailor",
  company: "Tailor",
  role: "Senior Frontend Engineer",
  accent: "#5b5bd6",
  accentFrom: "#8f8fe8",
  story: [
    "At Vanta I built a store on **headless Shopify**. Then I spent months gluing the operations together around it: orders, lab bookings, fulfillment, referrals, admin. I was hand-building the thing you sell.",
    "I've been shipping for **6+ years**: a YC-backed trading app built solo to **10M+ downloads**, DeFi frontends holding **$10M**, and Vanta, a health platform where I built the entire product end to end.",
    "Most of that work is exactly what this role is: consoles, dashboards, and component systems that other people build on. This page is me showing, not telling.",
  ],
  requirements: [
    {
      label: "React / TS",
      need: "Deep expertise in React and TypeScript, 5+ years of professional frontend development",
      proofs: ["vanta-os", "mudrex", "keom"],
      claim: "6+ years of it: 10M+ downloads at Mudrex, then Vanta on Next.js 16 and React 19.",
      stackMatch: ["React 19", "Next.js 16", "TypeScript", "React Native"],
    },
    {
      label: "Design systems",
      need: "Experience building design systems, component libraries, or developer-facing tools",
      proofs: ["vanta-os", "society-mobile"],
      claim: "Built Vanta's design system twice: web library across five surfaces, mobile atomic system in Skia.",
      stackMatch: ["React 19", "Tailwind", "Shopify Skia"],
    },
    {
      label: "Console",
      need: "Build and improve Tailor's Console, the primary interface for developers configuring and managing their applications",
      proofs: ["vanta-os", "keom"],
      claim: "Vanta's dashboards and admin surfaces, plus DeFi frontends where a misread number costs money.",
      stackMatch: ["Next.js 16", "React", "TypeScript"],
    },
    {
      label: "Headless",
      need: "Experience building on headless/composable platforms or enterprise software",
      proofs: ["society-mobile", "beans"],
      claim: "Vanta's store runs on headless Shopify: storefront, embedded admin app, App Bridge.",
      stackMatch: ["Shopify App Bridge", "Jupiter", "Raydium"],
    },
    {
      label: "Shipped",
      need: "You've shipped production software to real users and understand the difference between code and product",
      proofs: ["mudrex", "vanta-os", "beans"],
      claim: "10M+ downloads, a live App Store app, 39 phased rollouts. Operated, not just merged.",
      stackMatch: ["React Native", "Next.js 16"],
    },
  ],
  closing: {
    line: "The Console is the part of Tailor developers will touch every day. That's the part I want to build.",
    email: "lksujins@gmail.com",
    github: "https://github.com/sujink1999",
    resumeUrl: "/Sujin-K-Resume.pdf",
    whatsapp: "+91 7299603606",
  },
  unlisted: true,
};
