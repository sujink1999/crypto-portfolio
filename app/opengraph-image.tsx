import { ImageResponse } from "next/og";

export const alt = "Sujin K — Full-Stack Crypto Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#111",
              borderRadius: 16,
              border: "1px solid #222",
            }}
          >
            <span style={{ fontSize: 32, color: "#4ade80", fontWeight: 700 }}>
              &lt;/&gt;
            </span>
          </div>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ededed",
            marginBottom: 16,
          }}
        >
          Sujin K
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#888",
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Full-Stack Crypto Engineer & Systems Builder
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 18,
            color: "#444",
          }}
        >
          sujink.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
