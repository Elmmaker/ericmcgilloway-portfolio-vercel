"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import BrightBackground from "../components/bright/BrightBackground";
import BrightFooter from "../components/bright/BrightFooter";
import BrightReveal from "../components/bright/BrightReveal";
import BrightPageHeader from "../components/bright/BrightPageHeader";

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

export default function KeyArtPage() {
  const [kaFilter, setKaFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
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
    <>
      <BrightBackground />
      <main>
        <BrightPageHeader
          title="Key Art & Stills"
          intro="Print, digital, and social campaign artwork from broadcast, comedy touring, live events, and entertainment marketing projects."
        />

        {/* Filters */}
        <div
          className="reveal"
          data-d="1"
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            margin: "0 auto clamp(1.5rem,3vw,2rem)",
            maxWidth: "var(--max-bright)",
            padding: "0 var(--pad-bright)",
          }}
        >
          {KA_FILTERS.map((f) => {
            const active = f === kaFilter;
            return (
              <button
                key={f}
                onClick={() => setKaFilter(f)}
                aria-pressed={active}
                style={{
                  fontFamily: "var(--f-display)",
                  fontWeight: 500,
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.55rem 1.1rem",
                  border: `1px solid ${active ? "var(--accent-bright)" : "var(--rule-bright)"}`,
                  background: "transparent",
                  color: active ? "var(--accent-bright)" : "var(--mid-bright)",
                  cursor: "pointer",
                  minHeight: "44px",
                  transition: "border-color 200ms ease, color 200ms ease",
                  borderRadius: 2,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "var(--accent-bright)";
                    e.currentTarget.style.color = "var(--text-bright)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "var(--rule-bright)";
                    e.currentTarget.style.color = "var(--mid-bright)";
                  }
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Grouped Masonry Grid */}
        <div className="bright-sec-inner">
          {groups.map((group, gi) => (
            <div key={group.name}>
              {gi > 0 && (
                <div
                  style={{
                    height: 1,
                    background: "var(--rule-bright)",
                    maxWidth: "var(--max-bright)",
                    margin: "clamp(2.5rem,5vw,4rem) auto",
                  }}
                />
              )}
              <div
                className="bright-project-eyebrow reveal"
                style={{ marginBottom: "1.5rem" }}
              >
                {group.name}
              </div>
              <div className="ka-masonry">
                {group.items.map((item) => (
                  <div
                    key={`${item.id}-${kaFilter}`}
                    className="bright-witem-thumb reveal"
                    style={{
                      breakInside: "avoid",
                      marginBottom: "16px",
                      cursor: "zoom-in",
                      borderRadius: 2,
                      aspectRatio: `${item.w} / ${item.h}`,
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
                    <Image
                      src={`/key-art/${item.filename}`}
                      alt={`${item.title} — ${item.desc}`}
                      fill
                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 280px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <BrightFooter />
      <BrightReveal />

      {/* Lightbox */}
      {lightbox !== null && currentItem && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          tabIndex={-1}
          className="ka-lightbox"
          onClick={closeLightbox}
          onKeyDown={handleLightboxKeyDown}
        >
          <button
            className="ka-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            CLOSE <span aria-hidden="true">&#10005;</span>
          </button>
          <button
            className="ka-lightbox-nav ka-lightbox-prev"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              navLightbox(-1);
            }}
          >
            <span aria-hidden="true">&#8249;</span>
          </button>
          <button
            className="ka-lightbox-nav ka-lightbox-next"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              navLightbox(1);
            }}
          >
            <span aria-hidden="true">&#8250;</span>
          </button>

          <div
            className="ka-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ka-lightbox-frame">
              <Image
                src={`/key-art/${currentItem.filename}`}
                alt={`${currentItem.title} — ${currentItem.desc}`}
                width={1200}
                height={900}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "70vh",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
            <div className="ka-lightbox-caption">
              <div id="lightbox-title" className="ka-lightbox-title">
                {currentItem.title}
              </div>
              <div className="ka-lightbox-sub">{currentItem.desc}</div>
            </div>
          </div>
        </div>
      )}

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
        .ka-lightbox {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 1rem;
          cursor: zoom-out;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          outline: none;
          animation: kaFadeIn 200ms ease;
        }
        @keyframes kaFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (min-width: 640px) {
          .ka-lightbox { padding: 2.5rem; }
        }
        .ka-lightbox-close {
          position: absolute;
          top: 1.5rem;
          right: 2rem;
          font-family: var(--f-display);
          font-weight: 500;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--mid-bright);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          transition: color 200ms ease;
        }
        .ka-lightbox-close:hover { color: var(--accent-bright); }
        .ka-lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 2.75rem;
          height: 2.75rem;
          border: 1px solid var(--rule-bright);
          border-radius: 999px;
          background: var(--white-bright);
          color: var(--mid-bright);
          font-size: 1.4rem;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 200ms ease, color 200ms ease, background 200ms ease;
        }
        .ka-lightbox-nav:hover {
          border-color: var(--accent-bright);
          color: var(--accent-bright);
        }
        @media (min-width: 640px) {
          .ka-lightbox-nav { width: 3rem; height: 3rem; }
        }
        .ka-lightbox-prev { left: 0.75rem; }
        .ka-lightbox-next { right: 0.75rem; }
        @media (min-width: 640px) {
          .ka-lightbox-prev { left: 1.5rem; }
          .ka-lightbox-next { right: 1.5rem; }
        }
        .ka-lightbox-content {
          max-width: 90vw;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }
        .ka-lightbox-frame {
          background: var(--white-bright);
          border: 1px solid var(--rule-bright);
          border-radius: 2px;
          padding: 0.5rem;
          box-shadow: 0 24px 48px -16px rgba(14, 13, 18, 0.18),
                      0 4px 12px -4px rgba(14, 13, 18, 0.08);
        }
        .ka-lightbox-caption {
          text-align: center;
        }
        .ka-lightbox-title {
          font-family: var(--f-display);
          font-weight: 600;
          font-size: clamp(1.1rem, 1.6vw, 1.4rem);
          color: var(--text-bright);
          margin-bottom: 0.35rem;
        }
        .ka-lightbox-sub {
          font-family: var(--f-display);
          font-weight: 500;
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--mid-bright);
        }
      `}</style>
    </>
  );
}
