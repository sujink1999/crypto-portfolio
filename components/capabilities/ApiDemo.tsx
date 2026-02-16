"use client";

import { useState, useCallback } from "react";

const endpoints = [
  {
    method: "GET",
    path: "/tokens",
    response: {
      status: 200,
      latency: 127,
      body: `{
  "tokens": [
    { "symbol": "BTC", "price": 97241.50 },
    { "symbol": "ETH", "price": 3412.80 },
    { "symbol": "SOL", "price": 187.65 }
  ],
  "timestamp": 1739712000
}`,
    },
  },
  {
    method: "POST",
    path: "/swap",
    response: {
      status: 200,
      latency: 342,
      body: `{
  "txHash": "0x3a9f...b2c1",
  "from": { "token": "ETH", "amount": 1.5 },
  "to": { "token": "SOL", "amount": 27.38 },
  "status": "confirmed"
}`,
    },
  },
  {
    method: "GET",
    path: "/portfolio",
    response: {
      status: 200,
      latency: 89,
      body: `{
  "total_value": "$142,891.20",
  "assets": 12,
  "pnl_24h": "+3.2%",
  "last_sync": "2s ago"
}`,
    },
  },
];

export default function ApiDemo() {
  const [activeEndpoint, setActiveEndpoint] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const handleClick = useCallback((index: number) => {
    setActiveEndpoint(index);
    setShowResponse(false);
    setLoading(true);

    const latency = endpoints[index].response.latency;
    setTimeout(() => {
      setLoading(false);
      setShowResponse(true);
    }, Math.min(latency, 400));
  }, []);

  const active = activeEndpoint !== null ? endpoints[activeEndpoint] : null;

  return (
    <div className="flex flex-col gap-2 h-[220px]">
      {/* Endpoint buttons */}
      <div className="flex gap-1.5 flex-wrap">
        {endpoints.map((ep, i) => (
          <button
            key={ep.path}
            onClick={() => handleClick(i)}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-mono transition-all duration-150 cursor-pointer border ${
              activeEndpoint === i
                ? "border-accent/30 bg-accent/10 text-accent"
                : "border-white/5 bg-white/[0.03] text-white/50 hover:text-white/70 hover:border-white/10"
            }`}
          >
            <span
              className={`text-[10px] font-bold ${
                ep.method === "POST" ? "text-amber-400/80" : "text-sky-400/80"
              }`}
            >
              {ep.method}
            </span>
            {ep.path}
          </button>
        ))}
      </div>

      {/* Terminal */}
      <div className="flex-1 rounded-xl bg-black/40 border border-white/5 p-3 font-mono text-[11px] overflow-y-auto">
        {!active && (
          <div className="text-white/20 flex items-center gap-2">
            <span className="text-accent/50">$</span> Click an endpoint to fire a request...
          </div>
        )}

        {active && (
          <div className="space-y-2">
            {/* Request line */}
            <div className="text-white/50">
              <span className="text-accent/50">$ </span>
              <span className="text-sky-400/70">curl</span>{" "}
              <span className="text-white/70">
                -X {active.method} /api{active.path}
              </span>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex items-center gap-2 text-white/30">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Sending request...
              </div>
            )}

            {/* Response */}
            {showResponse && (
              <div className="space-y-1.5 animate-[fadeIn_0.2s_ease-out]">
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-accent">
                    {active.response.status} OK
                  </span>
                  <span className="text-white/25">
                    {active.response.latency}ms
                  </span>
                </div>
                <pre className="text-white/60 leading-relaxed whitespace-pre-wrap">
                  {active.response.body}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
