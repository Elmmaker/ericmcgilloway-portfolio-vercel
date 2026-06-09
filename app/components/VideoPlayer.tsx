"use client";

import { useRef, useState } from "react";

interface VideoPlayerProps {
  src?: string;
  embedUrl?: string;
  poster?: string;
  aspectRatio?: string;
}

export default function VideoPlayer({ src, embedUrl, poster, aspectRatio = "16/9" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // For local mp4 videos
  if (src) {
    return (
      <div className="relative w-full cursor-pointer" style={{ aspectRatio }} onClick={() => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) {
          v.play();
          setPlaying(true);
        } else {
          v.pause();
          setPlaying(false);
        }
      }}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-cover"
          playsInline
          preload="metadata"
          onEnded={() => setPlaying(false)}
        />
        {!playing && <PlayButton />}
      </div>
    );
  }

  // For iframe embeds — Framerate's own player handles thumbnail + play button.
  // If a custom poster is passed, it sits on top of the iframe until tapped,
  // so visitors see the designed thumbnail before Framerate's player takes over.
  if (embedUrl) {
    return (
      <IframePlayer embedUrl={embedUrl} poster={poster} aspectRatio={aspectRatio} />
    );
  }

  return null;
}

function IframePlayer({
  embedUrl,
  poster,
  aspectRatio,
}: {
  embedUrl: string;
  poster?: string;
  aspectRatio: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // When a custom poster is provided, render it as an overlay on top of
  // the (already pre-loaded) iframe. Tapping the overlay dismisses it,
  // revealing Framerate's native player + play button underneath. The
  // iframe still mounts immediately so the in-iframe tap on Framerate's
  // play button is a real user gesture (which iOS requires).
  const [posterDismissed, setPosterDismissed] = useState(false);

  const iframeSrc = embedUrl.includes("/embed/")
    ? embedUrl
    : embedUrl.replace("/watch/", "/embed/");

  async function goFullscreen(e: React.MouseEvent) {
    e.stopPropagation();

    // If we're already fullscreen, exit
    const fsDoc = document as Document & { webkitFullscreenElement?: Element };
    if (document.fullscreenElement || fsDoc.webkitFullscreenElement) {
      if (document.exitFullscreen) await document.exitFullscreen().catch(() => {});
      else
        (document as Document & {
          webkitExitFullscreen?: () => void;
        }).webkitExitFullscreen?.();
      return;
    }

    type FSEl = HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      webkitEnterFullscreen?: () => void;
    };

    const tryFs = async (el: FSEl | null) => {
      if (!el) throw new Error("no element");
      if (el.requestFullscreen) return el.requestFullscreen();
      if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
      if (el.webkitEnterFullscreen) return el.webkitEnterFullscreen();
      throw new Error("fullscreen unsupported");
    };

    // Wait a tick so a newly-activated iframe is in the DOM
    await new Promise((r) => setTimeout(r, 50));

    const iframe = wrapRef.current?.querySelector("iframe") as FSEl | null;
    try {
      await tryFs(iframe);
      return;
    } catch (err) {
      console.warn("[VideoPlayer] iframe fullscreen failed:", err);
    }

    try {
      await tryFs(wrapRef.current as FSEl | null);
    } catch (err) {
      console.warn("[VideoPlayer] wrapper fullscreen failed:", err);
    }
  }

  return (
    <div ref={wrapRef} className="relative w-full" style={{ aspectRatio, background: "#000" }}>
      <iframe
        src={iframeSrc}
        className="absolute inset-0 w-full h-full"
        style={{ border: "none" }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />

      {/* Custom poster overlay — shown until the visitor taps it. Sits on
          top of the (already-loaded) iframe so dismissing it reveals
          Framerate's native player + play button without a reload. */}
      {poster && !posterDismissed && (
        <button
          type="button"
          onClick={() => setPosterDismissed(true)}
          aria-label="Show video player"
          className="absolute inset-0 w-full h-full cursor-pointer"
          style={{
            background: `#000 url("${poster}") center / cover no-repeat`,
            border: "none",
            padding: 0,
            zIndex: 4,
          }}
        />
      )}

      {/* Fullscreen icon — hidden on mobile (iOS blocks iframe fullscreen
          anyway, and the icon would cover Framerate's audio/fullscreen
          controls). Framerate's own player UI handles fullscreen on mobile. */}
      <button
        type="button"
        onClick={goFullscreen}
        aria-label="View video fullscreen"
        className="vp-fullscreen-btn"
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
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
          zIndex: 5,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C5A455"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5" />
        </svg>
      </button>
      <style jsx global>{`
        @media (max-width: 768px) {
          .vp-fullscreen-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function PlayButton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
        style={{
          width: 48,
          height: 48,
          backgroundColor: "rgba(197, 164, 85, 1)",
          backdropFilter: "blur(4px)",
        }}
      >
        <svg
          viewBox="0 0 16 18"
          width={14}
          height={16}
          style={{ marginLeft: 3 }}
        >
          <path d="M0 0 L16 9 L0 18 Z" fill="#1a1614" />
        </svg>
      </div>
    </div>
  );
}
