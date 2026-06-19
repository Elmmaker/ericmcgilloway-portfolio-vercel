"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/* ============================================================
   Home page — bright re-skin per design brief.
   Self-contained: <style jsx global> ships the page CSS only when
   "/" mounts, IntersectionObserver handles scroll reveals, and the
   per-item videos play on hover via useRef.
   ============================================================ */

type WorkVideoItem = {
  kind: "video";
  src: string;
  tag: string;
  title: React.ReactNode;
  badge?: string;
  delay?: number;
};

type WorkImageItem = {
  kind: "image";
  src: string;
  alt: string;
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
    tag: "Documentary · ABC / Hearst",
    title: "Hearts of Heroes — Sr. Motion & VFX, 7 Seasons",
    delay: 2,
  },
  {
    kind: "video",
    src: "/clips/entertainment-tonight.mp4",
    tag: "Broadcast · CBS",
    title: "Entertainment Tonight — Sr. Motion Designer",
    delay: 3,
  },
  {
    kind: "video",
    src: "/clips/spacemans-wonder-list-clouds.mp4",
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
    kind: "dark",
    href: "/lm",
    tag: "Aerospace Concept",
    title: "The Pursuit of Dreamers — Edit & Interactive 3D",
    thumbLabel: {
      kicker: "Lockheed Martin",
      line: "The Pursuit of Dreamers",
      cta: "View Project →",
    },
    delay: 3,
  },
];

export default function Home() {
  return (
    <>
      <BrightStyles />
      <BrightBackground />
      <Nav />
      <Hero />
      <ReelSection />
      <WorkSection />
      <AboutSection />
      <KudosSection />
      <ContactSection />
      <BrightFooter />
      <ScrollReveal />
    </>
  );
}

/* ─────────────────── BACKGROUND ─────────────────── */

function BrightBackground() {
  return <div className="bright-bg" aria-hidden />;
}

/* ─────────────────── NAV ─────────────────── */

function Nav() {
  return (
    <nav className="bright-nav" aria-label="Primary">
      <Link href="/" className="bright-nav-logo">
        Eric M<span className="mc">c</span>Gilloway
      </Link>
      <ul className="bright-nav-links">
        <li>
          <Link href="/reels">Work</Link>
        </li>
        <li>
          <Link href="/key-art">Key Art</Link>
        </li>
        <li>
          <Link href="/after-hours">After Hours</Link>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#kudos">Kudos</a>
        </li>
        <li className="bright-nav-contact">
          <a href="#contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
}

/* ─────────────────── HERO ─────────────────── */

function Hero() {
  return (
    <header className="bright-hero">
      <p className="bright-hero-role reveal">
        <strong>Senior Motion Designer</strong>
        &nbsp;·&nbsp; Motion Design &nbsp;·&nbsp; 3D &nbsp;·&nbsp; VFX
      </p>
      <h1 className="bright-hero-name bright-hero-name-sig reveal">
        <span className="visually-hidden">Eric McGilloway</span>
        <Image
          src="/images/eric-mcgilloway-signature.png"
          alt="Eric McGilloway"
          width={2148}
          height={334}
          priority
          sizes="(max-width: 540px) 90vw, (max-width: 860px) 80vw, 60vw"
          className="bright-hero-name-img"
        />
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
        <div className="bright-hero-stat">
          <span className="bright-hero-stat-n">IATSE</span>
          <span className="bright-hero-stat-l">Local 800</span>
        </div>
      </div>
      <Link href="/reels" className="bright-hero-btn reveal">
        View Full Reel
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
    </header>
  );
}

/* ─────────────────── SECTION HEADER ─────────────────── */

function SectionHead({ label, id }: { label: string; id?: string }) {
  return (
    <div className="bright-sec-head" id={id}>
      <span className="bright-sec-label">{label}</span>
      <div className="bright-sec-rule" />
    </div>
  );
}

/* ─────────────────── REEL ─────────────────── */

function ReelSection() {
  return (
    <>
      <SectionHead label="Motion Graphics Reel" />
      <div className="bright-reel-inner reveal">
        <div className="bright-reel-frame">
          <iframe
            src="https://framerate.tv/embed/e6afa38e-3145-439f-ae2f-dde6fe8c27a1"
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
      <SectionHead label="Recent Work" />
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
            preload="metadata"
            src={item.src}
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
    return (
      <div className="bright-witem reveal" {...dataD}>
        <div className="bright-witem-thumb">
          {item.badge && (
            <div className="bright-witem-badge">{item.badge}</div>
          )}
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 540px) 50vw, (max-width: 860px) 50vw, (max-width: 1100px) 33vw, 25vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="bright-witem-meta">
          <span className="bright-witem-tag">{item.tag}</span>
          <p className="bright-witem-title">{item.title}</p>
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
      <SectionHead label="About" id="about" />
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
      <SectionHead label="Kudos" id="kudos" />
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
  return (
    <>
      <SectionHead label="Contact" id="contact" />
      <div className="bright-contact-inner reveal">
        <div className="bright-contact-left">
          <h2 className="bright-contact-h">
            Let&apos;s build<br />
            something<br />
            <a href="#">cool.</a>
          </h2>
          <div className="bright-contact-links">
            <a
              href="mailto:elmmaker@gmail.com"
              className="bright-contact-link bright-contact-link-strong"
            >
              Email
            </a>
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
          src="/images/Ice_Cube_EM.png"
          alt=""
          width={2000}
          height={2000}
          sizes="(max-width: 860px) 70vw, 36vw"
          className="bright-contact-ice"
          aria-hidden
          priority={false}
        />
      </div>
    </>
  );
}

/* ─────────────────── FOOTER ─────────────────── */

function BrightFooter() {
  return (
    <footer className="bright-footer">
      <p className="bright-footer-copy">© 2026 Eric McGilloway</p>
      <p className="bright-footer-copy">
        IATSE Local 800 · Senior Motion Designer
      </p>
    </footer>
  );
}

/* ─────────────────── SCROLL REVEAL ─────────────────── */

function ScrollReveal() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      // Fallback: reveal everything immediately.
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("in");
      });
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("in");
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}

