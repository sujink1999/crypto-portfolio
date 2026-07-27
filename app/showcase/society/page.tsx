import type { Metadata } from "next";
import Link from "next/link";
import SocietyPrototype from "@/components/showcase/society/SocietyPrototype";

export const metadata: Metadata = {
  title: "Vanta Society - Showcase",
  description:
    "Key screens from the Vanta Society mobile app, recreated on the web.",
};

export default function SocietyShowcasePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/showcase"
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35 transition-colors hover:text-white/70"
        >
          ← Showcases
        </Link>

        <h1 className="mt-4 text-3xl font-light tracking-tight text-white/90">
          Vanta Society
        </h1>
        <p className="mt-2 max-w-xl font-light text-white/55">
          A consumer mobile app (React Native / Expo) for running 66-day
          personal challenges. Below is a tour of the shipped app - sign-in,
          onboarding, the evolving character state, daily routine, score,
          store, member map, and chats. It cycles automatically; tap the
          phone to pause, or tap any thumbnail to jump to a screen.
        </p>

        <div className="mt-14 flex justify-center">
          <SocietyPrototype />
        </div>

        <p className="mx-auto mt-10 max-w-md text-center font-mono text-[10px] tracking-[0.2em] text-white/30">
          Real screens from the shipped app.
        </p>
      </div>
    </main>
  );
}
