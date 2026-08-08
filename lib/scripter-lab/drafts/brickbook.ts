import type { OldLabDraft } from "./index";

export const brickbookDraft: OldLabDraft = {
  slug: "brickbook",
  company: "Brickbook",
  role: "Founding Engineer",
  size: "1-10",
  register: "tiny",
  jdSummary:
    "Brickbook (fintech back-office AI, 9 people): reconciles $2B a year in invoices for mid-market finance teams; founders still answer support. Hiring a Founding Engineer: ledger-accurate pipelines, review UIs, integrations with accounting systems. Node, TypeScript, Postgres. Profitable, no sales team, growth is word of mouth between CFOs, every engineer reads the ledger code in week one.",
  story: [
    [
      {
        angle: "trust",
        text: "You reconcile **$2B a year** in invoices, and when a number looks wrong, a **founder answers the support ticket**. I read that as a team that treats one wrong number as an emergency.",
      },
      {
        angle: "culture",
        text: "**Every engineer reads the ledger code in week one.** That one line in your JD says more than the rest of it: at Brickbook, correctness is the culture, not a QA stage.",
      },
      {
        angle: "business",
        text: "You reconcile **$2B a year** with **nine people, profitable, no sales team**. That last part is a choice: the reconciliation itself does the selling, CFO to CFO.",
      },
    ],
    [
      {
        angle: "money",
        text: "I've shipped code where a wrong number costs real money. **Beans**, a Solana launchpad, moved more than **$100k an hour**, and when a group launch failed, my workers refunded every participant on-chain, automatically.",
      },
      {
        angle: "reconciliation",
        text: "Reconciliation is what I build every day. At **Vanta**, the health platform I co-founded, my **two-pass matching engine** reconciles planned activities against messy Garmin and WHOOP records, and it surfaces ambiguity instead of guessing.",
      },
      {
        angle: "ownership",
        text: "At **Vanta**, the health platform I co-founded, I shipped the coach end to end alone: an agent with a **durable memory** that updates itself when a user's life contradicts it.",
      },
    ],
    [
      {
        angle: "mapping",
        text: "You're hiring one engineer to own pipelines a CFO has to trust. The rest of this page is your JD mapped to what I've shipped.",
      },
      {
        angle: "requirements",
        text: "Ledger-accurate pipelines, review UIs, accounting integrations: I've built each of these before. Below is the proof, requirement by requirement.",
      },
      {
        angle: "week-one",
        text: "Week one I'd be in the ledger code too, gladly. Here's your JD, mapped line by line to work I've already shipped.",
      },
    ],
  ],
  claims: [
    {
      label: "Ledger-accurate pipelines",
      need: "Pipelines that reconcile $2B a year in invoices and are never wrong",
      variants: [
        {
          angle: "workers",
          text: "Beans ran launches, trades, and withdrawals unattended on Bull and Redis workers: idempotent job ids, distributed locks, nothing processed twice.",
        },
        {
          angle: "stack",
          text: "TypeScript and Node at every layer for six years: Vanta's Express APIs and dashboards, Beans' Bull and Redis worker queues.",
        },
        {
          angle: "evals",
          text: "Vanta ships behind an eval harness: 30 scripted end-to-end scenarios with real tool dispatch and DB assertions, run three times, majority pass.",
        },
      ],
    },
    {
      label: "Review UIs people trust",
      need: "Interfaces where a finance team confirms what the system found",
      variants: [
        {
          angle: "governance",
          text: "Vanta's agent never silently mutates: higher-stakes changes come back as proposals the user reads and confirms before anything lands.",
        },
        {
          angle: "lab-pipeline",
          text: "Vanta's biomarker pipeline turns raw lab reports into panels a user reads their health from: report parsing, PDF and DEXA viewers, dashboards.",
        },
        {
          angle: "report-review",
          text: "Vanta's report review mode walks a user through lab findings beside the source PDF: the human checks the document, not the summary.",
        },
      ],
    },
    {
      label: "Accounting integrations",
      need: "Connecting the product to the systems finance teams already live in",
      variants: [
        {
          angle: "honest",
          text: "Accounting systems would be new territory for me, said plainly. The closest analog: Vanta's pipeline turning raw lab reports into structured records.",
        },
        {
          angle: "onchain",
          text: "Beans integrated Pump.fun launches with Raydium LP migration, and Helius webhooks decoding on-chain events into MySQL. Third-party systems, real money between them.",
        },
        {
          angle: "glue",
          text: "Beans' launch bot glued Zyte scraping, LLM token metadata, and Turnkey custodial wallets into one Telegram flow, no private keys stored.",
        },
      ],
    },
    {
      label: "Founding-engineer ownership",
      need: "One engineer carrying features end to end, insight to production",
      variants: [
        {
          angle: "vanta",
          text: "I co-founded Vanta and built it end to end: data model, Express APIs, dashboards, App Store app. One person, whole loop.",
        },
        {
          angle: "mudrex",
          text: "At Mudrex, a YC startup, I built the app solo from scratch to 10M+ downloads, pre-seed through Series A.",
        },
        {
          angle: "beans",
          text: "Senior Founding Engineer at Beans: I shipped the on-chain Anchor program to Solana mainnet, launches, staking, revenue share, tested in simulation.",
        },
      ],
    },
  ],
};
