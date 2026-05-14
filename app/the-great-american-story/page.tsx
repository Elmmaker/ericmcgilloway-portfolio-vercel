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
  | "slot5" | "slot6" | "slot7" | "slot8";
type SlotData = { rating: number; notes: string };
type Reviews = Record<SlotKey, SlotData>;

const SLOTS: { id: SlotKey; label: string; image: string; downloadName: string }[] = [
  { id: "slot1", label: "Logo 01a",      image: "/great-american-story/TGAS_Logo_01a.png", downloadName: "TGAS_Logo_01a.png" },
  { id: "slot2", label: "Logo 01b",      image: "/great-american-story/TGAS_Logo_01b.png", downloadName: "TGAS_Logo_01b.png" },
  { id: "slot3", label: "Logo 01c",      image: "/great-american-story/TGAS_Logo_01c.png", downloadName: "TGAS_Logo_01c.png" },
  { id: "slot4", label: "Logo 02",       image: "/great-american-story/TGAS_Logo_02.png",  downloadName: "TGAS_Logo_02.png"  },
  { id: "slot5", label: "Logo 02b",      image: "/great-american-story/TGAS_Logo_02b.png", downloadName: "TGAS_Logo_02b.png" },
  { id: "slot6", label: "Logo 03",       image: "/great-american-story/TGAS_Logo_03.png",  downloadName: "TGAS_Logo_03.png"  },
  { id: "slot7", label: "Logo 05",       image: "/great-american-story/TGAS_Logo_05.png",  downloadName: "TGAS_Logo_05.png"  },
  { id: "slot8", label: "TGAS 250 - 01", image: "/great-american-story/TGAS_250_01.png",   downloadName: "TGAS_250_01.png"   },
];

const EMPTY_REVIEWS: Reviews = SLOTS.reduce((acc, s) => {
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
          background: "#0D0C0A",
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

  const zoomedSlotData = zoomedSlot ? SLOTS.find((s) => s.id === zoomedSlot) : null;

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
        background: "#0D0C0A",
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
          <VideoPlayer embedUrl={SHOW_OPEN_EMBED_URL} />
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

      {/* 2 columns × 4 rows of slots, each with stars + notes + save */}
      <div className="gas-grid" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {SLOTS.map((slot) => (
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

      {/* Logo image — relative wrapper for absolute-positioned icon buttons */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          background: "#0D0C0A",
          border: "1px solid #2A251F",
          borderRadius: "2px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <Image
          src={slot.image}
          alt={slot.label}
          fill
          sizes="(max-width: 700px) 100vw, 50vw"
          style={{ objectFit: "contain" }}
        />

        {/* Bottom-right action buttons */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            display: "flex",
            gap: "8px",
          }}
        >
          <a
            href={slot.image}
            download={slot.downloadName}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Download ${slot.label}`}
            style={{
              width: "36px",
              height: "36px",
              background: "rgba(13, 12, 10, 0.7)",
              border: "1px solid #C5A455",
              borderRadius: "2px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)",
              textDecoration: "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5A455" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              width: "36px",
              height: "36px",
              padding: 0,
              background: "rgba(13, 12, 10, 0.7)",
              border: "1px solid #C5A455",
              borderRadius: "2px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5A455" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5" />
            </svg>
          </button>
        </div>
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
