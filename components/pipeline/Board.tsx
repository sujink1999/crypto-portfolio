"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { PipelineCompany } from "@/lib/pipeline/types";
import StatusPill from "./StatusPill";

function postedLabel(postedAt?: string): string {
  if (!postedAt) return "?";
  const t = Date.parse(postedAt);
  if (Number.isNaN(t)) return postedAt; // non-date strings pass through
  const days = Math.floor((Date.now() - t) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const GROUPS: {
  title: string;
  statuses: PipelineCompany["status"][];
  tier?: "match" | "longshot";
}[] = [
  { title: "Proposed: matches", statuses: ["proposed"], tier: "match" },
  { title: "Proposed: longshots", statuses: ["proposed"], tier: "longshot" },
  { title: "In research", statuses: ["researching"] },
  { title: "Awaiting your review", statuses: ["page_draft", "app_text", "notes", "pages_ready", "outreach"] },
  { title: "Approved, building", statuses: ["page_approved", "build"] },
  { title: "Applied", statuses: ["applied"] },
  { title: "Rejected", statuses: ["rejected"] },
];

function CardShell({
  slug,
  clickable,
  children,
}: {
  slug: string;
  clickable: boolean;
  children: React.ReactNode;
}) {
  const cls = "block rounded-xl border border-white/10 bg-[#0d0d0d] p-4";
  if (!clickable) return <div className={cls}>{children}</div>;
  return (
    <Link href={`/pipeline/${slug}`} className={`${cls} transition-colors hover:border-white/25`}>
      {children}
    </Link>
  );
}

export default function Board() {
  const [companies, setCompanies] = useState<PipelineCompany[]>([]);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/pipeline");
    if (!res.ok) {
      setCompanies([]);
      setError(true);
      return;
    }
    setError(false);
    const data = await res.json();
    setCompanies(data.companies);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const decide = useCallback(
    async (slug: string, accept: boolean) => {
      await fetch("/api/pipeline", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, patch: { status: accept ? "researching" : "rejected" } }),
      });
      load();
    },
    [load]
  );

  return (
    <main className="min-h-screen bg-[#050505] px-8 py-10 text-white">
      <h1 className="text-xl font-medium tracking-tight">Pipeline</h1>
      <p className="mt-1 font-mono text-xs text-white/40">{companies.length} companies</p>
      {error && (
        <p className="mt-4 font-mono text-xs text-white/40">couldn&apos;t load pipeline data</p>
      )}
      <div className="mt-8 flex flex-col gap-10">
        {GROUPS.map((g) => {
          const list = companies.filter(
            (c) =>
              g.statuses.includes(c.status) &&
              (g.tier === undefined || (c.tier ?? "match") === g.tier)
          );
          if (list.length === 0) return null;
          return (
            <section key={g.title}>
              <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-white/40">{g.title}</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((c) => (
                  <CardShell key={c.slug} slug={c.slug} clickable={c.status !== "proposed"}>
                    <div className="flex items-center gap-3">
                      {c.logo?.path ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={c.logo.path} alt="" className="h-8 w-8 rounded-md object-contain" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 font-mono text-xs text-white/40">
                          {c.company[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="truncate font-medium">{c.company}</div>
                        <div className="truncate text-xs text-white/50">{c.role}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <StatusPill status={c.status} />
                        {c.status === "proposed" && (
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wide ${
                              (c.tier ?? "match") === "match"
                                ? "border-emerald-400/50 text-emerald-400"
                                : "border-amber-400/30 text-amber-400/70"
                            }`}
                          >
                            {(c.tier ?? "match") === "match" ? "match" : "longshot"}
                          </span>
                        )}
                      </div>
                      {c.status === "proposed" && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => decide(c.slug, true)} className="rounded-md border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300 hover:bg-emerald-400 hover:text-black">Accept</button>
                          <button onClick={() => decide(c.slug, false)} className="rounded-md border border-red-400/30 bg-red-400/10 px-2.5 py-1 text-xs text-red-300/80 hover:bg-red-400 hover:text-black">Reject</button>
                        </div>
                      )}
                    </div>
                    {c.status === "proposed" && (
                      <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-[11px]">
                        <span className="text-white/35">salary</span>
                        <span className="text-white">{c.salary ?? "not listed"}</span>
                        <span className="text-white/35">location</span>
                        <span className="text-white/70">{c.location ?? "?"}</span>
                        <span className="text-white/35">remote</span>
                        <span className="text-white/70">{c.locationPreference ?? "?"}</span>
                        <span className="text-white/35">posted</span>
                        <span className="text-white/70">{postedLabel(c.postedAt)}</span>
                        {c.jdUrl && (
                          <>
                            <span className="text-white/35">posting</span>
                            <a href={c.jdUrl} target="_blank" rel="noreferrer" className="truncate text-white/70 underline decoration-white/25 hover:text-white">
                              {new URL(c.jdUrl).hostname.replace("www.", "")}
                            </a>
                          </>
                        )}
                      </div>
                    )}
                  </CardShell>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
