"use client";

import { useEffect, useRef, useState } from "react";
import BrowserFrame from "@/components/projects/BrowserFrame";

/** BrowserFrame with self-managed scaling - live site embedded at 1200x680. */
export default function EmbedBrowser({
  url,
  src,
}: {
  url: string;
  src: string;
}) {
  const IFRAME_W = 1200;
  const IFRAME_H = 680;
  const wrapRef = useRef<HTMLDivElement>(null!);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / IFRAME_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <BrowserFrame
      url={url}
      src={src}
      wrapRef={wrapRef}
      scale={scale}
      iframeW={IFRAME_W}
      iframeH={IFRAME_H}
    />
  );
}
