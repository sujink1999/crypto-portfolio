"use client";

import React, { useEffect, useRef } from "react";

interface BridgeInputCardProps {
  isFrom?: boolean;
  chainName?: string;
  chainImage?: string;
  assetSymbol?: string;
  assetImage?: string;
  balance?: number;
  unitValueUsd?: number;
  amount: string;
  onChainClick: () => void;
  onAssetClick: () => void;
  onAmountChange: (val: string) => void;
  onMaxClick?: () => void;
  readOnly?: boolean;
}

export default function BridgeInputCard({
  isFrom,
  chainName,
  chainImage,
  assetSymbol,
  assetImage,
  balance,
  unitValueUsd,
  amount,
  onChainClick,
  onAssetClick,
  onAmountChange,
  onMaxClick,
  readOnly,
}: BridgeInputCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFrom) inputRef.current?.focus();
  }, [isFrom]);

  const balanceInUsd = (unitValueUsd || 0) * Number(amount || 0);
  const showBalanceInUsd = balanceInUsd > 0;

  return (
    <div className="flex flex-col w-full rounded-md bg-[#1E2430] p-2 gap-2 pb-1">
      {/* Top row: label, chain, balance, MAX */}
      <div className="flex items-center gap-2">
        <p
          onClick={onAssetClick}
          className="text-xs text-[#99A4B8] cursor-pointer"
        >
          {isFrom ? "From" : "To"}
        </p>
        {chainName && (
          <div
            className="flex gap-1 items-center cursor-pointer"
            onClick={onChainClick}
          >
            <ChainIcon src={chainImage} />
            <p className="text-white text-sm cursor-pointer hover:text-[#A3E2E3] transition-all">
              {chainName}
            </p>
          </div>
        )}
        <div className="flex-1" />
        {assetSymbol && balance !== undefined && (
          <div className="flex items-center gap-1">
            <p className="text-xs text-[#99A4B8] font-light">Bal:</p>
            <p className="text-white text-sm">{roundTo(balance, 4)}</p>
          </div>
        )}
        {isFrom && (
          <button
            onClick={onMaxClick}
            className="border-none cursor-pointer transition-all hover:bg-[#A3E2E3]/50 hover:text-white px-2 py-[2px] bg-[#A3E2E3]/10 rounded-full text-[#A3E2E3] text-[10px]"
          >
            MAX
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#A3E2E3]/10" />

      {/* Bottom row: token selector + amount input */}
      <div className="flex items-center gap-2 justify-between pr-2 pl-1 py-1 w-full">
        {!assetSymbol ? (
          <p
            onClick={onAssetClick}
            className="text-white cursor-pointer hover:text-[#A3E2E3] transition-all text-sm"
          >
            Select Token
          </p>
        ) : (
          <div
            className="flex gap-1.5 items-center cursor-pointer"
            onClick={onAssetClick}
          >
            <TokenIcon src={assetImage} />
            <p className="text-white cursor-pointer hover:text-[#A3E2E3] transition-all">
              {assetSymbol}
            </p>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[#99A4B8]"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        )}

        <div className="flex flex-col items-end gap-1">
          <input
            ref={inputRef}
            className="text-xl text-white font-light bg-transparent text-right border-none outline-none w-[140px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0"
            type="number"
            min="0"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            readOnly={readOnly}
          />
          <p
            className={`text-xs text-[#99A4B8] ${
              showBalanceInUsd ? "" : "invisible"
            }`}
          >
            ${roundTo(balanceInUsd, 2)}
          </p>
        </div>
      </div>
    </div>
  );
}

function ChainIcon({ src }: { src?: string }) {
  if (!src) return null;
  return (
    <div className="w-4 h-4 rounded-full bg-[#374151] overflow-hidden flex-shrink-0">
      <div
        className="w-full h-full rounded-full bg-[#374151] flex items-center justify-center text-[8px] text-white/60"
        style={{
          backgroundImage: src ? `url(${src})` : undefined,
          backgroundSize: "cover",
        }}
      />
    </div>
  );
}

function TokenIcon({ src }: { src?: string }) {
  return (
    <div className="w-5 h-5 rounded-full bg-[#374151] overflow-hidden flex-shrink-0">
      <div
        className="w-full h-full rounded-full bg-gradient-to-br from-[#374151] to-[#1E2430] flex items-center justify-center text-[10px] text-white/60"
        style={{
          backgroundImage: src ? `url(${src})` : undefined,
          backgroundSize: "cover",
        }}
      />
    </div>
  );
}

function roundTo(num: number, decimals: number): string {
  return Number(num.toFixed(decimals)).toString();
}
