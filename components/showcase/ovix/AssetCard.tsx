"use client";
/* eslint-disable @next/next/no-img-element */

import { ReactNode, useState } from "react";
import { Text, Button, Switch } from "./shared";
import { DemoMarket, VIX_ICON, LDO_ICON, GNS_ICON, DOWN_ARROW } from "./data";

// Ported from src/Components/shared/AssetCard/AssetCard.tsx. The dashboard is
// rendered as Polygon PoS (chainId 137) so the Rewards column and reward chips
// are shown; on PoS the action buttons are disabled, matching production.
const CHAIN_ID = 137;

const RewardChip = ({
  apr0vix,
  showLdo,
  showGns,
}: {
  apr0vix: number;
  showLdo?: boolean;
  showGns?: boolean;
}) => (
  <div className="flex rounded-full items-center bg-chip p-1 gap-1">
    <div className="flex items-center">
      <div className="bg-card p-[3px] rounded-full">
        <img src={VIX_ICON} width={20} height={20} className="h-5 w-5" alt="0vix" />
      </div>
      {showGns && (
        <div className="bg-card p-[2px] rounded-full -ml-3">
          <img src={GNS_ICON} width={24} height={24} className="h-6 w-6" alt="gns" />
        </div>
      )}
      {showLdo && (
        <div className="bg-card p-[2px] rounded-full -ml-3">
          <img
            src={LDO_ICON}
            width={22}
            height={22}
            className="h-[1.35rem] w-[1.35rem]"
            alt="ldo"
          />
        </div>
      )}
    </div>
    <Text className="text-sm font-bold pr-1">{apr0vix.toFixed(2)}%</Text>
  </div>
);

