"use client";

import VideoPlayer from "../components/VideoPlayer";
import BrightBackground from "../components/bright/BrightBackground";
import BrightFooter from "../components/bright/BrightFooter";
import BrightReveal from "../components/bright/BrightReveal";
import BrightPageHeader from "../components/bright/BrightPageHeader";

const AFTER_MIDNIGHT_VIDEOS = [
  {
    sublabel: "Opening Title Sequence",
    embedUrl: "https://framerate.tv/watch/659a3cdd-bee0-4230-a232-1c26b1a81a2e",
    poster:
      "https://image.mux.com/JWYW01WWQzCBYLhIWBLEcQwE7GaO3NRFfeCCvEHelpD4/thumbnail.jpg?time=5.519576&width=1280",
    duration: "0:31",
  },
  {
    sublabel: "Gameplay Stage Graphics",
    src: "/clips/after-midnight-gfx-grid.mp4",
    poster: "/thumbnails/after-midnight-gfx-grid.png",
    duration: "0:13",
  },
];

export default function ReelsPage() {
  return (
    <>
      <BrightBackground />
      <main>
        <BrightPageHeader
          title="Work"
          intro="Broadcast packages, title sequences, documentary maps, and entertainment marketing across late night, streaming, documentary, and franchise marketing."
        />
        <div className="bright-sec-inner">
          {/* Nat Geo Kids — The Wonderlist: Clouds */}
          <article className="bright-project reveal">
            <div className="bright-project-eyebrow">Nat Geo Kids</div>
            <h2 className="bright-project-title">The Wonderlist: Clouds</h2>
            <p className="bright-project-desc">
              Sr. 3D and animation design for Nat Geo Kids&apos; Spaceman/Wonder
              List documentary series.
            </p>
            <div className="bright-media-frame">
              <VideoPlayer
                embedUrl="https://framerate.tv/watch/5191eb19-7d5b-4815-b698-f500e74af8a4"
                poster="/images/work/spacemans-wonder-list-clouds.jpg"
              />
            </div>
          </article>

          {/* Hearts of Heroes — ABC / Hearst Media */}
          <article className="bright-project reveal">
            <div className="bright-project-eyebrow">Hearts of Heroes</div>
            <h2 className="bright-project-title">
              Hearts of Heroes — ABC / Hearst Media
            </h2>
            <p className="bright-project-desc">
              7 seasons of motion graphics and VFX for ABC/Hearst Media&apos;s
              Hearts of Heroes documentary series.
            </p>
            <div className="bright-media-frame">
              <VideoPlayer
                embedUrl="https://framerate.tv/embed/3b2743c4-f70d-4499-bb45-6d1122cb6693?primary_color=%2523ffffff&track_color=%2523ffffff&theme=minimal"
                poster="/images/work/hearts-of-heroes.jpg"
              />
            </div>
            <div className="bright-project-meta">Duration: 1:16</div>
          </article>

          {/* After Midnight with Taylor Tomlinson — CBS (two sub-clips) */}
          <article className="bright-project reveal">
            <div className="bright-project-eyebrow">After Midnight</div>
            <h2 className="bright-project-title">
              After Midnight with Taylor Tomlinson — CBS
            </h2>
            <p className="bright-project-desc">
              Opening title sequence and gameplay stage graphics for CBS&apos;s
              After Midnight with Taylor Tomlinson. Broadcast design, animation,
              and finishing.
            </p>
            <div className="bright-project-grid">
              {AFTER_MIDNIGHT_VIDEOS.map((vid) => (
                <div key={vid.sublabel}>
                  <div className="bright-sublabel">{vid.sublabel}</div>
                  <div className="bright-media-frame">
                    <VideoPlayer
                      src={vid.src}
                      embedUrl={vid.embedUrl}
                      poster={vid.poster}
                    />
                  </div>
                  <div className="bright-project-meta">
                    Duration: {vid.duration}
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Entertainment Social Media Advertising — Ammo Creative */}
          <article className="bright-project reveal">
            <div className="bright-project-eyebrow">
              Entertainment Social Media Advertising
            </div>
            <h2 className="bright-project-title">Ammo Creative</h2>
            <div className="bright-project-grid">
              <div>
                <div className="bright-media-frame">
                  <VideoPlayer
                    src="/clips/entertainment-ads-reel.mp4"
                    poster="/thumbnails/entertainment-ads-reel.png"
                  />
                </div>
                <div className="bright-project-meta">Duration: 0:24</div>
              </div>
              <div>
                <div className="bright-media-frame">
                  <VideoPlayer
                    src="/clips/fyse-music-of-netflix-clip.mp4"
                    poster="/thumbnails/fyse-music-of-netflix-clip.png"
                  />
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
      <BrightFooter />
      <BrightReveal />
    </>
  );
}
