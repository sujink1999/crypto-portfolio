import type { PipelineCompany } from "@/lib/pipeline/types";

export function postedLabel(c: PipelineCompany): string {
  const p = c.posted;
  if (p.evergreen) return "evergreen";
  if (p.date === null) return p.verifiedLiveAt ? `live ${shortDate(p.verifiedLiveAt)}` : "unknown";
  if (p.precision === "month")
    return new Date(p.date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const days = Math.floor((Date.now() - Date.parse(p.date)) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return shortDate(p.date);
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const CURRENCY_SYMBOL: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", SGD: "S$" };

export function compLabel(c: PipelineCompany): string {
  const k = c.compensation;
  if (k.min === null && k.max === null) return "not listed";
  const sym = CURRENCY_SYMBOL[k.currency] ?? `${k.currency} `;
  const fmt = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : String(n));
  const approx = k.confidence === "third_party" || k.confidence === "estimated" ? "~" : "";
  if (k.min !== null && k.max !== null) return `${approx}${sym}${fmt(k.min)}–${fmt(k.max)}`;
  if (k.max !== null) return `${approx}up to ${sym}${fmt(k.max)}`;
  return `${approx}${sym}${fmt(k.min as number)}+`;
}

export function hiringLabel(c: PipelineCompany): string {
  const h = c.hiring;
  const where = h.countries === "worldwide" ? "worldwide" : h.countries.join(", ");
  const auth = h.usAuthRequired ? " · US auth" : "";
  return `${h.mode} · ${where}${auth}`;
}

/* 12px stroke icons; currentColor so each metric tints its own icon. */
const stroke = { stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;

export const Icons = {
  /** Compensation: banknote */
  comp: (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <rect x="1" y="3" width="10" height="6.5" rx="1.2" {...stroke} />
      <circle cx="6" cy="6.25" r="1.5" {...stroke} />
    </svg>
  ),
  /** Company size: two people */
  size: (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="4.5" cy="4" r="1.9" {...stroke} />
      <path d="M1.4 10.4c.4-2 1.6-3 3.1-3s2.7 1 3.1 3" {...stroke} />
      <path d="M8.2 2.6a1.9 1.9 0 0 1 0 2.9M9.2 7.6c.9.4 1.5 1.3 1.8 2.8" {...stroke} />
    </svg>
  ),
  /** Hiring geography: globe */
  globe: (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="4.8" {...stroke} />
      <ellipse cx="6" cy="6" rx="2.1" ry="4.8" {...stroke} />
      <path d="M1.4 6h9.2" {...stroke} />
    </svg>
  ),
  /** Posted: clock */
  clock: (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="4.8" {...stroke} />
      <path d="M6 3.4V6l1.8 1.3" {...stroke} />
    </svg>
  ),
  /** External link */
  link: (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M1.5 8.5 L8.5 1.5 M3.5 1.5 H8.5 V6.5" {...stroke} />
    </svg>
  ),
};

function Metric({
  icon,
  title,
  className,
  children,
}: {
  icon: React.ReactNode;
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span title={title} className={`inline-flex min-w-0 items-center gap-1.5 ${className ?? ""}`}>
      <span className="shrink-0 opacity-60">{icon}</span>
      <span className="truncate">{children}</span>
    </span>
  );
}

/** Icon fact grid shown on every board card, whatever its tab. */
export default function MetricsRow({ c }: { c: PipelineCompany }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-white/[0.06] pt-3.5 font-mono text-[11px] leading-none">
      <Metric icon={Icons.comp} title={c.compensation.note ?? "Base salary"} className="text-white/85 tabular-nums">
        {compLabel(c)}
        {c.compensation.sponsorship === true && <span className="ml-1.5 text-white/40">sponsors</span>}
      </Metric>
      <Metric icon={Icons.clock} title={c.posted.note ?? "Posted"} className="text-white/45">
        {postedLabel(c)}
      </Metric>
      <Metric icon={Icons.size} title="Company size (headcount)" className={c.size ? "text-white/60" : "text-white/25"}>
        {c.size ? `${c.size} people` : "size unknown"}
      </Metric>
      <Metric icon={Icons.globe} title={c.hiring.note ?? c.hiring.timezoneNote ?? "Where they hire"} className="text-white/45">
        {hiringLabel(c)}
      </Metric>
      {c.status === "proposed" && c.jdUrl && (
        <a
          href={c.jdUrl}
          target="_blank"
          rel="noreferrer"
          className="col-span-2 inline-flex items-center gap-1.5 text-white/30 transition-colors hover:text-white"
        >
          <span className="opacity-60">{Icons.link}</span>
          <span className="truncate">{new URL(c.jdUrl).hostname.replace("www.", "")}</span>
        </a>
      )}
    </div>
  );
}
