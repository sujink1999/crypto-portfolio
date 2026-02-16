"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import ArchitectureDiagram from "./ArchitectureDiagram";
import { BEANS_ARCHITECTURE } from "./architecture-data";
import BrowserFrame from "./BrowserFrame";

export default function BeansDetail({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Body scroll lock
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

  // ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  // Scale iframes to fit container
  const IFRAME_W = 1200;
  const IFRAME_H = 680;
  const wrapRef = useRef<HTMLDivElement>(null);
  const wrapRef2 = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scale2, setScale2] = useState(1);

  useEffect(() => {
    const observers: ResizeObserver[] = [];
    const setup = (
      el: HTMLDivElement | null,
      setter: (v: number) => void
    ) => {
      if (!el) return;
      const update = () => setter(el.clientWidth / IFRAME_W);
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      observers.push(ro);
    };
    setup(wrapRef.current, setScale);
    setup(wrapRef2.current, setScale2);
    return () => observers.forEach((ro) => ro.disconnect());
  }, []);

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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

      {/* Close button */}
      <button
        onClick={handleClose}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/60 hover:text-white/90 hover:border-white/20 transition-all duration-200 text-sm font-mono cursor-pointer"
      >
        <span>Close</span>
        <kbd className="text-[10px] text-white/30 border border-white/10 rounded px-1.5 py-0.5">
          ESC
        </kbd>
      </button>

      {/* Scrollable content */}
      <div className="relative overflow-y-auto h-full">
        <div className="max-w-5xl mx-auto px-6 md:px-16 py-20 md:py-28 space-y-10">
          {/* Header */}
          <div>
            <span className="inline-block font-mono text-sm px-3 py-1 rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10 text-[#4ade80] mb-6">
              01
            </span>
            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #4ade80 0%, #86efac 100%)",
              }}
            >
              Beans
            </h2>
            <p className="text-base md:text-lg text-white/40 mt-3 font-mono">
              Token Trading Platform
            </p>
          </div>

          {/* --- The Waitlist --- */}
          <div>
            <h3 className="text-2xl font-medium text-white/90 mb-1">The Waitlist</h3>
            <div className="w-8 h-0.5 bg-[#4ade80]/60 rounded-full mb-6" />
            <p className="text-base text-white/60 leading-relaxed">
              Before launch, we built a playful pixel-art waitlist to build hype
              and collect early interest. Users explored a retro game-inspired
              landing page to sign up, setting the tone for the project.
            </p>
          </div>

          {/* Waitlist iframe */}
          <BrowserFrame
            url="beans.fun"
            src="https://beans-frontend-liard.vercel.app/"
            wrapRef={wrapRef}
            scale={scale}
            iframeW={IFRAME_W}
            iframeH={IFRAME_H}
          />

          {/* --- The NFT Drop --- */}
          <div className={divider}>
            <h3 className="text-2xl font-medium text-white/90 mb-1">The NFT Drop</h3>
            <div className="w-8 h-0.5 bg-[#4ade80]/60 rounded-full mb-6" />
            <p className="text-base text-white/60 leading-relaxed">
              We launched an NFT collection as early-access passes to the
              platform. Holders got priority access to token auctions, reduced
              fees, and governance weight in the bidding system.
            </p>
          </div>

          {/* NFT claim iframe */}
          <BrowserFrame
            url="beans.fun/claim"
            src="https://beans-frontend-liard.vercel.app/claim"
            wrapRef={wrapRef2}
            scale={scale2}
            iframeW={IFRAME_W}
            iframeH={IFRAME_H}
          />

          {/* --- Role --- */}
          <div className={divider}>
            <h3 className="text-2xl font-medium text-white/90 mb-1">Role</h3>
            <div className="w-8 h-0.5 bg-[#4ade80]/60 rounded-full mb-6" />
            <p className="text-base text-white/60 leading-relaxed">
              Full-stack engineer and sole technical owner of the entire Beans
              platform. Designed, built, and shipped the frontend, backend
              infrastructure, smart contract integrations, and real-time data
              pipelines from scratch. Owned the product from initial concept
              through production deployment, including UI/UX design in Figma,
              cloud architecture on AWS, and all client-facing features.
            </p>
          </div>

          {/* --- About the Project --- */}
          <div className={divider}>
            <h3 className="text-2xl font-medium text-white/90 mb-1">
              About the Project
            </h3>
            <div className="w-8 h-0.5 bg-[#4ade80]/60 rounded-full mb-6" />
            <p className="text-base text-white/60 leading-relaxed">
              Beans was an auction-based token launching system. Users bid on
              which token would be launched within a specific time window. The
              winning token from each auction round got launched on Pump.fun,
              and once it graduated from the bonding curve it would hit
              decentralized exchanges with full liquidity. The system created a
              competitive, game-like dynamic around token launches. Instead of
              anyone launching anything, the community decided what shipped.
            </p>
          </div>

          {/* --- System Architecture --- */}
          <div className={divider}>
            <h3 className="text-2xl font-medium text-white/90 mb-1">System Architecture</h3>
            <div className="w-8 h-0.5 bg-[#4ade80]/60 rounded-full mb-6" />
            <ArchitectureDiagram architecture={BEANS_ARCHITECTURE} />
          </div>
        </div>
      </div>
    </div>
  );
}
