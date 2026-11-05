# Cogniviolabs — Lab SKILL
 
**Version:** 1.0  
**Gilt für:** Alle Labs unter cogniviolabs.com  
**Design-Referenz:** DESIGN.md (dark: Silent Scholar · light: Precision Lexicon)
 
---
 
## Pflichtlektüre vor jedem Lab-Build
 
Wenn du ein neues Lab baust oder ein bestehendes anpasst, lies zuerst diese SKILL.md vollständig. Sie enthält alle Konventionen, Templates und Klassen die du brauchst. Kein Code darf von dieser Spezifikation abweichen ohne explizite Anweisung von Alain.
 
---
 
## 1. Stack
 
| Element | Wert |
|---|---|
| Format | Standalone HTML — keine Build-Pipeline |
| CSS | `/assets/css/lab.css` — lokal, kein CDN |
| Fonts | `/assets/fonts/*.woff2` — lokal, kein Google Fonts CDN |
| Icons | Material Symbols Outlined — lokal aus `/assets/fonts/` |
| JS | Vanilla JS, kein Framework |
| Tailwind | **Nicht** in Lab-HTML-Dateien — nur für Astro-Seiten |
| Deployment | Datei hochladen, kein Build-Schritt |
 
**Verboten im Lab-HTML:**
- `<script src="https://cdn.tailwindcss.com...">` 
- `<link href="https://fonts.googleapis.com...">` 
- Tailwind-Klassen wie `flex`, `px-4`, `rounded-xl` etc.
- Inline `style`-Attribute mit hardcodierten Hex-Farben
- Inline `style`-Attribute für Layout (Ausnahme: dynamische JS-Werte)
**Erlaubt als inline style:**
- `style="color:var(--c-teal);"` — CSS Custom Properties
- `style="width:35%;"` — dynamisch vom JS gesetzt
- `style="display:none;"` / `style="display:flex;"` — JS-Toggle
---
 
## 2. HTML-Grundstruktur
 
Jedes Lab beginnt exakt so:
 
