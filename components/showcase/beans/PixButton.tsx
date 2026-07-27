// Ported verbatim from beans-ui src/components/Trade/PixButton.js.
// Green pixel button: offset shadow, inner white/20 highlight strips, corner
// squares, hover inverts to black bg / green text.

import type { ReactNode } from "react";
import { concatClasses } from "./helpers";

const PixButton = ({
  children,
  shadowColor = "black",
  className,
  onClick,
  disabled,
  onMouseEnter,
  onMouseLeave,
}: {
  children?: ReactNode;
  shadowColor?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        boxShadow: `4px 4px 0px ${shadowColor}, -3px -3px 0px ${shadowColor}`,
      }}
      className={concatClasses([
        "bg-[#5AE000] text-black py-2 px-3 relative border-solid text-center select-none",
        disabled
          ? "cursor-default opacity-60"
          : "cursor-pointer hover:bg-black hover:text-[#5AE000]",
        className,
      ])}
    >
      {children}
      <div
        style={{ width: 4 }}
        className="absolute top-2 right-0 bg-white/20 bottom-[3px]"
      />
      <div
        style={{ height: 3 }}
        className="left-3 absolute bottom-0 right-0 bg-white/20"
      />
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

export default PixButton;
