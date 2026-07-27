"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

/** The Beans Win-95 trading desktop, frameless - the stage face of Beans.
 *  Rests as a static poster; the live physics desktop mounts on hover, or
 *  whenever the stage marks it as the playing exhibit via `playing`.
 *  The landing/NFT faces live in the project detail view (see BeansTabbed). */
const BeansDesktop = dynamic(
  () => import("@/components/showcase/beans/BeansDesktop"),
  { ssr: false }
);

export default function BeansLive({ playing }: { playing?: boolean }) {
  const [hover, setHover] = useState(false);
  const active = playing ?? hover;

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {active ? (
        <BeansDesktop />
      ) : (
        // plain eager img: next/image lazy-loading never fires inside the
        // scaled screen container, so the poster stayed blank until a rerender
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/showcase/beans/poster.png"
          alt="Beans trading desktop"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      )}
    </div>
  );
}
