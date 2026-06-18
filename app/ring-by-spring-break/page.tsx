"use client";

import { useEffect, useState, FormEvent } from "react";

const PASSWORD = "cabo";
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

  // After unlock: full-viewport iframe of the treatment HTML. The treatment
  // ships its own cover/branding inside, so no wrapping chrome from us.
  return (
    <iframe
      src="/ring-by-spring-break/treatment-v1.html"
      title="Ring By Spring Break — Main Title and Graphics Package Treatment"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        border: "none",
        display: "block",
        background: "#06121f",
      }}
    />
  );
}