/* ─────────────────── STYLES ─────────────────── */

function BrightStyles() {
  return (
    <style jsx global>{`
      :root {
        --bg-bright:       #F4F3F8;
        --white-bright:    #FDFCFF;
        --text-bright:     #0E0D12;
        --mid-bright:      #6B6875;
        --faint-bright:    rgba(14,13,18,0.06);
        --rule-bright:     rgba(14,13,18,0.1);
        --accent-bright:   #0B2272;
        --f-display:       var(--font-inter), "Inter", sans-serif;
        --f-body:          var(--font-dm-sans), "DM Sans", sans-serif;
        --max-bright:      1440px;
        --pad-bright:      clamp(1.5rem, 3.5vw, 3rem);
        --gap-bright:      1.25rem;
        --py-bright:       clamp(3.5rem, 7vw, 6rem);
      }

      /* Home-only body reset — only paints when home is mounted. */
      body:has(.bright-bg) {
        background: transparent !important;
        color: var(--text-bright);
        font-family: var(--f-body);
        font-size: 16px;
        line-height: 1.5;
        overflow-x: hidden;
      }

      /* Fixed gradient backdrop — sits behind everything. Vertical
         sky-blue: saturated cyan at the top, fading to pale blue at
         the bottom. */
      .bright-bg {
        position: fixed;
        inset: 0;
        z-index: -1;
        background:
          linear-gradient(to bottom,
            #21B8EE 0%,
            #6FCDF1 22%,
            #A1DDF3 55%,
            #C7EBF8 80%,
            #DBF2FB 100%);
        pointer-events: none;
      }

      .bright-bg ~ .grain {
        display: none;
      }

      /* ── NAV ── */
      .bright-nav {
        position: fixed;
        top: 0; left: 0; right: 0;
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.1rem var(--pad-bright);
        background: rgba(244, 243, 248, 0.88);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--rule-bright);
      }
      .bright-nav-logo {
        font-family: var(--f-display);
        font-weight: 400;
        font-size: 0.88rem;
        letter-spacing: 0.01em;
        text-transform: uppercase;
        color: var(--text-bright);
        text-decoration: none;
      }
      .bright-nav-logo .mc { font-size: 0.75em; }
      .bright-nav-links {
        display: flex;
        gap: 2rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .bright-nav-links a {
        font-size: 0.68rem;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--mid-bright);
        text-decoration: none;
        transition: color .18s;
        position: relative;
        font-family: var(--f-body);
      }
      .bright-nav-links a::after {
        content: '';
        position: absolute;
        left: 0; right: 0; bottom: -3px;
        height: 1px;
        background: var(--accent-bright);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform .2s ease;
      }
      .bright-nav-links a:hover { color: var(--text-bright); }
      .bright-nav-links a:hover::after { transform: scaleX(1); }
      .bright-nav-contact a { color: var(--accent-bright) !important; }

      /* ── HERO ── */
      .bright-hero {
        padding: calc(var(--py-bright) + 3.5rem) var(--pad-bright) var(--py-bright);
        max-width: var(--max-bright);
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1.75rem;
        border-bottom: 1px solid var(--rule-bright);
        min-height: 100svh;
        justify-content: center;
      }
      .bright-hero-name {
        font-family: var(--f-display);
        font-weight: 400;
        font-size: clamp(3.5rem, 9vw, 9.5rem);
        line-height: 0.9;
        letter-spacing: -0.04em;
        color: #2A2A2E;
        text-transform: uppercase;
        margin: 0;
      }
      .bright-hero-name .mc { font-size: 0.75em; }

      /* Signature variant — replaces the uppercase wordmark with the
         handwritten PNG. Sized ~60% of the text width so it reads as a
         personal touch rather than a poster headline. */
      .bright-hero-name-sig {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }
      .bright-hero-name-img {
        width: clamp(260px, 60vw, 720px) !important;
        height: auto !important;
        display: block;
        /* Re-color the dark-brown ink to pure white while keeping the
           PNG's alpha intact. brightness(0) crushes all colour to
           black, invert(1) flips it to white; transparent pixels stay
           transparent. */
        filter: brightness(0) invert(1);
      }
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      .bright-hero-role {
        font-size: clamp(0.85rem, 1.2vw, 1rem);
        font-weight: 300;
        color: var(--mid-bright);
        letter-spacing: 0.01em;
        line-height: 1.6;
        margin: 0;
      }
      .bright-hero-role strong {
        color: var(--text-bright);
        font-weight: 500;
      }
      .bright-hero-stats {
        display: flex;
        align-items: center;
        gap: 0;
        border: 1px solid var(--rule-bright);
        border-radius: 1px;
        overflow: hidden;
      }
      .bright-hero-stat {
        padding: 0.85rem 2rem;
        text-align: center;
      }
      .bright-hero-stat + .bright-hero-stat {
        border-left: 1px solid var(--rule-bright);
      }
      .bright-hero-stat-n {
        font-family: var(--f-display);
        font-size: 1.4rem;
        font-weight: 800;
        display: block;
        line-height: 1;
        letter-spacing: -0.03em;
      }
      .bright-hero-stat-l {
        font-size: 0.6rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--mid-bright);
        display: block;
        margin-top: 0.3rem;
      }
      .bright-hero-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.68rem;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 0.75rem 1.5rem;
        border: 1px solid var(--rule-bright);
        border-radius: 1px;
        background: transparent;
        color: var(--text-bright);
        text-decoration: none;
        font-family: var(--f-body);
        cursor: pointer;
        transition: background .2s, color .2s, border-color .2s;
      }
      .bright-hero-btn:hover {
        background: var(--text-bright);
        color: var(--bg-bright);
        border-color: var(--text-bright);
      }

      /* ── SECTION HEADER ── */
      .bright-sec-head {
        max-width: var(--max-bright);
        margin: 0 auto;
        padding: var(--py-bright) var(--pad-bright) 1.75rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        scroll-margin-top: 80px;
      }
      .bright-sec-label {
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--mid-bright);
      }
      .bright-sec-rule {
        flex: 1;
        height: 1px;
        background: var(--rule-bright);
      }

      /* ── REEL ── */
      .bright-reel-inner {
        max-width: var(--max-bright);
        margin: 0 auto;
        padding: 0 var(--pad-bright) var(--py-bright);
      }
      .bright-reel-frame {
        position: relative;
        padding-top: 56.25%;
        background: var(--text-bright);
        border-radius: 2px;
        overflow: hidden;
      }
      .bright-reel-frame iframe {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
      }

      /* ── WORK GRID ── */
      .bright-work-inner {
        max-width: var(--max-bright);
        margin: 0 auto;
        padding: 0 var(--pad-bright) var(--py-bright);
      }
      .bright-work-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--gap-bright);
      }
      .bright-witem {}
      .bright-witem-thumb {
        position: relative;
        aspect-ratio: 4/3;
        overflow: hidden;
        background: var(--faint-bright);
        border-radius: 2px;
        cursor: pointer;
      }
      .bright-witem-thumb video,
      .bright-witem-thumb img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform .5s ease;
      }
      .bright-witem-thumb:hover video,
      .bright-witem-thumb:hover img {
        transform: scale(1.04);
      }
      .bright-witem-thumb::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 2;
        border: 2px solid var(--accent-bright);
        opacity: 0;
        transition: opacity .2s;
        pointer-events: none;
      }
      .bright-witem-thumb:hover::before { opacity: 1; }

      .bright-play-hint {
        position: absolute;
        inset: 0;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity .2s;
        pointer-events: none;
      }
      .bright-witem-thumb:hover .bright-play-hint { opacity: 1; }
      .bright-play-hint svg {
        width: 36px; height: 36px;
        fill: rgba(255,255,255,0.9);
        filter: drop-shadow(0 1px 6px rgba(0,0,0,0.4));
      }

      .bright-witem-badge {
        position: absolute;
        top: 0.75rem;
        left: 0.75rem;
        z-index: 4;
        background: var(--accent-bright);
        color: #fff;
        font-size: 0.55rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 0.25rem 0.55rem;
        border-radius: 1px;
      }

      .bright-witem-meta { padding: 0.75rem 0 0; }
      .bright-witem-tag {
        font-size: 0.6rem;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--mid-bright);
        display: block;
        margin-bottom: 0.2rem;
      }
      .bright-witem-title {
        font-family: var(--f-display);
        font-size: 0.88rem;
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: -0.02em;
        margin: 0;
        color: var(--text-bright);
      }
      .bright-witem-title a {
        color: inherit;
        text-decoration: none;
        transition: color .18s;
      }
      .bright-witem-title a:hover { color: var(--accent-bright); }
      .witem-title-link {
        color: var(--accent-bright);
        text-decoration: underline;
        text-underline-offset: 2px;
      }

      /* LM dark card */
      .bright-witem-thumb-dark {
        background: #1A1917;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        text-align: center;
      }
      .bright-witem-thumb-dark::before { border-color: rgba(255,255,255,0.3); }
      .bright-witem-thumb-dark:hover::before { opacity: 1; }
      .bright-witem-thumb-label {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        color: #F3F1EA;
      }
      .bright-witem-thumb-label span {
        font-size: 0.58rem;
        font-weight: 600;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(243,241,234,0.45);
      }
      .bright-witem-thumb-label strong {
        font-family: var(--f-display);
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.2;
      }
      .bright-witem-thumb-label em {
        font-size: 0.72rem;
        font-style: normal;
        color: rgba(243,241,234,0.5);
      }

      /* ── ABOUT ── */
      .bright-about-inner {
        max-width: var(--max-bright);
        margin: 0 auto;
        padding: 0 var(--pad-bright) var(--py-bright);
        display: grid;
        grid-template-columns: 320px 1fr;
        gap: 5rem;
        align-items: center;
      }
      .bright-about-photo {
        aspect-ratio: 4/5;
        overflow: hidden;
        border-radius: 2px;
        background: var(--faint-bright);
        position: relative;
      }
      .bright-about-h {
        font-family: var(--f-display);
        font-size: clamp(1.75rem, 3.5vw, 2.75rem);
        font-weight: 900;
        line-height: 1.05;
        letter-spacing: -0.03em;
        margin: 0 0 1.25rem;
        color: var(--text-bright);
      }
      .bright-about-bio {
        font-size: 0.95rem;
        line-height: 1.82;
        color: var(--mid-bright);
        font-weight: 300;
        max-width: 50ch;
        margin: 0 0 2rem;
      }
      .bright-about-links {
        display: flex;
        gap: 0.65rem;
        flex-wrap: wrap;
      }
      .bright-about-link {
        font-size: 0.65rem;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 0.55rem 1.1rem;
        border: 1px solid var(--rule-bright);
        border-radius: 1px;
        color: var(--mid-bright);
        text-decoration: none;
        font-family: var(--f-body);
        transition: border-color .18s, color .18s;
      }
      .bright-about-link:hover {
        border-color: var(--text-bright);
        color: var(--text-bright);
      }

      /* ── KUDOS ── */
      .bright-kudos-inner {
        max-width: var(--max-bright);
        margin: 0 auto;
        padding: 0 var(--pad-bright) var(--py-bright);
      }
      .bright-kudos-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--gap-bright);
      }
      .kcard {
        padding: 1.75rem;
        background: var(--white-bright);
        border: 1px solid var(--rule-bright);
        border-radius: 2px;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        transition: border-color .18s;
      }
      .kcard:hover { border-color: rgba(17,16,9,0.22); }
      .kcard-mark {
        font-family: var(--f-display);
        font-size: 2.25rem;
        font-weight: 800;
        color: #0B2272;
        line-height: 1;
      }
      .kcard-q {
        font-size: 0.85rem;
        line-height: 1.75;
        color: var(--mid-bright);
        font-weight: 300;
        flex: 1;
        margin: 0;
      }
      .kcard-attr {
        border-top: 1px solid var(--rule-bright);
        padding-top: 1rem;
      }
      .kcard-name {
        font-family: var(--f-display);
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: -0.01em;
        margin: 0 0 0.2rem;
        color: var(--text-bright);
      }
      .kcard-role {
        font-size: 0.65rem;
        color: var(--mid-bright);
        line-height: 1.4;
        margin: 0;
      }
      .kcard-role-link {
        color: inherit;
        text-decoration: underline;
        text-underline-offset: 2px;
      }

      /* ── CONTACT ── */
      .bright-contact-inner {
        max-width: var(--max-bright);
        margin: 0 auto;
        padding: 0 var(--pad-bright) var(--py-bright);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
      }
      .bright-contact-left {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
      }
      .bright-contact-h {
        font-family: var(--f-display);
        font-size: clamp(2.5rem, 6.5vw, 6.5rem);
        font-weight: 900;
        letter-spacing: -0.04em;
        line-height: 0.91;
        margin: 0;
        color: var(--text-bright);
      }
      .bright-contact-h a {
        background: linear-gradient(to bottom, #0B2272 0%, #4A8FE8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        text-decoration: none;
        transition: opacity .18s;
      }
      .bright-contact-h a:hover { opacity: 0.75; }
      .bright-contact-links {
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
        align-items: flex-start;
      }
      .bright-contact-link {
        font-size: 0.68rem;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--mid-bright);
        text-decoration: none;
        font-family: var(--f-body);
        transition: color .18s;
      }
      .bright-contact-link:hover { color: var(--text-bright); }
      .bright-contact-link-strong { color: var(--text-bright); }
      .bright-contact-ice {
        width: clamp(260px, 36vw, 500px);
        height: clamp(260px, 36vw, 500px);
        object-fit: contain;
        /* Image already has alpha — no blend mode needed. */
        flex-shrink: 0;
        pointer-events: none;
        user-select: none;
      }

      /* ── FOOTER ── */
      .bright-footer {
        border-top: 1px solid var(--rule-bright);
        padding: 1.4rem var(--pad-bright);
        max-width: var(--max-bright);
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .bright-footer-copy {
        font-size: 0.65rem;
        color: var(--mid-bright);
        letter-spacing: 0.04em;
        margin: 0;
      }

      /* ── SCROLL REVEAL ── */
      @media (prefers-reduced-motion: no-preference) {
        .reveal {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity .5s ease, transform .5s ease;
        }
        .reveal.in {
          opacity: 1;
          transform: none;
        }
        .reveal[data-d="1"] { transition-delay: .08s; }
        .reveal[data-d="2"] { transition-delay: .16s; }
        .reveal[data-d="3"] { transition-delay: .24s; }
      }

      /* ── RESPONSIVE ── */
      @media (max-width: 1100px) {
        .bright-work-grid { grid-template-columns: repeat(3, 1fr); }
        .bright-about-inner { grid-template-columns: 260px 1fr; gap: 3rem; }
      }

      @media (max-width: 860px) {
        .bright-nav-links { display: none; }
        .bright-work-grid { grid-template-columns: repeat(2, 1fr); }
        .bright-kudos-grid { grid-template-columns: repeat(2, 1fr); }
        .bright-about-inner { grid-template-columns: 1fr; gap: 2rem; }
        .bright-about-photo { aspect-ratio: 3/2; }
        .bright-contact-inner { flex-direction: column; align-items: flex-start; }
        .bright-contact-links { align-items: flex-start; }
      }

      @media (max-width: 540px) {
        .bright-work-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .bright-work-inner { --gap-bright: 0.75rem; }
        .bright-kudos-grid { grid-template-columns: 1fr; }
        .bright-hero-stats { gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
      }
    `}</style>
  );
}
