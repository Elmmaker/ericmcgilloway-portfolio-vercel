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
    subtitle: "WW2 Chapter",
    role: "Lead Map Designer",
    type: "Documentary",
    year: "2024–25",
    color: "#C5A455",
  },
  {
    id: 2,
    title: "Conan",
    subtitle: "11 Seasons",
    role: "Sr. Motion Designer",
    type: "Late Night",
    year: "2010–21",
    color: "#E05A3A",
  },
  {
    id: 3,
    title: "Superman",
    subtitle: "Campaign",
    role: "Motion Designer",
    type: "Entertainment Marketing",
    year: "2025",
    color: "#3A7BE0",
  },
  {
    id: 4,
    title: "After Midnight",
    subtitle: "CBS/Paramount",
    role: "Motion Designer",
    type: "Broadcast",
    year: "2023",
    color: "#8B5CF6",
  },
  {
    id: 5,
    title: "Entertainment Tonight",
    subtitle: "Season Package",
    role: "Sr. Motion Designer",
    type: "Broadcast",
    year: "2022",
    color: "#EC4899",
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
          minHeight: "100vh",
          paddingLeft: "clamp(24px, 6vw, 80px)",
          paddingRight: "clamp(24px, 6vw, 80px)",
        }}
      >
        {/* Vertical accent line */}
        <motion.div
          className="absolute top-0 right-[15%] w-px"
          style={{
            background:
              "linear-gradient(to bottom, transparent, #C5A455 40%, #C5A455 60%, transparent)",
          }}
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.5,
          }}
        />

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
            style={{ fontSize: "clamp(48px, 9vw, 120px)", marginBottom: "20px" }}
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
            style={{ fontSize: "clamp(16px, 2.2vw, 22px)" }}
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
            className="flex flex-wrap"
            style={{ gap: "20px", marginTop: "48px" }}
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
              className="font-mono text-xs tracking-[2px] uppercase bg-gold text-dark border-none cursor-pointer hover:bg-gold-hover hover:-translate-y-0.5 transition-all duration-300"
              style={{ padding: "16px 32px" }}
            >
              Watch Reel
            </a>
            <button
              onClick={() =>
                document
                  .getElementById("work")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="font-mono text-xs tracking-[2px] uppercase bg-transparent text-muted border border-surface cursor-pointer hover:border-gold hover:text-gold transition-all duration-300"
              style={{ padding: "16px 32px" }}
            >
              Selected Work &darr;
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <div
            className="w-px h-10"
            style={{
              background: "linear-gradient(to bottom, #C5A455, transparent)",
              animation: "scrollPulse 2s ease-in-out infinite",
            }}
          />
        </motion.div>
      </section>

      {/* ── SELECTED WORK ── */}
      <section
        id="work"
        style={{
          paddingTop: "120px",
          paddingBottom: "80px",
          paddingLeft: "clamp(24px, 6vw, 80px)",
          paddingRight: "clamp(24px, 6vw, 80px)",
        }}
      >
        <div className="flex justify-between items-end flex-wrap gap-6" style={{ marginBottom: "60px" }}>
          <div>
            <FadeUp>
              <div className="font-mono text-[11px] tracking-[4px] uppercase text-gold" style={{ marginBottom: "12px" }}>
                02 / Selected Work
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2
                className="font-serif font-bold text-cream"
                style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
              >
                The Work
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
                style={{ padding: "8px 16px" }}
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
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr] border-t border-rule cursor-pointer relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.1,
              }}
              style={
                { "--card-color": p.color, padding: "48px 0 48px 40px" } as React.CSSProperties
              }
            >
              {/* Accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-400"
                style={{
                  background: p.color,
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />

              <div>
                <div
                  className="font-serif font-bold text-cream leading-tight group-hover:!text-[var(--card-color)] transition-colors duration-400"
                  style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
                >
                  {p.title}
                </div>
                <span className="font-sans text-base text-gold block" style={{ marginTop: "6px" }}>
                  {p.subtitle}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="font-mono text-[11px] tracking-[2px] uppercase text-gold" style={{ marginBottom: "4px" }}>
                    {p.type}
                  </div>
                  <div className="font-sans text-sm text-muted">{p.role}</div>
                </div>
                <div className="font-mono text-[13px] text-ghost">
                  {p.year}
                </div>
              </div>

              {/* View arrow */}
              <div
                className="absolute right-0 top-1/2 font-sans text-sm flex items-center gap-2 opacity-0 -translate-x-2.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                style={{ color: p.color, transform: "translateY(-50%)" }}
              >
                View &rarr;
              </div>
            </motion.div>
          ))}
        </div>
        <div className="border-t border-rule" />
      </section>

      {/* ── ABOUT ── */}
      <section
        id="about"
        className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-start"
        style={{
          paddingTop: "120px",
          paddingBottom: "120px",
          paddingLeft: "clamp(24px, 6vw, 80px)",
          paddingRight: "clamp(24px, 6vw, 80px)",
          gap: "80px",
        }}
      >
        <div className="flex flex-col" style={{ gap: "32px" }}>
          <FadeUp>
            <div className="font-mono text-[11px] tracking-[4px] uppercase text-gold" style={{ marginBottom: "12px" }}>
              03 / About
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="overflow-hidden border border-rule relative" style={{ width: "100%", maxWidth: "220px", aspectRatio: "1", borderRadius: "4px" }}>
              <Image
                src="/images/eric-mcgilloway-profile.png"
                alt="Eric McGilloway"
                fill
                sizes="220px"
                className="object-cover"
              />
              <div className="absolute inset-0 border border-gold/[0.08]" />
            </div>
          </FadeUp>
        </div>

        <FadeUp>
          <p
            className="font-serif text-cream"
            style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.5, marginBottom: "32px" }}
          >
            I make things move for a living. For over fifteen years, I&apos;ve
            designed motion graphics for the biggest names in broadcast
            television.
          </p>
          <p className="text-base text-muted max-w-[560px]" style={{ lineHeight: 1.8, marginBottom: "40px" }}>
            From 11 seasons on Conan to documentary work on Modern Marvels to
            entertainment marketing campaigns for major studio releases. After
            Effects, Cinema 4D, Redshift &mdash; whatever the tool, the goal is
            the same: make it impossible to look away.
          </p>
          <div className="grid grid-cols-3 border-t border-rule" style={{ gap: "32px", paddingTop: "32px" }}>
            {[
              { num: "15+", label: "Years" },
              { num: "200+", label: "Episodes" },
              { num: "Local 800", label: "Union" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="font-serif font-bold text-gold"
                  style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
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
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes scrollPulse {
          0%,
          100% {
            opacity: 0.4;
            transform: scaleY(1);
          }
          50% {
            opacity: 1;
            transform: scaleY(1.3);
          }
        }
      `}</style>
    </PageTransition>
  );
}
