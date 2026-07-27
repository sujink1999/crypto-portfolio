"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Evidence } from "@/companies/types";
import type { ProjectArchitecture } from "@/components/projects/architecture-data";
import ArchitectureDiagram from "@/components/projects/ArchitectureDiagram";
import StackTags from "./StackMatch";

/**
 * Full-screen case, modeled on the homepage project details: the main exhibit
 * big and centered at the top, then the story told as sequential sections
 * ("this is what we did…"), each with its own embed. `faces` (tab switching)
 * is reserved for multi-product cases like Vanta. Monochrome + one accent.
 */

export type CaseSection = {
  title: string;
  body?: string;
  /** embed shown under the section text - browser frame, device, anything */
  node?: ReactNode;
};

export default function ProjectCase({
  evidence,
  index,
  headline,
  note,
  checked = [],
  sections = [],
  faces,
  architecture,
  children,
  onClose,
}: {
  evidence: Evidence;
  /** position in the stage, for the "CASE 03" label */
  index?: number;
  /** the big line - what I did, phrased for THIS application (per-company) */
  headline?: string;
  /** the requirement note - "why this matters to you" */
  note?: string;
  /** JD-matched techs, carried in from the requirement */
  checked?: string[];
  /** the narrative: sequential titled sections, each optionally with an embed */
  sections?: CaseSection[];
  /** multi-product tabs (Vanta only): switch the hero exhibit */
  faces?: { label: string; node: ReactNode }[];
  architecture?: ProjectArchitecture;
  /** the hero exhibit - big, centered, top */
  children?: ReactNode;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [face, setFace] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const divider = "border-t border-white/[0.08] pt-10";

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-all duration-300 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.99]"
      }`}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="story-grain pointer-events-none fixed inset-0 z-10" />

      <button
        type="button"
        onClick={close}
        className="fixed right-6 top-6 z-20 border border-white/15 bg-black/60 px-3 py-1 font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 backdrop-blur-sm transition-colors hover:text-white"
      >
        esc
      </button>

      {/* scrollable document */}
      <div className="relative h-full overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-10 px-6 py-20 md:px-16 md:py-24">
          {/* header */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
              {index != null ? `Case ${String(index + 1).padStart(2, "0")} - ` : ""}
              {evidence.period}
            </p>
            <h2 className="mt-4 text-5xl font-normal tracking-tight text-white md:text-7xl">
              {evidence.title}
            </h2>
            {evidence.metric && (
              <p className="mt-3 font-mono text-[11px] tracking-[0.2em] uppercase text-white/50">
                {evidence.metric}
              </p>
            )}
            <p className="mt-6 max-w-2xl text-base font-normal leading-relaxed text-white/65">
              {evidence.what}
            </p>
            <div className="mt-5">
              <StackTags stack={evidence.stack} checked={checked} />
            </div>
          </div>

          {/* hero exhibit - big, centered; tabs only for multi-product cases */}
          {(faces?.length || children) && (
            <div>
              {faces && faces.length > 0 ? (
                /* fixed-height stage so switching faces never jumps the layout */
                /* width-driven on mobile (no fixed height = no sideways overflow),
                   height-driven fixed stage on md+ so tab switches never jump */
                <div className="mt-10 flex items-center justify-center md:mt-20 md:h-[44vh] md:max-h-[500px]">
                  {faces[face].node}
                </div>
              ) : (
                children
              )}
              {faces && faces.length > 1 && (
                <div className="mt-6 flex flex-wrap justify-center gap-8">
                  {faces.map((f, i) => (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => setFace(i)}
                      className={`border-b pb-1 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors duration-300 ${
                        face === i
                          ? "border-white/60 text-white"
                          : "border-transparent text-white/35 hover:text-white/60"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* the narrative - this is what we did, beat by beat */}
          {sections.map((s) => (
            <div key={s.title} className={divider}>
              <h3 className="text-2xl font-normal tracking-tight text-white/90">
                {s.title}
              </h3>
              <div className="mb-6 mt-2 h-px w-8 bg-accent/60" />
              {s.body && (
                <p className="max-w-2xl text-base font-normal leading-relaxed text-white/60">
                  {s.body}
                </p>
              )}
              {s.node && <div className="mt-8">{s.node}</div>}
            </div>
          ))}

          {/* system design - contained, not a mural */}
          {architecture && (
            <div className={divider}>
              <h3 className="text-2xl font-normal tracking-tight text-white/90">
                System design
              </h3>
              <div className="mb-6 mt-2 h-px w-8 bg-accent/60" />
              <div className="mx-auto max-w-3xl">
                <ArchitectureDiagram architecture={architecture} />
              </div>
            </div>
          )}

          {/* the one accent note + link */}
          {(note || evidence.link) && (
            <div className={divider}>
              {note && (
                <p className="max-w-2xl text-base font-normal leading-relaxed text-accent/90">
                  {note}
                </p>
              )}
              {evidence.link && (
                <a
                  href={evidence.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-block font-mono text-[11px] tracking-[0.25em] uppercase text-white/50 transition-colors hover:text-white"
                >
                  see it live &rarr;
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
