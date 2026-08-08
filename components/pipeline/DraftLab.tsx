"use client";
import { useState } from "react";
import { LAB_DRAFTS } from "@/lib/scripter-lab/drafts";

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

export default function DraftLab() {
  const [idx, setIdx] = useState(0);
  const d = LAB_DRAFTS[idx];

  return (
    <div>
      <nav className="mb-10 flex flex-wrap items-center gap-2">
        {LAB_DRAFTS.map((c, i) => (
          <button
            key={c.slug}
            onClick={() => setIdx(i)}
            className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
              i === idx
                ? "border-white/60 bg-white text-black"
                : "border-white/15 text-white/50 hover:border-white/40 hover:text-white"
            }`}
          >
            {c.company}
          </button>
        ))}
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          {d.size} · {d.register} register
        </span>
      </nav>

      <section className="mb-10 rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
        {label("the imaginary jd")}
        <p className="mt-2 text-sm leading-relaxed text-white/60">{d.jdSummary}</p>
      </section>

      <section className="space-y-8 rounded-xl border border-white/10 bg-[#0d0d0d] p-8">
        {label("story")}
        {d.story.map((line, beat) => (
          <div key={beat} className="border-t border-white/10 pt-6 first-of-type:border-t-0">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
              beat {beat + 1}
            </p>
            <p className="text-lg leading-relaxed text-white/85">
              <Emph text={line} />
            </p>
          </div>
        ))}
      </section>

      <section className="mt-8 space-y-8 rounded-xl border border-white/10 bg-[#0d0d0d] p-8">
        {label("requirement claims")}
        {d.claims.map((c) => (
          <div key={c.label} className="border-t border-white/10 pt-6 first-of-type:border-t-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{c.label}</p>
            <p className="mb-3 mt-1 text-xs italic text-white/40">{c.need}</p>
            <p className="text-lg leading-relaxed text-white/85">
              <Emph text={c.text} />
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
