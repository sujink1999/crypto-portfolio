// Ported from beans-ui Auction/Auctions.js + AuctionTile.js.
// Each tile is a PixDiv with a bg-beanBrownCard (#764728) override and white
// text, a favicon + domain, a black/20 stats strip (pooled USD + holders in the
// Retro number font), and a coin-pile image. Rank 1 gets the green "winning..."
// badge + smoker bean + pumped-up-size pulse. Card DOM nodes are registered by
// id so FlyingBeans can measure/highlight them.

"use client";

import PixDiv from "./PixDiv";
import PixButton from "./PixButton";
import WebsiteIcon from "./WebsiteIcon";
import { SampleBeanSVG, SearchIcon, ShoutingBean } from "./svgs";
import { GRID_PRELAUNCHES, SOL_PRICE, type Prelaunch } from "./data";
import { formatNumberToShortString, getCoinPileImage } from "./helpers";
import styles from "./beans.module.css";

const AuctionTile = ({
  p,
  coinPileImage,
  cardRef,
}: {
  p: Prelaunch;
  coinPileImage: string;
  cardRef: (el: HTMLDivElement | null) => void;
}) => {
  const isTop = p.rank === 1;

  return (
    <PixDiv
      forwardRef={cardRef}
      className={`relative select-none flex flex-col flex-1 min-w-[300px] max-w-[450px] bg-[#764728] transition-all sm:hover:scale-[1.02] cursor-pointer ${
        isTop ? styles.pumpedUpSize : ""
      }`}
    >
      {isTop && (
        <div className="absolute -top-3 -left-0 flex gap-2 items-center self-end z-[2] border border-black">
          <div className={`pr-3 pl-1 bg-[#5AE000] text-black self-start text-sm rounded-sm flex items-center gap-2 py-[2px]`}>
            <ShoutingBean className="w-4" />
            <p>winning...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 p-1 flex-1">
        <div className="flex justify-between items-start mt-2 flex-1 gap-1">
          <div className="flex flex-col gap-1 py-1 px-2 flex-1 overflow-hidden">
            <div className="flex gap-3 items-center">
              <WebsiteIcon domainName={p.domainName} size={24} />
              <p className={`text-white text-xl font-semibold truncate`}>
                {p.domainName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 pr-1">
            <div className={`px-1 text-sm bg-[#5AE000] border-2 border-black text-black font-semibold cursor-pointer hover:bg-black hover:text-[#5AE000] transition-all`}>
              +0.1
            </div>
            <div className={`px-1 text-sm bg-[#5AE000] border-2 border-black text-black font-semibold cursor-pointer hover:bg-black hover:text-[#5AE000] transition-all`}>
              +1 SOL
            </div>
          </div>
        </div>

        <div className="flex items-center bg-black/20">
          <div className="flex-col flex flex-1 gap-1 p-2">
            <p className={`text-white/70 text-sm`}>
              Pooled SOL:{" "}
              <span className={`text-white ${styles.number}`}>
                ${formatNumberToShortString(p.totalBetAmount * SOL_PRICE)}
              </span>
            </p>
            <p className={`text-white/70 text-sm`}>
              Holders:{" "}
              <span className={`text-white ${styles.number}`}>
                {p.numHolders}
              </span>
            </p>
          </div>
          <div className="pr-1 relative h-[60px] w-[110px]">
            {isTop && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                src="/showcase/beans/smoker-bean.png"
                className="h-[80px] absolute bottom-2 right-0 z-0"
              />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              src={coinPileImage}
              className="absolute w-[100px] bottom-0 object-contain p-1 z-[1]"
            />
          </div>
        </div>
      </div>
    </PixDiv>
  );
};

const Auctions = ({
  registerCard,
}: {
  registerCard: (id: number, el: HTMLDivElement | null) => void;
}) => {
  const highestBet = GRID_PRELAUNCHES[0]?.totalBetAmount;
  const lowestBet =
    GRID_PRELAUNCHES[GRID_PRELAUNCHES.length - 1]?.totalBetAmount;

  return (
    <div className="flex flex-col gap-9">
      {/* Add-a-website + search row (Domains.js) */}
      <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start pt-2">
        <PixButton className={`items-center flex gap-2 p-2 py-[6px] px-3`}>
          <span className="inline-flex items-center gap-2 relative z-10">
            <SampleBeanSVG className="w-4 h-4" />
            <p>Add a website</p>
          </span>
        </PixButton>
        <PixDiv className="flex items-center gap-4 p-2 self-center max-w-[240px] w-full">
          <SearchIcon className="w-4 h-4 text-black ml-1" />
          <span className={`flex-1 text-sm font-light text-black/60`}>
            Search for website
          </span>
        </PixDiv>
      </div>

      <div className="relative flex flex-wrap gap-5 sm:gap-7 justify-center md:justify-start pt-3">
        {GRID_PRELAUNCHES.map((p) => {
          const coinPileImage = getCoinPileImage(
            p.totalBetAmount,
            highestBet,
            lowestBet
          );
          return (
            <AuctionTile
              key={p.id}
              p={p}
              coinPileImage={coinPileImage}
              cardRef={(el) => registerCard(p.id, el)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Auctions;
