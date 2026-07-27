// Ported verbatim from beans-ui src/components/Trade/PixDiv.js.
// The offset double box-shadow + two 3px corner squares are the signature
// pixel-chrome border used on every card.

import type { CSSProperties, ReactNode } from "react";
import { concatClasses } from "./helpers";

const PixDiv = ({
  children,
  shadowColor = "black",
  className,
  onClick,
  style,
  onMouseEnter,
  onMouseLeave,
  forwardRef,
}: {
  children?: ReactNode;
  shadowColor?: string;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  forwardRef?: (el: HTMLDivElement | null) => void;
}) => {
  return (
    <div
      ref={forwardRef}
      style={{
        boxShadow: `4px 4px 0px ${shadowColor}, -3px -3px 0px ${shadowColor}`,
        ...style,
      }}
      className={concatClasses([
        // Default white bg only when the caller doesn't bring its own bg-*
        // (Tailwind stylesheet order otherwise lets bg-white beat overrides).
        className?.includes("bg-") ? "" : "bg-white",
        "text-black relative border-solid",
        className,
      ])}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
      <div
        style={{ width: 3, height: 3, backgroundColor: shadowColor }}
        className="absolute top-0 right-0"
      />
      <div
        style={{ width: 3, height: 3, backgroundColor: shadowColor }}
        className="absolute bottom-0 left-0"
      />
    </div>
  );
};

export default PixDiv;
