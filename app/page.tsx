"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import BrightBackground from "./components/bright/BrightBackground";
import BrightFooter from "./components/bright/BrightFooter";
import BrightSectionHead from "./components/bright/BrightSectionHead";
import BrightReveal from "./components/bright/BrightReveal";
import Clouds from "./components/bright/Clouds";
import { useContact } from "./components/ContactContext";

/* ============================================================
   Home page — bright re-skin.
   Styles live in globals.css. Per-item video preview on hover via
   useRef; scroll-reveal handled by <BrightReveal />. Nav comes from
   the global Navbar.tsx.
   ============================================================ */

type WorkVideoItem = {
  kind: "video";
  src: string;
  poster?: string;
  tag: string;
  title: React.ReactNode;
  badge?: string;
  delay?: number;
};

type WorkImageItem = {
  kind: "image";
  src: string;
  alt: string;
  href?: string;
  tag: string;
  title: React.ReactNode;
  badge?: string;
  delay?: number;
};

type WorkDarkItem = {
  kind: "dark";
  href: string;
  tag: string;
  title: React.ReactNode;
  thumbLabel: { kicker: string; line: string; cta: string };
  delay?: number;
};

type WorkItem = WorkVideoItem | WorkImageItem | WorkDarkItem;

const WORK: WorkItem[] = [
  {
    kind: "video",
    src: "/clips/conan.mp4",
    poster: "/images/work/conan.jpg",
    tag: "Late Night · TBS",
    title: "Conan — Lead Motion Designer, 11 Seasons",
  },
  {
    kind: "image",
    src: "/images/work/modern_marvels1.jpg",
    alt: "Modern Marvels",
    tag: "Documentary · History Channel",
    title: "Modern Marvels — Sr. 3D & Map Animation",
    badge: "Airs July 2026",
    delay: 1,
  },
  {
    kind: "video",
    src: "/clips/HeartsOfHeroes_Montage.mp4",
    poster: "/images/work/hearts-of-heroes.jpg",
    tag: "Documentary · ABC / Hearst",
    title: "Hearts of Heroes — Sr. Motion & VFX, 7 Seasons",
    delay: 2,
  },
  {
    kind: "video",
    src: "/clips/entertainment-tonight.mp4",
    poster: "/images/work/et.jpg",
    tag: "Broadcast · CBS",
    title: "Entertainment Tonight — Sr. Motion Designer",
    delay: 3,
  },
  {
    kind: "video",
    src: "/clips/spacemans-wonder-list-clouds.mp4",
    poster: "/images/work/spacemans-wonder-list-clouds.jpg",
    tag: "Documentary · Nat Geo Kids",
    title: (
      <>
        Spaceman / Wonder List —{" "}
        <a
          href="https://www.youtube.com/watch?v=o9ZEktQHHas"
          target="_blank"
          rel="noopener noreferrer"
          className="witem-title-link"
        >
          800K+ views ↗
        </a>
      </>
    ),
  },
  {
    kind: "video",
    src: "/clips/after-midnight.mp4",
    poster: "/images/work/am1.jpg",
    tag: "Broadcast · CBS / Paramount",
    title: "After Midnight — Lead Motion Designer",
    delay: 1,
  },
  {
    kind: "image",
    src: "/images/work/superman-wide.jpg",
    alt: "Superman Social Admats",
    tag: "Ent. Marketing · Fracture",
    title: "Social Admats — Superman, FNAF, Jurassic World",
    delay: 2,
  },
  {
    kind: "image",
    src: "/lm/poster.jpg",
    alt: "The Pursuit of Dreamers — Lockheed Martin",
    href: "/lm",
    tag: "Aerospace Concept",
    title: "The Pursuit of Dreamers — Edit & Interactive 3D",
    delay: 3,
  },
];

export default function Home() {
  return (
    <>
      <BrightBackground />
      <Clouds />
      <Hero />
      <ReelSection />
      <WorkSection />
      <AboutSection />
      <KudosSection />
      <ContactSection />
      <BrightFooter />
      <BrightReveal />
    </>
  );
}

