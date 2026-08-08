"use client";
import { useState } from "react";
import { LAB_COMPANIES } from "@/lib/scripter-lab/companies";
import { EVIDENCE } from "@/companies/evidence";
import DraftLab from "./DraftLab";

/** Renders **bold** markers the way the story engine does. */
function Emph({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} className="font-medium text-white">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

const label = (text: string) => (
  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">{text}</p>
);

/** A line the page renders itself; shown so the copy is judged inside its frame. */
function FrameLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
        frame
      </span>
      <p className="text-lg text-white/30">{children}</p>
    </div>
  );
}

export default function ScripterLab() {
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState<"final" | "drafts">("final");
  const { pitch, jdSummary } = LAB_COMPANIES[idx];

  return (
    <main className="min-h-screen bg-[#050505] px-8 py-10 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-medium tracking-tight">Scripter lab</h1>
            <p className="mt-1 text-sm text-white/40">
              {mode === "final"
                ? "Five fictional companies. Full copy, judged inside the page frame."
                : "Drafter output: one optimized line per beat and claim."}
            </p>
          </div>
          <div className="flex gap-4">
            {(["final", "drafts"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`border-b pb-0.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  mode === m
                    ? "border-white text-white"
                    : "border-transparent text-white/40 hover:text-white"
                }`}
              >
                {m === "final" ? "Final copy" : "Drafts"}
              </button>
            ))}
          </div>
        </header>

        {mode === "drafts" ? (
          <DraftLab />
        ) : (
          <>
        <nav className="mb-10 flex flex-wrap gap-2">
          {LAB_COMPANIES.map((c, i) => (
            <button
              key={c.pitch.slug}
              onClick={() => setIdx(i)}
              className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
                i === idx
                  ? "border-white/60 bg-white text-black"
                  : "border-white/15 text-white/50 hover:border-white/40 hover:text-white"
              }`}
            >
              {c.pitch.company}
            </button>
          ))}
        </nav>

        <section className="mb-10 rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
          {label("the imaginary jd")}
          <p className="mt-2 text-sm leading-relaxed text-white/60">{jdSummary}</p>
        </section>

        <section className="space-y-8 rounded-xl border border-white/10 bg-[#0d0d0d] p-8">
          <FrameLine>Hey {pitch.company},</FrameLine>

          <div className="space-y-6">
            {pitch.story.map((s, i) => (
              <p key={i} className="text-2xl leading-snug tracking-tight text-white/75">
                <Emph text={s} />
              </p>
            ))}
          </div>

          <FrameLine>
            So you&apos;re looking for a{" "}
            <span style={{ color: pitch.accent }}>{pitch.role}</span>. Let me save you the
            translation.
          </FrameLine>

          <div className="space-y-6 border-t border-white/10 pt-6">
            {pitch.requirements.map((r) => (
              <div key={r.label}>
                {label(r.label)}
                <p className="mt-1 text-xs italic text-white/35">{r.need}</p>
                <p className="mt-2 text-lg leading-snug text-white/90">{r.claim}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {r.proofs.map((id, i) => (
                    <span
                      key={id}
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${
                        i === 0
                          ? "border-white/30 text-white/90"
                          : "border-white/10 text-white/50"
                      }`}
                    >
                      {EVIDENCE[id]?.title ?? id}
                    </span>
                  ))}
                  {r.stackMatch?.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-dashed border-white/10 px-2.5 py-0.5 font-mono text-[11px] text-white/35"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6">
            {label("close")}
            <p className="mt-2 text-xl text-white/80">{pitch.closing.line}</p>
          </div>
        </section>
          </>
        )}
      </div>
    </main>
  );
}
