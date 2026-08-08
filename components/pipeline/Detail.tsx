"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { PipelineCompany } from "@/lib/pipeline/types";
import StatusPill from "./StatusPill";
import Runsheet from "./Runsheet";
import DraftReview from "./DraftReview";
import ApplicationPanel from "./ApplicationPanel";
import Loader from "./Loader";
import { Icons } from "./Metrics";
import { WIDGET_MOCKS } from "./mocks";
import { EVIDENCE } from "@/companies/evidence";

/** Renders the live pitch page at laptop resolution (1440x900), scaled to fit the column. */
function LaptopEmbed({ slug }: { slug: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 1440));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black"
      style={{ height: 900 * scale }}
    >
      <iframe
        src={`/${slug}`}
        title={slug}
        width={1440}
        height={900}
        className="absolute left-0 top-0 origin-top-left"
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  );
}

export default function Detail({ slug }: { slug: string }) {
  const [c, setC] = useState<PipelineCompany | null>(null);
  const [loaded, setLoaded] = useState(false);
  const load = useCallback(async () => {
    const res = await fetch("/api/pipeline");
    if (!res.ok) {
      setC(null);
      setLoaded(true);
      return;
    }
    const data = await res.json();
    setC(data.companies.find((x: PipelineCompany) => x.slug === slug) ?? null);
    setLoaded(true);
  }, [slug]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const [saving, setSaving] = useState(false);
  const patch = async (p: Partial<PipelineCompany>) => {
    setSaving(true);
    try {
      await fetch("/api/pipeline", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, patch: p }),
      });
      await load();
    } finally {
      setSaving(false);
    }
  };

  if (!c) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] p-8">
        {loaded ? (
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/35">Not in pipeline</p>
        ) : (
          <Loader />
        )}
      </main>
    );
  }

  const d = c.pageDraft;
  const Mock = c.research?.widgetConcept ? WIDGET_MOCKS[c.research.widgetConcept.key] : undefined;
  const gate = (name: string) => (
    <h2 className="mb-3 mt-10 font-mono text-xs uppercase tracking-[0.2em] text-white/40">{name}</h2>
  );
  const approveBtn = (label: string, p: Partial<PipelineCompany>) => (
    <button
      onClick={() => patch(p)}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-md border border-emerald-400/25 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300/90 transition-[color,background-color,border-color,transform] hover:bg-emerald-400 hover:text-black active:scale-[0.98] disabled:cursor-wait disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-emerald-300/90"
    >
      {saving && (
        <span className="h-3 w-3 animate-spin rounded-full border border-emerald-300/30 border-t-emerald-300" />
      )}
      {label}
    </button>
  );

  return (
    <main className="min-h-screen bg-[#050505] px-8 py-10 text-white">
      <div className="pipeline-card-in mx-auto w-full max-w-6xl">
      <header className="flex items-center gap-4">
        <Link
          href="/pipeline"
          aria-label="Back to pipeline"
          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 transition-colors hover:border-white/40 hover:bg-white/5"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d="M9.5 2.5 L4.5 7.5 L9.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-white/50 transition-colors group-hover:text-white" />
          </svg>
        </Link>
        {c.logo?.path && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={c.logo.path} alt="" className="h-11 w-11 rounded-lg border border-white/10 object-contain" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3">
            <h1 className="truncate text-xl font-medium tracking-tight">{c.company}</h1>
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-white/30 sm:inline">{c.source.channel}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-3">
            <p className="truncate text-sm text-white/50">{c.role}</p>
            {c.size && (
              <span
                title="Company size (headcount)"
                className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-white/50"
              >
                <span className="opacity-60">{Icons.size}</span>
                {c.size}
              </span>
            )}
            {c.jdUrl && (
              <a
                href={c.jdUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[11px] text-white/60 transition-colors hover:border-white/40 hover:text-white"
              >
                {new URL(c.jdUrl).hostname.replace("www.", "")}
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1.5 8.5 L8.5 1.5 M3.5 1.5 H8.5 V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        </div>
        <StatusPill status={c.status} />
      </header>

      {c.draft && (c.status === "researching" || c.status === "page_draft") && (
        <>
          {gate("Draft copy")}
          <DraftReview
            key={c.updatedAt}
            draft={c.draft}
            saving={saving}
            onSave={(next) => patch({ draft: next })}
          />
          {c.status === "page_draft" && !c.pageDraft && (
            <div className="mt-4 flex gap-3">
              {approveBtn("Approve copy, start build", { status: "build" })}
              <span className="self-center font-mono text-xs text-white/40">
                Page assembly + answer drafting happen in chat after this
              </span>
            </div>
          )}
        </>
      )}

      {c.status === "page_draft" && c.research && (
        <>
          {gate("Research")}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 text-sm leading-relaxed text-white/70">
            <p>{c.research.summary}</p>
            <ul className="mt-2 list-inside list-disc text-white/60">
              {c.research.humans.map((h) => (
                <li key={h.name}>
                  {h.name}, {h.role}{" "}
                  {h.url && <a href={h.url} target="_blank" rel="noreferrer" className="underline decoration-white/30">profile</a>}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {c.status === "page_draft" && d && (
        <>
          {gate("Step 2: page copy")}
          <div className="space-y-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
            <p className="text-2xl font-medium">Hey {d.company},</p>
            {d.story.map((s, i) => <p key={i} className="text-sm leading-relaxed text-white/70">{s}</p>)}
            {Mock && (
              <div className="rounded-lg border border-white/10 p-4">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                  widget mock: {c.research?.widgetConcept?.key}
                </p>
                <Mock />
              </div>
            )}
            {d.requirements.map((r) => (
              <div key={r.label} className="border-t border-white/10 pt-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{r.label}</p>
                <p className="mt-1 text-xs italic text-white/40">{r.need}</p>
                <p className="mt-2 text-base text-white/90">{r.claim}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[11px] text-white/35">shows</span>
                  {r.proofs.map((id, i) => (
                    <span key={id} className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${i === 0 ? "border-white/30 text-white/90" : "border-white/10 text-white/50"}`}>
                      {EVIDENCE[id]?.title ?? id}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <p className="border-t border-white/10 pt-4 text-sm text-white/70">{d.closing.line}</p>
          </div>
          {c.status === "page_draft" && (
            <div className="mt-4 flex gap-3">
              {approveBtn("Approve page copy, start build", { status: "build" })}
              <span className="self-center font-mono text-xs text-white/40">Changes: come to chat</span>
            </div>
          )}
        </>
      )}

      {c.status === "build" && (
        <>
          {gate("Step 3: building")}
          <p className="font-mono text-xs text-white/40">Config and page being built, come back shortly</p>
        </>
      )}

      {c.status === "pages_ready" && (
        <>
          {gate("Step 3: live page")}
          <LaptopEmbed slug={c.slug} />
          <p className="mb-2 mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">og card (what the link unfurls as)</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/${c.slug}/opengraph-image/0`}
            alt="OG card preview"
            className="w-full max-w-lg rounded-xl border border-white/10"
          />
          <div className="mt-4 flex items-center gap-3">
            <a
              href={`/${c.slug}`}
              target="_blank"
              className="rounded-md border border-white/20 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/80 transition-colors hover:bg-white hover:text-black"
            >
              Open full tab
            </a>
            {approveBtn("Page looks good, show messages", { status: "outreach" })}
          </div>
        </>
      )}

      {(c.status === "outreach" || c.status === "applied") && (
        <>
          {gate("Outreach runsheet")}
          <Runsheet c={c} onPatch={(outreach) => patch({ outreach })} />
          {(c.outreach ?? []).length === 0 && c.research && c.research.humans.length > 0 && (
            <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">From research</p>
              <ul className="space-y-1.5 text-sm text-white/70">
                {c.research.humans.map((h) => (
                  <li key={h.name} className="flex items-center gap-2">
                    <span className="text-white/90">{h.name}</span>
                    <span className="text-white/40">{h.role}</span>
                    {h.url && <a href={h.url} target="_blank" rel="noreferrer" className="font-mono text-xs underline decoration-white/30 hover:text-white">profile</a>}
                  </li>
                ))}
              </ul>
            </div>
          )}


          {c.status === "outreach" && (
            <div className="mt-6">
              {approveBtn("Mark applied", { status: "applied", applied: { done: true, date: new Date().toISOString().slice(0, 10) } })}
            </div>
          )}
          {c.status === "applied" && c.applied?.date && (
            <p className="mt-6 font-mono text-xs text-emerald-400/70">Applied {c.applied.date}</p>
          )}
        </>
      )}

      {c.application && (
        <>
          {gate("Application form")}
          <ApplicationPanel
            key={c.updatedAt}
            app={c.application}
            saving={saving}
            onSave={(next) => patch({ application: next })}
          />
        </>
      )}
      </div>
    </main>
  );
}
