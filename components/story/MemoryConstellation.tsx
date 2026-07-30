"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Full-screen overlay: the Vanta agent-memory architecture as a living
 * diagram. Each node is a miniature of the real component - chat turn,
 * extractor, fact rows, weekly rollups, snapshot layers, the assembled
 * prompt - connected by drawn edges with light travelling the data path.
 * One node is "active" at a time; auto-advances until the reader clicks.
 *
 * Every detail line is true of the shipped system (os-backend).
 */

interface Node {
  id: string;
  label: string;
  detail: string;
}

const NODES: Node[] = [
  {
    id: "turn",
    label: "AGENT TURN",
    detail:
      "User message plus agent reply. The agent just talks. It never writes memory inline.",
  },
  {
    id: "extractor",
    label: "EXTRACTOR",
    detail:
      "A small model runs after the reply is sent and extracts what's worth keeping. Moving writes out of the agent loop cut about 3 seconds of latency from every turn.",
  },
  {
    id: "facts",
    label: "FACTS",
    detail:
      "Durable facts, keyed by slug, with supersession and expiry. A stale fact never reaches a prompt. Capped at 40 facts (about 1k tokens) so a month-six user costs the same as day one.",
  },
  {
    id: "rollups",
    label: "ROLLUPS",
    detail:
      "Weekly LLM summaries of the user's journal. Day-level structure preserved, timezone aware, idempotent, no cron.",
  },
  {
    id: "snapshot",
    label: "SNAPSHOT",
    detail:
      "Every tier assembled into one byte-stable context block, so the prompt-cache prefix survives across turns.",
  },
  {
    id: "prompt",
    label: "PROMPT",
    detail:
      "The snapshot is assembled once at chat start and stays fixed, so the cache keeps hitting. The agent remembers months of history in about 1k tokens, and the user never waited for any of it.",
  },
];

const EDGES: [string, string][] = [
  ["turn", "extractor"],
  ["extractor", "facts"],
  ["extractor", "rollups"],
  ["facts", "snapshot"],
  ["rollups", "snapshot"],
  ["snapshot", "prompt"],
];

/* node centers in diagram space - HTML cards and SVG edges share these */
const POS_H: Record<string, [number, number]> = {
  turn: [90, 250],
  extractor: [295, 250],
  facts: [520, 115],
  rollups: [520, 385],
  snapshot: [740, 250],
  prompt: [925, 250],
};
const POS_V: Record<string, [number, number]> = {
  turn: [180, 70],
  extractor: [180, 205],
  facts: [90, 345],
  rollups: [270, 345],
  snapshot: [180, 485],
  prompt: [180, 615],
};

const AUTO_ADVANCE_MS = 4500;

/* ---------- miniature component visuals (pure HTML/CSS) ---------- */

function TurnWidget() {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="ml-auto max-w-[80%] rounded-lg rounded-br-sm bg-[color-mix(in_srgb,var(--accent)_28%,transparent)] px-2 py-1">
        <div className="h-1 w-10 rounded bg-white/60" />
      </div>
      <div className="mr-auto max-w-[85%] rounded-lg rounded-bl-sm bg-white/10 px-2 py-1">
        <div className="h-1 w-14 rounded bg-white/40" />
        <div className="mt-1 h-1 w-9 rounded bg-white/25" />
      </div>
    </div>
  );
}

function ExtractorWidget() {
  return (
    <div className="flex w-full flex-col items-center gap-1">
      {/* prose lines feeding the funnel */}
      <div className="flex w-full justify-center gap-1">
        <div className="h-1 w-6 rounded bg-white/30" />
        <div className="h-1 w-4 rounded bg-white/20" />
        <div className="h-1 w-5 rounded bg-white/30" />
      </div>
      {/* funnel */}
      <div
        className="h-4 w-10 border-x border-b border-white/30"
        style={{ clipPath: "polygon(0 0, 100% 0, 62% 100%, 38% 100%)", background: "color-mix(in srgb, var(--accent) 14%, transparent)" }}
      />
      {/* distilled fact chip */}
      <div className="rounded border border-[color-mix(in_srgb,var(--accent)_55%,transparent)] px-1.5 py-0.5 font-mono text-[7px] leading-none text-accent">
        fact
      </div>
    </div>
  );
}

