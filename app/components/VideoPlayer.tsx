"use client";

import { useRef, useState } from "react";

interface VideoPlayerProps {
  src?: string;
  embedUrl?: string;
  aspectRatio?: string;
}

export default function VideoPlayer({ src, embedUrl, aspectRatio = "16/9" }: VideoPlayerProps) {
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
          className="w-full h-full object-cover"
          playsInline
          preload="metadata"
          onEnded={() => setPlaying(false)}
        />
        {!playing && <PlayButton />}
      </div>
    );
  }

  // For iframe embeds — show play button overlay, reveal iframe on click
  if (embedUrl) {
    const iframeSrc = embedUrl.replace("/watch/", "/embed/");
    return (
      <div className="relative w-full" style={{ aspectRatio }}>
        {activated ? (
          <iframe
            src={`${iframeSrc}?autoplay=1`}
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setActivated(true)}
          >
            <iframe
              src={iframeSrc}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ border: "none" }}
            />
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
