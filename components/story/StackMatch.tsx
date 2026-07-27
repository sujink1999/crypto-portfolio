"use client";

/**
 * Stack tags that sit under a project exhibit: the technologies it was built
 * with, in quiet mono. When the active JD requirement is about the stack,
 * pass `checked` - matching techs turn white and get a drawn checkmark, so
 * the reader sees "this requirement, proven by this project, with this tech".
 */
export default function StackTags({
  stack,
  checked = [],
  accentAll = false,
}: {
  stack: string[];
  checked?: string[];
  /** paint every tag in the accent - no checkmarks (home page: no JD to match) */
  accentAll?: boolean;
}) {
  const isChecked = (t: string) =>
    checked.some((c) => t.toLowerCase().includes(c.toLowerCase()));

  return (
    <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
      {stack.map((t) => {
        const on = !accentAll && isChecked(t);
        return (
          <span
            key={t}
            className={`inline-flex items-center gap-1 font-mono text-[9px] leading-none tracking-[0.12em] uppercase transition-colors duration-500 ${
              on || accentAll ? "text-accent" : "text-white/30"
            }`}
          >
            {on && (
              <svg
                width="9"
                height="9"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8.5 L6.5 12 L13 4.5" pathLength={1} className="draw-stroke" />
              </svg>
            )}
            {t}
          </span>
        );
      })}
    </span>
  );
}
