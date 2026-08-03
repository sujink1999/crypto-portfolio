"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { PipelineCompany } from "@/lib/pipeline/types";
import StatusPill from "./StatusPill";
import CopyBlock from "./CopyBlock";
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

  const patch = async (p: Partial<PipelineCompany>) => {
    await fetch("/api/pipeline", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug, patch: p }),
    });
    load();
  };

  if (!c) {
    return (
      <main className="min-h-screen bg-[#050505] p-8 font-mono text-xs text-white/40">
        {loaded ? "not in pipeline" : "loading"}
      </main>
    );
  }

  const d = c.pageDraft;
  const Mock = c.research?.widgetConcept ? WIDGET_MOCKS[c.research.widgetConcept.key] : undefined;
  const gate = (name: string) => (
    <h2 className="mb-3 mt-10 font-mono text-xs uppercase tracking-[0.2em] text-white/40">{name}</h2>
  );
  const approveBtn = (label: string, p: Partial<PipelineCompany>) => (
    <button onClick={() => patch(p)} className="rounded-md border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-400 hover:text-black">
      {label}
    </button>
  );

  return (
    <main className="min-h-screen bg-[#050505] px-8 py-10 text-white">
      <div className="mx-auto w-full max-w-3xl">
      <Link href="/pipeline" className="font-mono text-xs text-white/40 hover:text-white">back</Link>
      <div className="mt-4 flex items-center gap-4">
        {c.logo?.path && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={c.logo.path} alt="" className="h-10 w-10 rounded-md object-contain" />
        )}
        <div>
          <h1 className="text-xl font-medium tracking-tight">{c.company}</h1>
          <p className="text-sm text-white/50">{c.role}</p>
        </div>
        <StatusPill status={c.status} />
      </div>

      {c.status === "page_draft" && c.research && (
        <>
          {gate("Research")}
          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-4 text-sm leading-relaxed text-white/70">
            <p>{c.research.summary}</p>
            <p className="mt-2 text-white/90">Hook: {c.research.hook}</p>
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
          <div className="space-y-6 rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
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
              <span className="self-center font-mono text-xs text-white/40">changes: come to chat</span>
            </div>
          )}
        </>
      )}

      {c.status === "build" && (
        <>
          {gate("Step 3: building")}
          <p className="font-mono text-xs text-white/40">config and page being built, come back shortly</p>
        </>
      )}

      {c.status === "pages_ready" && (
        <>
          {gate("Step 3: live page")}
          <LaptopEmbed slug={c.slug} />
          <div className="mt-4 flex items-center gap-3">
            <a href={`/${c.slug}`} target="_blank" className="rounded-md border border-white/25 px-3 py-1.5 text-xs hover:bg-white hover:text-black">
              open full tab
            </a>
            {approveBtn("Page looks good, show messages", { status: "outreach" })}
          </div>
        </>
      )}

      {(c.status === "outreach" || c.status === "applied") && (
        <>
          {c.research && c.research.humans.length > 0 && (
            <>
              {gate("The people")}
              <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
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
            </>
          )}

          {c.appText && (
            <>
              {gate("Application text")}
              <div className="space-y-3">
                {c.appText.variants.map((v, i) => (
                  <div key={v.label} className={c.appText?.approvedIndex === i ? "rounded-xl ring-1 ring-white/40" : ""}>
                    <CopyBlock label={`${v.label}${c.appText?.approvedIndex === i ? " (picked)" : ""}`} text={v.text} />
                    {c.status === "outreach" && c.appText?.approvedIndex !== i && (
                      <div className="mt-2">
                        {approveBtn(`Use "${v.label}"`, { appText: { ...c.appText!, approvedIndex: i } })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {c.notes && (
            <>
              {gate("Connection notes")}
              <div className="space-y-3">
                {c.notes.map((n) => (
                  <CopyBlock key={n.persona} label={`${n.persona}${n.target ? `: ${n.target}` : ""}`} text={n.text} />
                ))}
              </div>
            </>
          )}

          {c.status === "outreach" && (
            <div className="mt-6">
              {approveBtn("Mark applied", { status: "applied", applied: { done: true, date: new Date().toISOString().slice(0, 10) } })}
            </div>
          )}
          {c.status === "applied" && c.applied?.date && (
            <p className="mt-6 font-mono text-xs text-emerald-400/70">applied {c.applied.date}</p>
          )}
        </>
      )}
      </div>
    </main>
  );
}
