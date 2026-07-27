import Image from "next/image";
import { FireRegular } from "./icons";
import { STREAK } from "./data";

export default function HomeHeader({
  onOpenStreak,
}: {
  onOpenStreak: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 12,
        paddingBottom: 12,
      }}
    >
      {/* Logo: 40x40 box, contain (letterboxes to ~40x23) */}
      <div
        style={{
          width: 40,
          height: 40,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/showcase/society/vanta-logo.png"
          alt="Vanta"
          width={40}
          height={40}
          style={{ objectFit: "contain", width: 40, height: 40 }}
          priority
        />
      </div>

      {/* Streak pill */}
      <button
        type="button"
        onClick={onOpenStreak}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 9999,
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 8,
          paddingBottom: 8,
          border: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "rgba(0,0,0,0.95)",
          cursor: "pointer",
          transition: "opacity 0.15s ease",
        }}
        onMouseDown={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <FireRegular size={18} color="rgba(255,255,255,0.8)" />
        <span
          style={{
            color: "rgba(255,255,255,0.8)",
            fontWeight: 500,
            fontSize: 13,
            marginLeft: 4,
            lineHeight: 1,
          }}
        >
          {STREAK}
        </span>
      </button>
    </div>
  );
}
