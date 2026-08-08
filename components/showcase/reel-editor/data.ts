/**
 * Real render data for the reel "claude-edited-this", transcribed from
 * vanta-court editor/reels/claude-edited-this/{video.H-1.json, cut.json, out/faces.json}.
 * Times are seconds on the final render timeline (24.02s total).
 */

export const DURATION = 24.02;

export type Segment = {
  /** timeline start/end on the rendered video */
  start: number;
  end: number;
  /** source clip in/out points */
  srcIn: number;
  srcOut: number;
  clip: string;
  label: string;
  /** the AI's verbatim editing note from cut.json */
  note: string;
};

export const SEGMENTS: Segment[] = [
  {
    start: 0,
    end: 3.2,
    srcIn: 0.3,
    srcOut: 3.5,
    clip: "dji_mimo_..._112646.MP4",
    label: "HOOK",
    note: "HOOK + 'so I can do this' — out at 3.50: hand mid-sweep, face still visible; covered frames all dropped",
  },
  {
    start: 3.2,
    end: 4.89,
    srcIn: 1.44,
    srcOut: 3.13,
    clip: "dji_mimo_..._113226.MP4",
    label: "COUCH",
    note: "COUCH: in at 1.44 (hand already pulling away — pure reveal motion), fist pose, out at 3.13 (sweep-2 just launched, pre-cover)",
  },
  {
    start: 4.89,
    end: 17.87,
    srcIn: 4.42,
    srcOut: 17.4,
    clip: "dji_mimo_..._112646.MP4",
    label: "OFFICE",
    note: "OFFICE RETURN at 4.42: hand clearing frame, face reappearing — pure motion. Then caption beat 5.78, 4 taps (snap 9.33 = tap-1 hit; apexes 9.40/10.05/11.0/11.55), sfx callback, palm static hold from 16.5 (palm 0.60,0.72)",
  },
  {
    start: 17.87,
    end: 24.02,
    srcIn: 0.1,
    srcOut: 6.25,
    clip: "dji_mimo_..._112700.MP4",
    label: "CTA",
    note: "CTA take — files line + comment editor, camera-point at 3.3",
  },
];

export type FxEvent = {
  at: number;
  duration: number;
  component: string;
  detail: string;
};

export const FX: FxEvent[] = [
  { at: 0.21, duration: 1.9, component: "ClaudePop", detail: "x 0.50 · y 0.20 · 300px" },
  { at: 9.95, duration: 0.5, component: "TapBubble", detail: "x 0.27 · y 0.42 · 105px" },
  { at: 10.55, duration: 0.6, component: "TapBubble", detail: "x 0.43 · y 0.29 · 115px" },
  { at: 11.35, duration: 0.6, component: "TapBubble", detail: "x 0.70 · y 0.31 · 110px" },
  { at: 12.0, duration: 0.5, component: "TapBubble", detail: "x 0.83 · y 0.40 · 120px" },
  { at: 17.0, duration: 0.87, component: "PalmCube", detail: "x 0.46 · y 0.78 · 170px" },
  { at: 18.1, duration: 2.0, component: "FileCard", detail: "take_1.mp4 · rotate -7°" },
  { at: 18.45, duration: 1.65, component: "FileCard", detail: "take_2.mp4 · rotate 3°" },
  { at: 18.8, duration: 1.3, component: "FileCard", detail: "take_3.mp4 · rotate 8°" },
  { at: 22.01, duration: 2.6, component: "CommentBubble", detail: '"editor" from @you' },
];

export type SfxCue = { at: number; name: string };

export const SFX: SfxCue[] = [
  { at: 2.65, name: "whoosh" },
  { at: 4.34, name: "whoosh" },
  { at: 6.25, name: "typing" },
  { at: 10.55, name: "pop" },
  { at: 11.35, name: "pop" },
  { at: 12.0, name: "pop" },
  { at: 17.0, name: "electric pop" },
  { at: 18.1, name: "shutter" },
  { at: 18.45, name: "shutter" },
  { at: 18.8, name: "shutter" },
  { at: 22.01, name: "notification" },
];

export type Caption = { start: number; end: number; text: string };

export const CAPTIONS: Caption[] = [
  { start: 0.21, end: 0.93, text: "Claude edited this" },
  { start: 0.99, end: 2.11, text: "entire video in 5 minutes" },
  { start: 2.27, end: 3.05, text: "So I can do this" },
  { start: 6.25, end: 7.13, text: "It added this caption" },
  { start: 7.13, end: 8.83, text: "that you're reading right now" },
  { start: 8.83, end: 12.77, text: "And I can also do this" },
  { start: 12.77, end: 13.41, text: "Yeah it adds" },
  { start: 13.41, end: 14.77, text: "sound effects too" },
  { start: 14.77, end: 15.79, text: "And I can also add" },
  { start: 15.79, end: 18.06, text: "visual elements like this" },
  { start: 18.06, end: 18.66, text: "I just recorded" },
  { start: 18.66, end: 19.34, text: "all these videos" },
  { start: 19.34, end: 20.93, text: "and told it what to do" },
  { start: 20.93, end: 22.11, text: "If you want this editor" },
  { start: 22.11, end: 22.93, text: "comment editor" },
  { start: 23.44, end: 24.02, text: "over to you" },
];

/** faces.json: caption band placed above all faces */
export const FACE_SCAN = {
  posY: 0.3474,
  placement: "above all faces (highest face_top = 0.40)",
};

export const IG_URL = "https://www.instagram.com/reel/DbTUhFrjPPI/";

export const PIPELINE = [
  {
    step: "script",
    title: "Script in Postgres",
    line: "Every reel starts as an approved script with beats, hook, and shoot plan in the database.",
  },
  {
    step: "transcribe",
    title: "WhisperX transcripts",
    line: "Every take gets word-level timestamps, so the editor knows exactly where each word is spoken.",
  },
  {
    step: "cut",
    title: "Claude writes the cut",
    line: "The AI reads transcripts against the script, picks the cleanest take per line, and writes cut.json with in and out points.",
  },
  {
    step: "faces",
    title: "Face scan places captions",
    line: "A face pass maps where the face sits in every segment. Captions and widgets go where the face is not.",
  },
  {
    step: "render",
    title: "Remotion renders",
    line: "Captions, tap bubbles, file cards, sound effects, and music are composited and rendered in one command.",
  },
];
