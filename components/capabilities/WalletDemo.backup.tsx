"use client";

import { useState } from "react";

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

const wallets = [
  { id: "metamask", name: "MetaMask", color: "#f6851b" },
  { id: "walletconnect", name: "WalletConnect", color: "#3b99fc" },
  { id: "phantom", name: "Phantom", color: "#ab9ff2" },
];

type State = "disconnected" | "selecting" | "connecting" | "connected";

export default function WalletDemo() {
  const [state, setState] = useState<State>("disconnected");
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleConnect = (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId);
    if (!wallet) return;
    setSelectedWallet(walletId);
    setState("connecting");

    setTimeout(() => {
      setState("connected");
    }, 1200);
  };

  const handleDisconnect = () => {
    setState("disconnected");
    setSelectedWallet(null);
  };

  const activeWallet = wallets.find((w) => w.id === selectedWallet);

  return (
    <div className="flex flex-col items-center justify-center h-[220px] gap-4">
      {/* Disconnected — show connect button */}
      {state === "disconnected" && (
        <button
          onClick={() => setState("selecting")}
          className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] border border-white/10 px-5 py-3 text-sm text-white/80 transition-all duration-200 hover:border-accent/30 hover:bg-accent/5 hover:text-white cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M20 12V8H6a2 2 0 0 1 0-4h12V2" />
            <rect x="2" y="8" width="20" height="14" rx="2" />
            <circle cx="18" cy="15" r="1.5" fill="currentColor" />
          </svg>
          Connect Wallet
        </button>
      )}

      {/* Selecting wallet */}
      {state === "selecting" && (
        <div className="w-full max-w-[240px] rounded-xl bg-white/[0.04] border border-white/10 overflow-hidden animate-[fadeIn_0.15s_ease-out]">
          <div className="px-4 py-2.5 border-b border-white/5 text-[11px] text-white/40 font-mono">
            Select a wallet
          </div>
          <div className="p-2 space-y-1">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleConnect(wallet.id)}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/70 transition-all duration-150 hover:bg-white/[0.05] hover:text-white cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden">
                  <WalletIcon id={wallet.id} size={28} />
                </div>
                {wallet.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Connecting */}
      {state === "connecting" && activeWallet && (
        <div className="flex flex-col items-center gap-3 animate-[fadeIn_0.15s_ease-out]">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden animate-pulse">
            <WalletIcon id={activeWallet.id} size={48} />
          </div>
          <div className="text-xs text-white/40 font-mono">
            Connecting to {activeWallet.name}...
          </div>
        </div>
      )}

      {/* Connected */}
      {state === "connected" && activeWallet && (
        <div className="w-full max-w-[260px] rounded-xl bg-white/[0.04] border border-white/10 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent status-dot" />
              <span className="text-[11px] font-mono text-accent">Connected</span>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-[10px] font-mono text-white/30 hover:text-red-400 transition-colors cursor-pointer"
            >
              Disconnect
            </button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <WalletIcon id={activeWallet.id} size={32} />
            </div>
            <div>
              <div className="text-xs text-white/80 font-mono">0x1a2b...3c4d</div>
              <div className="text-[10px] text-white/30">{activeWallet.name}</div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
            <span className="text-[10px] text-white/40">Balance</span>
            <span className="text-xs font-mono text-white/70">4.2091 ETH</span>
          </div>
        </div>
      )}
    </div>
  );
}
