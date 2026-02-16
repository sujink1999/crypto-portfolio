import { RefObject } from "react";

export default function BrowserFrame({
  url,
  src,
  wrapRef,
  scale,
  iframeW,
  iframeH,
}: {
  url: string;
  src: string;
  wrapRef: RefObject<HTMLDivElement | null>;
  scale: number;
  iframeW: number;
  iframeH: number;
}) {
  return (
    <div className="border border-white/5 bg-[#1a1a1a] rounded-2xl overflow-hidden">
      {/* Browser chrome — rounded top only */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.04] border border-white/5">
          <svg className="w-3 h-3 text-white/20 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.1.9-2 2-2h2a2 2 0 012 2v0a2 2 0 01-2 2h-2a2 2 0 00-2 2v0a2 2 0 002 2h2a2 2 0 002-2M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
          </svg>
          <span className="font-mono text-[11px] text-white/30 truncate">{url}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/5">
            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/5">
            <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
      {/* Iframe — 16:9 aspect ratio, scaled to fit */}
      <div
        ref={wrapRef}
        className="relative w-full"
        style={{ aspectRatio: "16 / 9" }}
      >
        <iframe
          src={src}
          title={`${url} preview`}
          className="absolute top-0 left-0"
          style={{
            width: iframeW,
            height: iframeW * (9 / 16),
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
