"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Widget mock for the Atria pitch page (research.widgetConcept.key = "biomarkers").
 *
 * Concept: a longitudinal member panel. Pick a marker and the raw inputs
 * (noisy wearable stream + sparse lab draws) reconcile into one clean
 * timeline. It shows the exact data problem Atria's member experience has
 * to solve, using a system Sujin already shipped at Vanta.
 *
 * Self-contained: no external libraries, no shared styles.
 */

const ACCENT = "#d9b47a";

type Marker = {
  id: string;
  name: string;
  unit: string;
  source: string;
  base: number;
  drift: number;
  noise: number;
};

const MARKERS: Marker[] = [
  { id: "hrv", name: "Heart rate variability", unit: "ms", source: "Wearable, continuous", base: 58, drift: 9, noise: 11 },
  { id: "rhr", name: "Resting heart rate", unit: "bpm", source: "Wearable, nightly", base: 54, drift: -4, noise: 5 },
  { id: "apob", name: "ApoB", unit: "mg/dL", source: "Lab panel, quarterly", base: 92, drift: -18, noise: 4 },
  { id: "hba1c", name: "HbA1c", unit: "%", source: "Lab panel, quarterly", base: 5.6, drift: -0.3, noise: 0.12 },
  { id: "vo2", name: "VO2 max", unit: "ml/kg/min", source: "Lab + wearable estimate", base: 41, drift: 6, noise: 2.4 },
];

const POINTS = 48;

/** Deterministic pseudo-random so the mock renders identically every time. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x) - 0.5;
}

function buildSeries(marker: Marker, seedOffset: number) {
  const clean: number[] = [];
  const raw: number[] = [];
  for (let i = 0; i < POINTS; i += 1) {
    const t = i / (POINTS - 1);
    const wave = Math.sin(t * Math.PI * 1.6) * marker.noise * 0.28;
    const value = marker.base + marker.drift * t + wave;
    clean.push(value);
    raw.push(value + rand(i + seedOffset) * marker.noise * 2);
  }
  return { clean, raw };
}

function toPath(values: number[], min: number, max: number, w: number, h: number) {
  const span = max - min || 1;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function AtriaMock() {
  const [activeId, setActiveId] = useState(MARKERS[0].id);
  const [reconciledId, setReconciledId] = useState<string | null>(null);
  const reconciled = reconciledId === activeId;

  const marker = MARKERS.find((m) => m.id === activeId) ?? MARKERS[0];
  const index = MARKERS.indexOf(marker);

  const { clean, raw } = useMemo(() => buildSeries(marker, index * 37 + 5), [marker, index]);

  useEffect(() => {
    const id = window.setTimeout(() => setReconciledId(activeId), 420);
    return () => window.clearTimeout(id);
  }, [activeId]);

  const W = 620;
  const H = 190;
  const all = [...clean, ...raw];
  const min = Math.min(...all) - 1;
  const max = Math.max(...all) + 1;

  const rawPath = toPath(raw, min, max, W, H);
  const cleanPath = toPath(clean, min, max, W, H);

  const labDraws = [6, 20, 33, 45].map((i) => ({
    x: (i / (POINTS - 1)) * W,
    y: H - ((clean[i] - min) / (max - min)) * H,
  }));

  const latest = clean[clean.length - 1];
  const first = clean[0];
  const delta = latest - first;
  const decimals = marker.base < 10 ? 2 : 1;

  return (
    <div
      style={{
        background: "#0a0a0b",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 24,
        color: "#e8e6e3",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        maxWidth: 940,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(232,230,227,0.45)" }}>
            Member panel
          </div>
          <div style={{ fontSize: 15, marginTop: 6, color: "rgba(232,230,227,0.75)" }}>
            Twelve months. Two sources. One timeline.
          </div>
        </div>
        <div style={{ fontSize: 11, color: "rgba(232,230,227,0.4)", fontFamily: "ui-monospace, monospace" }}>
          {reconciled ? "reconciled" : "reconciling"}
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 220px", display: "flex", flexDirection: "column", gap: 4 }}>
          {MARKERS.map((m) => {
            const active = m.id === activeId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveId(m.id)}
                style={{
                  textAlign: "left",
                  background: active ? "rgba(217,180,122,0.10)" : "transparent",
                  border: "none",
                  borderLeft: `2px solid ${active ? ACCENT : "rgba(255,255,255,0.09)"}`,
                  padding: "10px 12px",
                  cursor: "pointer",
                  color: active ? "#f6ead6" : "rgba(232,230,227,0.55)",
                  transition: "all 220ms ease",
                }}
              >
                <div style={{ fontSize: 13 }}>{m.name}</div>
                <div style={{ fontSize: 10.5, marginTop: 3, color: "rgba(232,230,227,0.35)" }}>{m.source}</div>
              </button>
            );
          })}
        </div>

        <div style={{ flex: "1 1 360px", minWidth: 320 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 30, fontWeight: 300, letterSpacing: "-0.02em" }}>
              {latest.toFixed(decimals)}
            </span>
            <span style={{ fontSize: 12, color: "rgba(232,230,227,0.45)" }}>{marker.unit}</span>
            <span style={{ fontSize: 12, color: ACCENT, marginLeft: 6, fontFamily: "ui-monospace, monospace" }}>
              {delta >= 0 ? "+" : ""}
              {delta.toFixed(decimals)} over 12 mo
            </span>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ overflow: "visible" }}>
            <path
              d={rawPath}
              fill="none"
              stroke="rgba(232,230,227,0.30)"
              strokeWidth={1}
              style={{
                opacity: reconciled ? 0.18 : 0.85,
                transition: "opacity 900ms ease",
              }}
            />
            <path
              d={cleanPath}
              fill="none"
              stroke={ACCENT}
              strokeWidth={1.75}
              strokeLinecap="round"
              style={{
                opacity: reconciled ? 1 : 0,
                filter: `drop-shadow(0 0 6px ${ACCENT}55)`,
                transition: "opacity 900ms ease 120ms",
              }}
            />
            {labDraws.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={3}
                fill="#0a0a0b"
                stroke={ACCENT}
                strokeWidth={1.4}
                style={{
                  opacity: reconciled ? 1 : 0,
                  transition: `opacity 500ms ease ${400 + i * 90}ms`,
                }}
              />
            ))}
          </svg>

          <div style={{ display: "flex", gap: 20, marginTop: 14, fontSize: 11, color: "rgba(232,230,227,0.42)" }}>
            <span>
              <span style={{ display: "inline-block", width: 14, height: 1, background: "rgba(232,230,227,0.4)", verticalAlign: "middle", marginRight: 6 }} />
              raw device stream
            </span>
            <span>
              <span style={{ display: "inline-block", width: 14, height: 2, background: ACCENT, verticalAlign: "middle", marginRight: 6 }} />
              reconciled series
            </span>
            <span>
              <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: 7, border: `1.4px solid ${ACCENT}`, verticalAlign: "middle", marginRight: 6 }} />
              lab draw
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 22,
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          fontSize: 12.5,
          lineHeight: 1.6,
          color: "rgba(232,230,227,0.5)",
        }}
      >
        This is the part nobody demos. Device streams disagree with lab draws, backfill arrives late, and the member
        still needs one number they can trust. I shipped that engine at Vanta across 39 phased rollouts.
      </div>
    </div>
  );
}
