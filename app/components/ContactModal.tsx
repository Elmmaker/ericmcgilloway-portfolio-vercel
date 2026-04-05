"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useContact } from "./ContactContext";

export default function ContactModal() {
  const { open, setOpen } = useContact();
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Store trigger element and move focus into dialog on open; restore on close
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => {
        panelRef.current?.focus();
      });
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  // Focus trap + Escape handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
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
    },
    [setOpen]
  );

  const EMAIL = "elmmaker@gmail.com";

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/xqegpypb", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formState),
      });
      if (res.ok) {
        setStatus("sent");
        setFormState({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  const panelMotion = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : { initial: { opacity: 0, y: 30, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 20, scale: 0.97 }, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-200 flex items-center justify-center p-0 sm:p-6"
          style={{
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(12px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          {/* Close */}
          <button
            className="absolute top-6 right-6 sm:right-8 font-mono text-[13px] text-dim hover:text-gold cursor-pointer bg-transparent border-none tracking-[2px] transition-colors duration-300 z-10"
            onClick={() => setOpen(false)}
            style={{ minHeight: "44px", minWidth: "44px" }}
            aria-label="Close dialog"
          >
            CLOSE <span aria-hidden="true">&#10005;</span>
          </button>

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            tabIndex={-1}
            className="w-full h-full sm:h-auto bg-dark border-0 sm:border sm:border-rule overflow-y-auto focus:outline-none"
            style={{ maxWidth: "clamp(320px, 90vw, 560px)", maxHeight: "100vh", padding: "clamp(24px, 5vw, 48px) clamp(20px, 5vw, 40px)" }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            {...panelMotion}
          >
            {/* Heading */}
            <h2
              id="contact-modal-title"
              className="font-serif font-bold text-cream"
              style={{ fontSize: "clamp(24px, 4vw, 40px)", marginBottom: "32px", marginTop: "40px" }}
            >
              Get in touch
            </h2>

            {/* Email row */}
            <div className="flex items-center gap-4 flex-wrap" style={{ marginBottom: "28px" }}>
              <span className="font-mono text-gold" style={{ fontSize: "clamp(13px, 1.5vw, 15px)", letterSpacing: "0.5px" }}>
                {EMAIL}
              </span>
              <button
                onClick={copyEmail}
                className="font-mono text-[10px] tracking-[1.5px] uppercase border border-gold bg-transparent text-gold cursor-pointer hover:bg-gold/10 transition-all duration-300"
                style={{ padding: "6px 14px", minHeight: "44px" }}
              >
                {copied ? "Copied!" : "Copy Email"}
              </button>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gold/30" style={{ marginBottom: "32px" }} />

            {/* Aria-live region for form status */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {status === "sent"
                ? "Message sent successfully."
                : status === "error"
                ? "Something went wrong. Please try again."
                : ""}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="contact-name"
                  className="font-mono text-[10px] tracking-[2px] uppercase text-dim block"
                  style={{ marginBottom: "8px" }}
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full font-sans text-cream bg-transparent border border-rule focus:border-gold focus-visible:ring-2 focus-visible:ring-gold outline-none transition-colors duration-300"
                  style={{ padding: "12px 14px", fontSize: "16px", minHeight: "48px" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="contact-email"
                  className="font-mono text-[10px] tracking-[2px] uppercase text-dim block"
                  style={{ marginBottom: "8px" }}
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full font-sans text-cream bg-transparent border border-rule focus:border-gold focus-visible:ring-2 focus-visible:ring-gold outline-none transition-colors duration-300"
                  style={{ padding: "12px 14px", fontSize: "16px", minHeight: "48px" }}
                />
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label
                  htmlFor="contact-message"
                  className="font-mono text-[10px] tracking-[2px] uppercase text-dim block"
                  style={{ marginBottom: "8px" }}
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full font-sans text-cream bg-transparent border border-rule focus:border-gold focus-visible:ring-2 focus-visible:ring-gold outline-none transition-colors duration-300 resize-y"
                  style={{ padding: "12px 14px", fontSize: "16px" }}
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="font-mono text-xs tracking-[2px] uppercase bg-gold text-dark border-none cursor-pointer hover:bg-gold-hover hover:-translate-y-0.5 transition-all duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{ padding: "16px 32px", minHeight: "48px" }}
              >
                {status === "sending"
                  ? "Sending..."
                  : status === "sent"
                  ? "Message sent!"
                  : status === "error"
                  ? "Try again"
                  : "Send Message"}
              </button>
              {status === "error" && (
                <p className="font-mono text-[11px] text-red-400" style={{ marginTop: "8px" }}>
                  Something went wrong. Try again or copy the email above.
                </p>
              )}
            </form>

            <p className="font-mono text-[11px] text-dim" style={{ marginTop: "16px", lineHeight: 1.5 }}>
              Or just copy the email above and send from your preferred client.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
