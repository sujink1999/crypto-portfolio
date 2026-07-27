// Ported from beans-ui src/components/Trade/StonerBeanActivity.js.
// A stoner bean pinned bottom-left that pops PixDiv speech bubbles announcing
// live activity. `data` is a fresh batch every ACTIVITY_REFRESH_INTERVAL; the
// bean cycles through it (each item shown for its computed duration).

"use client";

import { useEffect, useRef, useState } from "react";
import PixDiv from "./PixDiv";
import { StonerBeanSVG } from "./svgs";
import styles from "./beans.module.css";
import {
  getActivityString,
  getAnimatedActivities,
  isEmpty,
  timeout,
  type AnimatedActivity,
} from "./helpers";
import type { ActivityEvent } from "./data";

const StonerBeanActivity = ({
  hide,
  setHide,
  data,
}: {
  hide: boolean;
  setHide: (v: boolean) => void;
  data: ActivityEvent[];
}) => {
  const [hover, setHover] = useState(false);
  const [itemToShow, setItemToShow] = useState<ActivityEvent | null>(null);
  const [showItem, setShowItem] = useState(false);
  const [uiArray, setUiArray] = useState<AnimatedActivity[]>([]);

  const arrayIndexRef = useRef(0);

  // Each incoming `data` batch bumps a run id (to cancel the in-flight cycle)
  // and is queued as the new animation array - a deliberate sync of an external
  // prop stream into local state.
  useEffect(() => {
    if (isEmpty(data)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUiArray([]);
      return;
    }
    arrayIndexRef.current++;
    setUiArray(getAnimatedActivities(data));
  }, [data]);

  useEffect(() => {
    if (isEmpty(uiArray)) return;

    const currentArrayIndex = arrayIndexRef.current;

    const animate = async () => {
      setShowItem(false);
      await timeout(100);

      for (const entry of uiArray) {
        const { activity, duration } = entry;
        if (currentArrayIndex !== arrayIndexRef.current) return;
        setItemToShow(activity);
        setShowItem(true);
        await timeout(duration);

        if (currentArrayIndex !== arrayIndexRef.current) return;
        setShowItem(false);
        await timeout(100);
      }
    };

    animate();
  }, [uiArray]);

  return (
    <div
      style={{ bottom: hide ? undefined : "-100px" }}
      onClick={() => setHide(!hide)}
      className="select-none absolute -bottom-4 left-10 flex gap-1 hover:bottom-0 transition-all duration-500 z-[3]"
    >
      <div className="flex items-center gap-2 relative">
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <StonerBeanSVG className="cursor-pointer h-[68px] z-10" />
        </div>
        <ActivityBubble itemToShow={itemToShow} show={!hover && showItem} />
        <DetailsBubble show={hover} />
      </div>
    </div>
  );
};

const ActivityBubble = ({
  itemToShow,
  show,
}: {
  itemToShow: ActivityEvent | null;
  show: boolean;
}) => {
  const { message, name, domainName, isPositive, action, event } =
    getActivityString(itemToShow || {});
  return (
    <div className="absolute bottom-8 -right-2 translate-x-full transition-all duration-[250ms]">
      <PixDiv
        style={{
          visibility: show ? "visible" : "hidden",
          opacity: show ? 1 : 0,
          transform: show
            ? "translateX(0) translateY(0) scale(1)"
            : "translateX(-100%) translateY(-5%) scale(0.2)",
          transformOrigin: "bottom right",
          backgroundColor: !isPositive ? "#FDD1CE" : "#DBF5DB",
        }}
        className="p-2 px-2 whitespace-nowrap transition-all duration-[250ms]"
      >
        <div className={`text-sm text-black pl-1`}>
          <div className="flex flex-col">
            {event === "BetPlaced" ? (
              <p className="text-sm text-black">
                {name?.slice(0, 5)} on {domainName}
              </p>
            ) : (
              <p className="text-sm text-black">
                {name?.slice(0, 5)}
                <br />
                {action} {domainName}
              </p>
            )}
            <p
              className={`text-lg ${styles.number} ${
                isPositive ? "text-[#4CAF50]" : "text-[#F44336]"
              }`}
            >
              {message}
            </p>
          </div>
        </div>
      </PixDiv>
    </div>
  );
};

const DetailsBubble = ({ show }: { show: boolean }) => {
  return (
    <div className="absolute bottom-8 -right-2 translate-x-full transition-all duration-[250ms]">
      <PixDiv
        style={{
          visibility: show ? "visible" : "hidden",
          opacity: show ? 1 : 0,
          transform: show
            ? "translateX(0) translateY(0) scale(1)"
            : "translateX(-100%) translateY(-5%) scale(0.2)",
          transformOrigin: "bottom right",
          backgroundColor: "#D6D6D6",
        }}
        className="p-2 px-2 whitespace-nowrap transition-all duration-[250ms]"
      >
        <div className={`text-sm text-black pl-1 pt-1`}>
          <p className="text-sm text-black">Show Activity</p>
        </div>
      </PixDiv>
    </div>
  );
};

export default StonerBeanActivity;
