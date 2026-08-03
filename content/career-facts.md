# Career Facts (single source of truth, verified against Sujin's resume)

Any role, title, or date stated in pitch copy, applications, or outreach MUST come from this
file verbatim. If a fact is not here, do not state it. Never invent or upgrade titles.

## Roles (exact titles and dates)

- **Co-founder, Vanta** (Sep 2025 - Present). Health/performance platform, built end to end:
  biomarker dashboards, wearable-data reconciliation (Garmin/WHOOP), LLM daily-plan engine with
  eval harness, Society community app on the App Store, multi-app web platform (e-commerce,
  lab-test booking, admin dashboards, Shopify embedded app).
  Copy rule: "I co-founded Vanta" (past-tense founding fact), never present-tense framing.
- **Senior Founding Engineer, Beans** (Jul 2025 - Sep 2025). Solana token-launch platform as a
  retro desktop OS; on-chain Anchor (Rust) program with simulation tests; Telegram launch bots
  and analytics on Bull/Redis worker queues.
- **Founding Engineer, Caddi** (Jul 2024 - Jun 2025). Chrome extension for swap/bridge from any
  website with route aggregation; AWS Lambda microservices; early Farcaster Frames builder.
- **Senior Web3 Engineer, 0vix / Gogo Protocol** (May 2022 - Jun 2024). Built and led frontend
  of GOGOcoin and 0vix protocols incl. UI/UX; primary author of the margin-trading and lending
  dApps; TVL grew $500k to $10M.
- **Founding Engineer, Swix DAO** (Mar 2022 - Jun 2022). MVP of a crypto-native Airbnb.
- **Software Engineer, Mudrex (YC W19)** (Sep 2021 - May 2022). Built the Mudrex mobile app
  from scratch in React Native, now 10M+ downloads; pre-seed through Series A.
  NOT "founding engineer". NOT a founder. Software Engineer.
- **Software Engineer 1, Futuryze Digital Venture Studio** (Feb 2021 - Oct 2021). Fireside app
  backend (Node.js) and UI (React); shipped iOS/Android with Flutter.

## Project facts (verified from source code, 2026-08-03)

Stack and architecture claims below were verified directly against the local repos.
Use these instead of inventing stack details.

### Beans (Jul 2025 - Sep 2025)
- Handled more than $100k of USD volume per hour (stated by Sujin, 2026-08-03). Safe to
  use as a copy number for scale/throughput/money-correctness beats.
- On-chain Anchor (Rust) program ("beans"), deployed to Solana mainnet: token launches,
  betting rounds, staking with revshare, referrals, NFT revenue share. Tested with
  bankrun simulations (Mocha).
- Launches on Pump.fun with Raydium LP migration and a Raydium LaunchLab (Letsbonk.fun)
  path. Raydium SDK v2 used across bot, UI, and program repos.
  NOT Jupiter routing: only the Jupiter wallet adapter is used. Never claim Jupiter
  swap aggregation for Beans.
- Telegram launch bot (grammY): paste a social link (Instagram/Twitter/TikTok/Pinterest/
  YouTube via Zyte scraping), LLM-generated token metadata, Turnkey custodial wallets
  (no stored private keys).
- Queue system is classic Bull + Redis (NOT BullMQ). NEVER say "settlement": nothing in
  Beans settles. The workers, verified from code 2026-08-03:
  - Financial worker: executes token launches (mint creation + initial bundle buy on
    Pump.fun/Bonk.fun), executes user buys and sells, records platform fees, and
    auto-refunds participants on-chain when a group launch fails. Concurrency 50,
    retries with exponential backoff.
  - Withdrawal worker: SOL transfers signed via Turnkey custodial wallets.
  - Price worker: token price and balance lookups for portfolio views.
  - Metadata worker: scrapes the pasted URL (Zyte) and generates token metadata via LLM.
  - Double-processing prevented by idempotent job ids plus Redis SET NX distributed locks
    on every buy/sell/launch/withdraw action. Safe copy phrasing: "executed launches,
    trades, and withdrawals unattended" or "moved real money through worker queues".
