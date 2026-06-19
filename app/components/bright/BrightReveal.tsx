"use client";

import { useEffect } from "react";

/* IntersectionObserver that adds .in to any .reveal element when it
   enters the viewport. Respects prefers-reduced-motion. Mount once
   per bright page (near the bottom of the tree is fine — it queries
   on mount). */
export default function BrightReveal() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      document.querySelectorAll(".reveal").forEach((el) =>
        el.classList.add("in")
      );
      return;
    }
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      document.querySelectorAll(".reveal").forEach((el) =>
        el.classList.add("in")
      );
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
