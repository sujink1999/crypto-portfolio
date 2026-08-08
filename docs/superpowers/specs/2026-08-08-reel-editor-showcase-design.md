# Reel Editor Showcase Page — Design

Date: 2026-08-08
Route: `/showcase/reel-editor` (private verify surface, like other showcases)

## Positioning

"I direct. Claude edits." The human shoots takes and approves; the AI reads word-level
transcripts, picks the cleanest take, writes the cut, places captions off a face scan,
fires effects, renders. Mirrors Flick's "We handle AI. You direct films." without naming
them. Proof: shipped ~40 reels to a real Instagram account; the featured reel is itself
about being edited by AI.

## Hero: rendered video + synced timeline

Recreated editing-suite UI, full viewport, portfolio theme (black room, film grain,
Space Grotesk + Geist Mono, brass accent `#f0b429`).

- **Video**: `claude-edited-this` final render (`out/H-1.mp4` from vanta-court,
  compressed to ~5MB, copied to `public/showcase/reel-editor/claude-edited-this.mp4`).
  Phone-framed 9:16, muted autoplay + tap for sound.
- **Timeline** (recreated UI, REAL data from `video.H-1.json` + `cut.json`):
  - Video track: 4 segments with true in/out points and clip filenames.
  - Effects track: markers at true timestamps (ClaudePop 0.21s, TapBubbles 9.95–12.0s,
    PalmCube 17.0s, FileCards 18.1–18.8s, captions).
  - Playhead synced to video playback via `timeupdate`/rAF. Markers light up the moment
    the effect fires on screen. Clicking a segment seeks the video.
- **Inspector** (mono): shows the real `cut.json` note for the active segment — the AI's
  actual editing reasoning.

Data lives as a typed constant in the component (transcribed from the real configs),
no runtime dependency on vanta-court.

## Below the fold (scroll-reveal beats)

1. **Pipeline rail**: script in Postgres → WhisperX transcripts → AI writes cut.json →
   face scan places captions → Remotion render. Quiet horizontal rail.
2. **Brain step**: one real retake-pick example — script line, candidate takes with
   transcript snippets, chosen take marked, one line of why.
3. **Receipts**: shipped-reels count, live on a real account, link to the IG post
   (https://www.instagram.com/reel/DbTUhFrjPPI/).

## Structure

- `app/showcase/reel-editor/page.tsx` — route
- `components/showcase/reel-editor/` — components (Hero/Timeline/Inspector/beats)
- Follows existing showcase conventions (beans/ovix/society)

## Copy rules

No em dashes or hyphens-as-punctuation, no emoji, no verdict-tail sentences, evidence is
product outcomes not repo internals (exception: the cut.json notes shown in the inspector
are the artifact itself, not a claim). Frontend-design skill for the UI build.
