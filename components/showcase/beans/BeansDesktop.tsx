// Main assembly - ports beans-ui src/components/Trade/Domains.js (the
// full-viewport shell) plus the Homepage overlay layers, wired to the
// scripted local activity feed. Renders the pre-launches / live-round view:
// layered sky+land+dirt background, Header, Spotlight (BeansRace), BeanToggle,
// the Auctions grid, the bottom-left StonerBeanActivity notification bean, and
// the FlyingBeans that pop from a card when its activity event fires.
//
// Fonts (verified from source): the production <html> uses Roboto Mono for all
// UI text (layout.js), and only `.font-number` uses the Retro pixel font - so
// numbers render in Retro and everything else in Roboto Mono, matched here.

"use client";

import { useEffect, useRef, useState } from "react";
import { Pixelify_Sans } from "next/font/google";
import Header from "./Header";
import BeanToggle from "./BeanToggle";
import BeansRace from "./BeansRace";
import Auctions from "./Auctions";
import StonerBeanActivity from "./StonerBeanActivity";
import FlyingBeans from "./FlyingBeans";
import useFlyingBeans from "./useFlyingBeans";
import { LandSVG } from "./svgs";
import { ACTIVITY_BATCHES, GRID_PRELAUNCHES, type ActivityEvent } from "./data";
import { ACTIVITY_REFRESH_INTERVAL } from "./helpers";
import styles from "./beans.module.css";

// Production page.js wraps the whole app in Pixelify Sans 400 with 0.03em
// letter-spacing (overriding layout.js's Roboto Mono), and the Homepage root
// adds font-light - that's the real global look.
const pixelifySans = Pixelify_Sans({ subsets: ["latin"], weight: "400" });

const BeansDesktop = () => {
  const [beanToggleIndex, setBeanToggleIndex] = useState(1); // pre-launches
  const [hide, setHide] = useState(true); // stoner bean visible (poking up)
  const [activity, setActivity] = useState<ActivityEvent[]>(
    ACTIVITY_BATCHES[0]
  );

  // Registry of auction-card DOM nodes, keyed by domain id, for FlyingBeans.
  const auctionCardsRef = useRef<Record<number, HTMLDivElement | null>>({});
  const registerCard = (id: number, el: HTMLDivElement | null) => {
    auctionCardsRef.current[id] = el;
  };

  const { flyingBeans } = useFlyingBeans({
    auctionCardsRef,
    newActivityData: activity,
    highlightClass: styles.highlightAuctionCard,
  });

  // Push a fresh activity batch every ACTIVITY_REFRESH_INTERVAL, cycling the
  // scripted batches - mirrors production's 5s activity refetch. The same batch
  // drives both the StonerBean bubbles and the FlyingBeans card-pops.
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % ACTIVITY_BATCHES.length;
      setActivity(ACTIVITY_BATCHES[i]);
    }, ACTIVITY_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`${pixelifySans.className} ${styles.root} font-light`}
      style={{ letterSpacing: "0.03em" }}
    >
      {/* Homepage parent: definite height so the background's h-full resolves
          (production gives Domains an h-screen parent). overflow-auto lets the
          content scroll while the layered backdrop scrolls with it. */}
      <div className="relative w-full h-screen overflow-auto bg-[#111111]">
        {/* Domains root - bg-beanBrownDark #91532A (NOT beanDarkBrown #E7CB70) */}
        <div className="flex flex-col items-center w-full pb-0 z-[1] relative bg-[#91532A] min-h-full">
          {/* Layered background: sky (118px) + LandSVG (150px) + dirt.
              inset-0 gives the wrapper a definite height so flex-1 dirt fills. */}
          <div className="absolute inset-0 w-full flex flex-col justify-end">
            <div
              className="bg-[#73A2FE] transition-all duration-700 w-full shrink-0"
              style={{ height: "118px" }}
            />
            <LandSVG className="h-[150px] w-full z-[1] shrink-0" />
            <div className="flex-1 bg-[#91532A] transition-all duration-700 w-full" />
          </div>

          {/* Foreground content column */}
          <div className="w-full max-w-[1500px] px-2 sm:px-3 mt-1 z-[2] relative">
            <Header />
          </div>

          <div className="flex flex-col flex-1 w-full max-w-[1500px] p-2 sm:p-3 pt-0 z-[2] relative">
            {/* Spotlight - live round */}
            <div className="pt-2">
              <BeansRace />
            </div>

            <div className="flex-[6] flex flex-col pt-8 sm:pt-6 px-1 gap-9">
              <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
                <BeanToggle
                  index={beanToggleIndex}
                  setIndex={setBeanToggleIndex}
                  count={GRID_PRELAUNCHES.length}
                />
              </div>
              <Auctions registerCard={registerCard} />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay: StonerBeanActivity notification bean, pinned to the viewport
          (fixed wrapper so its `absolute` resolves against the viewport). */}
      <div className="fixed inset-0 pointer-events-none z-[3]">
        <div className="pointer-events-auto contents">
          <StonerBeanActivity hide={hide} setHide={setHide} data={activity} />
        </div>
      </div>

      {/* Overlay: transient FlyingBeans sprites (viewport-fixed, z-[2]) */}
      <FlyingBeans flyingBeans={flyingBeans} />
    </div>
  );
};

export default BeansDesktop;
