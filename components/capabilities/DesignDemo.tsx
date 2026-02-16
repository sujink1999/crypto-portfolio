"use client";

import { useState } from "react";

const layers = [
  { id: "frame", label: "Frame", depth: 0, type: "frame" },
  { id: "header", label: "Header", depth: 1, type: "frame" },
  { id: "avatar", label: "Avatar", depth: 2, type: "shape" },
  { id: "title", label: "Title", depth: 2, type: "text" },
  { id: "subtitle", label: "Subtitle", depth: 2, type: "text" },
  { id: "body", label: "Body", depth: 1, type: "frame" },
  { id: "description", label: "Description", depth: 2, type: "text" },
  { id: "button", label: "CTA Button", depth: 2, type: "shape" },
];

function LayerIcon({ type }: { type: string }) {
  if (type === "frame")
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect
          x="1"
          y="1"
          width="12"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  if (type === "text")
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 3h8M7 3v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function DesignDemo() {
  const [selected, setSelected] = useState<string | null>("avatar");

  return (
    <div className="flex flex-col sm:flex-row gap-3 h-auto sm:h-[220px]">
      {/* Mockup preview */}
      <div className="flex-1 rounded-xl bg-white/[0.03] border border-white/5 p-3 flex flex-col gap-2">
        <div className="text-[10px] font-mono text-white/30 mb-1">Preview</div>
        <div
          className={`flex items-center gap-2 rounded-lg p-2 transition-all duration-200 ${
            selected === "header" ? "ring-1 ring-accent/50 bg-accent/5" : ""
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-br from-accent/40 to-accent/10 shrink-0 transition-all duration-200 ${
              selected === "avatar" ? "ring-2 ring-accent shadow-[0_0_12px_rgba(74,222,128,0.3)]" : ""
            }`}
          />
          <div className="flex flex-col gap-0.5 min-w-0">
            <div
              className={`h-3 w-20 rounded-sm bg-white/20 transition-all duration-200 ${
                selected === "title" ? "bg-accent/40 shadow-[0_0_8px_rgba(74,222,128,0.2)]" : ""
              }`}
            />
            <div
              className={`h-2 w-14 rounded-sm bg-white/10 transition-all duration-200 ${
                selected === "subtitle" ? "bg-accent/40 shadow-[0_0_8px_rgba(74,222,128,0.2)]" : ""
              }`}
            />
          </div>
        </div>

        <div
          className={`rounded-lg p-2 transition-all duration-200 ${
            selected === "body" ? "ring-1 ring-accent/50 bg-accent/5" : ""
          }`}
        >
          <div
            className={`space-y-1 transition-all duration-200 ${
              selected === "description" ? "bg-accent/5 rounded p-1" : ""
            }`}
          >
            <div className={`h-2 w-full rounded-sm transition-all duration-200 ${selected === "description" ? "bg-accent/30" : "bg-white/10"}`} />
            <div className={`h-2 w-3/4 rounded-sm transition-all duration-200 ${selected === "description" ? "bg-accent/30" : "bg-white/10"}`} />
            <div className={`h-2 w-1/2 rounded-sm transition-all duration-200 ${selected === "description" ? "bg-accent/30" : "bg-white/10"}`} />
          </div>
          <div
            className={`mt-3 h-7 w-20 rounded-md transition-all duration-200 ${
              selected === "button"
                ? "bg-accent/40 shadow-[0_0_12px_rgba(74,222,128,0.3)]"
                : "bg-white/10"
            }`}
          />
        </div>

        <div
          className={`flex-1 rounded-lg border border-dashed transition-all duration-200 ${
            selected === "frame" ? "border-accent/40 bg-accent/5" : "border-white/5"
          }`}
        />
      </div>

      {/* Layer panel */}
      <div className="w-full sm:w-[170px] shrink-0 rounded-xl bg-white/[0.03] border border-white/5 p-3 overflow-y-auto">
        <div className="text-[10px] font-mono text-white/30 mb-2">Layers</div>
        <div className="flex flex-row flex-wrap sm:flex-col gap-0.5">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setSelected(layer.id === selected ? null : layer.id)}
              className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[11px] transition-all duration-150 cursor-pointer ${
                selected === layer.id
                  ? "bg-accent/15 text-accent"
                  : "text-white/50 hover:text-white/70 hover:bg-white/5"
              }`}
              style={{ paddingLeft: `${layer.depth * 12 + 6}px` }}
            >
              <LayerIcon type={layer.type} />
              <span className="font-mono truncate">{layer.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
