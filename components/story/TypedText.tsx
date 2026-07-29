"use client";

import { useEffect, useMemo, useRef } from "react";

interface TypedTextProps {
  text: string;
  className?: string;
  /** ms between characters */
  charDelay?: number;
  /** ms before the first character */
  startDelay?: number;
  /** render fully visible immediately (skip / reduced motion) */
  instant?: boolean;
  /** word index from which the text renders as a gradientStart → accent gradient */
  gradientFrom?: number;
  /** color the gradient ramps from (default white) */
  gradientStart?: string;
  onDone?: () => void;
}

/**
 * Letter-by-letter reveal. Characters are grouped by word (inline-block)
 * so line wrapping never splits mid-word. Pure CSS animation-delay -
 * a single React render, no per-char timers.
 */
export default function TypedText({
  text,
  className,
  charDelay = 26,
  startDelay = 0,
  instant = false,
  gradientFrom,
  gradientStart = "#ffffff",
  onDone,
}: TypedTextProps) {
  const doneRef = useRef(false);

  const words = useMemo(() => text.split(" "), [text]);

  const total = instant ? 0 : startDelay + text.length * charDelay + 550;

  useEffect(() => {
    doneRef.current = false;
    const t = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
    }, Math.max(total, 30));
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, instant]);

  /* per-char white → accent ramp: gradient look that survives the per-char
     blur/transform animation (background-clip: text does not) */
  const gradientChars =
    gradientFrom !== undefined
      ? words.slice(gradientFrom).reduce((n, w) => n + Array.from(w).length, 0)
      : 0;
  let gradientIndex = 0;

  let charIndex = 0;
  return (
    <span className={className} aria-label={text} role="text">
      {words.map((word, wi) => {
        const chars = Array.from(word);
        const gradient = gradientFrom !== undefined && wi >= gradientFrom;
        const node = (
          <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
            {chars.map((ch, ci) => {
              const d = startDelay + charIndex * charDelay;
              charIndex++;
              let color: string | undefined;
              if (gradient) {
                const t =
                  gradientChars > 1 ? gradientIndex / (gradientChars - 1) : 1;
                gradientIndex++;
                color = `color-mix(in srgb, var(--accent) ${Math.round(
                  10 + 80 * t
                )}%, ${gradientStart})`;
              }
              return (
                <span
                  key={ci}
                  className={instant ? "inline-block" : "story-char"}
                  style={
                    instant
                      ? { color }
                      : { animationDelay: `${d}ms`, color }
                  }
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
        charIndex++; // account for the space
        return (
          <span key={`w${wi}`} aria-hidden>
            {node}
            {wi < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </span>
  );
}
