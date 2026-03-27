"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import CursorTrail from "./components/CursorTrail";
import FadeUp from "./components/FadeUp";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";

const PROJECTS = [
  {
    id: 1,
    title: "Modern Marvels",
    subtitle: "History Channel/Hearst Media",
    role: "Sr. 3D and Map Animation Designer",
    type: "Documentary",
    year: "2026",
    color: "#C5A455",
    image: "/images/work/modern_marvels1.jpg",
    video: null,
  },
  {
    id: 2,
    title: "Conan",
    subtitle: "TBS/11 Seasons",
    role: "Lead Motion Graphics Designer",
    type: "Late Night",
    year: "2010–21",
    color: "#E05A3A",
    image: "/images/work/conan.jpg",
    video: "/clips/conan.mp4",
  },
  {
    id: 3,
    title: "Social Media Admats: Superman",
    subtitle: "Fracture Creative",
    role: "Sr. Motion Designer",
    type: "Entertainment Marketing",
    year: "2025",
    color: "#3A7BE0",
    projects: ["Five Nights At Freddy's", "Jurassic World", "How To Train Your Dragon"],
    image: "/images/work/superman-wide.jpg",
    video: "/clips/superman.mp4",
  },
  {
    id: 4,
    title: "After Midnight",
    titleExtra: "with Taylor Tomlinson",
    subtitle: "CBS/Paramount Studios",
    role: "Lead Motion Graphics Designer",
    type: "Broadcast",
    year: "2024–2025",
    color: "#8B5CF6",
    image: "/images/work/am1.jpg",
    video: "/clips/after-midnight.mp4",
  },
  {
    id: 5,
    title: "Entertainment Tonight",
    subtitle: "CBS",
    role: "Sr. Motion Designer",
    type: "Broadcast",
    year: "2023–2024",
    color: "#EC4899",
    image: "/images/work/et.jpg",
    video: "/clips/entertainment-tonight.mp4",
  },
];

const FILTERS = [
  "All",
  "Documentary",
  "Late Night",
  "Broadcast",
  "Entertainment Marketing",
];

const letterVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay: 0.4 + i * 0.035,
    },
  }),
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const name = "Eric McGilloway";

  const filteredProjects =
    activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.type === activeFilter);

  return (
    <PageTransition>
      <CursorTrail />
      {/* ── HERO ── */}
      <section
        className="flex flex-col justify-center relative"
        style={{
          paddingTop: "clamp(100px, 15vw, 140px)",
          paddingBottom: "clamp(60px, 10vw, 100px)",
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <div className="relative z-1">
          {/* Eyebrow */}
          <motion.div
            className="font-mono text-[11px] tracking-[4px] uppercase text-gold"
            style={{ marginBottom: "24px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.3,
            }}
          >
            Senior Motion Graphics Designer
          </motion.div>

          {/* Name */}
          <h1
            className="font-serif font-bold leading-[0.92]"
            style={{ fontSize: "clamp(36px, 9vw, 120px)", marginBottom: "20px" }}
          >
            {name.split("").map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                style={char === " " ? { width: "0.3em" } : undefined}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>

          {/* Tagline */}
          <motion.p
            className="text-muted max-w-[520px] leading-relaxed"
            style={{ fontSize: "clamp(15px, 2.2vw, 22px)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 1.0,
            }}
          >
            15+ years shaping the visual language of broadcast television. From
            late night to documentary. From network to streaming.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row flex-wrap"
            style={{ gap: "16px", marginTop: "clamp(32px, 5vw, 48px)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 1.3,
            }}
          >
            <a
              href="/reels"
              className="font-mono text-xs tracking-[2px] uppercase bg-gold text-dark border-none cursor-pointer hover:bg-gold-hover hover:-translate-y-0.5 transition-all duration-300 text-center"
              style={{ padding: "16px 32px", minHeight: "48px" }}
            >
              Watch Reel
            </a>
            <button
              onClick={() =>
                document
                  .getElementById("work")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="font-mono text-xs tracking-[2px] uppercase bg-transparent text-muted border border-surface cursor-pointer hover:border-gold hover:text-gold transition-all duration-300 text-center"
              style={{ padding: "16px 32px", minHeight: "48px" }}
            >
              Selected Work &darr;
            </button>
          </motion.div>
        </div>

      </section>

      {/* ── SELECTED WORK ── */}
      <section
        id="work"
        style={{
          paddingTop: "clamp(60px, 12vw, 120px)",
          paddingBottom: "clamp(40px, 8vw, 80px)",
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end flex-wrap gap-6" style={{ marginBottom: "clamp(32px, 6vw, 60px)" }}>
          <div>
            <FadeUp>
              <div className="font-mono text-[11px] tracking-[4px] uppercase text-gold" style={{ marginBottom: "12px" }}>
                02 / Selected Work
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2
                className="font-serif font-bold text-cream"
                style={{ fontSize: "clamp(28px, 5vw, 56px)" }}
              >
                Recent Work
              </h2>
            </FadeUp>
          </div>
          <div className="flex gap-1 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`font-mono text-[10px] tracking-[1.5px] uppercase border cursor-pointer transition-all duration-300 ${
                  f === activeFilter
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-rule bg-transparent text-dim hover:border-gold hover:bg-gold/10 hover:text-gold"
                }`}
                style={{ padding: "8px 16px", minHeight: "44px" }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
          {filteredProjects.map((p, i) => (
            <motion.div
              key={p.id}
              className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center cursor-pointer relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.1,
              }}
              style={
                { "--card-color": p.color, padding: "clamp(16px, 3vw, 32px) 0", gap: "clamp(16px, 3vw, 32px)" } as React.CSSProperties
              }
            >
              {/* Sheen divider */}
              <div className="absolute top-0 left-0 right-0 h-px bg-rule overflow-hidden">
                <div
                  className="work-sheen"
                  style={{ animationDelay: `${i * 0.7}s` }}
                />
              </div>

              {/* LEFT — Vertical accent line + Video or Still Image */}
              <div className="flex items-stretch gap-3 w-full md:w-[clamp(160px,18vw,260px)] flex-shrink-0">
                {/* Vertical color line */}
                <div
                  className="w-[3px] flex-shrink-0 rounded-full transition-all duration-400 work-accent-bar"
                  style={{ backgroundColor: "#C5A455" }}
                />
                <div className="flex-1 overflow-hidden rounded-[4px]">
                  {p.video ? (
                    <video
                      src={p.video}
                      className="w-full h-auto block"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                    />
                  ) : (
                    <div className="relative">
                      <Image
                        src={p.image}
                        alt={p.title}
                        width={520}
                        height={292}
                        className="w-full h-auto block"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* CENTER — Headings */}
              <div className="flex-1 min-w-0">
                <div
                  className="font-serif font-bold text-cream leading-tight group-hover:!text-[var(--card-color)] transition-all duration-400 work-title-glow"
                  style={{ fontSize: "clamp(22px, 3.5vw, 40px)" }}
                >
                  {p.title}
                </div>
                {"titleExtra" in p && p.titleExtra && (
                  <div className="font-serif text-cream" style={{ fontSize: "clamp(13px, 1.8vw, 18px)", marginTop: "4px" }}>
                    {p.titleExtra as string}
                  </div>
                )}
                {"projects" in p && p.projects && (
                  <div className="font-serif text-cream" style={{ fontSize: "clamp(13px, 1.5vw, 16px)", marginTop: "6px" }}>
                    {(p.projects as string[]).join(", ")}
                  </div>
                )}
                <span className="font-sans text-sm sm:text-base text-gold block" style={{ marginTop: "6px" }}>
                  {p.subtitle}
                </span>
              </div>

              {/* RIGHT — Subheadings / metadata */}
              <div className="text-left md:text-right flex-shrink-0">
                <div className="font-mono text-[11px] tracking-[2px] uppercase text-gold" style={{ marginBottom: "4px" }}>
                  {p.type}
                </div>
                <div className="font-sans text-sm text-muted">{p.role}</div>
                <div className="font-mono text-[13px] text-ghost" style={{ marginTop: "6px" }}>
                  {p.year}
                </div>
              </div>

            </motion.div>
          ))}
        </div>
        <div className="relative h-px bg-rule overflow-hidden">
          <div
            className="work-sheen"
            style={{ animationDelay: `${filteredProjects.length * 0.7}s` }}
          />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section
        id="about"
        style={{
          paddingTop: "clamp(60px, 12vw, 120px)",
          paddingBottom: "clamp(60px, 12vw, 120px)",
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <div className="sm:pl-10">
          {/* Name lockup */}
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-center sm:items-center w-full" style={{ gap: "clamp(20px, 4vw, 40px)", marginBottom: "40px" }}>
              <div className="overflow-hidden relative flex-shrink-0 w-[100px] h-[100px] sm:w-[180px] sm:h-[180px]" style={{ borderRadius: "50%", border: "2px solid #C5A455" }}>
                <Image
                  src="/images/eric-mcgilloway-profile.png"
                  alt="Eric McGilloway"
                  fill
                  sizes="(max-width: 640px) 100px, 180px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="font-serif font-bold text-cream" style={{ fontSize: "clamp(28px, 5vw, 44px)" }}>
                  Eric McGilloway
                </div>
                <div className="font-mono uppercase" style={{ fontSize: "clamp(11px, 1.5vw, 14px)", letterSpacing: "2.4px", color: "#C5A455", marginTop: "8px" }}>
                  Senior Motion Graphics Designer
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Heading */}
          <FadeUp delay={0.1}>
            <p
              className="font-serif text-cream text-center sm:text-left"
              style={{ fontSize: "clamp(24px, 4vw, 42px)", lineHeight: 1.4, marginBottom: "28px" }}
            >
              I make things move for a living.
            </p>
          </FadeUp>

          {/* Body */}
          <FadeUp delay={0.15}>
            <p className="font-sans text-center sm:text-left" style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: "#8A8579", lineHeight: 1.8, marginBottom: "56px", maxWidth: "680px" }}>
              15+ years designing for broadcast, social, and every screen in
              between. From 11 seasons on Conan to documentary work on Modern
              Marvels to entertainment marketing campaigns for major studio
              releases. Late night, documentary, episodic TV -- I love the
              work and I&apos;m lucky to do it. I&apos;m easy to work with,
              organized, and self-motivated. Let&apos;s build something
              together.
            </p>
          </FadeUp>

          {/* Stats */}
          <FadeUp delay={0.2}>
            <div className="flex flex-wrap justify-center sm:justify-start" style={{ gap: "clamp(32px, 5vw, 56px)", borderTop: "1px solid #1E1D1A", paddingTop: "32px" }}>
              {[
                { num: "15+", label: "Years" },
                { num: "2,000+", label: "Episodes" },
                { num: "Local 800", label: "Union" },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div
                    className="font-serif font-bold text-gold"
                    style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
                  >
                    {stat.num}
                  </div>
                  <div className="font-mono text-[10px] tracking-[2px] uppercase text-dim mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .group:hover .work-accent-bar {
          background-color: var(--card-color) !important;
        }
        .group:hover .work-title-glow {
          text-shadow:
            0 0 8px var(--card-color),
            0 0 20px var(--card-color),
            0 0 40px color-mix(in srgb, var(--card-color) 50%, transparent);
        }
        .work-title-glow {
          text-shadow: none;
          transition: text-shadow 0.4s ease, color 0.4s ease;
        }
        .work-sheen {
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
          animation: workSheenSweep 14s ease-in-out infinite;
        }
        @keyframes workSheenSweep {
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

    </PageTransition>
  );
}
