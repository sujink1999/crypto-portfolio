"use client";

import { useState } from "react";

const tokens = [
  { symbol: "BTC", name: "Bitcoin", price: "97,241.50", change: "+2.4%", positive: true, sparkline: [40, 42, 38, 45, 43, 48, 50, 47, 52, 55] },
  { symbol: "ETH", name: "Ethereum", price: "3,412.80", change: "+1.8%", positive: true, sparkline: [30, 32, 28, 35, 33, 31, 36, 38, 35, 37] },
  { symbol: "SOL", name: "Solana", price: "187.65", change: "-0.9%", positive: false, sparkline: [50, 48, 52, 45, 47, 43, 40, 42, 38, 41] },
  { symbol: "AVAX", name: "Avalanche", price: "42.18", change: "+3.1%", positive: true, sparkline: [20, 22, 25, 23, 28, 30, 27, 32, 35, 33] },
  { symbol: "DOT", name: "Polkadot", price: "8.92", change: "-1.2%", positive: false, sparkline: [35, 33, 30, 32, 28, 30, 27, 25, 28, 26] },
];

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 30;
  const w = 80;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#4ade80" : "#f87171"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TokenIcon({ symbol }: { symbol: string }) {
  const icons: Record<string, React.ReactNode> = {
    BTC: (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <circle cx="16" cy="16" r="16" fill="#f7931a" />
        <path
          d="M22.5 14.2c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.7-.4-.7 2.6c-.4-.1-.9-.2-1.4-.3l.7-2.7-1.7-.4-.7 2.7c-.4-.1-.7-.2-1-.2l-2.3-.6-.4 1.8s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.3c0 0 .1 0 .2.1h-.2l-1.2 4.7c-.1.2-.3.6-.8.4 0 0-1.2-.3-1.2-.3l-.8 1.9 2.2.5c.4.1.8.2 1.2.3l-.7 2.8 1.7.4.7-2.7c.5.1.9.2 1.4.3l-.7 2.7 1.7.4.7-2.8c2.9.5 5.1.3 6-2.3.7-2.1 0-3.3-1.5-4.1 1.1-.3 1.9-1 2.1-2.5zm-3.8 5.3c-.5 2.1-4.1 1-5.3.7l.9-3.8c1.2.3 4.9.9 4.4 3.1zm.5-5.3c-.5 1.9-3.5.9-4.4.7l.8-3.4c1 .2 4.1.7 3.6 2.7z"
          fill="white"
        />
      </svg>
    ),
    ETH: (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <circle cx="16" cy="16" r="16" fill="#627eea" />
        <path d="M16.5 4v8.9l7.5 3.3L16.5 4z" fill="white" fillOpacity="0.6" />
        <path d="M16.5 4L9 16.2l7.5-3.3V4z" fill="white" />
        <path d="M16.5 21.9v6.1l7.5-10.4-7.5 4.3z" fill="white" fillOpacity="0.6" />
        <path d="M16.5 28v-6.1L9 17.6l7.5 10.4z" fill="white" />
        <path d="M16.5 20.6l7.5-4.4-7.5-3.3v7.7z" fill="white" fillOpacity="0.2" />
        <path d="M9 16.2l7.5 4.4v-7.7L9 16.2z" fill="white" fillOpacity="0.6" />
      </svg>
    ),
    SOL: (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <circle cx="16" cy="16" r="16" fill="#000" />
        <defs>
          <linearGradient id="sol-g" x1="6" y1="24" x2="26" y2="8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9945ff" />
            <stop offset="0.5" stopColor="#19fb9b" />
            <stop offset="1" stopColor="#00d1ff" />
          </linearGradient>
        </defs>
        <path d="M9 20.5l2-2.1c.2-.2.4-.3.7-.3h13.1c.3 0 .5.4.3.6l-2 2.1c-.2.2-.4.3-.7.3H9.3c-.3 0-.5-.4-.3-.6z" fill="url(#sol-g)" />
        <path d="M9 11.2l2-2.1c.2-.2.4-.3.7-.3h13.1c.3 0 .5.4.3.6l-2 2.1c-.2.2-.4.3-.7.3H9.3c-.3 0-.5-.4-.3-.6z" fill="url(#sol-g)" />
        <path d="M23 15.8l-2-2.1c-.2-.2-.4-.3-.7-.3H7.2c-.3 0-.5.4-.3.6l2 2.1c.2.2.4.3.7.3h13.1c.3 0 .5-.4.3-.6z" fill="url(#sol-g)" />
      </svg>
    ),
    AVAX: (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <circle cx="16" cy="16" r="16" fill="#e84142" />
        <path
          d="M11.3 21.5h-3c-.5 0-.7-.3-.5-.7l7.7-13.3c.3-.5.8-.5 1 0l1.8 3.1c.2.4.2.8 0 1.2l-5.9 9.2c-.2.3-.6.5-1.1.5zm9.8 0h-3.4c-.5 0-.7-.3-.5-.7l3.4-5.9c.3-.5.8-.5 1 0l1.7 3c.2.3.2.7 0 1l-1.2 2.1c-.2.3-.6.5-1 .5z"
          fill="white"
        />
      </svg>
    ),
    DOT: (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <circle cx="16" cy="16" r="16" fill="#e6007a" />
        <circle cx="16" cy="8.5" r="3" fill="white" />
        <circle cx="16" cy="23.5" r="3" fill="white" />
        <ellipse cx="16" cy="16" rx="5.5" ry="8.5" fill="none" stroke="white" strokeWidth="2" />
      </svg>
    ),
  };
  return <div className="shrink-0">{icons[symbol]}</div>;
}

export default function TokenListDemo() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2 h-[220px]">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search tokens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg bg-white/[0.04] border border-white/5 py-2 pl-8 pr-3 text-xs text-white/80 placeholder:text-white/25 outline-none focus:border-accent/30 transition-colors"
        />
      </div>

      {/* Token list */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {filtered.length === 0 && (
          <div className="text-[11px] text-white/25 text-center py-6 font-mono">No tokens found</div>
        )}
        {filtered.map((token) => (
          <div key={token.symbol}>
            <button
              onClick={() => setExpanded(expanded === token.symbol ? null : token.symbol)}
              className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-200 cursor-pointer ${
                expanded === token.symbol ? "bg-white/[0.04]" : "hover:bg-white/[0.03]"
              }`}
            >
              <TokenIcon symbol={token.symbol} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-white/90">{token.symbol}</span>
                  <span className="text-[10px] text-white/30">{token.name}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-mono text-white/80">${token.price}</div>
                <div
                  className={`text-[10px] font-mono ${
                    token.positive ? "text-accent" : "text-red-400"
                  }`}
                >
                  {token.change}
                </div>
              </div>
            </button>

            {/* Expanded detail */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                expanded === token.symbol ? "max-h-[60px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex items-center justify-between px-3 py-2 ml-9">
                <Sparkline data={token.sparkline} positive={token.positive} />
                <div className="text-[10px] font-mono text-white/40">24h</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
