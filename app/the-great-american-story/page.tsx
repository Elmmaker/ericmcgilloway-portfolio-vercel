"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import VideoPlayer from "../components/VideoPlayer";

const PASSWORD = "usa250";
const STORAGE_KEY = "great-american-story-auth";

type SlotKey =
  | "slot1" | "slot2" | "slot3" | "slot4"
  | "slot5" | "slot6" | "slot7" | "slot8"
  | "slot9" | "slot10"
  | "slot11" | "slot12" | "slot13" | "slot14" | "slot15"
  | "slot16" | "slot17"
  | "slot18" | "slot19" | "slot20" | "slot21" | "slot22"
  | "slot23"
  | "slot24" | "slot25";
type SlotData = { rating: number; notes: string };
type Reviews = Record<SlotKey, SlotData>;
type Slot = {
  id: SlotKey;
  label: string;
  image: string;
  downloadName: string;
  // Optional flavor copy from the design deck — surfaced under the label
  // as a small italic note (used for Pass 05 direction descriptions).
  description?: string;
};

// APPROVED — final stakeholder-approved logos. Sole occupants of the
// main Logos tab; everything earlier (Pass 05, Wildcards, Pass 04 ... )
// is moved to the Logo Archive tab so reviewers see the live marks first.
const APPROVED_SLOTS: Slot[] = [
  {
    id: "slot24",
    label: "TGAJ Diamond",
    image: "/great-american-story/TGAJ_Diamond.png",
    downloadName: "TGAJ_Diamond.png",
  },
  {
    id: "slot25",
    label: "TGAJ Solo",
    image: "/great-american-story/TGAJ_Solo.png",
    downloadName: "TGAJ_Solo.png",
  },
];

// Newest pass (03) — shown at the very top
// PASS 05 — Stakeholder Refinements (Pass 04 in the design deck's numbering,
// Pass 05 on the site after Pass 04 already shipped). Each direction maps to
// specific notes from the prior round.
const PASS_05_SLOTS: Slot[] = [
  {
    id: "slot22",
    label: "Bryan · 4-Line Diamond Badge · 3D",
    image: "/great-american-story/TGAJ_Pass05_Bryan_3D.jpg",
    downloadName: "TGAJ_Pass05_Bryan_3D.jpg",
    description:
      "Direction 03 · Diamond badge preserved · pen-and-ink script 'The' · 3D dimensional type · fleuron beneath talent line. 4-line badge structure retained. 3D dimensionality and pen-and-ink flair added.",
  },
  {
    id: "slot18",
    label: "Joel + David · 4-Line · 3D",
    image: "/great-american-story/TGAJ_Pass05_JoelDavid.jpg",
    downloadName: "TGAJ_Pass05_JoelDavid.jpg",
    description:
      "Direction 01 · 4-line lockup with script 'The'. Pen-and-ink script 'The' repositioned above 'Great'. Flair injected throughout. Zero stars.",
  },
  {
    id: "slot19",
    label: "Joel + David · 4-Line · 3D",
    image: "/great-american-story/TGAJ_Pass05_JoelDavid_3D.jpg",
    downloadName: "TGAJ_Pass05_JoelDavid_3D.jpg",
    description:
      "Direction 01 · Pen-and-ink script 'The' · 3D dimensional type · RWB rules · fleuron beneath 'with Kelsey Grammer'.",
  },
  {
    id: "slot20",
    label: "Joel · David · 4-Line variant",
    image: "/great-american-story/TGAJ_Pass05_JoelDavid_alt.jpg",
    downloadName: "TGAJ_Pass05_JoelDavid_alt.jpg",
    description: "Direction 01 · 4-line lockup, alternate treatment.",
  },
];