function FactsWidget() {
  const row = "flex items-center gap-1 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5";
  return (
    <div className="flex w-full flex-col gap-1 font-mono text-[7px] leading-none text-white/60">
      <div className={row}>
        <span className="h-1 w-1 rounded-full bg-accent" />
        mg_400_night
      </div>
      <div className={row}>
        <span className="h-1 w-1 rounded-full bg-accent" />
        vegan_diet
      </div>
      <div className={`${row} opacity-40`}>
        <span className="h-1 w-1 rounded-full bg-white/40" />
        <span className="line-through">sleep_5h</span>
        <span className="ml-auto text-[6px] text-white/40">superseded</span>
      </div>
    </div>
  );
}

function RollupsWidget() {
  const bars = [10, 16, 7, 13, 18, 9, 14];
  return (
    <div className="flex w-full flex-col items-center gap-1">
      <div className="flex items-end gap-[3px]">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-[5px] rounded-sm bg-white/30"
            style={{ height: h }}
          />
        ))}
      </div>
      <svg width="64" height="8" viewBox="0 0 64 8" className="text-white/30">
        <path d="M2 1 C 2 6, 62 6, 62 1 M 32 5 V 8" stroke="currentColor" fill="none" strokeWidth="0.75" />
      </svg>
      <div className="rounded border border-white/15 px-1.5 py-0.5 font-mono text-[7px] leading-none text-white/60">
        week 12 · 1 para
      </div>
    </div>
  );
}

function SnapshotWidget() {
  return (
    <div className="relative h-12 w-14">
      <div className="absolute left-3 top-0 h-9 w-10 rounded border border-white/10 bg-white/[0.03]" />
      <div className="absolute left-1.5 top-1.5 h-9 w-10 rounded border border-white/15 bg-[#101010]" />
      <div className="absolute left-0 top-3 h-9 w-10 rounded border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[#0c0c0c] p-1">
        <div className="h-1 w-7 rounded bg-[color-mix(in_srgb,var(--accent)_60%,transparent)]" />
        <div className="mt-1 h-0.5 w-6 rounded bg-white/25" />
        <div className="mt-0.5 h-0.5 w-7 rounded bg-white/25" />
        <div className="mt-0.5 h-0.5 w-5 rounded bg-white/25" />
      </div>
    </div>
  );
}

function PromptWidget() {
  return (
    <div className="w-full rounded border border-white/15 bg-[#0a0a0a]">
      <div className="flex gap-1 border-b border-white/10 px-1.5 py-1">
        <span className="h-1 w-1 rounded-full bg-white/25" />
        <span className="h-1 w-1 rounded-full bg-white/25" />
      </div>
      <div className="px-1.5 py-1.5 font-mono text-[7px] leading-relaxed text-white/60">
        <span className="text-accent">›</span> ctx ~1k tok
        <span className="mem-caret ml-0.5 inline-block h-[7px] w-[3px] translate-y-[1px] bg-accent" />
      </div>
    </div>
  );
}

const WIDGETS: Record<string, () => React.ReactElement> = {
  turn: TurnWidget,
  extractor: ExtractorWidget,
  facts: FactsWidget,
  rollups: RollupsWidget,
  snapshot: SnapshotWidget,
  prompt: PromptWidget,
};

/* ---------- overlay ---------- */

