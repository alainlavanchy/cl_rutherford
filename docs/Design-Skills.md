# Cognivio — Design SKILL
 
**Version:** 1.1
**Gilt für:** Alle Labs, Simulationen, Animationen, Lehrpersonen-Seiten und Werkzeuge (z. B. ID/Login) der Dachmarke cognivio / cogniviolabs.com
**Quelle der Wahrheit für Werte:** `cognivio-common.v1.css`. Bei Abweichungen zwischen diesem Dokument und der CSS-Datei gilt die CSS-Datei, und dieses Dokument wird nachgezogen.
 
---
 
## Pflichtlektüre vor jedem Build
 
Wer ein Lab, eine Simulation, eine Animation oder eine Seite baut oder anpasst, liest zuerst dieses Dokument vollständig. Keine Farbe, keine Schrift und kein Abstand darf davon abweichen ohne ausdrückliche Anweisung von Alain.
 
**Lesehilfe:** Aussagen ohne Zusatz sind beschlossen. «Empfehlung» heisst: aus dem Konzept abgeleitet, noch nicht in der Praxis erprobt. «Offen» heisst: Entscheidung steht aus (siehe Abschnitt 13).
 
### Verhältnis zu den bestehenden Dateien
 
| Datei | Status |
|---|---|
| `DESIGN-dark.md` («Silent Scholar») und `DESIGN-light.md` («Precision Lexicon») | **Ersetzt.** Space Grotesk, Inter, Plus Jakarta Sans, Teal-Akzent, «No-Line»-Regel und «Glass & Gradient»-Regel gelten nicht mehr. |
| `SKILL-labs.md` | Technische Konventionen (Standalone-HTML, Vanilla JS, kein Tailwind, kein CDN, URL-Schema, Legal-Overlay, Checklisten) bleiben gültig. Abschnitt 4 (`--c-*`-Variablen) und alle Farb-, Schrift- und Gradientangaben sind durch dieses Dokument überholt. Migrationshilfe: Abschnitt 11. |
| `SKILL.md` (UI/UX-Prinzipien KompetenzSpider: Syne, DM Sans, Space Mono, Mint-Akzent) | Nicht Teil dieser Vereinbarung. Ob KompetenzSpider angepasst wird, ist offen. |
 
---
 
## 1. Leitidee: drei Ebenen
 
Die visuelle Sprache besteht aus einem ruhigen, edlen Rahmen, in den die Farbe über Grafik und Animation hineinkommt. Sie ist bewusst nicht der übliche KI-Look (Blau, Türkis, Violett, Verläufe).
 
| Ebene | Für wen | Charakter |
|---|---|---|
| **1. UI** | alle | Papier und Tinte. Fast farblos, Haarlinien statt Schatten, genau eine Signalfarbe (Zinnober) nur für Interaktion. |
| **2. Szene** | Lernende (Jugendliche) | Grafiken und Animationen tragen die Farbe. Jedes Lab hat einen Leitton. Semi-Manga-Anmutung: Tuschelinien, Rasterton, Sprechblasen, Soundwörter. Die Titelschrift ist verspielt (Patrick Hand). |
| **3. Lehrpersonen** | Lehrpersonen | Gleiche Farben und Komponenten wie Ebene 1 und 2, aber ruhige Serif-Titel und keine verspielten Elemente. |
 
**Grundsatz Verspieltheit:** Verspielt über die Form, nicht über die Menge. Pro Bildschirm ein grosser handschriftlicher Titel; weitere verspielte Elemente (Sprechblase, Soundwort) sparsam und nur mit Funktion. Jugendliche merken schnell, wenn etwas «für Jugendliche gemacht» aussieht. Die Zurückhaltung des Rahmens ist der Respekt vor der Zielgruppe. Keine Emojis als Gestaltungsmittel, keine bunten Buttons, keine Sticker-Optik.
 
**Grundsatz Farbe:** Im Interface gibt es nur eine Farbe (Signal-Zinnober), und sie bedeutet «hier kann man etwas tun». Alle übrige Farbe lebt in der Szene.
 
---
 
## 2. Technische Basis
 
### 2.1 Zentrale Ablage
 
| Element | Wert |
|---|---|
| Assets-Domain | `assets.cogniviolabs.com` |
| Gemeinsame CSS | `https://assets.cogniviolabs.com/css/cognivio-common.v1.css` |
| Schriften | `https://assets.cogniviolabs.com/fonts/*.woff2` (die `@font-face`-Regeln in der CSS verweisen absolut auf `/fonts/...`) |
| Favicons | **nicht** zentral, lokal pro Lab (Abschnitt 8). Nur das Dachmarken-Set liegt unter `https://assets.cogniviolabs.com/icons/`. |
| Tailwind | **Nicht** in Labs, Simulationen und Werkzeugen. Alles läuft über die Tokens und Klassen der gemeinsamen CSS. |
| JS | Vanilla JS, kein Framework (unverändert aus `SKILL-labs.md`) |
 
