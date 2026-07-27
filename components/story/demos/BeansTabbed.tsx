"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import DeviceFrame from "../DeviceFrame";

const BeansDesktop = dynamic(
  () => import("@/components/showcase/beans/BeansDesktop"),
  { ssr: false }
);

/**
 * Beans has three faces - the retro trading desktop (live in-repo), the
 * landing page, and the NFT flow. One laptop, a quiet mono tab row above it.
 */
const TABS = ["Trading desktop", "Landing page", "NFT"] as const;

export default function BeansTabbed() {
  const [tab, setTab] = useState(0);

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-6 flex justify-center gap-8">
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(i)}
            className={`border-b pb-1 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors duration-300 ${
              tab === i
                ? "border-white/60 text-white"
                : "border-transparent text-white/35 hover:text-white/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <DeviceFrame device="laptop">
        {tab === 0 ? (
          <BeansDesktop />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-sm tracking-[0.2em] uppercase text-white/25">
            {TABS[tab]} - recording pending
          </div>
        )}
      </DeviceFrame>
    </div>
  );
}
