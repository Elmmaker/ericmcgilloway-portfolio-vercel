"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";

const PASSWORD = "springbreak";
const STORAGE_KEY = "rbsb-auth";

// Eric's day background at ~15% opacity, sitting behind a deep dark
// veil. The 85%-alpha gradient on top lets just a hint of the image
// bleed through.
const PAGE_BG = `
  linear-gradient(rgba(14, 31, 44, 0.85), rgba(14, 31, 44, 0.85)),
  url("/ring-by-spring-break/BKG_day_02.jpg") center / cover no-repeat
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
        className="rbsb-bg-mobile-left"
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
              fontSize: "16px",
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
            fontSize: "clamp(20.7px, 4.31vw, 50.6px)",
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
          style={{
            marginTop: "clamp(8px, 1.5vw, 14px)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Image
            src="/ring-by-spring-break/Hulu-Logo.png"
            alt="Hulu"
            width={3840}
            height={2160}
            priority
            sizes="(max-width: 600px) 13.5vw, 92px"
            style={{
              width: "clamp(61.2px, 8.46vw, 91.8px)",
              height: "auto",
              display: "block",
            }}
          />
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Section: Treatments */}
        <h2
          className="font-sans"
          style={{
            fontSize: "clamp(21.6px, 3.42vw, 33.3px)",
            fontWeight: 700,
            color: "#FFFFFF",
            margin: "0 0 8px",
            letterSpacing: "-0.01em",
            textShadow: "0 2px 8px rgba(0, 60, 120, 0.3)",
          }}
        >
          Treatments
        </h2>

        {/* Sub: 01 Crown of Roses */}
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
          01 Crown of Roses
        </div>

        {/* Embedded brand-architecture treatment. Same-origin iframe so
            it loads cleanly without CSP friction. Big and prominent on
            the page; clients scroll within to read the full document. */}
        <iframe
          src="/ring-by-spring-break/crown-of-roses-brand-architecture.html"
          title="Crown of Roses — Franchise Brand Architecture"
          style={{
            width: "100%",
            height: "min(90vh, 1100px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            borderRadius: "8px",
            background: "#fbf7ef",
            boxShadow:
              "0 24px 70px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.25)",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
