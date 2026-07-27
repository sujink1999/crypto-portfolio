// Ported verbatim from beans-ui src/components/Trade/BeansRace/BeansRace.js.
// The live-round centerpiece: #724324 arena, green "launch is live" badge,
// RollingBackground, and one RunningBean per contender (two here).

"use client";

import { useMemo } from "react";
import RollingBackground from "./RollingBackground";
import RunningBean from "./RunningBean";
import { PRELAUNCHES } from "./data";
import styles from "./beans.module.css";

const BeansRace = () => {
  // Layout math is deterministic (verbatim from BeansRace.js), so compute it
  // directly rather than in an effect.
  const runningBeans = useMemo(() => {
    const topPrelaunches = PRELAUNCHES.slice(0, 10);
    return topPrelaunches.map((prelaunch, index) => {
      const verticalSpacing = 6;
      const horizontalRange = 95;
      const horizontalStep = horizontalRange / 10;

      const top = index * verticalSpacing + (index !== 0 ? 30 : 15);
      const centerPoint = 45;
      const offset = Math.floor((index + 1) / 2) * horizontalStep;
      const isLeft = index % 2 === 0;
      const left = centerPoint + (isLeft ? -offset : offset);

      return { domainName: prelaunch.domainName, position: { top, left } };
    });
  }, []);

  return (
    <div className="w-full max-w-2xl bg-[#724324] border-[3px] border-black h-[250px] relative overflow-hidden mx-auto">
      <div className={`absolute left-1 top-1 bg-[#5AE000] text-sm z-10 px-2 text-black border-2 border-black`}>
        <p>launch is live</p>
      </div>
      <RollingBackground />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {runningBeans.map((bean) => (
            <RunningBean
              domainName={bean.domainName}
              key={bean.domainName}
              {...bean.position}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeansRace;
