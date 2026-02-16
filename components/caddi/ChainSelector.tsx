"use client";

import React from "react";
import type { Chain } from "./data";

interface ChainSelectorProps {
  chains: Chain[];
  selectedChainId: number;
  onSelect: (chain: Chain) => void;
  onClose: () => void;
}

export default function ChainSelector({
  chains,
  selectedChainId,
  onSelect,
  onClose,
}: ChainSelectorProps) {
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
        <h3 className="text-white text-sm font-medium">Select Chain</h3>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#1C2431]" />

      {/* Chain List */}
      <div className="flex-1 overflow-y-auto disable-scrollbars p-2">
        <div className="grid grid-cols-3 gap-2">
          {chains.map((chain) => {
            const isSelected = chain.id === selectedChainId;
            return (
              <button
                key={chain.id}
                onClick={() => onSelect(chain)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-[#A3E2E3]/10 border-[#A3E2E3]/50"
                    : "bg-[#1E2430] border-transparent hover:border-[#A3E2E3]/30"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#374151] overflow-hidden">
                  <div
                    className="w-full h-full rounded-full bg-gradient-to-br from-[#374151] to-[#1E2430] flex items-center justify-center text-sm text-white/40"
                    style={{
                      backgroundImage: chain.image ? `url(${chain.image})` : undefined,
                      backgroundSize: "cover",
                    }}
                  >
                    {!chain.image && chain.symbol[0]}
                  </div>
                </div>
                <p className={`text-xs ${isSelected ? "text-[#A3E2E3]" : "text-white/70"}`}>
                  {chain.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