/* The bright Nav is rendered globally from app/components/Navbar.tsx
   via ClientShell, so the home page doesn't render its own. */

/* ─────────────────── HERO ─────────────────── */

function Hero() {
  return (
    <header className="bright-hero">
      <p className="bright-hero-role reveal">
        <strong>Senior Motion Designer</strong>
        &nbsp;·&nbsp; Motion Design &nbsp;·&nbsp; 3D &nbsp;·&nbsp; VFX
      </p>
      <h1 className="bright-hero-name reveal">
        Eric M<span className="mc">c</span>Gilloway
      </h1>
      <div className="bright-hero-stats reveal">
        <div className="bright-hero-stat">
          <span className="bright-hero-stat-n">15+</span>
          <span className="bright-hero-stat-l">Years</span>
        </div>
        <div className="bright-hero-stat">
          <span className="bright-hero-stat-n">2,000+</span>
          <span className="bright-hero-stat-l">Episodes</span>
        </div>
      </div>
      <Link href="/reels" className="bright-hero-btn reveal">
        View More Work
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M5 1v8M1 5.5L5 9l4-3.5" />
        </svg>
      </Link>

      <div
        className="reveal"
        style={{
          marginTop: "40px",
          maxWidth: "680px",
          textAlign: "left",
          fontFamily: "var(--f-body)",
          fontSize: "16px",
          lineHeight: 1.65,
          color: "#2A2A2A",
          fontWeight: 300,
          width: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--f-body)",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#1A1A1A",
            margin: "0 0 12px",
          }}
        >
          How I work
        </h2>
        <p style={{ margin: 0 }}>
          Some jobs I&apos;m designing the logo, building it in 3D, and
          animating the full sequence. Other jobs I&apos;m taking an
          existing brand package and bringing it to life. I&apos;ve done
          both for Conan, Entertainment Tonight, and After Midnight
          w/Taylor Tomlinson on CBS. As a motion designer today you
          have to be able to help the project wherever you can.
        </p>
        <p style={{ margin: "1em 0 0" }}>
          I use AI tools where they make sense (prototyping, pipeline
          acceleration, and asset generation the same way one would use
          stock footage). But I mostly build everything myself in After
          Effects, Cinema 4D, and Photoshop.
        </p>
        <p style={{ margin: "1em 0 0" }}>
          If you have a question about my specific role on any project,
          just ask. I&apos;m happy to walk through it.
        </p>
      </div>
    </header>
  );
}

/* ─────────────────── REEL ─────────────────── */

function ReelSection() {
  return (
    <>
      <BrightSectionHead label="Motion Graphics Reel" />
      <div className="bright-reel-inner reveal">
        <div className="bright-reel-frame">
          <iframe
            src="https://framerate.tv/embed/ae9a01d6-db89-41ba-8666-e36b48babea0"
            title="Eric McGilloway Motion Graphics Reel"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </>
  );
}

/* ─────────────────── WORK GRID ─────────────────── */

