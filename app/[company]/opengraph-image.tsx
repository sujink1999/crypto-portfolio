import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { COMPANIES } from "@/companies";

function logoDataUri(slug: string): string | null {
  for (const [ext, mime] of [
    ["png", "image/png"], ["jpg", "image/jpeg"], ["webp", "image/webp"],
  ] as const) {
    const p = join(process.cwd(), "public", "logos", `${slug}.${ext}`);
    if (existsSync(p)) return `data:${mime};base64,${readFileSync(p).toString("base64")}`;
  }
  return null;
}

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
  const logo = logoDataUri(company);

  const name = pitch.company.toLowerCase();
  /* the wordmark owns the card - step down only as far as the name forces */
  const wordmarkSize =
    name.length > 14 ? 120 : name.length > 10 ? 160 : name.length > 7 ? 200 : 240;

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

        {/* the wordmark owns the card, unless a real logo is available */}
        {logo ? (
           
          <img src={logo} width={260} height={260} style={{ borderRadius: 40, objectFit: "contain" }} alt="" />
        ) : (
          <div
            style={{
              display: "flex",
              fontSize: wordmarkSize,
              fontWeight: 600,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            {name}
            <span style={{ color: accent }}>.</span>
          </div>
        )}

        {/* classified: stamped in red across the lower half of the name */}
        <div
          style={{
            position: "absolute",
            top: "56%",
            display: "flex",
            transform: "rotate(-7deg)",
            border: "6px solid #dc2626",
            color: "#dc2626",
            padding: "14px 36px",
            fontSize: 58,
            letterSpacing: "0.3em",
            fontWeight: 700,
            backgroundColor: "rgba(5,5,5,0.55)",
          }}
        >
          CLASSIFIED
        </div>
      </div>
    ),
    size,
  );
}
