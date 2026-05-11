"use client";

import { useEffect, useState, FormEvent } from "react";

const PASSWORD = "patriotic";
const STORAGE_KEY = "great-american-story-auth";

type SlotKey =
  | "slot1" | "slot2" | "slot3" | "slot4"
  | "slot5" | "slot6" | "slot7" | "slot8";
type SlotData = { rating: number; notes: string };
type Reviews = Record<SlotKey, SlotData>;

const SLOTS: { id: SlotKey; label: string }[] = [
  { id: "slot1", label: "Title 01" },
  { id: "slot2", label: "Title 02" },
  { id: "slot3", label: "Title 03" },
  { id: "slot4", label: "Title 04" },
  { id: "slot5", label: "Title 05" },
  { id: "slot6", label: "Title 06" },
  { id: "slot7", label: "Title 07" },
  { id: "slot8", label: "Title 08" },
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

  useEffect(() => {
    fetch("/api/great-american-story")
      .then((r) => r.json())
      .then((data: Reviews) => {
        setReviews({ ...EMPTY_REVIEWS, ...data });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

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
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div style={{ width: "16px", height: "3px", background: "#B23A48" }} />
          <div style={{ width: "16px", height: "3px", background: "#F0EDE6" }} />
          <div style={{ width: "16px", height: "3px", background: "#3A6BA5" }} />
        </div>
        <h1
          className="font-serif"
          style={{
            fontSize: "clamp(28px, 5.5vw, 64px)",
            fontWeight: 700,
            color: "#F0EDE6",
            lineHeight: 1.05,
            letterSpacing: "0.02em",
            margin: 0,
          }}
        >
          THE GREAT AMERICAN STORY
        </h1>
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
            saving={savingSlot === slot.id}
            saved={savedSlot === slot.id}
            loaded={loaded}
          />
        ))}
      </div>

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
      `}</style>
    </div>
  );
}

function SlotCard({
  slot,
  data,
  onChange,
  onSave,
  saving,
  saved,
  loaded,
}: {
  slot: { id: SlotKey; label: string };
  data: SlotData;
  onChange: (patch: Partial<SlotData>) => void;
  onSave: () => void;
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

      {/* Image placeholder (waiting on assets) */}
      <div
        style={{
          position: "relative",
          aspectRatio: "3 / 2",
          background: "#15130F",
          border: "1px solid #2A251F",
          borderRadius: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            color: "#5A554A",
          }}
        >
          {slot.label.replace("Title ", "")}
        </span>
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
