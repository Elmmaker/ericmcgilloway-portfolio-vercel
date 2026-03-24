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
  {
    label: "Opening Titles",
    title: "After Midnight with Taylor Tomlinson — CBS",
    desc: "Opening title sequence for CBS's After Midnight with Taylor Tomlinson. Broadcast design, animation, and finishing.",
    embedUrl: "https://framerate.tv/watch/659a3cdd-bee0-4230-a232-1c26b1a81a2e",
    duration: "0:31",
    updated: "2025",
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

        {REELS.map((reel, i) => (
          <FadeUp key={reel.title} delay={i * 0.15}>
            <div style={{ marginBottom: i < REELS.length - 1 ? "40px" : "40px", marginTop: i > 0 ? "clamp(60px, 10vw, 100px)" : undefined }}>
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

              {/* Video embed — native aspect ratio */}
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
      </section>

      <Footer />
    </PageTransition>
  );
}
