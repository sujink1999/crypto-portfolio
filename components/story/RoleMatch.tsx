"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Evidence, Requirement } from "@/companies/types";
import ExhibitStage from "@/components/story/ExhibitStage";
import { toExhibit } from "@/components/story/exhibits";
import CaseHost, { hasCase } from "@/components/story/CaseHost";

/**
 * The proof chapter. Left: the JD distilled to short labels - the active
 * one reveals the verbatim JD line underneath. Right: one requirement per
 * full-height snap step - a loud claim over the exhibit stage (device
 * frames perfected in /lab, registered in components/story/exhibits.tsx;
 * hero exhibit alive, hover a resting one to switch, max 3).
 */
export default function RoleMatch({
  requirements,
  evidenceMap,
  heading = "your job description",
  onOverscroll,
  showAllStack = false,
}: {
  requirements: Requirement[];
  evidenceMap: Record<string, Evidence>;
  /** rail header - the generic home page has no single JD to quote */
  heading?: string;
  /** wheel past the first/last requirement - hand control back to the page */
  onOverscroll?: (dir: 1 | -1) => void;
  /** show every exhibit's full stack under its device */
  showAllStack?: boolean;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeReq, setActiveReq] = useState(0);
  const [jumping, setJumping] = useState(false);
  const [openCase, setOpenCase] = useState<string | null>(null);

  /* first view: the JD labels stagger in first, THEN the right side loads.
     No movement - just ordered reveals. Plays once. */
  const [staggerIn, setStaggerIn] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const played = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let t: number;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played.current) return;
        played.current = true;
        obs.disconnect();
        setStaggerIn(true);
        t = window.setTimeout(
          () => setIntroDone(true),
          500 + requirements.length * 140
        );
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      window.clearTimeout(t);
    };
  }, [requirements.length]);

  const onRailScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const i = Math.min(
      requirements.length - 1,
      Math.max(0, Math.round(rail.scrollTop / rail.clientHeight))
    );
    setActiveReq((prev) => (prev === i ? prev : i));
  }, [requirements.length]);

  /* fade out, land directly on the target section, fade back in -
     no scrubbing through everything in between */
  const jumpTo = (i: number) => {
    const rail = railRef.current;
    if (!rail || i === activeReq) return;
    setJumping(true);
    window.setTimeout(() => {
      rail.scrollTop = i * rail.clientHeight;
      setActiveReq(i);
      setJumping(false);
    }, 220);
  };

  /* the rail is its own snap scroller - at its boundaries the wheel should
     move the page again, which nested mandatory snap containers block */
  const lastHandOff = useRef(0);
  const onWheel = (e: React.WheelEvent) => {
    if (!onOverscroll) return;
    const rail = railRef.current;
    if (!rail) return;
    const now = performance.now();
    if (now - lastHandOff.current < 900) return;
    const atEnd = rail.scrollTop >= rail.scrollHeight - rail.clientHeight - 4;
    const atStart = rail.scrollTop <= 4;
    if (e.deltaY > 20 && atEnd) {
      lastHandOff.current = now;
      onOverscroll(1);
    } else if (e.deltaY < -20 && atStart) {
      lastHandOff.current = now;
      onOverscroll(-1);
    }
  };

  if (!requirements.length) return null;

  return (
    <div
      ref={rootRef}
      onWheel={onWheel}
      className="relative mx-auto flex h-full w-full max-w-[96rem] flex-col gap-0 px-5 py-10 md:px-12 lg:grid lg:grid-cols-[minmax(240px,20rem)_1fr] lg:gap-20 lg:py-14"
    >
      {/* left - the JD, distilled; exact wording under the active label */}
      <div className="flex border-b border-white/10 pb-5 lg:items-center lg:border-b-0 lg:border-r lg:border-white/10 lg:pb-0 lg:pr-12">
        <div className="w-auto lg:w-full">
          {heading && (
            <p
              className={`font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 transition-all duration-500 ${
                staggerIn ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              {heading}
            </p>
          )}
          <ul className="mt-3 flex flex-col gap-0 lg:mt-8">
            {requirements.map((r, i) => {
              const active = activeReq === i;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    className="group flex w-full items-baseline gap-3 py-1 text-left lg:py-2.5"
                  >
                    <span
                      className={`hidden font-mono text-[10px] transition-all duration-500 lg:block ${
                        staggerIn ? "opacity-100" : "opacity-0"
                      } ${active && introDone ? "text-accent" : "text-white/25"}`}
                      style={{
                        transitionDelay: introDone ? "0ms" : `${250 + i * 140}ms`,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="block">
                      {/* staggers in during the centered intro, stays after */}
                      <span
                        className={`block text-[13px] font-normal leading-snug transition-all duration-500 lg:text-[15px] ${
                          staggerIn
                            ? "translate-y-0 opacity-100"
                            : "translate-y-3 opacity-0"
                        } ${
                          active && introDone
                            ? "text-white"
                            : "text-white/35 group-hover:text-white/60"
                        }`}
                        style={{
                          transitionDelay: introDone ? "0ms" : `${250 + i * 140}ms`,
                        }}
                      >
                        {r.label}
                      </span>
                      {/* verbatim JD line - expands without reflowing siblings */}
                      <span
                        className={`hidden lg:grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                          active && introDone
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <span className="overflow-hidden">
                          <span className="block pt-1.5 text-[12px] font-normal leading-relaxed text-white/40">
                            &ldquo;{r.need}&rdquo;
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* right - one requirement per view: claim over a composed stage.
          loads after the JD has settled in */}
      <div
        className={`relative min-h-0 flex-1 transition-opacity duration-700 ease-out lg:h-full lg:flex-none ${
          introDone ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          ref={railRef}
          onScroll={onRailScroll}
          className={`pitch-carousel h-full snap-y snap-mandatory overflow-y-auto transition-opacity duration-200 ${
            jumping ? "opacity-0" : "opacity-100"
          } ${
            /* with a hand-off handler, the handler is the ONLY exit - native
               scroll chaining on top of it makes the jump fire twice */
            onOverscroll ? "overscroll-contain" : ""
          }`}
        >
          {requirements.map((r, gi) => {
            /* sections only "arrive" once the JD intro has finished, so the
               claim/stage entrance is actually seen, not burned under the fade */
            const active = activeReq === gi && introDone;
            const proofs = r.proofs.slice(0, 3);
            return (
              <div
                key={gi}
                className="relative flex h-full snap-start flex-col justify-center pt-8 lg:pt-0"
              >
                {/* ghost index - grounds the section */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-8 left-0 font-mono text-[4.5rem] leading-none text-white/[0.04] lg:-top-2 lg:text-[11rem]"
                >
                  {String(gi + 1).padStart(2, "0")}
                </span>

                {/* the one loud line */}
                <h3
                  className={`relative max-w-3xl text-lg font-normal leading-tight tracking-tight text-white/90 transition-all duration-700 md:text-3xl lg:text-4xl ${
                    active
                      ? "translate-y-0 opacity-100 blur-0"
                      : "translate-y-4 opacity-0 blur-[6px]"
                  }`}
                >
                  {r.claim}
                </h3>

                {/* the stage - exhibits from /lab: hero alive, hover to switch */}
                <div
                  className={`mt-8 transition-all duration-700 ease-out md:mt-12 ${
                    active
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: active ? "150ms" : "0ms" }}
                >
                  <ExhibitStage
                    active={active}
                    checkedTech={r.stackMatch}
                    showAllStack={showAllStack}
                    onOpen={(id) => hasCase(id) && setOpenCase(id)}
                    exhibits={proofs
                      .map((id) => evidenceMap[id])
                      .filter((e): e is Evidence => Boolean(e))
                      .map(toExhibit)}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* scroll affordance - counter + a dropping chevron */}
        <div className="pointer-events-none absolute bottom-1 right-0 flex items-center gap-2.5">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/25">
            {String(activeReq + 1).padStart(2, "0")} / {String(requirements.length).padStart(2, "0")}
          </p>
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1"
            strokeLinecap="round"
            className={`scroll-arrow transition-opacity duration-500 ${
              activeReq === requirements.length - 1 ? "opacity-0" : "opacity-100"
            }`}
            aria-hidden
          >
            <path d="M2 4 L6 8.5 L10 4" />
          </svg>
        </div>
      </div>

      {/* click an exhibit → its full-screen case */}
      {openCase && (
        <CaseHost
          id={openCase}
          checked={requirements[activeReq]?.stackMatch}
          onClose={() => setOpenCase(null)}
        />
      )}
    </div>
  );
}
