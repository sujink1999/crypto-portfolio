// Ported verbatim from beans-ui src/components/Trade/BeansRace/RollingBackground.js.
// A 1000px-tall column of random trees/bushes/dots pinned at top:-750px,
// scrolling down (slideDown 4s linear infinite) for the running-track illusion.

"use client";

import { Fragment, useEffect, useState } from "react";
import { RaceBush, RaceTree } from "./svgs";
import styles from "./beans.module.css";

type ObjType = "tree" | "bush" | "light" | "dark";
type ObjPos = { type: ObjType; top: string; left: string };

const rand = () => Math.random() * 100 + "%";

const getRandomObjectPositions = (): ObjPos[] => {
  const spec: ObjType[] = [
    "tree",
    "tree",
    "tree",
    "bush",
    "bush",
    "bush",
    "bush",
    "bush",
    "light",
    "light",
    "light",
    "light",
    "light",
    "light",
    "dark",
    "dark",
    "dark",
    "dark",
    "dark",
    "dark",
  ];
  return spec.map((type) => ({ type, top: rand(), left: rand() }));
};

const RollingBackground = () => {
  const [objectPositions, setObjectPositions] = useState<ObjPos[][]>([]);

  useEffect(() => {
    const bg1 = getRandomObjectPositions();
    const bg2 = getRandomObjectPositions();
    const bg3 = getRandomObjectPositions();
    // Random positions must be generated on the client only (post-mount) to
    // avoid a server/client hydration mismatch, so this setState in effect is
    // intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setObjectPositions([bg1, bg2, bg3, bg1]);
  }, []);

  return (
    <div
      className={`flex flex-col absolute w-full ${styles.rollingBg}`}
      style={{ height: "1000px", top: "-750px" }}
    >
      {objectPositions.map((bgPositions, index) => (
        <div key={index} className="h-[250px] relative">
          {bgPositions.map((position, i) => (
            <Fragment key={i}>
              {position.type === "tree" && (
                <RaceTree
                  style={{ top: position.top, left: position.left }}
                  className="absolute w-[30px]"
                />
              )}
              {position.type === "bush" && (
                <RaceBush
                  style={{ top: position.top, left: position.left }}
                  className="absolute w-[20px]"
                />
              )}
              {position.type === "light" && (
                <div
                  style={{ top: position.top, left: position.left }}
                  className="absolute w-1 h-1 bg-[#A27242]"
                />
              )}
              {position.type === "dark" && (
                <div
                  style={{ top: position.top, left: position.left }}
                  className="absolute w-1 h-1 bg-[#965513]"
                />
              )}
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RollingBackground;