Auf der Assets-Domain gilt: Direktaufruf im Browser wird auf `cogniviolabs.com` umgeleitet, CSS und Schriften bleiben von allen Seiten ladbar; Schriften brauchen CORS-Header (`Access-Control-Allow-Origin`); CSS 1 Stunde Cache, WOFF2 ein Jahr (`immutable`); `X-Robots-Tag: noindex, nofollow`.
 
### 2.2 Versionierung
 
- Die Version steht im Dateinamen der CSS (`cognivio-common.v1.css`) und muss in der Einbindung stehen.
- **Kleine Korrekturen** (Tippfehler, Kontrast, ein neuer Helfer) werden direkt in `v1` überschrieben und gelten nach Ablauf des kurzen Caches überall.
- **Umbauten** (Tokens umbenennen, Layout ändern) kommen in eine neue Datei `cognivio-common.v2.css`. Die Projekte werden einzeln umgestellt.
- Bei einer Änderung am Dateikopf die Zeile `Version:` nachführen.
### 2.3 Seitenkopf (Vorlage)
 
```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>[Lab-Titel] | Cogniviolabs</title>
  <link rel="preconnect" href="https://assets.cogniviolabs.com" crossorigin>
  <link rel="stylesheet" href="https://assets.cogniviolabs.com/css/cognivio-common.v1.css">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</head>
<body data-lab="chemie">          <!-- Lernende -->
<body data-lab="chemie" data-audience="teacher">   <!-- Lehrpersonen-Seite -->
<body data-audience="teacher">    <!-- Seite ohne Lab, z. B. ID/Login: Standardton Zinnober -->
```
 
Es gibt drei Schalter, alle als Attribut:
 
| Attribut | Werte | Wirkung |
|---|---|---|
| `data-lab` | `elektrizitaet`, `licht`, `biologie`, `wasser`, `chemie`, `mathe` | setzt `--lab-accent` (Leitton des Labs) |
| `data-audience` | `teacher` | Ebene 3 (Serif-Titel, keine verspielten Elemente) |
| `data-theme` (am `<html>`) | `light`, `dark` | erzwingt den Modus. Ohne Attribut folgt die Seite dem System (`prefers-color-scheme`). |
 
Ein Lab trägt `data-lab`, eine Seite ohne Lab (Login, Übersicht) lässt es weg.
 
### 2.4 Schrift-Preload
 
Ein `<link rel="preload">` für eine Schriftdatei nur setzen, wenn der Dateiname exakt mit dem in der `@font-face`-Regel übereinstimmt (sonst wird die Datei doppelt oder unnötig geladen). Mit `as="font" type="font/woff2" crossorigin`.
 
---
 
## 3. Typografie
 
| Rolle | Schrift | Einsatz |
|---|---|---|
| Titel | **Patrick Hand** | h1 bis h3 (Lernende), Lab-Titel, Sprechblasen, Soundwörter |
| Fliesstext | **Source Serif 4** | Fliesstext, Titel auf Lehrpersonen-Seiten (SemiBold), Zitate, Legenden |
| UI | **Raleway** | Buttons, Labels, Navigation, Formularfelder, Tabellenköpfe, h4 bis h6 |
 
Alle drei sind SIL-Open-Font-License. Lizenztexte liegen bei den Schriften (`fonts/licenses/`).
 
### Regeln
 
