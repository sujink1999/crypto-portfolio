"use client";

import { Children, ReactNode } from "react";
import { SortArrowIcon } from "./icons";

// Ported from src/Components/shared/MarketLayout.tsx (AssetLayout). Sortable
// column headers; empty sections are hidden. Rendered as chainId 137 so the
// Rewards column is present.
const CHAIN_ID = 137;

type Props = {
  children: ReactNode;
  title: string;
  sortSelectedColumn: string;
  forMarket?: boolean;
  isSortedDescending?: boolean;
  isBorrow?: boolean;
  sortColumnSelected: (column: string) => void;
};

const HeaderCell = ({
  label,
  column,
  weight,
  selected,
  descending,
  onClick,
  hidden,
}: {
  label: string;
  column: string;
  weight: string;
  selected: string;
  descending?: boolean;
  onClick: (c: string) => void;
  hidden?: boolean;
}) => (
  <p
    className={`text-sm ${
      selected === column ? "text-white" : "text-tertiary"
    } cursor-pointer gap-1 items-center ${weight} ${hidden ? "hidden" : "flex"}`}
    onClick={() => onClick(column)}
  >
    {label}
    <SortArrowIcon
      selected={selected === column}
      className={descending && selected === column ? "rotate-180" : ""}
    />
  </p>
);

export const AssetLayout = ({
  children,
  title,
  isBorrow = false,
  forMarket = false,
  isSortedDescending,
  sortSelectedColumn = "rewards",
  sortColumnSelected,
}: Props) => {
  const arrayChildren = Children.toArray(children);

  return (
    <div
      className={`flex flex-col flex-1 gap-1 overflow-y-hidden select-none ${
        arrayChildren.length === 0 ? "hidden" : ""
      }`}
    >
      <p className="text-[24px] leading-[32px]">{title}</p>
      <div className="hidden lg:flex px-3 py-2">
        <HeaderCell
          label="Asset"
          column="asset"
          weight="flex-3"
          selected={sortSelectedColumn}
          descending={isSortedDescending}
          onClick={sortColumnSelected}
        />
        <HeaderCell
          label="APY"
          column="apy"
          weight="flex-2"
          selected={sortSelectedColumn}
          descending={isSortedDescending}
          onClick={sortColumnSelected}
        />
        {CHAIN_ID === 137 && (
          <HeaderCell
            label="Rewards"
            column="rewards"
            weight="flex-3"
            selected={sortSelectedColumn}
            descending={isSortedDescending}
            onClick={sortColumnSelected}
          />
        )}
        <HeaderCell
          label={isBorrow ? "Borrowed" : "Supplied"}
          column="your"
          weight="flex-3"
          selected={sortSelectedColumn}
          descending={isSortedDescending}
          onClick={sortColumnSelected}
          hidden={forMarket}
        />
        <HeaderCell
          label={`Total ${isBorrow ? "Borrow" : "Supplied"}`}
          column="total"
          weight="flex-3"
          selected={sortSelectedColumn}
          descending={isSortedDescending}
          onClick={sortColumnSelected}
        />
        <div className="text-sm text-tertiary cursor-pointer flex flex-1" />
      </div>
      {children}
    </div>
  );
};
