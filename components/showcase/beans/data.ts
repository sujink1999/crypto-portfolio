// Self-contained fake data, shaped from beans-ui responseSamples.js.

export type Prelaunch = {
  id: number;
  domainName: string;
  launchIndex: number;
  totalBetAmount: number;
  totalFee: number;
  status: "not_launched" | "launched" | "launched_pump";
  ticker: string;
  numHolders: number;
  rank: number;
};

export type ActivityEvent = {
  id: number;
  event: "BetPlaced" | "UserWithdraw" | "BeanClaimed" | "Staked" | "Unstaked";
  type: string; // used by FlyingBeans to pick positive/negative
  domainId: number;
  domain: { domainName: string };
  amountInSol?: number;
  amountInBeans?: number;
  user: { username?: string; walletAddress: string };
};

// A fake USD price for SOL, so pooled amounts display like production
// ("Pooled SOL: $<usd>").
export const SOL_PRICE = 152.4;

// Full contender grid (rank drives layout + the "winning..." badge on rank 1).
export const GRID_PRELAUNCHES: Prelaunch[] = [
  { id: 3444, domainName: "youtube.com", launchIndex: 13, totalBetAmount: 4.82, totalFee: 0.063, status: "not_launched", ticker: "TUBE", numHolders: 18, rank: 1 },
  { id: 3512, domainName: "tiktok.com", launchIndex: 14, totalBetAmount: 3.91, totalFee: 0.051, status: "not_launched", ticker: "TOK", numHolders: 14, rank: 2 },
  { id: 3600, domainName: "reddit.com", launchIndex: 15, totalBetAmount: 3.12, totalFee: 0.041, status: "not_launched", ticker: "REDD", numHolders: 11, rank: 3 },
  { id: 3711, domainName: "spotify.com", launchIndex: 16, totalBetAmount: 2.64, totalFee: 0.034, status: "not_launched", ticker: "SPOT", numHolders: 9, rank: 4 },
  { id: 3782, domainName: "twitch.tv", launchIndex: 17, totalBetAmount: 2.18, totalFee: 0.028, status: "not_launched", ticker: "TWCH", numHolders: 8, rank: 5 },
  { id: 3844, domainName: "github.com", launchIndex: 18, totalBetAmount: 1.77, totalFee: 0.023, status: "not_launched", ticker: "GHUB", numHolders: 7, rank: 6 },
  { id: 3901, domainName: "amazon.com", launchIndex: 19, totalBetAmount: 1.43, totalFee: 0.019, status: "not_launched", ticker: "AMZN", numHolders: 6, rank: 7 },
  { id: 3955, domainName: "netflix.com", launchIndex: 20, totalBetAmount: 1.09, totalFee: 0.014, status: "not_launched", ticker: "NFLX", numHolders: 5, rank: 8 },
  { id: 4012, domainName: "wikipedia.org", launchIndex: 21, totalBetAmount: 0.82, totalFee: 0.011, status: "not_launched", ticker: "WIKI", numHolders: 4, rank: 9 },
  { id: 4088, domainName: "x.com", launchIndex: 22, totalBetAmount: 0.57, totalFee: 0.007, status: "not_launched", ticker: "XCOM", numHolders: 3, rank: 10 },
  { id: 4140, domainName: "instagram.com", launchIndex: 23, totalBetAmount: 0.34, totalFee: 0.004, status: "not_launched", ticker: "INSTA", numHolders: 2, rank: 11 },
];

// The two arena contenders (top 2) → exactly two RunningBeans render.
export const PRELAUNCHES: Prelaunch[] = GRID_PRELAUNCHES.slice(0, 7);

// Rotating fake activity batches. Each batch is pushed every ACTIVITY window;
// the StonerBean cycles the bubbles and FlyingBeans pops from the matching card.
// Shaped exactly like newActivityData[] (domainId + type + domain.domainName).
export const ACTIVITY_BATCHES: ActivityEvent[][] = [
  [
    { id: 1, event: "BetPlaced", type: "BetPlaced", domainId: 3444, domain: { domainName: "youtube.com" }, amountInSol: 0.5, user: { username: "beanlord", walletAddress: "H3KqZ9x2aaaabbbb" } },
    { id: 2, event: "BetPlaced", type: "BetPlaced", domainId: 3512, domain: { domainName: "tiktok.com" }, amountInSol: 1.2, user: { walletAddress: "9xQmR4t7ccccdddd" } },
    { id: 3, event: "BeanClaimed", type: "BeanClaimed", domainId: 3600, domain: { domainName: "reddit.com" }, amountInBeans: 340, user: { username: "sprout", walletAddress: "F2LwP8k1eeeeffff" } },
  ],
  [
    { id: 4, event: "Staked", type: "Staked", domainId: 3844, domain: { domainName: "github.com" }, amountInBeans: 128, user: { username: "gm_ser", walletAddress: "A1BcD2eF3gggghhhh" } },
    { id: 5, event: "UserWithdraw", type: "UserWithdraw", domainId: 3782, domain: { domainName: "twitch.tv" }, amountInSol: 0.3, user: { walletAddress: "K7mN9p2Qiiiijjjj" } },
    { id: 6, event: "Unstaked", type: "Unstaked", domainId: 3711, domain: { domainName: "spotify.com" }, amountInBeans: 64, user: { username: "jeeter", walletAddress: "Z9yX8w7Vkkkkllll" } },
  ],
  [
    { id: 7, event: "BetPlaced", type: "BetPlaced", domainId: 3444, domain: { domainName: "youtube.com" }, amountInSol: 0.8, user: { username: "chad", walletAddress: "Q4rS6t8Ummmmnnnn" } },
    { id: 8, event: "BeanClaimed", type: "BeanClaimed", domainId: 3955, domain: { domainName: "netflix.com" }, amountInBeans: 512, user: { walletAddress: "B3cE5g7Ioooopppp" } },
    { id: 9, event: "BetPlaced", type: "BetPlaced", domainId: 3901, domain: { domainName: "amazon.com" }, amountInSol: 0.45, user: { username: "degen", walletAddress: "C4dF6h8Jqqqqrrrr" } },
  ],
];
