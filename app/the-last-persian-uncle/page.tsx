"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";

const PASSWORD = "dreamroom";
const STORAGE_KEY = "persian-uncle-auth";

type RowKey = "row1" | "row2" | "row3";
type RowData = { rating: number; notes: string };
type Reviews = Record<RowKey, RowData>;

const ROWS: { id: RowKey; label: string; horz: string; stacked: string }[] = [
  {
    id: "row1",
    label: "Title 01",
    horz: "/persian-uncle/Title_01_Horz.jpg",
    stacked: "/persian-uncle/Title_01_Stacked.jpg",
  },
  {
    id: "row2",
    label: "Title 02",
    horz: "/persian-uncle/Title_02_Horz.jpg",
    stacked: "/persian-uncle/Title_02_Stacked.jpg",
  },
  {
    id: "row3",
    label: "Title 03",
    horz: "/persian-uncle/Title_03_Horz.jpg",
    stacked: "/persian-uncle/Title_03_Stacked.jpg",
  },
];

const EMPTY_REVIEWS: Reviews = {
  row1: { rating: 0, notes: "" },
  row2: { rating: 0, notes: "" },
  row3: { rating: 0, notes: "" },
};

export default function PersianUnclePage() {
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
  const [savingRow, setSavingRow] = useState<RowKey | null>(null);
  const [savedRow, setSavedRow] = useState<RowKey | null>(null);

  useEffect(() => {
    fetch("/api/persian-uncle")
      .then((r) => r.json())
      .then((data: Reviews) => {
        setReviews({ ...EMPTY_REVIEWS, ...data });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  function updateRow(row: RowKey, patch: Partial<RowData>) {
    setReviews((prev) => ({ ...prev, [row]: { ...prev[row], ...patch } }));
  }

  async function save(row: RowKey) {
    setSavingRow(row);
    setSavedRow(null);
    try {
      const res = await fetch("/api/persian-uncle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          row,
          rating: reviews[row].rating,
          notes: reviews[row].notes,
        }),
      });
      if (res.ok) {
        setSavedRow(row);
        setTimeout(() => setSavedRow(null), 2000);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSavingRow(null);
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
      <div style={{ marginBottom: "clamp(40px, 6vw, 64px)" }}>
        <div
          className="font-mono"
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#C5A455",
            marginBottom: "clamp(40px, 8vw, 80px)",
          }}
        >
          Eric McGilloway
        </div>
        <div style={{ textAlign: "center" }}>
          <h1
            className="font-serif"
            style={{
              fontSize: "clamp(32px, 6vw, 64px)",
              fontWeight: 700,
              color: "#F0EDE6",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            THE LAST PERSIAN UNCLE
          </h1>
          <div
            className="font-mono"
            style={{
              fontSize: "11px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#C5A455",
            }}
          >
            A Kessler Podcast
          </div>
        </div>
      </div>

      {/* Logo rows */}
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {ROWS.map((row, idx) => (
          <div key={row.id}>
            <RowSection
              row={row}
              data={reviews[row.id]}
              onChange={(patch) => updateRow(row.id, patch)}
              onSave={() => save(row.id)}
              saving={savingRow === row.id}
              saved={savedRow === row.id}
              loaded={loaded}
            />
            {idx < ROWS.length - 1 && <SheenDivider />}
          </div>
        ))}
      </div>

      <style jsx global>{`
        .pu-sheen {
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
          .pu-sheen {
            animation: puSheenSweep 3.5s ease-in-out infinite;
          }
        }
        @keyframes puSheenSweep {
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
    </div>
  );
}

function SheenDivider() {
  return (
    <div
      style={{
        position: "relative",
        height: "1px",
        margin: "clamp(48px, 6vw, 72px) 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#C5A455",
          opacity: 0.3,
        }}
      />
      <div className="pu-sheen" />
    </div>
  );
}

function RowSection({
  row,
  data,
  onChange,
  onSave,
  saving,
  saved,
  loaded,
}: {
  row: { id: RowKey; label: string; horz: string; stacked: string };
  data: RowData;
  onChange: (patch: Partial<RowData>) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  loaded: boolean;
}) {
  return (
    <div>
      <div
        className="font-mono"
        style={{
          fontSize: "11px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#C5A455",
          marginBottom: "20px",
        }}
      >
        {row.label}
      </div>

      {/* Image grid */}
      <div className="pu-image-grid">
        <ImageCard src={row.horz} alt={`${row.label} horizontal`} />
        <ImageCard src={row.stacked} alt={`${row.label} stacked`} />
      </div>

      {/* Stars */}
      <div style={{ marginTop: "24px" }}>
        <StarRating
          value={data.rating}
          onChange={(rating) => onChange({ rating })}
        />
      </div>

      {/* Notes */}
      <div style={{ marginTop: "16px" }}>
        <textarea
          value={data.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Add notes..."
          disabled={!loaded}
          className="font-sans"
          style={{
            width: "100%",
            minHeight: "80px",
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
      </div>

      {/* Save button */}
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

      <style jsx>{`
        .pu-image-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(16px, 2vw, 24px);
        }
        @media (max-width: 768px) {
          .pu-image-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function ImageCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 10",
        background: "#1a1614",
        border: "1px solid #2a2522",
        borderRadius: "2px",
        overflow: "hidden",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: "contain" }}
      />
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
