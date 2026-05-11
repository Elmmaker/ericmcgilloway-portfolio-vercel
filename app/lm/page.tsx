"use client";

import { useEffect, useState, FormEvent } from "react";

const PASSWORD = "dreamers";
const STORAGE_KEY = "lm-auth";

// Asset paths — placeholders until files are added
const VIDEO_SRC = "/lm/video.mp4";
const MODEL_SRC = "/models/lockheed-martin.glb"; // GLB drop-in later

export default function LMPage() {
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
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 64px)" }}>
        <h1
          className="font-serif"
          style={{
            fontSize: "clamp(28px, 5.5vw, 64px)",
            fontWeight: 700,
            color: "#F0EDE6",
            lineHeight: 1.1,
            letterSpacing: "0.01em",
            margin: 0,
          }}
        >
          The Pursuit of Dreamers
        </h1>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Video block */}
        <SectionLabel>Video</SectionLabel>
        <div
          style={{
            position: "relative",
            aspectRatio: "16 / 9",
            background: "#000",
            border: "1px solid #2A251F",
            borderRadius: "2px",
            overflow: "hidden",
            marginBottom: "clamp(40px, 6vw, 64px)",
          }}
        >
          <video
            controls
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              background: "#000",
            }}
          >
            <source src={VIDEO_SRC} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* 3D model block */}
        <SectionLabel>3D Model</SectionLabel>
        <div
          style={{
            position: "relative",
            aspectRatio: "16 / 9",
            background: "#0A0A08",
            border: "1px solid #2A251F",
            borderRadius: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          data-model-src={MODEL_SRC}
        >
          <div
            className="font-mono"
            style={{
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#5A554A",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            3D Model Coming Soon
            <br />
            <span style={{ fontSize: "9px", color: "#3A352A" }}>
              Drag to rotate · Scroll to zoom
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </div>
  );
}
