"use client";

import { ReactNode, useEffect, useRef } from "react";

// Verbatim port of src/Components/shared/ExpandableBox.tsx. The outer div's
// height is set imperatively to the inner wrapper's measured clientHeight (or
// 0), and `transition-all duration-500` animates the resize. The `refresh`
// counter forces re-measurement so the box re-fits when its content changes -
// this is the load-bearing mechanic of the toast.
const ExpandableBox = ({
  children,
  show,
  className = "",
  refresh,
}: {
  children?: ReactNode;
  show: boolean;
  className?: string;
  refresh?: number;
}) => {
  const growDiv = useRef<HTMLDivElement | null>(null);
  const wrapper = useRef<HTMLDivElement | null>(null);

  const growOrShrink = (show: boolean) => {
    if (!growDiv.current) return;
    if (!show) {
      growDiv.current.style.height = "0";
    } else {
      growDiv.current.style.height = (wrapper.current?.clientHeight ?? 0) + "px";
    }
  };

  useEffect(() => {
    growOrShrink(show);
  }, [show, refresh]);

  return (
    <div
      className={[
        " transition-all duration-500 ",
        show ? "visible fade-in" : " collapse ",
        className,
      ].join(" ")}
      ref={growDiv}
    >
      <div ref={wrapper}>{show && children}</div>
    </div>
  );
};

export default ExpandableBox;
