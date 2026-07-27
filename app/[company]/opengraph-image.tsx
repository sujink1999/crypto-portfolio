import { ImageResponse } from "next/og";
import { COMPANIES } from "@/companies";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return Object.keys(COMPANIES).map((company) => ({ company }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const pitch = COMPANIES[company];
  return [
    {
      id: 0,
      size,
      contentType,
      alt: pitch ? `An invitation for ${pitch.company}` : "An invitation",
    },
  ];
}

/**
 * The invitation cover: company wordmark as a wax-seal ring, accent light
 * behind it - same voice as the envelope preloader and the page metadata.
 */
export default async function OgImage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const pitch = COMPANIES[company];
  if (!pitch) return new ImageResponse(<div style={{ display: "flex" }} />, size);

  const accent = pitch.accent;
  const mono = {
    letterSpacing: "0.4em",
    color: "rgba(255,255,255,0.45)",
  } as const;

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
          backgroundColor: "#050505",
          backgroundImage: `radial-gradient(circle at 50% 45%, ${accent}1f 0%, rgba(5,5,5,0) 60%)`,
          fontFamily: "sans-serif",
        }}
      >
        {/* corner registration marks */}
        {[
          { top: 30, left: 30, borderTopWidth: 1, borderLeftWidth: 1 },
          { top: 30, right: 30, borderTopWidth: 1, borderRightWidth: 1 },
          { bottom: 30, left: 30, borderBottomWidth: 1, borderLeftWidth: 1 },
          { bottom: 30, right: 30, borderBottomWidth: 1, borderRightWidth: 1 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 30,
              height: 30,
              borderColor: "rgba(255,255,255,0.25)",
              borderStyle: "solid",
              borderWidth: 0,
              ...pos,
            }}
          />
        ))}

        <div style={{ display: "flex", fontSize: 15, ...mono, marginBottom: 34 }}>
          AN INVITATION FOR
        </div>

        {/* the seal + stamp */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 300,
              height: 300,
              borderRadius: 150,
              border: `1px solid ${accent}55`,
              boxShadow: `0 0 60px ${accent}22`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 244,
                height: 244,
                borderRadius: 122,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 84,
                  fontWeight: 600,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                }}
              >
                {pitch.company.toLowerCase()}
                <span style={{ color: accent }}>.</span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 15,
            marginTop: 34,
          }}
        >
          <span style={{ display: "flex", ...mono, letterSpacing: "0.35em" }}>
            RE: {pitch.role.toUpperCase()}
          </span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <span style={{ display: "flex", letterSpacing: "0.35em", color: accent }}>
            A TWO-MINUTE READ →
          </span>
        </div>
      </div>
    ),
    size,
  );
}
