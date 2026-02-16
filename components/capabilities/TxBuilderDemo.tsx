"use client";

import { useState, useCallback } from "react";

function MetaMaskIcon({ size = 28 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/metamask-icon.png"
      alt="MetaMask"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}

function WalletConnectIcon({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size}>
      <circle cx="16" cy="16" r="16" fill="#3b99fc" />
      <path
        d="M10.2 13.2c3.2-3.1 8.4-3.1 11.6 0l.4.4c.2.1.2.4 0 .5l-1.3 1.2c-.1.1-.2.1-.3 0l-.5-.5c-2.2-2.2-5.8-2.2-8.1 0l-.6.5c-.1.1-.2.1-.3 0l-1.3-1.2c-.2-.2-.2-.4 0-.5l.4-.4zm14.3 2.7l1.1 1.1c.2.2.2.4 0 .5l-5.2 5.1c-.2.1-.4.1-.6 0l-3.7-3.6c0 0-.1 0-.1 0l-3.7 3.6c-.2.1-.4.1-.6 0l-5.2-5.1c-.2-.2-.2-.4 0-.5l1.1-1.1c.2-.2.4-.2.6 0l3.7 3.6c0 0 .1 0 .1 0l3.7-3.6c.2-.2.4-.2.6 0l3.7 3.6c0 0 .1 0 .1 0l3.7-3.6c.2-.1.5-.1.7 0z"
        fill="white"
      />
    </svg>
  );
}

function PhantomIcon({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 1200 1200" width={size} height={size}>
      <rect width="1200" height="1200" rx="240" fill="#9886E5" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M516.641 777.604C466.226 854.856 381.747 952.618 269.335 952.618C216.194 952.618 165.098 930.741 165.098 835.714C165.098 593.704 495.521 219.066 802.1 219.066C976.509 219.066 1046 340.071 1046 477.484C1046 653.865 931.544 855.54 817.77 855.54C781.661 855.54 763.948 835.714 763.948 804.267C763.948 796.063 765.311 787.175 768.036 777.604C729.202 843.918 654.261 905.446 584.089 905.446C532.992 905.446 507.103 873.315 507.103 828.194C507.103 811.787 510.51 794.696 516.641 777.604ZM930.877 472.714C930.877 512.755 907.253 532.776 880.826 532.776C853.998 532.776 830.775 512.755 830.775 472.714C830.775 432.673 853.998 412.653 880.826 412.653C907.253 412.653 930.877 432.673 930.877 472.714ZM780.73 472.714C780.73 512.755 757.105 532.776 730.678 532.776C703.851 532.776 680.627 512.755 680.627 472.714C680.627 432.673 703.851 412.653 730.678 412.653C757.105 412.653 780.73 432.673 780.73 472.714Z"
        fill="#FFFDF8"
      />
    </svg>
  );
}

function WalletIcon({ id, size = 28 }: { id: string; size?: number }) {
  if (id === "metamask") return <MetaMaskIcon size={size} />;
  if (id === "walletconnect") return <WalletConnectIcon size={size} />;
  if (id === "phantom") return <PhantomIcon size={size} />;
  return null;
}

type Phase = "disconnected" | "connecting" | "connected" | "building" | "done";
type TxStep = "from" | "to" | "selector" | "calldata" | "gas" | "sign" | "broadcast" | "confirmed";

const txSteps: { key: TxStep; label: string; value: string; accent?: boolean }[] = [
  { key: "from", label: "from", value: "0x1a2b...3c4d" },
  { key: "to", label: "to", value: "0x7a25...UniswapRouter" },
  { key: "selector", label: "function", value: "swapExactTokens()" },
  { key: "calldata", label: "calldata", value: "0xa9059cbb...0de0b6b3a7640000" },
  { key: "gas", label: "gas", value: "~142,000 units @ 24 gwei" },
  { key: "sign", label: "signing", value: "ECDSA secp256k1..." },
  { key: "broadcast", label: "broadcast", value: "propagating to network..." },
  { key: "confirmed", label: "status", value: "confirmed in block #19,482,031", accent: true },
];

const walletOptions = [
  { id: "metamask", name: "MetaMask" },
  { id: "walletconnect", name: "WalletConnect" },
  { id: "phantom", name: "Phantom" },
];

