"use client";

import { useState } from "react";
import { AssetLayout } from "./MarketLayout";
import AssetCard from "./AssetCard";
import { DemoMarket, MARKETS } from "./data";

// Ported from src/Components/shared/AssetMarketSection.tsx. "Your positions"
// sections list only markets with a supply/borrow balance; market sections
// list everything else (the difference), matching production.
type Props = {
  title: string;
  isMarket?: boolean;
  forBorrow: boolean;
};

const parseNum = (v?: string) =>
  v ? Number(v.replace(/[^0-9.]/g, "")) || 0 : 0;

const AssetMarketSection = ({
  title,
  isMarket = false,
  forBorrow = false,
}: Props) => {
  const [sortAscending, setSortAscending] = useState(true);
  const [currentSort, setCurrentSort] = useState("rewards");

  const positions = MARKETS.filter((m) =>
    forBorrow ? m.yourBorrowed : m.yourSupplied,
  );
  const marketRows = MARKETS.filter((m) => !positions.includes(m));

  const sortMaker = (a: DemoMarket, b: DemoMarket) => {
    const dir = sortAscending ? 1 : -1;
    switch (currentSort) {
      case "asset":
        return a.symbol.toUpperCase() < b.symbol.toUpperCase() ? -dir : dir;
      case "rewards":
        return (Number(a.ovixApr) - Number(b.ovixApr)) * dir;
      case "apy":
        return (
          (parseNum(forBorrow ? a.borrowApy : a.supplyApy) -
            parseNum(forBorrow ? b.borrowApy : b.supplyApy)) *
          dir
        );
      case "total":
        return (
          (parseNum(forBorrow ? a.totalBorrowedUsd : a.totalSuppliedUsd) -
            parseNum(forBorrow ? b.totalBorrowedUsd : b.totalSuppliedUsd)) *
          dir
        );
      case "your":
        return (
          (parseNum(forBorrow ? a.yourBorrowedUsd : a.yourSuppliedUsd) -
            parseNum(forBorrow ? b.yourBorrowedUsd : b.yourSuppliedUsd)) *
          dir
        );
      default:
        return 0;
    }
  };

  const rows = (isMarket ? marketRows : positions).slice().sort(sortMaker);

  return (
    <AssetLayout
      isBorrow={forBorrow}
      title={title}
      isSortedDescending={!sortAscending}
      sortSelectedColumn={currentSort}
      sortColumnSelected={(column) => {
        setCurrentSort(column);
        setSortAscending((p) => !p);
      }}
      forMarket={isMarket}
    >
      {rows.map((market) => (
        <AssetCard
          key={market.symbol}
          data={market}
          forBorrow={forBorrow}
          forMarket={isMarket}
        />
      ))}
    </AssetLayout>
  );
};

export default AssetMarketSection;
