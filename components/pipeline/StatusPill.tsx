import type { PipelineStatus } from "@/lib/pipeline/types";

const LABELS: Record<PipelineStatus, string> = {
  proposed: "Proposed", researching: "Researching", page_draft: "Page draft",
  page_approved: "Page approved", app_text: "App text", notes: "Notes",
  build: "Build", pages_ready: "Pages ready", applied: "Applied", rejected: "Rejected",
};

export default function StatusPill({ status }: { status: PipelineStatus }) {
  const active = status === "page_draft" || status === "app_text" || status === "notes" || status === "pages_ready";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wide ${
        status === "rejected"
          ? "border-white/10 text-white/30"
          : active
            ? "border-white/25 text-white"
            : "border-white/10 text-white/50"
      }`}
    >
      {LABELS[status]}
    </span>
  );
}
