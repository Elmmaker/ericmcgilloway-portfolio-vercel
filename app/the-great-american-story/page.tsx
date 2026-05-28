"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import VideoPlayer from "../components/VideoPlayer";

const SHOW_OPEN_EMBED_URL =
  "https://framerate.tv/watch/cdc49c65-3b5c-448d-bd0f-3e3453edce2a";

const PASSWORD = "usa250";
const STORAGE_KEY = "great-american-story-auth";

type SlotKey =
  | "slot1" | "slot2" | "slot3" | "slot4"
  | "slot5" | "slot6" | "slot7" | "slot8"
  | "slot9" | "slot10"
  | "slot11" | "slot12" | "slot13" | "slot14" | "slot15";
type SlotData = { rating: number; notes: string };
type Reviews = Record<SlotKey, SlotData>;
type Slot = { id: SlotKey; label: string; image: string; downloadName: string };

// Newest pass (03) — shown at the very top
const PASS_03_SLOTS: Slot[] = [
  { id: "slot11", label: "Logo 06",       image: "/great-american-story/TGAS_Logo_06.png",        downloadName: "TGAS_Logo_06.png" },
  { id: "slot12", label: "Logo 07",       image: "/great-american-story/TGAS_Logo_07.png",        downloadName: "TGAS_Logo_07.png" },
  { id: "slot13", label: "Logo 08",       image: "/great-american-story/TGAS_Logo_08.png",        downloadName: "TGAS_Logo_08.png" },
  { id: "slot14", label: "Logo 09",       image: "/great-american-story/TGAS_Logo_09.png",        downloadName: "TGAS_Logo_09.png" },
  { id: "slot15", label: "3-Line Logos 01", image: "/great-american-story/TGAS_2Line_Logos_01.png", downloadName: "TGAS_2Line_Logos_01.png" },
];

// 02 pass
const PASS_02_SLOTS: Slot[] = [
  { id: "slot9",  label: "Logo 02a v2", image: "/great-american-story/TGAS_Logo_02a_v2.png", downloadName: "TGAS_Logo_02a_v2.png" },
  { id: "slot10", label: "Logo 02b v2", image: "/great-american-story/TGAS_Logo_02b_v2.png", downloadName: "TGAS_Logo_02b_v2.png" },
];

// Original pass — shown under the "01 LOGO PASS" heading
const PASS_01_SLOTS: Slot[] = [
  { id: "slot1", label: "Logo 01a",      image: "/great-american-story/TGAS_Logo_01a.png", downloadName: "TGAS_Logo_01a.png" },
  { id: "slot2", label: "Logo 01b",      image: "/great-american-story/TGAS_Logo_01b.png", downloadName: "TGAS_Logo_01b.png" },
  { id: "slot3", label: "Logo 01c",      image: "/great-american-story/TGAS_Logo_01c.png", downloadName: "TGAS_Logo_01c.png" },
  { id: "slot4", label: "Logo 02",       image: "/great-american-story/TGAS_Logo_02.png",  downloadName: "TGAS_Logo_02.png"  },
  { id: "slot5", label: "Logo 02b",      image: "/great-american-story/TGAS_Logo_02b.png", downloadName: "TGAS_Logo_02b.png" },
  { id: "slot6", label: "Logo 03",       image: "/great-american-story/TGAS_Logo_03.png",  downloadName: "TGAS_Logo_03.png"  },
  { id: "slot7", label: "Logo 05",       image: "/great-american-story/TGAS_Logo_05.png",  downloadName: "TGAS_Logo_05.png"  },
  { id: "slot8", label: "TGAS 250 - 01", image: "/great-american-story/TGAS_250_01.png",   downloadName: "TGAS_250_01.png"   },
];

const ALL_SLOTS: Slot[] = [...PASS_03_SLOTS, ...PASS_02_SLOTS, ...PASS_01_SLOTS];

// Graphics tab — broadcast deliverables, mostly Framerate video embeds.
// Drop embedUrls (and optional posters) into each section's `videos` array
// as they come in; empty arrays render a "Coming Soon" placeholder.
type GraphicsVideo = { embedUrl: string; label?: string; poster?: string };
type GraphicsSection = { label: string; videos: GraphicsVideo[] };

