"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import type { Token } from "./data";

interface TokenSelectorProps {
  tokens: Token[];
  selectedSymbol?: string;
  onSelect: (token: Token) => void;
  onClose: () => void;
}

export default function TokenSelector({
  tokens,
  selectedSymbol,
  onSelect,
  onClose,
}: TokenSelectorProps) {
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filtered[highlightIndex]) {
        onSelect(filtered[highlightIndex]);
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [filtered, highlightIndex, onSelect, onClose]
  );

  useEffect(() => {
    setHighlightIndex(0);
  }, [query]);

  return (
    <div className="absolute inset-0 bg-[#111827] z-20 flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <button
          onClick={onClose}
          className="py-1 px-3 rounded-full bg-[#1C2431] hover:bg-[#374151] transition-all cursor-pointer text-white/60 text-sm border-none"
        >
          &larr;
        </button>
        <h3 className="text-white text-sm font-medium">Select Token</h3>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by name or symbol..."
          className="w-full bg-[#1E2430] text-white text-sm rounded-lg p-2.5 px-3 border-none outline-none placeholder:text-white/30"
        />
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#1C2431]" />

      {/* Token List */}
      <div ref={listRef} className="flex-1 overflow-y-auto disable-scrollbars">
        {filtered.map((token, index) => {
          const isSelected = token.symbol === selectedSymbol;
          const isHighlighted = index === highlightIndex;

          return (
            <div
              key={`${token.symbol}-${token.contract}`}
              onClick={() => onSelect(token)}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#39C6C8]/20"
                  : isHighlighted
                    ? "bg-[#1E2430]"
                    : "hover:bg-[#1E2430]"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#374151] overflow-hidden flex-shrink-0">
                <div
                  className="w-full h-full rounded-full bg-gradient-to-br from-[#374151] to-[#1E2430] flex items-center justify-center text-xs text-white/40"
                  style={{
                    backgroundImage: token.image ? `url(${token.image})` : undefined,
                    backgroundSize: "cover",
                  }}
                >
                  {!token.image && token.symbol[0]}
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-white text-sm">{token.symbol}</p>
                <p className="text-[#99A4B8] text-xs">{token.name}</p>
              </div>
              <div className="flex-1" />
              <div className="flex flex-col items-end gap-0.5">
                <p className="text-white text-sm">
                  {Number(token.balance.toFixed(4))}
                </p>
                <p className="text-[#99A4B8] text-xs">
                  ${(token.balance * token.unitValueUsd).toFixed(2)}
                </p>
              </div>
              {isSelected && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A3E2E3"
                  strokeWidth="3"
                  className="animate-scaleIn"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <p className="text-white/30 text-sm">No tokens found</p>
          </div>
        )}
      </div>
    </div>
  );
}
