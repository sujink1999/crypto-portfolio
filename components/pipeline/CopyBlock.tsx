"use client";
import { useState } from "react";

export default function CopyBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">{label}</span>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded-md border border-white/15 px-2.5 py-1 font-mono text-xs text-white/60 hover:border-white/40 hover:text-white"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">{text}</p>
    </div>
  );
}
