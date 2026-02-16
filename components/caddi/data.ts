export interface Chain {
  id: number;
  name: string;
  image: string;
  symbol: string;
}

export interface Token {
  symbol: string;
  name: string;
  image: string;
  balance: number;
  unitValueUsd: number;
  contract: string;
  chainId: number;
}

export interface Route {
  name: string;
  bridgeName: string;
  bridgeImage: string;
  estimatedDuration: number;
  estimatedCostUSD: number;
  destinationAmount: number;
  sourceAmount: number;
  numberOfTxs: number;
  securityScore: number;
  points: boolean;
}

export interface ExecutionStep {
  description: string;
  type: "approve" | "swap" | "bridge" | "wait";
  status: "pending" | "in_progress" | "completed" | "failed";
  txHash?: string;
}

export const CHAINS: Chain[] = [
  { id: 1, name: "Ethereum", image: "/projects/chains/ethereum.svg", symbol: "ETH" },
  { id: 137, name: "Polygon", image: "/projects/chains/polygon.svg", symbol: "MATIC" },
  { id: 42161, name: "Arbitrum", image: "/projects/chains/arbitrum.svg", symbol: "ETH" },
  { id: 10, name: "Optimism", image: "/projects/chains/optimism.svg", symbol: "ETH" },
  { id: 8453, name: "Base", image: "/projects/chains/base.svg", symbol: "ETH" },
  { id: 56, name: "BNB Chain", image: "/projects/chains/bnb.svg", symbol: "BNB" },
  { id: 43114, name: "Avalanche", image: "/projects/chains/avalanche.svg", symbol: "AVAX" },
];

export const TOKENS: Record<number, Token[]> = {
  1: [
    { symbol: "ETH", name: "Ethereum", image: "/projects/tokens/eth.svg", balance: 2.4531, unitValueUsd: 2645.32, contract: "0x0000", chainId: 1 },
    { symbol: "USDC", name: "USD Coin", image: "/projects/tokens/usdc.svg", balance: 5420.0, unitValueUsd: 1.0, contract: "0xa0b8", chainId: 1 },
    { symbol: "USDT", name: "Tether", image: "/projects/tokens/usdt.svg", balance: 1200.0, unitValueUsd: 1.0, contract: "0xdac1", chainId: 1 },
    { symbol: "WBTC", name: "Wrapped Bitcoin", image: "/projects/tokens/wbtc.svg", balance: 0.0821, unitValueUsd: 43250.0, contract: "0x2260", chainId: 1 },
    { symbol: "DAI", name: "Dai Stablecoin", image: "/projects/tokens/dai.svg", balance: 890.5, unitValueUsd: 1.0, contract: "0x6b17", chainId: 1 },
    { symbol: "LINK", name: "Chainlink", image: "/projects/tokens/link.svg", balance: 150.25, unitValueUsd: 14.82, contract: "0x514d", chainId: 1 },
    { symbol: "UNI", name: "Uniswap", image: "/projects/tokens/uni.svg", balance: 85.0, unitValueUsd: 6.45, contract: "0x1f98", chainId: 1 },
    { symbol: "AAVE", name: "Aave", image: "/projects/tokens/aave.svg", balance: 12.3, unitValueUsd: 92.15, contract: "0x7fc6", chainId: 1 },
  ],
  42161: [
    { symbol: "ETH", name: "Ethereum", image: "/projects/tokens/eth.svg", balance: 1.892, unitValueUsd: 2645.32, contract: "0x0000", chainId: 42161 },
    { symbol: "USDC", name: "USD Coin", image: "/projects/tokens/usdc.svg", balance: 3200.0, unitValueUsd: 1.0, contract: "0xaf88", chainId: 42161 },
    { symbol: "ARB", name: "Arbitrum", image: "/projects/chains/arbitrum.svg", balance: 450.0, unitValueUsd: 1.12, contract: "0x912c", chainId: 42161 },
    { symbol: "GMX", name: "GMX", image: "/projects/tokens/gmx.svg", balance: 8.5, unitValueUsd: 42.3, contract: "0xfc5a", chainId: 42161 },
  ],
  137: [
    { symbol: "MATIC", name: "Polygon", image: "/projects/chains/polygon.svg", balance: 2500.0, unitValueUsd: 0.82, contract: "0x0000", chainId: 137 },
    { symbol: "USDC", name: "USD Coin", image: "/projects/tokens/usdc.svg", balance: 800.0, unitValueUsd: 1.0, contract: "0x2791", chainId: 137 },
    { symbol: "WETH", name: "Wrapped Ether", image: "/projects/tokens/eth.svg", balance: 0.45, unitValueUsd: 2645.32, contract: "0x7ceb", chainId: 137 },
  ],
  10: [
    { symbol: "ETH", name: "Ethereum", image: "/projects/tokens/eth.svg", balance: 0.95, unitValueUsd: 2645.32, contract: "0x0000", chainId: 10 },
    { symbol: "USDC", name: "USD Coin", image: "/projects/tokens/usdc.svg", balance: 1500.0, unitValueUsd: 1.0, contract: "0x7f5c", chainId: 10 },
    { symbol: "OP", name: "Optimism", image: "/projects/chains/optimism.svg", balance: 320.0, unitValueUsd: 2.15, contract: "0x4200", chainId: 10 },
  ],
  8453: [
    { symbol: "ETH", name: "Ethereum", image: "/projects/tokens/eth.svg", balance: 1.2, unitValueUsd: 2645.32, contract: "0x0000", chainId: 8453 },
    { symbol: "USDC", name: "USD Coin", image: "/projects/tokens/usdc.svg", balance: 2100.0, unitValueUsd: 1.0, contract: "0x833b", chainId: 8453 },
  ],
  56: [
    { symbol: "BNB", name: "BNB", image: "/projects/chains/bnb.svg", balance: 5.2, unitValueUsd: 312.45, contract: "0x0000", chainId: 56 },
    { symbol: "USDT", name: "Tether", image: "/projects/tokens/usdt.svg", balance: 950.0, unitValueUsd: 1.0, contract: "0x55d3", chainId: 56 },
    { symbol: "CAKE", name: "PancakeSwap", image: "/projects/tokens/cake.svg", balance: 120.0, unitValueUsd: 2.85, contract: "0x0e09", chainId: 56 },
  ],
  43114: [
    { symbol: "AVAX", name: "Avalanche", image: "/projects/chains/avalanche.svg", balance: 45.0, unitValueUsd: 35.2, contract: "0x0000", chainId: 43114 },
    { symbol: "USDC", name: "USD Coin", image: "/projects/tokens/usdc.svg", balance: 600.0, unitValueUsd: 1.0, contract: "0xb97e", chainId: 43114 },
  ],
};

