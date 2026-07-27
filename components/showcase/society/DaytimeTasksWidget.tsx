import GlassCard from "./GlassCard";
import { MoonOutline, TaskIcon } from "./icons";
import { TASKS, TIME_UNTIL_EVENING, PROGRESS_FILL } from "./data";

export default function DaytimeTasksWidget() {
  return (
    <div style={{ paddingLeft: 12, paddingRight: 12 }}>
      <GlassCard>
        <div style={{ padding: 16 }}>
          {/* Countdown header block */}
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.05)",
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                paddingTop: 16,
                paddingBottom: 16,
                paddingLeft: 12,
                paddingRight: 12,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <MoonOutline size={14} color="rgba(255,255,255,0.6)" />
              <span
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 11,
                  fontWeight: 400,
                  textTransform: "uppercase",
                  letterSpacing: "0.025em",
                }}
              >
                {"Check-in opens in "}
                <span
                  style={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}
                >
                  {TIME_UNTIL_EVENING}
                </span>
              </span>
            </div>
            <div
              style={{ height: 2, backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${PROGRESS_FILL * 100}%`,
                  backgroundColor: "rgba(255,255,255,0.2)",
                }}
              />
            </div>
          </div>

          {/* Section label */}
          <div
            style={{
              marginTop: 16,
              color: "rgba(255,255,255,0.3)",
              fontSize: 11,
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            TODAY&apos;S ROUTINE
          </div>

          {/* Task list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginTop: 16,
            }}
          >
            {TASKS.map((task) => {
              const done = task.status === "done";
              const iconColor = done
                ? "rgba(255,255,255,0.15)"
                : "rgba(255,255,255,0.3)";
              return (
                <div
                  key={task.id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ marginRight: 20, marginLeft: 4, marginTop: 2 }}>
                    <TaskIcon name={task.taskName} size={18} color={iconColor} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        marginBottom: 4,
                        color: done
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(255,255,255,0.8)",
                        textDecoration: done ? "line-through" : "none",
                      }}
                    >
                      {task.command}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div
            style={{
              paddingTop: 16,
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: 11,
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Tap to customize
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
