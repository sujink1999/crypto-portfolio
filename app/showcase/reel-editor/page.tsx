import type { Metadata } from "next";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import EditorSuite from "@/components/showcase/reel-editor/EditorSuite";
import "@/components/showcase/reel-editor/reel-editor.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-re-grotesk",
});

export const metadata: Metadata = {
  title: "Reel Editor - Showcase",
  description:
    "An AI video editor built for real distribution: the rendered reel next to the timeline the AI actually wrote, synced.",
  robots: { index: false, follow: false },
};

export default function ReelEditorShowcasePage() {
  return (
    <main className={`re-root ${grotesk.variable} min-h-screen px-6 py-16`}>
      <div className="mx-auto max-w-6xl">
        <Link
          href="/showcase"
          className="re-mono text-[10px] uppercase tracking-[0.3em] text-white/35 transition-colors hover:text-white/70"
        >
          ← Showcases
        </Link>

        <h1 className="re-display mt-4 text-3xl font-light tracking-tight text-white/90">
          Reel Editor
        </h1>
        <p className="mt-2 max-w-xl font-light text-white/55">
          The AI-assisted editor behind the Vanta reels. It reads word-level
          transcripts, picks the cleanest take, writes the cut, places captions
          off a face scan, and fires the effects. Below: a real rendered reel
          next to the timeline the AI actually wrote for it. Press play and
          watch them agree; click the timeline to seek.
        </p>

        <div className="mt-14">
          <EditorSuite />
        </div>

        <p className="mx-auto mt-10 max-w-md text-center font-mono text-[10px] tracking-[0.2em] text-white/30">
          Timeline data transcribed verbatim from the production cut files.
        </p>
      </div>
    </main>
  );
}
