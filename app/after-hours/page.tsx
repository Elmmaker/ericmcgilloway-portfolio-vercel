"use client";

import FadeUp from "../components/FadeUp";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import VideoPlayer from "../components/VideoPlayer";

type AfterHoursItem = {
  title: string;
  desc?: string;
  duration: string;
  embedUrl: string;
};

const HERO: AfterHoursItem = {
  title: "Stream of Consciousness", duration: "0:58", embedUrl: "https://framerate.tv/watch/ea9ed290-f3b0-459d-8042-72fdbe3bc03f",
};

const VIDEOS: AfterHoursItem[] = [
  { title: "Voxel Lounge", duration: "0:09", embedUrl: "https://framerate.tv/watch/6489af4c-40ea-4390-9124-a5e2bfcd6f40" },
  { title: "In Waves", duration: "2:45", embedUrl: "https://framerate.tv/watch/c5296204-76eb-428c-a565-099239ec3e62" },
  { title: "Hotel Lobby Abstraction", duration: "0:30", embedUrl: "https://framerate.tv/watch/4d69bbbd-b3b4-4eca-8ded-802dc57cbaf2" },
  { title: "AbstraHud", duration: "0:20", embedUrl: "https://framerate.tv/watch/aa2c4eb3-bb58-4e16-952d-6c7cf050e72b" },
  { title: "DubJump", duration: "0:13", embedUrl: "https://framerate.tv/watch/d57a8ce7-24cc-495a-adc3-1d588ccf6c21" },
  { title: "WakeSleep", duration: "0:20", embedUrl: "https://framerate.tv/watch/59b19238-4e3d-46f0-80fe-0cd9af575a9a" },
  { title: "Imagine", duration: "0:13", embedUrl: "https://framerate.tv/watch/601d6be3-3fbb-42c6-b525-24e37d22a681" },
  { title: "Yellow Chair", duration: "0:15", embedUrl: "https://framerate.tv/watch/2f4ce8dc-8380-4487-bcb2-bd5642bc1c77" },
  { title: "\"AI or Real\" Game", duration: "0:40", embedUrl: "https://framerate.tv/watch/c5988a3c-2c9f-45af-b317-eea1bf413a58" },
];

export default function AfterHoursPage() {
  return (
    <PageTransition>
      <section
        style={{
          paddingTop: "clamp(120px, 15vw, 160px)",
          paddingBottom: "clamp(40px, 8vw, 80px)",
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <FadeUp>
          <div className="font-mono text-[11px] tracking-[4px] uppercase text-gold" style={{ marginBottom: "12px" }}>
            04 / Experiments
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h1
            className="font-serif font-bold text-cream"
            style={{ fontSize: "clamp(28px, 5vw, 56px)", marginBottom: "clamp(16px, 3vw, 24px)" }}
          >
            After Hours
          </h1>
        </FadeUp>
        <FadeUp delay={0.15}>
          <p className="text-sm sm:text-base max-w-[560px]" style={{ color: "#8A8579", lineHeight: 1.7, marginBottom: "clamp(48px, 8vw, 80px)" }}>
            The stuff I make when nobody&apos;s watching. Personal projects, experiments, and the work that keeps the creative engine running after the day job wraps.
          </p>
        </FadeUp>

        {/* Hero video */}
        <FadeUp delay={0.2}>
          <div style={{ marginBottom: "clamp(48px, 8vw, 80px)" }}>
            <div className="w-full bg-[#111] border border-rule rounded-[4px] overflow-hidden">
              <VideoPlayer embedUrl={HERO.embedUrl} />
            </div>
            <div style={{ marginTop: "20px" }}>
              <div className="font-serif font-bold text-cream" style={{ fontSize: "clamp(22px, 3.5vw, 40px)" }}>
                {HERO.title}
              </div>
              <div className="font-mono text-[11px] tracking-[1px]" style={{ color: "#8A8579", marginTop: "8px" }}>
                Duration: {HERO.duration}
              </div>
            </div>
          </div>
        </FadeUp>

        {VIDEOS.length === 0 ? (
          <FadeUp delay={0.2}>
            <div className="font-mono text-[12px] tracking-[2px] uppercase text-dim text-center" style={{ padding: "80px 0" }}>
              Coming soon
            </div>
          </FadeUp>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "clamp(32px, 5vw, 48px)" }}>
            {VIDEOS.map((vid, i) => (
              <FadeUp key={vid.title} delay={i * 0.1}>
                <div>
                  <div className="w-full bg-[#111] border border-rule rounded-[4px] overflow-hidden">
                    <VideoPlayer embedUrl={vid.embedUrl} />
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    <div className="font-serif font-bold text-cream" style={{ fontSize: "clamp(18px, 2.5vw, 28px)" }}>
                      {vid.title}
                    </div>
                    {vid.desc && (
                      <div className="font-sans text-sm text-muted" style={{ marginTop: "6px", lineHeight: 1.6 }}>
                        {vid.desc}
                      </div>
                    )}
                    <div className="font-mono text-[11px] tracking-[1px]" style={{ color: "#8A8579", marginTop: "8px" }}>
                      Duration: {vid.duration}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </PageTransition>
  );
}
