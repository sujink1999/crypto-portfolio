import type { ReactNode } from "react";
import styles from "./society.module.css";

// Refined iPhone frame: thin bezel, dynamic-island. Default logical viewport
// 393x852; pass width/height to match other devices (e.g. 402x874 for 16 Pro).
export default function PhoneFrame({
  children,
  overlay,
  width = 393,
  height = 852,
}: {
  children: ReactNode;
  overlay?: ReactNode;
  width?: number;
  height?: number;
}) {
  return (
    <div
      className={styles.frameRoot}
      style={{
        width: width + 16,
        // scale-friendly: bezel of 8px around a 393x852 screen
        borderRadius: 60,
        padding: 8,
        background: "linear-gradient(160deg, #2a2a2c 0%, #050505 55%, #1a1a1c 100%)",
        boxShadow:
          "0 40px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.03)",
      }}
    >
      <div
        style={{
          position: "relative",
          width,
          height,
          borderRadius: 52,
          overflow: "hidden",
          backgroundColor: "#000000",
        }}
      >
        {children}

        {/* Dynamic island */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 34,
            borderRadius: 9999,
            backgroundColor: "#000000",
            zIndex: 50,
            pointerEvents: "none",
          }}
        />

        {overlay}
      </div>
    </div>
  );
}
