/**
 * Seitenrahmen: Theme-Schalter und Overlay «Rechtliches».
 * Theme: Start nach ?theme= oder Systemeinstellung, nichts wird gespeichert (keine Persistenz).
 * Rechtliches: lädt /data/legal.json erst beim Klick (einzige Anfrage der Seite; unter file:// Fehlermeldung).
 */
(function (root) {
  "use strict";
  var listeners = [];
  var LEGAL_JSON_URL = "/data/legal.json";
  var legalCache = null, lastFocus = null;

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.getElementById("themeLabel").textContent = theme === "dark" ? "Hell" : "Dunkel";
    listeners.forEach(function (fn) { fn(theme); });
  }
  function currentTheme() { return document.documentElement.getAttribute("data-theme") || "light"; }
  function onThemeChange(fn) { listeners.push(fn); }

  function initTheme(requested) {
    var dark = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(requested === "dark" || requested === "light" ? requested : (dark ? "dark" : "light"));
    document.getElementById("themeToggle").addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }

  function el(id) { return document.getElementById(id); }
  function renderSection(s) {
    var div = document.createElement("div"); div.className = "legal-item";
    var lab = document.createElement("span"); lab.className = "ui-label"; lab.textContent = s.label || ""; div.appendChild(lab);
    if (s.content) {
      var p = document.createElement("p");
      String(s.content).split("\n").forEach(function (line, i) { if (i) p.appendChild(document.createElement("br")); p.appendChild(document.createTextNode(line)); });
      div.appendChild(p);
    }
    if (s.link && s.link.href) {
      var a = document.createElement("a"); a.href = s.link.href; a.textContent = s.link.text || s.link.href;
      if (/^https?:/.test(s.link.href)) { a.target = "_blank"; a.rel = "noopener"; }
      div.appendChild(a);
    }
    return div;
  }
  function openLegal(which) {
    lastFocus = document.activeElement;
    el("overlayLegal").hidden = false; el("legalLoading").hidden = false; el("legalContent").hidden = true; el("legalError").hidden = true;
    el("legalTitle").textContent = which === "impressum" ? "Impressum" : "Datenschutz";
    el("legalClose").focus();
    var p = legalCache ? Promise.resolve(legalCache) : fetch(LEGAL_JSON_URL).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (d) { legalCache = d; return d; });
    p.then(function (data) {
      var sec = data[which]; if (!sec) throw new Error("fehlt");
      el("legalTitle").textContent = sec.title;
      var c = el("legalContent"); c.textContent = "";
      (sec.sections || []).forEach(function (s) { c.appendChild(renderSection(s)); });
      el("legalLoading").hidden = true; c.hidden = false;
    }).catch(function () { el("legalLoading").hidden = true; el("legalError").hidden = false; });
  }
  function closeLegal() {
    if (el("overlayLegal").hidden) return false;
    el("overlayLegal").hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    return true;
  }
  function initLegal() {
    document.querySelectorAll("[data-legal]").forEach(function (b) {
      b.addEventListener("click", function () { openLegal(b.getAttribute("data-legal")); });
    });
    el("legalClose").addEventListener("click", closeLegal);
    el("overlayLegal").addEventListener("click", function (e) { if (e.target === this) closeLegal(); });
  }

  root.RSShell = { initTheme: initTheme, onThemeChange: onThemeChange, initLegal: initLegal, closeLegal: closeLegal, applyTheme: applyTheme };
})(window);