export function generateRoutes(
  sourceToken: Token,
  destToken: Token,
  amount: number
): Route[] {
  const rate = sourceToken.unitValueUsd / destToken.unitValueUsd;
  const baseOut = amount * rate;

  return [
    {
      name: "lifi-stargate",
      bridgeName: "Stargate",
      bridgeImage: "/projects/bridges/stargate.svg",
      estimatedDuration: 120,
      estimatedCostUSD: 2.45,
      destinationAmount: baseOut * 0.998,
      sourceAmount: amount,
      numberOfTxs: 1,
      securityScore: 4,
      points: true,
    },
    {
      name: "across-v3",
      bridgeName: "Across",
      bridgeImage: "/projects/bridges/across.svg",
      estimatedDuration: 60,
      estimatedCostUSD: 1.85,
      destinationAmount: baseOut * 0.997,
      sourceAmount: amount,
      numberOfTxs: 1,
      securityScore: 5,
      points: false,
    },
    {
      name: "hop-bridge",
      bridgeName: "Hop",
      bridgeImage: "/projects/bridges/hop.svg",
      estimatedDuration: 300,
      estimatedCostUSD: 3.12,
      destinationAmount: baseOut * 0.995,
      sourceAmount: amount,
      numberOfTxs: 2,
      securityScore: 3,
      points: false,
    },
    {
      name: "celer-cbridge",
      bridgeName: "cBridge",
      bridgeImage: "/projects/bridges/cbridge.svg",
      estimatedDuration: 180,
      estimatedCostUSD: 2.0,
      destinationAmount: baseOut * 0.996,
      sourceAmount: amount,
      numberOfTxs: 1,
      securityScore: 4,
      points: true,
    },
  ];
}

export function getExecutionSteps(): ExecutionStep[] {
  return [
    { description: "Approve token spending", type: "approve", status: "pending" },
    { description: "Send to bridge", type: "bridge", status: "pending" },
    { description: "Waiting for bridge confirmation", type: "wait", status: "pending" },
  ];
}
