"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PipelineCompany, CountryCode } from "@/lib/pipeline/types";
import StatusPill from "./StatusPill";
import Loader from "./Loader";
import MetricsRow from "./Metrics";

/** Sort keys: null/unknown sinks to the bottom for both. */
const postedSortKey = (c: PipelineCompany) =>
  c.posted.evergreen || c.posted.date === null ? -Infinity : Date.parse(c.posted.date);
const salarySortKey = (c: PipelineCompany) =>
  c.compensation.maxUsd ?? c.compensation.minUsd ?? -Infinity;

function matchesFilters(c: PipelineCompany, f: Filters): boolean {
  if (f.country !== "any") {
    if (c.hiring.countries !== "worldwide" && !c.hiring.countries.includes(f.country)) return false;
  }
  if (f.hideUsAuth && c.hiring.usAuthRequired === true) return false;
  if (f.minUsd > 0) {
    const best = c.compensation.maxUsd ?? c.compensation.minUsd;
    if (best !== null && best < f.minUsd) return false;
    if (best === null && !f.includeUnlisted) return false;
  }
  return true;
}

type SortKey = "priority" | "posted" | "salary";
interface Filters {
  country: CountryCode | "any";
  hideUsAuth: boolean;
  minUsd: number;
  includeUnlisted: boolean;
}
const DEFAULT_FILTERS: Filters = { country: "any", hideUsAuth: false, minUsd: 0, includeUnlisted: true };

type Group = {
  title: string;
  statuses: PipelineCompany["status"][];
  tier?: "match" | "longshot";
};

// Actively-worked tabs first; each tab holds one or more board groups.
const TABS: { key: string; label: string; active?: boolean; groups: Group[] }[] = [
  {
    key: "review",
    label: "Review",
    active: true,
    groups: [{ title: "Awaiting your review", statuses: ["page_draft", "pages_ready", "outreach"] }],
  },
  {
    key: "building",
    label: "Building",
    active: true,
    groups: [{ title: "Approved, building", statuses: ["build"] }],
  },
  {
    key: "research",
    label: "Research",
    active: true,
    groups: [{ title: "In research", statuses: ["researching"] }],
  },
  {
    key: "proposed",
    label: "Proposed",
    groups: [
      { title: "Matches", statuses: ["proposed"], tier: "match" },
      { title: "Longshots", statuses: ["proposed"], tier: "longshot" },
    ],
  },
  { key: "applied", label: "Applied", groups: [{ title: "Applied", statuses: ["applied"] }] },
  { key: "rejected", label: "Rejected", groups: [{ title: "Rejected", statuses: ["rejected"] }] },
];

function inGroup(c: PipelineCompany, g: Group): boolean {
  return g.statuses.includes(c.status) && (g.tier === undefined || (c.tier ?? "match") === g.tier);
}

const LEVEL_RANK = { high: 0, medium: 1, low: 2 } as const;

/** Ranked cards (1-10) first in order; the rest fall back to level, then name. */
function priorityRank(c: PipelineCompany): number {
  if (c.priority?.rank) return c.priority.rank;
  return 100 + (c.priority ? LEVEL_RANK[c.priority.level] : 3);
}

function CardShell({
  slug,
  clickable,
  children,
}: {
  slug: string;
  clickable: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const cls = "group relative block rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 transition-[box-shadow,transform] motion-safe:duration-200 motion-safe:ease-out";
  if (!clickable) return <div className={cls}>{children}</div>;
  // Not a <Link>: cards can contain real anchors (posting link), and <a> can't nest in <a>.
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a, button")) return;
        router.push(`/pipeline/${slug}`);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !(e.target as HTMLElement).closest("a, button")) {
          router.push(`/pipeline/${slug}`);
        }
      }}
      className={`${cls} cursor-pointer hover:-translate-y-px hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_1px_0_0_rgba(255,255,255,0.10)_inset,0_12px_40px_-12px_rgba(255,255,255,0.07)]`}
    >
      {children}
    </div>
  );
}

