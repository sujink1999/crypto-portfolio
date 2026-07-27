// Ported verbatim from beans-ui src/components/Trade/BeansRace/RunningBean.js.
// Two effects animate each runner:
//  1. every 1000ms a random top/left offset is applied, transitioned over
//     `transition-all duration-1000` - the "bounce/jump".
//  2. BeanRunningSVG's built-in <animateTransform> runs the legs natively.

"use client";

import { useEffect, useState } from "react";
import { BeanRunningSVG } from "./svgs";
import WebsiteIcon from "./WebsiteIcon";

const RunningBean = ({
  top,
  left,
  domainName,
}: {
  top: number;
  left: number;
  domainName: string;
}) => {
  const [offset, setOffset] = useState({ topOffset: 0, leftOffset: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset({
        topOffset: Math.random() * 20 - 5,
        leftOffset: Math.random() * 2 - 1,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        top: `${top + offset.topOffset}%`,
        left: `${left + offset.leftOffset}%`,
      }}
      className="absolute top-10 transition-all duration-1000"
    >
      <div className="w-7 h-7 rounded-full absolute -top-5 left-1/2 -translate-x-1/2">
        <WebsiteIcon domainName={domainName} size={28} fallbackClassName="rounded-full" />
      </div>
      <BeanRunningSVG className="h-7" />
    </div>
  );
};

export default RunningBean;
