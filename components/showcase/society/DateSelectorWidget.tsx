import {
  DAY_PROGRESS,
  VISUAL_DAY,
  TOTAL_DAYS,
  DATE_SUBTEXT,
} from "./data";

const SCREEN_WIDTH = 393;
const BAR_WIDTH = 12;
const BAR_GAP = 6;
const BAR_STEP = BAR_WIDTH + BAR_GAP; // 18
const BAR_HEIGHT = 40;
const WIDGET_HEIGHT = 48;
const FOCUS_CENTER = SCREEN_WIDTH / 2 - BAR_WIDTH / 2; // 190.5
const FADE_WIDTH = SCREEN_WIDTH * 0.4; // 157.2

export default function DateSelectorWidget() {
  const n = DAY_PROGRESS.length;
  const selected = n - 1; // day 24 (centered)
  const base = FOCUS_CENTER - selected * BAR_STEP;

  return (
    <div>
      {/* Label block */}
      <div
        style={{
          color: "#ffffff",
          fontSize: 18,
          fontWeight: 500,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        Day {VISUAL_DAY} / {TOTAL_DAYS}
      </div>
      <div
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: 13,
          fontWeight: 400,
          marginTop: 4,
          marginBottom: 16,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {DATE_SUBTEXT}
      </div>

      {/* Bars container */}
      <div
        style={{
          position: "relative",
          width: SCREEN_WIDTH,
          height: WIDGET_HEIGHT,
          overflow: "hidden",
        }}
      >
        {DAY_PROGRESS.map((progress, i) => {
          const d = Math.abs(i - selected);
          const opacity = Math.max(0.4, 1 - 0.3 * d);
          const scaleY = Math.max(1, 1.2 - 0.1 * d);
          const left = base + i * BAR_STEP;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left,
                top: (WIDGET_HEIGHT - BAR_HEIGHT) / 2,
                width: BAR_WIDTH,
                height: BAR_HEIGHT,
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 4,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                opacity,
                transform: `scaleY(${scaleY})`,
                transformOrigin: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: progress * BAR_HEIGHT,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: 4,
                }}
              />
            </div>
          );
        })}

        {/* Edge fades */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: FADE_WIDTH,
            height: "100%",
            zIndex: 30,
            pointerEvents: "none",
            background:
              "linear-gradient(to right, #000 0%, #000 20%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: FADE_WIDTH,
            height: "100%",
            zIndex: 30,
            pointerEvents: "none",
            background:
              "linear-gradient(to right, transparent 0%, #000 80%, #000 100%)",
          }}
        />
      </div>
    </div>
  );
}