const ExpansionButton = ({
  isExpanded,
  onClick,
}: {
  isExpanded: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex rounded-lg bg-dropdown p-2 items-center justify-center gap-1"
  >
    <img
      src={DOWN_ARROW}
      width={8}
      height={8}
      className={`h-2 w-2 ${isExpanded ? "rotate-180" : ""}`}
      alt=""
    />
  </div>
);

const AssetCardRow = ({
  name,
  value,
  image,
}: {
  name: string;
  value: ReactNode;
  image?: string;
}) => (
  <div className="flex justify-between items-center py-1 text-sm">
    <div className="flex gap-2 items-center text-sm">
      {image && <img src={image} width={20} height={20} className="h-5 w-5" alt="" />}
      {name}
    </div>
    {value}
  </div>
);

const AssetCard = ({
  forMarket = true,
  forBorrow,
  data,
}: {
  forMarket?: boolean;
  forBorrow: boolean;
  data: DemoMarket;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { logo, symbol } = data;
  const isPOS = CHAIN_ID === 137;

  const apyValue = forBorrow ? `${data.borrowApy}%` : `${data.supplyApy}%`;

  const yourValue = forBorrow ? data.yourBorrowed : data.yourSupplied;
  const yourValueUsd = forBorrow ? data.yourBorrowedUsd : data.yourSuppliedUsd;
  const totalValue = forBorrow ? data.totalBorrowed : data.totalSupplied;
  const totalValueUsd = forBorrow ? data.totalBorrowedUsd : data.totalSuppliedUsd;

  const Rewards = (
    <RewardChip
      apr0vix={Number(data.ovixApr)}
      showGns={data.showGns}
      showLdo={data.showLdo}
    />
  );

  return (
    <div
      className={` flex transition-all backdrop-blur-md duration-500 flex-col cursor-pointer ${
        !isExpanded ? " bg-mcard hover:bg-mcardLight " : "bg-mcardLight"
      } px-3 rounded-lg border border-chip select-none py-1`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center gap-1 h-12">
        <div className="flex flex-3">
          <div className="flex gap-1 items-center">
            <img src={logo} width={24} height={24} className="h-6 w-6" alt="" />
            <Text>{symbol}</Text>
          </div>
        </div>
        {isExpanded ? (
          <div className="flex items-center gap-2 fade-in">
            {!forMarket && (
              <Button
                disabled={!forBorrow && isPOS}
                variant="secondary"
                className="text-xs p-1 px-5"
                onClick={(e) => e.stopPropagation()}
              >
                {forBorrow ? "Repay" : "Withdraw"}
              </Button>
            )}
            <Button
              disabled={isPOS}
              className="text-xs p-1 px-5"
              onClick={(e) => e.stopPropagation()}
            >
              {forBorrow ? "Borrow" : "Supply"}
            </Button>
            <ExpansionButton isExpanded={false} onClick={() => setIsExpanded(false)} />
          </div>
        ) : (
          <>
            <div className="flex flex-2 fade-in">
              <Text>{apyValue}</Text>
            </div>
            {CHAIN_ID === 137 && (
              <div className="flex flex-3 fade-in">{Rewards}</div>
            )}
            <div
              className={`flex-3 flex-col fade-in ${forMarket ? "hidden" : "flex"}`}
            >
              <Text>{yourValue ?? "-"}</Text>
              {yourValueUsd && (
                <p className="text-xs text-tertiary">{`(${yourValueUsd})`}</p>
              )}
            </div>
            <div className="flex flex-col flex-3 fade-in">
              <Text>{totalValue}</Text>
              <p className="text-xs text-tertiary">{`(${totalValueUsd})`}</p>
            </div>
            <div className="flex flex-1 justify-end fade-in">
              <ExpansionButton isExpanded={isExpanded} onClick={() => setIsExpanded(true)} />
            </div>
          </>
        )}
      </div>

      <div
        className={
          " transition-all duration-500 " +
          (isExpanded ? "h-24 visible" : " collapse h-0")
        }
      >
        {isExpanded && (
          <>
            <div className="h-px bg-dropdown w-full" />
            <div className="w-full flex gap-5 py-2 flex-1 justify-between">
              <div className="flex-1 max-w-250">
                <AssetCardRow
                  name={forBorrow ? "BORROW APY" : "SUPPLY APY"}
                  value={<p className="text-sm">{apyValue}</p>}
                  image={logo}
                />
                {CHAIN_ID === 137 && (
                  <AssetCardRow
                    name="OVIX APR"
                    value={<p className="text-sm">{data.ovixApr}%</p>}
                    image={VIX_ICON}
                  />
                )}
                {(data.showLdo || data.showGns) && (
                  <AssetCardRow
                    name={data.showLdo ? "LDO APR" : "GNS APR"}
                    value={data.showLdo ? "1.20%" : "1.50%"}
                    image={data.showLdo ? LDO_ICON : GNS_ICON}
                  />
                )}
              </div>
              <div className="flex-1 max-w-250">
                <AssetCardRow
                  name={forBorrow ? "Liquidity" : "Collateral"}
                  value={
                    forBorrow ? (
                      data.liquidity
                    ) : (
                      <Switch
                        isDisabled={!(Number(data.collateralFactor) > 0)}
                        symbol={symbol}
                        isChecked={data.isCollateral}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )
                  }
                />
                <AssetCardRow
                  name={
                    forBorrow
                      ? forMarket
                        ? "Total Borrowed"
                        : "Your Borrowed"
                      : forMarket
                        ? "Total Supplied"
                        : "Your Supplied"
                  }
                  value={
                    <p className="text-sm">
                      {forMarket ? totalValue : yourValue ?? "-"}
                      &nbsp;
                      <span className="text-xs text-tertiary">
                        {`(${forMarket ? totalValueUsd : yourValueUsd ?? "$0.0"})`}
                      </span>
                    </p>
                  }
                />
                <AssetCardRow
                  name={`${symbol} Wallet Balance`}
                  value={
                    <p className="text-sm">
                      {data.walletBalance}
                      &nbsp;
                      <span className="text-xs text-tertiary">
                        {`(${data.walletBalanceUsd})`}
                      </span>
                    </p>
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssetCard;
