/* ============================================================================
   M* site animations — all vanilla JS, no dependencies, no network.
   Honors prefers-reduced-motion (shows a representative static state instead).
   Defensive: every routine no-ops if its DOM target is absent.
   ========================================================================== */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  function fire(ids, on) {
    (ids || []).forEach(function (id) {
      var el = $(id); if (el) el.classList.toggle("firing", on);
    });
  }
  function activate(ids, on) {
    (ids || []).forEach(function (id) {
      var el = $(id); if (el) el.classList.toggle("active", on);
    });
  }

  /* ---- 1. Reveal on scroll --------------------------------------------- */
  (function reveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("in"); }); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---- 2. Hero walk-graph traversal ------------------------------------ */
  (function hero() {
    if (!$("heroflow")) return;
    var cap = $("hero-cap");
    // Two walks expressed as timelines of {nodes, edges, text}
    var WALKS = [
      { label: "Text-to-image  ·  prefill_text → image_gen (loop) → vae_decoder",
        steps: [
          { n: ["hf-text"], e: [] },
          { n: ["hf-text", "hf-llm"], e: ["hfe-text"] },
          { n: ["hf-llm", "hf-flow"], e: ["hfe-flow"] },
          { n: ["hf-flow"], e: [] }, { n: ["hf-flow"], e: [] }, { n: ["hf-flow"], e: [] }, // loop pulses
          { n: ["hf-flow", "hf-vae"], e: ["hfe-vae"] },
          { n: ["hf-vae"], e: [] }
        ] },
      { label: "Image understanding  ·  prefill_text + prefill_vit → decode",
        steps: [
          { n: ["hf-text", "hf-vit"], e: [] },
          { n: ["hf-text", "hf-vit", "hf-llm"], e: ["hfe-text", "hfe-vit"] },
          { n: ["hf-llm"], e: ["hfe-dec"] }, { n: ["hf-llm"], e: ["hfe-dec"] }, { n: ["hf-llm"], e: ["hfe-dec"] }
        ] }
    ];
    var ALL_N = ["hf-text", "hf-vit", "hf-llm", "hf-flow", "hf-vae"];
    var ALL_E = ["hfe-text", "hfe-vit", "hfe-flow", "hfe-vae", "hfe-dec"];
    function clear() { fire(ALL_N, false); activate(ALL_E, false); }

    if (reduce) { // representative static state: the generation walk, fully lit
      fire(ALL_N, true); activate(["hfe-text", "hfe-flow", "hfe-vae"], true);
      if (cap) cap.textContent = WALKS[0].label;
      return;
    }
    var w = 0, s = 0;
    function tick() {
      var walk = WALKS[w];
      if (s === 0 && cap) cap.textContent = walk.label;
      clear();
      var step = walk.steps[s];
      fire(step.n, true); activate(step.e, true);
      s++;
      if (s >= walk.steps.length) { s = 0; w = (w + 1) % WALKS.length; setTimeout(function () { clear(); tick(); }, 900); }
      else setTimeout(tick, 620);
    }
    tick();
  })();

  /* ---- 3. CFG fan-out (3 branches pulse in parallel, loop) ------------- */
  (function cfg() {
    if (!$("cfgflow")) return;
    var branches = ["cf-main", "cf-text", "cf-img"], combine = ["cf-combine"];
    if (reduce) { fire(branches, true); return; }
    var phase = 0;
    setInterval(function () {
      phase = (phase + 1) % 4;
      if (phase === 1) { fire(branches, true); fire(combine, false); }
      else if (phase === 3) { fire(branches, false); fire(combine, true); }
      else { fire(branches, false); fire(combine, false); }
    }, 650);
  })();

  /* ---- 4. Placement ↔ sharding toggle ---------------------------------- */
  (function placement() {
    var diag = $("placediagram"); if (!diag) return;
    var cap = $("place-cap");
    // mode -> { nodeId: {gpu:'0'|'1'|'2'|'1+2', label}}, caption
    var MODES = {
      colocated: {
        cap: "Colocated: every component on one GPU — simplest, no cross-GPU transfer.",
        a: { "pl-enc": "GPU 0", "pl-llm": "GPU 0", "pl-dec": "GPU 0" }, cls: { "pl-enc": "g0", "pl-llm": "g0", "pl-dec": "g0" }
      },
      disaggregated: {
        cap: "Disaggregated: each component on its own GPU(s) and scaled independently.",
        a: { "pl-enc": "GPU 0", "pl-llm": "GPU 1", "pl-dec": "GPU 2" }, cls: { "pl-enc": "g0", "pl-llm": "g1", "pl-dec": "g2" }
      },
      pd: {
        cap: "Prefill/decode split: the backbone's prefill and decode Walks run on different ranks.",
        a: { "pl-enc": "GPU 0", "pl-llm": "GPU 1·2", "pl-dec": "GPU 0" }, cls: { "pl-enc": "g0", "pl-llm": "g1", "pl-dec": "g0" }
      },
      sharded: {
        cap: "Sharding × disaggregation: the backbone is tensor-parallel sharded across GPU 1+2, while encoder & decoder stay disaggregated on GPU 0 — composed freely.",
        a: { "pl-enc": "GPU 0", "pl-llm": "GPU 1+2 (TP)", "pl-dec": "GPU 0" }, cls: { "pl-enc": "g0", "pl-llm": "g12", "pl-dec": "g0" }
      }
    };
    function setMode(m) {
      var cfg = MODES[m]; if (!cfg) return;
      Object.keys(cfg.a).forEach(function (id) {
        var badge = $(id + "-badge"); if (badge) badge.textContent = cfg.a[id];
        var node = $(id);
        if (node) { node.classList.remove("g0", "g1", "g2", "g12"); node.classList.add(cfg.cls[id]); }
      });
      if (cap) cap.textContent = cfg.cap;
      diag.querySelectorAll("[data-mode]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === m));
      });
    }
    diag.addEventListener("click", function (e) {
      var b = e.target.closest("[data-mode]"); if (b) setMode(b.getAttribute("data-mode"));
    });
    setMode("disaggregated"); // sensible default that shows M*'s core capability
  })();
})();