export default function Board() {
  const [companies, setCompanies] = useState<PipelineCompany[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const load = useCallback(async () => {
    const res = await fetch("/api/pipeline");
    if (!res.ok) {
      setCompanies([]);
      setError(true);
      setLoading(false);
      return;
    }
    setError(false);
    const data = await res.json();
    setCompanies(data.companies);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const [pending, setPending] = useState<Set<string>>(new Set());

  const decide = useCallback(
    async (slug: string, accept: boolean) => {
      setPending((p) => new Set(p).add(slug));
      try {
        await fetch("/api/pipeline", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ slug, patch: { status: accept ? "researching" : "rejected" } }),
        });
        await load();
      } finally {
        setPending((p) => {
          const next = new Set(p);
          next.delete(slug);
          return next;
        });
      }
    },
    [load]
  );

  const visible = useMemo(
    () => companies.filter((c) => matchesFilters(c, filters)),
    [companies, filters]
  );

  const counts = useMemo(
    () =>
      Object.fromEntries(
        TABS.map((t) => [t.key, visible.filter((c) => t.groups.some((g) => inGroup(c, g))).length])
      ) as Record<string, number>,
    [visible]
  );

  const countryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of companies)
      if (c.hiring.countries !== "worldwide") c.hiring.countries.forEach((cc) => set.add(cc));
    return [...set].sort();
  }, [companies]);

  const filtering = filters.country !== "any" || filters.hideUsAuth || filters.minUsd > 0;

  // Default to the first tab that has work in it.
  const currentKey = tab ?? TABS.find((t) => counts[t.key] > 0)?.key ?? TABS[0].key;
  const current = TABS.find((t) => t.key === currentKey) ?? TABS[0];

  return (
    <main className="min-h-screen bg-[#050505] px-8 py-10 text-white">
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl font-medium tracking-tight">Pipeline</h1>
        <span className="font-mono text-[11px] tabular-nums text-white/30">{companies.length}</span>
      </div>
      {error && (
        <p className="mt-4 font-mono text-xs text-white/40">couldn&apos;t load pipeline data</p>
      )}

      <div role="tablist" aria-label="Pipeline stages" className="mt-10 flex items-center gap-7 border-b border-white/[0.08]">
        {TABS.map((t) => {
          const selected = t.key === currentKey;
          const n = counts[t.key] ?? 0;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(t.key)}
              className={`relative -mb-px flex items-baseline gap-1.5 pb-3 text-[13px] tracking-tight transition-colors ${
                selected ? "text-white" : "text-white/35 hover:text-white/70"
              }`}
            >
              {t.label}
              <span className={`font-mono text-xs tabular-nums ${selected ? "text-white/60" : "text-white/25"}`}>
                {n}
              </span>
              {selected && <span className="absolute inset-x-0 bottom-0 h-px bg-white" />}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
        <select
          value={filters.country}
          onChange={(e) => setFilters({ ...filters, country: e.target.value as Filters["country"] })}
          className={`cursor-pointer appearance-none rounded-md bg-transparent px-2.5 py-1.5 outline-none transition-colors hover:bg-white/[0.05] ${
            filters.country !== "any" ? "text-white" : "text-white/40 hover:text-white/70"
          }`}
        >
          <option value="any">Hires from: anywhere</option>
          {countryOptions.map((cc) => (
            <option key={cc} value={cc}>
              Hires from: {cc}
            </option>
          ))}
        </select>
        <select
          value={filters.minUsd}
          onChange={(e) => setFilters({ ...filters, minUsd: Number(e.target.value) })}
          className={`cursor-pointer appearance-none rounded-md bg-transparent px-2.5 py-1.5 outline-none transition-colors hover:bg-white/[0.05] ${
            filters.minUsd > 0 ? "text-white" : "text-white/40 hover:text-white/70"
          }`}
        >
          <option value={0}>Salary: any</option>
          <option value={100000}>Salary: $100k+</option>
          <option value={150000}>Salary: $150k+</option>
          <option value={200000}>Salary: $200k+</option>
        </select>
        <button
          onClick={() => setFilters({ ...filters, hideUsAuth: !filters.hideUsAuth })}
          aria-pressed={filters.hideUsAuth}
          className={`rounded-md px-2.5 py-1.5 transition-colors hover:bg-white/[0.05] ${
            filters.hideUsAuth ? "text-white" : "text-white/40 hover:text-white/70"
          }`}
        >
          Hide US-auth
        </button>
        <span className="mx-1.5 h-3.5 w-px bg-white/10" />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className={`cursor-pointer appearance-none rounded-md bg-transparent px-2.5 py-1.5 outline-none transition-colors hover:bg-white/[0.05] ${
            sortKey !== "priority" ? "text-white" : "text-white/40 hover:text-white/70"
          }`}
        >
          <option value="priority">Sort: priority</option>
          <option value="posted">Sort: newest</option>
          <option value="salary">Sort: salary</option>
        </select>
        {filtering && (
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="rounded-md px-2.5 py-1.5 text-white/30 transition-colors hover:text-white"
          >
            clear
          </button>
        )}
      </div>

      <div key={currentKey} className="pipeline-fade-in mt-8 flex flex-col gap-10">
        {loading && <Loader />}
        {!loading && (counts[currentKey] ?? 0) === 0 && (
          <p className="font-mono text-xs text-white/35">Nothing in {current.label.toLowerCase()}</p>
        )}
        {!loading && current.groups.map((g) => {
          const list = visible
            .filter((c) => inGroup(c, g))
            .sort((a, b) => {
              if (sortKey === "posted") return postedSortKey(b) - postedSortKey(a) || a.company.localeCompare(b.company);
              if (sortKey === "salary") return salarySortKey(b) - salarySortKey(a) || a.company.localeCompare(b.company);
              return priorityRank(a) - priorityRank(b) || a.company.localeCompare(b.company);
            });
          if (list.length === 0) return null;
          return (
            <section key={g.title}>
              {current.groups.length > 1 && (
                <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-white/40">{g.title}</h2>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((c, i) => (
                  <div
                    key={c.slug}
                    className="pipeline-card-in"
                    style={i < 10 ? { animationDelay: `${i * 20}ms` } : undefined}
                  >
                  <CardShell slug={c.slug} clickable={c.status !== "proposed"}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        {c.logo?.path ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={c.logo.path} alt="" className="h-9 w-9 rounded-lg object-contain" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] font-mono text-xs text-white/35">
                            {c.company[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="truncate text-[15px] font-medium tracking-tight">{c.company}</div>
                          <div className="truncate text-xs text-white/40">{c.role}</div>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-baseline gap-2 pt-0.5 font-mono text-[11px]">
                        {["build", "pages_ready", "outreach"].includes(c.status) &&
                          (c.application?.questions.filter((q) => q.status === "pending").length ?? 0) > 0 && (
                            <span
                              title="Application questions awaiting answers (answer-drafter runs after copy approval)"
                              className="text-sky-300/70"
                            >
                              {c.application!.questions.filter((q) => q.status === "pending").length} answers
                            </span>
                          )}
                        {c.status === "proposed" && (c.tier ?? "match") === "longshot" && (
                          <span className="text-amber-400/60">longshot</span>
                        )}
                        {c.status === "proposed" && c.priority?.rank && (
                          <span
                            title={c.priority.reason}
                            className={`tabular-nums ${c.priority.rank <= 3 ? "text-white" : "text-white/35"}`}
                          >
                            {String(c.priority.rank).padStart(2, "0")}
                          </span>
                        )}
                        {c.status !== "proposed" && <StatusPill status={c.status} />}
                      </div>
                    </div>
                    <MetricsRow c={c} />
                    {c.status === "proposed" && (
                      <div className="mt-3.5 flex items-center gap-1 border-t border-white/[0.06] pt-3">
                        {pending.has(c.slug) ? (
                          <span className="inline-flex items-center gap-2 py-1 font-mono text-[11px] text-white/35">
                            <span className="h-3 w-3 animate-spin rounded-full border border-white/15 border-t-white/60" />
                            Saving
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => decide(c.slug, true)}
                              className="rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45 transition-[color,background-color,border-color,transform] hover:bg-emerald-400/10 hover:text-emerald-300 active:scale-[0.98]"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => decide(c.slug, false)}
                              className="rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/30 transition-[color,background-color,border-color,transform] hover:bg-red-400/10 hover:text-red-300 active:scale-[0.98]"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </CardShell>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
