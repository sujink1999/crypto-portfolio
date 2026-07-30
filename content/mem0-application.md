# Mem0 Application Answers

## 1. Intro message

Hi, I'm Sujin. I made a short page mapping your JD to my actual work: https://sujin.tech/mem0

Concise version: 6+ years full stack. Built Mudrex's mobile app solo (YC W19, 10M+ downloads), then built all of Vanta, a health platform I co-founded: Next.js frontend, Express/PostgreSQL backend, and the App Store app. Vanta's AI coach has to remember months of a user's health, so I hand-built its memory layer: durable facts with supersession, weekly rollups, cache-stable context snapshots.

Why Mem0 specifically: I've personally paid the cost of building memory by hand, and I still think it's the most important unsolved layer in AI products. I'd rather work on it as the product than rebuild it inside every app I ever ship.

## 2. Exceptional work (250-char limit version, 248 chars)

I hand-built Vanta's agent memory: async extraction after each reply (cut ~3s of latency per turn), slug-keyed facts with supersession and expiry, capped at 40 (~1k tokens), weekly rollups, one byte-stable context block so prompt caches always hit.

## 2a. Exceptional work (~460 chars)

The memory system inside Vanta. Our health agent must remember months of a user's life without the prompt growing forever. I moved memory writes out of the agent loop into an async extractor, cutting ~3s of latency per turn. Facts are slug keyed with supersession and expiry, capped at 40 (~1k tokens), plus weekly journal rollups, all assembled into one byte-stable block so prompt caches hit. Hardest part: only storing user-asserted facts, never agent suggestions.

## 2b. Exceptional work (full version, if the field allows more)

The agent memory system inside Vanta. Our health agent needs to remember months of a person's life (meds, symptoms, sleep, goals) without the prompt growing forever.

Design decisions I'm proud of:

1. Memory writes don't happen in the agent loop. We started with update_memory as a tool call and every write cost the user an extra model roundtrip, about 3 seconds. I moved extraction to an async pass that runs after the reply is sent: a small model reads the turn and emits structured writes. User-facing latency for memory dropped to zero.

2. Facts are slug-keyed with supersession and expiry, and both conditions ride on every read path, so "sleep_5h" from March can never leak into a July prompt. Upserts are idempotent, which made retry logic boring in a good way.

3. Active facts are capped at 40 (~1k tokens), so a month-six user costs the same as a day-one user. Above the fact layer there are weekly journal rollups, and everything assembles into one byte-stable context block so the prompt cache prefix survives across turns.

The hardest part honestly wasn't storage, it was extraction discipline: the agent recommends things all day, and "the agent suggested magnesium" must never become "user takes magnesium". Getting the extractor to only store user-asserted facts took more prompt iterations than the rest of the system combined. Timezone bucketing for the rollups was the other one that bit me: a user logging from Tokyo shouldn't get their week closed early by a server in Virginia.

## 3. Located in SF / on-site 4-5 days

Not currently. I'm relocating for this role and can be on-site at the SF HQ 4-5 days a week. I saw you sponsor visas, which I'd need. Happy to walk through timelines on a call.
