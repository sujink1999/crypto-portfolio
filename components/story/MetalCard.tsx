"use client";

import { useCallback, useRef, useState } from "react";
import type { CompanyPitch } from "@/companies/types";

/**
 * The closing artifact: a near-black brushed-metal business card. Cursor
 * tilts it in 3D; the contact actions are milled recesses in the slab -
 * pressing one deepens the recess, and the engraving itself answers:
 * "COPY" becomes "COPIED" under a glint sweeping across the etch.
 * Pure CSS 3D - one object, no meshes, no overlays foreign to the metal.
 */

function MailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 opacity-70">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 opacity-70">
      <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

/* a milled recess: dark floor, shadow under the top lip, faint light on the
   bottom lip - light falls from above. Press deepens the cut. */
const RECESS =
  "group/row flex w-full cursor-pointer items-center justify-between gap-4 rounded-[3px] px-3 py-2 text-left transition-[box-shadow,background] duration-200 " +
  "bg-black/45 hover:bg-black/55 active:bg-black/70";
const RECESS_SHADOW = {
  boxShadow:
    "inset 0 2px 3px rgba(0,0,0,0.9), inset 0 -1px 0 rgba(255,255,255,0.07), inset 1px 0 2px rgba(0,0,0,0.5), inset -1px 0 2px rgba(0,0,0,0.5)",
};
const RECESS_SHADOW_PRESSED = {
  boxShadow:
    "inset 0 4px 6px rgba(0,0,0,0.95), inset 0 -1px 0 rgba(255,255,255,0.04), inset 1px 0 3px rgba(0,0,0,0.6), inset -1px 0 3px rgba(0,0,0,0.6)",
};

export default function MetalCard({ closing }: { closing: CompanyPitch["closing"] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [copied, setCopied] = useState<"email" | "phone" | null>(null);
  const [pressed, setPressed] = useState<"email" | "phone" | null>(null);
  const copyTimer = useRef<number>(0);

  const onMove = useCallback((e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${-(y - 0.5) * 6}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
    });
  }, []);

  const onLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  const copy = (kind: "email" | "phone", value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(kind);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(null), 1800);
  };

  const row = (kind: "email" | "phone", value: string, icon: React.ReactNode, label: string) => (
    <button
      type="button"
      onClick={() => copy(kind, value)}
      onPointerDown={() => setPressed(kind)}
      onPointerUp={() => setPressed(null)}
      onPointerLeave={() => setPressed(null)}
      className={RECESS}
      style={pressed === kind ? RECESS_SHADOW_PRESSED : RECESS_SHADOW}
    >
      <span className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.08em] text-white/70 transition-colors duration-300 group-hover/row:text-white/90 md:text-[12px]">
        {icon}
        {label}
      </span>
      <span
        className={`font-mono text-[9px] tracking-[0.25em] uppercase transition-colors duration-300 ${
          copied === kind ? "text-white/90" : "text-white/40 group-hover/row:text-white/70"
        }`}
      >
        {copied === kind ? "copied" : "copy"}
      </span>
    </button>
  );

  return (
    <div className="w-full [perspective:1100px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        ref={cardRef}
        className="metal-card group relative mx-auto aspect-[1.7/1] w-[21rem] select-none md:w-[26rem]"
        style={
          {
            "--rx": "0deg",
            "--ry": "0deg",
            transform: "rotateX(var(--rx)) rotateY(var(--ry)) translateZ(0)",
            transformStyle: "preserve-3d",
            transition: "transform 0.18s ease-out",
          } as React.CSSProperties
        }
      >
        {/* the slab: brushed metal built from layered gradients */}
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: [
              /* brushed grain - hairline horizontal strokes */
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 3px)",
              /* the metal body */
              "linear-gradient(112deg, #08090b 0%, #101216 30%, #050608 52%, #111318 74%, #07080a 100%)",
            ].join(","),
            boxShadow:
              "0 30px 60px -18px rgba(0,0,0,0.85), 0 6px 18px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
        {/* milled top edge catching the room light */}
        <div
          className="absolute inset-x-0 top-0 h-px rounded-t-lg opacity-50"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
          }}
        />

        {/* engraved face */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-5 md:p-6"
          style={{ transform: "translateZ(18px)" }}
        >
          <div className="text-left">
            <p className="metal-engrave text-lg font-medium tracking-[-0.01em] text-white/85 md:text-xl">
              Sujin K
            </p>
            <p className="mt-0.5 font-mono text-[9px] tracking-[0.28em] uppercase text-white/35">
              full-stack engineer
            </p>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            {row("email", closing.email, <MailIcon />, "email")}
            {closing.whatsapp && row("phone", closing.whatsapp, <PhoneIcon />, "phone")}
            {/* engraved edge tabs */}
            <div className="mt-2 flex items-center gap-4 border-t border-white/10 pt-2.5">
              {closing.resumeUrl && (
                <a
                  href={closing.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/60 transition-colors duration-300 hover:text-white"
                >
                  resume ↗
                </a>
              )}
              {closing.github && (
                <a
                  href={closing.github}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/60 transition-colors duration-300 hover:text-white"
                >
                  github ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
