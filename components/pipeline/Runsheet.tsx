"use client";

import { useState } from "react";
import type { PipelineCompany, OutreachTarget } from "@/lib/pipeline/types";

const firstName = (name: string) => name.split(" ")[0];

function noteFor(t: OutreachTarget, c: PipelineCompany): string | null {
  if (t.noteKind === null) return null;
  const url = `https://sujin.tech/${c.slug}`;
  if (t.noteKind === "peer") {
    return `Hey ${firstName(t.name)}, I applied for the ${c.role} role. I built a page just for this application: your JD mapped to work I've shipped:\n\n${url}\n\nIt would be great if you could put it in front of the team.`;
  }
  return `Hey ${firstName(t.name)}, I applied for the ${c.role} role. Instead of a cover letter I built you a page:\n\n${url}\n\nTwo minute read.`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={`shrink-0 rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
        copied
          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
          : "border-white/15 text-white/60 hover:border-white/35 hover:text-white"
      }`}
    >
      {copied ? "Copied" : "Copy note"}
    </button>
  );
}

function Row({
  t,
  index,
  note,
  busy,
  onToggle,
}: {
  t: OutreachTarget;
  index: number;
  note: string | null;
  busy: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const checked = t.status !== "to_send";
  return (
    <li
      className={`group rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-opacity ${
        checked ? "opacity-40" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          disabled={busy}
          aria-label={checked ? "Mark not sent" : "Mark sent"}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors disabled:cursor-wait ${
            checked ? "border-emerald-400/60 bg-emerald-400/20" : "border-white/25 hover:border-white/50"
          }`}
        >
          {busy ? (
            <span className="h-2.5 w-2.5 animate-spin rounded-full border border-white/20 border-t-white/70" />
          ) : (
            checked && (
              <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-none stroke-emerald-300 stroke-[1.8]">
                <path d="M1 4l2.5 2.5L9 1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )
          )}
        </button>
        <span className="w-5 shrink-0 font-mono text-[11px] text-white/25">{String(index + 1).padStart(2, "0")}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="truncate font-medium text-white">{t.name}</span>
            <span className="truncate text-sm text-white/40">{t.role}</span>
          </div>
          {t.signal && (
            <p className="mt-0.5 truncate font-mono text-[11px] text-white/30">{t.signal}</p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
            t.noteKind ? "border-sky-400/30 text-sky-300/90" : "border-white/15 text-white/40"
          }`}
        >
          {t.noteKind ? "With note" : "Bare request"}
        </span>
        <a
          href={t.url}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
        >
          Open
          <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 fill-none stroke-current stroke-[1.4]">
            <path d="M2 8L8 2M3.5 2H8v4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        {note && <CopyButton text={note} />}
        {note && (
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Hide note" : "Show note"}
            className="shrink-0 rounded-md border border-white/15 px-2 py-1.5 font-mono text-[11px] text-white/60 transition-colors hover:border-white/35 hover:text-white"
          >
            <svg
              viewBox="0 0 10 6"
              className={`h-2 w-2.5 fill-none stroke-current stroke-[1.4] transition-transform ${open ? "rotate-180" : ""}`}
            >
              <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      {note && open && (
        <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-white/[0.06] bg-black/40 p-4 font-mono text-[12.5px] leading-relaxed text-white/70">
          {note}
        </pre>
      )}
    </li>
  );
}

/** Per-company outreach runsheet: the final step on the detail page. */
export default function Runsheet({
  c,
  onPatch,
}: {
  c: PipelineCompany;
  onPatch: (outreach: OutreachTarget[]) => Promise<void>;
}) {
  const [busyUrl, setBusyUrl] = useState<string | null>(null);
  const targets = c.outreach ?? [];
  const remaining = targets.filter((t) => t.status === "to_send");
  const sent = targets.filter((t) => t.status !== "to_send");

  const toggle = async (url: string) => {
    setBusyUrl(url);
    try {
      const outreach = targets.map((t): OutreachTarget => {
        if (t.url !== url) return t;
        return t.status === "to_send"
          ? { ...t, status: "sent", sentAt: new Date().toISOString().slice(0, 10) }
          : { ...t, status: "to_send", sentAt: undefined };
      });
      await onPatch(outreach);
    } finally {
      setBusyUrl(null);
    }
  };

  if (targets.length === 0) {
    return (
      <p className="font-mono text-xs text-white/35">
        No outreach targets yet. The local sweep harvests them from LinkedIn.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-white/45">
        Open the profile, hit Connect. Rows tagged with note: Add a note, copy, paste, send. Bare
        requests go without a note, pitch lands in the DM after they accept.
      </p>
      {remaining.length > 0 && (
        <>
          <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
            To send · {remaining.length}
          </h3>
          <ul className="space-y-2.5">
            {remaining.map((t, i) => (
              <Row key={t.url} t={t} index={i} note={noteFor(t, c)} busy={busyUrl === t.url} onToggle={() => toggle(t.url)} />
            ))}
          </ul>
        </>
      )}
      {sent.length > 0 && (
        <>
          <h3 className="mt-8 mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
            Already sent
          </h3>
          <ul className="space-y-2.5">
            {sent.map((t, i) => (
              <Row key={t.url} t={t} index={i} note={noteFor(t, c)} busy={busyUrl === t.url} onToggle={() => toggle(t.url)} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
