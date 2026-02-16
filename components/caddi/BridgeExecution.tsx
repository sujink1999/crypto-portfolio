"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import type { Chain, Token, Route, ExecutionStep } from "./data";
import BridgeGolfAnimation from "./BridgeGolfAnimation";

interface BridgeExecutionProps {
  sourceChain: Chain;
  destChain: Chain;
  sourceToken: Token;
  destToken: Token;
  sourceAmount: string;
  destAmount: string;
  route: Route;
  steps: ExecutionStep[];
  onBack: () => void;
}

export default function BridgeExecution({
  sourceChain,
  destChain,
  sourceToken,
  destToken,
  sourceAmount,
  destAmount,
  route,
  steps: initialSteps,
  onBack,
}: BridgeExecutionProps) {
  const [steps, setSteps] = useState<ExecutionStep[]>(initialSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const startTimestamp = useRef<number | null>(null);

  const simulateExecution = useCallback(() => {
    let stepIdx = 0;

    const runStep = () => {
      if (stepIdx >= steps.length) {
        setIsComplete(true);
        setTimeout(() => setShowSuccess(true), 400);
        return;
      }

      // Mark current step as in_progress
      setSteps((prev) =>
        prev.map((s, i) => (i === stepIdx ? { ...s, status: "in_progress" } : s))
      );
      setCurrentStepIndex(stepIdx);

      // After delay, mark as completed and move to next
      const delay = steps[stepIdx].type === "wait" ? 3000 : 1500 + Math.random() * 1000;
      setTimeout(() => {
        const fakeHash = `0x${Array.from({ length: 8 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("")}...`;

        setSteps((prev) =>
          prev.map((s, i) =>
            i === stepIdx ? { ...s, status: "completed", txHash: fakeHash } : s
          )
        );
        stepIdx++;
        runStep();
      }, delay);
    };

    runStep();
  }, [steps.length]);

  useEffect(() => {
    startTimestamp.current = Date.now();
    const timer = setTimeout(simulateExecution, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col justify-center p-3 gap-3 transition-all">
        {/* Asset Cards */}
        <div className="flex flex-col gap-2">
          <div className="flex w-full gap-3 relative">
            <AssetCard
              chainName={sourceChain.name}
              chainImage={sourceChain.image}
              assetSymbol={sourceToken.symbol}
              assetImage={sourceToken.image}
              amount={sourceAmount}
            />
            <AssetCard
              chainName={destChain.name}
              chainImage={destChain.image}
              assetSymbol={destToken.symbol}
              assetImage={destToken.image}
              amount={destAmount}
            />
            {/* Arrow between cards */}
            <div className="w-7 h-7 rounded-full bg-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C2431" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Via badge */}
          {route && (
            <div className="bg-[#1E2430] rounded-md flex items-center self-start py-1.5 px-3 gap-1.5">
              <p className="text-xs text-[#99A4B8] mr-1">via</p>
              <div className="w-[18px] h-[18px] rounded-full bg-[#374151] overflow-hidden flex-shrink-0">
                <div
                  className="w-full h-full rounded-full bg-gradient-to-br from-[#374151] to-[#1E2430]"
                  style={{
                    backgroundImage: route.bridgeImage ? `url(${route.bridgeImage})` : undefined,
                    backgroundSize: "cover",
                  }}
                />
              </div>
              <p className="text-[13px] text-white">{route.bridgeName}</p>
            </div>
          )}
        </div>

        {/* Execution Steps or Success */}
        <div className="min-h-[200px] flex flex-col">
          {showSuccess ? (
            <SuccessView onBack={onBack} />
          ) : (
            <div className="flex flex-col gap-2 items-start">
              <div className="p-3 py-4 bg-[#1E2430] rounded-md flex flex-col gap-3 w-full">
                {steps.map((step, index) => (
                  <StepRow
                    key={index}
                    step={step}
                    index={index}
                    isActive={index === currentStepIndex && !isComplete}
                  />
                ))}
              </div>

              <div className="flex gap-2 w-full mt-1">
                <button
                  onClick={onBack}
                  className="justify-center flex-1 py-2 px-4 text-sm rounded-md font-medium cursor-pointer flex items-center gap-2 bg-[#A3E2E3]/25 text-[#A3E2E3] hover:bg-[#A3E2E3]/40 hover:text-white transition-all border-none"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to routes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Golf Animation at bottom */}
      {!showSuccess && (
        <BridgeGolfAnimation
          startTimestamp={startTimestamp.current}
          totalTime={route?.estimatedDuration || 120}
          isCompleted={isComplete}
          assetImage={sourceToken.image}
        />
      )}
    </div>
  );
}

function AssetCard({
  chainName,
  chainImage,
  assetSymbol,
  assetImage,
  amount,
}: {
  chainName: string;
  chainImage: string;
  assetSymbol: string;
  assetImage: string;
  amount: string;
}) {
  return (
    <div className="flex-1 bg-[#1E2430] rounded-md p-3 flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full bg-[#374151] overflow-hidden flex-shrink-0">
          <div
            className="w-full h-full rounded-full"
            style={{
              backgroundImage: chainImage ? `url(${chainImage})` : undefined,
              backgroundSize: "cover",
            }}
          />
        </div>
        <p className="text-[#99A4B8] text-xs">{chainName}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#374151] overflow-hidden flex-shrink-0">
          <div
            className="w-full h-full rounded-full bg-gradient-to-br from-[#374151] to-[#1E2430]"
            style={{
              backgroundImage: assetImage ? `url(${assetImage})` : undefined,
              backgroundSize: "cover",
            }}
          />
        </div>
        <div>
          <p className="text-white text-sm font-medium">{amount}</p>
          <p className="text-[#99A4B8] text-xs">{assetSymbol}</p>
        </div>
      </div>
    </div>
  );
}

function StepRow({
  step,
  index,
  isActive,
}: {
  step: ExecutionStep;
  index: number;
  isActive: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <StepIndicator status={step.status} isActive={isActive} />
      <div className="flex flex-col gap-0.5 flex-1">
        <p
          className={`text-sm ${
            step.status === "completed"
              ? "text-[#A3E2E3]"
              : step.status === "in_progress"
                ? "text-white"
                : "text-[#99A4B8]"
          }`}
        >
          {step.description}
        </p>
        {step.txHash && (
          <p className="text-xs text-[#99A4B8]/60">{step.txHash}</p>
        )}
      </div>
      {step.status === "completed" && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#A3E2E3"
          strokeWidth="3"
          className="animate-scaleIn flex-shrink-0"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )}
    </div>
  );
}

function StepIndicator({
  status,
  isActive,
}: {
  status: string;
  isActive: boolean;
}) {
  if (status === "completed") {
    return (
      <div className="w-6 h-6 rounded-full bg-[#A3E2E3]/20 flex items-center justify-center flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-[#A3E2E3]" />
      </div>
    );
  }

  if (status === "in_progress" || isActive) {
    return (
      <div className="w-6 h-6 rounded-full border-2 border-[#A3E2E3] border-b-transparent animate-spin flex-shrink-0" />
    );
  }

  return (
    <div className="w-6 h-6 rounded-full bg-[#374151]/50 flex items-center justify-center flex-shrink-0">
      <div className="w-2 h-2 rounded-full bg-[#99A4B8]/30" />
    </div>
  );
}

function SuccessView({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6 animate-fadeIn">
      {/* Success icon */}
      <div className="w-16 h-16 rounded-full bg-[#A3E2E3]/15 flex items-center justify-center caddi-glow">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#A3E2E3"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-white font-medium">
          Bridge Successful!
        </p>
        <p className="text-[#99A4B8] text-sm text-center max-w-[250px]">
          Your transaction has been completed successfully
        </p>
      </div>

      <div className="flex gap-2 w-full mt-2">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 px-4 text-sm rounded-lg font-medium cursor-pointer bg-[#A3E2E3] text-[#111827] hover:bg-[#A3E2E3]/80 transition-all border-none"
        >
          New Bridge
        </button>
      </div>
    </div>
  );
}
