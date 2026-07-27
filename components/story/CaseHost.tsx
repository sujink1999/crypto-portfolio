"use client";

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { EVIDENCE } from "@/companies/evidence";
import {
  BEANS_ARCHITECTURE,
  CADDI_ARCHITECTURE,
  KEOM_ARCHITECTURE,
  MUDREX_ARCHITECTURE,
  VANTA_ARCHITECTURE,
} from "@/components/projects/architecture-data";
import DeviceFrame from "./DeviceFrame";
import ProjectCase from "./ProjectCase";
import EmbedBrowser from "./EmbedBrowser";
import SlideshowPhone from "./demos/SlideshowPhone";
import { SOCIETY_SLIDES } from "./exhibits";

const MUDREX_SLIDES = [
  "/projects/mudrex-1.png",
  "/projects/mudrex-2.png",
  "/projects/mudrex-3.png",
];

const CaddiWidget = dynamic(() => import("@/components/caddi/CaddiWidget"), {
  ssr: false,
});

/** Evidence ids that have a full case view behind them. */
export const CASE_IDS = ["beans", "keom", "caddi-lambda", "mudrex", "vanta-os"] as const;

export const hasCase = (id: string) =>
  (CASE_IDS as readonly string[]).includes(id);

/* height-driven so every face fills the same fixed-height stage */
function LaptopVideo({ src }: { src: string }) {
  return (
    <div
      className="mx-auto w-full max-w-full md:h-full md:w-auto"
      style={{ aspectRatio: "2.02" }}
    >
      <DeviceFrame device="laptop" fill screenAspect="3416 / 1860">
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover object-top"
        />
      </DeviceFrame>
    </div>
  );
}

/**
 * Renders the full-screen case for an evidence id (perfected in /lab 08).
 * `checked` highlights the stack techs the active JD requirement asks for.
 */