// WILDCARDS — outside the main pass numbering, for one-off concepts.
// Lives in its own section at the bottom of the Logos tab. The second
// slot is a placeholder until Eric drops the next render.
const WILDCARDS_SLOTS: Slot[] = [
  {
    id: "slot21",
    label: "3-Line Hero · 3D",
    image: "/great-american-story/TGAJ_Pass05_Colin.jpg",
    downloadName: "TGAJ_Pass05_Colin.jpg",
    description:
      "Direction 02 · Silver / gold dimensional type · contained RWB accents · tri-color flourish beneath. Silver / gold type holds readability. RWB contained to small color accents.",
  },
  {
    id: "slot23",
    label: "Western · 3-Line · 3D",
    image: "/great-american-story/TGAJ_Wildcard_Western_3D.jpg",
    downloadName: "TGAJ_Wildcard_Western_3D.jpg",
    description:
      "Western feel · bold serif type with gold outline treatment · saloon-era flair.",
  },
];

const PASS_04_SLOTS: Slot[] = [
  { id: "slot16", label: "Logo 10",         image: "/great-american-story/TGAS_Logo_010.png",        downloadName: "TGAS_Logo_010.png" },
  { id: "slot17", label: "3-Line Logos 02", image: "/great-american-story/TGAS_3Line_Logos_02.png",  downloadName: "TGAS_3Line_Logos_02.png" },
];

const PASS_03_SLOTS: Slot[] = [
  { id: "slot11", label: "Logo 06",       image: "/great-american-story/TGAS_Logo_06.png",        downloadName: "TGAS_Logo_06.png" },
  { id: "slot12", label: "Logo 07",       image: "/great-american-story/TGAS_Logo_07.png",        downloadName: "TGAS_Logo_07.png" },
  { id: "slot13", label: "Logo 08",       image: "/great-american-story/TGAS_Logo_08.png",        downloadName: "TGAS_Logo_08.png" },
  { id: "slot14", label: "Logo 09",       image: "/great-american-story/TGAS_Logo_09.png",        downloadName: "TGAS_Logo_09.png" },
  { id: "slot15", label: "3-Line Logos 01", image: "/great-american-story/TGAS_2Line_Logos_01.png", downloadName: "TGAS_2Line_Logos_01.png" },
];

// 02 pass
const PASS_02_SLOTS: Slot[] = [
  { id: "slot9",  label: "Logo 02a v2", image: "/great-american-story/TGAS_Logo_02a_v2.png", downloadName: "TGAS_Logo_02a_v2.png" },
  { id: "slot10", label: "Logo 02b v2", image: "/great-american-story/TGAS_Logo_02b_v2.png", downloadName: "TGAS_Logo_02b_v2.png" },
];

// Original pass — shown under the "01 LOGO PASS" heading
const PASS_01_SLOTS: Slot[] = [
  { id: "slot1", label: "Logo 01a",      image: "/great-american-story/TGAS_Logo_01a.png", downloadName: "TGAS_Logo_01a.png" },
  { id: "slot2", label: "Logo 01b",      image: "/great-american-story/TGAS_Logo_01b.png", downloadName: "TGAS_Logo_01b.png" },
  { id: "slot3", label: "Logo 01c",      image: "/great-american-story/TGAS_Logo_01c.png", downloadName: "TGAS_Logo_01c.png" },
  { id: "slot4", label: "Logo 02",       image: "/great-american-story/TGAS_Logo_02.png",  downloadName: "TGAS_Logo_02.png"  },
  { id: "slot5", label: "Logo 02b",      image: "/great-american-story/TGAS_Logo_02b.png", downloadName: "TGAS_Logo_02b.png" },
  { id: "slot6", label: "Logo 03",       image: "/great-american-story/TGAS_Logo_03.png",  downloadName: "TGAS_Logo_03.png"  },
  { id: "slot7", label: "Logo 05",       image: "/great-american-story/TGAS_Logo_05.png",  downloadName: "TGAS_Logo_05.png"  },
];

