"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Symbolic devices for the proof stage. The screen renders real components at
 * their native logical resolution (laptop 1280x800, phone 393x852), scaled to
 * whatever size the stage slot gives it - so live UIs stay pixel-faithful and
 * remain scrollable/interactive inside the frame.
 */

const LOGICAL = {
  laptop: { w: 1280, h: 800 },
  phone: { w: 393, h: 852 },
  extension: { w: 380, h: 560 },
} as const;

type Device = keyof typeof LOGICAL;

function ScaledScreen({
  device,
  logical,
  children,
}: {
  device: Device;
  logical?: { w: number; h: number };
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const { w, h } = logical ?? LOGICAL[device];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / w));
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden bg-black">
      {scale > 0 && (
        <div
          className="absolute left-0 top-0 origin-top-left overflow-hidden"
          style={{ width: w, height: h, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function DeviceFrame({
  device,
  children,
  fill = false,
  screenAspect = "1280 / 812",
  logical,
}: {
  device: Device;
  children: ReactNode;
  /** fill: children (e.g. a video) stretch to the screen - no logical-px scaling */
  fill?: boolean;
  /** laptop only: match the screen to the media's native aspect (e.g. "3416 / 1860") */
  screenAspect?: string;
  /** override the logical viewport for live components (e.g. { w: 1440, h: 900 }) */
  logical?: { w: number; h: number };
}) {
  const screen = (d: Device) =>
    fill ? (
      <div className="h-full w-full overflow-hidden bg-black">{children}</div>
    ) : (
      <ScaledScreen device={d} logical={logical}>{children}</ScaledScreen>
    );
  if (device === "extension") {
    /* a browser-popup rectangle - the shape a pinned extension opens into */
    return (
      <div className="w-full [perspective:1200px]">
        <div
          className="story-tilt relative mx-auto flex w-full flex-col overflow-hidden rounded-xl border border-white/15 bg-black shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]"
          style={{ aspectRatio: "380 / 560" }}
        >
          {/* toolbar strip - marks it as a chrome extension */}
          <div className="flex h-[7%] shrink-0 items-center gap-2 border-b border-white/10 px-3">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M10 3h4v3a2 2 0 1 0 4 0h3v4h-3a2 2 0 1 0 0 4h3v4h-4v-3a2 2 0 1 0-4 0v3H6v-4H3v-4h3a2 2 0 1 0 0-4H3V6h4V3h3Z" />
            </svg>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">{screen("extension")}</div>
        </div>
      </div>
    );
  }

  if (device === "phone") {
    return (
      <div className="w-full [perspective:1200px]">
      <div
        className="story-tilt relative mx-auto w-full border border-white/15 bg-black p-[3.5%] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]"
        style={{ aspectRatio: "393 / 852", borderRadius: "16% / 7.4%" }}
      >
        <div
          className="h-full w-full overflow-hidden"
          style={{ borderRadius: "13.5% / 6.4%" }}
        >
          {screen("phone")}
        </div>
        {/* dynamic island */}
        <div className="absolute left-1/2 top-[5.5%] z-10 h-[3%] w-[30%] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
      </div>
      </div>
    );
  }

  return (
    <div className="story-laptop w-full [perspective:1200px]">
      <div style={{ transformStyle: "preserve-3d" }}>
        {/* lid / screen - hinges back on the deck under the cursor */}
        <div
          className="story-lid relative mx-auto w-[88%] rounded-t-lg border border-b-0 border-white/15 bg-black p-[0.9%] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]"
          style={{ aspectRatio: screenAspect }}
        >
          <div className="h-full w-full overflow-hidden rounded-sm ring-1 ring-white/[0.07]">
            {screen("laptop")}
          </div>
        </div>
        {/* deck */}
        <div className="relative mx-auto h-[10px] w-full rounded-b-md rounded-t-sm border border-white/15 bg-white/[0.04]">
          <div className="absolute left-1/2 top-0 h-[4px] w-[14%] -translate-x-1/2 rounded-b-md bg-white/[0.07]" />
        </div>
      </div>
    </div>
  );
}
