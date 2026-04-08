"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import FadeUp from "../components/FadeUp";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";

type KeyArtItem = {
  id: number;
  filename: string;
  title: string;
  desc: string;
  cat: string;
  w: number;
  h: number;
  group: string;
};

const KEY_ART: KeyArtItem[] = [
  // Group 1: Conan
  { id: 17, filename: "conan-obrien-keyart-01-horz.png", title: "Conan O'Brien", desc: "Key art 01 horizontal", cat: "Entertainment Marketing", w: 3840, h: 2160, group: "Conan" },
  { id: 18, filename: "conan-obrien-keyart-01-vert.png", title: "Conan O'Brien", desc: "Key art 01 vertical", cat: "Entertainment Marketing", w: 2000, h: 3000, group: "Conan" },
  { id: 19, filename: "conan-obrien-keyart-01alt-horz.png", title: "Conan O'Brien", desc: "Key art 01 alt horizontal", cat: "Entertainment Marketing", w: 3840, h: 2160, group: "Conan" },
  { id: 20, filename: "conan-obrien-keyart-01alt-vert.png", title: "Conan O'Brien", desc: "Key art 01 alt vertical", cat: "Entertainment Marketing", w: 2000, h: 3000, group: "Conan" },
  { id: 21, filename: "conan-obrien-keyart-02-horz.png", title: "Conan O'Brien", desc: "Key art 02 horizontal", cat: "Entertainment Marketing", w: 3840, h: 2160, group: "Conan" },
  { id: 22, filename: "conan-obrien-keyart-02-vert.png", title: "Conan O'Brien", desc: "Key art 02 vertical", cat: "Entertainment Marketing", w: 2000, h: 3000, group: "Conan" },
  { id: 23, filename: "conan-obrien-keyart-02alt-horz.png", title: "Conan O'Brien", desc: "Key art 02 alt horizontal", cat: "Entertainment Marketing", w: 3840, h: 2160, group: "Conan" },
  { id: 24, filename: "conan-obrien-keyart-02alt-vert.png", title: "Conan O'Brien", desc: "Key art 02 alt vertical", cat: "Entertainment Marketing", w: 2000, h: 3000, group: "Conan" },
  { id: 25, filename: "conan-obrien-keyart-03-horz.png", title: "Conan O'Brien", desc: "Key art 03 horizontal", cat: "Entertainment Marketing", w: 3840, h: 2160, group: "Conan" },
  { id: 26, filename: "conan-obrien-keyart-03-vert.png", title: "Conan O'Brien", desc: "Key art 03 vertical", cat: "Entertainment Marketing", w: 2000, h: 3000, group: "Conan" },
  { id: 16, filename: "conan-in-cuba-keyart.png", title: "Conan in Cuba", desc: "Cuba special key art", cat: "Entertainment Marketing", w: 2084, h: 2234, group: "Conan" },
  { id: 37, filename: "BCB_v6_email.jpeg", title: "Conan", desc: "BCB v6 email key art", cat: "Entertainment Marketing", w: 1334, h: 1950, group: "Conan" },
  { id: 38, filename: "VIVINO_TourSmall.jpeg", title: "Conan", desc: "Vivino tour key art", cat: "Entertainment Marketing", w: 1500, h: 2118, group: "Conan" },

  // Group 2: Charlie Berens
  { id: 6, filename: "charlie-berens-grid-01.png", title: "Charlie Berens", desc: "Social media grid layout 01", cat: "Comedy / Touring", w: 1711, h: 2056, group: "Charlie Berens" },
  { id: 7, filename: "charlie-berens-grid-02.png", title: "Charlie Berens", desc: "Social media grid layout 02", cat: "Comedy / Touring", w: 1711, h: 2056, group: "Charlie Berens" },
  { id: 8, filename: "charlie-berens-moodboards-2025.png", title: "Charlie Berens", desc: "Moodboards 2025", cat: "Comedy / Touring", w: 1500, h: 3805, group: "Charlie Berens" },
  { id: 9, filename: "charlie-berens-out-there-tour-01.png", title: "Charlie Berens", desc: "Out There Tour key art 01", cat: "Comedy / Touring", w: 1650, h: 2550, group: "Charlie Berens" },
  { id: 10, filename: "charlie-berens-out-there-tour-02.png", title: "Charlie Berens", desc: "Out There Tour key art 02", cat: "Comedy / Touring", w: 1650, h: 2550, group: "Charlie Berens" },
  { id: 11, filename: "charlie-berens-out-there-tour-04.png", title: "Charlie Berens", desc: "Out There Tour key art 04", cat: "Comedy / Touring", w: 1650, h: 2550, group: "Charlie Berens" },

  // Group 3: Bert Kreischer
  { id: 2, filename: "bert-kreischer-cruise.jpg", title: "Bert Kreischer", desc: "Cruise key art", cat: "Comedy / Touring", w: 2000, h: 907, group: "Bert Kreischer" },
  { id: 3, filename: "bert-kreischer-fl-tour-v1.jpg", title: "Bert Kreischer", desc: "Fully Loaded tour key art v1", cat: "Comedy / Touring", w: 2310, h: 3094, group: "Bert Kreischer" },
  { id: 4, filename: "bert-kreischer-fully-loaded-great-dane-roadside.png", title: "Bert Kreischer", desc: "Great Dane trailer roadside billboard", cat: "Comedy / Touring", w: 6142, h: 1000, group: "Bert Kreischer" },
  { id: 5, filename: "bert-kreischer-truck-wrap.png", title: "Bert Kreischer", desc: "Truck wrap design", cat: "Comedy / Touring", w: 2500, h: 1337, group: "Bert Kreischer" },
  { id: 27, filename: "fully-loaded-2023-keyart-01.jpg", title: "Fully Loaded Festival", desc: "2023 festival key art 01", cat: "Live Events", w: 1500, h: 1974, group: "Bert Kreischer" },
  { id: 28, filename: "fully-loaded-2023-keyart-02.jpg", title: "Fully Loaded Festival", desc: "2023 festival key art 02", cat: "Live Events", w: 1500, h: 2000, group: "Bert Kreischer" },
  { id: 29, filename: "fully-loaded-2023-keyart-03.jpg", title: "Fully Loaded Festival", desc: "2023 festival key art 03", cat: "Live Events", w: 1500, h: 2000, group: "Bert Kreischer" },
  { id: 31, filename: "fully-loaded-family-1x1.jpg", title: "Fully Loaded Festival", desc: "Family key art 1:1", cat: "Live Events", w: 1000, h: 1000, group: "Bert Kreischer" },
  { id: 32, filename: "fully-loaded-keyart-01-v3.jpg", title: "Fully Loaded Festival", desc: "Key art 01 v3", cat: "Live Events", w: 1500, h: 1974, group: "Bert Kreischer" },

  // Group 4: Everything else
  { id: 0, filename: "absolut-vodka-creativity-v4.jpg", title: "Absolut Vodka", desc: "Creativity campaign v4", cat: "Advertising / Brand", w: 2400, h: 3133, group: "More Work" },
  { id: 1, filename: "bd-keyart-01.jpg", title: "BD", desc: "Key art 01", cat: "Entertainment Marketing", w: 1000, h: 1500, group: "More Work" },
  { id: 15, filename: "con-air-keyart-01.jpg", title: "Con Air", desc: "Key art 01", cat: "Entertainment Marketing", w: 1726, h: 2318, group: "More Work" },
  { id: 33, filename: "fyse-in-conversation-julia-garner.jpg", title: "FYSE In Conversation", desc: "Julia Garner In Conversation", cat: "Entertainment Marketing", w: 3840, h: 2160, group: "More Work" },
  { id: 34, filename: "fyse-storytellers-keyart.png", title: "FYSE Storytellers", desc: "Storytellers key art v2", cat: "Entertainment Marketing", w: 3840, h: 2160, group: "More Work" },
  { id: 35, filename: "music-milestones-v5.jpg", title: "Music Milestones", desc: "Music Milestones email key art v5", cat: "Entertainment Marketing", w: 6659, h: 2685, group: "More Work" },
  { id: 36, filename: "music-of-netflix-fyse-v1.jpg", title: "Music of Netflix", desc: "FYSE campaign key art", cat: "Entertainment Marketing", w: 2660, h: 1492, group: "More Work" },
  { id: 39, filename: "FYSE_CraftsDay_v1_em.jpg", title: "FYSE Crafts Day", desc: "Crafts Day key art", cat: "Entertainment Marketing", w: 3840, h: 2160, group: "More Work" },
];

