# Outreach Playbook — Per-Company Pitch Pages

How to deliver a pitch page (`/[company]`) so it actually gets seen, and convert it into replies and interviews. Based on deep research (2026-07-26): 22 sources, 25 claims adversarially verified (12 confirmed, 13 refuted). Confidence levels noted per section.

## Core principle

The pitch page is the **proof**, not the delivery. The delivery is short, direct outreach to the hiring manager with the page as the single link. ATS application runs in parallel as a safety net, never as the only channel.

## Verified findings

### Channels (medium confidence)
- **LinkedIn DM > cold email**: benchmark data (Pin, 4M+ messages, 2025–26) shows ~17% reply on LinkedIn vs ~5% for automated email. Generic cold email replies: 1–5%. Well-targeted, accomplishment-focused email to a hiring manager: ~5–25% depending on strength of evidence.
- **ATS is safe in parallel**: 92% of surveyed recruiters say their ATS does not auto-reject on formatting/content/design. Put the pitch URL in the resume header and cover letter. Rejection risk = eligibility knockout questions, not links.

### Message format (medium confidence)
- ~6–10 lines (~75–125 words). Exactly **one proof point** (the pitch URL) and **one question**.
- Do NOT also link GitHub + portfolio + demo in the same message — one link.
- Precise word-count claims all failed verification; treat length as soft guidance.

### Sequencing (medium confidence)
- First touch generates ~58% of all replies; touches 1–3 capture ~93%; touch 4 reaches ~98%.
- **3–4 touches max, then stop.** More adds noise, not yield.
- No verified optimal spacing exists (all specific-day claims were refuted). Use ~3–5 business days as a reasonable default.

### Link delivery (high confidence)
- Send the URL as a **plain, untracked link**. Tracking pixels and rewritten/shortened links are spam signals (disabling open tracking alone ≈ +2–10pp inbox placement).
- Track engagement on the page itself (view-tracking beacon), not in the email.
- 1–2 links max per email; consider zero links in the very first touch (hook first, link on reply or touch two).
- Custom sending domain needs SPF/DKIM/DMARC or Gmail buries it.

### Legal (high confidence)
- "Hey Acme," in plain text = nominative fair use (New Kids test: necessity, minimal use, no implied endorsement).
- **Never use the company's logo or mimic their brand styling** — that's where fair use fails. Accent color + text name only.
- Consider a small footer line: "Not affiliated with [Company]."

### Precedent & caveats
- nina4airbnb.com (2015): got an Airbnb interview, but via viral social amplification, not the site alone; she wasn't hired there.
- Some hiring managers dislike cold outreach entirely (Blind/Amazon HM thread) — expect a nonzero annoyed-rate; it's a numbers game.
- All quantitative benchmarks are proxies from sales/recruiter-direction data; no verified candidate→hiring-manager dataset exists. Own beacon data > published numbers.

## Per-company sequence (card-first, manual, no Premium)

The OG card (`app/[company]/opengraph-image.tsx` — "AN INVITATION FOR [company]." seal) is the hook; messages stay one line and let the card sell.

1. **Day 0 — Apply + prime**
   - Apply via ATS; pitch URL in resume + cover letter.
   - Prime the OG cache: run the pitch URL through linkedin.com/post-inspector (LinkedIn caches ~7 days; also verifies the card).
2. **Day 0 — Connect**
   - BLANK connection request to hiring manager + recruiter (notes do NOT render link previews; blank requests accept slightly better).
   - If either has an Open Profile ("Message" button without connecting): DM directly instead — card renders.
3. **On accept — the card message**
   - Paste URL, let the card render, one line above it: "Hey [Name] — made this for you. Two minutes."
4. **No accept in ~4–5 days — email fallback**
   - Gmail/Outlook do NOT render OG cards; email needs words: 6–10 lines, one specific line about them, plain untracked link, one question.
5. **Touch 3 (~1 week later)** — final light touch, then stop.
   - In parallel: one warm-referral attempt via a 2nd-degree connection (Slack/WhatsApp/iMessage DO render the card — referral shares look great).
6. **Always** — log channel + page views per company via the beacon.

### Card-rendering rules
- Meta-robots noindex is fine (LinkedInBot still fetches OG); never add a robots.txt that disallows /[company] paths.
- Page must be deployed + publicly reachable before priming.
- Connection-request notes, email = no card. LinkedIn DM/InMail, Slack, WhatsApp, Telegram, iMessage = card.

## Proven templates (in Sujin's voice — keep the casual register)

### LinkedIn note / DM — founder or hiring manager (after applying)
```
Hey [Name], applied for the [Role] role. Instead of a cover letter I built a page mapping your JD to work I've shipped: https://sujin.tech/[slug]. Two minute read, curious what you think.
```

### DM — founding-team engineer (peer, referral angle)
```
Hey [Name] — just applied to [Company] for the [role] role. Instead of a cover letter I built a page for you guys, mapping your JD to work I've shipped:

https://sujin.tech/[slug]

Two minute read. If you like it, would love for you to put it in front of the team.
```
Link on its own line so the OG card renders in DMs. Direct ask, no hedging ("if it holds up"-style conditions kill the share). Role name must match the exact listing applied to — and the pitch page's `role` field must match it too.

## Open questions (unresolved by research)
- Actual click-through rates on portfolio links in cold outreach.
- Optimal follow-up spacing.
- Recent (2023–26) engineer-specific personalized-site case studies with outcomes.
