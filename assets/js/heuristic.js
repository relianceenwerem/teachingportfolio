/* Heuristic explorer — the five dimensions of data humanism.
   Implemented as an ARIA "tabs" widget. Content lives in the HTML, so
   with JavaScript disabled all five panels simply stack and remain readable. */
(function () {
  "use strict";

  function initWidget(root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll(".heuristic-tab"));
    var panels = Array.prototype.slice.call(root.querySelectorAll(".heuristic-panel"));
    if (tabs.length === 0 || tabs.length !== panels.length) return;

    var list = root.querySelector(".heuristic-list");
    if (list) list.setAttribute("role", "tablist");

    tabs.forEach(function (tab, i) {
      var panel = panels[i];
      var id = tab.id || "heur-tab-" + i;
      tab.id = id;
      panel.id = panel.id || "heur-panel-" + i;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panel.id);
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", id);
      panel.setAttribute("tabindex", "0");

      tab.addEventListener("click", function () { select(i, true); });
      tab.addEventListener("keydown", onKey);
    });

    function onKey(e) {
      var current = tabs.indexOf(e.currentTarget);
      var next = null;
      switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft":  next = (current - 1 + tabs.length) % tabs.length; break;
        case "ArrowDown":
        case "ArrowRight": next = (current + 1) % tabs.length; break;
        case "Home": next = 0; break;
        case "End":  next = tabs.length - 1; break;
        default: return;
      }
      e.preventDefault();
      select(next, true);
    }

    function select(index, focusTab) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", String(on));
        tab.setAttribute("tabindex", on ? "0" : "-1");
        panels[i].hidden = !on;
        if (on) panels[i].classList.add("panel-fade");
        else panels[i].classList.remove("panel-fade");
      });
      if (focusTab) tabs[index].focus();
    }

    // initial state: first dimension selected
    select(0, false);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-heuristic]").forEach(initWidget);
  });
})();
