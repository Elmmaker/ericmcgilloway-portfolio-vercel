"use client";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="pad relative z-2 flex justify-between items-center flex-wrap gap-5 border-t border-rule"
      style={{ padding: "60px clamp(24px, 6vw, 80px)" }}
    >
      <div className="font-serif text-lg text-cream">
        Let&apos;s work together.
      </div>
      <div className="flex gap-8">
        {["Email", "LinkedIn", "Vimeo"].map((label) => (
          <a
            key={label}
            href="#"
            className="font-mono text-[11px] tracking-[2px] uppercase text-muted hover:text-gold transition-colors duration-300"
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
