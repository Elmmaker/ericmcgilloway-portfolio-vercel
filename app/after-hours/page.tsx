"use client";

import VideoPlayer from "../components/VideoPlayer";
import BrightBackground from "../components/bright/BrightBackground";
import BrightFooter from "../components/bright/BrightFooter";
import BrightReveal from "../components/bright/BrightReveal";
import BrightPageHeader from "../components/bright/BrightPageHeader";

type AfterHoursItem = {
  title: string;
  desc?: string;
  duration: string;
  embedUrl: string;
  poster?: string;
};

const HERO: AfterHoursItem = {
  title: "Stream of Consciousness", duration: "0:58", embedUrl: "https://framerate.tv/watch/ea9ed290-f3b0-459d-8042-72fdbe3bc03f",
  poster: "/images/AfterHours.jpg",
};

const VIDEOS: AfterHoursItem[] = [
  { title: "Voxel Lounge", duration: "0:09", embedUrl: "https://framerate.tv/watch/6489af4c-40ea-4390-9124-a5e2bfcd6f40", poster: "https://image.mux.com/4UyeBnjQMM5ArhFTbCXO6JG02dkLGjEhLakBoBX63lYg/thumbnail.jpg?width=1200&height=630&fit_mode=smartcrop" },
  { title: "In Waves", duration: "2:45", embedUrl: "https://framerate.tv/watch/c5296204-76eb-428c-a565-099239ec3e62", poster: "https://image.mux.com/uoFh6dk1m1D8MdW6F38SjOIaaodjgreSL0096kJOtW500/thumbnail.jpg?width=1200&height=630&fit_mode=smartcrop" },
  { title: "Hotel Lobby Abstraction", duration: "0:30", embedUrl: "https://framerate.tv/watch/4d69bbbd-b3b4-4eca-8ded-802dc57cbaf2", poster: "https://image.mux.com/siFpmu5s0102GXqr9zg9FOOBwA1HOQ01yo93VYVXSHnyE00/thumbnail.jpg?width=1200&height=630&fit_mode=smartcrop" },
  { title: "AbstraHud", duration: "0:20", embedUrl: "https://framerate.tv/watch/aa2c4eb3-bb58-4e16-952d-6c7cf050e72b", poster: "https://image.mux.com/g6UmDnjUr9AViOWG43lQ6uYhw7iaUURrMLW8Rlo3CvA/thumbnail.jpg?width=1200&height=630&fit_mode=smartcrop" },
  { title: "DubJump", duration: "0:13", embedUrl: "https://framerate.tv/watch/d57a8ce7-24cc-495a-adc3-1d588ccf6c21", poster: "https://image.mux.com/Rn00aXGqK3xm00sqZGbHMitHT9Zb2UXz00cOXU5KztDAMM/thumbnail.jpg?width=1200&height=630&fit_mode=smartcrop" },
  { title: "WakeSleep", duration: "0:20", embedUrl: "https://framerate.tv/watch/59b19238-4e3d-46f0-80fe-0cd9af575a9a", poster: "https://image.mux.com/5ds76JCAoqIbMsXzeqAB2wMpkrM174MX9c2bcsaXk94/thumbnail.jpg?width=1200&height=630&fit_mode=smartcrop" },
  { title: "Imagine", duration: "0:13", embedUrl: "https://framerate.tv/watch/601d6be3-3fbb-42c6-b525-24e37d22a681", poster: "https://image.mux.com/wbKoWVGXrw005PuZMC1npMHxyLb2wE024voyCO6bAk5JI/thumbnail.jpg?time=6.083781&width=1280" },
  { title: "Yellow Chair", duration: "0:15", embedUrl: "https://framerate.tv/watch/2f4ce8dc-8380-4487-bcb2-bd5642bc1c77", poster: "https://image.mux.com/xWcso00L02YQQYFGX63Ll1lybJ1XI300GPbADAIsREmxhA/thumbnail.jpg?width=1200&height=630&fit_mode=smartcrop" },
  { title: "\"AI or Real\" Game", duration: "0:40", embedUrl: "https://framerate.tv/watch/c5988a3c-2c9f-45af-b317-eea1bf413a58", poster: "https://image.mux.com/Bcf82S5A2ut1phVfH6bPuQpdLZpiIMJpCT00OLLLgE2E/thumbnail.jpg?time=3.297607&width=1280" },
];

export default function AfterHoursPage() {
  return (
    <>
      <BrightBackground />
      <main>
        <BrightPageHeader
          title="After Hours"
          intro={"The stuff I make when nobody's watching. Personal projects, experiments, and the work that keeps the creative engine running after the day job wraps."}
        />
        <div className="bright-sec-inner">
          {/* Hero video */}
          <div className="reveal" style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <div className="bright-media-frame">
              <VideoPlayer embedUrl={HERO.embedUrl} poster={HERO.poster} />
            </div>
            <h2 className="bright-project-title" style={{ marginTop: "1rem" }}>{HERO.title}</h2>
            <div className="bright-project-meta">Duration: {HERO.duration}</div>
          </div>

          {/* Grid */}
          {VIDEOS.length === 0 ? (
            <div className="reveal" style={{ padding: "5rem 0", textAlign: "center", color: "var(--mid-bright)", fontSize: "0.75rem", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Coming soon
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "clamp(1.5rem, 3vw, 2.5rem)",
              }}
              className="bright-ah-grid"
            >
              {VIDEOS.map((vid, i) => (
                <div key={vid.title} className="reveal" data-d={String(((i % 3) || "") || undefined)}>
                  <div className="bright-media-frame">
                    <VideoPlayer embedUrl={vid.embedUrl} poster={vid.poster} />
                  </div>
                  <h3 className="bright-clip-title">{vid.title}</h3>
                  <div className="bright-project-meta" style={{ marginTop: "0.4rem" }}>Duration: {vid.duration}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BrightFooter />
      <BrightReveal />
      <style jsx global>{`
        @media (max-width: 720px) {
          .bright-ah-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
