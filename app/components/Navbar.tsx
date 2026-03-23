"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/reels", label: "Reels" },
  { href: "/key-art", label: "Key Art" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-100 flex justify-between items-center"
      style={{
        padding: "24px clamp(24px, 6vw, 80px)",
        background:
          "linear-gradient(to bottom, rgba(13,12,10,0.95) 0%, rgba(13,12,10,0.7) 70%, transparent 100%)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <Link
        href="/"
        className="font-serif text-lg font-bold text-cream hover:text-gold transition-colors duration-300"
      >
        Eric McGilloway
      </Link>
      <div className="flex items-center gap-4 sm:gap-8">
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href.split("#")[0]) &&
                link.href.split("#")[0] !== "/";

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-[11px] tracking-[2px] uppercase transition-colors duration-300 relative ${
                isActive ? "text-gold" : "text-muted hover:text-gold"
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-gold" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
