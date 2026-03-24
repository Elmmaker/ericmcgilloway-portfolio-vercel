"use client";

import { useEffect, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  birth: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w: number, h: number;
    const MAX_TRAIL = 150;
    const trail: TrailPoint[] = [];
    let rawMouseX = -100,
      rawMouseY = -100;
    let smoothX = -100,
      smoothY = -100;
    const SMOOTHING = 0.06;
    let animId: number;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * 2;
      canvas!.height = h * 2;
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(2, 0, 0, 2, 0, 0);
    }

    function onMouseMove(e: MouseEvent) {
      rawMouseX = e.clientX;
      rawMouseY = e.clientY;
      if (smoothX < 0) {
        smoothX = rawMouseX;
        smoothY = rawMouseY;
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, w, h);

      smoothX += (rawMouseX - smoothX) * SMOOTHING;
      smoothY += (rawMouseY - smoothY) * SMOOTHING;

      const last = trail.length > 0 ? trail[0] : null;
      const dx = last ? smoothX - last.x : 999;
      const dy = last ? smoothY - last.y : 999;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 2) {
        trail.unshift({ x: smoothX, y: smoothY, birth: performance.now() });
        if (trail.length > MAX_TRAIL) trail.pop();
      }

      const now = performance.now();
      const LIFE = 1100;

      while (trail.length > 0 && now - trail[trail.length - 1].birth > LIFE)
        trail.pop();

      if (trail.length < 3) {
        animId = requestAnimationFrame(animate);
        return;
      }

      for (let i = 0; i < trail.length - 2; i++) {
        const p0 = trail[i];
        const p1 = trail[i + 1];
        const p2 = trail[i + 2];

        const age = (now - p0.birth) / LIFE;
        const t = 1 - age;
        if (t <= 0) continue;

        const mx1 = (p0.x + p1.x) / 2;
        const my1 = (p0.y + p1.y) / 2;
        const mx2 = (p1.x + p2.x) / 2;
        const my2 = (p1.y + p2.y) / 2;

        const lineW = Math.max(0.3, t * 3.5);
        const alpha = t * t;

        // Core purple line
        ctx!.beginPath();
        ctx!.moveTo(mx1, my1);
        ctx!.quadraticCurveTo(p1.x, p1.y, mx2, my2);
        ctx!.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.9})`;
        ctx!.lineWidth = lineW;
        ctx!.lineCap = "round";
        ctx!.lineJoin = "round";
        ctx!.stroke();

        // Outer glow
        if (t > 0.15) {
          ctx!.beginPath();
          ctx!.moveTo(mx1, my1);
          ctx!.quadraticCurveTo(p1.x, p1.y, mx2, my2);
          ctx!.strokeStyle = `rgba(167, 120, 255, ${alpha * 0.25})`;
          ctx!.lineWidth = lineW * 4;
          ctx!.lineCap = "round";
          ctx!.lineJoin = "round";
          ctx!.stroke();
        }

        // Hot white core near head
        if (i < 5 && t > 0.8) {
          ctx!.beginPath();
          ctx!.moveTo(mx1, my1);
          ctx!.quadraticCurveTo(p1.x, p1.y, mx2, my2);
          ctx!.strokeStyle = `rgba(220, 200, 255, ${alpha * 0.55})`;
          ctx!.lineWidth = lineW * 0.4;
          ctx!.lineCap = "round";
          ctx!.lineJoin = "round";
          ctx!.stroke();
        }
      }

      // Glow dot at cursor
      if (trail.length > 0) {
        const head = trail[0];
        const headAge = (now - head.birth) / LIFE;
        if (headAge < 0.3) {
          const grd = ctx!.createRadialGradient(
            smoothX, smoothY, 0,
            smoothX, smoothY, 20
          );
          grd.addColorStop(0, "rgba(139, 92, 246, 0.35)");
          grd.addColorStop(0.5, "rgba(139, 92, 246, 0.1)");
          grd.addColorStop(1, "rgba(139, 92, 246, 0)");
          ctx!.fillStyle = grd;
          ctx!.beginPath();
          ctx!.arc(smoothX, smoothY, 20, 0, Math.PI * 2);
          ctx!.fill();

          ctx!.fillStyle = "rgba(220, 200, 255, 0.5)";
          ctx!.beginPath();
          ctx!.arc(smoothX, smoothY, 2, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      animId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", onMouseMove);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
