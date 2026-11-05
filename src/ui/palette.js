/**
 * Palette für das Canvas (Design-Skills §6.2).
 * Liest die Tokens einmal vom Element mit data-lab (body), nicht von documentElement:
 * Im Dunkelmodus setzt :root den Leitton auf Zinnober, erst [data-lab="chemie"] am body
 * liefert Pflaume. Nach einem Theme-Wechsel ruft die Seite refresh() auf.
 */
(function (root) {
  "use strict";
  var TOKENS = {
    accent: "--lab-accent",
    line: "--color-line",
    border: "--color-border",
    text: "--color-text",
    soft: "--color-text-soft",
    surface: "--color-surface",
    surface2: "--color-surface-2",
    series2: "--data-5",
    flash: "--lab-flash",       // Lichtblitze auf dem Schirm (Token in assets/lab.css)
    fontTitle: "--font-title",
    fontUi: "--font-ui"
  };

  // resolve(tokenName) → Wert; im Browser getComputedStyle(body), im Test ein Ersatz.
  function createPalette(resolve) {
    var p = {};
    function refresh() {
      Object.keys(TOKENS).forEach(function (k) { p[k] = String(resolve(TOKENS[k]) || "").trim(); });
      return p;
    }
    refresh();
    return { colors: p, refresh: refresh };
  }

  function bodyResolver(doc) {
    return function (name) { return getComputedStyle(doc.body).getPropertyValue(name); };
  }

  var Palette = { TOKENS: TOKENS, createPalette: createPalette, bodyResolver: bodyResolver };
  if (typeof module !== "undefined" && module.exports) module.exports = Palette;
  else root.RSPalette = Palette;
})(typeof window !== "undefined" ? window : this);
