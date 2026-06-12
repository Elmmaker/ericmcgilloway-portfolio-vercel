"use client";

import dynamic from "next/dynamic";
import PasswordGate from "../components/PasswordGate";
import type { Media, ModelConfig } from "../components/Model3DViewer";

// The 3D viewers are client-only and heavy — load lazily.
const Model3DViewer = dynamic(() => import("../components/Model3DViewer"), {
  ssr: false,
});

const IMG = (file: string): Media => ({ kind: "images", srcs: [file] });

// Astronaut: F-35 style — hover a part → hot-pink + word; click → description
// panel below. Labels = the work Spaceman does; descriptions are PLACEHOLDER copy
// for Eric/Spaceman to replace.
const ASTRONAUT_CONFIG: ModelConfig = {
  modelPath: "/models/astronaut.glb",
  mode: "named",
  calloutStyle: "panel",
  // Default framing of the astronaut + wordmark lockup: zoomed in so the astronaut
  // reads big (Eric's preferred size), centered so the SPACEMAN wordmark stays in view.
  fitFactor: 1.12,
  // On phones, zoom in ~1.5x closer than desktop so the astronaut fills the tall
  // frame (it defaults too small otherwise). Lower = bigger. Tune to taste.
  fitFactorMobile: 0.72,
  targetYFactor: -0.18,
  // Phone: seat the lockup ~6% lower than desktop (less negative = lower in frame).
  targetYFactorMobile: -0.07,
  swayAmp: 0.5,
  // SPACEMAN wordmark, locked under his feet, rotating with him (visual only).
  decorModelPath: "/models/spaceman.glb",
  decorScale: 2.07,
  decorGapFactor: 0.04,
  // Fix the GLB: its "Astronaut White v" material exports as BLEND (see-through)
  // and metalness 1 (mirror), which washed out the suit and hid the texture detail.
  forceOpaque: true,
  metalness: 0,
  roughness: 0.6,
  exposure: 1.0,
  envIntensity: 0.55,
  // `media` = the far-left photo in the description panel — Eric's real on-set
  // photo for each callout (in public/spaceman/).
  callouts: [
    {
      key: "visor",
      match: "VISOR",
      label: "Direction",
      media: IMG("/spaceman/direction.jpg"),
      description:
        "From first concept to final frame, Spaceman's directors shape the story, tone, and visual language of every project.",
    },
    {
      key: "control",
      match: "CONTROL PANEL",
      label: "Graphics",
      media: IMG("/spaceman/graphics.jpg"),
      description:
        "Design-driven graphics and on-screen systems — titles, lower-thirds, and motion-ready art that sharpen every frame.",
    },
    {
      key: "power",
      match: "POWER PACK",
      label: "Post-Production",
      media: IMG("/spaceman/post-production.jpg"),
      description:
        "Editorial, color, and finishing in-house — turning raw footage into a polished, on-brand final cut.",
    },
    {
      key: "gloves",
      match: "GLOVES",
      label: "Camera",
      media: IMG("/spaceman/camera.jpg"),
      split: true,
      description:
        "On-set camera and cinematography — the right lens, lighting, and movement to capture the story.",
    },
    {
      key: "boots",
      match: "MOON BOOTS",
      label: "Production",
      media: IMG("/spaceman/production.jpg"),
      description:
        "End-to-end production — planning, crewing, and running shoots that keep ambitious ideas on schedule and on budget.",
    },
  ],
};

// NOTE: the SECOND, separate interactive SPACEMAN wordmark viewer (with the glitch
// media-card callouts) is ARCHIVED for now — full code saved in
// tasks/archived-spaceman-wordmark.md. Ask to restore and it goes right back.
// (The wordmark UNDER the astronaut's feet is unaffected — that's the decor lockup.)

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono"
      style={{
        fontSize: "11px",
        letterSpacing: "3px",
        textTransform: "uppercase",
        color: "#FF2D7E",
        marginBottom: "16px",
      }}
    >
      {children}
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-sans"
      style={{
        fontSize: "15px",
        color: "#8A8579",
        textAlign: "center",
        marginTop: "18px",
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  );
}

export default function SpacemanPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060509",
        color: "#F0EDE6",
        // Top padding trimmed (was 110–150px to clear the now-hidden nav) so the
        // content sits cleanly near the top instead of behind an empty gap.
        padding:
          "clamp(56px, 8vw, 88px) clamp(20px, 5vw, 64px) clamp(60px, 8vw, 100px)",
      }}
    >
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <PasswordGate password="tothemoon" storageKey="sm-unlocked">
          {/* Astronaut — above the wordmark */}
          <Eyebrow>Spaceman Astronaut · Interactive 3D</Eyebrow>
          <Model3DViewer config={ASTRONAUT_CONFIG} />
          <Caption>
            Hover a part to highlight it · click to read about that work. Drag
            to spin, scroll to zoom.
          </Caption>
          {/* Interactive wordmark section archived — see note above ASTRONAUT_CONFIG. */}
        </PasswordGate>
      </div>
    </div>
  );
}
