"use client";

import { useContact } from "./ContactContext";

export default function Footer() {
  const { setOpen } = useContact();
  return (
    <footer
      id="contact"
      className="pad relative z-2 flex flex-col sm:flex-row justify-between items-center flex-wrap gap-5 border-t border-rule text-center sm:text-left"
      style={{ padding: "60px clamp(20px, 6vw, 80px)" }}
    >
      <div className="font-serif text-lg text-cream">
        Let&apos;s work together.
      </div>
      <div className="flex gap-8">
        <button
          onClick={() => setOpen(true)}
          className="font-mono text-[11px] tracking-[2px] uppercase text-muted hover:text-gold transition-colors duration-300 bg-transparent border-none cursor-pointer"
          style={{ minHeight: "44px" }}
        >
          Email
        </button>
        {[
          { label: "LinkedIn", href: "https://www.linkedin.com/in/ericmcg" },
          { label: "ADG", href: "https://adg.org/directory/4183-eric-mcgilloway/" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] tracking-[2px] uppercase text-muted hover:text-gold transition-colors duration-300 flex items-center"
            style={{ minHeight: "44px" }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
