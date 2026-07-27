"use client";

import { useEffect, useRef, useState } from "react";

const LINE = "Wrong door. This one isn't yours.";

/**
 * The 404 room: a thin-stroke SVG door that draws itself, drifts ajar on
 * hover, and swings open onto nothing when clicked. Same black-room language
 * as the pitch pages - grain, one warm sliver of light, restraint.
 */
export default function WrongDoor() {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) {
      setOpen(true);
      setTyped(LINE);
      setDone(true);
    }
  }, []);

  /* letter-by-letter once the door has swung open */
  useEffect(() => {
    if (!open || done) return;
    const start = window.setTimeout(() => {
      let i = 0;
      const t = window.setInterval(() => {
        i += 1;
        setTyped(LINE.slice(0, i));
        if (i >= LINE.length) {
          window.clearInterval(t);
          setDone(true);
        }
      }, 45);
    }, 700);
    return () => window.clearTimeout(start);
  }, [open, done]);

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-black px-6 text-white">
      {/* film grain over the whole room */}
      <div className="story-grain pointer-events-none fixed inset-0 z-20" />

      {/* the door, standing alone in the dark */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open the door"
        disabled={open}
        className="wrong-door-stage group relative block w-[180px] cursor-pointer outline-none sm:w-[210px]"
      >
        {/* warm sliver at the handle-side gap - only while the door is ajar */}
        <div
          aria-hidden
          className={`absolute bottom-[2%] right-[7%] top-[3%] w-[10%] transition-opacity duration-700 ${
            open ? "opacity-0" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          }`}
          style={{
            background:
              "linear-gradient(270deg, rgba(255,214,150,0.28), rgba(255,214,150,0.06) 55%, transparent)",
            filter: "blur(1px)",
          }}
        />

        {/* 404 waiting in the dark behind the leaf */}
        <div
          aria-hidden
          className={`absolute left-[7%] top-[3.1%] flex h-[95%] w-[86%] items-center justify-center transition-opacity delay-500 duration-1000 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="pl-[0.2em] font-mono text-2xl tracking-[0.2em] text-white/30 sm:text-3xl">
            404
          </span>
        </div>

        {/* static jamb */}
        <svg viewBox="0 0 200 320" fill="none" aria-hidden className="block w-full">
          <path
            d="M14 314 V10 H186 V314"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.5"
            pathLength={1}
            className="wrong-door-draw"
          />
          <path
            d="M2 314 H198"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
            pathLength={1}
            className="wrong-door-draw"
            style={{ animationDelay: "0.9s" }}
          />
        </svg>

        {/* the leaf - hinged on the left, rotates in 3D */}
        <div
          aria-hidden
          className={`wrong-door-leaf absolute left-[7%] top-[3.1%] h-[95%] w-[86%] origin-left ${
            open ? "wrong-door-open" : "group-hover:[transform:rotateY(-14deg)] group-focus-visible:[transform:rotateY(-14deg)]"
          }`}
        >
          <svg viewBox="0 0 172 304" fill="none" className="block h-full w-full">
            <rect
              x="1"
              y="1"
              width="170"
              height="302"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.5"
              pathLength={1}
              className="wrong-door-draw"
              style={{ animationDelay: "0.35s" }}
            />
            {/* two quiet panels */}
            <rect
              x="28"
              y="30"
              width="116"
              height="105"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1"
              pathLength={1}
              className="wrong-door-draw"
              style={{ animationDelay: "0.7s" }}
            />
            <rect
              x="28"
              y="165"
              width="116"
              height="105"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1"
              pathLength={1}
              className="wrong-door-draw"
              style={{ animationDelay: "0.85s" }}
            />
            {/* handle */}
            <circle
              cx="152"
              cy="152"
              r="4.5"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1.5"
              pathLength={1}
              className="wrong-door-draw"
              style={{ animationDelay: "1.1s" }}
            />
          </svg>
        </div>
      </button>

      {/* the payoff - only after the door gives up its nothing */}
      <div className="z-10 mt-20 flex min-h-[7rem] flex-col items-center gap-6 text-center sm:mt-24">
        <p className="min-h-[1.5rem] text-base font-light tracking-wide text-white/80 sm:text-lg">
          {typed}
          {open && !done && (
            <span className="ml-px inline-block w-[1px] animate-pulse bg-white/70 align-middle" style={{ height: "1em" }} />
          )}
        </p>
        <div
          className={`flex flex-col items-center gap-5 transition-opacity duration-1000 ${
            done ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase">
            <a
              href="https://github.com/sujink1999"
              className="text-white/40 transition-colors hover:text-white"
            >
              github
            </a>
            <span className="mx-3 text-white/20">·</span>
            <a
              href="mailto:lksujins@gmail.com"
              className="text-white/40 transition-colors hover:text-white"
            >
              email
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
