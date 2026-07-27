"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

/**
 * The closing chapter: four cards dealt from a single deck. They slide/fan
 * out when the section enters the viewport; hovering a card straightens and
 * lifts it, revealing its easter egg. Exactly one card is alive at a time.
 */

const ON_REPEAT = [
  { track: "Heroin", url: "https://open.spotify.com/search/heroin%20lana%20del%20rey" },
  { track: "Cinnamon Girl", url: "https://open.spotify.com/search/cinnamon%20girl%20lana%20del%20rey" },
  { track: "Gods & Monsters", url: "https://open.spotify.com/search/gods%20and%20monsters%20lana%20del%20rey" },
];

/* dealt-state geometry: horizontal spread comes from the responsive
   --tx-N vars on the table; stacked state sits at center with a hair of
   rotation, like a real deck. */
const DEAL = [
  { rot: "-9deg", stackRot: "-2deg", delay: 0 },
  { rot: "-3deg", stackRot: "1.5deg", delay: 90 },
  { rot: "3.5deg", stackRot: "-1deg", delay: 180 },
  { rot: "9.5deg", stackRot: "2.5deg", delay: 270 },
];

function Card({
  i,
  dealt,
  children,
  label,
  onLive,
  live,
}: {
  i: number;
  dealt: boolean;
  children: React.ReactNode;
  label: string;
  onLive: (i: number | null) => void;
  live: boolean;
}) {
  const g = DEAL[i];
  return (
    <div
      onMouseEnter={() => onLive(i)}
      onMouseLeave={() => onLive(null)}
      onClick={() => onLive(live ? null : i)}
      className="group absolute left-1/2 top-1/2 w-[46vw] max-w-56 cursor-pointer sm:w-52 md:max-w-none md:w-60 lg:w-64"
      style={{
        zIndex: live ? 40 : 10 + i,
        transform: dealt
          ? `translate(calc(-50% + var(--tx)), -50%) rotate(${live ? "0deg" : g.rot}) translateY(${live ? "-2.5rem" : "0rem"}) scale(${live ? 1.08 : 1})`
          : `translate(-50%, -50%) rotate(${g.stackRot})`,
        // deal: heavy ease-out so cards decelerate into their slots
        transition: `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${dealt ? g.delay : 0}ms, z-index 0s`,
        ["--tx" as string]: `var(--tx-${i})`,
      }}
    >
      <div
        className={`relative aspect-[3/4.2] overflow-hidden rounded-2xl border bg-neutral-950 transition-all duration-500 ${
          live
            ? "border-white/25 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]"
            : "border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
        }`}
      >
        {children}
        {/* card face label - a playing-card corner index */}
        <span className="absolute left-3 top-3 z-20 font-mono text-[9px] tracking-[0.3em] text-white/60 uppercase [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
          {label}
        </span>
        <span className="absolute bottom-3 right-3 z-20 rotate-180 font-mono text-[9px] tracking-[0.3em] text-white/25 uppercase [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
          {label}
        </span>
      </div>
    </div>
  );
}

