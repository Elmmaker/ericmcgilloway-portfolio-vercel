"use client";

import { useEffect, useRef } from "react";

/* ────────────────────────────────────────────────────────────────
   Three inline SVG clouds positioned absolutely over the sky-blue
   gradient. Each cloud moves at a different scroll rate so they
   read as distant / mid / near layers (parallax → depth).

   Cloud 1: largest, lowest opacity, slowest (back of frame)
   Cloud 2: medium puff, mid opacity, mid speed
   Cloud 3: small wisp, highest opacity, fastest

   prefers-reduced-motion users get the clouds at rest with no
   scroll-driven transform.
   ──────────────────────────────────────────────────────────────── */

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
      if (c2.current) c2.current.style.transform = `translate3d(0, ${y * -0.24}px, 0)`;
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
      {/* Cloud 1 — distant, wide, low opacity */}
      <div ref={c1} className="bright-cloud bright-cloud--1">
        <CloudWide />
      </div>
      {/* Cloud 2 — mid, fuller, medium opacity */}
      <div ref={c2} className="bright-cloud bright-cloud--2">
        <CloudPuff />
      </div>
      {/* Cloud 3 — near, small wispy, highest opacity */}
      <div ref={c3} className="bright-cloud bright-cloud--3">
        <CloudWisp />
      </div>
    </div>
  );
}

/* ─────────────────── SVG CLOUD SHAPES ─────────────────── */

function CloudWide() {
  // Long, low cloud — three big lobes along a flat bottom.
  return (
    <svg viewBox="0 0 1000 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="cloud-soft-1" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <g fill="white" filter="url(#cloud-soft-1)">
        <ellipse cx="190" cy="200" rx="140" ry="80" />
        <ellipse cx="370" cy="170" rx="170" ry="105" />
        <ellipse cx="560" cy="160" rx="180" ry="115" />
        <ellipse cx="750" cy="180" rx="160" ry="100" />
        <ellipse cx="880" cy="210" rx="110" ry="75" />
        <ellipse cx="500" cy="240" rx="380" ry="40" />
      </g>
    </svg>
  );
}

function CloudPuff() {
  // Medium puffy cloud — more vertical, two stacked lobes.
  return (
    <svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="cloud-soft-2" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>
      <g fill="white" filter="url(#cloud-soft-2)">
        <ellipse cx="180" cy="230" rx="130" ry="95" />
        <ellipse cx="330" cy="180" rx="160" ry="120" />
        <ellipse cx="490" cy="220" rx="150" ry="105" />
        <ellipse cx="600" cy="260" rx="90" ry="70" />
        <ellipse cx="370" cy="120" rx="100" ry="65" />
        <ellipse cx="350" cy="290" rx="280" ry="40" />
      </g>
    </svg>
  );
}

function CloudWisp() {
  // Smaller, lighter wisp — narrower, fewer lobes.
  return (
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="cloud-soft-3" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <g fill="white" filter="url(#cloud-soft-3)">
        <ellipse cx="120" cy="140" rx="90" ry="55" />
        <ellipse cx="230" cy="110" rx="110" ry="75" />
        <ellipse cx="350" cy="130" rx="95" ry="62" />
        <ellipse cx="430" cy="150" rx="60" ry="40" />
        <ellipse cx="250" cy="170" rx="200" ry="22" />
      </g>
    </svg>
  );
}
