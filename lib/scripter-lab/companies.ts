import type { CompanyPitch } from "@/companies/types";

/**
 * Scripter lab: five fictional companies used to test and tune the copy
 * workflow. This copy was written by dispatched writer agents working ONLY
 * from the JD, research notes, and the sources listed in content/work-index.md.
 * Never registered as live pitch routes.
 */

export interface LabCompany {
  pitch: CompanyPitch;
  /** the imaginary JD + research, so the copy can be judged against something */
  jdSummary: string;
}

export const LAB_COMPANIES: LabCompany[] = [
  {
    jdSummary:
      "Ferrywork (devtools, team of 12): preview builds of mobile apps on a real device from every PR, used by 40,000 developers. Hiring a Product Engineer to own features end to end: dashboard, build orchestration UI, CLI touchpoints. React, TypeScript, Node. Fully remote, async-heavy. Research: founded 2023, bootstrapped then seed round, device-farm engineering blog, JD says you'll talk to users weekly.",
    pitch: {
      "slug": "ferrywork",
      "company": "Ferrywork",
      "role": "Product Engineer",
      "accent": "#f2a03d",
      "accentFrom": "#ffd9a8",
      "story": [
        "A preview build of the app, on a real device, from every PR. You got that into the hands of **40,000 developers** with a team of twelve, bootstrapped before the seed round.",
        "I've been the developer on the other side of that wait: I built Mudrex's app solo in React Native to **10M+ downloads**, and shipped another app through EAS to the **App Store** this year.",
        "Twelve people, fully remote, engineers who own features end to end and talk to users weekly. That's how I already work."
      ],
      "requirements": [
        {
          "label": "Own features end to end",
          "need": "A Product Engineer who owns features across dashboard, build orchestration UI, and CLI touchpoints.",
          "proofs": [
            "vanta-os",
            "mudrex",
            "beans"
          ],
          "claim": "I co-founded Vanta, a health platform, and built it alone: data model, Express APIs, dashboards, App Store release.",
          "stackMatch": [
            "React",
            "TypeScript",
            "Node"
          ]
        },
        {
          "label": "Dashboards developers live in",
          "need": "A dashboard that 40,000 developers check to see if their build passed, with live status they have to trust.",
          "proofs": [
            "keom",
            "beans",
            "vanta-os"
          ],
          "claim": "I grew a lending protocol frontend from $500k to $10M TVL: dense live data where a misread number costs real money.",
          "stackMatch": [
            "React",
            "TypeScript"
          ]
        },
        {
          "label": "Knows mobile shipping firsthand",
          "need": "Your product exists because mobile build and release pipelines are painful. You need someone who has felt that pain.",
          "proofs": [
            "society-mobile",
            "mudrex"
          ],
          "claim": "Vanta Society shipped through a full EAS pipeline to the App Store. Mudrex went pre-seed to Series A on releases I ran.",
          "stackMatch": [
            "React Native",
            "EAS"
          ]
        },
        {
          "label": "Node systems behind the UI",
          "need": "Build orchestration is a backend problem too: queues, workers, and pipelines that run unattended.",
          "proofs": [
            "beans",
            "vanta-os"
          ],
          "claim": "Beans moved $100k+ an hour through Bull and Redis workers I built: launches, trades, withdrawals, all executed unattended.",
          "stackMatch": [
            "Node",
            "Redis",
            "TypeScript"
          ]
        }
      ],
      "closing": {
        "line": "You've built the tool every mobile team I've worked on needed. I'd like to build it with you.",
        "email": "lksujins@gmail.com",
        "github": "https://github.com/sujink1999",
        "resumeUrl": "/Sujin-K-Resume.pdf",
        "whatsapp": "+91 7299603606"
      },
      "unlisted": true
    } as CompanyPitch,
  },
  {
    jdSummary:
      "Loam (consumer sleep and recovery app): publishes its sleep-scoring models and their failure cases openly. Hiring a Full-Stack Engineer: wearable data ingestion, scoring pipeline, React Native app, subscription flows. TypeScript across the stack. Series A, 15 people. Research: 300k MAU, founders are a sleep researcher and an ex-Strava engineer.",
    pitch: {
      "slug": "loam",
      "company": "Loam",
      "role": "Full-Stack Engineer",
      "accent": "#7cb87a",
      "accentFrom": "#d3ecd0",
      "story": [
        "Every revision of your sleep-scoring model is public, **failure cases included**, documented for **300k monthly actives** to read.",
        "I've spent the last year inside the same data. At Vanta, the health platform I co-founded, I built the **wearable reconciliation engine** for Garmin and WHOOP: duplicates, conflicts, gaps, resolved into one number a person can trust. Before that I built a YC startup's consumer app solo to **10M+ downloads**.",
        "Fifteen people, wearables in, a score out, an app people open every morning. That's the exact shape of the work I already do."
      ],
      "requirements": [
        {
          "label": "Wearable data ingestion",
          "need": "Ingest wearable data reliably at consumer scale",
          "proofs": [
            "vanta-os",
            "beans"
          ],
          "claim": "I built Vanta's wearable pipeline myself: Garmin and WHOOP ingestion through a reconciliation engine into biomarker dashboards people check daily.",
          "stackMatch": [
            "TypeScript",
            "Express",
            "PostgreSQL",
            "Drizzle"
          ]
        },
        {
          "label": "Scoring pipeline",
          "need": "A scoring pipeline that is correct, observable, and safe to revise",
          "proofs": [
            "beans",
            "vanta-os",
            "keom"
          ],
          "claim": "Beans handled over $100k an hour through Redis queue workers and an event pipeline. Scoring needs that same correctness discipline.",
          "stackMatch": [
            "Redis",
            "Bull",
            "AWS Lambda",
            "SQS"
          ]
        },
        {
          "label": "React Native app",
          "need": "Ship and own the consumer mobile app",
          "proofs": [
            "mudrex",
            "society-mobile"
          ],
          "claim": "I built Mudrex's app from scratch in React Native to 10M+ downloads. Vanta Society is live on the App Store now.",
          "stackMatch": [
            "React Native",
            "Expo",
            "EAS",
            "Skia"
          ]
        },
        {
          "label": "Subscription flows",
          "need": "Build subscription and payment flows, TypeScript across the stack",
          "proofs": [
            "vanta-os",
            "keom",
            "society-mobile"
          ],
          "claim": "Vanta's store runs on headless Shopify: storefront, checkout, embedded admin. TypeScript at every layer, Next.js 16 to Express.",
          "stackMatch": [
            "TypeScript",
            "Next.js",
            "Shopify",
            "Express"
          ]
        }
      ],
      "closing": {
        "line": "300k people wake up to your score. I'd like to be one of the people who builds it.",
        "email": "lksujins@gmail.com",
        "github": "https://github.com/sujink1999",
        "resumeUrl": "/Sujin-K-Resume.pdf",
        "whatsapp": "+91 7299603606"
      },
      "unlisted": true
    } as CompanyPitch,
  },
  {
    jdSummary:
      "Brickbook (fintech back-office AI, 9 people): reconciles $2B a year in invoices for mid-market finance teams; founders still answer support. Hiring a Founding Engineer: ledger-accurate pipelines, review UIs, integrations with accounting systems. Node, TypeScript, Postgres. Research: profitable, no sales team, growth is word of mouth between CFOs, every engineer reads the ledger code in week one.",
    pitch: {
      "slug": "brickbook",
      "company": "Brickbook",
      "role": "Founding Engineer",
      "accent": "#5b8def",
      "accentFrom": "#c8dbfb",
      "story": [
        "Nine people, **$2B a year** in invoices reconciled, profitable, growing CFO to CFO. And your JD says every engineer reads the reconciliation ledger code in week one.",
        "I've built pipelines where the numbers have to be right: Beans executed token launches and trades through Bull and Redis workers, moving **more than $100k an hour** on Solana mainnet. And at Vanta, the health platform I co-founded, I built the reconciliation engine that merges Garmin and WHOOP data the product sits on.",
        "Small team, real dollars, and the ledger at the center of the culture. That's the job I want."
      ],
      "requirements": [
        {
          "label": "Ledger-accurate pipelines",
          "need": "Pipelines that reconcile invoices to the cent, at $2B a year of volume",
          "proofs": [
            "beans",
            "vanta-os",
            "keom"
          ],
          "claim": "Beans executed launches, trades, and withdrawals through queue workers, moving more than $100k an hour, with refunds automatic on failure.",
          "stackMatch": [
            "Node",
            "TypeScript"
          ]
        },
        {
          "label": "Review UIs",
          "need": "Interfaces where finance teams review and resolve reconciliation exceptions",
          "proofs": [
            "keom",
            "vanta-os",
            "mudrex"
          ],
          "claim": "I built the frontend of a lending protocol that grew from $500k to $10M TVL, where a misread number costs real money.",
          "stackMatch": [
            "TypeScript",
            "React"
          ]
        },
        {
          "label": "Accounting integrations",
          "need": "Integrations with the accounting systems mid-market finance teams already run",
          "proofs": [
            "vanta-os",
            "beans"
          ],
          "claim": "At FincorpX I synced OCR'd receipts into QuickBooks over OAuth2. Vanta integrates Shopify, Garmin, WHOOP and Strava, all built by me.",
          "stackMatch": [
            "Node",
            "TypeScript"
          ]
        },
        {
          "label": "Founding Engineer",
          "need": "An engineer who owns problems end to end on a nine-person team",
          "proofs": [
            "mudrex",
            "vanta-os",
            "beans"
          ],
          "claim": "Built a YC startup's app solo to 10M+ downloads, pre-seed through Series A. Then co-founded Vanta and shipped everything myself.",
          "stackMatch": [
            "Node",
            "TypeScript",
            "Postgres"
          ]
        }
      ],
      "closing": {
        "line": "Week one at Brickbook is reading the ledger code. I'm ready to start reading.",
        "email": "lksujins@gmail.com",
        "github": "https://github.com/sujink1999",
        "resumeUrl": "/Sujin-K-Resume.pdf",
        "whatsapp": "+91 7299603606"
      },
      "unlisted": true
    } as CompanyPitch,
  },
  {
    jdSummary:
      "Parlor (consumer social games): 800,000 monthly players run party games in the browser, no install. Hiring a Frontend Engineer: game UI, animation, performance under a strict 16ms frame budget. React, TypeScript, canvas/WebGL. Remote, 20 people. Research: 4-12 player rooms, cosmetics revenue, new game mode every quarter.",
    pitch: {
      "slug": "parlor",
      "company": "Parlor",
      "role": "Frontend Engineer",
      "accent": "#e0568f",
      "accentFrom": "#f9c6dc",
      "story": [
        "You put a **16ms frame budget** in the job description. Most teams say performance matters; you gave it a number, and **800,000 monthly players** in the browser hold you to it every frame.",
        "The closest thing I've shipped is Beans: a token launcher played as a **retro desktop game** in the browser. Draggable windows, live chat, physics objects flying across the screen, all while it moved over **$100k an hour**.",
        "A 12-player room means live state and animation on every screen at once, with no room to stutter. I've been shipping that kind of frontend for years."
      ],
      "requirements": [
        {
          "label": "Game UI",
          "need": "Build game interfaces for 4-12 player rooms in the browser",
          "proofs": [
            "beans",
            "vanta-os",
            "mudrex"
          ],
          "claim": "Beans was a game in the browser: draggable windows, live chat, matter-js physics objects, real launches moving $100k an hour.",
          "stackMatch": [
            "React",
            "Next.js",
            "matter-js",
            "Canvas"
          ]
        },
        {
          "label": "Animation",
          "need": "Motion and juice that make party games feel alive",
          "proofs": [
            "society-mobile",
            "vanta-os",
            "beans"
          ],
          "claim": "Vanta Society runs on custom Skia graphics: streak celebrations, milestone animations, shareable cards, live on the App Store right now.",
          "stackMatch": [
            "Skia",
            "Canvas",
            "React Native"
          ]
        },
        {
          "label": "Performance",
          "need": "Hit a strict 16ms frame budget under constant updates",
          "proofs": [
            "keom",
            "beans",
            "mudrex"
          ],
          "claim": "Keom's margin and lending UIs stream live prices and positions nonstop, with $500k to $10M TVL behind every rendered number.",
          "stackMatch": [
            "React",
            "TypeScript",
            "WebGL"
          ]
        },
        {
          "label": "React + TypeScript",
          "need": "Ship consumer product in React and TypeScript, a new game mode every quarter",
          "proofs": [
            "vanta-os",
            "mudrex",
            "society-mobile"
          ],
          "claim": "Vanta ships on Next.js 16 and React 19, built end to end by me. Before that: Mudrex, solo, to 10M+ downloads.",
          "stackMatch": [
            "React",
            "TypeScript",
            "Next.js"
          ]
        }
      ],
      "closing": {
        "line": "You ship a new game mode every quarter. I'd like to be there for the next one.",
        "email": "lksujins@gmail.com",
        "github": "https://github.com/sujink1999",
        "resumeUrl": "/Sujin-K-Resume.pdf",
        "whatsapp": "+91 7299603606"
      },
      "unlisted": true
    } as CompanyPitch,
  },
  {
    jdSummary:
      "Anchorline (institutional crypto custody, $4B in custody): dashboards are the product; clients never touch the chain directly. Hiring a Senior Frontend Engineer: precision dashboards, transaction review flows, multi-sig ceremony UI. React, TypeScript. 30 people, security-heavy culture. Research: SOC 2 audited, design team of 2, JD says a display bug is a wire transfer to the wrong place.",
    pitch: {
      "slug": "anchorline",
      "company": "Anchorline",
      "role": "Senior Frontend Engineer",
      "accent": "#3fb9a8",
      "accentFrom": "#bfeae3",
      "story": [
        "You custody **$4 billion** for funds and exchanges, and your clients never touch the chain. The dashboard is the product, and your JD says the quiet part out loud: **a display bug here is a wire transfer to the wrong place**.",
        "I ran the frontend of a lending and margin protocol that grew from **$500k to $10M TVL**, where every number on screen was someone's position and a misrendered one cost real money.",
        "Thirty people, security first, an interface that carries the whole company's trust. I've built under that weight before, and I like it."
      ],
      "requirements": [
        {
          "label": "Precision dashboards",
          "need": "Dashboards are the product: dense financial data that institutional clients read all day and act on.",
          "proofs": [
            "keom",
            "vanta-os",
            "mudrex"
          ],
          "claim": "6+ years of dashboards where the numbers are money: a lending dApp that held $10M, oracle-driven margin UIs, biomarker dashboards at Vanta.",
          "stackMatch": [
            "React",
            "TypeScript",
            "Recharts",
            "Pyth oracles"
          ]
        },
        {
          "label": "Transaction review flows",
          "need": "Flows where a client approves real value movement, including multi-sig ceremony UI, with zero room for ambiguity.",
          "proofs": [
            "beans",
            "keom",
            "mudrex"
          ],
          "claim": "Beans moved over $100k an hour through custodial wallets. I built the launch, betting, and withdrawal flows, and the workers behind them.",
          "stackMatch": [
            "Next.js",
            "Rust / Anchor",
            "Turnkey custody",
            "Bull / Redis"
          ]
        },
        {
          "label": "React and TypeScript craft",
          "need": "Senior frontend depth in React and TypeScript, with a design team of two, so engineers carry a lot of the interface quality themselves.",
          "proofs": [
            "vanta-os",
            "society-mobile",
            "keom"
          ],
          "claim": "I built Vanta's design system twice with no design team: a web library across five surfaces, and a mobile atomic system live on the App Store.",
          "stackMatch": [
            "React 19",
            "TypeScript",
            "Next.js 16",
            "Skia"
          ]
        },
        {
          "label": "Security-heavy culture",
          "need": "SOC 2 audited, clients are funds and exchanges. Engineers who treat correctness as the feature, not the checklist.",
          "proofs": [
            "mudrex",
            "beans",
            "keom"
          ],
          "claim": "Built a YC startup's app solo to 10M+ downloads. Then years in DeFi, where every input is hostile and a bug means drained funds.",
          "stackMatch": [
            "TypeScript",
            "Cypress e2e",
            "Simulation testing"
          ]
        }
      ],
      "closing": {
        "line": "Your clients trust the dashboard because they can't check the chain. I'd like to build the screens that earn that.",
        "email": "lksujins@gmail.com",
        "github": "https://github.com/sujink1999",
        "resumeUrl": "/Sujin-K-Resume.pdf",
        "whatsapp": "+91 7299603606"
      },
      "unlisted": true
    } as CompanyPitch,
  },
];
