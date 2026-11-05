/**
 * Canvas-Bühne: füllt die Breite des Rahmens, scharf bei hoher Pixeldichte.
 * Gezeichnet wird in logischen Koordinaten (breit 960 × 500 wie in der Demo,
 * schmal 520 × 860). Die Umrechnung macht setTransform; alle Zahlen der Demo
 * bleiben gültig.
 */
(function (root) {
  "use strict";
  var NARROW_BELOW = 720;              // CSS-Pixel Breite des Rahmens
  var MIN_UI_PX = 12, MIN_TITLE_PX = 18;   // Mindestgrösse nach Skalierung (CSS-Pixel)

  function createStage(canvas, host, layouts, onChange) {
    var ctx = canvas.getContext("2d");
    var st = { canvas: canvas, ctx: ctx, layout: layouts.wide, k: 1, dpr: 1, fonts: { ui: "sans-serif", title: "cursive" } };

    function resize() {
      var w = host.clientWidth || 960;
      var lay = w < NARROW_BELOW ? layouts.narrow : layouts.wide;
      var k = w / lay.W, dpr = Math.min(3, window.devicePixelRatio || 1);
      var cssH = Math.round(lay.H * k);
      canvas.style.height = cssH + "px";
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(cssH * dpr);
      var changed = lay !== st.layout;
      st.layout = lay; st.k = k; st.dpr = dpr;
      if (onChange) onChange(changed);
    }

    // Beginnt ein Bild: Transformation setzen, Fläche leeren (der Rahmen .scene liefert den Hintergrund).
    st.begin = function () {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var s = st.k * st.dpr;
      ctx.setTransform(s, 0, 0, s, 0, 0);
    };
    // Schrift in logischen Pixeln, mindestens MIN_UI_PX bzw. MIN_TITLE_PX nach Skalierung.
    st.ui = function (px, weight) {
      var size = Math.max(px, MIN_UI_PX / st.k);
      return (weight ? weight + " " : "") + size.toFixed(1) + "px " + st.fonts.ui;
    };
    st.title = function (px) {
      var size = Math.max(px, MIN_TITLE_PX / st.k);
      return size.toFixed(1) + "px " + st.fonts.title;
    };
    // Bildschirm- in logische Koordinaten
    st.toLogical = function (clientX, clientY) {
      var r = canvas.getBoundingClientRect();
      return [(clientX - r.left) * st.layout.W / r.width, (clientY - r.top) * st.layout.H / r.height];
    };
    st.setFonts = function (ui, title) { st.fonts.ui = ui || st.fonts.ui; st.fonts.title = title || st.fonts.title; };

    if (typeof ResizeObserver !== "undefined") new ResizeObserver(resize).observe(host);
    else window.addEventListener("resize", resize);
    // Pixeldichte ändert sich beim Verschieben auf einen anderen Bildschirm oder beim Zoomen
    window.addEventListener("resize", resize);
    resize();
    return st;
  }

  // Schriften laden, höchstens timeoutMs warten (offline bleibt die Ersatzschrift).
  function loadFonts(specs, timeoutMs) {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var all = Promise.all(specs.map(function (s) { return document.fonts.load(s).catch(function () {}); }));
    var limit = new Promise(function (res) { setTimeout(res, timeoutMs || 1500); });
    return Promise.race([all, limit]);
  }

  root.RSCanvas = { createStage: createStage, loadFonts: loadFonts, NARROW_BELOW: NARROW_BELOW };
})(window);
