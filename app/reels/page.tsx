"use client";

import FadeUp from "../components/FadeUp";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";

const REELS = [
  {
    label: "Primary Reel",
    title: "Motion Design Reel 2026",
    desc: "Broadcast graphics, title sequences, documentary maps, entertainment marketing campaigns, and everything in between.",
    embedUrl: "https://framerate.tv/watch/e6afa38e-3145-439f-ae2f-dde6fe8c27a1",
    duration: "1:48",
    updated: "2026",
  },
];

const AFTER_MIDNIGHT_VIDEOS = [
  {
    sublabel: "Opening Title Sequence",
    embedUrl: "https://framerate.tv/watch/659a3cdd-bee0-4230-a232-1c26b1a81a2e",
    duration: "0:31",
  },
  {
    sublabel: "Gameplay Stage Graphics",
    src: "/clips/after-midnight-gfx-grid.mp4",
    duration: "0:13",
  },
];

export default function ReelsPage() {
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
            01
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2
            className="font-serif font-bold text-cream"
            style={{ fontSize: "clamp(28px, 5vw, 56px)", marginBottom: "clamp(32px, 6vw, 60px)" }}
          >
            The Reels
          </h2>
        </FadeUp>

        {/* Primary Reel */}
        {REELS.map((reel, i) => (
          <FadeUp key={reel.title} delay={i * 0.15}>
            <div style={{ marginBottom: "40px" }}>
              <div className="font-mono text-[11px] tracking-[4px] uppercase text-gold mb-4">
                {reel.label}
              </div>
              <div
                className="font-serif font-bold text-cream mb-3"
                style={{ fontSize: "clamp(22px, 4vw, 48px)" }}
              >
                {reel.title}
              </div>
              <div className="text-sm sm:text-base max-w-[600px]" style={{ color: "#8A8579", lineHeight: 1.7, marginBottom: "clamp(24px, 4vw, 40px)" }}>
                {reel.desc}
              </div>

              <div className="w-full bg-[#111] border border-rule rounded-[4px] overflow-hidden">
                <iframe
                  src={reel.embedUrl.replace("/watch/", "/embed/")}
                  className="w-full"
                  style={{ border: "none", height: "auto", aspectRatio: "16/9", minHeight: "clamp(220px, 50vw, 400px)" }}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex gap-8 mt-5 font-mono text-[11px] tracking-[1px]" style={{ color: "#8A8579" }}>
                <span>Duration: {reel.duration}</span>
                <span>Updated: {reel.updated}</span>
              </div>
            </div>
          </FadeUp>
        ))}

        {/* After Midnight — two videos side by side */}
        <FadeUp delay={0.15}>
          <div style={{ marginTop: "clamp(60px, 10vw, 100px)" }}>
            <div className="font-mono text-[11px] tracking-[4px] uppercase text-gold mb-4">
              After Midnight
            </div>
            <div
              className="font-serif font-bold text-cream mb-3"
              style={{ fontSize: "clamp(22px, 4vw, 48px)" }}
            >
              After Midnight with Taylor Tomlinson — CBS
            </div>
            <div className="text-sm sm:text-base max-w-[600px]" style={{ color: "#8A8579", lineHeight: 1.7, marginBottom: "clamp(24px, 4vw, 40px)" }}>
              Opening title sequence and gameplay stage graphics for CBS&apos;s After Midnight with Taylor Tomlinson. Broadcast design, animation, and finishing.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {AFTER_MIDNIGHT_VIDEOS.map((vid) => (
                <div key={vid.sublabel}>
                  <div className="font-mono text-[10px] tracking-[3px] uppercase mb-3" style={{ color: "#C5A455" }}>
                    {vid.sublabel}
                  </div>
                  <div className="w-full bg-[#111] border border-rule rounded-[4px] overflow-hidden">
                    {vid.embedUrl ? (
                      <iframe
                        src={vid.embedUrl.replace("/watch/", "/embed/")}
                        className="w-full"
                        style={{ border: "none", height: "auto", aspectRatio: "16/9" }}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={vid.src}
                        className="w-full"
                        style={{ aspectRatio: "16/9", objectFit: "cover" }}
                        controls
                        playsInline
                        preload="metadata"
                      />
                    )}
                  </div>
                  <div className="mt-3 font-mono text-[11px] tracking-[1px]" style={{ color: "#8A8579" }}>
                    Duration: {vid.duration}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </FadeUp>
      </section>

      <Footer />
    </PageTransition>
  );
}
