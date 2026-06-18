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

  /* Scroll-listener-based reveal. More reliable inside iframes than
     IntersectionObserver (which can miss programmatic scrolls + some
     cross-document edge cases). Elements get .reveal-in when their
     top crosses 88% of the viewport height. */
  function makeRevealer() {
    var pending = false;
    var elements = Array.prototype.slice.call(
      document.querySelectorAll(".reveal, .stagger-group")
    );

    function check() {
      pending = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var trigger = vh * 0.88;
      var remaining = [];
      for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        if (el.classList.contains("reveal-in")) continue;
        var r = el.getBoundingClientRect();
        // Top below 88% of viewport AND bottom above 0 = in view
        if (r.top < trigger && r.bottom > 0) {
          el.classList.add("reveal-in");
        } else if (r.top >= trigger) {
          remaining.push(el);
        }
      }
      // Trim observed list to elements still below the fold so the
      // scroll loop stays cheap on long documents.
      elements = remaining.concat(
        elements.filter(function (e) { return e.getBoundingClientRect().bottom < 0; })
      );
    }

    function onScroll() {
      if (pending) return;
      pending = true;
      // rAF when the tab is foreground for smooth pacing, fall back
      // to setTimeout when hidden so we still process scrolls.
      var schedule = (typeof requestAnimationFrame === "function" &&
                      !document.hidden)
        ? requestAnimationFrame
        : function (fn) { setTimeout(fn, 16); };
      schedule(check);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // Run once immediately so anything already in view reveals.
    check();
  }

  function init() {
    tagReveals();
    // Slight defer so any layout shifts from the inline IIFE's
    // video-blob conversion settle before we start observing.
    // setTimeout (vs requestAnimationFrame) so this fires even on
    // hidden tabs / embedded previews where rAF can be paused.
    setTimeout(makeRevealer, 60);
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})();
