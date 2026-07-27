import type { CSSProperties, ReactNode } from "react";

// Card = overflow-hidden rounded-2xl (16px) with a radial gradient fill behind
// content and a rgba(255,255,255,0.03) inner border. gradientPosition="bottom".
export default function GlassCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.03)",
        background:
          "radial-gradient(80% 60% at 50% 85%, rgb(28,28,28) 0%, rgb(8,8,8) 100%)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
