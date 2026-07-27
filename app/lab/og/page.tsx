import type { Metadata } from "next";
import { acme } from "@/companies/acme";

export const metadata: Metadata = {
  title: "Lab - OG card concepts",
  robots: { index: false, follow: false },
};

const ACCENT = acme.accent;
const COMPANY = acme.company.toUpperCase();
const ROLE = acme.role;

/** SVG noise, inlined so the cards are one static frame - same trick ports to Satori as a PNG overlay. */
/** Coarser noise used as an alpha mask to erode the stamp ink like a real rubber stamp. */
const STAMP_ERODE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.22' numOctaves='3' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='gamma' amplitude='1' exponent='0.45' offset='0.25'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23s)'/%3E%3C/svg%3E\")";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

function Card({
  index,
  name,
  note,
  children,
}: {
  index: string;
  name: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-16">
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
        {index} - {name} · 1200 × 630
      </p>
      <div className="w-full max-w-5xl @container">
        <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-md bg-[#050505] shadow-[0_0_80px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
          {children}
          {/* film grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{ backgroundImage: GRAIN, backgroundSize: "200px 200px" }}
          />
        </div>
      </div>
      <p className="max-w-md text-center text-sm font-light text-white/50">{note}</p>
    </section>
  );
}

/** Placeholder wordmark standing in for the company logo asset. */
function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-tight ${className}`}>
      acme<span style={{ color: ACCENT }}>.</span>
    </span>
  );
}

function Redacted({ w }: { w: string }) {
  return (
    <span
      aria-hidden
      className="inline-block h-[0.72em] translate-y-[0.08em] rounded-[1px] bg-white/80"
      style={{ width: w }}
    />
  );
}

export default function OgLabPage() {
  return (
    <div className="bg-black text-white">
      {/* ----------------- 1 · THE CLASSIFIED DOCUMENT ----------------- */}
      <Card
        index="OG-01"
        name="The classified document - letterhead + watermark"
        note="Their logo twice: official letterhead top-left, and a giant ghost watermark behind the redactions - unmistakably THEIR file. Accent reserved for the stamp and the one readable line."
      >
        {/* cold paper-in-the-dark light */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 30% 0%, rgba(255,255,255,0.07), transparent 60%)",
          }}
        />
        {/* giant company watermark - the file is ABOUT them */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <Wordmark className="rotate-[-8deg] text-[26cqw] leading-none text-white/[0.045]" />
        </div>
        {/* classification strip */}
        <div
          className="absolute inset-x-0 top-0 flex items-center justify-center gap-[2cqw] py-[0.9cqw] font-mono text-[1.05cqw] tracking-[0.5em]"
          style={{ background: `${ACCENT}1a`, color: ACCENT }}
        >
          <span>/// CONFIDENTIAL</span>
          <span className="text-white/25">·</span>
          <span>EYES ONLY</span>
          <span className="text-white/25">·</span>
          <span>{COMPANY} INTERNAL ///</span>
        </div>

        <div className="absolute inset-0 flex flex-col justify-between px-[5cqw] pt-[6cqw] pb-[3.4cqw] font-mono">
          {/* letterhead: their logo owns the header */}
          <div className="flex items-end justify-between border-b border-white/15 pb-[1.8cqw]">
            <div className="flex items-center gap-[2cqw]">
              <Wordmark className="text-[4.2cqw] leading-none text-white" />
              <div className="h-[3cqw] w-px bg-white/20" />
              <div className="space-y-[0.5cqw] text-[1.15cqw] tracking-[0.3em] text-white/40">
                <p>TALENT ACQUISITION</p>
                <p>DOSSIER № 0087</p>
              </div>
            </div>
            <div
              className="rotate-[5deg] border-2 px-[1.3cqw] py-[0.55cqw] text-[1.5cqw] tracking-[0.3em]"
              style={{
                borderColor: ACCENT,
                color: ACCENT,
                boxShadow: `0 0 3cqw ${ACCENT}33, inset 0 0 1.5cqw ${ACCENT}1a`,
              }}
            >
              CLASSIFIED
            </div>
          </div>

          {/* subject + redacted body */}
          <div className="space-y-[1.7cqw] text-[1.85cqw] leading-none text-white/70">
            <p className="text-[1.5cqw] tracking-[0.25em] text-white/45">
              RE: OPEN {ROLE.toUpperCase()} POSITION
            </p>
            <p className="flex items-center gap-[0.9cqw]">
              <span className="text-[1.2cqw] text-white/30">01</span>
              <Redacted w="30cqw" /> <Redacted w="12cqw" />
            </p>
            <p className="flex items-center gap-[0.9cqw]">
              <span className="text-[1.2cqw] text-white/30">02</span>
              <Redacted w="15cqw" />
              <span className="tracking-[0.12em] text-white">
                candidate located
                <span style={{ color: ACCENT }}>.</span>
              </span>
              <Redacted w="9cqw" />
            </p>
            <p className="flex items-center gap-[0.9cqw]">
              <span className="text-[1.2cqw] text-white/30">03</span>
              <Redacted w="22cqw" />
              <span
                className="tracking-[0.12em]"
                style={{ color: ACCENT }}
              >
                recommend immediate contact
              </span>
            </p>
          </div>

          {/* footer */}
          <div className="flex items-end justify-between border-t border-white/15 pt-[1.5cqw] text-[1.15cqw] tracking-[0.25em] text-white/35">
            <span>SOURCE: SUJIN · FULL-STACK ENGINEER</span>
            <span style={{ color: ACCENT }}>OPEN TO DECLASSIFY →</span>
          </div>
        </div>
      </Card>

      {/* ----------------- 1B · THE DOSSIER COVER ----------------- */}
      <Card
        index="OG-01B"
        name="The dossier cover - logo as the seal"
        note="Alternate: not a memo page but the folder COVER. Their logo sits dead-center like an agency seal inside a ring; everything else is filing furniture. Weirder, more cinematic, less text."
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(60% 75% at 50% 45%, ${ACCENT}1f, transparent 70%)`,
          }}
        />
        {/* corner registration marks */}
        {[
          "top-[2.6cqw] left-[2.6cqw] border-t border-l",
          "top-[2.6cqw] right-[2.6cqw] border-t border-r",
          "bottom-[2.6cqw] left-[2.6cqw] border-b border-l",
          "bottom-[2.6cqw] right-[2.6cqw] border-b border-r",
        ].map((pos) => (
          <div
            key={pos}
            aria-hidden
            className={`absolute h-[2.4cqw] w-[2.4cqw] border-white/25 ${pos}`}
          />
        ))}

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[2.6cqw] font-mono">
          <p className="text-[1.25cqw] tracking-[0.55em] text-white/40">
            PERSONNEL DOSSIER · DO NOT DISTRIBUTE
          </p>

          {/* the seal: their logo ringed like an agency crest */}
          <div className="relative flex items-center justify-center">
            <div
              className="flex h-[24cqw] w-[24cqw] items-center justify-center rounded-full border"
              style={{ borderColor: `${ACCENT}55`, boxShadow: `0 0 5cqw ${ACCENT}22` }}
            >
              <div className="flex h-[19.5cqw] w-[19.5cqw] items-center justify-center rounded-full border border-white/15">
                <Wordmark className="text-[7cqw] leading-none text-white" />
              </div>
            </div>
            {/* stamp: inked rubber-stamp CLASSIFIED across the seal's lower edge */}
            <div
              className="absolute bottom-[2.4cqw] right-[-16.5cqw] rotate-[-9deg]"
              style={{
                color: "#e03131",
                maskImage: STAMP_ERODE,
                WebkitMaskImage: STAMP_ERODE,
                maskSize: "26cqw 26cqw",
                WebkitMaskSize: "26cqw 26cqw",
              }}
            >
              {/* double frame, like the die of the stamp */}
              <div
                className="whitespace-nowrap rounded-[0.6cqw] border-[0.42cqw] border-current p-[0.35cqw]"
              >
                <div className="rounded-[0.35cqw] border-[0.22cqw] border-current px-[1.6cqw] py-[0.3cqw] font-sans text-[2.6cqw] font-extrabold uppercase leading-none tracking-[0.14em]">
                  Classified
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[1.6cqw] text-[1.2cqw] tracking-[0.35em] text-white/45">
            <span>RE: {ROLE.toUpperCase()}</span>
            <span className="text-white/20">|</span>
            <span style={{ color: ACCENT }}>OPEN TO DECLASSIFY →</span>
          </div>
        </div>
      </Card>

      {/* ----------------- 2 · THE WRONG-PLACE LOGO ----------------- */}
      <Card
        index="OG-02"
        name="The wrong-place logo"
        note="Their logo, enormous, somewhere it shouldn't be - a black room with one light source. Five words total. The dissonance is the whole card."
      >
        {/* single breathing light source behind the mark */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(55% 70% at 50% 42%, ${ACCENT}2e, transparent 70%)`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 90% at 50% 120%, rgba(0,0,0,0.9), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3.4cqw]">
          <Wordmark className="text-[11cqw] leading-none text-white" />
          <div
            className="h-px w-[10cqw]"
            style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }}
          />
          <p className="font-mono text-[1.7cqw] tracking-[0.45em] text-white/70">
            WE NEED TO TALK
          </p>
        </div>
        <p className="absolute bottom-[3.2cqw] left-1/2 -translate-x-1/2 font-mono text-[1.1cqw] tracking-[0.3em] text-white/30">
          SUJIN · FULL-STACK ENGINEER
        </p>
      </Card>

      {/* ----------------- 3 · THE LOADING SCREEN ----------------- */}
      <Card
        index="OG-03"
        name="The loading screen"
        note="A paused moment - the bar is stuck at 87% and clicking feels like the only way to finish it. Fake interactivity is the closest a still image gets to motion."
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(70% 55% at 50% 60%, ${ACCENT}14, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3cqw] font-mono">
          <p className="text-[1.5cqw] tracking-[0.45em] text-white/50">
            ASSEMBLING CANDIDATE FOR {COMPANY}
          </p>

          {/* the bar */}
          <div className="relative h-[1.1cqw] w-[52cqw] overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 left-0 w-[87%] rounded-full"
              style={{
                background: `linear-gradient(90deg, ${ACCENT}66, ${ACCENT})`,
                boxShadow: `0 0 2.5cqw ${ACCENT}aa`,
              }}
            />
          </div>

          <div className="flex w-[52cqw] items-baseline justify-between text-[1.2cqw] tracking-[0.25em] text-white/40">
            <span className="text-white/60">87%</span>
            <span>
              LOADING: {ROLE.toUpperCase().replace(/ /g, "_")}
            </span>
          </div>

          <p className="mt-[1.5cqw] text-[1.15cqw] tracking-[0.3em] text-white/30">
            [ OPEN LINK TO COMPLETE ]
          </p>
        </div>
        {/* terminal chrome corners */}
        <p className="absolute top-[2.6cqw] left-[3cqw] font-mono text-[1.1cqw] tracking-[0.25em] text-white/25">
          SUJIN.BUILD
        </p>
        <p className="absolute top-[2.6cqw] right-[3cqw] font-mono text-[1.1cqw] tracking-[0.25em] text-white/25">
          PID 001 · {COMPANY}
        </p>
      </Card>
    </div>
  );
}
