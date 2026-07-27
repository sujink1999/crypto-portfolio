"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import PhoneFrame from "./PhoneFrame";

const SCREENS = [
  { src: "/showcase/society/signin.png", label: "Sign in" },
  { src: "/showcase/society/dormant.png", label: "The Dormant" },
  { src: "/showcase/society/routine.png", label: "Routine" },
  { src: "/showcase/society/home.png", label: "Home" },
  { src: "/showcase/society/score.png", label: "Score" },
  { src: "/showcase/society/store.png", label: "Store" },
  { src: "/showcase/society/map.png", label: "Map" },
  { src: "/showcase/society/globe.png", label: "Global members" },
  { src: "/showcase/society/chats.png", label: "Chats" },
  { src: "/showcase/society/profile.png", label: "Profile" },
];

const INTERVAL_MS = 3000;

export default function SocietyPrototype() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;
    if (mq.matches) setPaused(true);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SCREENS.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [paused]);

  const jumpTo = useCallback((i: number) => {
    setIndex(i);
    setPaused(true);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      <button
        type="button"
        aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
        onClick={() => setPaused((p) => !p)}
        className="cursor-pointer appearance-none border-0 bg-transparent p-0 text-left"
      >
        <PhoneFrame
          width={402}
          height={874}
          overlay={
            paused && !reducedMotion.current ? (
              <div className="pointer-events-none absolute right-4 top-4 z-40 rounded-full bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-neutral-300 backdrop-blur">
                Paused
              </div>
            ) : undefined
          }
        >
          {SCREENS.map((screen, i) => (
            <Image
              key={screen.src}
              src={screen.src}
              alt={`${screen.label} screen`}
              fill
              unoptimized
              priority={i === 0}
              className="object-contain transition-opacity duration-700 ease-out"
              style={{ opacity: i === index ? 1 : 0 }}
            />
          ))}
        </PhoneFrame>
      </button>

      <div className="flex max-w-full flex-wrap justify-center gap-3 px-2">
        {SCREENS.map((screen, i) => (
          <button
            key={screen.src}
            type="button"
            onClick={() => jumpTo(i)}
            className={`group flex flex-col items-center gap-1.5 transition-opacity ${
              i === index ? "opacity-100" : "opacity-50 hover:opacity-80"
            }`}
          >
            <span
              className={`relative block h-[104px] w-12 overflow-hidden rounded-lg ring-1 transition-shadow ${
                i === index ? "ring-neutral-400" : "ring-neutral-800"
              }`}
            >
              <Image
                src={screen.src}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 group-hover:text-neutral-400">
              {screen.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
