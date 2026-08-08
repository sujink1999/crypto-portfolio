export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-32">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <circle cx="22" cy="22" r="20" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle
          cx="22"
          cy="22"
          r="20"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="26 100"
          className="pipeline-loader-arc"
        />
        <circle cx="22" cy="22" r="2" fill="rgba(255,255,255,0.25)" />
      </svg>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25">Loading</p>
    </div>
  );
}
