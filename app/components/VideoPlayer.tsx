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
  const [activated, setActivated] = useState(false);

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

  // For iframe embeds — show placeholder until clicked, then load iframe
  if (embedUrl) {
    const iframeSrc = embedUrl.includes("/embed/") ? embedUrl : embedUrl.replace("/watch/", "/embed/");
    const autoplaySrc = iframeSrc.includes("?") ? `${iframeSrc}&autoplay=1` : `${iframeSrc}?autoplay=1`;
    return (
      <div className="relative w-full" style={{ aspectRatio }}>
        {activated ? (
          <iframe
            src={autoplaySrc}
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            className="absolute inset-0 cursor-pointer flex items-center justify-center"
            style={{ background: "#111" }}
            onClick={() => setActivated(true)}
          >
            <PlayButton />
          </div>
        )}
      </div>
    );
  }

  return null;
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
