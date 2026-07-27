"use client";

import { useEffect, useState } from "react";
import styles from "./society.module.css";
import { FireFill } from "./icons";
import { STREAK, CADENCE, DAY_LABELS, getMilestoneInfo } from "./data";

function ProgressBar({ progress }: { progress: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setW(progress), 400);
    return () => window.clearTimeout(t);
  }, [progress]);
  return (
    <div
      style={{
        height: 6,
        borderRadius: 9999,
        overflow: "hidden",
        backgroundColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 9999,
          backgroundColor: "rgba(255,255,255,0.7)",
          width: `${w * 100}%`,
          transition: "width 800ms cubic-bezier(0.215,0.61,0.355,1)",
        }}
      />
    </div>
  );
}

function StreakDetailContent() {
  const { current, next, progress, daysToGo } = getMilestoneInfo(STREAK);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Hero */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <FireFill size={20} color="rgba(255,255,255,0.5)" />
          <span
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 10,
              fontWeight: 300,
              textTransform: "uppercase",
              letterSpacing: "4px",
            }}
          >
            Streak
          </span>
        </div>
        <div
          className={styles.streakPop}
          style={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: 96,
            lineHeight: "104px",
            textAlign: "center",
          }}
        >
          {STREAK}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.6)",
            fontWeight: 500,
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {current.name}
        </div>
      </div>

      {/* Milestone progress */}
      <div style={{ paddingLeft: 24, paddingRight: 24, marginTop: 48 }}>
        <ProgressBar progress={progress} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: 12,
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 10,
              fontWeight: 300,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {daysToGo} days to go
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 10,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {next.name}
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.25)",
                fontSize: 9,
                fontWeight: 300,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginTop: 2,
              }}
            >
              Next milestone
            </span>
          </div>
        </div>
      </div>

      {/* Cadence */}
      <div style={{ paddingLeft: 24, paddingRight: 24, marginTop: 48 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {DAY_LABELS.map((label, i) => {
            const active = CADENCE[i] > 0;
            return (
              <div
                key={i}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${
                    active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"
                  }`,
                }}
              >
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: 11,
                    color: active
                      ? "rgba(255,255,255,0.8)"
                      : "rgba(255,255,255,0.2)",
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: 10,
            fontWeight: 300,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginTop: 16,
            textAlign: "left",
          }}
        >
          Last 7 Days
        </div>
      </div>
    </div>
  );
}

export default function StreakDetail({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  const [closing, setClosing] = useState(false);

  if (!visible) return null;

  function handleDismiss() {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onDismiss();
    }, 300);
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={handleDismiss}
        className={closing ? styles.backdropOut : styles.backdropIn}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.95)",
          border: "none",
          padding: 0,
          cursor: "default",
        }}
      />

      {/* Content */}
      <div
        className={closing ? styles.sheetOut : styles.sheetIn}
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StreakDetailContent />

        {/* Bottom Close button */}
        <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 48 }}>
          <button
            type="button"
            onClick={handleDismiss}
            style={{
              width: "100%",
              borderRadius: 9999,
              overflow: "hidden",
              border: "none",
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: 32,
              paddingRight: 32,
              background:
                "radial-gradient(50% 80% at 50% 50%, #1a1a1a, #111111)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 56,
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontWeight: 500,
                fontSize: 15,
                lineHeight: "24px",
              }}
            >
              Close
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
