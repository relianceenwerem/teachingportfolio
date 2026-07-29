/* Rehumanizing Data — site interactions
   Progressive enhancement: every feature degrades to readable static HTML.
   Modules: mobile nav · reveal-on-scroll · reframe toggle · timelines · bars */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- mobile navigation ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;

    function close() {
      links.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }
    function isMobile() { return window.matchMedia("(max-width: 720px)").matches; }

    // start collapsed on mobile only
    if (isMobile()) close();
    window.addEventListener("resize", function () {
      if (!isMobile()) { links.hidden = false; toggle.setAttribute("aria-expanded", "false"); }
      else if (toggle.getAttribute("aria-expanded") !== "true") { close(); }
    });

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      links.hidden = open;
      toggle.setAttribute("aria-expanded", String(!open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && isMobile()) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        close(); toggle.focus();
      }
    });
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- datafied <-> rehumanized toggle ---------- */
  function initReframe() {
    document.querySelectorAll("[data-reframe]").forEach(function (root) {
      var sw = root.querySelector(".switch");
      var buttons = root.querySelectorAll(".switch button");
      var views = root.querySelectorAll(".reframe-view");
      if (!sw || !buttons.length) return;

      function set(mode) {
        sw.setAttribute("data-mode", mode);
        buttons.forEach(function (b) {
          b.setAttribute("aria-pressed", String(b.dataset.mode === mode));
        });
        views.forEach(function (v) {
          var active = v.dataset.view === mode;
          v.classList.toggle("is-active", active);
          v.setAttribute("aria-hidden", String(!active));
        });
      }
      buttons.forEach(function (b) {
        b.addEventListener("click", function () { set(b.dataset.mode); });
      });
      set(sw.getAttribute("data-mode") || "datafied");
    });
  }

  /* ---------- expandable timeline steps ---------- */
  function initTimeline() {
    document.querySelectorAll(".tl-toggle").forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        panel.hidden = open;
      });
    });
  }

  /* ---------- animate assessment bars when in view ---------- */
  function initBars() {
    var bars = document.querySelectorAll(".bar-fill");
    if (!bars.length) return;
    function fill(el) { el.style.setProperty("--pct", (parseFloat(el.dataset.pct) / 100).toFixed(3)); }
    if (reduceMotion || !("IntersectionObserver" in window)) {
      bars.forEach(fill); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { fill(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (el) { io.observe(el); });
  }

  /* ---------- year in footer ---------- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initReveal();
    initReframe();
    initTimeline();
    initBars();
    initYear();
  });
})();
