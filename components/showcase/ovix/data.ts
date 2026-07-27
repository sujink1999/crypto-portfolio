// Self-contained fake market data for the 0VIX showcase. Values mirror the
// spec's "Realistic fake data" table (section 7 of ovix.md). No wallet or
// chain calls - everything here is static.

export type DemoMarket = {
  symbol: string;
  logo: string;
  supplyApy: string; // e.g. "2.14"
  borrowApy: string;
  ovixApr: string; // reward APR
  totalSupplied: string; // token letters, e.g. "12.4K"
  totalSuppliedUsd: string; // "$28.4M"
  totalBorrowed: string;
  totalBorrowedUsd: string;
  collateralFactor: string; // LTV %, e.g. "82.50"
  liquidity: string; // "$4.8M"
  walletBalance: string; // "0.42 ETH"
  walletBalanceUsd: string; // "$1.3K"
  isCollateral: boolean;
  showLdo?: boolean;
  showGns?: boolean;
  // Optional user positions.
  yourSupplied?: string; // "1.85 ETH"
  yourSuppliedUsd?: string; // "$5.7K"
  yourBorrowed?: string;
  yourBorrowedUsd?: string;
};

const ASSET = (p: string) => `/showcase/ovix/${p}`;

export const MARKETS: DemoMarket[] = [
  {
    symbol: "ETH",
    logo: ASSET("ETH-logo.svg"),
    supplyApy: "2.14",
    borrowApy: "3.89",
    ovixApr: "1.42",
    totalSupplied: "9.21K",
    totalSuppliedUsd: "$28.4M",
    totalBorrowed: "3.84K",
    totalBorrowedUsd: "$11.8M",
    collateralFactor: "82.50",
    liquidity: "$16.6M",
    walletBalance: "0.42 ETH",
    walletBalanceUsd: "$1.3K",
    isCollateral: true,
    yourSupplied: "1.85 ETH",
    yourSuppliedUsd: "$5.7K",
  },
  {
    symbol: "WBTC",
    logo: ASSET("WBTC-logo.svg"),
    supplyApy: "0.87",
    borrowApy: "2.34",
    ovixApr: "0.95",
    totalSupplied: "324",
    totalSuppliedUsd: "$11.9M",
    totalBorrowed: "88",
    totalBorrowedUsd: "$3.2M",
    collateralFactor: "75.00",
    liquidity: "$8.7M",
    walletBalance: "0.00 WBTC",
    walletBalanceUsd: "$0.0",
    isCollateral: true,
  },
  {
    symbol: "USDC",
    logo: ASSET("USDC-logo.svg"),
    supplyApy: "4.62",
    borrowApy: "6.71",
    ovixApr: "3.10",
    totalSupplied: "42.1M",
    totalSuppliedUsd: "$42.1M",
    totalBorrowed: "27.4M",
    totalBorrowedUsd: "$27.4M",
    collateralFactor: "85.00",
    liquidity: "$14.7M",
    walletBalance: "5,240 USDC",
    walletBalanceUsd: "$5.2K",
    isCollateral: true,
    yourSupplied: "3,200 USDC",
    yourSuppliedUsd: "$3.2K",
  },
  {
    symbol: "USDT",
    logo: ASSET("USDT-logo.svg"),
    supplyApy: "4.38",
    borrowApy: "6.55",
    ovixApr: "2.88",
    totalSupplied: "33.7M",
    totalSuppliedUsd: "$33.7M",
    totalBorrowed: "21.9M",
    totalBorrowedUsd: "$21.9M",
    collateralFactor: "85.00",
    liquidity: "$11.8M",
    walletBalance: "0 USDT",
    walletBalanceUsd: "$0.0",
    isCollateral: true,
  },
  {
    symbol: "DAI",
    logo: ASSET("DAI-logo.svg"),
    supplyApy: "4.05",
    borrowApy: "6.12",
    ovixApr: "2.55",
    totalSupplied: "19.3M",
    totalSuppliedUsd: "$19.3M",
    totalBorrowed: "12.1M",
    totalBorrowedUsd: "$12.1M",
    collateralFactor: "80.00",
    liquidity: "$7.2M",
    walletBalance: "1,500 DAI",
    walletBalanceUsd: "$1.5K",
    isCollateral: true,
    yourBorrowed: "1,000 DAI",
    yourBorrowedUsd: "$1.0K",
  },
  {
    symbol: "MATIC",
    logo: ASSET("MATIC-logo.svg"),
    supplyApy: "3.21",
    borrowApy: "5.44",
    ovixApr: "4.20",
    totalSupplied: "16.9M",
    totalSuppliedUsd: "$9.8M",
    totalBorrowed: "6.4M",
    totalBorrowedUsd: "$3.7M",
    collateralFactor: "65.00",
    liquidity: "$6.1M",
    walletBalance: "820 MATIC",
    walletBalanceUsd: "$0.5K",
    isCollateral: true,
  },
  {
    symbol: "stMATIC",
    logo: ASSET("stMATIC-logo.svg"),
    supplyApy: "3.88",
    borrowApy: "5.02",
    ovixApr: "3.70",
    totalSupplied: "9.8M",
    totalSuppliedUsd: "$6.4M",
    totalBorrowed: "2.1M",
    totalBorrowedUsd: "$1.4M",
    collateralFactor: "60.00",
    liquidity: "$5.0M",
    walletBalance: "0 stMATIC",
    walletBalanceUsd: "$0.0",
    isCollateral: true,
    showLdo: true,
  },
  {
    symbol: "MaticX",
    logo: ASSET("MaticX-logo.svg"),
    supplyApy: "3.71",
    borrowApy: "4.95",
    ovixApr: "3.55",
    totalSupplied: "7.9M",
    totalSuppliedUsd: "$5.1M",
    totalBorrowed: "1.6M",
    totalBorrowedUsd: "$1.0M",
    collateralFactor: "60.00",
    liquidity: "$4.1M",
    walletBalance: "0 MaticX",
    walletBalanceUsd: "$0.0",
    isCollateral: false,
  },
  {
    symbol: "MAI",
    logo: ASSET("MAI-logo.svg"),
    supplyApy: "1.24",
    borrowApy: "3.02",
    ovixApr: "1.10",
    totalSupplied: "3.2M",
    totalSuppliedUsd: "$3.2M",
    totalBorrowed: "1.4M",
    totalBorrowedUsd: "$1.4M",
    collateralFactor: "70.00",
    liquidity: "$1.8M",
    walletBalance: "0 MAI",
    walletBalanceUsd: "$0.0",
    isCollateral: false,
  },
  {
    symbol: "jEUR",
    logo: ASSET("jEUR-logo.svg"),
    supplyApy: "2.02",
    borrowApy: "4.18",
    ovixApr: "1.65",
    totalSupplied: "1.9M",
    totalSuppliedUsd: "$2.1M",
    totalBorrowed: "0.7M",
    totalBorrowedUsd: "$0.8M",
    collateralFactor: "65.00",
    liquidity: "$1.3M",
    walletBalance: "0 jEUR",
    walletBalanceUsd: "$0.0",
    isCollateral: false,
  },
  {
    symbol: "gDAI",
    logo: ASSET("gDAI-logo.svg"),
    supplyApy: "5.10",
    borrowApy: "7.20",
    ovixApr: "4.80",
    totalSupplied: "1.8M",
    totalSuppliedUsd: "$1.8M",
    totalBorrowed: "0.9M",
    totalBorrowedUsd: "$0.9M",
    collateralFactor: "70.00",
    liquidity: "$0.9M",
    walletBalance: "0 gDAI",
    walletBalanceUsd: "$0.0",
    isCollateral: false,
    showGns: true,
  },
];

// Count-dashboard headline totals (believable, tick upward via ExtrapolatedNumber).
export const COUNTS = {
  totalSupplied: 184_200_000,
  totalSuppliedApy: 3.9,
  totalBorrowed: 96_700_000,
  totalBorrowedApy: 6.1,
  yourSupplied: 8_900,
  yourSuppliedInterest: 340,
  yourBorrows: 1_000,
  yourBorrowsInterest: 61,
};

export const VIX_ICON = ASSET("0VIX-logo.svg");
export const LDO_ICON = ASSET("LDO-logo.png");
export const GNS_ICON = ASSET("GNS-logo.png");
export const OVIX_LOGO = ASSET("ovixlogo.svg");
export const DOWN_ARROW = ASSET("downarrow.svg");
export const POWERED_BY = ASSET("powered-by-polygon.svg");
export const TWITTER_ICON = ASSET("Vectortwitter.svg");
export const DISCORD_ICON = ASSET("Vectordiscord.svg");
export const TELEGRAM_ICON = ASSET("Vectortelegram.svg");
export const SOCIALNET_ICON = ASSET("Vectorsocialnet.svg");
