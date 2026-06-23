"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/* Bright skin nav — fixed at the top, blurred. Replaces the previous
   dark Ubuntu wordmark nav. Hidden on self-contained pitch pages so
   they keep their own framing. */
const HIDDEN_ROUTES = [
  "/ring-by-spring-break",
  "/the-great-american-story",
  "/spaceman",
  "/the-last-persian-uncle",
];

const LINKS = [
  { href: "/reels", label: "Work" },
  { href: "/key-art", label: "Key Art" },
  { href: "/after-hours", label: "After Hours" },
  { href: "/#about", label: "About" },
  { href: "/#kudos", label: "Kudos" },
];

export default function Navbar() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // While the drawer is open: lock background scroll, close on Escape, and
  // move focus into the drawer. Everything is restored when it closes.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // If the viewport grows past the mobile breakpoint while the drawer is open
  // (e.g. rotating a tablet), close it so we never strand a locked scroll.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 861px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (HIDDEN_ROUTES.some((p) => pathname.startsWith(p))) return null;

  const closeMenu = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <nav className="bright-nav" aria-label="Primary">
      <Link href="/" className="bright-nav-logo" onClick={() => setOpen(false)}>
        Eric M<span className="mc">c</span>Gilloway
      </Link>

      {/* Desktop links — hidden at ≤860px (see globals.css) */}
      <ul className="bright-nav-links">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
        <li className="bright-nav-contact">
          <Link href="/#contact">Contact</Link>
        </li>
      </ul>

      {/* Hamburger — shown at ≤860px */}
      <button
        ref={toggleRef}
        type="button"
        className="bright-nav-toggle"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="bright-nav-drawer"
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Dimmed backdrop — click to close */}
      <div
        className={`bright-nav-backdrop${open ? " open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Slide-in drawer */}
      <div
        id="bright-nav-drawer"
        className={`bright-nav-drawer${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <button
          ref={closeRef}
          type="button"
          className="bright-nav-close"
          aria-label="Close menu"
          onClick={closeMenu}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M6 6 18 18M18 6 6 18" />
          </svg>
        </button>

        <ul className="bright-nav-drawer-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={closeMenu}>
                {l.label}
              </Link>
            </li>
          ))}
          <li className="bright-nav-drawer-contact">
            <Link href="/#contact" onClick={closeMenu}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