const GROUP_ORDER = ["Conan", "Charlie Berens", "Bert Kreischer", "More Work"];

const KA_FILTERS = [
  "All",
  "Entertainment Marketing",
  "Comedy / Touring",
  "Live Events",
  "Advertising / Brand",
];

function GlowDivider() {
  return (
    <div className="glow-divider" style={{ position: "relative", height: "1px", margin: "60px 0 48px", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "#C5A455", opacity: 0.3 }} />
      <div className="glow-sheen" />
    </div>
  );
}

export default function KeyArtPage() {
  const [kaFilter, setKaFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const lightboxRef = useRef<HTMLDivElement>(null);
  const lightboxTriggerRef = useRef<HTMLElement | null>(null);

  const filtered = useMemo(() =>
    kaFilter === "All" ? KEY_ART : KEY_ART.filter((k) => k.cat === kaFilter),
    [kaFilter]
  );

  const groups = useMemo(() => {
    const groupMap = new Map<string, KeyArtItem[]>();
    for (const item of filtered) {
      const existing = groupMap.get(item.group);
      if (existing) existing.push(item);
      else groupMap.set(item.group, [item]);
    }
    return GROUP_ORDER
      .filter((g) => groupMap.has(g))
      .map((g) => ({ name: g, items: groupMap.get(g)! }));
  }, [filtered]);

  const flatFiltered = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const openLightbox = useCallback((item: KeyArtItem, trigger: HTMLElement) => {
    const idx = flatFiltered.findIndex((f) => f.id === item.id);
    lightboxTriggerRef.current = trigger;
    setLightbox(idx);
    document.body.style.overflow = "hidden";
  }, [flatFiltered]);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    document.body.style.overflow = "";
  }, []);

  const navLightbox = useCallback(
    (dir: number) => {
      if (lightbox === null) return;
      setLightbox(
        (lightbox + dir + flatFiltered.length) % flatFiltered.length
      );
    },
    [lightbox, flatFiltered.length]
  );

  // Move focus into lightbox on open; return focus on close
  useEffect(() => {
    if (lightbox !== null) {
      requestAnimationFrame(() => {
        lightboxRef.current?.focus();
      });
    } else {
      lightboxTriggerRef.current?.focus();
    }
  }, [lightbox !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightbox === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navLightbox(-1);
      if (e.key === "ArrowRight") navLightbox(1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox, navLightbox]);

  // Lightbox focus trap
  function handleLightboxKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const dialog = lightboxRef.current;
    if (!dialog) return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>("button:not([disabled])")
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const currentItem = lightbox !== null ? flatFiltered[lightbox] : null;

  return (
    <PageTransition>
      <section
        style={{
          paddingTop: "clamp(120px, 15vw, 140px)",
          paddingBottom: "clamp(40px, 8vw, 80px)",
          paddingLeft: "clamp(16px, 6vw, 80px)",
          paddingRight: "clamp(16px, 6vw, 80px)",
        }}
      >
        <FadeUp>
          <div className="font-mono text-[11px] tracking-[4px] uppercase text-gold" style={{ marginBottom: "12px" }}>
            03 / Key Art
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h1
            className="font-serif font-bold text-cream"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Key Art &amp; Stills
          </h1>
        </FadeUp>
        <FadeUp delay={0.15}>
          <p className="text-base text-muted max-w-[560px]" style={{ marginTop: "12px", lineHeight: 1.7 }}>
            Print, digital, and social campaign artwork from broadcast,
            comedy touring, live events, and entertainment marketing projects.
          </p>
        </FadeUp>

        {/* Filters */}
        <div className="flex gap-1 flex-wrap" style={{ marginTop: "32px" }}>
          {KA_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setKaFilter(f)}
              aria-pressed={f === kaFilter}
              className={`font-mono text-[10px] tracking-[1.5px] uppercase border cursor-pointer transition-all duration-300 ${
                f === kaFilter
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-rule bg-transparent text-dim hover:border-gold hover:bg-gold/10 hover:text-gold"
              }`}
              style={{ padding: "8px 16px", minHeight: "44px" }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grouped Masonry Grid */}
        <div style={{ marginTop: "clamp(32px, 5vw, 48px)" }}>
          {groups.map((group, gi) => (
            <div key={group.name}>
              {gi > 0 && <GlowDivider />}
              <FadeUp>
                <div
                  className="font-mono uppercase"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "2px",
                    color: "#C5A455",
                    marginBottom: "24px",
                  }}
                >
                  {group.name}
                </div>
              </FadeUp>
              <div className="ka-masonry">
                {group.items.map((item, i) => (
                  <motion.div
                    key={`${item.id}-${kaFilter}`}
                    className="relative overflow-visible rounded-[4px] border border-rule group-hover:border-gold/60 cursor-pointer group transition-all duration-300 hover:scale-[1.03]"
                    style={{ breakInside: "avoid", marginBottom: "16px", transformOrigin: "center center" }}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30, scale: shouldReduceMotion ? 1 : 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{
                      duration: shouldReduceMotion ? 0.15 : 0.6,
                      ease: [0.22, 1, 0.36, 1],
                      delay: shouldReduceMotion ? 0 : Math.min(i * 0.04, 0.4),
                    }}
                    onClick={(e) => openLightbox(item, e.currentTarget as HTMLElement)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.title} — ${item.desc}. Open lightbox.`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openLightbox(item, e.currentTarget as HTMLElement);
                      }
                    }}
                  >
                    {/* Gold frame on hover */}
                    <div className="absolute inset-0 rounded-[3px] border-2 border-transparent group-hover:border-gold/70 transition-colors duration-300 z-10 pointer-events-none" />
                    <div
                      className="w-full relative bg-[#1A1917]"
                      style={{ aspectRatio: `${item.w} / ${item.h}` }}
                    >
                      <Image
                        src={`/key-art/${item.filename}`}
                        alt={`${item.title} — ${item.desc}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 280px"
                        className="object-cover"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && currentItem && (
          <motion.div
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            tabIndex={-1}
            className="fixed inset-0 z-200 flex items-center justify-center px-4 sm:px-10 py-16 sm:p-10 cursor-zoom-out focus:outline-none"
            style={{
              background: "rgba(0,0,0,0.92)",
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            onKeyDown={handleLightboxKeyDown}
          >
            <button
              className="absolute top-6 right-8 font-mono text-[13px] text-dim hover:text-gold cursor-pointer bg-transparent border-none tracking-[2px] transition-colors duration-300"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              CLOSE <span aria-hidden="true">&#10005;</span>
            </button>
            <button
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 border border-surface rounded-full bg-dark/80 text-muted text-xl cursor-pointer hover:border-gold hover:text-gold transition-all duration-300 flex items-center justify-center"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                navLightbox(-1);
              }}
            >
              <span aria-hidden="true">&#8249;</span>
            </button>
            <button
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 border border-surface rounded-full bg-dark/80 text-muted text-xl cursor-pointer hover:border-gold hover:text-gold transition-all duration-300 flex items-center justify-center"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                navLightbox(1);
              }}
            >
              <span aria-hidden="true">&#8250;</span>
            </button>

            <div
              className="max-w-[90vw] max-h-[85vh] relative flex flex-col items-center gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative" style={{ maxWidth: "90vw", maxHeight: "70vh" }}>
                <Image
                  src={`/key-art/${currentItem.filename}`}
                  alt={`${currentItem.title} — ${currentItem.desc}`}
                  width={1200}
                  height={900}
                  className="rounded-[4px] border border-surface"
                  style={{ maxWidth: "90vw", maxHeight: "70vh", width: "auto", height: "auto", objectFit: "contain" }}
                />
              </div>
              <div className="text-center">
                <div id="lightbox-title" className="font-serif text-2xl font-bold text-cream mb-1">
                  {currentItem.title}
                </div>
                <div className="font-mono text-[11px] text-gold tracking-[2px] uppercase">
                  {currentItem.desc}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .ka-masonry {
          columns: 280px;
          column-gap: 16px;
        }
        @media (max-width: 768px) {
          .ka-masonry {
            columns: 2;
          }
        }
        @media (max-width: 480px) {
          .ka-masonry {
            columns: 1;
          }
        }
        .glow-sheen {
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
          .glow-sheen {
            animation: sheenSweep 3.5s ease-in-out infinite;
          }
        }
        @keyframes sheenSweep {
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
