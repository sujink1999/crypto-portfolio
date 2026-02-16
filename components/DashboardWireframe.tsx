export default function DashboardWireframe() {
  return (
    <svg
      viewBox="0 0 520 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[480px] h-auto"
    >
      {/* Browser window frame */}
      <rect
        x="16"
        y="16"
        width="488"
        height="528"
        rx="12"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />

      {/* Title bar */}
      <line
        x1="16"
        y1="56"
        x2="504"
        y2="56"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
      />

      {/* Window dots */}
      <circle cx="44" cy="36" r="5" fill="rgba(255,255,255,0.08)" />
      <circle cx="66" cy="36" r="5" fill="rgba(255,255,255,0.06)" />

      {/* URL bar */}
      <rect
        x="90"
        y="28"
        width="120"
        height="16"
        rx="8"
        fill="rgba(255,255,255,0.05)"
      />

      {/* Sidebar */}
      <rect
        x="16"
        y="56"
        width="80"
        height="488"
        fill="rgba(255,255,255,0.02)"
      />
      <line
        x1="96"
        y1="56"
        x2="96"
        y2="544"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
      />

      {/* Sidebar nav items */}
      <rect
        x="32"
        y="80"
        width="48"
        height="48"
        rx="10"
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="0.5"
      />
      <rect
        x="32"
        y="144"
        width="48"
        height="48"
        rx="10"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="0.5"
      />
      <rect
        x="32"
        y="208"
        width="48"
        height="48"
        rx="10"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="0.5"
      />

      {/* Main content area — large card */}
      <rect
        x="116"
        y="76"
        width="372"
        height="240"
        rx="10"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        fill="rgba(255,255,255,0.015)"
      />

      {/* Card header bar */}
      <rect
        x="136"
        y="96"
        width="160"
        height="14"
        rx="7"
        fill="rgba(255,255,255,0.06)"
      />

      {/* Two smaller cards */}
      <rect
        x="116"
        y="336"
        width="178"
        height="140"
        rx="10"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        fill="rgba(255,255,255,0.015)"
      />
      <rect
        x="310"
        y="336"
        width="178"
        height="140"
        rx="10"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        fill="rgba(255,255,255,0.015)"
      />

      {/* Bottom text lines */}
      <rect
        x="116"
        y="496"
        width="280"
        height="8"
        rx="4"
        fill="rgba(255,255,255,0.04)"
      />
      <rect
        x="116"
        y="516"
        width="200"
        height="8"
        rx="4"
        fill="rgba(255,255,255,0.03)"
      />
    </svg>
  );
}
