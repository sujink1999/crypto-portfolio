import type { PipelineStatus } from "@/lib/pipeline/types";

const LABELS: Record<PipelineStatus, string> = {
  proposed: "Proposed", researching: "Researching", page_draft: "Page draft",
  build: "Build", pages_ready: "Pages ready", outreach: "Outreach", applied: "Applied", rejected: "Rejected",
};

/** Stage families: awaiting Sujin's review pulses amber, machine work is sky, terminal states settle. */
const TONES: Record<PipelineStatus, { text: string; bg: string; dot: string; pulse?: boolean }> = {
  proposed: { text: "text-white/60", bg: "bg-white/[0.05]", dot: "bg-white/40" },
  researching: { text: "text-violet-300", bg: "bg-violet-400/10", dot: "bg-violet-300" },
  page_draft: { text: "text-amber-300", bg: "bg-amber-400/10", dot: "bg-amber-300", pulse: true },
  pages_ready: { text: "text-amber-300", bg: "bg-amber-400/10", dot: "bg-amber-300", pulse: true },
  outreach: { text: "text-amber-300", bg: "bg-amber-400/10", dot: "bg-amber-300", pulse: true },
  build: { text: "text-sky-300", bg: "bg-sky-400/10", dot: "bg-sky-300" },
  applied: { text: "text-emerald-300", bg: "bg-emerald-400/10", dot: "bg-emerald-300" },
  rejected: { text: "text-white/30", bg: "bg-white/[0.03]", dot: "bg-white/20" },
};

export default function StatusPill({ status }: { status: PipelineStatus }) {
  const t = TONES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${t.bg} ${t.text}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {t.pulse && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:hidden ${t.dot}`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${t.dot}`} />
      </span>
      {LABELS[status]}
    </span>
  );
}
