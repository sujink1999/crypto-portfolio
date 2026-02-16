"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import ArchitectureDiagram from "./ArchitectureDiagram";
import { CADDI_ARCHITECTURE } from "./architecture-data";

const CaddiWidget = dynamic(() => import("@/components/caddi/CaddiWidget"), {
  ssr: false,
});

export default function CaddiDetail({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);

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
      if (e.key === "Escape") {
        if (widgetOpen) {
          setWidgetOpen(false);
        } else {
          handleClose();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose, widgetOpen]);

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
            <span className="inline-block font-mono text-sm px-3 py-1 rounded-full border border-[#A3E2E3]/20 bg-[#A3E2E3]/10 text-[#A3E2E3] mb-6">
              02
            </span>
            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #A3E2E3 0%, #6dd5d7 100%)",
              }}
            >
              Caddi
            </h2>
            <p className="text-base md:text-lg text-white/40 mt-3 font-mono">
              Cross-Chain Bridge Chrome Extension
            </p>
          </div>

          {/* --- Try the Extension CTA --- */}
          <button
            onClick={() => setWidgetOpen(true)}
            className="group w-full rounded-2xl border-2 border-dashed border-[#A3E2E3]/30 hover:border-[#A3E2E3]/50 transition-all duration-300 cursor-pointer p-10 md:p-14 flex items-center justify-center"
          >
            <span className="text-sm text-white/30 group-hover:text-white/50 transition-colors font-mono">
              Click to launch the widget
            </span>
          </button>

          {/* --- About --- */}
          <div>
            <h3 className="text-2xl font-medium text-white/90 mb-1">
              About the Project
            </h3>
            <div className="w-8 h-0.5 bg-[#A3E2E3]/60 rounded-full mb-6" />
            <p className="text-base text-white/60 leading-relaxed">
              Caddi was a Chrome extension that simplified cross-chain token
              bridging. Instead of navigating to separate bridge UIs, users could
              bridge tokens directly from any dApp through a persistent widget
              overlay. It aggregated routes from multiple bridge protocols,
              compared fees, speed, and security scores, and let users execute
              the cheapest or fastest path in a few clicks.
            </p>
          </div>

          {/* --- Role --- */}
          <div className={divider}>
            <h3 className="text-2xl font-medium text-white/90 mb-1">Role</h3>
            <div className="w-8 h-0.5 bg-[#A3E2E3]/60 rounded-full mb-6" />
            <p className="text-base text-white/60 leading-relaxed">
              Full-stack engineer and sole technical owner. Designed and built
              the Chrome extension from scratch, including the injected widget
              UI, background service workers, cross-origin messaging, bridge
              aggregation engine, and route optimization logic. Owned the
              product end-to-end from Figma designs through Chrome Web Store
              deployment.
            </p>
          </div>

          {/* --- How it Works --- */}
          <div className={divider}>
            <h3 className="text-2xl font-medium text-white/90 mb-1">
              How it Works
            </h3>
            <div className="w-8 h-0.5 bg-[#A3E2E3]/60 rounded-full mb-6" />
            <p className="text-base text-white/60 leading-relaxed">
              The widget injected into any webpage as a floating overlay. Users
              selected source and destination chains, picked tokens, and the
              system fetched optimized routes from multiple bridge protocols in
              real-time. A golf-themed animation played during bridge execution
              to make the wait feel shorter.
            </p>
          </div>

          {/* --- System Architecture --- */}
          <div className={divider}>
            <h3 className="text-2xl font-medium text-white/90 mb-1">System Architecture</h3>
            <div className="w-8 h-0.5 bg-[#A3E2E3]/60 rounded-full mb-6" />
            <ArchitectureDiagram architecture={CADDI_ARCHITECTURE} />
          </div>

          {/* --- Key Features --- */}
          <div className={divider}>
            <h3 className="text-2xl font-medium text-white/90 mb-1">
              Key Features
            </h3>
            <div className="w-8 h-0.5 bg-[#A3E2E3]/60 rounded-full mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Multi-Bridge Aggregation",
                  desc: "Fetched and compared routes from Stargate, Across, Hop, cBridge and more in real-time.",
                },
                {
                  title: "Security Scoring",
                  desc: "Each route displayed a security score based on bridge audit history and TVL.",
                },
                {
                  title: "Injected Widget",
                  desc: "Persistent overlay that worked on any webpage without leaving the current dApp.",
                },
                {
                  title: "Live Execution Tracking",
                  desc: "Step-by-step transaction progress with on-chain hash links and animated feedback.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02]"
                >
                  <h4 className="text-sm font-medium text-[#A3E2E3] mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating widget — fixed bottom-right, slides in from off-screen */}
      <div
        className="fixed bottom-6 right-6 z-[60] transition-all duration-500 ease-out"
        style={{
          transform: widgetOpen
            ? "translateX(0) translateY(0)"
            : "translateX(calc(100% + 24px))",
          opacity: widgetOpen ? 1 : 0,
        }}
      >
        {/* Small close pill above widget */}
        <button
          onClick={() => setWidgetOpen(false)}
          className="mb-2 ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white/50 hover:text-white/80 text-xs font-mono transition-all cursor-pointer backdrop-blur-md"
        >
          Close widget
          <kbd className="text-[9px] text-white/25 border border-white/10 rounded px-1 py-0.5">
            ESC
          </kbd>
        </button>
        <CaddiWidget />
      </div>
    </div>
  );
}
