"use client";

import { useEffect, useState, FormEvent } from "react";

const PASSWORD = "patriotic";
const STORAGE_KEY = "great-american-story-auth";

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
          {/* Subtle red/white/blue accent — USA special */}
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

  // Layout: heading + 2x4 grid of slots (waiting on assets)
  const slots = [1, 2, 3, 4, 5, 6, 7, 8];

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
        {/* Subtle tricolor accent */}
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

      {/* 2 rows of 4 slots */}
      <div className="gas-grid" style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {slots.map((n) => (
          <div
            key={n}
            className="gas-slot"
            style={{
              position: "relative",
              aspectRatio: "3 / 2",
              background: "#15130F",
              border: "1px solid #2A251F",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
              {String(n).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .gas-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(16px, 2vw, 28px);
        }
        @media (max-width: 900px) {
          .gas-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .gas-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