const ALL_SLOTS: Slot[] = [
  ...APPROVED_SLOTS,
  ...PASS_05_SLOTS,
  ...WILDCARDS_SLOTS,
  ...PASS_04_SLOTS,
  ...PASS_03_SLOTS,
  ...PASS_02_SLOTS,
  ...PASS_01_SLOTS,
];

// Graphics tab — broadcast deliverables, mostly Framerate video embeds.
// Drop embedUrls (and optional posters) into each section's `videos` array
// as they come in; empty arrays render a "Coming Soon" placeholder.
// Either `embedUrl` (Framerate iframe), `src` (local mp4 in /public/clips/),
// or `image` for static stills (no playback). Exactly one should be set.
type GraphicsVideo = {
  embedUrl?: string;
  src?: string;
  image?: string;
  label?: string;
  poster?: string;
};
type GraphicsSection = { label: string; videos: GraphicsVideo[] };

const GRAPHICS_SECTIONS: GraphicsSection[] = [
  {
    label: "Logo Animation",
    videos: [
      { embedUrl: "https://framerate.tv/watch/94af7cef-a741-4b21-ae25-b7f3a95a7513", label: "TGAJ Diamond" },
      { embedUrl: "https://framerate.tv/watch/438a9564-237c-4dd4-9df8-8c779920b921", label: "TGAJ Solo" },
    ],
  },
  {
    label: "Transitions",
    videos: [
      { embedUrl: "https://framerate.tv/watch/64c248ad-47ee-4dcb-b64c-5a780bd61b9a", label: "Tranz Ribbon 01", poster: "/great-american-story/poster-tranz-ribbon-01.jpg" },
      { embedUrl: "https://framerate.tv/watch/28b4a625-38bd-4f48-952d-cdbe84250587", label: "Tranz Stars 01", poster: "/great-american-story/poster-tranz-stars-01.jpg" },
      { embedUrl: "https://framerate.tv/watch/eb469bfb-ed9f-4186-81d5-88af6f596245", label: "Tranz Stars 02", poster: "/great-american-story/poster-tranz-stars-02.jpg" },
      { embedUrl: "https://framerate.tv/watch/646bb3fb-22f3-4178-bcca-b0b2a9ac312b", label: "Tranz Stars 03", poster: "/great-american-story/poster-tranz-stars-03.jpg" },
      { embedUrl: "https://framerate.tv/watch/0e7b804c-d02c-430a-980d-6b591231f7ac", label: "Tranz Stars 04" },
      { embedUrl: "https://framerate.tv/watch/e41f6d67-2e09-4b09-af7c-0df25155c7a3", label: "Tranz Bokeh 01", poster: "/great-american-story/poster-tranz-bokeh-01.jpg" },
      { embedUrl: "https://framerate.tv/watch/5cf4bf26-78e2-4d48-b355-8f81eb4f983d", label: "Tranz Bokeh 02", poster: "/great-american-story/poster-tranz-bokeh-02.jpg" },
    ],
  },
  {
    label: "Lowers",
    videos: [
      { embedUrl: "https://framerate.tv/watch/849ae631-eaf3-4e06-bad2-4af90d10fe56", label: "Lowers 01" },
      { embedUrl: "https://framerate.tv/watch/e77ba326-597b-40f8-825b-e42ebf495a37", label: "Lowers 02" },
    ],
  },
  { label: "Maps", videos: [] },
  { label: "Mortise", videos: [] },
  { label: "Credit Bed", videos: [] },
];

const EMPTY_REVIEWS: Reviews = ALL_SLOTS.reduce((acc, s) => {
  acc[s.id] = { rating: 0, notes: "" };
  return acc;
}, {} as Reviews);

export default function GreatAmericanStoryPage() {
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
          background: "#0a1526",
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
          {/* Three small stars (red, white, blue) above the tricolor stripe —
              keeps the mark unambiguously American instead of reading as
              French. */}
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
            <Star color="#B23A48" />
            <Star color="#F0EDE6" />
            <Star color="#3A6BA5" />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "18px" }}>
            <div style={{ width: "14px", height: "3px", background: "#B23A48" }} />
            <div style={{ width: "14px", height: "3px", background: "#F0EDE6" }} />
            <div style={{ width: "14px", height: "3px", background: "#3A6BA5" }} />
          </div>
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
              fontSize: "16px",
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

  return <ReviewBoard />;
}

