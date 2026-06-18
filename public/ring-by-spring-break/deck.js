/* =====================================================================
   Ring By Spring Break — Click-through Deck Navigation
   Runs after the existing inline IIFE so any orphan-killing NBSP fixes
   already applied to body copy are preserved when we move sections into
   deck-page wrappers.
   ===================================================================== */
(function () {
  "use strict";

  var pages = [];
  var currentIdx = 0;
  var isTransitioning = false;
  var deckEl = null;
  var flareEl = null;
  var navEl = null;
  var counterEl = null;
  var TRANSITION_MS = 560;

  /* ---------------- BUILD PAGE LIST ---------------- */

  function collectPageSources() {
    var list = [];

    // 1) Cover
    var cover = document.querySelector(".cover");
    if (cover) list.push({ kind: "cover", elements: [cover], label: "Cover" });

    // 2) Main content sections inside .wrap
    var wrap = document.querySelector(".wrap");
    var bodySections = wrap ? Array.prototype.filter.call(wrap.children, function (n) {
      return n.tagName === "SECTION";
    }) : [];

    bodySections.forEach(function (sec, sIdx) {
      var h2 = sec.querySelector("h2");
      var h2Title = h2 ? h2.textContent.trim() : "Section " + (sIdx + 1);
      var h3s = Array.prototype.filter.call(sec.children, function (n) {
        return n.tagName === "H3";
      });

      if (h3s.length >= 2) {
        // Split this section into one page per h3 group
        var allKids = Array.prototype.slice.call(sec.children);
        var h3Indexes = [];
        allKids.forEach(function (k, i) { if (k.tagName === "H3") h3Indexes.push(i); });

        h3Indexes.forEach(function (startIdx, gIdx) {
          var endIdx = gIdx < h3Indexes.length - 1 ? h3Indexes[gIdx + 1] : allKids.length;
          var groupEls = allKids.slice(startIdx, endIdx);

          // Prepend the section intro (h2 + leading paragraphs) to the first h3 page
          if (gIdx === 0 && h3Indexes[0] > 0) {
            groupEls = allKids.slice(0, startIdx).concat(groupEls);
          }
          var labelEl = groupEls.find(function (e) { return e.tagName === "H3"; });
          list.push({
            kind: "show-element",
            elements: groupEls,
            label: labelEl ? labelEl.textContent.trim() : h2Title,
            sourceSection: sec
          });
        });
      } else {
        list.push({ kind: "section", elements: [sec], label: h2Title });
      }
    });

    // 3) Close
    var close = document.querySelector(".close");
    if (close) list.push({ kind: "close", elements: [close], label: "Close" });

    return list;
  }

  /* ---------------- BUILD DECK DOM ---------------- */

  function buildDeck() {
    deckEl = document.createElement("main");
    deckEl.className = "deck";
    deckEl.setAttribute("role", "main");
    document.body.appendChild(deckEl);

    pages.forEach(function (page, idx) {
      var pageDom = document.createElement("section");
      pageDom.className = "deck-page " + page.kind + "-page";
      pageDom.setAttribute("data-page-index", String(idx));
      pageDom.setAttribute("aria-hidden", idx === 0 ? "false" : "true");

      // For Show Elements sub-pages we centre the content with a max-width
      // and tag it for the stagger reveal.
      if (page.kind === "show-element" || page.kind === "section") {
        var inner = document.createElement("div");
        inner.className = "deck-inner stagger-in";
        page.elements.forEach(function (el) { inner.appendChild(el); });
        pageDom.appendChild(inner);
      } else {
        page.elements.forEach(function (el) { pageDom.appendChild(el); });
      }

      if (idx === 0) pageDom.classList.add("active");
      deckEl.appendChild(pageDom);
      page.dom = pageDom;
    });

    // The original .wrap and any leftover empty section shells can hide —
    // their children have been moved.
    var wrap = document.querySelector(".wrap");
    if (wrap) wrap.style.display = "none";
  }

  /* ---------------- BUILD NAV CHROME ---------------- */

  function buildNav() {
    navEl = document.createElement("nav");
    navEl.className = "deck-nav";
    navEl.setAttribute("aria-label", "Treatment navigation");

    var prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "deck-btn deck-prev";
    prevBtn.innerHTML = "&larr;";
    prevBtn.setAttribute("aria-label", "Previous page");
    prevBtn.addEventListener("click", prev);

    var nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "deck-btn deck-next";
    nextBtn.innerHTML = "&rarr;";
    nextBtn.setAttribute("aria-label", "Next page");
    nextBtn.addEventListener("click", next);

    navEl.appendChild(prevBtn);
    navEl.appendChild(nextBtn);
    document.body.appendChild(navEl);

    counterEl = document.createElement("div");
    counterEl.className = "deck-counter";
    counterEl.setAttribute("aria-live", "polite");
    document.body.appendChild(counterEl);
  }

  function updateNavState() {
    var dots = document.querySelectorAll(".deck-dot");
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === currentIdx);
    });
    var prevBtn = document.querySelector(".deck-prev");
    var nextBtn = document.querySelector(".deck-next");
    if (prevBtn) prevBtn.disabled = currentIdx === 0;
    if (nextBtn) nextBtn.disabled = currentIdx === pages.length - 1;
    if (counterEl) {
      counterEl.textContent = String(currentIdx + 1).padStart(2, "0") +
        " / " + String(pages.length).padStart(2, "0");
    }
  }

  /* Lens-flare removed — keep the function as a no-op so call sites
     stay tidy and we can flip it back on later if needed. */
  function flareSweep(/* direction */) { /* intentionally empty */ }

  /* ---------------- TRANSITIONS ---------------- */

  function goto(idx) {
    if (isTransitioning) return;
    if (idx === currentIdx || idx < 0 || idx >= pages.length) return;
    isTransitioning = true;

    var forward = idx > currentIdx;
    var currentPage = pages[currentIdx].dom;
    var nextPage = pages[idx].dom;

    flareSweep(forward ? "forward" : "back");

    // Pre-position the incoming page off-screen on the correct side,
    // then animate it in. Outgoing page slides off the opposite side.
    nextPage.style.transition = "none";
    nextPage.style.transform = forward ? "translateX(100%)" : "translateX(-100%)";
    nextPage.style.opacity = "0";
    nextPage.classList.remove("exit-left", "exit-right");
    nextPage.classList.add("active");
    nextPage.setAttribute("aria-hidden", "false");
    void nextPage.offsetWidth;
    nextPage.style.transition = "";
    nextPage.style.transform = "";
    nextPage.style.opacity = "";

    currentPage.classList.add(forward ? "exit-left" : "exit-right");
    currentPage.setAttribute("aria-hidden", "true");

    setTimeout(function () {
      currentPage.classList.remove("active", "exit-left", "exit-right");
      currentIdx = idx;
      // Reset scroll so each new page reads from the top
      nextPage.scrollTop = 0;
      // Re-trigger stagger reveal by toggling the class
      var inner = nextPage.querySelector(".stagger-in");
      if (inner) {
        inner.classList.remove("stagger-in");
        void inner.offsetWidth;
        inner.classList.add("stagger-in");
      }
      updateNavState();
      isTransitioning = false;
    }, TRANSITION_MS);
  }

  function next() { goto(currentIdx + 1); }
  function prev() { goto(currentIdx - 1); }

  /* ---------------- INPUT HANDLERS ---------------- */

  function onKey(e) {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      e.preventDefault();
      goto(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goto(pages.length - 1);
    }
  }

  function bindTouch() {
    var sx = 0, sy = 0, dx = 0, dy = 0, active = false;
    document.body.addEventListener("touchstart", function (e) {
      if (!e.touches.length) return;
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      dx = 0; dy = 0; active = true;
    }, { passive: true });
    document.body.addEventListener("touchmove", function (e) {
      if (!active || !e.touches.length) return;
      dx = e.touches[0].clientX - sx;
      dy = e.touches[0].clientY - sy;
    }, { passive: true });
    document.body.addEventListener("touchend", function () {
      if (!active) return;
      active = false;
      // horizontal swipe only — keep vertical for scrolling within page
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) next(); else prev();
      }
    }, { passive: true });
  }

  /* ---------------- INIT ---------------- */

  function init() {
    if (deckEl) return;
    pages = collectPageSources();
    if (!pages.length) return;
    buildDeck();
    buildNav();
    updateNavState();
    document.addEventListener("keydown", onKey);
    bindTouch();
    // First-page stagger reveal kicks off right away
    var firstInner = pages[0].dom.querySelector(".stagger-in");
    if (firstInner) {
      // Trigger an initial flare for the cover
      setTimeout(function () { flareSweep("forward"); }, 220);
    }
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})();
