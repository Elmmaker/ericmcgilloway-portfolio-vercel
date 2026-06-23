"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/* ────────────────────────────────────────────────────────────────
   Three layered passes of the same realistic cloud PNG, scaled and
   flipped for variety, scrolled at different rates for depth.

   Cloud 1: largest, lowest opacity, slowest (back of frame)
   Cloud 2: mid, mid opacity, mid speed, horizontally flipped
   Cloud 3: small, highest opacity, fastest (foreground)

   prefers-reduced-motion users get the clouds at rest with no
   scroll-driven transform.
   ──────────────────────────────────────────────────────────────── */

const CLOUD_SRC = "/images/Cloud_01.png";
const CLOUD_W = 2000;
const CLOUD_H = 1318;

export default function Clouds() {
  const c1 = useRef<HTMLDivElement>(null);
  const c2 = useRef<HTMLDivElement>(null);
  const c3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pending = false;
    function update() {
      pending = false;
      const y = window.scrollY;
      if (c1.current) c1.current.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
      if (c2.current) c2.current.style.transform = `translate3d(0, ${y * -0.24}px, 0) scaleX(-1)`;
      if (c3.current) c3.current.style.transform = `translate3d(0, ${y * -0.38}px, 0)`;
    }
    function onScroll() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(update);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bright-clouds" aria-hidden>
      {/* Cloud 1 — distant, biggest, softest */}
      <div ref={c1} className="bright-cloud bright-cloud--1">
        <Image
          src={CLOUD_SRC}
          alt=""
          width={CLOUD_W}
          height={CLOUD_H}
          sizes="(max-width: 860px) 130vw, 70vw"
          priority={false}
          aria-hidden
        />
      </div>
      {/* Cloud 2 — mid, horizontally flipped for visual variety */}
      <div ref={c2} className="bright-cloud bright-cloud--2" style={{ transform: "scaleX(-1)" }}>
        <Image
          src={CLOUD_SRC}
          alt=""
          width={CLOUD_W}
          height={CLOUD_H}
          sizes="(max-width: 860px) 110vw, 52vw"
          priority={false}
          aria-hidden
        />
      </div>
      {/* Cloud 3 — near, smaller wisp, original orientation */}
      <div ref={c3} className="bright-cloud bright-cloud--3">
        <Image
          src={CLOUD_SRC}
          alt=""
          width={CLOUD_W}
          height={CLOUD_H}
          sizes="(max-width: 860px) 90vw, 36vw"
          priority={false}
          aria-hidden
        />
      </div>
    </div>
  );
}
