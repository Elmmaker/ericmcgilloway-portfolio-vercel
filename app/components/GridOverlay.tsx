// Subtle fixed grid overlay used on the main public pages (home, reels,
// key art, after hours) to add a quiet "studio" texture above the dark
// background without competing with content.
//
// Cell size + line color are tuned together so the lines read ~10% light
// on the #0D0C0A base — bumps the perceived luminance just enough to feel
// like a grid, never enough to fight the typography.
export default function GridOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        backgroundImage:
          "linear-gradient(to right, rgba(240, 237, 230, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(240, 237, 230, 0.03) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
  );
}