const GRAPHICS_SECTIONS: GraphicsSection[] = [
  {
    label: "Transitions",
    videos: [
      { embedUrl: "https://framerate.tv/watch/28b4a625-38bd-4f48-952d-cdbe84250587", label: "Tranz Stars 01", poster: "/great-american-story/poster-tranz-stars-01.jpg" },
      { embedUrl: "https://framerate.tv/watch/eb469bfb-ed9f-4186-81d5-88af6f596245", label: "Tranz Stars 02", poster: "/great-american-story/poster-tranz-stars-02.jpg" },
      { embedUrl: "https://framerate.tv/watch/646bb3fb-22f3-4178-bcca-b0b2a9ac312b", label: "Tranz Stars 03", poster: "/great-american-story/poster-tranz-stars-03.jpg" },
      { embedUrl: "https://framerate.tv/watch/e41f6d67-2e09-4b09-af7c-0df25155c7a3", label: "Tranz Bokeh 01", poster: "/great-american-story/poster-tranz-bokeh-01.jpg" },
      { embedUrl: "https://framerate.tv/watch/5cf4bf26-78e2-4d48-b355-8f81eb4f983d", label: "Tranz Bokeh 02", poster: "/great-american-story/poster-tranz-bokeh-02.jpg" },
    ],
  },
  { label: "Lowers", videos: [] },
  { label: "Mortise", videos: [] },
  { label: "Credit Bed", videos: [] },
];

const EMPTY_REVIEWS: Reviews = ALL_SLOTS.reduce((acc, s) => {
  acc[s.id] = { rating: 0, notes: "" };
  return acc;
}, {} as Reviews);

export default function GreatAmericanStoryPage() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setAuthed(true);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pwInput.trim().toLowerCase() === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
      setPwInput("");
    }
  }

  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a1526",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "320px", textAlign: "center" }}
        >
          {/* Three small stars (red, white, blue) above the tricolor stripe —
              keeps the mark unambiguously American instead of reading as
              French. */}
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
            <Star color="#B23A48" />
            <Star color="#F0EDE6" />
            <Star color="#3A6BA5" />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "18px" }}>
            <div style={{ width: "14px", height: "3px", background: "#B23A48" }} />
            <div style={{ width: "14px", height: "3px", background: "#F0EDE6" }} />
            <div style={{ width: "14px", height: "3px", background: "#3A6BA5" }} />
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#C5A455",
              marginBottom: "20px",
            }}
          >
            Enter Password
          </div>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => {
              setPwInput(e.target.value);
              setPwError(false);
            }}
            autoFocus
            placeholder="Password"
            className="font-mono"
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "#0D0C0A",
              border: `1px solid ${pwError ? "#E03A3A" : "#C5A455"}`,
              color: "#F0EDE6",
              fontSize: "14px",
              letterSpacing: "1px",
              outline: "none",
              borderRadius: "2px",
            }}
          />
          {pwError && (
            <div
              className="font-mono"
              style={{
                fontSize: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#E03A3A",
                marginTop: "12px",
              }}
            >
              Incorrect
            </div>
          )}
          <button
            type="submit"
            className="font-mono"
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "14px",
              background: "#C5A455",
              color: "#0D0C0A",
              border: "none",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: "2px",
            }}
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return <ReviewBoard />;
}

