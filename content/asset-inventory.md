# Asset Inventory - Everything Sujin Has Built (Job-Application Master Doc)

> Purpose: single source of truth for the company-specific story routes.
> Each project entry: what it is, proof points, and how to show it visually.
> Scanned from ~/Development on 2026-07-22. Excludes pre-2022 resume items (already covered by old resume/portfolio).

---

## TIER 1 - Flagship (lead with these)

### 1. Vanta OS Landing (`Vanta/os-landing`) - Nov 2025 → now
- **What**: Marketing + investor site for Vanta OS ("operating system for high-performance living"). Includes investor deck page with narrative dashboard.
- **Stack**: Next.js 15, React 19, Tailwind v4, GSAP, Three.js, react-globe.gl.
- **Proof points**: Custom Möbius-strip WebGL animation, interactive 3D globe (two variants incl. investor "Prometheus" dashboard globe), scroll-driven hero storytelling (ScrollHero, EscapeVelocity, OutliveHorizon), phone-mockup product showcase.
- **Show visually**: Live embed / screen recordings of scroll sequences; the Möbius + globe are instant "wow" clips.

### 2. Vanta Society Platform (`Vanta/society-frontend` + `society-backend`) - Feb → Jun 2026
- **What**: Multi-app monolith: /store (e-commerce), /labs (blood-test booking + biomarker/DEXA/genetics report viewer), admin dashboards, marketing pages (collection, creator, partner).
- **Stack**: Next.js 16, React 19, Framer Motion, Three.js, Shopify Polaris/App Bridge, Recharts, react-pdf. Backend: Express, Drizzle, SendGrid, Vercel Blob.
- **Proof points**: Multi-tenant app architecture under one shell, PDF lab-report rendering, biomarker dashboards, KarmaLabs referral admin, Shopify embedded app.
- **Show visually**: Architecture flow diagram (store/labs/admin under one shell) + store & labs UI recordings.

### 3. Vanta OS v1 Web (`Vanta/vanta-os` + `os-backend` + `labs-backend`) - Nov 2025 → Jul 2026
- **What**: The actual product - health/performance "central brain": today view, biomarker dashboards, fuel/stack tracking, AI chat coach, cohort-gated onboarding, wearables (Garmin, WHOOP).
- **Stack**: Next.js 16, React 19, Recharts, Google OAuth. Backend: Express 5, Drizzle, LLM daily-plan generation with an eval harness, wearable-data reconciliation engine (39 phased rollouts logged).
- **Proof points**: Real shipped product with health-data complexity; LLM evals; wearable reconciliation; cohort routing; branded micro-interactions (silver shimmer wordmark, ambient ring/Möbius atmospherics).
- **Show visually**: Product walkthrough recording + a systems diagram (wearables → reconciliation → daily plan → chat coach). Great "AI systems engineering" story.

### 4. Vanta Society Mobile App (`Vanta/vanta-society`) - Sep 2025 → Apr 2026
- **What**: Shipped consumer mobile app - community, marketplace, workouts/challenges (Winter Arc), stories, streaks, Strava, book club.
- **Stack**: Expo/React Native, Expo Router, Shopify Skia + FlashList, EAS pipeline (App Store).
- **Proof points**: Mature atomic design system, Skia custom graphics, ShareableCard social graphics, MilestoneCelebration/streak flows.
- **Show visually**: Phone-frame screen recordings of animated widgets, streaks, share cards.

### 5. Beans - Solana Token-Launch Game (`Caddi/beans-ui` + `caddi-dashboard` + `normie-programs`) - Jul 2024 → Jun 2025
- **What**: Solana launchpad and trading platform (Pump.fun-style) rendered as a retro Windows-95 desktop: live token launches as draggable windows, chat bubbles, and physics objects.
- **Stack**: Next.js, matter-js physics, react-konva, Apollo/Codex GraphQL, Anchor, Jupiter/Raydium/pump.fun SDKs. On-chain: Rust/Anchor program (new_launch, bet, buy_winner, stake/unstake, nft_claim, migrations) with bankrun simulation tests.
- **Proof points**: Custom bonding-curve math, homegrown Anchor client layer, physics-driven "flying beans," multi-DEX routing, real smart-contract depth (betting/staking/NFT mechanics).
- **Show visually**: The desktop-OS UI is the most memorable visual in the whole portfolio - record it live. Pair with a contract-instruction diagram for crypto companies.

