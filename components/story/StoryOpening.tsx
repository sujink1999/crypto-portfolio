"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CompanyPitch } from "@/companies/types";
import { EVIDENCE } from "@/companies/evidence";
import MemoryConstellation from "./MemoryConstellation";
import MetalCard from "./MetalCard";
import RoleMatch from "./RoleMatch";
import SmokeCanvas from "./SmokeCanvas";
import TypedText from "./TypedText";

/**
 * Apple-style opening: a real scrollable document. Each beat is a full-viewport
 * snap section; lines rise and de-blur into place when their section is active
 * and stay readable while it holds. Position on the page IS the state -
 * mis-scrolls just nudge, scrolling back reverses. No input hijacking.
 */

const CHAPTERS = ["Hello", "Why you", "The role", "The proof", "Next"];
const MIN_PRELOAD_MS = 1200;

export default function StoryOpening({ pitch }: { pitch: CompanyPitch }) {
  const pivotIndex = 2;
  const closeIndex = 4;
  const totalSections = CHAPTERS.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [bloom, setBloom] = useState(false);
  const [active, setActive] = useState(0);
  const [greetStarted, setGreetStarted] = useState(false);
  const [greetDone, setGreetDone] = useState(false);
  const [opened, setOpened] = useState(false);
  const [hint, setHint] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const hintDismissed = useRef(false);

  /* ---------- preloader: line = progress, brief bloom, then the document.
       Always plays; any click or key skips straight to the greeting. ---------- */
  useEffect(() => {
    let alive = true;
    const skip = () => {
      if (!alive) return;
      alive = false;
      cleanupSkip();
      setProgress(1);
      setLoading(false);
      setGreetStarted(true);
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    const cleanupSkip = () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
    const creep = setInterval(() => {
      setProgress((p) => Math.min(p + (0.85 - p) * 0.18, 0.85));
    }, 60);
    const minWait = new Promise((r) => setTimeout(r, MIN_PRELOAD_MS));
    Promise.all([document.fonts.ready, minWait]).then(() => {
      if (!alive) return;
      clearInterval(creep);
      setProgress(1);
      setTimeout(() => alive && setOpened(true), 300);
      setTimeout(() => alive && setBloom(true), 700);
      setTimeout(() => {
        if (!alive) return;
        cleanupSkip();
        setLoading(false);
        setGreetStarted(true);
      }, 1300);
    });
    return () => {
      alive = false;
      cleanupSkip();
      clearInterval(creep);
    };
  }, []);

  /* ---------- active section tracked from real scroll position ---------- */
  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const i = Math.min(
      totalSections - 1,
      Math.max(0, Math.round(el.scrollTop / el.clientHeight))
    );
    setActive((prev) => (prev === i ? prev : i));
    if (el.scrollTop > 40 && !hintDismissed.current) {
      hintDismissed.current = true;
      setHint(false);
    }
  }, [totalSections]);

  /* keyboard: page through sections */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const dir = [" ", "Enter", "ArrowDown", "PageDown"].includes(e.key)
        ? 1
        : ["ArrowUp", "PageUp"].includes(e.key)
          ? -1
          : 0;
      if (!dir) return;
      e.preventDefault();
      const next = Math.min(
        totalSections - 1,
        Math.max(0, Math.round(el.scrollTop / el.clientHeight) + dir)
      );
      el.scrollTo({ top: next * el.clientHeight, behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalSections]);

  /* idle hint on the first section */
  useEffect(() => {
    if (loading || hintDismissed.current) return;
    const t = setTimeout(() => setHint(true), 5000);
    return () => clearTimeout(t);
  }, [loading]);

  const section = (i: number) => `in-${active === i ? "yes" : "no"}`;


  return (
    <div
      className="fixed inset-0 bg-black text-white select-none"
      style={{ "--accent": pitch.accent ?? "#4ade80" } as React.CSSProperties}
    >
      {/* the one living light source - fbm smoke, faint, accent-tinted */}
      <div className="absolute inset-0 pointer-events-none">
        <SmokeCanvas accent="#9aa0a6" density={0.2} />
      </div>
      {/* edge falloff - keeps the eye in the lit center of the room */}
      <div className="story-vignette absolute inset-0 pointer-events-none" />

      {/* the scroll document */}
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="story-doc absolute inset-0 overflow-y-auto snap-y snap-mandatory"
      >
        {/* 01 - greeting */}
        <section className="relative flex h-full snap-start flex-col items-center justify-center gap-6 px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-medium tracking-[-0.02em]">
            {greetStarted && (
              <TypedText
                text={`Hey ${pitch.greetName ?? pitch.company},`}
                charDelay={55}
                startDelay={300}
                gradientFrom={1}
                gradientStart={pitch.accentFrom}
                onDone={() => setGreetDone(true)}
              />
            )}
          </h1>
          <p
            className={`story-line text-xl md:text-2xl font-normal text-white/70 ${
              greetDone && active === 0 ? "in-yes" : "in-no"
            }`}
            style={{ "--d": "0.2s" } as React.CSSProperties}
          >
            I&apos;m Sujin.
          </p>
        </section>

        {/* 02 - why you: one screen, quiet stacked lines */}
        <section className="flex h-full snap-start flex-col items-center justify-center gap-5 px-6 text-center">
          {/* spark - drawn stroke by stroke */}
          <svg
            width="34"
            height="34"
            viewBox="0 0 48 48"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
            className={`story-sketch mb-4 ${section(1)}`}
          >
            <path d="M24 10 V38" pathLength={1} />
            <path d="M10 24 H38" pathLength={1} />
            <path d="M14.5 14.5 L33.5 33.5" pathLength={1} />
            <path d="M33.5 14.5 L14.5 33.5" pathLength={1} />
          </svg>
          {pitch.story.map((line, i) => (
            <p
              key={i}
              className={`story-line max-w-5xl text-pretty text-lg md:text-2xl font-normal leading-normal tracking-tight text-white/55 ${section(1)}`}
              style={{ "--d": `${0.15 + i * 0.3}s` } as React.CSSProperties}
            >
              {/* **text** and "quoted text" render white against the muted line */}
              {line.split(/(\*\*[^*]+\*\*|"[^"]+")/).map((part, j) =>
                part.startsWith("**") ? (
                  <span key={j} className="font-medium text-white">
                    {part.slice(2, -2)}
                  </span>
                ) : part.startsWith('"') ? (
                  <span key={j} className="font-medium text-white">
                    {part.replace(/\*\*/g, "")}
                  </span>
                ) : (
                  part
                )
              )}
            </p>
          ))}
          {pitch.storyWidget === "memory" && (
            <button
              onClick={() => setWidgetOpen(true)}
              className={`mem-chip story-line group mt-6 ${section(1)}`}
              style={{ "--d": "0.9s" } as React.CSSProperties}
              aria-label="Open the memory system"
            >
              {/* memory core: nucleus + orbiting fact-dots, alive at rest */}
              <span className="mem-chip-orb">
                <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible">
                  <circle cx="24" cy="24" r="5" className="mem-orb-core" />
                  <circle cx="24" cy="24" r="5" className="mem-orb-halo" />
                  <g className="mem-orbit mem-orbit-a">
                    <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.75" strokeDasharray="2 4" />
                    <circle cx="36" cy="24" r="1.6" fill="currentColor" />
                  </g>
                  <g className="mem-orbit mem-orbit-b">
                    <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.75" strokeDasharray="1 5" />
                    <circle cx="6" cy="24" r="1.3" fill="currentColor" />
                    <circle cx="42" cy="24" r="1" fill="currentColor" fillOpacity="0.7" />
                  </g>
                </svg>
              </span>
              <span className="text-left">
                <span className="block font-mono text-[10px] tracking-[0.28em] text-white/40 transition-colors group-hover:text-white/70">
                  THE SYSTEM I BUILT
                </span>
                <span className="mt-1 block font-mono text-[10px] tracking-[0.28em] text-accent">
                  OPEN
                  <span className="mem-chip-arrow ml-2 inline-block">-&gt;</span>
                </span>
              </span>
            </button>
          )}
        </section>

        {/* 03 - the pivot gets its own beat: the loud turn into the case */}
        <section className="flex h-full snap-start flex-col items-center justify-center px-6 text-center">
          <p
            className={`story-line max-w-4xl text-balance text-3xl md:text-5xl font-normal leading-tight tracking-tight text-white/80 ${section(pivotIndex)}`}
            style={{ "--d": "0.15s" } as React.CSSProperties}
          >
            So you&apos;re looking for a{" "}
            <span className="font-medium text-accent">{pitch.role}</span>.
          </p>
          <p
            className={`story-line mt-6 text-lg md:text-xl font-normal text-white/45 ${section(pivotIndex)}`}
            style={{ "--d": "0.6s" } as React.CSSProperties}
          >
            Let me save you the translation.
          </p>
        </section>

        {/* 04 - the proof: JD pills → one exhibit at a time */}
        <section className="h-full snap-start">
          <RoleMatch
            requirements={pitch.requirements}
            onOverscroll={(dir) => {
              const el = containerRef.current;
              if (!el) return;
              const next = Math.min(
                totalSections - 1,
                Math.max(0, Math.round(el.scrollTop / el.clientHeight) + dir)
              );
              el.scrollTo({ top: next * el.clientHeight, behavior: "smooth" });
            }}
            evidenceMap={
              pitch.evidenceOverrides
                ? Object.fromEntries(
                    Object.entries(EVIDENCE).map(([id, ev]) => [
                      id,
                      { ...ev, ...pitch.evidenceOverrides?.[id] },
                    ])
                  )
                : EVIDENCE
            }
          />
        </section>

        {/* 05 - next */}
        <section className="flex h-full snap-start flex-col items-center justify-center gap-8 px-6 text-center">
          {/* paper plane - drawn, ready to send */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 48 48"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
            className={`story-sketch ${section(closeIndex)}`}
          >
            <path d="M6 26 L42 8 L30 42 L22 30 Z" pathLength={1} />
            <path d="M42 8 L22 30" pathLength={1} />
          </svg>
          <p
            className={`story-line text-xl md:text-2xl font-normal text-white/80 ${section(closeIndex)}`}
          >
            {pitch.closing.line}
          </p>
          {/* contacts - the card, floating in the light */}
          <div
            className={`story-line ${section(closeIndex)}`}
            style={{ "--d": "0.4s" } as React.CSSProperties}
          >
            <MetalCard closing={pitch.closing} />
          </div>

          <p
            className={`story-line font-mono text-[10px] tracking-[0.2em] text-white/30 ${section(closeIndex)}`}
            style={{ "--d": "0.7s" } as React.CSSProperties}
          >
            p.s. the application is already in - look for Sujin K
          </p>
        </section>
      </div>

      {/* quiet UI layer */}
      {!loading && (
        <>
          {/* progress rail - top-right row on mobile, right-center column on lg+ */}
          <div className="absolute right-5 top-6 z-30 flex flex-row items-center gap-3 lg:right-8 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col">
            {CHAPTERS.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to ${CHAPTERS[i]}`}
                onClick={() =>
                  containerRef.current?.scrollTo({
                    top: i * (containerRef.current?.clientHeight ?? 0),
                    behavior: "smooth",
                  })
                }
                className={`h-6 w-px transition-all duration-500 ${
                  active === i ? "bg-accent scale-x-[2]" : "bg-white/15 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          {/* scroll hint - first chapter only, never on the close */}
          <div
            className={`absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-1000 ${
              hint && active === 0 ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30">
              scroll
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
              strokeLinecap="round"
              className="scroll-arrow"
              aria-hidden
            >
              <path d="M2 4 L6 8.5 L10 4" />
            </svg>
          </div>
        </>
      )}

      {/* preloader - the invitation */}
      <div
        className={`absolute inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-black transition-opacity duration-700 ${
          loading ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="relative" style={{ perspective: "600px" }}>
          <svg
            width="180"
            height="126"
            viewBox="0 0 200 140"
            fill="none"
            className="overflow-visible"
          >
            {/* envelope body - draws itself as loading progress */}
            <rect
              x="30"
              y="42"
              width="140"
              height="68"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - progress}
              className="transition-[stroke-dashoffset] duration-500 ease-out"
            />
            {/* inner fold lines - bottom corners up to the center crease */}
            <path
              d="M30 110 L100 66 L170 110"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - progress}
              className="transition-[stroke-dashoffset] duration-500 ease-out"
            />
            {/* flap - hinges exactly on the body's top edge, folds open when ready */}
            <path
              d="M30 42 L100 88 L170 42"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1"
              fill="rgba(255,255,255,0.03)"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - progress}
              className={`story-flap transition-[stroke-dashoffset] duration-500 ease-out ${
                opened ? "story-flap-open" : ""
              }`}
            />
            {/* bloom - light escaping the opened envelope, in envelope coordinates */}
            <defs>
              <filter id="story-bloom-blur" x="-300%" y="-300%" width="700%" height="700%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
            </defs>
            {bloom && (
              <circle
                cx="100"
                cy="76"
                r="11"
                fill="white"
                filter="url(#story-bloom-blur)"
                className="story-bloom-svg"
              />
            )}
          </svg>
        </div>
        <p className="font-mono text-[10px] md:text-[11px] tracking-[0.45em] text-white/50 uppercase">
          <TypedText
            text={`An invitation for ${pitch.greetName ?? pitch.company}`}
            charDelay={28}
            startDelay={300}
          />
        </p>
      </div>

      {/* film grain over everything */}
      <div className="story-grain absolute inset-0 z-50 pointer-events-none" />

      {widgetOpen && pitch.storyWidget === "memory" && (
        <MemoryConstellation
          accent={pitch.accent ?? "#4ade80"}
          onClose={() => setWidgetOpen(false)}
        />
      )}
    </div>
  );
}