export default function CaseHost({
  id,
  checked = [],
  onClose,
}: {
  id: string;
  checked?: string[];
  onClose: () => void;
}) {
  const [widgetOpen, setWidgetOpen] = useState(false);
  const close = () => {
    setWidgetOpen(false);
    onClose();
  };

  const cases: Record<string, ReactNode> = {
    beans: (
      <ProjectCase
        evidence={EVIDENCE["beans"]}
        index={0}
        checked={checked}
        sections={[
          {
            title: "The Waitlist",
            body: "Before launch, we built a playful pixel-art waitlist to build hype and collect early interest. Users explored a retro game-inspired landing page to sign up, setting the tone for the project.",
            node: (
              <EmbedBrowser
                url="beans.fun"
                src="https://beans-frontend-liard.vercel.app/"
              />
            ),
          },
          {
            title: "The NFT Drop",
            body: "We launched an NFT collection as early-access passes to the platform. Holders got priority access to token auctions, reduced fees, and governance weight in the bidding system.",
            node: (
              <EmbedBrowser
                url="beans.fun/claim"
                src="https://beans-frontend-liard.vercel.app/claim"
              />
            ),
          },
          {
            title: "The Trading Desktop",
            body: "The platform itself: an auction-based token launching system rendered as a retro desktop. Users bid on which token launched each round; winners shipped to Pump.fun and graduated to DEXes with full liquidity. AWS Lambda handled auction logic, graduation triggers, and Pump.fun integration.",
            node: <EmbedBrowser url="beans.fun/desktop" src="/showcase/beans" />,
          },
        ]}
        architecture={BEANS_ARCHITECTURE}
        onClose={close}
      />
    ),
    keom: (
      <ProjectCase
        evidence={EVIDENCE["keom"]}
        index={1}
        checked={checked}
        sections={[
          {
            title: "About the Project",
            body: "KEOM (formerly 0vix) is a decentralized lending and borrowing protocol. Users supply assets to earn yield or borrow against their collateral across multiple chains. The protocol manages interest rates algorithmically based on utilization, with liquidation mechanisms to keep the system solvent.",
            node: <EmbedBrowser url="0vix - recreated" src="/showcase/ovix" />,
          },
          {
            title: "Role",
            body: "Frontend engineer responsible for building and maintaining the core lending and borrowing interface. Worked on the supply and borrow flows, portfolio dashboards, real-time rate displays, and multi-chain support across the application.",
          },
        ]}
        architecture={KEOM_ARCHITECTURE}
        onClose={close}
      />
    ),
    "caddi-lambda": (
      <ProjectCase
        evidence={EVIDENCE["caddi-lambda"]}
        index={2}
        checked={checked}
        sections={[
          {
            title: "Try the Extension",
            node: (
              <button
                type="button"
                onClick={() => setWidgetOpen(true)}
                className="group flex w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-[#A3E2E3]/30 p-10 transition-all duration-300 hover:border-[#A3E2E3]/50 md:p-14"
              >
                <span className="font-mono text-sm text-white/30 transition-colors group-hover:text-white/50">
                  Click to launch the widget
                </span>
              </button>
            ),
          },
          {
            title: "About the Project",
            body: "Caddi is a widget Chrome extension that lets you swap and bridge from any website - the widget is just there, wherever you are, no separate DEX or bridge tab. It also aggregates swaps: it looks at the swap you're about to make and tells you if there's a better rate somewhere else.",
          },
          {
            title: "Role",
            body: "Full-stack engineer and sole technical owner. Built the Chrome extension from scratch - the injected widget UI, background service workers, cross-origin messaging, and the swap-aggregation backend. Owned it end-to-end from Figma designs through Chrome Web Store deployment.",
          },
          {
            title: "How it Works",
            body: "The widget injects into any webpage as a floating overlay. Pick your tokens and chains, and AWS Lambda microservices compare routes across providers in real time - surfacing a better swap when one exists and executing the one you choose.",
          },
        ]}
        architecture={CADDI_ARCHITECTURE}
        onClose={close}
      />
    ),
    mudrex: (
      <ProjectCase
        evidence={EVIDENCE["mudrex"]}
        index={3}
        checked={checked}
        sections={[
          {
            title: "Role",
            body: "Frontend engineer working across the React Native mobile app and the React web dashboard. Built investment flow screens, portfolio tracking views, and real-time price feeds. Collaborated closely with design in Figma to deliver a polished, consumer-grade experience across both platforms.",
          },
          {
            title: "About the Project",
            body: "Mudrex is a crypto investment platform that makes it simple for users to invest in curated crypto baskets, automated trading strategies, and yield-generating vaults. The app abstracts away the complexity of managing a crypto portfolio, letting users invest with a few taps while the platform handles rebalancing, risk management, and execution under the hood.",
          },
        ]}
        architecture={MUDREX_ARCHITECTURE}
        onClose={close}
      >
        <div className="mx-auto w-full max-w-[240px]">
          <SlideshowPhone srcs={MUDREX_SLIDES} />
        </div>
      </ProjectCase>
    ),
    "vanta-os": (
      <ProjectCase
        evidence={EVIDENCE["vanta-os"]}
        index={4}
        checked={checked}
        faces={[
          {
            label: "Vanta OS",
            node: <LaptopVideo src="/showcase/vanta-os/os-landing-scroll.mp4" />,
          },
          {
            label: "OS product",
            node: <LaptopVideo src="/showcase/vanta-os/os-product.mp4" />,
          },
        ]}
        sections={[
          {
            title: "Role",
            body: "Founder and CTO of Vanta. Built the marketing and investor landing pages with custom WebGL (the Möbius hero, the 3D globe), the Vanta OS product itself, and the Society platform - the web store, the labs booking and report viewers, admin dashboards, and the mobile app shipped to the App Store.",
          },
          {
            title: "Vanta Society",
            body: "The community side of Vanta, shipped to the App Store: community feed, marketplace, workouts and challenges, stories, streaks, and Strava integration - built on an atomic design system with custom Skia graphics.",
            node: (
              <div className="mx-auto w-full max-w-[300px]">
                <SlideshowPhone srcs={SOCIETY_SLIDES} />
              </div>
            ),
          },
          {
            title: "About the Project",
            body: "Vanta OS is the central brain for high-performance living: biomarker dashboards, fuel and stack tracking, an AI chat coach, and cohort-gated onboarding. Garmin and WHOOP data flows through a reconciliation engine into LLM-generated daily plans, with an eval harness keeping the pipeline honest.",
          },
        ]}
        architecture={VANTA_ARCHITECTURE}
        onClose={close}
      />
    ),
  };

  if (!cases[id]) return null;

  return (
    <>
      {cases[id]}
      {/* Caddi's floating widget - slides in bottom-right, above the case */}
      {id === "caddi-lambda" && (
        <div
          className="fixed bottom-4 right-4 z-[60] origin-bottom-right scale-[0.8] transition-all duration-500 ease-out sm:bottom-6 sm:right-6 sm:scale-100"
          style={{
            transform: widgetOpen
              ? "translateX(0)"
              : "translateX(calc(100% + 24px))",
            opacity: widgetOpen ? 1 : 0,
          }}
        >
          <button
            type="button"
            onClick={() => setWidgetOpen(false)}
            className="mb-2 ml-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 font-mono text-xs text-white/50 backdrop-blur-md transition-all hover:bg-white/15 hover:text-white/80"
          >
            Close widget
          </button>
          {widgetOpen && <CaddiWidget />}
        </div>
      )}
    </>
  );
}
