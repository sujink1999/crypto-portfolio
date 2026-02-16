"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import BrowserFrame from "./BrowserFrame";
import ArchitectureDiagram from "./ArchitectureDiagram";
import { KEOM_ARCHITECTURE } from "./architecture-data";

export default function KeomDetail({ onClose }: { onClose: () => void }) {
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

  const IFRAME_W = 1200;
  const IFRAME_H = 900;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / IFRAME_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
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
            <span className="inline-block font-mono text-sm px-3 py-1 rounded-full border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 text-[#8b5cf6] mb-6">
              03
            </span>
            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #8b5cf6 0%, #c4b5fd 100%)",
              }}
            >
              KEOM
            </h2>
            <p className="text-base md:text-lg text-white/40 mt-3 font-mono">
              DeFi Lending &amp; Borrowing Protocol
            </p>
          </div>

          {/* About */}
          <div>
            <h3 className="text-2xl font-medium text-white/90 mb-1">About the Project</h3>
            <div className="w-8 h-0.5 bg-[#8b5cf6]/60 rounded-full mb-6" />
            <p className="text-base text-white/60 leading-relaxed">
              KEOM (formerly 0vix) is a decentralized lending and borrowing
              protocol. Users supply assets to earn yield or borrow against
              their collateral across multiple chains. The protocol manages
              interest rates algorithmically based on utilization, with
              liquidation mechanisms to keep the system solvent.
            </p>
          </div>

          {/* Live app iframe */}
          <BrowserFrame
            url="app.keom.io"
            src="https://app.keom.io"
            wrapRef={wrapRef}
            scale={scale}
            iframeW={IFRAME_W}
            iframeH={IFRAME_H}
          />

          {/* Role */}
          <div className={divider}>
            <h3 className="text-2xl font-medium text-white/90 mb-1">Role</h3>
            <div className="w-8 h-0.5 bg-[#8b5cf6]/60 rounded-full mb-6" />
            <p className="text-base text-white/60 leading-relaxed">
              Frontend engineer responsible for building and maintaining the
              core lending and borrowing interface. Worked on the supply and
              borrow flows, portfolio dashboards, real-time rate displays, and
              multi-chain support across the application.
            </p>
          </div>

          {/* System Architecture */}
          <div className={divider}>
            <h3 className="text-2xl font-medium text-white/90 mb-1">System Architecture</h3>
            <div className="w-8 h-0.5 bg-[#8b5cf6]/60 rounded-full mb-6" />
            <ArchitectureDiagram architecture={KEOM_ARCHITECTURE} />
          </div>
        </div>
      </div>
    </div>
  );
}
