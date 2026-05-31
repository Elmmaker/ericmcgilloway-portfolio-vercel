"use client";

import { useEffect, useState, FormEvent } from "react";

const PASSWORD = "springbreak";
const STORAGE_KEY = "rbsb-auth";

// Tropical beach gradient — sun glow + sky-blue → turquoise → sand
const PAGE_BG = `
  radial-gradient(ellipse 80% 45% at 50% 8%, rgba(255, 240, 200, 0.55) 0%, transparent 55%),
  linear-gradient(180deg,
    #7EC8E3 0%,
    #4FC3F7 18%,
    #29B6F6 38%,
    #4DD0E1 58%,
    #B2EBF2 75%,
    #FFF8E1 90%,
    #F5E6C8 100%
  )
`;

export default function RingBySpringBreakPage() {
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
          background: PAGE_BG,
          backgroundAttachment: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: "340px",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.18)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.35)",
            borderRadius: "10px",
            padding: "32px 28px",
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#FFFFFF",
              marginBottom: "20px",
              textShadow: "0 1px 4px rgba(0,60,120,0.35)",
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
              background: "rgba(255, 255, 255, 0.85)",
              border: `1px solid ${pwError ? "#E03A3A" : "rgba(255,255,255,0.6)"}`,
              color: "#0D0C0A",
              fontSize: "14px",
              letterSpacing: "1px",
              outline: "none",
              borderRadius: "4px",
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
              background: "#1CE783",
              color: "#0D0C0A",
              border: "none",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: "4px",
              fontWeight: 700,
            }}
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: PAGE_BG,
        backgroundAttachment: "fixed",
        color: "#FFFFFF",
        padding:
          "clamp(120px, 15vw, 160px) clamp(24px, 6vw, 80px) clamp(60px, 8vw, 100px)",
      }}
    >
      {/* Title block */}
      <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 64px)" }}>
        <h1
          className="font-sans"
          style={{
            fontSize: "clamp(36px, 7.5vw, 88px)",
            fontWeight: 700,
            color: "#FFFFFF",
            margin: 0,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            textShadow: "0 2px 14px rgba(0, 60, 120, 0.35)",
          }}
        >
          Ring By Spring Break
        </h1>
        <div
          className="font-sans"
          aria-label="Hulu"
          style={{
            marginTop: "clamp(8px, 1.5vw, 14px)",
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 800,
            color: "#1CE783",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            textShadow: "0 2px 10px rgba(0, 60, 120, 0.25)",
          }}
        >
          hulu
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Section: Logos */}
        <h2
          className="font-sans"
          style={{
            fontSize: "clamp(28px, 4.5vw, 44px)",
            fontWeight: 700,
            color: "#FFFFFF",
            margin: "0 0 8px",
            letterSpacing: "-0.01em",
            textShadow: "0 2px 8px rgba(0, 60, 120, 0.3)",
          }}
        >
          Logos
        </h2>

        {/* Sub: PASS 01 */}
        <div
          className="font-mono"
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#FFFFFF",
            marginTop: "clamp(24px, 4vw, 40px)",
            marginBottom: "16px",
            textShadow: "0 1px 4px rgba(0, 60, 120, 0.35)",
          }}
        >
          PASS 01
        </div>

        {/* Placeholder slot area — slots will go here once logos are submitted */}
        <div
          className="font-mono"
          style={{
            padding: "clamp(40px, 8vw, 80px) 24px",
            background: "rgba(255, 255, 255, 0.22)",
            border: "1px dashed rgba(255, 255, 255, 0.55)",
            borderRadius: "6px",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            textShadow: "0 1px 4px rgba(0, 60, 120, 0.3)",
          }}
        >
          Awaiting logo submissions
        </div>
      </div>
    </div>
  );
}
