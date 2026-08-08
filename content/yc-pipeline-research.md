# YC Founder Pipeline — Research (2026-08-06, not started)

Status: parked. Research + plan only; nothing built yet.

## The opportunity

YC runs four batches a year (Winter Jan-Mar, Spring Apr-Jun, Summer Jul-Sep, Fall Oct-Dec), each admitting roughly 150-300 companies. That's ~600-1000 freshly funded startups per year, each with $500k in the bank, hiring their first engineers during and right after the batch, and far more open to worldwide-remote than established companies (helps with the location constraint).

## Timing (as of Aug 2026)

- **Summer 2026 batch is running now.** Demo Day: Sep 10, 2026. Founders are mid-batch, understaffed, and personally read DMs. Highest-value window: now through late September.
- **Fall 2026 batch**: runs Oct-Dec, Demo Day Dec 2, 2026. Acceptances go out by Aug 28, 2026. A fresh wave of ~200 fundable, understaffed founders appears late Aug/Sep. Hit them Oct-Nov as they announce.
- Best conversion moment overall: 0-4 weeks after a company closes a round. Money in, no recruiting machine yet.

Sources: ycombinator.com/blog/2026-demo-days, roundfunded.com yc-batches-2026 posts.

## Positioning (hard fact rule)

Sujin is NOT a YC founder. The YC link is employment: Software Engineer at Mudrex (YC W19). Safe approved line: "Built a YC startup's app solo to 10M+ downloads." Never frame outreach as founder-to-founder YC peer messaging. Vanta is co-founded but not YC-backed.

## Pipeline design (to build)

Three feeds into the existing pipeline board via scout agents on a schedule:

1. **Batch feed**: scrape the YC company directory filtered to the current batch (S26 now, F26 once announced) plus Work at a Startup for open engineering roles. New batch companies appear on the directory during the batch, before they're famous.
2. **Fundraise feed**: monitor "just raised" signals: YC Launch posts, TechCrunch/funding announcements, founders tweeting rounds. Add a "raised recently" freshness factor to priority scoring.
3. **Founder map**: for each candidate company, extract the founder's Twitter/LinkedIn so outreach targets the person, not a portal.

Implementation note: the existing job-scout agent already has the right shape; it needs a YC-specific sourcing mode plus the fundraise-freshness scoring factor. Follow the standard intake rules (priority level/reason/rank in the Neon DB via patchCompany).

## Twitter reach play

- Build in public around the pitch pages themselves, not around "I'm job hunting." Post the craft: smoke shader, beat engine, screen recordings. Hook: "I stopped sending cover letters. I build each company a page instead."
- Reply to S26/F26 founders' YC Launch tweets within hours with something specific about their product. Cheap founder eyeballs; natural DM opener later.
- One flagship thread near Demo Day (Sep 10) when YC attention peaks: the story of the pitch-page system, closing with an offer to S26 founders hiring engineers.

## Next actions when picked up

1. Extend job-scout with YC batch sourcing mode (directory + Work at a Startup).
2. Seed the board with matching S26 companies (frontend/full-stack/product; crypto/devtools/consumer).
3. Draft the Demo Day thread and the launch-tweet reply cadence.