### 6. Keom / 0VIX DeFi Suite (`Gogo0vix/*`) - 2022 → 2024
- **What**: Production DeFi money-market & margin-trading protocol frontends (TVL 500k → 10M, per resume).
  - `0vix-frontend`: multi-chain lending UI (344/740 commits are Sujin's).
  - `keom-dapp`: margin/lending dApp - 84/91 commits, essentially solo. Pyth oracles, Firebase.
  - `margin-trading-frontend`: leverage trading UI, Algebra AMM, Cypress e2e, i18n - 55/61 commits, primary author.
- **Proof points**: Verified authorship on real-TVL production DeFi; oracles, bridges (Celer), multi-wallet, e2e testing maturity.
- **Show visually**: Protocol-evolution timeline (0VIX → Keom), lending/margin UI screenshots, TVL growth stat.

---

## TIER 2 - Strong supporting

### TokenFolio (`TokenFolio/tokenfolio-ui`) - Feb 2023 → Mar 2024
Investor/token-sale platform: KYC via Onfido, Auth0, deals/token sales, allocation staking, ApexCharts. 98/214 commits. Good "regulated fintech + crypto" story.

### Bean Bot (`Caddi/bean-bot-backend` + `bean-bot-frontend`) - Jun–Jul 2025
Telegram bot to launch pump.fun tokens from group chats + analytics dashboard (leaderboards, creator/group rankings). Express + Drizzle/MySQL + Raydium; Next 15/React 19 + Recharts. Shows post-pivot shipping speed.

### beans_urls - Jun–Jul 2025
Paste-a-link → token launch Telegram bot. BullMQ/Redis workers, metadata scraping, Jest tests, backup/restore scripts. "Production hygiene" evidence.

### FincorpX (`FincorpX/fincorpx-backend` + `fincorpx-models`) - Aug–Sep 2024
Expense/transaction SaaS backend: Azure Form Recognizer + Veryfi OCR, Zoho Books integration, WhatsApp (Baileys), rules engine. Plus Python ML classifiers (word2vec + sklearn) for transaction categorization. Balances the crypto-heavy narrative with document-AI/ML breadth.

### Vanta OS Mobile (`Vanta/vanta-os-mobile`) - Jul 2026, in progress
HealthKit-native biometric ingestion, on-device Drizzle DB, Skia rendering, "digital twin" engine. Mention as in-progress cross-platform proof.

### Caddi (extension + `caddi_backend` + `caddi-onboarding`) - 2023 → 2024
Web3 companion: X/Twitter crypto tipping via AWS Lambda microservices, Farcaster auth, Peanut payment links, multiplayer on-dApp overlay extension (bridge/swap/chat). Source for extension is minified-only - tell the story, don't show code.

---

## TIER 3 - One-liners / flavor (mention, don't feature)

- **vanta-assistant** - JARVIS-style Electron multi-window filming rig: scene-runner DSL, ambient Three.js dashboards, WHOOP data feeding the UI. Great "I build my own tools" flavor.
- **reel-editor / vanta-court** - AI-agent media pipeline (Claude + FFmpeg/WhisperX/Remotion, human-in-loop review dashboard) and growth-engine content ops CRM. "AI systems" bullets.
- **slot-machine** - Candy Machine NFT mint as an animated slot machine + confetti. Fun GIF material.
- **Farcaster Frames** (caddi-cny-frame, hunt-frames) - built on Frames when they were brand-new (early 2024). "Early on emerging surfaces" evidence.
- **beans-nft** - client-side canvas NFT trait compositor with zip export.
- **pump-sniper / snipers-ui** - Solana sniping bots (Raydium v2, tx construction). Mention capability only. ⚠️ snipers-ui has wallet JSON checked in - audit before ever pushing/showing.
- **vanta-team-os** - serverless "personal OS": Telegram capture → Claude Code triage → digest. Engineering-philosophy one-liner.
- **lazytrade_extension_js** - cross-browser extension build pipeline (Storybook, CRX packaging).

## Skip entirely
Boilerplate/scaffolds (store-frontend, vanta-centaur, fincorpx frontends, ims, memecoin, anchor-hello-world, test-nextjs), cloned upstream repos (Rabby, Maskbook, eliza, Uniswap interface, wagmi), repos with ~0 personal commits (keom-protocol, 0vix subgraphs, account-service), templated landings (Numera/Salient, PetroPilot), linkedin scraper (ToS risk), one-day utilities.

---

## Pre-2022 (from old resume - reuse as-is, no re-scan needed)
- **Mudrex (YC W19)** - built mobile app from scratch in React Native; 10M+ downloads; pre-seed → Series A.
- **StegCloak** - 2.5K★ JS steganography library (invisible-character secrets in text). Featured in Awesome-Nodejs/CLI/Security.
- **AirShare** - 600★ Python P2P LAN file transfer via mDNS; 40K downloads.
- **Teleport** - WebRTC P2P unlimited file sharing; won Inout 7.0 (India's largest community hackathon) + 1L grant.
- **Virtual Galaxy** - React 360 + WebRTC watch-together; 1st place regionals, Facebook hackathon 2019.
- **Intelli Chains** - CTO, 10+ web3 clients to production.
- Featured in The Hindu and Facebook.

---

## Narrative angles per company type
- **Crypto/DeFi companies** → lead: Beans (contract + physics UI), Keom/0VIX (TVL, near-solo authorship), TokenFolio (KYC/compliance).
- **Consumer/product companies** → lead: Vanta OS + Society mobile (shipped consumer products end-to-end), Mudrex (10M downloads).
- **AI companies** → lead: Vanta OS LLM plan engine + eval harness, reel-editor agent pipeline, vanta-assistant, vanta-team-os.
- **Design-forward companies** → lead: os-landing (WebGL/GSAP), Beans desktop UI, Society mobile Skia animations.
- **Infra/backend roles** → lead: os-backend wearable reconciliation, beans_urls queue architecture, caddi_backend Lambda microservices, FincorpX OCR pipeline.

## Visual capture TODO (next session)
1. Screen-record: os-landing scroll story, Möbius, globes; Beans desktop UI; vanta-os product; Society store/labs; mobile app (simulator).
2. Build 3–4 reusable architecture-flow diagrams (Vanta OS system, Society multi-app, Beans on-chain flow, Keom protocol stack).
3. Collect stats: TVL growth, app downloads, GitHub stars, cohort/user numbers from Vanta.
4. Audit & scrub any secrets (snipers-ui wallets, checked-in keys) before anything goes public.
