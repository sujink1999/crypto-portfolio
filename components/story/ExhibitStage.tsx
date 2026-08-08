"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import DeviceFrame, { ScaledScreen } from "./DeviceFrame";
import StackTags from "./StackMatch";
import type { Slide } from "./demos/SlideshowPhone";

const normSlide = (s: Slide) => (typeof s === "string" ? { src: s, padTop: 0 } : s);

/**
 * The proof-stage trio: one hero exhibit playing, up to two side exhibits at
 * rest. Hovering any exhibit makes it the live one - the previous one pauses
 * (video stops, slideshow freezes). Exactly one thing moves at a time.
 */

export type Exhibit = {
  id: string;
  title: string;
  /** techs the project was built with - highlighted when the JD asks for them */
  stack?: string[];
  device: "laptop" | "phone" | "extension";
  media:
    | { kind: "video"; src: string; aspect?: string }
    | { kind: "slides"; srcs: Slide[] }
    | { kind: "image"; src: string }
    | { kind: "live"; node: ReactNode; logical?: { w: number; h: number } }
    /** frameless live component - the widget IS the exhibit, no device chrome */
    | { kind: "bare"; node: ReactNode; logical: { w: number; h: number } }
    | { kind: "empty"; monogram: string };
};

function VideoScreen({ src, playing }: { src: string; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      className="h-full w-full object-cover object-top"
    />
  );
}