- **Patrick Hand hat nur einen Schnitt (400).** Nie fett setzen (der Browser simuliert sonst Bold). Hierarchie läuft über Grösse und Farbe. `font-weight` kommt über `--title-weight`.
- **Patrick Hand erst ab Titelgrösse** (h1 bis h3, mindestens etwa 1.5 rem). Kleinere Zwischentitel (h4 bis h6) sind Raleway SemiBold. Lab-Titel gross: `--h-display` (2.5 bis 5 rem).
- **Source Serif 4:** Variable Font (normal und kursiv). Schriftgrösse ab 18 px (`--text-base`), Zeilenabstand 1.55, Zeilenlänge höchstens 68 Zeichen (`--measure`, `.prose`).
- **Raleway:** Mediävalziffern abschalten (`font-feature-settings: "lnum"`), in Tabellen zusätzlich `"tnum"`. Beides ist in der CSS gesetzt.
- **Akzente im Text** (Hervorhebungen, Zitate, Bildlegenden) mit Kursiv oder Kapitälchen (`.smallcaps`) lösen, nicht mit einer vierten Schrift.
- **Beschriftungen in Satzschreibweise**, nicht in Grossbuchstaben. Ausnahme: `h6`.
- **Schriftgrössen nur über Tokens** (`--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, `--h1` bis `--h3`, `--h-display`), keine festen px-Werte im Lab-Code.
- **Fallbacks** stehen in den Tokens (`--font-title`, `--font-body`, `--font-ui`) und werden nicht überschrieben.
### Schriften hosten
 
- Als WOFF2 selbst hosten, auf Latin zugeschnitten (deckt Deutsch, Französisch, Italienisch ab). Bezugsquelle: Fontsource-Pakete über `cdn.jsdelivr.net/npm/@fontsource-variable/...` bzw. `@fontsource/patrick-hand`.
- Google-Fonts-CDN ist verboten (DSG, Konsistenz).
- Portable Labs, die offline funktionieren müssen, führen die Schriften zusätzlich lokal mit.
---
 
## 4. Farben
 
### 4.1 Ebene 1: UI (Papier und Tinte)
 
| Token | Hell | Dunkel | Verwendung |
|---|---|---|---|
| `--color-bg` | `#f3f2ee` | `#161716` | Seitenhintergrund (Papier) |
| `--color-surface` | `#fbfaf7` | `#202221` | Karten, Eingabefelder |
| `--color-surface-2` | `#eae8e1` | `#2a2d2b` | vertiefte Flächen, Code, Callouts |
| `--color-text` | `#1d1f1e` | `#ece9e2` | Text (Tinte) |
| `--color-text-soft` | `#5b5e5c` | `#a4a6a3` | Beschriftungen, Metainfos |
| `--color-border` | `#d9d8d2` | `#343735` | Haarlinien |
| `--color-line` | `#3a3d3c` | `#ece9e2` | Tuschelinie in Grafiken |
| `--color-signal` | `#c23d22` | `#e8654a` | Zinnober, **nur Interaktion** |
| `--color-signal-hover` | `#a3321b` | `#f07d65` | Hover |
| `--color-signal-text` | `#ffffff` | `#161716` | Text auf Signalfarbe |
| `--color-success` / `-warning` / `-error` | `#4a6b3a` / `#9a6b12` / `#b3261e` | `#8fb27a` / `#d6a64a` / `#ef7b70` | Status |
 
**Regel Signalfarbe:** Zinnober wird nur für Dinge verwendet, die man bedienen kann oder die aktiv sind: Buttons, Regler, aktiver Reiter, aktive Navigation, Unterstreichung von Links, Fokusring. Nicht für Titel, Flächen oder Dekoration.
 
**Regel Links:** Links im Fliesstext sind Tinte mit Zinnober-Unterstreichung; erst beim Hover wird der Text selbst rot.
 
**Regel Fehler:** Zinnober und Fehlerrot liegen nah beieinander. Fehlermeldungen immer mit dem Wort «Fehler:» (oder Icon) und einer Ursache kennzeichnen, nie nur über die Farbe.
 
### 4.2 Ebene 2: Szene (Leittöne pro Lab)
 
| `data-lab` | Leitton | Hell | Dunkel |
|---|---|---|---|
| `elektrizitaet` | Zinnober | `#c23d22` | `#e8654a` |
| `licht` | Safran | `#e0a526` | `#e8b84a` |
| `biologie` | Matcha | `#7d9a4a` | `#9bb866` |
| `wasser` | Indigo | `#2f4a8a` | `#7f9be0` |
| `chemie` | Pflaume | `#7a3f5e` | `#c27aa0` |
| `mathe` | Lindengrün | `#5b931a` | `#84bf40` |
 
Weitere Szenen-Token: `--lab-accent` (aktueller Leitton), `--skin` (`#f0d9c3`, Hautton für Figuren).
 
Lindengrün für `mathe` ist beschlossen (freundlicher und weniger blau als das zuerst erwogene Petrolgrün). Die Werte sind eine Empfehlung und visuell in beiden Modi zu prüfen. Gemessen gegen `--color-bg`: ca. 3.3:1 (hell) und 8.1:1 (dunkel), gegen `--color-surface` ca. 3.6:1 bzw. 7.3:1. Damit erfüllt der Leitton die 3:1 für grafische Objekte (Abschnitt 4.3), im Hellmodus aber nur knapp. Lindengrün liegt farblich nahe bei Matcha (`biologie`): Matcha ist gedämpft und heller, Lindengrün klarer und kräftiger. Als Fliesstextfarbe bleibt er tabu.
 
**Datenfarben** für Diagramme und KompetenzSpider, in dieser Reihenfolge verwenden:
 
| Token | Hell | Name |
|---|---|---|
| `--data-1` | `#c23d22` | Zinnober |
| `--data-2` | `#c9922e` | Safran/Ocker |
| `--data-3` | `#6b7a3a` | Olive |
| `--data-4` | `#6a3d5c` | Pflaume |
| `--data-5` | `#4a5560` | Schiefer |
 
(Dunkel-Varianten für `--data-2` bis `--data-5` stehen in der CSS.)
 
### 4.3 Kontrast- und Zugänglichkeitsregeln
 
- **Leittöne sind Grafik, nie Fliesstext.** Auf Papier erreichen Safran (ca. 2:1) und Matcha (ca. 2.8:1) die geforderten 3:1 für grafische Objekte nicht, auch Safran/Ocker aus den Datenfarben nicht (ca. 2.5:1). Empfehlung: solche Flächen immer mit einer Tuschelinie (`--color-line`, 2 px) umranden und nie als einziges Unterscheidungsmerkmal verwenden.
- **Nie nur über Farbe unterscheiden.** Zu jeder Farbkodierung gehört eine zweite Information (Form, Beschriftung, Muster, Rasterton).
- Fliesstext erreicht mindestens 4.5:1 (mit den Tokens eingehalten).
- Der Dunkelmodus wird nur durch Überschreiben der Tokens erzeugt, nie durch eigene Farben im Lab.
- **Nie hardcodierte Farben** (kein Hex, kein `rgb()`) im Lab-HTML, Lab-CSS oder JS. Immer `var(--...)`.
---
 
## 5. Form und Komponenten
 
### 5.1 Form
 
- **Haarlinien statt Schatten.** Trennung durch 1 px `--color-border`. `--shadow-sm` ist `none`; `--shadow-md` nur für Overlays.
- **Keine Verläufe als Dekoration.** Einzige Ausnahme: der Textmarker-Strich in `.lab-title mark` (harte Kante, kein weicher Verlauf).
- Radien: `--radius-sm` (4), `--radius-md` (8), `--radius-lg` (12), `--radius-pill` (Buttons).
- Abstände nur aus dem 8-px-Raster (`--space-1` bis `--space-8`).
- Viel Weissraum; Beschriftungen klein und ruhig, der Titel gross.
### 5.2 Klassen der gemeinsamen CSS
 
| Klasse | Verwendung |
|---|---|
| `.container`, `.stack`, `.grid`, `.prose`, `.visually-hidden` | Layout |
| `.btn`, `.btn--secondary` | Buttons (primär: Zinnober, rund; sekundär: Tinte, nur Linie) |
| `.card`, `.callout` (+ `--success`, `--warning`, `--error`) | Karten, Hinweisboxen (Balken in `--lab-accent`) |
| `.badge`, `.meta`, `.ui-label`, `.caption`, `.smallcaps`, `.hairline` | Kleinteile, Beschriftungen |
| `.nav` | Navigation (aktiv: Zinnober, `aria-current="page"`) |
| `.scene` | Rahmen für Canvas, SVG, Animation |
| `.screentone` | Rasterton (Manga-Punkte) in `--lab-accent` |
| `.lab-title` (+ `mark`) | grosser, leicht schräger Lab-Titel mit Textmarker-Strich |
| `.bubble` | Sprechblase |
| `.sfx` | Soundwort |
 
Neue wiederverwendbare Klassen kommen in die gemeinsame CSS (und in diese Tabelle), nicht in einzelne Seiten. Seitenspezifisches Layout (z. B. Reiter, Bühne) darf in einem kleinen `<style>` der Seite stehen und verwendet ausschliesslich Tokens.
 
### 5.3 Formulare und Bedienelemente
 
- Eingabefelder (Text, E-Mail, Passwort, Zahl, Suche, Tel, URL), Auswahl und Textfeld sind in der CSS gestylt: Haarlinie, Fokus in Zinnober.
- Regler: `accent-color` Zinnober.
- Labels mit `for`, Reiter mit `role="tablist"` und `aria-selected`, sichtbarer Tastaturfokus.
---
 
## 6. Szene: Grafik, Simulation, Animation
 
Hier kommt die Farbe herein. Die Szene soll sich anfühlen wie eine Manga-Seite im Notizbuch: Tusche auf Papier, ein Leitton, Rasterpunkte statt Verläufen.
 
### 6.1 Bildsprache
 
- **Tuschelinie:** Umrisse von Objekten und Figuren in `--color-line`, 2 px. Achsen, Raster und Hilfslinien als Haarlinie, 1 px `--color-border`.
- **Fläche:** Das zentrale Objekt (Elektron, Strahl, Zelle, Wasserstrahl, Molekül) in `--lab-accent`. Nebenobjekte in Tinte oder `--color-surface-2`.
- **Rasterton statt Verlauf:** Schattierung und Tiefe über `.screentone` oder SVG-/Canvas-Punktmuster in `--lab-accent`. Keine weichen Farbverläufe, kein Glow, keine Glasoptik.
- **Figuren:** Hautton `--skin`, Linie `--color-line`.
- **Sprechblase** (`.bubble`) für kurze Hinweise oder Gedanken einer Figur, **Soundwort** (`.sfx`) für ein einzelnes Ereignis («ZACK!», «BZZZT!»). Beide mit Patrick Hand. Höchstens eines von beiden pro Szene.
- **Mehrere Datenreihen:** `--data-1` bis `--data-5` in fester Reihenfolge, zusätzlich Beschriftung oder Linienart.
### 6.2 Simulationen und Canvas/SVG
 
- **Farben nie als Hex im Code.** In SVG über `fill="var(--lab-accent)"` oder Klassen. In Canvas die Werte aus dem Element lesen, das `data-lab` trägt (meist `<body>`, nicht `documentElement`), und nach einem Theme-Wechsel neu einlesen:
```js
function palette() {
  const s = getComputedStyle(document.body);       // Element mit data-lab
  const c = n => s.getPropertyValue(n).trim();
  return {
    accent: c('--lab-accent'),
    line:   c('--color-line'),
    border: c('--color-border'),
    text:   c('--color-text'),
    surface: c('--color-surface'),
    skin:   c('--skin'),
  };
}
```
 
- **Schrift in Canvas:** `Patrick Hand` für Beschriftungen in der Szene, `Raleway` für Zahlen und Achsenwerte (mit normalen Ziffern). Vor dem Zeichnen sicherstellen, dass die Schrift geladen ist (`await document.fonts.load('20px "Patrick Hand"')`), sonst erscheint die Fallback-Schrift. Schriftgrössen in Canvas in px angeben.
- **Steuerelemente** (Regler, Buttons, Schalter) bleiben im UI-Stil von Ebene 1 (Zinnober nur für Bedienbares), auch wenn die Szene daneben farbig ist.
- **Messwerte und Tabellen** im UI-Stil mit Raleway, normale und tabellarische Ziffern.
### 6.3 Animation und Bewegung
 
- Bewegung hat einen Zweck: sie zeigt, was sich durch eine Handlung der Lernenden verändert (Regler gezogen, Experiment gestartet). Dekorative Bewegung ohne Auslöser sparsam, höchstens ein markanter Moment pro Lab.
- Keine Einblend-Effekte an jedem Abschnitt, keine Hover-Spielereien an jeder Karte.
- **`prefers-reduced-motion` respektieren.** Die gemeinsame CSS schaltet Übergänge, Animationen und die Schräglage ab. JS-Animationen (`requestAnimationFrame`, Simulationsschleifen) prüfen `matchMedia('(prefers-reduced-motion: reduce)')` und zeigen dann den Endzustand oder einen Schritt-für-Schritt-Modus.
- Das Titelmotiv (`.lab-title`) darf leicht schräg stehen (`rotate(-1.5deg)`), `.sfx` etwas stärker (`-4deg`). Mehr nicht.
 
### 6.4 Szene Mathematik: Zahlen, Vorzeichen, Koordinatensystem (Empfehlung)

Gilt für `data-lab="mathe"`. Aus dem Konzept abgeleitet, noch nicht in der Praxis erprobt.

- **SVG statt Canvas.** Zahlenstrahl, Koordinatensystem und Figur werden als SVG gebaut. Farben stehen als `var(--...)` direkt in `fill` und `stroke`, ein Theme-Wechsel braucht kein Neuzeichnen (anders als bei Canvas, Abschnitt 6.2). Texte in SVG über Klassen mit den Schriftgrössen-Tokens.
- **Positiv und negativ ohne zweite Farbe.** Der Leitton ist die einzige Szenenfarbe. Der Unterschied läuft über die Form: positiv = gefüllte Fläche in `--lab-accent` mit Tuschelinie, negativ = Umriss mit Rasterton auf `--color-surface`. Dazu immer die Zahl mit Vorzeichen als Beschriftung und die Richtung als Pfeilspitze (rechts und oben positiv, links und unten negativ). Zinnober und Statusfarben bedeuten nie ein Vorzeichen.
- **Rasterton in SVG:** Ein `<pattern>` mit Punkten in `--lab-accent` (`.screentone` gilt nur für HTML-Flächen):

```html
<defs>
  <pattern id="raster-neg" width="8" height="8" patternUnits="userSpaceOnUse">
    <circle cx="4" cy="4" r="1.3" fill="var(--lab-accent)"/>
  </pattern>
</defs>
<rect class="neg-bg" fill="var(--color-surface)" stroke="var(--color-line)" stroke-width="2"/>
<rect class="neg-raster" fill="url(#raster-neg)"/>
```

- **Minuszeichen.** In Zahlen und Aufgaben immer das echte Minus U+2212, nie Bindestrich oder Gedankenstrich. Zahlen in Raleway mit `lnum` und in Tabellen `tnum`. Vor dem Bau prüfen, dass jede der drei Schriftdateien das Zeichen U+2212 enthält, sonst erscheint ein Ersatzzeichen aus einer anderen Schrift (Abschnitt 13).
- **Achsen.** Im Koordinatensystem sind die beiden Achsen (x = 0 und y = 0) Tuschelinien, 2 px `--color-line`. Das ist eine Ausnahme von Abschnitt 6.1, weil die Achsen das Vorzeichen definieren. Raster als Haarlinie (1 px `--color-border`). Achsenwerte in Raleway, Achsenbezeichnungen x und y in Raleway (nicht kursiv). Quadrantennummern ruhig in `--color-text-soft`.
- **Figur.** Abstrakt gehalten: Hautton `--skin`, Tuschelinie. Die Blickrichtung wechselt durch Spiegeln, nicht durch Drehen.
- **Rückmeldung.** Falsch: `.callout--error` mit `role="alert"`, «Fehler:» plus Ursache, der Hinweis im selben Callout. Richtig: `.callout--success` mit `role="status"`. Eine Sprechblase höchstens im Modus Entdecken für den Beobachtungsimpuls, nicht für Rückmeldungen (Abschnitt 6.1: höchstens eine Sprechblase oder ein Soundwort pro Szene).
- **Zahleneingabe auf Touch-Geräten.** Die Zahlentastaturen (`inputmode="numeric"` und `"decimal"`) haben auf iOS keine Minus-Taste. Deshalb Vorzeichen-Schalter (`.btn--secondary`, Beschriftung «+» und «−», `aria-pressed`) plus Feld für den Betrag. Das trennt zugleich Vorzeichen und Betrag, wie es die Didaktik verlangt.
- **Bedienelemente.** Touch-Ziele mindestens 44 × 44 px. Die Figur auf dem Zahlenstrahl und der Punkt im Koordinatensystem sind per Tastatur bedienbar (Pfeiltasten, Enter bestätigt), mit `role="slider"` samt `aria-valuemin`, `aria-valuemax`, `aria-valuenow`. Screenreader lesen U+2212 nicht zuverlässig als «minus»: `aria-valuetext` und `aria-label` schreiben das Wort aus («minus drei»).
- **Reiter und Modus-Umschalter.** Reiter mit `role="tablist"` (Abschnitt 5.3), Modus-Umschalter als Gruppe von `.btn--secondary` mit `role="radiogroup"`. Das Layout steht vorerst im `<style>` der Seite (Abschnitt 5.2).
---
 
## 7. Ebene 3: Lehrpersonen
 
Schalter: `data-audience="teacher"` (kombinierbar mit `data-lab`).
 
| | Lernende (Ebene 2) | Lehrpersonen (Ebene 3) |
|---|---|---|
| Titelschrift | Patrick Hand | Source Serif 4, SemiBold (`--title-weight: 600`) |
| Titelgrössen | `--h1` bis `--h3` gross, `.lab-title` schräg | etwas kleiner, `.lab-title` gerade, Marker wird 2-px-Unterstreichung |
| Rasterton, Soundwörter | ja | aus |
| Sprechblasen | ja | vermeiden (erscheinen sonst in Serif); stattdessen `.callout` |
| Farben, Linien, Buttons, Navigation | gleich | gleich |
| Leitton | `--lab-accent` | `--lab-accent`, aber nur in Details (Callout-Balken, Unterstreichung, Datenfarben) |
 
Die Lab-Farbe bleibt bewusst erhalten: Wer als Lehrperson ins Lab wechselt, soll dasselbe Zinnober, Pflaume usw. sehen wie die Klasse.
 
**Empfehlung für spätere Bausteine** (erst bauen, wenn die ersten Materialseiten stehen): Box für Lernziele und LP21-Bezug, Box für Differenzierung, Badge für Zeitangaben («45 Min.»), Druckstil für Arbeitsblätter ohne Hintergrundfarben. Vieles davon lässt sich mit `.callout` und `.badge` abdecken.
 
---
 
## 8. Favicons
 
- **Lokal pro Lab**, nicht zentral. Das Icon gehört zum Lab und ändert sich nur mit ihm.
- Pro Lab: `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` (180 × 180), eingebunden wie in Abschnitt 2.3. SVG zuerst, PNG als Fallback.
- Eigene Domain oder Subdomain: zusätzlich `favicon.ico` im Stammverzeichnis. Liegen Labs als Unterordner auf derselben Domain, braucht jede Seite die `<link>`-Angabe mit Pfad.
- Gleiche Vorlage für alle (gleiche Form, nur der Leitton wechselt). Die Dachmarke hat ein eigenes Icon für Login und Seiten ohne Lab. Es liegt zentral unter `https://assets.cogniviolabs.com/icons/` (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-512.png`).
- Browser cachen Favicons sehr lange: bei Änderung einen Parameter anhängen (`/favicon.svg?v=2`).
- Offen: die SVG-Vorlage selbst (Abschnitt 13).
---
 
## 9. Texte
 
- Satzschreibweise, einfache Verben, keine Floskeln.
- Aktionen benennen, was passiert («Magic Link senden», «Anmelden»), und behalten denselben Namen im ganzen Ablauf.
- Fehlermeldungen: «Fehler:» plus Ursache, ohne Entschuldigung, ohne Vagheit. Keine `alert()`-Dialoge, sondern eine Meldung im Layout (`.callout--error`, `role="alert"`).
- Erfolgsmeldungen als `.callout--success` mit `role="status"`.
---
 
## 10. Verboten
 
- Tailwind-Klassen und das Tailwind-CDN-Script in Labs und Werkzeugen
- Google-Fonts-CDN und jedes andere Schrift-CDN
- Hardcodierte Farben (Hex, `rgb()`, `hsl()`) in HTML, CSS und JS ausserhalb der Token-Definition
- Blau, Türkis, Violett als Akzent und jede Form von Farbverlauf-Dekoration
- Schatten zur Gliederung (ausser `--shadow-md` bei Overlays)
- Patrick Hand fett, in kleiner Schrift oder im Fliesstext
- Emojis als Gestaltungsmittel
- Zinnober für Nicht-Interaktives
- Farbe als einziges Unterscheidungsmerkmal
- Mehrere verspielte Elemente (Sprechblase, Soundwort, schräger Titel) nebeneinander
- Verspielte Elemente auf Lehrpersonen-Seiten
- Animation ohne Reaktion auf `prefers-reduced-motion`
---
 
## 11. Bestehende Labs migrieren
 
### 11.1 Zuordnung der alten `--c-*`-Variablen (Vorschlag, bei der Migration prüfen)
 
| Alt | Neu |
|---|---|
| `--c-bg` | `--color-bg` |
| `--c-surf-lo`, `--c-surf-hi`, `--c-overlay-card` | `--color-surface` |
| `--c-surf-rec`, `--c-surf`, `--c-tbl-head-bg`, `--c-explain-bg` | `--color-surface-2` |
| `--c-text` | `--color-text` |
| `--c-muted`, `--c-faint` | `--color-text-soft` |
| `--c-sep`, `--c-sep-line`, `--c-row-sep` | `--color-border` |
| `--c-teal` | Bedienbares: `--color-signal`; Grafik: `--lab-accent` |
| `--c-teal-dim` | `color-mix(in srgb, var(--color-signal) 30%, transparent)` |
| `--c-green`, `--c-red`, `--c-warn` | `--color-success`, `--color-error`, `--color-warning` |
| `--c-btn-reset`, `--c-btn-txt` | `.btn--secondary` |
| `--c-accent-line` | `--lab-accent` |
| `--c-topbar-bg` | `--color-bg` |
| `--c-ribbon`, `--c-footer-acc` | `--lab-accent` |
| `--c-domino-a/-b`, `--c-straw-a/-b` | Fläche `--lab-accent` bzw. `--color-surface-2`, Umriss `--color-line`, **ohne Verlauf** |
| `--c-status-idle` | `--color-text-soft` |
| `--c-overlay-bg` | offen (kein Token vorhanden) |
| `--c-glow-inner/-outer`, `--c-dist-hint`, `--c-info-tag` | entfallen bzw. offen (Abschnitt 13) |
 
### 11.2 Checkliste je Lab
 
- [ ] Schrift-CDN und Tailwind entfernen (falls noch vorhanden)
- [ ] `cognivio-common.v1.css` einbinden, `data-lab` am `<body>` setzen (Leitton gemäss Abschnitt 4.2)
- [ ] Lab-spezifische Klassen auf Tokens umstellen (Tabelle oben), Hex-Farben entfernen
- [ ] Verläufe (Domino, Stäbchen, Primärbutton, Titel-Linie) durch Flächen, Tuschelinien oder Rasterton ersetzen
- [ ] Emojis (☀️, 🎓) durch Text oder eine ruhige Alternative ersetzen
- [ ] Titel auf Patrick Hand (Lernende) bzw. Serif (Lehrpersonen-Seite) umstellen
- [ ] Canvas/SVG: Farben aus den Tokens lesen (Abschnitt 6.2)
- [ ] Fokus, Kontrast und `prefers-reduced-motion` prüfen
- [ ] Favicon-Set lokal ergänzen (Abschnitt 8)
---
 
## 12. Neue Seite oder neues Lab bauen
 
- [ ] Seitenkopf aus Abschnitt 2.3 übernehmen, `data-lab` (falls Lab) und `data-audience` (falls Lehrpersonen-Seite) setzen
- [ ] Nur Klassen aus Abschnitt 5.2 und Tokens verwenden; Neues zuerst in die gemeinsame CSS
- [ ] Pro Bildschirm höchstens ein grosser, verspielter Titel; Verspieltheit sonst nur in der Szene
- [ ] Zinnober nur für Bedienbares
- [ ] Szene gemäss Abschnitt 6 (Tuschelinie, Leitton, Rasterton, keine Verläufe)
- [ ] Zweite Information zu jeder Farbkodierung
- [ ] Hell und Dunkel testen, Tastaturbedienung testen
- [ ] In den Entwicklertools (Netzwerk, Filter «Font») prüfen, dass alle Schriften mit Status 200 laden
**Referenzimplementierung:** `index.html` (ID/Login): Tailwind entfernt, Tokens und Klassen der gemeinsamen CSS, seitenspezifisches Layout in einem kleinen `<style>`, `data-audience="teacher"` ohne `data-lab`.
 
---
 
## 13. Offene Punkte
 
| Thema | Stand |
|---|---|
| **Schriftdateien:** Die Dateien liegen vollständig als `.woff2` vor (Stand 20.10.2026). In `cognivio-common.v1.css` (Version 1.1) sind korrigiert: Patrick Hand verwies auf `patrick-hand-v25-latin-regular.woff2`, die Datei heisst aber `patrick-hand-v25-latin_latin-ext-regular.woff2`. Raleway (normal) verwies auf die Kursiv-Datei und zeigt jetzt auf `raleway-latin-wght-normal.woff2`, die Kursiv-Variante ist ergänzt. Source Serif 4 war bereits in Ordnung. Die korrigierte CSS muss noch auf `assets.cogniviolabs.com` hochgeladen werden. Danach Prüfung über die Entwicklertools (alle Schriften Status 200, Beschriftungen nicht schräg). **Vor dem Mathe-Lab:** Zahlen und Achsenwerte laufen in Raleway. | Offen bis zum Upload |
| **Leitton für Physik (ausserhalb Elektrizität und Licht) und Natur & Technik:** Die Leittöne decken die URL-Fächer (`bio`, `physik`, `chemie`, `mathe`, `nt`) nicht 1:1 ab. Zuordnung `data-lab` zu Fach und ein Leitton für Physik/NT fehlen. Mathe ist erledigt: `data-lab="mathe"`, Lindengrün (Abschnitt 4.2). | Offen (ohne Mathe) |
| **Standard-Modus:** Alte Labs starteten dunkel (`cogniTheme`, Standard `dark`), die neue CSS folgt dem System. | Offen |
| **Parallax-Maus-Gradient** (`.mouse-gradient`) und **Glas-Overlay** (`.glass-overlay`) aus `SKILL-labs.md` widersprechen «keine Verläufe, kein Glow». Entscheid steht aus, ob sie entfallen oder umgebaut werden. | Offen |
| **Verhältnis `lab.css` zu `cognivio-common.v1.css`:** Vorschlag ist, dass die gemeinsame CSS die Basis ist und `lab.css` nur noch labspezifische Klassen enthält, auf Tokens umgestellt. Nicht entschieden. Empfehlung für das Mathe-Lab: keine `lab.css`, nur ein kleines `<style>` der Seite (Abschnitt 5.2). | Offen |
| **Favicons:** Beschlossen: Lab-Favicons liegen lokal pro Lab (Abschnitt 8). Unter `https://assets.cogniviolabs.com/icons/` liegt das Dachmarken-Set. Zu prüfen: Im Ordner `icons` liegt keine `.htaccess` (bei `fonts` schon), und die Weiterleitung der Assets-Domain darf Icon-Anfragen nicht erfassen. Offen: die SVG-Vorlage mit Leitton als Variable und das Mathe-Icon. | Offen, kann erstellt werden |
| **KompetenzSpider** und **Wissensspider**: Anpassung an dieses System | Offen |
| **Druckstil Arbeitsblätter** (Lehrpersonen) | Empfehlung, noch nicht gebaut |
| **Lindengrün und Matcha:** `mathe` (Lindengrün, Farbton ca. 88°) und `biologie` (Matcha, ca. 82°) sind beide Gelbgrün. Die Trennung läuft über Sättigung und Helligkeit. Stehen beide Labs in einer Übersicht nebeneinander, wirkt der Abstand kleiner als bei den übrigen Leittönen. | Offen, beim ersten Mathe-Lab visuell prüfen |
| **Glyph U+2212 (Minus)** in Raleway, Patrick Hand und Source Serif 4 (Latin-Teilmenge) | Offen, Prüfung beim Mathe-Lab (Entwicklertools, Schriftanzeige) |
| **Reiter und Modus-Umschalter** (`.tabs`, `.segmented`): Vorerst im `<style>` des Mathe-Labs, bei der zweiten Verwendung in die gemeinsame CSS und in Abschnitt 5.2 aufnehmen | Empfehlung |
| **Safran-Lab (Licht):** Kontrast der Leitfarbe auf Papier ist niedrig (Abschnitt 4.3); ob ein dunklerer Safran-Ton nötig ist, wird beim ersten Lab geprüft. | Offen |
 
---
 
## Änderungsprotokoll
 
| Version | Inhalt |
|---|---|
| 1.0 | Erstfassung: drei Ebenen, Schriften (Patrick Hand, Source Serif 4, Raleway), Farbkonzept «Papier und Tinte» mit Zinnober als Signalfarbe, Leittöne pro Lab, Szenenregeln, Ebene 3 Lehrpersonen, zentrale Assets-Domain, Favicons lokal |
| 1.1 | Leitton Lindengrün für `data-lab="mathe"` (4.2, 2.3), neuer Abschnitt 6.4 Szene Mathematik (Empfehlung), Abschnitt 13 aktualisiert (Mathe-Leitton erledigt, zwei neue Punkte, Bezug zum Mathe-Lab bei Schriftdateien, `lab.css` und Favicon), Favicons lokal pro Lab bestätigt, Dachmarken-Set unter `/icons/` |
 
