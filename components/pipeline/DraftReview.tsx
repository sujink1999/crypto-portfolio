"use client";
import { useState } from "react";
import type { DraftCopy } from "@/lib/pipeline/schema";

/**
 * Review surface for the drafter's single optimized draft (variant system
 * removed 2026-08-08): one line per story beat, one claim per requirement.
 * Click a line to edit; Save writes the whole draft back to the row. Redrafts
 * of a section happen in chat ("redraft beat 2").
 */

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

function Line({
  title,
  need,
  text,
  onEdit,
}: {
  title: string;
  need?: string;
  text: string;
  onEdit: (text: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="border-t border-white/10 pt-5 first-of-type:border-t-0 first-of-type:pt-0">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">{title}</p>
      {need && <p className="mb-2 text-xs italic text-white/35">{need}</p>}
      {editing ? (
        <textarea
          autoFocus
          defaultValue={text}
          onBlur={(e) => {
            onEdit(e.target.value);
            setEditing(false);
          }}
          rows={3}
          className="w-full resize-y rounded-lg border border-white/20 bg-black/40 p-3 text-base leading-relaxed text-white/90 outline-none focus:border-white/40"
        />
      ) : (
        <p
          onClick={() => setEditing(true)}
          title="Click to edit"
          className="cursor-text rounded-lg p-0.5 text-base leading-relaxed text-white/85 transition-colors hover:bg-white/[0.03]"
        >
          <Emph text={text} />
        </p>
      )}
    </div>
  );
}

export default function DraftReview({
  draft: initial,
  saving,
  onSave,
}: {
  draft: DraftCopy;
  saving: boolean;
  onSave: (next: DraftCopy) => void;
}) {
  const [draft, setDraft] = useState<DraftCopy>(() => structuredClone(initial));
  const [showNotes, setShowNotes] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  const update = (fn: (d: DraftCopy) => void) =>
    setDraft((d) => {
      const next = structuredClone(d);
      fn(next);
      return next;
    });

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
      <div className="mb-5 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
          Draft copy · {draft.register} register
        </p>
        {draft.verifierNotes && (
          <button
            onClick={() => setShowNotes((s) => !s)}
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 underline decoration-white/20 transition-colors hover:text-white"
          >
            {showNotes ? "Hide verifier notes" : "Verifier notes"}
          </button>
        )}
      </div>
      {showNotes && draft.verifierNotes && (
        <pre className="mb-5 whitespace-pre-wrap rounded-lg border border-white/10 bg-black/30 p-4 font-mono text-[11px] leading-relaxed text-white/50">
          {draft.verifierNotes}
        </pre>
      )}

      <div className="space-y-5">
        {draft.story.map((line, beat) => (
          <Line
            key={`beat-${beat}`}
            title={`Beat ${beat + 1}`}
            text={line}
            onEdit={(text) => update((d) => void (d.story[beat] = text))}
          />
        ))}
        {draft.claims.map((claim, ci) => (
          <Line
            key={claim.label}
            title={claim.label}
            need={claim.need}
            text={claim.text}
            onEdit={(text) => update((d) => void (d.claims[ci].text = text))}
          />
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
          Save edits
        </button>
        <span className="font-mono text-[11px] text-white/35">
          {dirty ? "unsaved changes" : "redrafts: come to chat"}
        </span>
      </div>
    </div>
  );
}
