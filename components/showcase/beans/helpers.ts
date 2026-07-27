// Ported verbatim from beans-ui src/utils/helpers.js - only the pieces the
// live-round screen needs (activity string mapping, cycle timing, misc).

import type { ActivityEvent } from "./data";

export const ACTIVITY_REFRESH_INTERVAL = 5000;

export const concatClasses = (classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export const isEmpty = (value: unknown): boolean => {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value as object).length === 0;
  return false;
};

export function timeout(delay: number): Promise<void> {
  return new Promise((res) => setTimeout(res, delay));
}

const formatNumberWithCommas = (n: number) =>
  Number(n || 0).toLocaleString("en-US");

// Ported verbatim from beans-ui src/utils/helpers.js.
export const formatNumberToShortString = (
  input: number | string,
  decimals = 0
): string => {
  const number = typeof input === "number" ? input : Number(input);
  if (isNaN(number)) return String(input);

  if (number < 1000) {
    return Number(number).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  const units = ["", "k", "M", "B", "T"];
  const unitIndex = Math.floor(Math.log10(Math.abs(number)) / 3);
  const value = number / Math.pow(1000, unitIndex);
  const roundedValue =
    value % 1 !== 0 ? Math.round(value * 10) / 10 : value;

  return roundedValue + units[unitIndex];
};

// Ported verbatim from beans-ui src/utils/launchHelpers.js.
export const getCoinPileImage = (
  currentBetAmount: number,
  highestBet: number,
  lowestBet: number
): string => {
  const getIndex = (value: number, max: number, min: number) => {
    if (value >= max) return 1;
    if (value <= min) return 8;
    const range = max - min;
    const normalizedValue = value - min;
    const step = range / 7;
    const index = 8 - Math.floor(normalizedValue / step);
    return Math.max(1, Math.min(8, index));
  };
  const coinPileIndex = getIndex(currentBetAmount, highestBet, lowestBet);
  return `/showcase/beans/coins/coin-pile-${coinPileIndex}.png`;
};

export type ActivityString = {
  name: string;
  message: string;
  domainName: string;
  isPositive: boolean;
  action: string;
  event: string;
};

export const getActivityString = (
  activity: Partial<ActivityEvent>
): ActivityString => {
  const { event, domain, amountInBeans, amountInSol, user } = activity || {};
  const { username, walletAddress } = user || { walletAddress: "" };
  const { domainName } = domain || { domainName: "" };

  const name =
    username || `${walletAddress?.slice(0, 5)}...${walletAddress?.slice(-4)}`;

  const amount = formatNumberWithCommas(amountInBeans || amountInSol || 0);

  let message = "";
  let action = "";

  switch (event) {
    case "BetPlaced":
      message = `+${amount} SOL`;
      action = "bet on";
      break;
    case "UserWithdraw":
      message = `-${amount} SOL`;
      action = "bet refunded for";
      break;
    case "BeanClaimed":
      message = `+${amount} beans`;
      action = "claimed";
      break;
    case "Staked":
      message = `+${amount} beans`;
      action = "staked";
      break;
    case "Unstaked":
      message = `-${amount} beans`;
      action = "unstaked";
      break;
  }

  return {
    name,
    message,
    domainName,
    isPositive: event !== "Unstaked",
    action,
    event: event || "",
  };
};

export type AnimatedActivity = { activity: ActivityEvent; duration: number };

export const getAnimatedActivities = (
  newActivities: ActivityEvent[]
): AnimatedActivity[] => {
  const totalDuration = ACTIVITY_REFRESH_INTERVAL;
  const numberOfActivities = newActivities.length;
  const durationForShowing = totalDuration - numberOfActivities * 100;
  const showDuration = durationForShowing / numberOfActivities;

  return newActivities.map((a) => ({
    activity: a,
    duration: Math.min(showDuration, 2000),
  }));
};
