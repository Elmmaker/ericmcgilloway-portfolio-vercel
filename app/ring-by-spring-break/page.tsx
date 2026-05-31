"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";

const PASSWORD = "springbreak";
const STORAGE_KEY = "rbsb-auth";

// Subtle dusk-over-water motif — deep moody base with a barely-there
// warm sun-haze at the top and a cool low band suggesting horizon/water.
// Hints at a spring-break sunset without ever showing one.
const PAGE_BG = `
  radial-gradient(ellipse 70% 35% at 50% 0%, rgba(230, 140, 110, 0.09) 0%, transparent 65%),
  radial-gradient(ellipse 100% 40% at 50% 75%, rgba(70, 120, 160, 0.10) 0%, transparent 60%),
  linear-gradient(180deg, #0E1F2C 0%, #132736 45%, #0C1A26 100%)
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
            fontSize: "clamp(18px, 3.75vw, 44px)",
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
            sizes="(max-width: 600px) 18vw, 120px"
            style={{
              width: "clamp(80px, 11vw, 120px)",
              height: "auto",
              display: "block",
            }}
          />
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
