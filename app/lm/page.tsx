"use client";

import { useEffect, useState, FormEvent } from "react";
import dynamic from "next/dynamic";
import VideoPlayer from "../components/VideoPlayer";

// 3D viewer is client-only and heavy — load lazily
const F35Viewer = dynamic(() => import("../components/F35Viewer"), {
  ssr: false,
});

const PASSWORD = "dreamers";
const STORAGE_KEY = "lm-auth";

const VIDEO_EMBED_URL = "https://framerate.tv/watch/44c2d0df-e4b4-4862-853f-8dfd02880f3f";

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
          "clamp(120px, 15vw, 160px) clamp(24px, 6vw, 80px) clamp(60px, 8vw, 100px)",
      }}
    >
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 64px)" }}>
        <h1
          className="font-sans"
          style={{
            fontSize: "clamp(28px, 5.5vw, 64px)",
            fontWeight: 700,
            color: "#F0EDE6",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          The Pursuit of Dreamers
        </h1>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Video block */}
        <SectionLabel>Aerospace Trailer</SectionLabel>
        <div
          style={{
            background: "#000",
            border: "1px solid #2A251F",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <VideoPlayer embedUrl={VIDEO_EMBED_URL} poster="/lm/poster.jpg" />
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: "11px",
            letterSpacing: "1.5px",
            color: "#8A8579",
            marginTop: "12px",
            marginBottom: "clamp(40px, 6vw, 64px)",
          }}
        >
          Duration: 1:48
        </div>

        {/* Gold sheen divider above 3D section */}
        <SheenDivider delay={0} />

        {/* 3D model block */}
        <SectionLabel>F-35 · Interactive 3D Model Call-outs</SectionLabel>
        <F35Viewer />

        {/* Hint */}
        <div
          className="font-mono"
          style={{
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#8A8579",
            textAlign: "center",
            marginTop: "16px",
          }}
        >
          Drag to rotate · Scroll to zoom · Click any callout to explore
        </div>

        {/* Gold sheen divider below 3D section — offset so the two never sweep together */}
        <SheenDivider delay={3.5} />
      </div>

      <style jsx global>{`
        .lm-divider {
          position: relative;
          height: 1px;
          margin: clamp(48px, 6vw, 72px) 0;
          overflow: hidden;
        }
        .lm-divider-base {
          position: absolute;
          inset: 0;
          background: #C5A455;
          opacity: 0.3;
        }
        .lm-sheen {
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
          .lm-sheen {
            animation: lmSheenSweep 7s ease-in-out infinite;
          }
        }
        @keyframes lmSheenSweep {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function SheenDivider({ delay = 0 }: { delay?: number }) {
  return (
    <div className="lm-divider">
      <div className="lm-divider-base" />
      <div className="lm-sheen" style={{ animationDelay: `${delay}s` }} />
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
