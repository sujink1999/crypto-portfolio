// Ported from beans-ui src/hooks/useFlyingBeans.js.
// On each new activity batch: briefly highlights the matching auction card
// (measured from its DOM ref) and spawns a transient bean sprite that pops out
// of the card and flies away. Positions come from getBoundingClientRect, so the
// sprites must be rendered in a viewport-fixed overlay (see FlyingBeans).

"use client";

import { useEffect, useState, type RefObject } from "react";
import { isEmpty } from "./helpers";
import type { ActivityEvent } from "./data";

export const FLYING_BEANS_ANIMATION_DURATION = 1500;

export type FlyingBean = {
  id: string;
  top: number;
  left: number;
  randomX: number;
  isPositive: boolean;
};

const useFlyingBeans = ({
  auctionCardsRef,
  newActivityData,
  highlightClass,
}: {
  auctionCardsRef: RefObject<Record<number, HTMLElement | null>>;
  newActivityData: ActivityEvent[];
  highlightClass: string;
}) => {
  const [flyingBeans, setFlyingBeans] = useState<FlyingBean[]>([]);

  useEffect(() => {
    if (isEmpty(newActivityData)) return;
    if (typeof document !== "undefined" && document.hidden) return;

    setFlyingBeans([]);

    const domains: Record<number, string> = {};
    newActivityData.forEach((activity) => {
      const { type, domainId } = activity || {};
      domains[domainId] = type === "UserWithdraw" ? "negative" : "positive";
    });

    Object.keys(domains).forEach((domainId) => {
      animateContainer(Number(domainId));
    });

    newActivityData.forEach((activity) => {
      addFlyingBean(activity.domainId, activity.event);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newActivityData]);

  const animateContainer = (domainId: number) => {
    const container = auctionCardsRef.current[domainId];
    if (!container) return;
    container.classList.add(highlightClass);
    setTimeout(() => {
      container.classList.remove(highlightClass);
    }, 500);
  };

  const addFlyingBean = (domainId: number, event: string) => {
    const container = auctionCardsRef.current[domainId];
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerTop = containerRect.top;
    const containerBottom = containerRect.bottom;

    if (containerTop < 0 && containerBottom < 0) return;

    const id =
      Date.now() + "-" + domainId + "-" + Math.random() + Math.random();

    const randomX =
      Math.random() < 0.5
        ? Math.random() * 300 - 500 // -500 to -200
        : Math.random() * 300 + 200; // 200 to 500

    const randomLeft = Math.random() * (containerRect.width - 40) + 20;

    setFlyingBeans((prev) => [
      ...prev,
      {
        id,
        top: containerRect.top + containerRect.height - 30,
        left: containerRect.left + containerRect.width - randomLeft,
        randomX,
        isPositive: event !== "UserWithdraw",
      },
    ]);

    setTimeout(() => {
      setFlyingBeans((prev) => prev.filter((div) => div.id !== id));
    }, FLYING_BEANS_ANIMATION_DURATION - 200);
  };

  return { flyingBeans };
};

export default useFlyingBeans;
