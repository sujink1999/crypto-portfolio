import type { OldLabDraft } from "./index";

export const meridianDraft: OldLabDraft = {
  slug: "meridian",
  company: "Meridian",
  role: "Senior Frontend Engineer, Design Systems",
  size: "500+",
  register: "big",
  jdSummary:
    "Meridian (project management SaaS, 800 people, public company): 2M daily users across web and mobile. Hiring a Senior Frontend Engineer on the Design Systems team: own components used by 60 product engineers, accessibility, performance budgets, migration of a legacy UI kit. React, TypeScript. Remote-friendly, structured eng org with staff-level review culture.",
  story: [
    [
      {
        angle: "budgets",
        text: "**2M people** open Meridian every day, and the components they all touch belong to one team. You're hiring the person **60 product engineers** build on.",
      },
      {
        angle: "migration",
        text: "Meridian is a **public company of 800** still carrying a **legacy UI kit**, and you put its retirement in the JD. That reads as intent, not aspiration.",
      },
      {
        angle: "platforms",
        text: "You run a **staff-level review culture**, and you're pointing it at the layer under **60 engineers**: one shared component set for web and mobile, held to review, not habit.",
      },
    ],
    [
      {
        angle: "system",
        text: "I built Vanta's design system **twice**: a web component library shared across e-commerce, lab booking, and admin surfaces, and a **mobile atomic system in Skia**.",
      },
      {
        angle: "platform",
        text: "At Beans I shipped a Solana trading platform styled as a **retro desktop OS**: draggable windows, live charts, trading flows, real money moving underneath the whole time.",
      },
      {
        angle: "reach",
        text: "I built Mudrex's app **solo** in React Native: one engineer's component decisions carrying an entire consumer trading app, every screen, every state.",
      },
    ],
    [
      {
        angle: "surface",
        text: "I've spent my whole career on this layer: the components other engineers build their features on. Here's your JD mapped to what I've shipped.",
      },
      {
        angle: "mission",
        text: "You're hiring one engineer whose real output is everyone else's speed. The rest of this page maps your JD to the systems behind my shipped work.",
      },
      {
        angle: "judgment",
        text: "Design systems are judgment work: what to standardize, what to leave alone. Below is your JD, mapped to those calls made in production.",
      },
    ],
  ],
  claims: [
    {
      label: "Design systems at scale",
      need: "Own the component library 60 product engineers ship on",
      variants: [
        {
          angle: "twice",
          text: "I built Vanta's design system twice: a web component library shared across the product, and a mobile atomic system in Skia.",
        },
        {
          angle: "surfaces",
          text: "Vanta's component library serves e-commerce, lab booking, and admin dashboards from one shared set. One system, four very different surfaces.",
        },
        {
          angle: "tenure",
          text: "Six years of production React and TypeScript: Mudrex built solo to 10M+ downloads, now Vanta on Next.js 16 and React 19.",
        },
      ],
    },
    {
      label: "Components others build on",
      need: "APIs and primitives other engineers depend on daily",
      variants: [
        {
          angle: "unattended",
          text: "Beans ran launches, trades, and withdrawals through shared services the whole platform called, unattended, with real money moving through them.",
        },
        {
          angle: "foundation",
          text: "I built Mudrex's React Native app from scratch: the codebase the company carried from pre-seed through Series A.",
        },
        {
          angle: "state",
          text: "Keom's margin dApp held $10M while keeping live oracle prices, positions, and multi-wallet state consistent across every screen.",
        },
      ],
    },
    {
      label: "Performance and accessibility",
      need: "Performance budgets and accessibility across web and mobile",
      variants: [
        {
          angle: "reach",
          text: "Mudrex shipped in React Native, solo, to 10M+ downloads. At that reach, one dropped frame repeats across millions of sessions.",
        },
        {
          angle: "stakes",
          text: "Keom streamed live oracle prices into a margin dApp holding $10M. A slow render there costs users real money.",
        },
        {
          angle: "density",
          text: "Beans put a live trading platform inside a retro desktop OS in the browser: draggable windows, streaming charts, price feeds, one screen.",
        },
      ],
    },
    {
      label: "Senior in a structured org",
      need: "Staff-level review culture and structured processes",
      variants: [
        {
          angle: "gates",
          text: "Vanta's coach ships behind an eval harness: live-model evals run three times, majority pass. Keom held $10M under Cypress e2e coverage.",
        },
        {
          angle: "cadence",
          text: "At Mudrex, a YC startup, I shipped product features in step with founders and design, pre-seed through Series A.",
        },
        {
          angle: "stakes",
          text: "Beans workers executed launches, trades, and withdrawals unattended, moving more than $100k an hour with no human watching the queue.",
        },
      ],
    },
  ],
};
