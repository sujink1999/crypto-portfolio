"use client";

import React, { useEffect, useRef, useState } from "react";
import { GolfBridge } from "./svgs";

function getBallPosition(percent: number) {
  const bottomFactor = percent > 50 ? 100 - percent : percent;
  const coeff = bottomFactor > 25 ? 50 - bottomFactor : bottomFactor;
  const bottom = (bottomFactor / 50) * 75 + coeff * 0.6;

  return {
    left: `${percent.toFixed(0)}%`,
    bottom: `${bottom.toFixed(0)}%`,
  };
}

function secondsToText(seconds: number): string {
  if (seconds <= 0) return "< 1 min";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

interface BridgeGolfAnimationProps {
  startTimestamp: number | null;
  totalTime: number;
  isCompleted: boolean;
  assetImage: string;
}

export default function BridgeGolfAnimation({
  startTimestamp,
  totalTime,
  isCompleted,
  assetImage,
}: BridgeGolfAnimationProps) {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [percent, setPercent] = useState(0);
  const [easedPercent, setEasedPercent] = useState(0);
  const easingRef = useRef(false);

  useEffect(() => {
    if (elapsedTime > totalTime || isCompleted) {
      if (timer.current) clearInterval(timer.current);
    }
    let pValue = 0;
    if (startTimestamp && totalTime) {
      pValue = Math.min(Math.round((elapsedTime / totalTime) * 100), 90);
    }
    if (isCompleted) {
      pValue = 100;
    }
    setPercent(pValue);
  }, [elapsedTime, isCompleted, startTimestamp, totalTime]);

  useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    if (isCompleted || !startTimestamp) return;

    const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
    setElapsedTime(elapsed);
    timer.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [startTimestamp, isCompleted]);

  useEffect(() => {
    if (easingRef.current) return;
    startEasing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percent]);

  useEffect(() => {
    if (easingRef.current) return;
    startEasing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [easedPercent]);

  const startEasing = () => {
    const diff = percent - easedPercent;
    const signMultiple = diff > 0 ? 1 : -1;
    if (diff * signMultiple) {
      easingRef.current = true;
      let nextPercent = easedPercent;
      const easeInterval = setInterval(() => {
        nextPercent =
          nextPercent +
          signMultiple * Math.min(15, Math.abs(percent - nextPercent));

        if (nextPercent >= percent) {
          clearInterval(easeInterval);
          easingRef.current = false;
        }
        setEasedPercent(nextPercent);
      }, 1000);
    } else {
      setEasedPercent(percent);
    }
  };

  const getStatusText = () => {
    if (isCompleted) return "Hole-in-one!";
    if (elapsedTime >= totalTime) return "Waiting for confirmation";
    const text = secondsToText(totalTime - elapsedTime);
    const showApprox = text !== "< 1 min";
    return `${showApprox ? "~ " : ""}${text} remaining`;
  };

  const hasStarted = percent > 0;
  const hasEnded = easedPercent === 100;

  return (
    <div className="w-full relative h-[103px]">
      <div className="absolute w-[315px] h-[88px] z-20 left-1/2 -translate-x-1/2">
        <div
          style={getBallPosition(easedPercent)}
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-[1s] ease-linear"
        >
          <div
            className={`bg-white w-6 h-6 rounded-full ${
              hasStarted && !hasEnded ? "animate-spin" : ""
            } flex justify-center items-center`}
          >
            <div
              className="w-5 h-5 rounded-full bg-[#374151]"
              style={{
                backgroundImage: assetImage ? `url(${assetImage})` : undefined,
                backgroundSize: "cover",
              }}
            />
          </div>
        </div>
        <p className="absolute left-1/2 bottom-[30px] text-sm text-white -translate-x-1/2 whitespace-nowrap">
          {getStatusText()}
        </p>
      </div>
      <GolfBridge className="absolute bottom-0 w-full z-10" />
    </div>
  );
}
