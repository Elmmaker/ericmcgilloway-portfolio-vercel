"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import FadeUp from "../components/FadeUp";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";

const KEY_ART = [
  { id: 0, filename: "absolut-vodka-creativity-v4.jpg", title: "Absolut Vodka", desc: "Creativity campaign v4", cat: "Advertising / Brand", w: 2400, h: 3133 },
  { id: 1, filename: "bd-keyart-01.jpg", title: "BD", desc: "Key art 01", cat: "Entertainment Marketing", w: 1000, h: 1500 },
  { id: 2, filename: "bert-kreischer-cruise.jpg", title: "Bert Kreischer", desc: "Cruise key art", cat: "Comedy / Touring", w: 2000, h: 907 },
  { id: 3, filename: "bert-kreischer-fl-tour-v1.jpg", title: "Bert Kreischer", desc: "Fully Loaded tour key art v1", cat: "Comedy / Touring", w: 2310, h: 3094 },
  { id: 4, filename: "bert-kreischer-fully-loaded-great-dane-roadside.png", title: "Bert Kreischer", desc: "Great Dane trailer roadside billboard", cat: "Comedy / Touring", w: 6142, h: 1000 },
  { id: 5, filename: "bert-kreischer-truck-wrap.png", title: "Bert Kreischer", desc: "Truck wrap design", cat: "Comedy / Touring", w: 2500, h: 1337 },
  { id: 6, filename: "charlie-berens-grid-01.png", title: "Charlie Berens", desc: "Social media grid layout 01", cat: "Comedy / Touring", w: 1711, h: 2056 },
  { id: 7, filename: "charlie-berens-grid-02.png", title: "Charlie Berens", desc: "Social media grid layout 02", cat: "Comedy / Touring", w: 1711, h: 2056 },
  { id: 8, filename: "charlie-berens-moodboards-2025.png", title: "Charlie Berens", desc: "Moodboards 2025", cat: "Comedy / Touring", w: 1500, h: 3805 },
  { id: 9, filename: "charlie-berens-out-there-tour-01.png", title: "Charlie Berens", desc: "Out There Tour key art 01", cat: "Comedy / Touring", w: 1650, h: 2550 },
  { id: 10, filename: "charlie-berens-out-there-tour-02.png", title: "Charlie Berens", desc: "Out There Tour key art 02", cat: "Comedy / Touring", w: 1650, h: 2550 },
  { id: 11, filename: "charlie-berens-out-there-tour-04.png", title: "Charlie Berens", desc: "Out There Tour key art 04", cat: "Comedy / Touring", w: 1650, h: 2550 },
  { id: 12, filename: "charlie-berens-poster-bluebrick-16x9.png", title: "Charlie Berens", desc: "Blue Brick poster 16:9", cat: "Comedy / Touring", w: 1920, h: 1080 },
  { id: 13, filename: "charlie-berens-poster-bluebrick-1x1.png", title: "Charlie Berens", desc: "Blue Brick poster 1:1", cat: "Comedy / Touring", w: 1080, h: 1080 },
  { id: 14, filename: "charlie-berens-poster-bluebrick-9x16.png", title: "Charlie Berens", desc: "Blue Brick poster 9:16", cat: "Comedy / Touring", w: 1080, h: 1920 },
  { id: 15, filename: "con-air-keyart-01.jpg", title: "Con Air", desc: "Key art 01", cat: "Entertainment Marketing", w: 1726, h: 2318 },
  { id: 16, filename: "conan-in-cuba-keyart.png", title: "Conan in Cuba", desc: "Cuba special key art", cat: "Entertainment Marketing", w: 2084, h: 2234 },
  { id: 17, filename: "conan-obrien-keyart-01-horz.png", title: "Conan O'Brien", desc: "Key art 01 horizontal", cat: "Entertainment Marketing", w: 3840, h: 2160 },
  { id: 18, filename: "conan-obrien-keyart-01-vert.png", title: "Conan O'Brien", desc: "Key art 01 vertical", cat: "Entertainment Marketing", w: 2000, h: 3000 },
  { id: 19, filename: "conan-obrien-keyart-01alt-horz.png", title: "Conan O'Brien", desc: "Key art 01 alt horizontal", cat: "Entertainment Marketing", w: 3840, h: 2160 },
  { id: 20, filename: "conan-obrien-keyart-01alt-vert.png", title: "Conan O'Brien", desc: "Key art 01 alt vertical", cat: "Entertainment Marketing", w: 2000, h: 3000 },
  { id: 21, filename: "conan-obrien-keyart-02-horz.png", title: "Conan O'Brien", desc: "Key art 02 horizontal", cat: "Entertainment Marketing", w: 3840, h: 2160 },
  { id: 22, filename: "conan-obrien-keyart-02-vert.png", title: "Conan O'Brien", desc: "Key art 02 vertical", cat: "Entertainment Marketing", w: 2000, h: 3000 },
  { id: 23, filename: "conan-obrien-keyart-02alt-horz.png", title: "Conan O'Brien", desc: "Key art 02 alt horizontal", cat: "Entertainment Marketing", w: 3840, h: 2160 },
  { id: 24, filename: "conan-obrien-keyart-02alt-vert.png", title: "Conan O'Brien", desc: "Key art 02 alt vertical", cat: "Entertainment Marketing", w: 2000, h: 3000 },
  { id: 25, filename: "conan-obrien-keyart-03-horz.png", title: "Conan O'Brien", desc: "Key art 03 horizontal", cat: "Entertainment Marketing", w: 3840, h: 2160 },
  { id: 26, filename: "conan-obrien-keyart-03-vert.png", title: "Conan O'Brien", desc: "Key art 03 vertical", cat: "Entertainment Marketing", w: 2000, h: 3000 },
  { id: 27, filename: "fully-loaded-2023-keyart-01.jpg", title: "Fully Loaded Festival", desc: "2023 festival key art 01", cat: "Live Events", w: 1500, h: 1974 },
  { id: 28, filename: "fully-loaded-2023-keyart-02.jpg", title: "Fully Loaded Festival", desc: "2023 festival key art 02", cat: "Live Events", w: 1500, h: 2000 },
  { id: 29, filename: "fully-loaded-2023-keyart-03.jpg", title: "Fully Loaded Festival", desc: "2023 festival key art 03", cat: "Live Events", w: 1500, h: 2000 },
  { id: 30, filename: "fully-loaded-cup-web.jpg", title: "Fully Loaded Festival", desc: "Cup web graphic", cat: "Live Events", w: 2000, h: 907 },
  { id: 31, filename: "fully-loaded-family-1x1.jpg", title: "Fully Loaded Festival", desc: "Family key art 1:1", cat: "Live Events", w: 1000, h: 1000 },
  { id: 32, filename: "fully-loaded-keyart-01-v3.jpg", title: "Fully Loaded Festival", desc: "Key art 01 v3", cat: "Live Events", w: 1500, h: 1974 },
  { id: 33, filename: "fyse-in-conversation-julia-garner.jpg", title: "FYSE In Conversation", desc: "Julia Garner In Conversation", cat: "Entertainment Marketing", w: 3840, h: 2160 },
  { id: 34, filename: "fyse-storytellers-keyart.png", title: "FYSE Storytellers", desc: "Storytellers key art v2", cat: "Entertainment Marketing", w: 3840, h: 2160 },
  { id: 35, filename: "music-milestones-v5.jpg", title: "Music Milestones", desc: "Music Milestones email key art v5", cat: "Entertainment Marketing", w: 6659, h: 2685 },
  { id: 36, filename: "music-of-netflix-fyse-v1.jpg", title: "Music of Netflix", desc: "FYSE campaign key art", cat: "Entertainment Marketing", w: 2660, h: 1492 },
];

