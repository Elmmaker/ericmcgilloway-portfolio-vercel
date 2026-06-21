"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useContact } from "./ContactContext";

const EMAIL = "elmmaker@gmail.com";

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
      requestAnimationFrame(() => panelRef.current?.focus());
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
    : {
        initial: { opacity: 0, y: 30, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.97 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="contact-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <button
            className="contact-modal-close"
            onClick={() => setOpen(false)}
            aria-label="Close dialog"
          >
            CLOSE <span aria-hidden>&#10005;</span>
          </button>

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            tabIndex={-1}
            className="contact-modal-panel"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            {...panelMotion}
          >
            <h2 id="contact-modal-title" className="contact-modal-h">
              Get in touch
            </h2>

            <div className="contact-modal-row">
              <span className="contact-modal-email">{EMAIL}</span>
              <button onClick={copyEmail} className="contact-modal-copy">
                {copied ? "Copied!" : "Copy Email"}
              </button>
            </div>

            <p className="contact-modal-hint">
              Copy the address and use your own mail app, or send a message
              right here.
            </p>

            <div className="contact-modal-divider" />

            <div aria-live="polite" aria-atomic="true" className="visually-hidden">
              {status === "sent"
                ? "Message sent successfully."
                : status === "error"
                ? "Something went wrong. Please try again."
                : ""}
            </div>

            <form onSubmit={handleSubmit} className="contact-modal-form">
              <div className="contact-modal-field">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>

              <div className="contact-modal-field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>

              <div className="contact-modal-field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="contact-modal-submit"
              >
                {status === "sending"
                  ? "Sending…"
                  : status === "sent"
                  ? "Message sent!"
                  : status === "error"
                  ? "Try again"
                  : "Send Message"}
              </button>
              {status === "error" && (
                <p className="contact-modal-error">
                  Something went wrong. Try again or copy the email above.
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
