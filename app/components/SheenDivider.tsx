// Gold hairline with a slow sheen sweeping across. Used to separate
// major sections (e.g. on /lm, on /reels) without making the rule
// itself loud — the sheen is the visual interest, not the line.
//
// Stagger sweeps when using two dividers near each other by passing
// different `delay` values, so they never animate together.
export default function SheenDivider({ delay = 0 }: { delay?: number }) {
  return (
    <div className="sheen-divider" aria-hidden="true">
      <div className="sheen-divider-base" />
      <div
        className="sheen-divider-sweep"
        style={{ animationDelay: `${delay}s` }}
      />
      <style jsx global>{`
        .sheen-divider {
          position: relative;
          height: 1px;
          margin: clamp(48px, 6vw, 72px) 0;
          overflow: hidden;
        }
        .sheen-divider-base {
          position: absolute;
          inset: 0;
          background: #c5a455;
          opacity: 0.3;
        }
        .sheen-divider-sweep {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            transparent 30%,
            rgba(197, 164, 85, 0.8) 50%,
            transparent 70%,
            transparent 100%
          );
        }
        @media (prefers-reduced-motion: no-preference) {
          .sheen-divider-sweep {
            animation: sheenDividerSweep 7s ease-in-out infinite;
          }
        }
        @keyframes sheenDividerSweep {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
