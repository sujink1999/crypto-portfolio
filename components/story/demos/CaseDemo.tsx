"use client";

import { useState } from "react";
import CaseHost, { CASE_IDS } from "../CaseHost";

/** Lab gallery: one button per project → its full-screen case. */
export default function CaseDemo() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-6">
        {CASE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setOpen(id)}
            className="border border-white/15 px-6 py-3 font-mono text-[11px] tracking-[0.25em] uppercase text-white/50 transition-colors hover:border-white/40 hover:text-white"
          >
            {id}
          </button>
        ))}
      </div>
      {open && <CaseHost id={open} onClose={() => setOpen(null)} />}
    </>
  );
}