```html
<!DOCTYPE html>
<html lang="de" data-theme="dark">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>[Lab-Titel] | Cogniviolabs</title>
  <link rel="stylesheet" href="/assets/css/lab.css"/>
</head>
<body>
 
<!-- Parallax Mouse Gradient -->
<div id="mouseGradient" class="mouse-gradient"></div>
 
<!-- Progress Ribbon (2px oben) -->
<div class="progress-ribbon">
  <div class="progress-ribbon__fill" style="width:35%;"></div>
</div>
 
<!-- Topbar -->
<header class="topbar">
  <div class="topbar__logo">
    cogni<span class="topbar__logo-accent">vio</span> labs
  </div>
  <div class="topbar__right">
    <nav class="breadcrumb">
      <a href="https://www.cogniviolabs.com" class="breadcrumb__link">Cogniviolabs</a>
      <span class="breadcrumb__sep">/</span>
      <a href="https://www.cogniviolabs.com/lab/[fach]" class="breadcrumb__link">[Fach]</a>
      <span class="breadcrumb__sep">/</span>
      <span class="breadcrumb__current">[Lab-Name]</span>
    </nav>
    <div class="topbar__sep"></div>
    <button id="themeToggle" onclick="toggleTheme()" class="theme-toggle" title="Helles / dunkles Design">
      <span id="themeIcon">☀️</span>
      <span id="themeLabel">Hell</span>
    </button>
  </div>
</header>
 
<!-- Main Content -->
<main class="page-wrap">
 
  <!-- Page Header -->
  <div>
    <p class="page-header__meta">[Fach] · [Lab-Typ z.B. Simulation / Quiz / Experiment]</p>
    <h1 class="page-header__title">[Lab-Titel]</h1>
    <div class="page-header__accent-line"></div>
    <p class="page-header__sub">[Kernfrage des Labs]</p>
    <a href="https://www.cogniviolabs.com/lab/[fach]/[slug]/lehrperson" class="lp-link">
      🎓 Hinweise für Lehrpersonen
    </a>
  </div>
 
  <!-- [Lab-Inhalt hier] -->
 
  <!-- Footer -->
  <footer class="page-footer">
    <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap; justify-content:center;">
      <span class="page-footer__brand">
        cogni<span class="page-footer__brand-accent">vio</span> labs
      </span>
      <div style="width:1px; height:12px; background:var(--c-sep-line);"></div>
      <div class="page-footer__links">
        <button onclick="openLegal('impressum')" class="page-footer__link">Impressum</button>
        <span class="page-footer__dot">·</span>
        <button onclick="openLegal('datenschutz')" class="page-footer__link">Datenschutz</button>
        <span class="page-footer__dot">·</span>
        <a href="https://www.cogniviolabs.com/lab/[fach]/[slug]/lehrperson" class="page-footer__link">
          🎓 Für Lehrpersonen
        </a>
      </div>
    </div>
    <p class="page-footer__copy">© 2026 Cogniviolabs · Alain Nicolas Lavanchy · Kanton Aargau</p>
  </footer>
 
</main>
 
<!-- Legal Overlay (immer am Ende, unverändert) -->
<div id="overlayLegal" class="overlay-hidden glass-overlay" style="z-index:110;">
  <div class="glass-card">
    <button id="legalClose" class="overlay-close">✕</button>
    <p class="overlay__supertitle">Rechtliches</p>
    <h2 id="legalTitle" class="overlay__title"></h2>
    <div id="legalLoading" style="display:flex; align-items:center; gap:10px; padding:20px 0;">
      <span class="status-dot" style="background:var(--c-teal); animation:blink 0.9s ease infinite;"></span>
      <span class="overlay__sub" style="margin:0;">Wird geladen…</span>
    </div>
    <div id="legalContent" class="legal-section" style="display:none;"></div>
    <div id="legalError" class="legal-item" style="display:none;">
      <p class="legal-item__text" style="color:var(--c-red);">
        Inhalt konnte nicht geladen werden. Bitte später erneut versuchen.
      </p>
    </div>
  </div>
</div>
 
<!-- JS: Theme + Legal + Parallax (immer am Ende, unverändert) -->
<script>
// ── THEME ────────────────────────────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('cogniTheme', theme);
  const icon  = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  if (theme === 'light') {
    icon.textContent  = '🌙';
    label.textContent = 'Dunkel';
  } else {
    icon.textContent  = '☀️';
    label.textContent = 'Hell';
  }
  document.body.style.background = 'var(--c-bg)';
  document.body.style.color = 'var(--c-text)';
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}
(function() {
  applyTheme(localStorage.getItem('cogniTheme') || 'dark');
})();
 
// ── PARALLAX GRADIENT ─────────────────────────────────────────────────────────
(function() {
  const el = document.getElementById('mouseGradient');
  let targetX = 50, targetY = 40, currentX = 50, currentY = 40, raf = null;
  document.addEventListener('mousemove', function(e) {
    targetX = (e.clientX / window.innerWidth)  * 100;
    targetY = (e.clientY / window.innerHeight) * 100;
    if (!raf) raf = requestAnimationFrame(tick);
  });
  function tick() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const c1 = isDark ? 'rgba(6,182,212,0.07)'  : 'rgba(6,182,212,0.05)';
    const c2 = isDark ? 'rgba(76,215,246,0.04)' : 'rgba(6,182,212,0.025)';
    el.style.background = `radial-gradient(ellipse 680px 560px at ${currentX.toFixed(2)}% ${currentY.toFixed(2)}%, ${c1} 0%, ${c2} 25%, transparent 65%)`;
    if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
      raf = requestAnimationFrame(tick);
    } else { raf = null; }
  }
})();
 
// ── LEGAL OVERLAY ─────────────────────────────────────────────────────────────
const LEGAL_JSON_URL = '/data/legal.json';
let legalCache = null;
function renderSection(section) {
  let text = (section.content || '').replace(/\n/g, '<br>');
  if (section.highlight) text = text.replace(section.highlight, `<strong>${section.highlight}</strong>`);
  const linkHTML = section.link
    ? `<a href="${section.link.href}" class="legal-item__link" ${section.link.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${section.link.text}</a>`
    : '';
  return `<div class="legal-item"><p class="legal-item__label">${section.label}</p>${text ? `<p class="legal-item__text">${text}</p>` : ''}${linkHTML}</div>`;
}
async function openLegal(which) {
  const overlay = document.getElementById('overlayLegal');
  const loading = document.getElementById('legalLoading');
  const content = document.getElementById('legalContent');
  const error   = document.getElementById('legalError');
  overlay.classList.replace('overlay-hidden', 'overlay-visible');
  loading.style.display = 'flex';
  content.style.display = 'none';
  error.style.display   = 'none';
  try {
    if (!legalCache) {
      const res = await fetch(LEGAL_JSON_URL);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      legalCache = await res.json();
    }
    const data = legalCache[which];
    document.getElementById('legalTitle').textContent = data.title;
    content.innerHTML = data.sections.map(renderSection).join('');
    loading.style.display = 'none';
    content.style.display = 'flex';
  } catch (err) {
    loading.style.display = 'none';
    error.style.display   = 'block';
  }
}
function closeLegal() {
  document.getElementById('overlayLegal').classList.replace('overlay-visible', 'overlay-hidden');
}
document.getElementById('legalClose').addEventListener('click', closeLegal);
document.getElementById('overlayLegal').addEventListener('click', function(e) {
  if (e.target === this) closeLegal();
});
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeLegal(); });
</script>
 
</body>
</html>
```
 
---
 
## 3. CSS-Klassen Referenz
 
Alle Klassen sind in `/assets/css/lab.css` definiert. Nie eigene Styles hinzufügen — stattdessen lab.css erweitern und Alain informieren.
 
### Layout
| Klasse | Verwendung |
|---|---|
| `.page-wrap` | Haupt-`<main>` — zentriert, max 820px, 24px gap |
| `.tonal-sep` | Trennlinie via Hintergrundfarbe (kein border) |
 
### Topbar & Navigation
| Klasse | Verwendung |
|---|---|
| `.topbar` | Fixierter Header |
| `.topbar__logo` | Brand-Text |
| `.topbar__logo-accent` | Farbiger Akzent im Logo |
| `.topbar__right` | Rechte Seite (Breadcrumb + Toggle) |
| `.topbar__sep` | Vertikaler Trenner |
| `.breadcrumb` | Nav-Container |
| `.breadcrumb__link` | Klickbarer Breadcrumb-Schritt |
| `.breadcrumb__sep` | `/` zwischen Schritten |
| `.breadcrumb__current` | Aktive Seite (nicht klickbar) |
| `.theme-toggle` | Hell/Dunkel-Schalter |
 
### Page Header
| Klasse | Verwendung |
|---|---|
| `.page-header__meta` | Fach · Lab-Typ (small caps, gedämpft) |
| `.page-header__title` | Haupt-H1 |
| `.page-header__accent-line` | Teal-Gradient-Linie unter H1 |
| `.page-header__sub` | Untertitel / Kernfrage |
| `.lp-link` | Pill-Link zu Lehrperson-Seite |
 
### Progress Ribbon
| Klasse | Verwendung |
|---|---|
| `.progress-ribbon` | 2px Linie ganz oben |
| `.progress-ribbon__fill` | Fortschrittsbalken (width via JS) |
 
### Karten
| Klasse | Verwendung |
|---|---|
| `.card` | Standard-Card (surface-lo) |
| `.card--recessed` | Vertieft (surface-rec, z.B. Track-Tray) |
| `.card--container` | Mittlere Ebene |
| `.info-card` | Einstiegs-Infobox |
| `.info-card__tag` | Label oben in Infobox |
| `.info-card__body` | Fliesstext in Infobox |
| `.highlight` | Hervorgehobener Span in info-card__body |
| `.sim-card` | Simulation-Container |
| `.sim-card__body` | Innenabstand Simulation |
| `.observation-box` | Beobachtungsauftrag mit linkem Akzent |
| `.observation-box__tag` | Label des Beobachtungsauftrags |
| `.observation-box__text` | Fragetext |
| `.observation-box__cta` | Handlungsaufforderung fett |
 
### Steuerelemente
| Klasse | Verwendung |
|---|---|
| `.controls` | Flex-Container für alle Controls |
| `.control-row` | Einzelne Zeile (Label + Input) |
| `.control-label` | Label-Block links |
| `.control-label__name` | Hauptbezeichnung |
| `.control-label__sub` | Unterbezeichnung (small caps) |
| `.range-value` | Wert-Anzeige rechts vom Slider |
| `.range-value__hint` | Hinweis wenn Wert ungültig (rot) |
| `.checkbox-wrap` | Label-Container für Checkbox |
| `.checkbox-wrap__label` | Checkbox-Beschriftung |
| `.checkbox-wrap__sub` | Kurze Erklärung unter Checkbox |
| `.btn-row` | Horizontale Button-Gruppe |
| `.status-row` | Status-Dot + Text rechts |
 
### Buttons
| Klasse | Verwendung |
|---|---|
| `.btn-primary` | CTA — Teal-Gradient |
| `.btn-ghost` | Sekundär — Hintergrundfarbe |
| `.btn-outline-teal` | Tertär — teal Umriss (hidden by default) |
| `.btn-outline-green` | Tertär — grün Umriss (hidden by default) |
| `.btn-clear` | Tabelle leeren |
| `.action-hidden` | JS-Toggle: `display:none` |
| `.action-visible` | JS-Toggle: `display:inline-flex` |
 
### Status
| Klasse | Verwendung |
|---|---|
| `.status-dot` | 7px Kreis, Farbe via JS |
 
### Messreihe / Tabelle
| Klasse | Verwendung |
|---|---|
| `.data-table-wrap` | Äusserer Container |
| `.data-table-header` | Header-Zeile (Titel + Clear-Button) |
| `.data-table-header__title` | Titel der Tabelle |
| `.data-table-header__count` | Eintragsanzahl |
| `.data-table-empty` | Leer-Zustand Text |
| `.data-table` | `<table>` |
| `.badge--yes` | Grünes Badge |
| `.badge--no` | Graues Badge |
 
### Overlays
| Klasse | Verwendung |
|---|---|
| `.overlay-hidden` | Unsichtbar (`display:none`) |
| `.overlay-visible` | Sichtbar (`display:flex`) |
| `.glass-overlay` | Vollbild-Overlay mit Glasmorphismus |
| `.glass-card` | Overlay-Inhaltskarte |
| `.overlay-close` | ✕-Button |
| `.overlay__supertitle` | Kategorie-Label (teal, small caps) |
| `.overlay__title` | Overlay-Haupttitel |
| `.overlay__sub` | Untertitel |
| `.overlay__sep` | Trennlinie im Overlay |
| `.overlay__footer` | Abschlusstext |
| `.explain-grid` | Flex-Grid für Erklärungspunkte |
| `.explain-item` | Einzelner Erklärungspunkt |
| `.explain-item__icon` | Emoji/Icon links |
| `.explain-item__title` | Titel des Punkts |
| `.explain-item__text` | Erklärungstext |
| `.legal-section` | Container für Legal-Items |
| `.legal-item` | Einzelner Rechtspunkt |
| `.legal-item__label` | Label (small caps) |
| `.legal-item__text` | Text |
| `.legal-item__link` | Link in Legal-Item |
 
### Simulation (Nervensignal-spezifisch)
| Klasse | Verwendung |
|---|---|
| `.track-tray` | Domino-Bahn |
| `.domino` | Einzelner Dominostein |
| `.domino.fallen` | Umgefallener Stein (JS add) |
| `.domino.blocked` | Blockierter Stein (JS add) |
| `.straw` | Stäbchen zwischen Steinen |
| `.straw.lit` | Aktives Stäbchen (JS add) |
| `.distance-row` | Signaldistanz-Anzeige |
| `.distance-row__label` | Label |
| `.distance-row__value` | Wert |
| `.distance-row__hint` | Hinweistext |
 
### Footer
| Klasse | Verwendung |
|---|---|
| `.page-footer` | Footer-Container |
| `.page-footer__brand` | Cogniviolabs-Schriftzug |
| `.page-footer__brand-accent` | Farbiger Akzent |
| `.page-footer__links` | Link-Gruppe |
| `.page-footer__link` | Einzelner Link/Button |
| `.page-footer__dot` | Trenner `·` |
| `.page-footer__copy` | Copyright-Zeile |
 
### Animationen
| Klasse | Verwendung |
|---|---|
| `.animate-fade-in` | Einblenden (0.18s) |
| `.animate-slide-up` | Einblenden + nach oben (0.2s) |
| `.animate-blink` | Pulsieren (Status-Dot) |
| `.mouse-gradient` | Parallax-Gradient-Div |
 
---
 
## 4. CSS Custom Properties
 
Nie hardcodierte Farben verwenden — immer `var(--c-*)`:
 
```css
/* Hintergründe */
--c-bg          Seitenhintergrund
--c-surf-rec    Vertieft (Tray, Input)
--c-surf-lo     Cards, Sections
--c-surf        Tabellen-Header, Separatoren
--c-surf-hi     Overlay-Cards, Elevated
--c-tbl-head-bg Tabellen-Kopfzeile
--c-explain-bg  Explain-Items, Legal-Items
--c-overlay-bg  Overlay-Backdrop
--c-overlay-card Overlay-Card Hintergrund
 
/* Text */
--c-text        Primärtext
--c-muted       Gedämpfter Text (Labels, Beschreibungen)
--c-faint       Sehr gedämpft (Footer, Trenner)
 
/* Akzente */
--c-teal        Primärer Teal-Akzent
--c-teal-dim    Teal bei 25–30% Opacity (Outlines)
--c-green       Erfolg, Bestätigung
--c-green-dim   Grün-Outline
--c-red         Fehler, Warnung
--c-warn        Amber (laufende Prozesse)
 
/* Separatoren */
--c-sep         Allgemeine Trenner
--c-sep-line    Topbar/Footer-Trenner
--c-row-sep     Tabellen-Zeilen
 
/* Buttons */
--c-btn-reset   Ghost-Button Hintergrund
--c-btn-txt     Ghost-Button Text
--c-accent-line Observation-Box linke Linie
 
/* Topbar / Ribbon */
--c-topbar-bg   Topbar-Hintergrund
--c-ribbon-bg   Ribbon-Hintergrund
--c-ribbon      Ribbon-Fortschritt
--c-footer-acc  Footer-Akzent
 
/* Simulation */
--c-domino-a    Domino Gradient oben
--c-domino-b    Domino Gradient unten
--c-straw-a     Stäbchen Gradient aussen
--c-straw-b     Stäbchen Gradient mitte
--c-dist-hint   Distanz-Hinweis
--c-status-idle Status-Dot Ruhezustand
--c-info-tag    Info-Card Tag-Farbe
--c-glow-inner  Parallax-Gradient innen
--c-glow-outer  Parallax-Gradient aussen
```
 
---
 
## 5. JavaScript-Konventionen
 
### Theme (unverändert kopieren)
```js
function applyTheme(theme) { /* ... */ }
function toggleTheme() { /* ... */ }
// Init am Ende des <script>-Blocks:
(function() { applyTheme(localStorage.getItem('cogniTheme') || 'dark'); })();
```
 
### Legal Overlay (unverändert kopieren)
```js
const LEGAL_JSON_URL = '/data/legal.json';
let legalCache = null;
async function openLegal(which) { /* ... */ }
function closeLegal() { /* ... */ }
```
 
### Parallax (unverändert kopieren)
```js
(function() { /* mouseGradient lerp */ })();
```
 
### Overlay-Toggle
```js
// Öffnen:
document.getElementById('myOverlay').classList.replace('overlay-hidden', 'overlay-visible');
// Schliessen:
document.getElementById('myOverlay').classList.replace('overlay-visible', 'overlay-hidden');
```
 
### Status-Dot
```js
const dot = document.getElementById('dot');
dot.style.background = 'var(--c-teal)';   // done
dot.style.background = 'var(--c-warn)';   // running
dot.style.background = 'var(--c-red)';    // error
dot.style.animation  = 'blink 0.9s ease infinite'; // pulsieren
dot.style.animation  = 'none';
```
 
---
 
## 6. URL-Konventionen
 
```
cogniviolabs.com/lab/[fach]/[slug]/           ← Lab
cogniviolabs.com/lab/[fach]/[slug]/lehrperson ← LP-Seite
```
 
**Fach-Slugs:**
| Fach | Slug |
|---|---|
| Biologie | `bio` |
| Physik | `physik` |
| Chemie | `chemie` |
| Mathematik | `mathe` |
| Natur & Technik (allg.) | `nt` |
 
**Breadcrumb-Links:**
```html
<a href="https://www.cogniviolabs.com" class="breadcrumb__link">Cogniviolabs</a>
<a href="https://www.cogniviolabs.com/lab/bio" class="breadcrumb__link">Biologie</a>
<span class="breadcrumb__current">Nervensignal</span>
```
 
---
 
## 7. Neue Labs bauen — Checkliste
 
- [ ] HTML-Grundstruktur aus Abschnitt 2 kopieren
- [ ] `[Platzhalter]` ersetzen (Titel, Fach, Slug, Kernfrage)
- [ ] Kein CDN-Link, kein Tailwind, keine hardcodierten Farben
- [ ] Lab-Inhalt zwischen Header und Footer einfügen
- [ ] Theme-JS, Legal-JS und Parallax-JS unverändert übernehmen
- [ ] Falls Lab-spezifische Animationszustände nötig sind (wie `.fallen`): in lab.css dokumentieren
## 8. Bestehende Labs migrieren — Checkliste
 
- [ ] CDN-Links (`tailwindcss`, `fonts.googleapis.com`) entfernen
- [ ] `<link rel="stylesheet" href="/assets/css/lab.css"/>` einfügen
- [ ] `<style>`-Block prüfen: Theme-Vars und Lab-CSS in lab.css verschieben
- [ ] Inline `style`-Attribute mit Hex-Farben → CSS Custom Properties
- [ ] Tailwind-Klassen → lab.css-Klassen (Abschnitt 3)
- [ ] Topbar ergänzen: Breadcrumb + Theme-Toggle
- [ ] LP-Link unter Seitentitel ergänzen
- [ ] Footer mit Legal-Links ergänzen
- [ ] Legal-Overlay HTML + JS einfügen (Abschnitt 2)
- [ ] Theme-JS + Parallax-JS einfügen (Abschnitt 2)
 