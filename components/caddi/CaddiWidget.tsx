"use client";

import React, { useState, useCallback } from "react";
import {
  type Chain,
  type Token,
  type Route,
  type ExecutionStep,
  CHAINS,
  TOKENS,
  generateRoutes,
  getExecutionSteps,
} from "./data";
import BridgeInputCard from "./BridgeInputCard";
import BridgeRouteCard from "./BridgeRouteCard";
import TokenSelector from "./TokenSelector";
import BridgeExecution from "./BridgeExecution";
import ChainSelector from "./ChainSelector";

type Page = "routes" | "execution";
type SelectingFor = "from-chain" | "from-asset" | "to-chain" | "to-asset" | null;

export default function CaddiWidget() {
  const [page, setPage] = useState<Page>("routes");

  const [sourceChain, setSourceChain] = useState<Chain>(CHAINS[0]);
  const [destChain, setDestChain] = useState<Chain>(CHAINS[2]);
  const [sourceToken, setSourceToken] = useState<Token>(TOKENS[1][0]);
  const [destToken, setDestToken] = useState<Token>(TOKENS[42161][1]);

  const [fromAmount, setFromAmount] = useState("0.5");
  const [toAmount, setToAmount] = useState("");

  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [routesFetching, setRoutesFetching] = useState(false);

  const [selectingFor, setSelectingFor] = useState<SelectingFor>(null);
  const [slippage, setSlippage] = useState(0.5);

  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);

  const showTokenSelector = selectingFor === "from-asset" || selectingFor === "to-asset";
  const showChainSelector = selectingFor === "from-chain" || selectingFor === "to-chain";

  const fetchRoutes = useCallback(
    (amount: string, srcToken: Token, dstToken: Token, srcChain: Chain, dstChain: Chain) => {
      const numAmount = Number(amount);
      if (!numAmount || !srcToken || !dstToken) {
        setRoutes([]);
        return;
      }

      setRoutesFetching(true);
      setTimeout(() => {
        const newRoutes = generateRoutes(srcToken, dstToken, numAmount);
        setRoutes(newRoutes);
        setSelectedRouteIndex(0);
        if (newRoutes.length > 0) {
          setToAmount(newRoutes[0].destinationAmount.toFixed(6));
        }
        setRoutesFetching(false);
      }, 800 + Math.random() * 600);
    },
    []
  );

  const handleFromAmountChange = (val: string) => {
    setFromAmount(val);
    fetchRoutes(val, sourceToken, destToken, sourceChain, destChain);
  };

  const handleMaxClick = () => {
    const maxAmount = sourceToken.balance.toString();
    setFromAmount(maxAmount);
    fetchRoutes(maxAmount, sourceToken, destToken, sourceChain, destChain);
  };

  const handleFlip = () => {
    const prevSource = { chain: sourceChain, token: sourceToken };
    const prevDest = { chain: destChain, token: destToken };

    setSourceChain(prevDest.chain);
    setDestChain(prevSource.chain);

    const newSourceTokens = TOKENS[prevDest.chain.id];
    const newDestTokens = TOKENS[prevSource.chain.id];

    const newSrcToken = newSourceTokens?.find((t) => t.symbol === prevDest.token.symbol) || newSourceTokens?.[0];
    const newDstToken = newDestTokens?.find((t) => t.symbol === prevSource.token.symbol) || newDestTokens?.[0];

    if (newSrcToken) setSourceToken(newSrcToken);
    if (newDstToken) setDestToken(newDstToken);

    setFromAmount("");
    setToAmount("");
    setRoutes([]);
  };

  const handleTokenSelect = (token: Token) => {
    if (selectingFor === "from-asset") {
      setSourceToken(token);
      setSelectingFor(null);
      if (fromAmount) {
        fetchRoutes(fromAmount, token, destToken, sourceChain, destChain);
      }
    } else if (selectingFor === "to-asset") {
      setDestToken(token);
      setSelectingFor(null);
      if (fromAmount) {
        fetchRoutes(fromAmount, sourceToken, token, sourceChain, destChain);
      }
    }
  };

  const handleChainSelect = (chain: Chain) => {
    const tokens = TOKENS[chain.id];
    if (selectingFor === "from-chain") {
      setSourceChain(chain);
      if (tokens?.[0]) {
        setSourceToken(tokens[0]);
        if (fromAmount) {
          fetchRoutes(fromAmount, tokens[0], destToken, chain, destChain);
        }
      }
    } else if (selectingFor === "to-chain") {
      setDestChain(chain);
      if (tokens?.[0]) {
        setDestToken(tokens[0]);
        if (fromAmount) {
          fetchRoutes(fromAmount, sourceToken, tokens[0], sourceChain, chain);
        }
      }
    }
    setSelectingFor(null);
  };

  const handleBridgeNow = () => {
    const steps = getExecutionSteps();
    setExecutionSteps(steps);
    setPage("execution");
  };

  const handleBackToRoutes = () => {
    setPage("routes");
    setExecutionSteps([]);
  };

  // Initial route fetch on mount
  React.useEffect(() => {
    if (fromAmount && sourceToken && destToken) {
      fetchRoutes(fromAmount, sourceToken, destToken, sourceChain, destChain);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tokensForSelection =
    selectingFor === "from-asset"
      ? TOKENS[sourceChain.id] || []
      : selectingFor === "to-asset"
        ? TOKENS[destChain.id] || []
        : [];

  const selectedTokenSymbol =
    selectingFor === "from-asset"
      ? sourceToken?.symbol
      : selectingFor === "to-asset"
        ? destToken?.symbol
        : undefined;

  return (
    <div className="caddi-widget relative">
      <div className="bg-[#111827] border border-white/10 rounded-xl w-[384px] h-[600px] overflow-hidden flex flex-col shadow-lg shadow-black/40 relative">
        {/* Header */}
        <div className="flex items-center justify-between p-3 pb-0">
          <div className="flex items-center gap-2">
            {page === "execution" && (
              <button
                onClick={handleBackToRoutes}
                className="py-1 px-3 rounded-full bg-[#1C2431] hover:bg-[#374151] transition-all cursor-pointer text-white/60 text-sm"
              >
                &larr;
              </button>
            )}
            <h3 className="text-white font-medium text-sm">
              {page === "execution" ? "Bridging" : "Bridge"}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#1C2431]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 status-dot" />
              <span className="text-white/60 text-xs">0x4f...a2c1</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {page === "routes" && (
          <div className="flex flex-col flex-1 overflow-hidden px-3">
            {/* Input Cards */}
            <div className="flex flex-col gap-2 mt-4 relative">
              <BridgeInputCard
                isFrom
                chainName={sourceChain.name}
                chainImage={sourceChain.image}
                assetSymbol={sourceToken?.symbol}
                assetImage={sourceToken?.image}
                balance={sourceToken?.balance}
                unitValueUsd={sourceToken?.unitValueUsd}
                amount={fromAmount}
                onChainClick={() => setSelectingFor("from-chain")}
                onAssetClick={() => setSelectingFor("from-asset")}
                onAmountChange={handleFromAmountChange}
                onMaxClick={handleMaxClick}
              />
              <BridgeInputCard
                chainName={destChain.name}
                chainImage={destChain.image}
                assetSymbol={destToken?.symbol}
                assetImage={destToken?.image}
                balance={destToken?.balance}
                unitValueUsd={destToken?.unitValueUsd}
                amount={toAmount}
                onChainClick={() => setSelectingFor("to-chain")}
                onAssetClick={() => setSelectingFor("to-asset")}
                onAmountChange={() => {}}
                readOnly
              />
              {/* Flip button */}
              <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-10">
                <button
                  onClick={handleFlip}
                  className="w-7 h-7 rounded-full bg-white flex justify-center items-center hover:scale-110 transition-transform cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C2431" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Slippage */}
            <div className="flex items-center gap-2 mt-2 pb-1">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#99A4B8]">Slippage:</span>
                <div className="flex gap-1">
                  {[0.1, 0.5, 1.0].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSlippage(val)}
                      className={`px-2 py-0.5 rounded-full text-[10px] cursor-pointer transition-all border-none ${
                        slippage === val
                          ? "bg-[#A3E2E3]/20 text-[#A3E2E3]"
                          : "bg-[#1E2430] text-[#99A4B8] hover:text-white"
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Routes */}
            <RoutesSection
              routes={routes}
              routesFetching={routesFetching}
              fromAmount={fromAmount}
              toAmount={toAmount}
              selectedRouteIndex={selectedRouteIndex}
              onRouteSelect={(i) => {
                setSelectedRouteIndex(i);
                setToAmount(routes[i].destinationAmount.toFixed(6));
              }}
              destTokenSymbol={destToken?.symbol || ""}
              onBridgeNow={handleBridgeNow}
              hasError={Number(fromAmount || "0") > (sourceToken?.balance || 0)}
            />
          </div>
        )}

        {page === "execution" && (
          <BridgeExecution
            sourceChain={sourceChain}
            destChain={destChain}
            sourceToken={sourceToken}
            destToken={destToken}
            sourceAmount={fromAmount}
            destAmount={toAmount}
            route={routes[selectedRouteIndex]}
            steps={executionSteps}
            onBack={handleBackToRoutes}
          />
        )}

        {/* Token Selector Overlay */}
        {showTokenSelector && (
          <TokenSelector
            tokens={tokensForSelection}
            selectedSymbol={selectedTokenSymbol}
            onSelect={handleTokenSelect}
            onClose={() => setSelectingFor(null)}
          />
        )}

        {/* Chain Selector Overlay */}
        {showChainSelector && (
          <ChainSelector
            chains={CHAINS}
            selectedChainId={
              selectingFor === "from-chain" ? sourceChain.id : destChain.id
            }
            onSelect={handleChainSelect}
            onClose={() => setSelectingFor(null)}
          />
        )}
      </div>
    </div>
  );
}

function RoutesSection({
  routes,
  routesFetching,
  fromAmount,
  toAmount,
  selectedRouteIndex,
  onRouteSelect,
  destTokenSymbol,
  onBridgeNow,
  hasError,
}: {
  routes: Route[];
  routesFetching: boolean;
  fromAmount: string;
  toAmount: string;
  selectedRouteIndex: number;
  onRouteSelect: (i: number) => void;
  destTokenSymbol: string;
  onBridgeNow: () => void;
  hasError: boolean;
}) {
  if (routesFetching) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-white gap-3">
        <div className="caddi-loader" />
        <p className="text-sm text-[#99A4B8]">Fetching routes...</p>
      </div>
    );
  }

  if (Number(fromAmount || "0") === 0 && Number(toAmount || "0") === 0) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <p className="text-white/40 text-sm">Enter an amount to get started</p>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <p className="text-white/40 text-sm">No routes found</p>
      </div>
    );
  }

  const buttonText = hasError
    ? "Insufficient Balance"
    : "Bridge now";

  return (
    <div className="flex-1 flex flex-col overflow-hidden mt-1">
      <div className="flex-1 flex flex-col gap-1.5 overflow-auto disable-scrollbars pb-3">
        {routes.map((route, index) => (
          <BridgeRouteCard
            key={route.name}
            route={route}
            tokenOutSymbol={destTokenSymbol}
            isSelected={selectedRouteIndex === index}
            onClick={() => onRouteSelect(index)}
          />
        ))}
      </div>
      <button
        onClick={onBridgeNow}
        disabled={hasError}
        className={`w-full p-2.5 rounded-lg text-sm font-medium mb-2 cursor-pointer transition-all border-none ${
          hasError
            ? "bg-[#ff5151]/20 text-[#FF9494] cursor-not-allowed"
            : "bg-[#A3E2E3] text-[#111827] hover:bg-[#A3E2E3]/80"
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}