- "Volume" = cumulative SOL spent on buys (tracked per group and per wallet in code).
  The $100k+/hour figure is Sujin's number for this; the code tracks the SOL quantity.
- On-chain betting-round lifecycle (Anchor program): new_launch starts a round, users bet
  SOL on a URL/domain, end_round closes it and computes NFT revenue share, send_tokens
  distributes allocations to bettors, user_claim releases vested tokens and staking
  rewards, stake/unstake for yield, nft_claim pays revenue-share NFTs.
- AWS event pipeline: Helius webhooks decode Anchor events (Borsh/IDL) in a Lambda,
  dispatch through SQS, materialize into MySQL (Drizzle); containerized Lambdas via SAM.
- Frontends: Next.js 14/15, retro react95 desktop UI, lightweight-charts, Apollo GraphQL.

### Caddi (Jul 2024 - Jun 2025)
- Chrome extension (React/Redux) injected on every site: swap/bridge widget with a route
  checker that compares the host dApp's route against quotes from 19+ liquidity sources
  (0x, 1inch, KyberSwap, LiFi, Paraswap, CowSwap, Odos, Socket, Hashflow, Bebop, CEXs)
  and flags a better route. MetaMask keyring libs, Solana web3.js, Sentry, Mixpanel.
- Cross-chain bridge aggregator API (NestJS, api.caddi.fi): LiFi, DeBridge,
  Stargate/LayerZero across 15 mainnets; MySQL (Drizzle), Redis/Bull, distributed locks.
  Deployed on AWS Elastic Beanstalk (the standalone Lambdas are separate: tipping,
  reputation, X OAuth, allow/blocklists, Slack + Telegram bots).
- Farcaster Frames shipped from Feb 2024 (CNY frame on Coinbase OnchainKit, later frog
  framework frames, Farcaster auth-kit onboarding). NOTE: Feb 2024 predates the stated
  Jul 2024 start date; confirm with Sujin before citing "at Caddi since early 2024".

### FincorpX (Aug - Sep 2024)
- Document-AI expense backend (Node/Express/Prisma + MongoDB): receipt OCR via Azure
  Form Recognizer + Computer Vision (GST-aware parsing) and Veryfi via an email-in
  ingestion webhook; PDF-to-image conversion.
- Python ML microservice (FastAPI): word2vec (gensim) embeddings feeding three chained
  scikit-learn Random Forest classifiers (transaction type, expense category,
  vendor/customer).
- QuickBooks OAuth2 sync (NOT Zoho Books; corrected by Sujin 2026-08-03), Tally ERP push, Puppeteer bank-statement scrapers (ICICI,
  Indian Bank, Kotak) with captcha handling, live-deployed WhatsApp bot (Baileys)
  answering natural-language finance queries.
- Say "rules API", not "rules engine": rule definitions are CRUD only; no execution
  engine was found wired into the transaction pipeline.
- An earlier 2023 predecessor ("fpx", Apr-Aug 2023) had the same OCR/WhatsApp stack;
  FincorpX 2024 was a rebuild/relaunch, not a from-scratch six-week build.

## Safe framings

- "Built a YC startup's app solo to 10M+ downloads" (role-neutral, always safe for Mudrex).
- "Carried the app from pre-seed through Series A" (safe).
- Founding-engineer requirements in JDs: evidence qualifies if it matches the role itself
  (Beans, Caddi, Swix DAO: real founding engineer titles; co-founding Vanta) OR the quality
  being asked for (Mudrex: solo, pre-seed through Series A, is end-to-end ownership). Mudrex
  may back the quality, but the claim text must never call Mudrex a founding role.
- Experience total: 6+ years (Sujin's call, 2026-08-03: use 6+ everywhere, including the
  resume when it is next touched).

## Known past error

"Founding engineer at Mudrex" shipped on the deeptune page and spread through the corpus.
It is wrong. If found anywhere, replace with a safe framing above.
