"use client";

import dynamic from "next/dynamic";
import VideoPlayer from "../components/VideoPlayer";
import BrightBackground from "../components/bright/BrightBackground";
import BrightFooter from "../components/bright/BrightFooter";
import BrightReveal from "../components/bright/BrightReveal";
import BrightPageHeader from "../components/bright/BrightPageHeader";

// 3D viewer is client-only and heavy — load lazily
const F35Viewer = dynamic(() => import("../components/F35Viewer"), {
  ssr: false,
});

const VIDEO_EMBED_URL = "https://framerate.tv/watch/44c2d0df-e4b4-4862-853f-8dfd02880f3f";

export default function LMPage() {
  return (
    <>
      <BrightBackground />
      <main>
        <BrightPageHeader
          title="The Pursuit of Dreamers"
        />
        <div className="bright-sec-inner">
          {/* 3D model block */}
          <div className="reveal" style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <div
              className="bright-media-frame"
              style={{ aspectRatio: "16/10", background: "#0F1422" }}
            >
              <F35Viewer />
            </div>
            <div className="bright-project-meta" style={{ marginTop: "0.85rem" }}>
              F-35 · Interactive 3D Model Call-outs
            </div>
            <p className="bright-project-desc" style={{ marginTop: "0.5rem" }}>
              Interactive 3D model built in Spline. Drag to rotate, scroll to
              zoom, click any callout to explore.
            </p>
          </div>

          {/* Video block */}
          <div className="reveal">
            <h2 className="bright-project-title">Aerospace Trailer</h2>
            <div className="bright-project-meta" style={{ marginBottom: "1rem", marginTop: 0 }}>
              Concept, Edit &amp; Sound Design by Eric McGilloway
            </div>
            <div className="bright-media-frame">
              <VideoPlayer embedUrl={VIDEO_EMBED_URL} poster="/lm/poster.jpg" />
            </div>
            <div className="bright-project-meta">Duration: 1:48</div>
          </div>
        </div>
      </main>
      <BrightFooter />
      <BrightReveal />
    </>
  );
}
