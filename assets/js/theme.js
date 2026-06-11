/* Theme switcher: persists Minimal/Bold choice. The initial data-theme is set
   by a tiny inline script in <head> to avoid a flash; this wires the buttons. */
(function () {
  var KEY = "mstar-theme";
  function apply(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(KEY, t); } catch (e) {}
    document.querySelectorAll("[data-theme-set]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-set") === t));
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-theme-set]");
    if (b) apply(b.getAttribute("data-theme-set"));
  });
  // sync button state on load
  document.addEventListener("DOMContentLoaded", function () {
    apply(document.documentElement.getAttribute("data-theme") || "bold");
  });
})();
