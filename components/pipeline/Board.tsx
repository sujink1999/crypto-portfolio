"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { PipelineCompany } from "@/lib/pipeline/types";
import StatusPill from "./StatusPill";

const GROUPS: { title: string; statuses: PipelineCompany["status"][] }[] = [
  { title: "Proposed", statuses: ["proposed"] },
  { title: "In research", statuses: ["researching"] },
  { title: "Awaiting your review", statuses: ["page_draft", "app_text", "notes", "pages_ready"] },
  { title: "Approved, building", statuses: ["page_approved", "build"] },
  { title: "Applied", statuses: ["applied"] },
  { title: "Rejected", statuses: ["rejected"] },
];

export default function Board() {
  const [companies, setCompanies] = useState<PipelineCompany[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/pipeline");
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
      <div className="mt-8 flex flex-col gap-10">
        {GROUPS.map((g) => {
          const list = companies.filter((c) => g.statuses.includes(c.status));
          if (list.length === 0) return null;
          return (
            <section key={g.title}>
              <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-white/40">{g.title}</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((c) => (
                  <div key={c.slug} className="rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
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
                      <StatusPill status={c.status} />
                      {c.status === "proposed" ? (
                        <div className="flex gap-2">
                          <button onClick={() => decide(c.slug, true)} className="rounded-md border border-white/25 px-2.5 py-1 text-xs hover:bg-white hover:text-black">Accept</button>
                          <button onClick={() => decide(c.slug, false)} className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-white/50 hover:border-white/25">Reject</button>
                        </div>
                      ) : (
                        <Link href={`/pipeline/${c.slug}`} className="font-mono text-xs text-white/50 hover:text-white">open</Link>
                      )}
                    </div>
                    {c.status === "proposed" && c.research?.summary && (
                      <p className="mt-3 text-xs leading-relaxed text-white/50">{c.research.summary}</p>
                    )}
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