export default function MemoryConstellation({
  accent,
  onClose,
}: {
  accent: string;
  onClose: () => void;
}) {
  const [vertical, setVertical] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(0);
  const userLocked = useRef(false);

  useEffect(() => {
    const mqV = window.matchMedia("(max-width: 639px)");
    const mqR = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setVertical(mqV.matches);
      setReduced(mqR.matches);
    };
    sync();
    mqV.addEventListener("change", sync);
    mqR.addEventListener("change", sync);
    return () => {
      mqV.removeEventListener("change", sync);
      mqR.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* walk the pipeline until the reader takes over */
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      if (!userLocked.current) setActive((a) => (a + 1) % NODES.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [reduced]);

  const pos = vertical ? POS_V : POS_H;
  const [W, H] = vertical ? [360, 680] : [1000, 500];

  const edges = useMemo(
    () =>
      EDGES.map(([a, b], i) => ({
        key: `${a}-${b}`,
        d: `M ${pos[a][0]} ${pos[a][1]} L ${pos[b][0]} ${pos[b][1]}`,
        delay: 0.5 + i * 0.18,
      })),
    [pos]
  );

  return (
    <div
      className="mem-overlay fixed inset-0 z-[70] bg-black/95 text-white select-none"
      style={{ "--accent": accent } as React.CSSProperties}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Vanta agent-memory architecture"
    >
      <div className="story-vignette absolute inset-0 pointer-events-none" />
      <div className="story-grain absolute inset-0 pointer-events-none" />

      <div
        className="absolute inset-0 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-start justify-between px-6 pt-6 md:px-10 md:pt-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-white/35">
              VANTA / OS-BACKEND
            </p>
            <p className="mt-2 text-sm md:text-base text-white/70">
              How Vanta remembers
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-m-2 p-2 text-white/40 transition-colors hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M4 4 L16 16 M16 4 L4 16" />
            </svg>
          </button>
        </div>

        {/* diagram: SVG edge layer behind, HTML component cards on top,
            both mapped onto the same coordinate space */}
        <div className="flex min-h-0 flex-1 items-center justify-center px-3 md:px-10">
          {/* sized from the available height, clamped by width - the diagram
              scales down instead of overflowing on short/narrow screens */}
          <div
            className="relative"
            style={{
              aspectRatio: `${W} / ${H}`,
              height: "100%",
              maxWidth: "min(64rem, 100%)",
            }}
          >
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              {edges.map((e) => (
                <path
                  key={e.key}
                  d={e.d}
                  fill="none"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth="1"
                  pathLength={1}
                  className="mem-edge"
                  style={{ "--d": `${e.delay}s` } as React.CSSProperties}
                />
              ))}
              {/* travelling light - data moving through the pipeline */}
              {!reduced &&
                edges.map((e, i) => (
                  <circle key={`dot-${e.key}`} r="2.4" fill={accent} opacity="0.9">
                    <animateMotion
                      dur="2.4s"
                      begin={`${1.2 + i * 0.4}s`}
                      repeatCount="indefinite"
                      path={e.d}
                    />
                  </circle>
                ))}
            </svg>

            {NODES.map((n, i) => {
              const [x, y] = pos[n.id];
              const isActive = active === i;
              const Widget = WIDGETS[n.id];
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    userLocked.current = true;
                    setActive(i);
                  }}
                  className={`mem-node absolute flex w-[6.25rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-xl border p-2 backdrop-blur-sm transition-all duration-500 md:w-[8.5rem] md:gap-2 md:p-3 ${
                    isActive
                      ? "border-[color-mix(in_srgb,var(--accent)_60%,transparent)] bg-white/[0.05] shadow-[0_0_36px_color-mix(in_srgb,var(--accent)_22%,transparent)]"
                      : "border-white/10 bg-black/60 hover:border-white/25"
                  }`}
                  style={
                    {
                      left: `${(x / W) * 100}%`,
                      top: `${(y / H) * 100}%`,
                      "--d": `${0.3 + i * 0.15}s`,
                    } as React.CSSProperties
                  }
                >
                  <Widget />
                  <span
                    className={`font-mono text-[8px] tracking-[0.22em] transition-colors duration-500 md:text-[9px] ${
                      isActive ? "text-white" : "text-white/40"
                    }`}
                  >
                    {n.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* detail card */}
        <div className="px-6 pb-6 md:px-10 md:pb-8">
          {/* fixed-height slot: detail centers in it, caption stays pinned,
              nothing shifts as texts of different lengths swap through */}
          <div className="mx-auto flex h-[12rem] max-w-2xl flex-col text-center md:h-[10.5rem]">
            <div className="grid flex-1 place-items-center">
              <p
                key={NODES[active].id}
                className="mem-detail text-sm md:text-base leading-relaxed text-white/75"
              >
                <span className="font-mono text-[10px] tracking-[0.25em]" style={{ color: accent }}>
                  {NODES[active].label}
                </span>
                <span className="mt-2 block">{NODES[active].detail}</span>
              </p>
            </div>
            <p className="pt-4 text-balance text-xs md:text-sm text-white/35">
              Facts, rollups, snapshots, extraction. One product, one shape of
              memory, weeks of work. That&apos;s the strongest case for making
              it infrastructure I know.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
