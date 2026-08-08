"use client";
import { useState } from "react";
import type { Application } from "@/lib/pipeline/types";

/**
 * 7c review surface: the real portal questions with Fable's one drafted
 * answer each. Sujin edits inline, approves per question, copies into the
 * portal by hand; submitting stays manual. Saves back the application jsonb.
 */

const STATUS_FLOW = ["pending", "drafted", "approved", "submitted"] as const;
type QStatus = (typeof STATUS_FLOW)[number];

const STATUS_STYLE: Record<QStatus, string> = {
  pending: "border-white/15 text-white/45",
  drafted: "border-sky-400/35 text-sky-300/90",
  approved: "border-emerald-400/40 text-emerald-300/90",
  submitted: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300/60",
};

const TYPE_LABEL: Record<string, string> = {
  short: "short text",
  long: "long text",
  select: "select",
  file: "file",
  checkbox: "checkbox",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={`shrink-0 rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
        copied
          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
          : "border-white/15 text-white/60 hover:border-white/35 hover:text-white"
      }`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function ApplicationPanel({
  app,
  saving,
  onSave,
}: {
  app: Application;
  saving: boolean;
  onSave: (next: Application) => void;
}) {
  const [draft, setDraft] = useState<Application>(() => structuredClone(app));
  const [editing, setEditing] = useState<string | null>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(app);

  const setQ = (id: string, patch: Partial<Application["questions"][number]>) =>
    setDraft((d) => ({
      ...d,
      questions: d.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    }));

  const answered = draft.questions.filter((q) => q.draft && q.status !== "pending").length;

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
          Portal questions · {answered}/{draft.questions.length} drafted
        </p>
        <a
          href={app.formUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-white/50 transition-colors hover:text-white"
        >
          {new URL(app.formUrl).hostname.replace("www.", "")}
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1.5 8.5 L8.5 1.5 M3.5 1.5 H8.5 V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      <div className="space-y-6">
        {draft.questions.map((q, i) => (
          <div key={q.id} className="border-t border-white/10 pt-5 first-of-type:border-t-0 first-of-type:pt-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm leading-snug text-white/85">
                  <span className="mr-2 font-mono text-[11px] text-white/30">{String(i + 1).padStart(2, "0")}</span>
                  {q.label}
                  {q.required && <span className="ml-1.5 align-super text-[10px] text-amber-300/70" title="Required">*</span>}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pl-7">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
                    {TYPE_LABEL[q.type] ?? q.type}
                  </span>
                  {q.options?.map((o) => (
                    <span key={o} className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/40">
                      {o}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {q.draft && <CopyButton text={q.draft} />}
                <button
                  onClick={() => {
                    // submitted is terminal: no wraparound back to pending on a misclick
                    const i = STATUS_FLOW.indexOf(q.status);
                    if (i < STATUS_FLOW.length - 1) setQ(q.id, { status: STATUS_FLOW[i + 1] });
                  }}
                  title={q.status === "submitted" ? "Submitted (terminal; revert in chat if needed)" : "Click to advance status"}
                  className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${q.status === "submitted" ? "cursor-default" : "hover:border-white/40"} ${STATUS_STYLE[q.status]}`}
                >
                  {q.status}
                </button>
              </div>
            </div>

            <div className="mt-3 pl-7">
              {editing === q.id ? (
                <textarea
                  autoFocus
                  defaultValue={q.draft ?? ""}
                  onBlur={(e) => {
                    const text = e.target.value.trim();
                    setQ(q.id, {
                      draft: text || null,
                      ...(text && q.status === "pending" ? { status: "drafted" as const } : {}),
                    });
                    setEditing(null);
                  }}
                  rows={q.type === "long" ? 6 : 2}
                  className="w-full resize-y rounded-lg border border-white/20 bg-black/40 p-3 text-sm leading-relaxed text-white/90 outline-none focus:border-white/40"
                />
              ) : q.draft ? (
                <p
                  onClick={() => setEditing(q.id)}
                  title="Click to edit"
                  className="cursor-text whitespace-pre-wrap rounded-lg p-0.5 text-sm leading-relaxed text-white/70 transition-colors hover:bg-white/[0.03]"
                >
                  {q.draft}
                </p>
              ) : (
                <button
                  onClick={() => setEditing(q.id)}
                  className="rounded-lg border border-dashed border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35 transition-colors hover:border-white/35 hover:text-white/70"
                >
                  No answer yet · write one, or draft in chat
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
        <button
          onClick={() => onSave(draft)}
          disabled={saving || !dirty}
          className="inline-flex items-center gap-2 rounded-md border border-emerald-400/25 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300/90 transition-[color,background-color,border-color,transform] hover:bg-emerald-400 hover:text-black active:scale-[0.98] disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-emerald-300/90"
        >
          {saving && (
            <span className="h-3 w-3 animate-spin rounded-full border border-emerald-300/30 border-t-emerald-300" />
          )}
          Save answers
        </button>
        <span className="font-mono text-[11px] text-white/35">
          {dirty ? "unsaved changes" : `fetched ${app.fetchedAt.slice(0, 10)}`}
        </span>
      </div>
    </div>
  );
}
