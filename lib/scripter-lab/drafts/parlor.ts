import type { OldLabDraft } from "./index";

export const parlorDraft: OldLabDraft = {
  slug: "parlor",
  company: "Parlor",
  role: "Frontend Engineer",
  size: "10-30",
  register: "startup",
  jdSummary:
    "Parlor (consumer social games): 800,000 monthly players run party games in the browser, no install. Hiring a Frontend Engineer: game UI, animation, performance under a strict 16ms frame budget. React, TypeScript, canvas/WebGL. Remote, 20 people. 4-12 player rooms, cosmetics revenue, new game mode every quarter.",
  story: [
    [
      {
        angle: "product",
        text: "**800,000 monthly players** and not one of them installed anything. You put the whole party game inside a link: click it and you're playing.",
      },
      {
        angle: "craft",
        text: "A **frame budget** written into the job description. Most teams say performance matters; you gave it a deadline and put it in the hiring post. Party games in a browser live or die on that frame.",
      },
      {
        angle: "audience",
        text: "Rooms of **4 to 12 players**, close enough to shout at each other, and they pay for **cosmetics**: your players care how they look to the rest of the room.",
      },
    ],
    [
      {
        angle: "society",
        text: "The closest thing I've built to your UI is **Vanta Society**: custom **Skia graphics**, streaks, share cards and milestone celebrations animating over recycled feeds, live on the **App Store**.",
      },
      {
        angle: "beans",
        text: "At Beans I shipped a Solana trading platform played as a **retro desktop OS**: draggable windows, live charts, real money moving through a playful surface.",
      },
      {
        angle: "scale",
        text: "I carried Mudrex's app **alone**: built it from scratch in React Native at a YC startup and kept it fast all the way to **10M+ downloads**.",
      },
    ],
    [
      {
        angle: "ownership",
        text: "A **new game mode every quarter** means one engineer carries a feature from idea to live players, fast. Every product below shipped that way, one pair of hands. Here's your JD mapped to it.",
      },
      {
        angle: "craft",
        text: "Game feel is frontend work with the excuses removed: every dropped frame is visible to the whole room. Here's your JD, mapped to work that held up under real users.",
      },
      {
        angle: "excitement",
        text: "The best brief I've ever had was Beans: make trading feel like a game while real money moves underneath. Your JD reads like that brief on repeat. Here it is, mapped to what I've shipped.",
      },
    ],
  ],
  claims: [
    {
      label: "Game-feel UI and animation",
      need: "Game UI and animation: interfaces that feel like play, in React, TypeScript, canvas/WebGL.",
      variants: [
        {
          angle: "vanta",
          text: "I built Vanta Society's design system in **Skia**: custom-drawn streaks, share cards, and milestone celebrations, shipped to the **App Store**.",
        },
        {
          angle: "beans",
          text: "Beans is a trading platform played as a **retro desktop OS**: draggable windows, live charts, a game surface moving real money.",
        },
        {
          angle: "real-money",
          text: "At Keom I was primary author of the **margin trading dApp**: a game-like leverage UI where live prices move under real positions.",
        },
      ],
    },
    {
      label: "Performance under the frame budget",
      need: "A strict 16ms frame budget: rendering discipline, no jank, under real load.",
      variants: [
        {
          angle: "rendering",
          text: "Society renders **custom Skia graphics** over recycled FlashList feeds, built to stay smooth mid-scroll, live on the **App Store**.",
        },
        {
          angle: "browser",
          text: "Beans rendered **draggable windows** and live price charts in one browser tab, a desktop OS holding frame while real trades settled.",
        },
        {
          angle: "stakes",
          text: "At Keom every screen rendered **live oracle prices** without jank, holding **$10M TVL** where a frozen UI costs real money.",
        },
      ],
    },
    {
      label: "Consumer scale",
      need: "800,000 monthly players in 4-12 player rooms: software real crowds lean on.",
      variants: [
        {
          angle: "mudrex",
          text: "I built Mudrex's app **solo** at a YC startup and carried it to **10M+ downloads**, pre-seed through Series A.",
        },
        {
          angle: "throughput",
          text: "Beans' **Bull and Redis** workers executed launches, trades, and withdrawals unattended, real money moving with nobody watching the queue.",
        },
        {
          angle: "keom",
          text: "At Keom real crowds leaned on my screens: I led frontend of the **lending and margin trading dApps**, live prices, real positions.",
        },
      ],
    },
    {
      label: "Shipping cadence",
      need: "A new game mode every quarter: features carried from idea to live players by a small team.",
      variants: [
        {
          angle: "speed",
          text: "At Beans I shipped the whole desktop-OS trading platform in **two months**, and it moved over **$100k an hour**.",
        },
        {
          angle: "end-to-end",
          text: "I built Vanta end to end: data model, Express APIs, dashboards, **App Store** release, one engineer carrying each feature live.",
        },
        {
          angle: "brief-to-live",
          text: "Beans went from brief to **Solana mainnet** as a complete trading platform: on-chain program, worker queues, **retro desktop** frontend.",
        },
      ],
    },
  ],
};
