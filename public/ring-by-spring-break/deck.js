/* =====================================================================
   Ring By Spring Break — Microsite scroll-reveal
   The treatment scrolls as a single document. This script just tags
   sections / headings / frames / swatches with .reveal and adds
   .reveal-in via IntersectionObserver as each enters the viewport.
   Runs after the existing inline IIFE so the orphan-fixing NBSPs and
   video-blob conversion are already applied before we observe.
   ===================================================================== */
(function () {
  "use strict";

  if (typeof window === "undefined") return;

  /* Selectors for things that should fade-and-rise into view. */
  var REVEAL_SELECTORS = [
    "section > h2",
    "section > h3",
    "section > p",
    "section > .lead-3",
    "section > .grid2 > div",
    "section > .frames",
    "section > .frames > .frame",
    ".cover-foot",
    ".cover-foot > *",
    ".swatches > .sw",
    ".swlist > .swrow",
    ".typerow",
    ".beat",
    ".pack .item",
    ".close > *"
  ];

  /* Some containers also stagger their direct children. */
  var STAGGER_SELECTORS = [".swatches", ".swlist", ".frames"];

  function tagReveals() {
    REVEAL_SELECTORS.forEach(function (sel) {
      var els = document.querySelectorAll(sel);
      els.forEach(function (el) { el.classList.add("reveal"); });
    });
    STAGGER_SELECTORS.forEach(function (sel) {
      var els = document.querySelectorAll(sel);
      els.forEach(function (el) { el.classList.add("stagger-group"); });
    });
  }

  function observe() {
    if (typeof IntersectionObserver === "undefined") {
      // Old browser — just reveal everything immediately.
      document.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.add("reveal-in");
      });
      document.querySelectorAll(".stagger-group").forEach(function (el) {
        el.classList.add("reveal-in");
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-in");
          io.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.08
    });

    document.querySelectorAll(".reveal, .stagger-group").forEach(function (el) {
      io.observe(el);
    });
  }

  function init() {
    tagReveals();
    // Slight defer so any layout shifts from the inline IIFE's
    // video-blob conversion settle before we start observing.
    requestAnimationFrame(observe);
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})();