function SlidesScreen({ srcs, playing }: { srcs: Slide[]; playing: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setI((p) => (p + 1) % srcs.length), 2000);
    return () => clearInterval(t);
  }, [playing, srcs.length]);
  return (
    <div className="relative h-full w-full bg-black">
      {srcs.map(normSlide).map((s, si) => (
        <div
          key={s.src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            si === i ? "opacity-100" : "opacity-0"
          }`}
          style={s.padTop ? { top: `${s.padTop}%` } : undefined}
        >
          <Image
            src={s.src}
            alt=""
            fill
            sizes="20rem"
            className="object-cover object-top"
          />
        </div>
      ))}
    </div>
  );
}

function ExhibitMedia({ ex, playing }: { ex: Exhibit; playing: boolean }) {
  const m = ex.media;
  if (m.kind === "bare") {
    return (
      <div
        className="w-full"
        style={{ aspectRatio: `${m.logical.w} / ${m.logical.h}` }}
      >
        <ScaledScreen device={ex.device} logical={m.logical}>
          <div className="pointer-events-none h-full w-full select-none" aria-hidden>
            {m.node}
          </div>
        </ScaledScreen>
      </div>
    );
  }
  if (m.kind === "live") {
    return (
      <DeviceFrame device={ex.device} logical={m.logical}>
        {/* stage exhibits are display-only: the embedded app must never eat
            the click that opens the case */}
        <div className="pointer-events-none h-full w-full select-none" aria-hidden>
          {m.node}
        </div>
      </DeviceFrame>
    );
  }
  return (
    <DeviceFrame
      device={ex.device}
      fill
      screenAspect={m.kind === "video" ? (m.aspect ?? "1280 / 812") : "1280 / 812"}
    >
      {m.kind === "video" && <VideoScreen src={m.src} playing={playing} />}
      {m.kind === "slides" && <SlidesScreen srcs={m.srcs} playing={playing} />}
      {m.kind === "image" && (
        <div className="relative h-full w-full">
          <Image
            src={m.src}
            alt=""
            fill
            sizes="30rem"
            className="object-cover object-top"
          />
        </div>
      )}
      {m.kind === "empty" && (
        <div className="flex h-full w-full items-center justify-center bg-black">
          <span className="font-mono text-6xl text-white/[0.08]">
            {m.monogram}
          </span>
        </div>
      )}
    </DeviceFrame>
  );
}

/* same skeleton as the RoleMatch stage: hero + two supporting slots.
   Slot 2 owns the top-right, slot 3 the bottom-right band - tuned so tall
   phone footprints never collide with laptop lids in mixed trios. */
/* a deliberate zig-zag: hero low-left, slot 2 high mid-right, slot 3 low
   far-right - three distinct bands, three distinct sizes */
const SLOTS = [
  "absolute bottom-0 left-0 w-[50%]",
  "absolute top-[4%] right-[14%] w-[28%]",
  "absolute bottom-[10%] right-0 w-[20%]",
];
/* phones are portrait - narrower footprint in the same anchor */
const PHONE_SLOTS = [
  "absolute bottom-0 left-[12%] w-[22%]",
  "absolute top-0 right-[18%] w-[14%]",
  "absolute bottom-[4%] right-0 w-[12%]",
];
/* extension popups sit between the two */
const EXT_SLOTS = [
  "absolute bottom-0 left-[9%] w-[28%]",
  "absolute top-0 right-[17%] w-[17%]",
  "absolute bottom-[4%] right-0 w-[15%]",
];

const slotFor = (device: Exhibit["device"], i: number) =>
  device === "phone" ? PHONE_SLOTS[i] : device === "extension" ? EXT_SLOTS[i] : SLOTS[i];

function CaptionRow({
  ex,
  isLive,
  checkedTech,
  showAllStack = false,
  centered = false,
}: {
  ex: Exhibit;
  isLive: boolean;
  checkedTech?: string[];
  /** show the exhibit's full stack, not just the JD-matched techs */
  showAllStack?: boolean;
  /** mobile strip phones: center the caption under the device */
  centered?: boolean;
}) {
  return (
    <div
      className={`mt-2.5 ${
        ex.device !== "laptop"
          ? `flex flex-col gap-1 ${centered ? "items-center text-center" : ""}`
          : "flex items-center justify-between gap-x-4"
      }`}
    >
      <p
        className={`min-w-0 font-mono text-[9px] leading-snug tracking-[0.25em] uppercase transition-colors duration-300 md:text-[10px] ${
          isLive ? "text-white/70" : "text-white/35"
        }`}
      >
        {ex.title}
      </p>
      {/* stack sections only: every exhibit shows JUST its matching techs.
          showAllStack (home page): the full stack, quiet - no JD to check off */}
      {showAllStack && ex.stack ? (
        <StackTags stack={ex.stack} accentAll />
      ) : (
        checkedTech &&
        checkedTech.length > 0 &&
        ex.stack && (
          <StackTags
            stack={ex.stack.filter((t) =>
              checkedTech.some((c) => t.toLowerCase().includes(c.toLowerCase()))
            )}
            checked={checkedTech}
          />
        )
      )}
    </div>
  );
}

export default function ExhibitStage({
  exhibits,
  active = true,
  checkedTech,
  showAllStack = false,
  onOpen,
}: {
  exhibits: Exhibit[];
  /** false = section offscreen: nothing plays, no hero */
  active?: boolean;
  /** techs the active JD requirement asks for - lights up matching stack tags */
  checkedTech?: string[];
  /** always show each exhibit's full stack under the device */
  showAllStack?: boolean;
  /** click an exhibit → open its case (only wired for ids that have one) */
  onOpen?: (id: string) => void;
}) {
  const [live, setLive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* mobile strip: the exhibit nearest the viewport center is the live one */
  const onStripScroll = () => {
    const strip = stripRef.current;
    if (!strip) return;
    const center = strip.scrollLeft + strip.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setLive((prev) => (prev === best ? prev : best));
  };

  const shown = exhibits.slice(0, 3);

  return (
    <>
      {/* mobile - horizontal snap strip: centered exhibit is alive, tap opens */}
      <div
        ref={stripRef}
        onScroll={onStripScroll}
        className="pitch-carousel -mx-5 flex snap-x snap-mandatory items-center gap-10 overflow-x-auto px-5 pb-2 lg:hidden"
      >
        {shown.map((ex, i) => {
          const isLive = active && live === i;
          return (
            <div
              key={ex.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onClick={onOpen ? () => onOpen(ex.id) : undefined}
              className="w-[78%] shrink-0 snap-center"
            >
              {/* uniform slot width; smaller devices center inside it */}
              {ex.device === "laptop" ? (
                <ExhibitMedia ex={ex} playing={isLive} />
              ) : (
                <div
                  className={`mx-auto ${
                    ex.device === "phone" ? "w-[38%]" : "w-[52%]"
                  }`}
                >
                  <ExhibitMedia ex={ex} playing={isLive} />
                </div>
              )}
              <CaptionRow
                ex={ex}
                isLive={isLive}
                checkedTech={checkedTech}
                showAllStack={showAllStack}
                centered
              />
            </div>
          );
        })}
      </div>

      {/* lg+ - the composed collage (hero/secondary sizes are desktop-only) */}
      <div className="relative hidden aspect-[16/8] w-full max-w-4xl lg:block">
      {shown.map((ex, i) => {
        const isLive = active && live === i;
        return (
          <div
            key={ex.id}
            onMouseEnter={() => setLive(i)}
            className={`${
              shown.length === 1
                ? ex.device === "phone"
                  ? "absolute left-1/2 top-1/2 w-[26%] -translate-x-1/2 -translate-y-1/2"
                  : ex.device === "extension"
                    ? "absolute left-1/2 top-1/2 w-[30%] -translate-x-1/2 -translate-y-1/2"
                    : "absolute left-1/2 top-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2"
                : slotFor(ex.device, i)
            } transition-all duration-500 ease-out ${
              isLive ? "z-10" : "z-0"
            } ${
              /* hero is already big and sits at the rail edge - scaling it
                 clips against the scroll container, so only 2/3 grow */
              isLive && i > 0 ? "scale-[1.07]" : "scale-100"
            } ${onOpen ? "group cursor-pointer" : ""}`}
            onClick={onOpen ? () => onOpen(ex.id) : undefined}
            role={onOpen ? "button" : undefined}
            tabIndex={onOpen ? 0 : undefined}
            onKeyDown={
              onOpen
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpen(ex.id);
                    }
                  }
                : undefined
            }
          >
            <div className="relative">
              <ExhibitMedia ex={ex} playing={isLive} />
              {/* hover affordance: the frame is clickable, say so quietly */}
              {onOpen && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span
                    className={`rounded-full border border-white/15 bg-black/60 font-mono uppercase whitespace-nowrap text-white/75 backdrop-blur-sm ${
                      ex.device === "phone"
                        ? "px-2.5 py-1 text-[8px] tracking-[0.2em]"
                        : "px-3.5 py-1.5 text-[9px] tracking-[0.3em]"
                    }`}
                  >
                    click to open
                  </span>
                </div>
              )}
            </div>
            {/* only the name breathes with focus - the product never dims.
                laptop: name left, tags right end. phone: tags drop below. */}
            <CaptionRow
              ex={ex}
              isLive={isLive}
              checkedTech={checkedTech}
              showAllStack={showAllStack}
            />
          </div>
        );
      })}
      </div>
    </>
  );
}