function ReviewBoard() {
  const [reviews, setReviews] = useState<Reviews>(EMPTY_REVIEWS);
  const [loaded, setLoaded] = useState(false);
  const [savingSlot, setSavingSlot] = useState<SlotKey | null>(null);
  const [savedSlot, setSavedSlot] = useState<SlotKey | null>(null);
  const [zoomedSlot, setZoomedSlot] = useState<SlotKey | null>(null);
  // Lightbox source for Graphics-tab stills (Lowers, Maps, etc.) — these
  // aren't review slots, so they get their own zoom state.
  const [zoomedStill, setZoomedStill] = useState<{ image: string; label: string } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "logos" | "archive" | "graphics"
  >("logos");

  useEffect(() => {
    fetch("/api/great-american-story")
      .then((r) => r.json())
      .then((data: Reviews) => {
        setReviews({ ...EMPTY_REVIEWS, ...data });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Close lightbox on Escape (covers both slot zooms and still zooms)
  useEffect(() => {
    if (!zoomedSlot && !zoomedStill) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoomedSlot(null);
        setZoomedStill(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [zoomedSlot, zoomedStill]);

  // Unified lightbox source: a SlotCard zoom resolves to its slot's image +
  // label; a Graphics-tab still zoom uses zoomedStill directly. The two are
  // mutually exclusive in practice — close handlers clear both.
  const lightboxImage = zoomedSlot
    ? ALL_SLOTS.find((s) => s.id === zoomedSlot) ?? null
    : zoomedStill;
  const closeLightbox = () => {
    setZoomedSlot(null);
    setZoomedStill(null);
  };

  function updateSlot(slot: SlotKey, patch: Partial<SlotData>) {
    setReviews((prev) => ({ ...prev, [slot]: { ...prev[slot], ...patch } }));
  }

  async function save(slot: SlotKey) {
    setSavingSlot(slot);
    setSavedSlot(null);
    try {
      const res = await fetch("/api/great-american-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot,
          rating: reviews[slot].rating,
          notes: reviews[slot].notes,
        }),
      });
      if (res.ok) {
        setSavedSlot(slot);
        setTimeout(() => setSavedSlot(null), 2000);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSavingSlot(null);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1526",
        color: "#F0EDE6",
        padding:
          "clamp(120px, 15vw, 160px) clamp(24px, 6vw, 80px) clamp(60px, 8vw, 100px)",
      }}
    >
      {/* Header — show title + small America 250 mark beneath */}
      <div style={{ textAlign: "center", marginBottom: "clamp(48px, 8vw, 80px)" }}>
        <h1
          className="font-sans"
          style={{
            fontSize: "clamp(18px, 5.5vw, 64px)",
            fontWeight: 700,
            color: "#F0EDE6",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            margin: "0 auto",
          }}
        >
          <span style={{ display: "block", textTransform: "uppercase" }}>
            The Great American Journey
          </span>
          <span
            style={{
              display: "block",
              fontSize: "clamp(12.6px, 3.85vw, 44.8px)",
              marginTop: "0.15em",
            }}
          >
            With Kelsey Grammer
          </span>
        </h1>
        <div
          style={{
            margin: "clamp(16px, 2.4vw, 24px) auto 0",
            width: "clamp(43px, 7.68vw, 77px)",
            lineHeight: 0,
          }}
        >
          <Image
            src="/great-american-story/America250_logo.png"
            alt="America 250"
            width={943}
            height={650}
            priority
            sizes="(max-width: 600px) 7.68vw, 77px"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>

      {/* Tab toggle: Logos / Logo Archive / Graphics */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "clamp(40px, 6vw, 64px)",
          flexWrap: "wrap",
        }}
      >
        {(["logos", "archive", "graphics"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className="font-mono"
            style={{
              padding: "12px 28px",
              background: activeTab === tab ? "#C5A455" : "transparent",
              color: activeTab === tab ? "#0D0C0A" : "#C5A455",
              border: "1px solid #C5A455",
              borderRadius: "2px",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
          >
            {tab === "logos"
              ? "Logos"
              : tab === "archive"
                ? "Logo Archive"
                : "Graphics"}
          </button>
        ))}
      </div>

      {activeTab === "logos" && (
      <>
      {/* APPROVED — final-approved marks. Earlier passes (05, Wildcards,
          04-01) live on the Logo Archive tab so reviewers see the live
          logos first without scrolling. */}
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          className="font-mono"
          style={{
            fontSize: "13px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#C5A455",
            textAlign: "center",
            marginBottom: "clamp(28px, 4vw, 40px)",
          }}
        >
          Approved Logos
        </div>
        <div className="gas-grid">
          {APPROVED_SLOTS.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              data={reviews[slot.id]}
              onChange={(patch) => updateSlot(slot.id, patch)}
              onSave={() => save(slot.id)}
              onZoom={() => setZoomedSlot(slot.id)}
              saving={savingSlot === slot.id}
              saved={savedSlot === slot.id}
              loaded={loaded}
            />
          ))}
        </div>
      </div>
      </>
      )}

      {activeTab === "archive" && (
      <>
      {/* Logo Pass Archive — earlier rounds preserved for reference */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto clamp(40px, 6vw, 64px)",
          textAlign: "center",
        }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: "13px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#C5A455",
            marginBottom: "12px",
          }}
        >
          Logo Pass Archive
        </div>
        <div
          className="font-sans"
          style={{
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#8A8579",
            fontStyle: "italic",
            maxWidth: "560px",
            margin: "0 auto",
          }}
        >
          Earlier rounds for reference, newest first.
        </div>
      </div>

      {/* Pass 05 — Stakeholder Refinements (previously on the main Logos
          tab; moved here once the Approved set replaced it.) */}
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          className="font-mono"
          style={{
            fontSize: "13px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#C5A455",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          05 Logo Pass
        </div>
        <div className="gas-grid">
          {PASS_05_SLOTS.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              data={reviews[slot.id]}
              onChange={(patch) => updateSlot(slot.id, patch)}
              onSave={() => save(slot.id)}
              onZoom={() => setZoomedSlot(slot.id)}
              saving={savingSlot === slot.id}
              saved={savedSlot === slot.id}
              loaded={loaded}
            />
          ))}
        </div>
      </div>

      {/* Semi-thick gold divider between 05 and Wildcards */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "clamp(48px, 8vw, 80px) auto clamp(28px, 5vw, 48px)",
          height: "3px",
          background: "#C5A455",
          opacity: 0.85,
        }}
      />

      {/* Wildcards — one-off concepts outside the main pass numbering. */}
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          className="font-mono"
          style={{
            fontSize: "13px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#C5A455",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Wildcards
        </div>
        <div className="gas-grid">
          {WILDCARDS_SLOTS.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              data={reviews[slot.id]}
              onChange={(patch) => updateSlot(slot.id, patch)}
              onSave={() => save(slot.id)}
              onZoom={() => setZoomedSlot(slot.id)}
              saving={savingSlot === slot.id}
              saved={savedSlot === slot.id}
              loaded={loaded}
            />
          ))}
        </div>
      </div>

      {/* Semi-thick gold divider between Wildcards and 04 */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "clamp(48px, 8vw, 80px) auto clamp(28px, 5vw, 48px)",
          height: "3px",
          background: "#C5A455",
          opacity: 0.85,
        }}
      />

      {/* Pass (04) */}
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          className="font-mono"
          style={{
            fontSize: "13px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#C5A455",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          04 Logo Pass
        </div>
        <div className="gas-grid">
          {PASS_04_SLOTS.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              data={reviews[slot.id]}
              onChange={(patch) => updateSlot(slot.id, patch)}
              onSave={() => save(slot.id)}
              onZoom={() => setZoomedSlot(slot.id)}
              saving={savingSlot === slot.id}
              saved={savedSlot === slot.id}
              loaded={loaded}
            />
          ))}
        </div>
      </div>

      {/* Semi-thick gold divider between 04 and 03 */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "clamp(48px, 8vw, 80px) auto clamp(28px, 5vw, 48px)",
          height: "3px",
          background: "#C5A455",
          opacity: 0.85,
        }}
      />

      {/* Pass (03) */}
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          className="font-mono"
          style={{
            fontSize: "13px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#C5A455",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          03 Logo Pass
        </div>
        <div className="gas-grid">
          {PASS_03_SLOTS.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              data={reviews[slot.id]}
              onChange={(patch) => updateSlot(slot.id, patch)}
              onSave={() => save(slot.id)}
              onZoom={() => setZoomedSlot(slot.id)}
              saving={savingSlot === slot.id}
              saved={savedSlot === slot.id}
              loaded={loaded}
            />
          ))}
        </div>
      </div>

      {/* Semi-thick gold divider between 03 and 02 */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "clamp(48px, 8vw, 80px) auto clamp(28px, 5vw, 48px)",
          height: "3px",
          background: "#C5A455",
          opacity: 0.85,
        }}
      />

      {/* Pass (02) */}
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          className="font-mono"
          style={{
            fontSize: "13px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#C5A455",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          02 Logo Pass
        </div>
        <div className="gas-grid">
          {PASS_02_SLOTS.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              data={reviews[slot.id]}
              onChange={(patch) => updateSlot(slot.id, patch)}
              onSave={() => save(slot.id)}
              onZoom={() => setZoomedSlot(slot.id)}
              saving={savingSlot === slot.id}
              saved={savedSlot === slot.id}
              loaded={loaded}
            />
          ))}
        </div>
      </div>

      {/* Semi-thick gold divider between passes */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "clamp(48px, 8vw, 80px) auto clamp(28px, 5vw, 48px)",
          height: "3px",
          background: "#C5A455",
          opacity: 0.85,
        }}
      />

      {/* 01 LOGO PASS heading */}
      <div
        className="font-mono"
        style={{
          fontSize: "13px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: "#C5A455",
          textAlign: "center",
          marginBottom: "32px",
        }}
      >
        01 Logo Pass
      </div>

      {/* Original 8 slots */}
      <div className="gas-grid" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {PASS_01_SLOTS.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            data={reviews[slot.id]}
            onChange={(patch) => updateSlot(slot.id, patch)}
            onSave={() => save(slot.id)}
            onZoom={() => setZoomedSlot(slot.id)}
            saving={savingSlot === slot.id}
            saved={savedSlot === slot.id}
            loaded={loaded}
          />
        ))}
      </div>
      </>
      )}

      {activeTab === "graphics" && (
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {GRAPHICS_SECTIONS.map((section, i) => (
            <div key={section.label} style={{ marginBottom: i < GRAPHICS_SECTIONS.length - 1 ? "clamp(48px, 8vw, 80px)" : 0 }}>
              <div
                className="font-mono"
                style={{
                  fontSize: "13px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  color: "#C5A455",
                  marginBottom: "24px",
                }}
              >
                {section.label}
              </div>
              {section.videos.length === 0 ? (
                <div
                  style={{
                    aspectRatio: "16 / 9",
                    background: "#15130F",
                    border: "1px solid #2A251F",
                    borderRadius: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="font-mono"
                >
                  <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#5A554A" }}>
                    Coming Soon
                  </span>
                </div>
              ) : (
                <div className="gas-grid">
                  {section.videos.map((v) => {
                    const isStill = !!v.image;
                    const downloadName = isStill
                      ? v.image!.split("/").pop() ?? "download"
                      : undefined;
                    return (
                    <div key={v.embedUrl ?? v.src ?? v.image}>
                      <div
                        style={{
                          position: "relative",
                          aspectRatio: "16 / 9",
                          background: "#000",
                          border: "1px solid #2A251F",
                          borderRadius: "2px",
                          overflow: "hidden",
                        }}
                      >
                        {isStill ? (
                          <>
                            <Image
                              src={v.image!}
                              alt={v.label ?? ""}
                              fill
                              sizes="(max-width: 700px) 100vw, 50vw"
                              style={{ objectFit: "contain" }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setZoomedStill({ image: v.image!, label: v.label ?? "" })
                              }
                              aria-label={`View ${v.label ?? "still"} fullscreen`}
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
                          </>
                        ) : (
                          <VideoPlayer src={v.src} embedUrl={v.embedUrl} poster={v.poster} />
                        )}
                        {/* Download icon — for stills, direct-downloads the image;
                            for videos, opens the Framerate watch URL in a new tab
                            (Framerate's player has the canonical download button).
                            Sits at right: 56px so it doesn't collide with the
                            fullscreen icon at right: 10px. */}
                        {(isStill || v.embedUrl || v.src) && (
                          <a
                            href={isStill ? v.image! : (v.embedUrl ?? v.src)!}
                            {...(isStill
                              ? { download: downloadName }
                              : { target: "_blank", rel: "noopener noreferrer" })}
                            aria-label={`Download ${v.label ?? "asset"}`}
                            className={isStill ? undefined : "tgas-video-dl"}
                            style={{
                              position: "absolute",
                              bottom: "10px",
                              // Stills always show the fullscreen icon at right:10px, so the
                              // download stays to its left at 56px. For videos the right
                              // offset is controlled by .tgas-video-dl: flush to the right
                              // edge on mobile (where Framerate's fullscreen icon is hidden),
                              // and left of that icon on desktop.
                              ...(isStill ? { right: "56px" } : null),
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
                              textDecoration: "none",
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
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                          </a>
                        )}
                      </div>
                      {v.label && (
                        <div
                          className="font-mono"
                          style={{
                            fontSize: "11px",
                            letterSpacing: "1.5px",
                            color: "#8A8579",
                            marginTop: "12px",
                          }}
                        >
                          {v.label}
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox: black background, centered image, rotates on portrait phones */}
      {lightboxImage && (
        <div
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${lightboxImage.label} enlarged`}
          className="gas-lightbox"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Close"
            className="font-mono"
            style={{
              position: "fixed",
              top: "16px",
              right: "16px",
              padding: "10px 14px",
              background: "transparent",
              color: "#C5A455",
              border: "1px solid #C5A455",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: "2px",
              zIndex: 1001,
            }}
          >
            Close ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxImage.image}
            alt={lightboxImage.label}
            className="gas-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style jsx>{`
        .gas-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(24px, 3vw, 40px);
        }
        @media (max-width: 700px) {
          .gas-grid {
            grid-template-columns: 1fr;
          }
        }
        .gas-lightbox {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: #000;
          cursor: zoom-out;
          overflow: hidden;
        }
        .gas-lightbox-img {
          position: absolute;
          top: 50%;
          left: 50%;
          max-width: 95vw;
          max-height: 95vh;
          width: auto;
          height: auto;
          display: block;
          object-fit: contain;
          transform: translate(-50%, -50%);
        }
        @media (orientation: portrait) and (max-width: 800px) {
          /* Rotate the 16:9 image 90° so it fills portrait phones horizontally.
             Pre-rotation CSS dimensions swap to post-rotation visual dimensions:
               visual width  = CSS height = 95vw
               visual height = CSS width  = 95vw × 16/9 */
          .gas-lightbox-img {
            max-width: none;
            max-height: none;
            width: calc(95vw * 16 / 9);
            height: 95vw;
            transform: translate(-50%, -50%) rotate(90deg);
          }
        }
      `}</style>
    </div>
  );
}

function SlotCard({
  slot,
  data,
  onChange,
  onSave,
  onZoom,
  saving,
  saved,
  loaded,
}: {
  slot: {
    id: SlotKey;
    label: string;
    image: string;
    downloadName: string;
    description?: string;
  };
  data: SlotData;
  onChange: (patch: Partial<SlotData>) => void;
  onSave: () => void;
  onZoom: () => void;
  saving: boolean;
  saved: boolean;
  loaded: boolean;
}) {

  return (
    <div>
      {/* Slot label */}
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
        {slot.label}
      </div>

      {/* Optional description (Pass 05 direction notes from the deck) —
          reserves a min-height so cards in the same row visually align
          even when the descriptions are different lengths. */}
      {slot.description && (
        <div
          className="font-sans"
          style={{
            fontSize: "13px",
            lineHeight: 1.55,
            color: "#8A8579",
            fontStyle: "italic",
            marginTop: "-8px",
            marginBottom: "16px",
            maxWidth: "560px",
            minHeight: "5em",
          }}
        >
          {slot.description}
        </div>
      )}

      {/* Logo image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          background: "#0D0C0A",
          border: "1px solid #2A251F",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <Image
          src={slot.image}
          alt={slot.label}
          fill
          sizes="(max-width: 700px) 100vw, 50vw"
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Action buttons (download + fullscreen) BELOW the image, not over it */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >
        <a
          href={slot.image}
          download={slot.downloadName}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Download ${slot.label}`}
          style={{
            width: "32px",
            height: "32px",
            background: "transparent",
            border: "1px solid #C5A455",
            borderRadius: "2px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A455" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </a>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onZoom();
          }}
          aria-label={`View ${slot.label} fullscreen`}
          style={{
            width: "32px",
            height: "32px",
            padding: 0,
            background: "transparent",
            border: "1px solid #C5A455",
            borderRadius: "2px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A455" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5" />
          </svg>
        </button>
      </div>

      {/* Notes */}
      <textarea
        value={data.notes}
        onChange={(e) => onChange({ notes: e.target.value })}
        placeholder="Add notes..."
        disabled={!loaded}
        style={{
          width: "100%",
          minHeight: "80px",
          marginTop: "16px",
          padding: "12px 14px",
          background: "#0D0C0A",
          border: "1px solid #C5A455",
          color: "#F0EDE6",
          fontSize: "16px",
          lineHeight: 1.6,
          outline: "none",
          resize: "vertical",
          borderRadius: "2px",
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}
      />

      {/* Save */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={onSave}
          disabled={saving || !loaded}
          className="font-mono"
          style={{
            padding: "10px 24px",
            background: "#C5A455",
            color: "#0D0C0A",
            border: "none",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            cursor: saving || !loaded ? "not-allowed" : "pointer",
            opacity: saving || !loaded ? 0.5 : 1,
            borderRadius: "2px",
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && (
          <span
            className="font-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#C5A455",
            }}
          >
            Saved
          </span>
        )}
      </div>
    </div>
  );
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n === value ? 0 : n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            style={{
              background: "transparent",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              lineHeight: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path
                d="M12 2l2.95 6.36 7.05.6-5.4 4.7 1.65 6.84L12 17.5l-6.25 3 1.65-6.84-5.4-4.7 7.05-.6L12 2z"
                fill={filled ? "#C5A455" : "none"}
                stroke="#C5A455"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

function Star({ color }: { color: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2 L14.6 9 L22 9.5 L16.3 14.2 L18.1 21.5 L12 17.7 L5.9 21.5 L7.7 14.2 L2 9.5 L9.4 9 Z"
        fill={color}
      />
    </svg>
  );
}
