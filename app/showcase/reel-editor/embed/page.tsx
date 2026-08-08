import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import EditorSuite from "@/components/showcase/reel-editor/EditorSuite";
import "@/components/showcase/reel-editor/reel-editor.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-re-grotesk",
});

export const metadata: Metadata = {
  title: "Reel Editor",
  robots: { index: false, follow: false },
};

/** Chrome-free variant for the pitch-page exhibit iframe: just the suite. */
export default function ReelEditorEmbedPage() {
  return (
    <main className={`re-root ${grotesk.variable} flex min-h-screen items-center px-4 py-4`}>
      <EditorSuite compact />
    </main>
  );
}
