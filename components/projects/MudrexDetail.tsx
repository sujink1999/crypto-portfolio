"use client";

import { useEffect, useState, useCallback } from "react";
import PhoneFrame from "./PhoneFrame";
import ArchitectureDiagram from "./ArchitectureDiagram";
import { MUDREX_ARCHITECTURE } from "./architecture-data";

const screenshots = [
  { src: "/projects/mudrex-1.png", alt: "Mudrex home screen" },
  { src: "/projects/mudrex-2.png", alt: "Mudrex investment screen" },
  { src: "/projects/mudrex-3.png", alt: "Mudrex portfolio screen" },
];

export default function MudrexDetail({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  const divider = "border-t border-white/10 pt-10";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 transition-all duration-200"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.98)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

      <button
        onClick={handleClose}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/60 hover:text-white/90 hover:border-white/20 transition-all duration-200 text-sm font-mono cursor-pointer"
      >
        <span>Close</span>
        <kbd className="text-[10px] text-white/30 border border-white/10 rounded px-1.5 py-0.5">
          ESC
        </kbd>
      </button>

      <div className="relative overflow-y-auto h-full">
        <div className="max-w-5xl mx-auto px-6 md:px-16 py-20 md:py-28 space-y-10">
          {/* Header */}
          <div>
            <span className="inline-block font-mono text-sm px-3 py-1 rounded-full border border-[#4F3592]/20 bg-[#4F3592]/10 text-[#4F3592] mb-6">
              04
            </span>
            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #4F3592 0%, #7C5FC7 100%)",
              }}
            >
              Mudrex
            </h2>
            <p className="text-base md:text-lg text-white/40 mt-3 font-mono">
              CeFi Investment Platform
            </p>
          </div>

          {/* Role */}
          <div>
            <h3 className="text-2xl font-medium text-white/90 mb-1">Role</h3>
            <div className="w-8 h-0.5 bg-[#4F3592]/60 rounded-full mb-6" />
            <p className="text-base text-white/60 leading-relaxed">
              Frontend engineer working across the React Native mobile app and
              the React web dashboard. Built investment flow screens, portfolio
              tracking views, and real-time price feeds. Collaborated closely
              with design in Figma to deliver a polished, consumer-grade
              experience across both platforms.
            </p>
          </div>

          {/* App screenshots */}
          <div className="flex gap-6 md:gap-10 overflow-x-auto pb-4 justify-center flex-wrap md:flex-nowrap">
            {screenshots.map((s) => (
              <PhoneFrame key={s.src} src={s.src} alt={s.alt} />
            ))}
          </div>

          {/* About */}
          <div className={divider}>
            <h3 className="text-2xl font-medium text-white/90 mb-1">About the Project</h3>
            <div className="w-8 h-0.5 bg-[#4F3592]/60 rounded-full mb-6" />
            <p className="text-base text-white/60 leading-relaxed">
              Mudrex is a crypto investment platform that makes it simple for
              users to invest in curated crypto baskets, automated trading
              strategies, and yield-generating vaults. The app abstracts away
              the complexity of managing a crypto portfolio, letting users
              invest with a few taps while the platform handles rebalancing,
              risk management, and execution under the hood.
            </p>
          </div>

          {/* System Architecture */}
          <div className={divider}>
            <h3 className="text-2xl font-medium text-white/90 mb-1">System Architecture</h3>
            <div className="w-8 h-0.5 bg-[#4F3592]/60 rounded-full mb-6" />
            <ArchitectureDiagram architecture={MUDREX_ARCHITECTURE} />
          </div>
        </div>
      </div>
    </div>
  );
}
