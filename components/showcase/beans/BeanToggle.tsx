// Ported from beans-ui src/components/Trade/BeanToggle.js.
// Segmented tabs (Graduated / pre-launches) with a sliding highlight block and
// bean SVGs that slide up on hover/select. Defaults to the pre-launches tab
// (index 1) which is the live-round screen.

"use client";

import { useState } from "react";
import PixDiv from "./PixDiv";
import { HappyBeanSVG, NurseryBeanSVG } from "./svgs";
import { concatClasses } from "./helpers";
import styles from "./beans.module.css";

const BeanToggle = ({
  index,
  setIndex,
  count,
}: {
  index: number;
  setIndex: (i: number) => void;
  count: number;
}) => {
  return (
    <PixDiv
      className={concatClasses([
        "p-1 flex w-full max-w-[370px] relative transition-all duration-300 z-0 select-none",
        index === 0 ? "bg-white" : "bg-[#9B5E31]",
      ])}
    >
      <div className="absolute top-1 left-1 right-1 bottom-1">
        <div
          style={{
            transform: index === 0 ? "translateX(0)" : "translateX(100%)",
            backgroundColor: index === 0 ? "#5AE000" : "#764728",
          }}
          className="w-1/2 border-2 border-black h-full transition-all duration-300"
        />
      </div>
      <LiveBeanToggleCard isSelected={index === 0} onClick={() => setIndex(0)} />
      <NurseryBeanToggleCard
        isSelected={index === 1}
        onClick={() => setIndex(1)}
        count={count}
      />
    </PixDiv>
  );
};

const LiveBeanToggleCard = ({
  isSelected,
  onClick,
}: {
  isSelected: boolean;
  onClick: () => void;
}) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={concatClasses([
        "text-sm sm:text-base gap-3 flex justify-center items-center flex-1 px-2 py-[6px] overflow-hidden transition-all duration-300 cursor-pointer z-10",
        "border-2 border-transparent",
        !isSelected ? "text-white" : "text-black",
      ])}
    >
      Graduated
      <HappyBeanSVG
        style={{
          transform: isHover || isSelected ? "translateY(0)" : "translateY(150%)",
          visibility: isHover || isSelected ? "visible" : "hidden",
        }}
        className="h-6 transition-all duration-300"
      />
    </div>
  );
};

const NurseryBeanToggleCard = ({
  isSelected,
  onClick,
  count,
}: {
  isSelected: boolean;
  onClick: () => void;
  count: number;
}) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={concatClasses([
        "text-sm sm:text-base gap-3 flex justify-center items-center flex-1 px-2 py-[6px] overflow-hidden transition-all duration-300 cursor-pointer z-10",
        "border-2 border-transparent",
        isSelected ? "text-white" : "text-black",
      ])}
    >
      <p className="pl-4">pre-launches</p>
      <div className="relative">
        {count > 0 && (
          <div
            style={{ opacity: isHover || isSelected ? 0 : 1 }}
            className={`${styles.number} -left-1 pt-[2px] sm:mt-[2px] flex items-center justify-center font-medium min-w-5 h-5 bg-[#E7CB70] text-white absolute top-0 right-0 bottom-0 rounded-lg transition-all duration-300`}
          >
            <p className="text-[10px] sm:text-xs p-1 px-2">{count}</p>
          </div>
        )}
        <NurseryBeanSVG
          style={{
            transform:
              isHover || isSelected ? "translateY(0)" : "translateY(150%)",
            visibility: isHover || isSelected ? "visible" : "hidden",
          }}
          className="h-6 transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default BeanToggle;