function WorkSection() {
  return (
    <>
      <BrightSectionHead label="Recent Work" />
      <div className="bright-work-inner">
        <div className="bright-work-grid">
          {WORK.map((item, i) => (
            <WorkItemCard key={i} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}

function WorkItemCard({ item }: { item: WorkItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleEnter() {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  }
  function handleLeave() {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
      // Re-initialise the media element so the poster repaints
      // instead of the cached first frame (browsers tend to keep the
      // first decoded frame visible after pause, which on a dark
      // open like After Midnight read as a blank black card).
      v.load();
    }
  }

  const dataD = item.delay ? { "data-d": String(item.delay) } : {};

  if (item.kind === "video") {
    return (
      <div className="bright-witem reveal" {...dataD}>
        <div
          className="bright-witem-thumb"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            src={item.src}
            poster={item.poster}
          />
          <div className="bright-play-hint" aria-hidden>
            <svg viewBox="0 0 24 24">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </div>
        </div>
        <div className="bright-witem-meta">
          <span className="bright-witem-tag">{item.tag}</span>
          <p className="bright-witem-title">{item.title}</p>
        </div>
      </div>
    );
  }

  if (item.kind === "image") {
    const thumb = (
      <div className="bright-witem-thumb">
        {item.badge && (
          <div className="bright-witem-badge">{item.badge}</div>
        )}
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 540px) 50vw, (max-width: 860px) 50vw, (max-width: 1100px) 33vw, 25vw"
        />
      </div>
    );
    return (
      <div className="bright-witem reveal" {...dataD}>
        {item.href ? <Link href={item.href}>{thumb}</Link> : thumb}
        <div className="bright-witem-meta">
          <span className="bright-witem-tag">{item.tag}</span>
          <p className="bright-witem-title">
            {item.href ? (
              <Link href={item.href}>{item.title}</Link>
            ) : (
              item.title
            )}
          </p>
        </div>
      </div>
    );
  }

  // dark / LM card
  return (
    <div className="bright-witem reveal" {...dataD}>
      <Link href={item.href}>
        <div className="bright-witem-thumb bright-witem-thumb-dark">
          <div className="bright-witem-thumb-label">
            <span>{item.thumbLabel.kicker}</span>
            <strong>{item.thumbLabel.line}</strong>
            <em>{item.thumbLabel.cta}</em>
          </div>
        </div>
      </Link>
      <div className="bright-witem-meta">
        <span className="bright-witem-tag">{item.tag}</span>
        <p className="bright-witem-title">
          <Link href={item.href}>{item.title}</Link>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────── ABOUT ─────────────────── */

function AboutSection() {
  return (
    <>
      <BrightSectionHead label="About" id="about" />
      <div className="bright-about-inner">
        <div className="bright-about-photo reveal">
          <Image
            src="/images/eric-mcgilloway-profile.png"
            alt="Eric McGilloway"
            width={720}
            height={900}
            sizes="(max-width: 860px) 100vw, (max-width: 1100px) 260px, 320px"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "grayscale(10%)" }}
          />
        </div>
        <div className="bright-about-text reveal" data-d="1">
          <h2 className="bright-about-h">Lead Motion Designer</h2>
          <p className="bright-about-bio">
            I build motion graphics for broadcast and streaming. 11 seasons on
            Conan. Packages for After Midnight, Entertainment Tonight, Modern
            Marvels, and Nat Geo Kids. Title sequences, social campaigns, VFX —
            comfortable leading a team or inside one. Currently available.
          </p>
          <div className="bright-about-links">
            <a
              href="https://www.linkedin.com/in/ericmcg"
              target="_blank"
              rel="noopener noreferrer"
              className="bright-about-link"
            >
              LinkedIn
            </a>
            <a
              href="https://imdb.me/ericmcg"
              target="_blank"
              rel="noopener noreferrer"
              className="bright-about-link"
            >
              IMDB
            </a>
            <a
              href="https://adg.org/directory/4183-eric-mcgilloway/"
              target="_blank"
              rel="noopener noreferrer"
              className="bright-about-link"
            >
              ADG
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────── KUDOS ─────────────────── */

type KudoCard = {
  quote: React.ReactNode;
  name: string;
  role: React.ReactNode;
  delay?: number;
};

const KUDOS: KudoCard[] = [
  {
    quote:
      "I worked alongside Eric for ten years on Conan. Things move fast and break often, and he was always the guy who made it look easy. Endlessly talented, ridiculously quick under pressure, and one of the kindest people I've ever shared a post trailer with. Just hire him.",
    name: "Rob Ashe",
    role: "Editor & Producer · Conan, Beavis and Butthead Do The Universe",
  },
  {
    quote:
      "Eric is not only extremely talented, intuitive, and fast, but he often comes up with something funnier than I'd even imagined. And on the rare occasion that I have a note, he's only interested in getting it right.",
    name: "Robert Smigel",
    role: (
      <>
        Comedian, Writer, Director, Producer ·{" "}
        <a
          href="https://en.wikipedia.org/wiki/Saturday_Night_Live"
          target="_blank"
          rel="noopener noreferrer"
          className="kcard-role-link"
        >
          Saturday Night Live
        </a>
        , &ldquo;
        <a
          href="https://en.wikipedia.org/wiki/TV_Funhouse"
          target="_blank"
          rel="noopener noreferrer"
          className="kcard-role-link"
        >
          TV Funhouse
        </a>
        &rdquo; and{" "}
        <a
          href="https://en.wikipedia.org/wiki/Triumph_the_Insult_Comic_Dog"
          target="_blank"
          rel="noopener noreferrer"
          className="kcard-role-link"
        >
          Triumph the Insult Comic Dog
        </a>
      </>
    ),
    delay: 1,
  },
  {
    quote:
      "Eric is the rare motion designer who keeps the craft high without ever slowing things down. He thinks in systems, so what he builds holds up wherever it ends up living. He's exactly the kind of person you fight to keep.",
    name: "Rob Gage",
    role: "Director, Post-Production Engineering · Netflix",
    delay: 2,
  },
  {
    quote:
      "Eric is the person you want on a high-volume schedule. He is quite simply the best at what he does. No one else comes close. Calm under pressure, methodical with deliverables, and ahead of the curve.",
    name: "Dave Neglia",
    role: "Co-Producer · After Midnight, The Muppet Show",
  },
  {
    quote:
      "Eric is awesome! He's always a positive force in the workplace and the speed at which he creates motion/graphics is out of this world. It was a dream to work with him.",
    name: "Alison Childs",
    role: "Director: Creative and Product Design · Conan",
    delay: 1,
  },
  {
    quote:
      "Eric is a very talented and fast designer capable of finding creative solutions under extremely short deadlines. He was always able to find a solution and keep a positive attitude under pressure.",
    name: "Angus Lyne",
    role: "Motion Graphics & VFX Designer · Conan, Masters Of The Universe",
    delay: 2,
  },
];

function KudosSection() {
  return (
    <>
      <BrightSectionHead label="Kudos" id="kudos" />
      <div className="bright-kudos-inner">
        <div className="bright-kudos-grid">
          {KUDOS.map((k, i) => {
            const dataD = k.delay ? { "data-d": String(k.delay) } : {};
            return (
              <div key={i} className="kcard reveal" {...dataD}>
                <div className="kcard-mark">&ldquo;</div>
                <p className="kcard-q">{k.quote}</p>
                <div className="kcard-attr">
                  <p className="kcard-name">{k.name}</p>
                  <p className="kcard-role">{k.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ─────────────────── CONTACT ─────────────────── */

function ContactSection() {
  const { setOpen } = useContact();
  return (
    <>
      <BrightSectionHead label="Contact" id="contact" />
      <div className="bright-contact-inner reveal">
        <div className="bright-contact-left">
          <h2 className="bright-contact-h">
            Let&apos;s build<br />
            something<br />
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
            >
              cool.
            </a>
          </h2>
          <div className="bright-contact-links">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="bright-contact-link bright-contact-link-strong bright-contact-link-btn"
            >
              Email
            </button>
            <a
              href="https://www.linkedin.com/in/ericmcg"
              target="_blank"
              rel="noopener noreferrer"
              className="bright-contact-link"
            >
              LinkedIn
            </a>
            <a
              href="https://imdb.me/ericmcg"
              target="_blank"
              rel="noopener noreferrer"
              className="bright-contact-link"
            >
              IMDB
            </a>
            <a
              href="https://adg.org/directory/4183-eric-mcgilloway/"
              target="_blank"
              rel="noopener noreferrer"
              className="bright-contact-link"
            >
              ADG
            </a>
          </div>
        </div>
        <Image
          src="/images/Ice_Cube_EM_v2.png"
          alt=""
          width={4096}
          height={4096}
          sizes="(max-width: 860px) 80vw, 50vw"
          className="bright-contact-ice"
          aria-hidden
          priority={false}
        />
      </div>
    </>
  );
}

