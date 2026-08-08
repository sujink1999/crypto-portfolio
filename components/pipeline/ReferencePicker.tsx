"use client";
import { useEffect, useMemo, useState } from "react";

export interface RefItem {
  id: string; // slug:group:index
  slug: string;
  company: string;
  group: string;
  text: string;
}

const GROUP_ORDER = ["beat-1", "beat-2", "beat-3", "claim", "closing"] as const;
const GROUP_LABEL: Record<string, string> = {
  "beat-1": "Beat 1 · about them",
  "beat-2": "Beat 2 · the collision",
  "beat-3": "Beat 3 · the pivot",
  claim: "Requirement claims",
  closing: "Closings",
};

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

export default function ReferencePicker({ items }: { items: RefItem[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/reference-picks")
      .then((r) => r.json())
      .then((d) => {
        const ids = new Set<string>(d.picks ?? []);
        setSelected(new Set(ids));
        setSavedIds(ids);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, RefItem[]>();
    for (const g of GROUP_ORDER) map.set(g, []);
    for (const it of items) map.get(it.group)?.push(it);
    return map;
  }, [items]);

  const dirty =
    loaded &&
    (selected.size !== savedIds.size || [...selected].some((id) => !savedIds.has(id)));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/reference-picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ picks: [...selected] }),
      });
      setSavedIds(new Set(selected));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] px-8 pb-32 pt-10 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-10">
          <h1 className="text-xl font-medium tracking-tight">Reference picker</h1>
          <p className="mt-1 text-sm text-white/40">
            Every paragraph from shipped applications. Click to select the exemplars the
            drafter learns from. Click again to deselect.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-amber-400/20 bg-amber-400/[0.04] px-3 py-1.5 font-mono text-[11px] text-amber-300/70">
            Not wired up yet: the drafter reads the rolling reference pack (draft-refs.ts);
            picks saved here are stored but not consumed
          </p>
        </header>

        <nav className="sticky top-0 z-10 -mx-8 mb-10 border-b border-white/10 bg-[#050505]/90 px-8 py-3 backdrop-blur">
          <div className="flex flex-wrap gap-2">
            {GROUP_ORDER.map((g) => {
              const count = (groups.get(g) ?? []).filter((it) => selected.has(it.id)).length;
              return (
                <a
                  key={g}
                  href={`#${g}`}
                  className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 font-mono text-xs text-white/50 transition-colors hover:border-white/40 hover:text-white"
                >
                  {GROUP_LABEL[g]}
                  <span
                    className={`rounded-full px-1.5 text-[10px] ${
                      count > 0 ? "bg-white text-black" : "bg-white/10 text-white/40"
                    }`}
                  >
                    {count}
                  </span>
                </a>
              );
            })}
          </div>
        </nav>

        {GROUP_ORDER.map((g) => (
          <section key={g} id={g} className="mb-12 scroll-mt-20">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
              {GROUP_LABEL[g]}
            </p>
            <div className="space-y-3">
              {(groups.get(g) ?? []).map((it) => {
                const on = selected.has(it.id);
                return (
                  <button
                    key={it.id}
                    onClick={() => toggle(it.id)}
                    aria-pressed={on}
                    className={`block w-full rounded-xl border p-5 text-left transition-[color,background-color,border-color,transform] hover:-translate-y-px ${
                      on
                        ? "border-white/60 bg-white/[0.06]"
                        : "border-white/[0.07] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                        {it.company}
                      </span>
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                          on ? "border-white bg-white" : "border-white/25"
                        }`}
                      >
                        {on && (
                          <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" aria-hidden>
                            <path
                              d="M1.5 5.5l2.2 2.2L8.5 2.5"
                              fill="none"
                              stroke="#050505"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                    </div>
                    <p
                      className={`leading-snug ${
                        g === "claim" || g === "closing" ? "text-base" : "text-lg"
                      } ${on ? "text-white/90" : "text-white/60"}`}
                    >
                      <Emph text={it.text} />
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 border-t border-white/10 bg-[#050505]/95 px-8 py-4 backdrop-blur transition-transform ${
          dirty ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
          <p className="font-mono text-xs text-white/50">
            {selected.size} selected · unsaved changes
          </p>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-md bg-white px-5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-black transition-opacity transition-transform hover:opacity-85 active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? "Saving" : "Save picks"}
          </button>
        </div>
      </div>
    </main>
  );
}
