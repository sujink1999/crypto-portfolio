"use client";

import { useEffect, useRef, useState } from "react";
import { COUNTS } from "./data";

// ExtrapolatedNumber: a count-up that slowly ticks upward by APY/interest each
// frame, mirroring src/Components/shared/ExtrapolatedNumber.tsx.
const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;

const formatMoney = (value: number, prefix = "") => {
  const abs = Math.abs(value);
  let body: string;
  if (abs >= 1_000_000) body = (value / 1_000_000).toFixed(2) + "M";
  else if (abs >= 1_000) body = (value / 1_000).toFixed(2) + "K";
  else body = value.toFixed(2);
  return prefix + body;
};

const ExtrapolatedNumber = ({
  value,
  apy = 0,
  interest = 0,
  prefix = "",
}: {
  value: number;
  apy?: number;
  interest?: number;
  prefix?: string;
}) => {
  const [display, setDisplay] = useState(value);
  const start = useRef<number | null>(null);

  useEffect(() => {
    // Per-second growth: continuous interest by APY plus any fixed interest.
    const perSecond = (value * (apy / 100) + interest) / SECONDS_PER_YEAR;
    let raf = 0;
    const tick = (t: number) => {
      if (start.current === null) start.current = t;
      const elapsed = (t - start.current) / 1000;
      setDisplay(value + perSecond * elapsed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, apy, interest]);

  return <>{formatMoney(display, prefix)}</>;
};

const CountLayoutDesktop = ({
  title,
  value,
  apy,
  interest,
  prefix,
  className = "",
}: {
  title: string;
  value: number;
  apy?: number;
  interest?: number;
  prefix?: string;
  className?: string;
}) => (
  <div className={" flex " + className}>
    <div className="flex flex-col gap-1 items-start justify-start cursor-pointer">
      <p className="text-xs text-secondary">{title}</p>
      <p className="text-[32px] leading-8 font-medium">
        <ExtrapolatedNumber
          value={value}
          apy={apy}
          interest={interest}
          prefix={prefix}
        />
      </p>
    </div>
  </div>
);

// Small radial-style meter (stands in for ChartLayout).
const Meter = ({
  title,
  label,
  percent,
  gradient,
}: {
  title: string;
  label: string;
  percent: number;
  gradient: string;
}) => (
  <div className="flex-1 flex flex-col gap-2 rounded-md bg-mcard border border-chip p-3 backdrop-blur-md">
    <p className="text-xs text-secondary">{title}</p>
    <p className="text-lg font-medium">{label}</p>
    <div className="h-1.5 w-full rounded-full bg-chip overflow-hidden">
      <div
        className={`h-full rounded-full ${gradient}`}
        style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
      />
    </div>
  </div>
);

const ImageTagCard = () => (
  <div className="flex banner-card w-full rounded-md">
    <div className="flex flex-col justify-between gap-2 items-start flex-2 p-4">
      <div className="flex flex-col gap-2 items-start">
        <p className="text-lg font-semibold">0VIX is LIVE on zkEVM</p>
        <p className="text-sm max-w-[280px] text-tertiary">
          Get started with zkDeFi. Enjoy lightning-fast lending &amp; borrowing
          on brand new blockchain
        </p>
        <button className="w-fit p-1 px-2 bg-purple rounded-md border border-purple hover:bg-purple/70 transition-all text-sm">
          Change Chain
        </button>
      </div>
    </div>
    <div className="flex flex-1 justify-end items-center p-4">
      <div className="text-right">
        <p className="text-2xl font-bold leading-6">zkEVM</p>
        <p className="text-xs text-tertiary">powered by Polygon</p>
      </div>
    </div>
  </div>
);

const CountDashboard = () => (
  <div className="flex flex-col w-full">
    <div className="flex pb-6 gap-6 flex-col lg:flex-row">
      <div className="flex flex-1 flex-col gap-4 w-full justify-center">
        <CountLayoutDesktop
          title="TOTAL SUPPLIED"
          value={COUNTS.totalSupplied}
          apy={COUNTS.totalSuppliedApy}
          prefix="$"
        />
        <CountLayoutDesktop
          title="TOTAL BORROWED"
          value={COUNTS.totalBorrowed}
          apy={COUNTS.totalBorrowedApy}
          prefix="$"
        />
      </div>
      <div className="flex-1 lg:max-w-lg flex justify-end">
        <ImageTagCard />
      </div>
    </div>
    <div className="h-px bg-border w-full opacity-20" />
    <div className="flex py-6 items-center gap-6 flex-col lg:flex-row">
      <div className="flex flex-1 gap-8 w-full">
        <CountLayoutDesktop
          title="YOUR SUPPLIED"
          value={COUNTS.yourSupplied}
          interest={COUNTS.yourSuppliedInterest}
          prefix="$"
          className="flex-3"
        />
        <CountLayoutDesktop
          title="YOUR BORROWS"
          value={COUNTS.yourBorrows}
          interest={COUNTS.yourBorrowsInterest}
          prefix="$"
          className="flex-3"
        />
        <div className="flex-1" />
      </div>
      <div className="flex flex-1 gap-4 w-full">
        <Meter
          title="BORROW LIMIT USED"
          label="11.24%"
          percent={11.24}
          gradient="normal-status-gradient"
        />
        <Meter
          title="HEALTH FACTOR"
          label="1.84"
          percent={72}
          gradient="normal-status-gradient"
        />
        <Meter
          title="LIQUIDATION RISK"
          label="LOW RISK"
          percent={18}
          gradient="normal-status-gradient"
        />
      </div>
    </div>
    <div className="h-px bg-border w-full opacity-20" />
  </div>
);

export default CountDashboard;
