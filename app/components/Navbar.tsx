"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  if (HIDDEN_ROUTES.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav className="bright-nav" aria-label="Primary">
      <Link href="/" className="bright-nav-logo">
        Eric M<span className="mc">c</span>Gilloway
      </Link>
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
    </nav>
  );
}