const KA_FILTERS = [
  "All",
  "Entertainment Marketing",
  "Comedy / Touring",
  "Live Events",
  "Advertising / Brand",
];

export default function KeyArtPage() {
  const [kaFilter, setKaFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    kaFilter === "All" ? KEY_ART : KEY_ART.filter((k) => k.cat === kaFilter);

  const openLightbox = useCallback((index: number) => {
    setLightbox(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    document.body.style.overflow = "";
  }, []);

  const navLightbox = useCallback(
    (dir: number) => {
      if (lightbox === null) return;
      setLightbox(
        (lightbox + dir + filtered.length) % filtered.length
      );
    },
    [lightbox, filtered.length]
  );

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

  const currentItem = lightbox !== null ? filtered[lightbox] : null;

  return (
    <PageTransition>
      <section
        style={{
          paddingTop: "140px",
          paddingBottom: "80px",
          paddingLeft: "clamp(24px, 6vw, 80px)",
          paddingRight: "clamp(24px, 6vw, 80px)",
        }}
      >
        <FadeUp>
          <div className="font-mono text-[11px] tracking-[4px] uppercase text-gold" style={{ marginBottom: "12px" }}>
            02 / Key Art
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2
            className="font-serif font-bold text-cream"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Key Art &amp; Stills
          </h2>
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
              className={`font-mono text-[10px] tracking-[1.5px] uppercase border cursor-pointer transition-all duration-300 ${
                f === kaFilter
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-rule bg-transparent text-dim hover:border-gold hover:bg-gold/10 hover:text-gold"
              }`}
              style={{ padding: "8px 16px" }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div
          style={{
            marginTop: "48px",
            columns: "280px",
            columnGap: "16px",
          }}
        >
          {filtered.map((item, i) => (
            <motion.div
              key={`${item.id}-${kaFilter}`}
              className="relative overflow-hidden rounded-[4px] border border-rule cursor-pointer group"
              style={{ breakInside: "avoid", marginBottom: "16px" }}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: Math.min(i * 0.04, 0.4),
              }}
              onClick={() => openLightbox(i)}
            >
              <div
                className="w-full relative group-hover:scale-105 transition-transform duration-500 bg-[#1A1917]"
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
              <div className="absolute inset-0 bg-gradient-to-t from-dark/95 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5">
                <div className="font-serif text-lg font-bold text-cream mb-1">
                  {item.title}
                </div>
                <div className="font-mono text-[10px] tracking-[1px] text-gold uppercase">
                  {item.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && currentItem && (
          <motion.div
            className="fixed inset-0 z-200 flex items-center justify-center p-10 cursor-zoom-out"
            style={{
              background: "rgba(0,0,0,0.92)",
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button
              className="absolute top-6 right-8 font-mono text-[13px] text-dim hover:text-gold cursor-pointer bg-transparent border-none tracking-[2px] transition-colors duration-300"
              onClick={closeLightbox}
            >
              CLOSE &#10005;
            </button>
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-surface rounded-full bg-dark/80 text-muted text-xl cursor-pointer hover:border-gold hover:text-gold transition-all duration-300 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                navLightbox(-1);
              }}
            >
              &#8249;
            </button>
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-surface rounded-full bg-dark/80 text-muted text-xl cursor-pointer hover:border-gold hover:text-gold transition-all duration-300 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                navLightbox(1);
              }}
            >
              &#8250;
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
                <div className="font-serif text-2xl font-bold text-cream mb-1">
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
    </PageTransition>
  );
}
