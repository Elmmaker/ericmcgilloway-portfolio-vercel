"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useContact } from "./ContactContext";

const links = [
  { href: "/reels", label: "Reels" },
  { href: "/key-art", label: "Key Art" },
  { href: "/after-hours", label: "After Hours" },
  { href: "/#about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { setOpen } = useContact();
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Move focus into menu on open; return focus to hamburger on close
  useEffect(() => {
    if (menuOpen) {
      requestAnimationFrame(() => {
        const first = menuRef.current?.querySelector<HTMLElement>("a, button");
        first?.focus();
      });
    } else {
      hamburgerRef.current?.focus();
    }
  }, [menuOpen]);

  // Focus trap inside mobile menu
  function handleMenuKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      setMenuOpen(false);
      return;
    }
    if (e.key !== "Tab") return;
    const menu = menuRef.current;
    if (!menu) return;
    const focusable = Array.from(
      menu.querySelectorAll<HTMLElement>("a, button:not([disabled])")
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <>
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
          className="font-serif text-lg font-bold text-cream hover:text-gold transition-colors duration-300 relative z-[202]"
        >
          Eric McGilloway
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
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
          <button
            onClick={() => setOpen(true)}
            className="font-mono text-[11px] tracking-[2px] uppercase text-muted hover:text-gold transition-colors duration-300 bg-transparent border-none cursor-pointer"
          >
            Contact
          </button>
        </div>

        {/* Hamburger button */}
        <button
          ref={hamburgerRef}
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 bg-transparent border-none cursor-pointer gap-[5px] relative z-[201]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <motion.span
            className="block w-5 h-[1.5px] bg-cream"
            animate={menuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="block w-5 h-[1.5px] bg-cream"
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block w-5 h-[1.5px] bg-cream"
            animate={menuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
        </button>
      </nav>

      {/* Mobile menu overlay — rendered outside nav for proper z-stacking */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 md:hidden"
            style={{
              background: "#0D0C0A",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onKeyDown={handleMenuKeyDown}
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.1 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-mono text-sm tracking-[3px] uppercase text-cream hover:text-gold transition-colors duration-300 block"
                  style={{ padding: "12px 24px" }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: links.length * 0.05 + 0.1 }}
            >
              <button
                onClick={() => { setMenuOpen(false); setOpen(true); }}
                className="font-mono text-sm tracking-[3px] uppercase text-cream hover:text-gold transition-colors duration-300 bg-transparent border-none cursor-pointer"
                style={{ padding: "12px 24px" }}
              >
                Contact
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