function ReviewBoard() {
  const [reviews, setReviews] = useState<Reviews>(EMPTY_REVIEWS);
  const [loaded, setLoaded] = useState(false);
  const [savingSlot, setSavingSlot] = useState<SlotKey | null>(null);
  const [savedSlot, setSavedSlot] = useState<SlotKey | null>(null);
  const [zoomedSlot, setZoomedSlot] = useState<SlotKey | null>(null);
  const [activeTab, setActiveTab] = useState<"logos" | "graphics">("logos");

  useEffect(() => {
    fetch("/api/great-american-story")
      .then((r) => r.json())
      .then((data: Reviews) => {
        setReviews({ ...EMPTY_REVIEWS, ...data });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    if (!zoomedSlot) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomedSlot(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [zoomedSlot]);

  const zoomedSlotData = zoomedSlot ? ALL_SLOTS.find((s) => s.id === zoomedSlot) : null;

  function updateSlot(slot: SlotKey, patch: Partial<SlotData>) {
    setReviews((prev) => ({ ...prev, [slot]: { ...prev[slot], ...patch } }));
  }

  async function save(slot: SlotKey) {
    setSavingSlot(slot);
    setSavedSlot(null);
    try {
      const res = await fetch("/api/great-american-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot,
          rating: reviews[slot].rating,
          notes: reviews[slot].notes,
        }),
      });
      if (res.ok) {
        setSavedSlot(slot);
        setTimeout(() => setSavedSlot(null), 2000);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSavingSlot(null);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1526",
        color: "#F0EDE6",
        padding:
          "clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px) clamp(60px, 8vw, 100px)",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(48px, 8vw, 80px)" }}>
        {/* Three red/white/blue stars above the tricolor stripe — locks the
            patriotic read so it doesn't drift toward French-flag */}
        <div style={{ display: "flex", justifyContent: "center", gap: "7px", marginBottom: "10px" }}>
          <Star color="#B23A48" />
          <Star color="#F0EDE6" />
          <Star color="#3A6BA5" />
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div style={{ width: "16px", height: "3px", background: "#B23A48" }} />
          <div style={{ width: "16px", height: "3px", background: "#F0EDE6" }} />
          <div style={{ width: "16px", height: "3px", background: "#3A6BA5" }} />
        </div>
        <h1
          className="font-serif"
          style={{
            fontSize: "clamp(18px, 5.5vw, 64px)",
            fontWeight: 700,
            color: "#F0EDE6",
            lineHeight: 1.05,
            letterSpacing: "0.02em",
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          USA 250
        </h1>
      </div>

      {/* Tab toggle: Logos / Graphics */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "clamp(40px, 6vw, 64px)",
        }}
      >
        {(["logos", "graphics"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className="font-mono"
            style={{
              padding: "12px 28px",
              background: activeTab === tab ? "#C5A455" : "transparent",
              color: activeTab === tab ? "#0D0C0A" : "#C5A455",
              border: "1px solid #C5A455",
              borderRadius: "2px",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
          >
            {tab === "logos" ? "Logos" : "Graphics"}
          </button>
        ))}
      </div>

      {activeTab === "logos" && (
      <>
      {/* Show opening video — centered, single large box */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto clamp(48px, 8vw, 80px)",
        }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#C5A455",
            marginBottom: "16px",
          }}
        >
          Show Open
        </div>
        <div
          style={{
            background: "#000",
            border: "1px solid #C5A455",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <VideoPlayer
            embedUrl={SHOW_OPEN_EMBED_URL}
            poster="/great-american-story/show-open-poster.png"
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            marginTop: "12px",
            flexWrap: "wrap",
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: "11px",
              letterSpacing: "1.5px",
              color: "#8A8579",
            }}
          >
            Show Open 25sec v1 WIP w/temp music
          </div>
          <a
            href="/great-american-story/USA250_ShowOpen_WIP_v1_em.mp4"
            download="USA250_ShowOpen_WIP_v1_em.mp4"
            className="font-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              background: "transparent",
              color: "#C5A455",
              border: "1px solid #C5A455",
              borderRadius: "2px",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C5A455"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download
          </a>
        </div>
      </div>

      {/* Newest pass (03) — sits at the very top */}
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          className="font-mono"
          style={{
            fontSize: "13px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#C5A455",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          03 Logo Pass
        </div>
        <div className="gas-grid">
          {PASS_03_SLOTS.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              data={reviews[slot.id]}
              onChange={(patch) => updateSlot(slot.id, patch)}
              onSave={() => save(slot.id)}
              onZoom={() => setZoomedSlot(slot.id)}
              saving={savingSlot === slot.id}
              saved={savedSlot === slot.id}
              loaded={loaded}
            />
          ))}
        </div>
      </div>

      {/* Semi-thick gold divider between 03 and 02 */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "clamp(48px, 8vw, 80px) auto clamp(28px, 5vw, 48px)",
          height: "3px",
          background: "#C5A455",
          opacity: 0.85,
        }}
      />

      {/* Pass (02) */}
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          className="font-mono"
          style={{
            fontSize: "13px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#C5A455",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          02 Logo Pass
        </div>
        <div className="gas-grid">
          {PASS_02_SLOTS.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              data={reviews[slot.id]}
              onChange={(patch) => updateSlot(slot.id, patch)}
              onSave={() => save(slot.id)}
              onZoom={() => setZoomedSlot(slot.id)}
              saving={savingSlot === slot.id}
              saved={savedSlot === slot.id}
              loaded={loaded}
            />
          ))}
        </div>
      </div>

      {/* Semi-thick gold divider between passes */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "clamp(48px, 8vw, 80px) auto clamp(28px, 5vw, 48px)",
          height: "3px",
          background: "#C5A455",
          opacity: 0.85,
        }}
      />

      {/* 01 LOGO PASS heading */}
      <div
        className="font-mono"
        style={{
          fontSize: "13px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: "#C5A455",
          textAlign: "center",
          marginBottom: "32px",
        }}
      >
        01 Logo Pass
      </div>

      {/* Original 8 slots */}
      <div className="gas-grid" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {PASS_01_SLOTS.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            data={reviews[slot.id]}
            onChange={(patch) => updateSlot(slot.id, patch)}
            onSave={() => save(slot.id)}
            onZoom={() => setZoomedSlot(slot.id)}
            saving={savingSlot === slot.id}
            saved={savedSlot === slot.id}
            loaded={loaded}
          />
        ))}
      </div>
      </>
      )}

      {activeTab === "graphics" && (
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {GRAPHICS_SECTIONS.map((section, i) => (
            <div key={section.label} style={{ marginBottom: i < GRAPHICS_SECTIONS.length - 1 ? "clamp(48px, 8vw, 80px)" : 0 }}>
              <div
                className="font-mono"
                style={{
                  fontSize: "13px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  color: "#C5A455",
                  marginBottom: "24px",
                }}
              >
                {section.label}
              </div>
              {section.videos.length === 0 ? (
                <div
                  style={{
                    aspectRatio: "16 / 9",
                    background: "#15130F",
                    border: "1px solid #2A251F",
                    borderRadius: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="font-mono"
                >
                  <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#5A554A" }}>
                    Coming Soon
                  </span>
                </div>
              ) : (
                <div className="gas-grid">
                  {section.videos.map((v) => (
                    <div key={v.embedUrl}>
                      <div
                        style={{
                          background: "#000",
                          border: "1px solid #2A251F",
                          borderRadius: "2px",
                          overflow: "hidden",
                        }}
                      >
                        <VideoPlayer embedUrl={v.embedUrl} poster={v.poster} />
                      </div>
                      {v.label && (
                        <div
                          className="font-mono"
                          style={{
                            fontSize: "11px",
                            letterSpacing: "1.5px",
                            color: "#8A8579",
                            marginTop: "12px",
                          }}
                        >
                          {v.label}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox: black background, centered image, rotates on portrait phones */}
      {zoomedSlotData && (
        <div
          onClick={() => setZoomedSlot(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${zoomedSlotData.label} enlarged`}
          className="gas-lightbox"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoomedSlot(null);
            }}
            aria-label="Close"
            className="font-mono"
            style={{
              position: "fixed",
              top: "16px",
              right: "16px",
              padding: "10px 14px",
              background: "transparent",
              color: "#C5A455",
              border: "1px solid #C5A455",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: "2px",
              zIndex: 1001,
            }}
          >
            Close ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={zoomedSlotData.image}
            alt={zoomedSlotData.label}
            className="gas-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style jsx>{`
        .gas-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(24px, 3vw, 40px);
        }
        @media (max-width: 700px) {
          .gas-grid {
            grid-template-columns: 1fr;
          }
        }
        .gas-lightbox {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: #000;
          cursor: zoom-out;
          overflow: hidden;
        }
        .gas-lightbox-img {
          position: absolute;
          top: 50%;
          left: 50%;
          max-width: 95vw;
          max-height: 95vh;
          width: auto;
          height: auto;
          display: block;
          object-fit: contain;
          transform: translate(-50%, -50%);
        }
        @media (orientation: portrait) and (max-width: 800px) {
          /* Rotate the 16:9 image 90° so it fills portrait phones horizontally.
             Pre-rotation CSS dimensions swap to post-rotation visual dimensions:
               visual width  = CSS height = 95vw
               visual height = CSS width  = 95vw × 16/9 */
          .gas-lightbox-img {
            max-width: none;
            max-height: none;
            width: calc(95vw * 16 / 9);
            height: 95vw;
            transform: translate(-50%, -50%) rotate(90deg);
          }
        }
      `}</style>
    </div>
  );
}

function SlotCard({
  slot,
  data,
  onChange,
  onSave,
  onZoom,
  saving,
  saved,
  loaded,
}: {
  slot: { id: SlotKey; label: string; image: string; downloadName: string };
  data: SlotData;
  onChange: (patch: Partial<SlotData>) => void;
  onSave: () => void;
  onZoom: () => void;
  saving: boolean;
  saved: boolean;
  loaded: boolean;
}) {

  return (
    <div>
      {/* Slot label */}
      <div
        className="font-mono"
        style={{
          fontSize: "11px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#C5A455",
          marginBottom: "16px",
        }}
      >
        {slot.label}
      </div>

      {/* Logo image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          background: "#0D0C0A",
          border: "1px solid #2A251F",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <Image
          src={slot.image}
          alt={slot.label}
          fill
          sizes="(max-width: 700px) 100vw, 50vw"
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Action buttons (download + fullscreen) BELOW the image, not over it */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >
        <a
          href={slot.image}
          download={slot.downloadName}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Download ${slot.label}`}
          style={{
            width: "32px",
            height: "32px",
            background: "transparent",
            border: "1px solid #C5A455",
            borderRadius: "2px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A455" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </a>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onZoom();
          }}
          aria-label={`View ${slot.label} fullscreen`}
          style={{
            width: "32px",
            height: "32px",
            padding: 0,
            background: "transparent",
            border: "1px solid #C5A455",
            borderRadius: "2px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A455" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5" />
          </svg>
        </button>
      </div>

      {/* Stars */}
      <StarRating
        value={data.rating}
        onChange={(rating) => onChange({ rating })}
      />

      {/* Notes */}
      <textarea
        value={data.notes}
        onChange={(e) => onChange({ notes: e.target.value })}
        placeholder="Add notes..."
        disabled={!loaded}
        style={{
          width: "100%",
          minHeight: "80px",
          marginTop: "16px",
          padding: "12px 14px",
          background: "#0D0C0A",
          border: "1px solid #C5A455",
          color: "#F0EDE6",
          fontSize: "14px",
          lineHeight: 1.6,
          outline: "none",
          resize: "vertical",
          borderRadius: "2px",
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}
      />

      {/* Save */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={onSave}
          disabled={saving || !loaded}
          className="font-mono"
          style={{
            padding: "10px 24px",
            background: "#C5A455",
            color: "#0D0C0A",
            border: "none",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            cursor: saving || !loaded ? "not-allowed" : "pointer",
            opacity: saving || !loaded ? 0.5 : 1,
            borderRadius: "2px",
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && (
          <span
            className="font-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#C5A455",
            }}
          >
            Saved
          </span>
        )}
      </div>
    </div>
  );
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n === value ? 0 : n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            style={{
              background: "transparent",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              lineHeight: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path
                d="M12 2l2.95 6.36 7.05.6-5.4 4.7 1.65 6.84L12 17.5l-6.25 3 1.65-6.84-5.4-4.7 7.05-.6L12 2z"
                fill={filled ? "#C5A455" : "none"}
                stroke="#C5A455"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

function Star({ color }: { color: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2 L14.6 9 L22 9.5 L16.3 14.2 L18.1 21.5 L12 17.7 L5.9 21.5 L7.7 14.2 L2 9.5 L9.4 9 Z"
        fill={color}
      />
    </svg>
  );
}
