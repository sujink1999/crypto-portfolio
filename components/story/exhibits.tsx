import type { Evidence } from "@/companies/types";
import type { Exhibit } from "./ExhibitStage";
import type { Slide } from "./demos/SlideshowPhone";

export const SOCIETY_SLIDES: Slide[] = [
  "/showcase/society/home.png",
  "/showcase/society/routine.png",
  "/showcase/society/map.png",
  "/showcase/society/chats.png",
  // captured without status-bar headroom - nudge below the dynamic island
  { src: "/showcase/society/store.png", padTop: 5.5 },
];

/**
 * How each evidence entry is exhibited on the proof stage - perfected in
 * /lab, registered here. Anything not listed falls back to its evidence
 * media (image in a device frame) or a monogram placeholder.
 */
const EXHIBITS: Record<string, Omit<Exhibit, "id" | "title">> = {
  "vanta-os": {
    device: "laptop",
    media: {
      kind: "video",
      src: "/showcase/vanta-os/os-landing-scroll.mp4",
      aspect: "3416 / 1860",
    },
  },
  "society-mobile": {
    device: "phone",
    media: { kind: "slides", srcs: SOCIETY_SLIDES },
  },
  keom: {
    device: "laptop",
    // iframe, not inline: the showcase uses viewport breakpoints, so inline
    // rendering collapses to its mobile layout on small screens
    media: {
      kind: "live",
      node: (
        <iframe
          src="/showcase/ovix"
          title="0VIX lending dashboard"
          className="h-full w-full border-0"
        />
      ),
      logical: { w: 1440, h: 900 },
    },
  },
  beans: {
    device: "laptop",
    media: {
      kind: "live",
      node: (
        <iframe
          src="/showcase/beans"
          title="Beans trading desktop"
          className="h-full w-full border-0"
        />
      ),
    },
  },
  mudrex: {
    device: "phone",
    media: {
      kind: "slides",
      srcs: ["/projects/mudrex-1.png", "/projects/mudrex-2.png", "/projects/mudrex-3.png"],
    },
  },
};

/** Evidence → stage exhibit, using the registry with graceful fallbacks. */
export function toExhibit(evidence: Evidence): Exhibit {
  // short display name - "Beans", not "Beans - Solana Token-Launch Game"
  const base = {
    id: evidence.id,
    title: evidence.title.split("-")[0].trim(),
    stack: evidence.stack,
  };
  const registered = EXHIBITS[evidence.id];
  if (registered) {
    return { ...base, ...registered };
  }
  const device = evidence.device ?? "laptop";
  if (evidence.media?.kind === "image") {
    return { ...base, device, media: { kind: "image", src: evidence.media.src } };
  }
  return {
    ...base,
    device,
    media: { kind: "empty", monogram: evidence.title.charAt(0) },
  };
}
