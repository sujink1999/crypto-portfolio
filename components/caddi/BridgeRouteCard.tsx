"use client";

import React from "react";
import type { Route } from "./data";

interface BridgeRouteCardProps {
  route: Route;
  tokenOutSymbol: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function BridgeRouteCard({
  route,
  tokenOutSymbol,
  isSelected,
  onClick,
}: BridgeRouteCardProps) {
  const {
    bridgeName,
    bridgeImage,
    estimatedDuration,
    estimatedCostUSD,
    destinationAmount,
    numberOfTxs,
    securityScore,
    points,
  } = route;

  const timeStr = getBridgingTimeString(estimatedDuration);
  const stepsText = numberOfTxs
    ? `( ${numberOfTxs} tx${numberOfTxs > 1 ? "s" : ""} )`
    : "";

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border-solid bg-[#1E2430] transition-all rounded-lg flex flex-col border ${
        isSelected
          ? "border-[#A3E2E3]"
          : "border-[#1E2430] hover:border-[#A3E2E3]/70"
      }`}
    >
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center gap-2">
          <BridgeIcon src={bridgeImage} />
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-2 items-center pl-1">
              <p className="text-white text-sm">{bridgeName}</p>
              <SecurityScore score={securityScore} />
            </div>
            <p className="text-[#99A4B8] text-xs pl-1">
              {timeStr} {stepsText}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 pr-1 items-end">
          <p className="text-[#A3E2E3] text-right text-sm">
            {roundTo(destinationAmount, 6)} {capStr(tokenOutSymbol, 6)}
          </p>
          <div className="flex items-center gap-1">
            <GasIcon />
            <p className="text-[#99A4B8] text-xs">${roundTo(estimatedCostUSD, 2)}</p>
          </div>
        </div>
      </div>
      {points && (
        <div className="mx-1 border-transparent border-t border-solid border-t-white/10 p-1.5">
          <div className="flex items-center gap-1">
            <span className="text-[10px] animate-spin-slow">&#9733;</span>
            <p className="text-[10px] text-[#A3E2E3]/90">Potential airdrop</p>
          </div>
        </div>
      )}
    </div>
  );
}

function BridgeIcon({ src }: { src: string }) {
  return (
    <div className="w-9 h-9 rounded-full bg-[#374151] overflow-hidden flex-shrink-0">
      <div
        className="w-full h-full rounded-full bg-gradient-to-br from-[#374151] to-[#1E2430] flex items-center justify-center text-xs text-white/40"
        style={{
          backgroundImage: src ? `url(${src})` : undefined,
          backgroundSize: "cover",
        }}
      />
    </div>
  );
}

function SecurityScore({ score }: { score: number }) {
  const colors = ["#ff4444", "#ff8844", "#ffaa00", "#88cc44", "#44cc88"];
  const color = colors[Math.min(score - 1, 4)];

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill={i < score ? color : "#374151"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function GasIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#99A4B8" strokeWidth="2" strokeLinecap="round">
      <path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16M3 22h12M5 10h8M17 22V10a2 2 0 012-2h1a1 1 0 011 1v3" />
    </svg>
  );
}

function getBridgingTimeString(seconds: number): string {
  if (seconds < 60) return `~${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `~${minutes} min`;
}

function roundTo(num: number, decimals: number): string {
  return Number(num.toFixed(decimals)).toString();
}

function capStr(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) : str;
}