/** shared easter-egg overlay: slides up from the bottom edge when live */
function Egg({ live, children }: { live: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 bg-gradient-to-t from-black via-black/85 to-transparent p-4 pt-14 transition-all duration-500 ${
        live ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

function MbsCard({ live }: { live: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (live) v.play().catch(() => {});
    else v.pause();
  }, [live]);
  return (
    <>
      <video
        ref={ref}
        src="/about/mbs.mp4"
        poster="/about/mbs-poster.jpg"
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <Egg live={live}>
        <p className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
          SINGAPORE &middot; 01.2026
        </p>
        <p className="text-sm text-white/85">
          Ambitious, clean, engineered. My kind of city.
        </p>
      </Egg>
    </>
  );
}

export default function AboutDeck() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [dealt, setDealt] = useState(false);
  const [live, setLive] = useState<number | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDealt(true);
          obs.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="relative h-full snap-start overflow-hidden border-t border-white/10 px-6 md:px-16 lg:px-24"
    >
      <div className="mx-auto flex h-full max-w-6xl flex-col justify-center py-10">
        <ScrollReveal>
          <span className="font-mono text-sm text-white/30">{"// OFF THE CLOCK"}</span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h3 className="mt-4 max-w-xl text-2xl font-medium tracking-tight text-white md:text-4xl">
            The rest of the deck.
          </h3>
        </ScrollReveal>

        {/* the deck table */}
        <div
          ref={rootRef}
          className="relative mt-4 min-h-0 flex-1 max-h-[26rem] md:max-h-[30rem] [--tx-0:-105%] [--tx-1:-36%] [--tx-2:36%] [--tx-3:105%] md:[--tx-0:-168%] md:[--tx-1:-56%] md:[--tx-2:56%] md:[--tx-3:168%] lg:[--tx-0:-186%] lg:[--tx-1:-62%] lg:[--tx-2:62%] lg:[--tx-3:186%]"
        >
          {/* 01 - the gym */}
          <Card i={0} dealt={dealt} label="Gym" onLive={setLive} live={live === 0}>
            <Image
              src="/about/gym.jpg"
              alt="Sujin at the gym"
              fill
              sizes="16rem"
              className={`object-cover transition-all duration-700 ${
                live === 0 ? "grayscale-0 scale-105" : "grayscale"
              }`}
            />
            <Egg live={live === 0}>
              <p className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
                6AM &middot; EVERY DAY
              </p>
              <p className="text-sm text-white/85">
                Almost every day, for years. The discipline carries straight
                into the work.
              </p>
            </Egg>
          </Card>

          {/* 02 - the road */}
          <Card i={1} dealt={dealt} label="Travel" onLive={setLive} live={live === 1}>
            <Image
              src="/about/beach-gym.jpg"
              alt="Outdoor gym on a beach at sunset"
              fill
              sizes="16rem"
              className={`object-cover transition-transform duration-700 ${
                live === 1 ? "scale-110" : "scale-100"
              }`}
            />
            <Egg live={live === 1}>
              <p className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
                THAILAND
              </p>
              <p className="text-sm text-white/85">
                New country every few months. Sucker for beaches and pretty
                sunsets.
              </p>
            </Egg>
          </Card>

          {/* 03 - singapore, alive */}
          <Card i={2} dealt={dealt} label="Singapore" onLive={setLive} live={live === 2}>
            <MbsCard live={live === 2} />
          </Card>

          {/* 04 - the soundtrack */}
          <Card i={3} dealt={dealt} label="On repeat" onLive={setLive} live={live === 3}>
            <Image
              src="/about/lana.jpg"
              alt="Lana Del Rey"
              fill
              sizes="16rem"
              className={`object-cover object-bottom transition-all duration-700 ${
                live === 3 ? "opacity-50 scale-105" : "opacity-85"
              }`}
            />
            <Egg live={live === 3}>
              <p className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
                LANA DEL REY
              </p>
              <p className="text-sm text-white/85">
                Massive fan. Everything I&apos;ve shipped was written to one
                of these:
              </p>
              <ul className="flex flex-col gap-1.5">
                {ON_REPEAT.map((s) => (
                  <li key={s.track}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="group/track inline-flex items-baseline gap-2 font-mono text-xs text-white/70 transition-colors hover:text-accent"
                    >
                      <span className="text-white/30 transition-colors group-hover/track:text-accent">
                        &#9654;
                      </span>
                      {s.track}
                    </a>
                  </li>
                ))}
              </ul>
            </Egg>
          </Card>
        </div>

        {/* quiet close */}
        <div id="contact" className="mt-8 flex flex-col items-center gap-6 text-center">
          <ScrollReveal>
            <p className="max-w-md text-base leading-relaxed text-white/50">
              Train in the morning. Ship all day. Somewhere new every few months.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:lksujins@gmail.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-mono text-sm text-white/60 transition-all duration-200 hover:border-white/30 hover:text-foreground"
              >
                Email
              </a>
              <a
                href="https://github.com/sujink1999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-mono text-sm text-white/60 transition-all duration-200 hover:border-white/30 hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href="https://t.me/sujin0x"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-mono text-sm text-white/60 transition-all duration-200 hover:border-white/30 hover:text-foreground"
              >
                Telegram
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
