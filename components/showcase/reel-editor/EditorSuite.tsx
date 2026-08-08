"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CAPTIONS,
  DURATION,
  FX,
  SEGMENTS,
  SFX,
} from "./data";

function fmt(t: number) {
  const s = Math.max(0, t);
  const m = Math.floor(s / 60);
  const sec = s - m * 60;
  return `${m}:${sec.toFixed(2).padStart(5, "0")}`;
}

const pct = (t: number) => `${(t / DURATION) * 100}%`;

// sizer for the inspector: the segment with the longest note
const longestSeg = SEGMENTS.reduce((a, b) =>
  b.note.length > a.note.length ? b : a,
);
const wpct = (a: number, b: number) => `${((b - a) / DURATION) * 100}%`;

export default function EditorSuite({
  compact = false,
  autoplay = false,
}: {
  compact?: boolean;
  /** stage exhibits: start playing muted on mount, no play overlay */
  autoplay?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);

  // rAF loop: move the playhead every frame, commit React state at ~12fps
  // so segment/marker/caption states stay cheap.
  useEffect(() => {
    let last = 0;
    const tick = () => {
      const v = videoRef.current;
      if (v) {
        const t = v.currentTime;
        if (playheadRef.current) {
          playheadRef.current.style.left = pct(Math.min(t, DURATION));
        }
        if (timeRef.current) {
          timeRef.current.textContent = fmt(t);
        }
        if (Math.abs(t - last) > 0.08) {
          last = t;
          setTime(t);
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const v = videoRef.current;
    if (!v) return;
    v.loop = true;
    setStarted(true);
    void v.play().catch(() => {});
  }, [autoplay]);

  const seek = useCallback((t: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(t, 0), DURATION - 0.05);
    setTime(v.currentTime);
    if (v.paused) void v.play();
  }, []);

  const onTimelineClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = timelineRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      seek(((e.clientX - rect.left) / rect.width) * DURATION);
    },
    [seek],
  );

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
  }, []);

  const activeSeg = SEGMENTS.find((s) => time >= s.start && time < s.end);
  const activeCaption = CAPTIONS.find((c) => time >= c.start && time <= c.end);

  return (
    <div className="w-full">
      <div
        className={
          compact
            ? "grid grid-cols-[minmax(0,260px)_minmax(0,1fr)] gap-3"
            : "grid gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-6"
        }
      >
        {/* ——— monitor ——— */}
        <div className="re-panel relative overflow-hidden rounded-2xl p-4 md:p-5">
          <div className="re-mono mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[var(--re-t3)]">
            <span>Monitor</span>
            <span>1080 × 1920 · 30fps</span>
          </div>
          <div
            className={`relative mx-auto aspect-[9/16] w-full overflow-hidden rounded-xl border border-[var(--re-line-2)] bg-black ${
              compact ? "max-w-[190px]" : "max-w-[280px]"
            }`}
          >
            <video
              ref={videoRef}
              src="/showcase/reel-editor/claude-edited-this.mp4"
              playsInline
              muted={muted}
              preload="metadata"
              className="h-full w-full object-cover"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onClick={togglePlay}
            />
            {!playing && !autoplay && (
              <button
                type="button"
                onClick={togglePlay}
                aria-label="Play the reel"
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition hover:bg-black/30"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--re-brass-line)] bg-[var(--re-brass-dim)]">
                  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M6 4l10 6-10 6z" fill="var(--re-brass)" />
                  </svg>
                </span>
              </button>
            )}
          </div>
          <div className="re-mono mt-3 flex items-center justify-between text-[11px] text-[var(--re-t2)]">
            <span>
              <span ref={timeRef} className="text-[var(--re-t0)]">0:00.00</span>
              <span className="text-[var(--re-t4)]"> / {fmt(DURATION)}</span>
            </span>
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex items-center gap-1.5 rounded-full border border-[var(--re-line-2)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--re-t2)] transition hover:border-[var(--re-brass-line)] hover:text-[var(--re-t0)]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                {muted ? (
                  <path d="M23 9l-6 6M17 9l6 6" />
                ) : (
                  <path d="M15.5 8.5a5 5 0 010 7M19 5a9 9 0 010 14" />
                )}
              </svg>
              {muted ? "sound" : "mute"}
            </button>
          </div>
          {/* live caption readout */}
          <div className="re-mono mt-4 min-h-[38px] rounded-lg border border-[var(--re-line)] bg-black/40 px-3 py-2 text-[11px] leading-relaxed">
            <span className="text-[var(--re-t4)]">caption </span>
            <span className="text-[var(--re-t1)]">
              {started && activeCaption ? `"${activeCaption.text}"` : "·"}
            </span>
          </div>
        </div>

        {/* ——— inspector ——— */}
        <div className="flex min-w-0 flex-col gap-4">
          <div className="re-panel rounded-2xl p-4 md:p-5">
            <div className="re-mono mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[var(--re-t3)]">
              <span>Inspector · cut.json</span>
              <span className="text-[var(--re-brass)]">
                {activeSeg ? activeSeg.label : "—"}
              </span>
            </div>
            {/* grid stack: an invisible copy of the longest note reserves the
                height, so the panel never resizes as segments change */}
            <div className="grid">
              <div
                aria-hidden
                className="re-mono invisible col-start-1 row-start-1 text-[12px] leading-relaxed"
              >
                <p className="mb-2">{longestSeg.clip} in 00.00 · out 00.00</p>
                <p>{longestSeg.note}</p>
              </div>
              <div className="col-start-1 row-start-1">
                {activeSeg ? (
                  <div className="re-mono text-[12px] leading-relaxed">
                    <p className="mb-2 text-[var(--re-t3)]">
                      {activeSeg.clip}
                      <span className="text-[var(--re-t4)]">
                        {"  "}in {activeSeg.srcIn.toFixed(2)} · out {activeSeg.srcOut.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-[var(--re-t1)]">{activeSeg.note}</p>
                  </div>
                ) : (
                  <p className="re-mono text-[12px] text-[var(--re-t3)]">
                    Press play. The notes you will read here are the AI&apos;s actual
                    editing decisions, verbatim from the cut file it wrote.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* fx feed */}
          <div className="re-panel flex-1 rounded-2xl p-4 md:p-5">
            <div className="re-mono mb-3 text-[10px] uppercase tracking-[0.25em] text-[var(--re-t3)]">
              Effects track · fires in sync
            </div>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {FX.map((fx, i) => {
                const live = time >= fx.at && time <= fx.at + fx.duration;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => seek(Math.max(fx.at - 0.4, 0))}
                    data-state={live ? "live" : undefined}
                    className="re-fxrow re-mono flex items-baseline justify-between gap-2 rounded-md border border-transparent px-2.5 py-1.5 text-left text-[11px] text-[var(--re-t3)] hover:border-[var(--re-line-2)]"
                  >
                    <span className="truncate">
                      <span className="text-[var(--re-brass)]">{fmt(fx.at)}</span>{" "}
                      {fx.component}
                    </span>
                    <span className="hidden shrink-0 text-[10px] text-[var(--re-t4)] sm:inline">
                      {fx.detail}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ——— timeline ——— */}
      <div className="re-panel mt-4 rounded-2xl p-4 md:mt-6 md:p-5">
        <div className="re-mono mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[var(--re-t3)]">
          <span>Timeline · claude-edited-this</span>
          <span className="hidden sm:inline">4 clips · 10 effects · 11 sfx cues · click to seek</span>
        </div>

        <div className="flex gap-3">
          {/* track labels */}
          <div className="re-mono flex w-14 shrink-0 flex-col gap-1.5 pt-6 text-[9px] uppercase tracking-[0.2em] text-[var(--re-t4)]">
            <div className="flex h-12 items-center md:h-14">video</div>
            <div className="flex h-7 items-center">fx</div>
            <div className="flex h-7 items-center">sfx</div>
            <div className="flex h-7 items-center">caption</div>
          </div>

          {/* tracks */}
          <div
            ref={timelineRef}
            onClick={onTimelineClick}
            className="relative min-w-0 flex-1 cursor-crosshair select-none"
          >
            {/* ruler */}
            <div className="re-mono relative h-6 border-b border-[var(--re-line)] text-[9px] text-[var(--re-t4)]">
              {Array.from({ length: 25 }, (_, s) => (
                <span
                  key={s}
                  className="absolute bottom-1 -translate-x-1/2"
                  style={{ left: pct(s) }}
                >
                  {s % 4 === 0 ? `${s}s` : "·"}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 pt-1.5">
              {/* video track */}
              <div className="relative h-12 md:h-14">
                {SEGMENTS.map((seg) => (
                  <button
                    key={seg.start}
                    type="button"
                    data-active={activeSeg === seg}
                    onClick={(e) => {
                      e.stopPropagation();
                      seek(seg.start + 0.01);
                    }}
                    className="re-seg absolute inset-y-0 overflow-hidden rounded-md border border-[var(--re-line-2)] bg-[var(--re-s3)] px-2 py-1 text-left"
                    style={{ left: pct(seg.start), width: wpct(seg.start, seg.end) }}
                  >
                    <span className="re-mono block text-[9px] uppercase tracking-[0.18em] text-[var(--re-t2)]">
                      {seg.label}
                    </span>
                    <span className="re-mono mt-0.5 hidden truncate text-[9px] text-[var(--re-t4)] md:block">
                      {seg.clip}
                    </span>
                  </button>
                ))}
              </div>

              {/* fx track */}
              <div className="relative h-7 rounded-md bg-black/30">
                {FX.map((fx, i) => {
                  const state =
                    time >= fx.at && time <= fx.at + fx.duration
                      ? "live"
                      : time > fx.at
                        ? "past"
                        : "idle";
                  return (
                    <div
                      key={i}
                      data-state={state}
                      title={`${fx.component} @ ${fmt(fx.at)}`}
                      className="re-marker absolute top-1/2 h-3.5 -translate-y-1/2 rounded-sm"
                      style={{
                        left: pct(fx.at),
                        width: `max(${((fx.duration / DURATION) * 100).toFixed(2)}%, 5px)`,
                      }}
                    />
                  );
                })}
              </div>

              {/* sfx track */}
              <div className="relative h-7 rounded-md bg-black/30">
                {SFX.map((cue, i) => {
                  const state =
                    Math.abs(time - cue.at) < 0.35
                      ? "live"
                      : time > cue.at
                        ? "past"
                        : "idle";
                  return (
                    <div
                      key={i}
                      data-state={state}
                      title={`${cue.name} @ ${fmt(cue.at)}`}
                      className="re-marker absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                      style={{ left: pct(cue.at) }}
                    />
                  );
                })}
              </div>

              {/* caption track */}
              <div className="relative h-7 rounded-md bg-black/30">
                {CAPTIONS.map((c, i) => {
                  const state =
                    time >= c.start && time <= c.end
                      ? "live"
                      : time > c.end
                        ? "past"
                        : "idle";
                  return (
                    <div
                      key={i}
                      data-state={state}
                      title={`"${c.text}"`}
                      className="re-marker absolute top-1/2 h-3 -translate-y-1/2 rounded-sm"
                      style={{ left: pct(c.start), width: wpct(c.start, c.end) }}
                    />
                  );
                })}
              </div>
            </div>

            {/* playhead spans ruler + tracks */}
            <div
              ref={playheadRef}
              className="re-playhead pointer-events-none absolute inset-y-0 w-px bg-[var(--re-brass)]"
              style={{ left: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
