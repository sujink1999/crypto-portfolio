"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import DeviceFrame from "../DeviceFrame";

export type Slide = string | { src: string; padTop?: number };

const norm = (s: Slide) => (typeof s === "string" ? { src: s, padTop: 0 } : s);

/** Phone frame cycling app screenshots - no interaction needed at small sizes. */
export default function SlideshowPhone({
  srcs,
  intervalMs = 2200,
}: {
  srcs: Slide[];
  intervalMs?: number;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % srcs.length), intervalMs);
    return () => clearInterval(t);
  }, [srcs.length, intervalMs]);

  return (
    <DeviceFrame device="phone" fill>
      <div className="relative h-full w-full bg-black">
        {srcs.map(norm).map((s, si) => (
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
              sizes="16rem"
              className="object-cover object-top"
            />
          </div>
        ))}
      </div>
    </DeviceFrame>
  );
}
