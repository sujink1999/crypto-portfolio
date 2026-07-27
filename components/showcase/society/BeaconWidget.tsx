"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CloseIcon, StorefrontIcon } from "./icons";
import { BEACONS, type Beacon } from "./data";

const CARD_HEIGHT = 140;
const SWIPE_THRESHOLD = 100;
const STACK_CONFIG = {
  scale: [1.0, 0.96, 0.92, 0.88, 0.84],
  translateY: [0, 12, 24, 36, 48],
  opacity: [1, 0.7, 0.55, 0.7, 0.6],
};

function characterSrc(imageKey: string) {
  const m = imageKey.match(/character_(\d)/);
  return `/showcase/society/character/${m ? m[1] : "1"}.png`;
}

function BeaconInner({ beacon, isTop }: { beacon: Beacon; isTop: boolean }) {
  const isBrand = beacon.type === "brand_unlock";
  return (
    <div
      style={{
        backgroundColor: "#000000",
        borderRadius: 16,
        borderWidth: 0.5,
        borderStyle: "solid",
        borderColor: isTop ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.4)",
        position: "relative",
      }}
    >
      {isTop && (
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
          <CloseIcon size={20} color="rgba(255,255,255,0.5)" />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          padding: 24,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            marginRight: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: "rgba(255,255,255,0.1)",
            flexShrink: 0,
          }}
        >
          {isBrand ? (
            <StorefrontIcon size={26} color="rgba(255,255,255,0.7)" />
          ) : (
            <Image
              src={characterSrc(beacon.imageKey)}
              alt=""
              width={56}
              height={56}
              style={{ objectFit: "cover", width: 56, height: 56 }}
            />
          )}
        </div>
        <div style={{ flex: 1, paddingRight: 24 }}>
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontWeight: 500,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 4,
            }}
          >
            {beacon.title}
          </div>
          <div
            style={{
              color: "#ffffff",
              fontWeight: 400,
              fontSize: 15,
              lineHeight: "20px",
            }}
          >
            {beacon.message}
          </div>
        </div>
      </div>
    </div>
  );
}

function HintCard() {
  return (
    <div
      style={{
        backgroundColor: "#000000",
        borderRadius: 16,
        borderWidth: 0.5,
        borderStyle: "solid",
        borderColor: "rgba(255,255,255,0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 12,
            marginRight: 16,
            backgroundColor: "rgba(255,255,255,0.05)",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: 20,
              width: 128,
              borderRadius: 4,
              backgroundColor: "rgba(255,255,255,0.05)",
              marginBottom: 8,
            }}
          />
          <div
            style={{
              height: 16,
              width: 192,
              borderRadius: 4,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function BeaconWidget() {
  const [beacons, setBeacons] = useState<Beacon[]>(BEACONS);
  const [dragX, setDragX] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);

  const total = beacons.length;

  function onPointerDown(e: React.PointerEvent) {
    if (total === 0) return;
    setDragging(true);
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setDragX(Math.max(0, e.clientX - startX.current));
  }
  function onPointerUp() {
    if (!dragging) return;
    setDragging(false);
    if (dragX > SWIPE_THRESHOLD) {
      setLeaving(true);
      setDragX(400);
      window.setTimeout(() => {
        setBeacons((b) => b.slice(1));
        setDragX(0);
        setLeaving(false);
      }, 200);
    } else {
      setDragX(0);
    }
  }

  return (
    <div style={{ paddingLeft: 16, paddingRight: 16, marginTop: 16 }}>
      <div style={{ position: "relative", height: CARD_HEIGHT + 54 }}>
        {/* Hint skeletons furthest back (indices 4 then 3) */}
        {[4, 3].map((idx) => (
          <div
            key={`hint-${idx}`}
            style={{
              position: "absolute",
              width: "100%",
              zIndex: 5 - idx,
              transform: `scale(${STACK_CONFIG.scale[idx]}) translateY(${STACK_CONFIG.translateY[idx]}px)`,
              opacity: STACK_CONFIG.opacity[idx],
              transformOrigin: "top center",
              transition: "transform 0.25s ease, opacity 0.25s ease",
            }}
          >
            <HintCard />
          </div>
        ))}

        {/* Real beacons, index 0 = top/front */}
        {beacons.slice(0, 3).map((beacon, index) => {
          const isTop = index === 0;
          const tx = isTop ? dragX : 0;
          const swipeOpacity = isTop ? 1 - Math.min(dragX / 200, 0.6) : 1;
          return (
            <div
              key={beacon.id}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
              style={{
                position: "absolute",
                width: "100%",
                zIndex: 20 - index,
                transform: `translateX(${tx}px) scale(${STACK_CONFIG.scale[index]}) translateY(${STACK_CONFIG.translateY[index]}px)`,
                opacity: STACK_CONFIG.opacity[index] * swipeOpacity,
                transformOrigin: "top center",
                transition: dragging
                  ? "none"
                  : `transform ${leaving ? 200 : 250}ms ease, opacity ${
                      leaving ? 200 : 250
                    }ms ease`,
                touchAction: "pan-y",
                cursor: isTop ? "grab" : "default",
              }}
            >
              <BeaconInner beacon={beacon} isTop={isTop} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
