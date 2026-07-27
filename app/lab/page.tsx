import type { Metadata } from "next";
import DeviceFrame from "@/components/story/DeviceFrame";
import ExhibitStage from "@/components/story/ExhibitStage";
import SlideshowPhone from "@/components/story/demos/SlideshowPhone";
import BeansLive from "@/components/story/demos/BeansLive";
import StackTags from "@/components/story/StackMatch";
import CaseDemo from "@/components/story/demos/CaseDemo";
import OvixDemo from "@/components/story/demos/OvixDemo";

export const metadata: Metadata = {
  title: "Lab - exhibit workbench",
  robots: { index: false, follow: false },
};

const SOCIETY_SLIDES = [
  "/showcase/society/home.png",
  "/showcase/society/routine.png",
  "/showcase/society/map.png",
  "/showcase/society/chats.png",
  // captured without status-bar headroom - nudge below the dynamic island
  { src: "/showcase/society/store.png", padTop: 5.5 },
];

/**
 * Design workbench: one full-viewport bay per project exhibit. Each exhibit is
 * perfected here in isolation before being registered into the proof stage.
 */
export default function LabPage() {
  return (
    <div className="bg-black text-white">
      {/* 01 - Vanta OS landing: the scrolling laptop (native recording aspect) */}
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
          01 - Vanta OS landing · laptop · recording
        </p>
        <div className="w-full max-w-4xl">
          <DeviceFrame device="laptop" fill screenAspect="3416 / 1860">
            <video
              src="/showcase/vanta-os/os-landing-scroll.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover object-top"
            />
          </DeviceFrame>
        </div>
        <p className="max-w-md text-center text-sm font-light text-white/50">
          Custom WebGL M&ouml;bius, 3D globe, scroll-driven storytelling &mdash;
          Next.js 15, GSAP, Three.js.
        </p>
      </section>

      {/* 01B - Vanta OS product: the real thing */}
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
          01B - Vanta OS product · laptop · recording
        </p>
        <div className="w-full max-w-4xl">
          <DeviceFrame device="laptop" fill screenAspect="3416 / 1860">
            <video
              src="/showcase/vanta-os/os-product.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover object-top"
            />
          </DeviceFrame>
        </div>
        <p className="max-w-md text-center text-sm font-light text-white/50">
          The shipped product &mdash; biomarkers, wearable reconciliation, LLM
          daily plans with an eval harness.
        </p>
      </section>

      {/* 02 - Society mobile: screenshots feeding through the phone */}
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
          02 - Society mobile · phone · slides
        </p>
        <div className="w-full max-w-[250px]">
          <SlideshowPhone srcs={SOCIETY_SLIDES} />
        </div>
        <p className="max-w-md text-center text-sm font-light text-white/50">
          Shipped to the App Store &mdash; Expo, Skia, EAS.
        </p>
      </section>

      {/* 03 - Keom / 0VIX: the working terminal (live components) */}
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
          03 - Keom / 0VIX · laptop · live
        </p>
        <div className="w-full max-w-4xl">
          <DeviceFrame device="laptop" logical={{ w: 1440, h: 900 }}>
            <OvixDemo />
          </DeviceFrame>
        </div>
        <p className="max-w-md text-center text-sm font-light text-white/50">
          Production DeFi lending, TVL 500k &rarr; 10M &mdash; 84 of 91 commits.
        </p>
      </section>

      {/* 05 - Beans: one laptop, three faces */}
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
          05 - Beans · laptop · live (faces move to the detail view)
        </p>
        <div className="w-full max-w-4xl">
          <DeviceFrame device="laptop">
            <BeansLive />
          </DeviceFrame>
        </div>
        <p className="max-w-md text-center text-sm font-light text-white/50">
          Solana token launcher as a Win-95 desktop &mdash; Anchor program,
          bonding curves, matter-js physics.
        </p>
      </section>

      {/* 06 - Mudrex: existing screenshots in the phone */}
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
          06 - Mudrex · phone · slides
        </p>
        <div className="w-full max-w-[250px]">
          <SlideshowPhone
            srcs={[
              "/projects/mudrex-1.png",
              "/projects/mudrex-2.png",
              "/projects/mudrex-3.png",
            ]}
          />
        </div>
        <p className="max-w-md text-center text-sm font-light text-white/50">
          Crypto investing app &mdash; algorithmic baskets, fiat on-ramp.
        </p>
      </section>

      {/* 07 - Stack on the project: checks light up matching tech */}
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
          07 - Stack on the project · JD match state
        </p>
        <div className="w-full max-w-3xl">
          <DeviceFrame device="laptop">
            <BeansLive />
          </DeviceFrame>
          <div className="mx-auto mt-4 flex w-[88%] items-baseline justify-between gap-6">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/60">
              Beans
            </p>
            <StackTags
              stack={["Next.js", "TypeScript", "React", "Anchor / Rust", "matter-js"]}
              checked={["Next.js", "TypeScript", "React"]}
            />
          </div>
        </div>
        <p className="max-w-md text-center text-sm font-light text-white/50">
          The stack lives on the card. When the JD asks for React / TypeScript,
          those techs check themselves on every project that proves it.
        </p>
      </section>

      {/* 08 - Project case: click an exhibit → full-screen detail */}
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
          08 - Project cases · one button per project
        </p>
        <CaseDemo />
      </section>

      {/* 04 - Stage trio prototype: hero plays, hover a side exhibit to switch */}
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
          04 - Stage trio · hover switches the live exhibit
        </p>
        <ExhibitStage
          exhibits={[
            {
              id: "vanta-os",
              title: "Vanta OS landing",
              device: "laptop",
              media: {
                kind: "video",
                src: "/showcase/vanta-os/os-landing-scroll.mp4",
                aspect: "3416 / 1860",
              },
            },
            {
              id: "society-mobile",
              title: "Society mobile",
              device: "phone",
              media: { kind: "slides", srcs: SOCIETY_SLIDES },
            },
            {
              id: "keom",
              title: "Keom / 0VIX",
              device: "laptop",
              media: { kind: "image", src: "/projects/0vix.png" },
            },
          ]}
        />
        <p className="max-w-md text-center text-sm font-light text-white/50">
          One exhibit alive at a time &mdash; the model for the proof chapter.
        </p>
      </section>
    </div>
  );
}