export default function TxBuilderDemo() {
  const [phase, setPhase] = useState<Phase>("disconnected");
  const [wallet, setWallet] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<TxStep | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<TxStep[]>([]);

  const handleConnect = useCallback((walletId: string) => {
    setWallet(walletId);
    setPhase("connecting");
    setTimeout(() => setPhase("connected"), 1000);
  }, []);

  const buildTx = useCallback(() => {
    setVisibleSteps([]);
    setActiveStep(null);
    setPhase("building");

    txSteps.forEach((step, i) => {
      setTimeout(() => {
        setActiveStep(step.key);
        setVisibleSteps((prev) => [...prev, step.key]);
        if (i === txSteps.length - 1) {
          setPhase("done");
        }
      }, (i + 1) * 500);
    });
  }, []);

  const reset = useCallback(() => {
    setPhase("disconnected");
    setWallet(null);
    setActiveStep(null);
    setVisibleSteps([]);
  }, []);

  const stepIndex = activeStep ? txSteps.findIndex((s) => s.key === activeStep) : -1;
  const selectedWallet = walletOptions.find((w) => w.id === wallet);

  return (
    <div className="flex flex-col gap-3 h-[220px]">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-mono text-white/30">TX BUILDER</div>
          {phase === "connecting" && (
            <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400/70">
              <span className="inline-block w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
              connecting...
            </div>
          )}
          {(phase === "connected" || phase === "building" || phase === "done") && selectedWallet && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-accent">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent status-dot" />
              0x1a2b...3c4d
            </div>
          )}
        </div>
        {(phase === "building" || phase === "done") && (
          <button
            onClick={reset}
            disabled={phase === "building"}
            className="text-[10px] font-mono text-white/30 hover:text-white/50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        )}
      </div>

      {/* Main area */}
      <div className="flex-1 rounded-xl bg-black/40 border border-white/5 p-3 font-mono text-[11px] overflow-y-auto">

        {/* Phase: Disconnected — wallet selection */}
        {phase === "disconnected" && (
          <div className="h-full flex flex-col items-center justify-center gap-3 animate-[fadeIn_0.2s_ease-out]">
            <div className="text-white/20 text-[10px] mb-1">Connect a wallet to begin</div>
            <div className="flex gap-2">
              {walletOptions.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleConnect(w.id)}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2.5 transition-all duration-150 hover:border-white/15 hover:bg-white/[0.05] cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden">
                    <WalletIcon id={w.id} size={24} />
                  </div>
                  <span className="text-[9px] text-white/40">{w.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Phase: Connecting */}
        {phase === "connecting" && selectedWallet && (
          <div className="h-full flex flex-col items-center justify-center gap-2 animate-[fadeIn_0.15s_ease-out]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden animate-pulse">
              <WalletIcon id={selectedWallet.id} size={36} />
            </div>
            <div className="text-[10px] text-white/30">Connecting to {selectedWallet.name}...</div>
          </div>
        )}

        {/* Phase: Connected — ready to build */}
        {phase === "connected" && (
          <div className="h-full flex flex-col items-center justify-center gap-3 animate-[fadeIn_0.2s_ease-out]">
            <div className="text-white/20 text-[10px]">Wallet connected</div>
            <button
              onClick={buildTx}
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent/5 px-4 py-2 text-[11px] text-accent/80 hover:text-accent hover:border-accent/40 transition-all cursor-pointer"
            >
              Build Transaction
              <span className="text-accent/50">&rarr;</span>
            </button>
          </div>
        )}

        {/* Phase: Building / Done — tx steps */}
        {(phase === "building" || phase === "done") && (
          <div className="space-y-1.5">
            {txSteps.map((step) => {
              const isVisible = visibleSteps.includes(step.key);
              const isCurrent = activeStep === step.key && phase === "building";
              if (!isVisible) return null;

              return (
                <div
                  key={step.key}
                  className="flex items-center gap-2 animate-[fadeIn_0.25s_ease-out]"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 ${
                      step.accent && isVisible
                        ? "bg-accent"
                        : isCurrent
                          ? "bg-amber-400 animate-pulse"
                          : "bg-white/40"
                    }`}
                  />
                  <span className="text-white/30 shrink-0 w-16">{step.label}</span>
                  <span
                    className={`truncate transition-colors duration-300 ${
                      step.accent
                        ? "text-accent font-medium"
                        : isCurrent
                          ? "text-amber-400/80"
                          : "text-white/60"
                    }`}
                  >
                    {step.value}
                  </span>
                </div>
              );
            })}

            {/* Progress bar */}
            <div className="mt-3 h-px bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent/40 transition-all duration-500 ease-out"
                style={{ width: `${((stepIndex + 1) / txSteps.length) * 100}%` }}
              />
            </div>

            {phase === "done" && (
              <div className="flex items-center justify-between mt-1.5 text-[10px] animate-[fadeIn_0.3s_ease-out]">
                <span className="text-white/20">gas used: 127,431</span>
                <span className="text-white/20">cost: 0.00306 ETH ($7.82)</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
