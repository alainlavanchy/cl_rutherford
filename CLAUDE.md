# Rutherford-Lab (Goldfolienversuch)

Interaktives Lab im Atompaket von Cogniviolabs (Sek I, obere Stufen). α-Teilchen fliegen durch eine dünne Folie; die Lernenden vergleichen Thomson-Modell und Kernmodell. URL: `cogniviolabs.com/lab/chemie/rutherford/`, `data-lab="chemie"` (Pflaume).

## Quellen, in dieser Reihenfolge

1. `docs/rutherford-lab-minispec.md`: Spezifikation, Quelle der Wahrheit für Inhalt und Zahlen. Nicht ändern, Änderungsbedarf in `PROJECT-STATUS.md` melden.
2. `docs/referenz/demo-rutherford-goldfolie.html`: Referenzdemo. Massstab für Verhalten, Physik, Texte und Didaktik, nicht für Farben, CSS, Schriften und Kopf.
3. `docs/Design-Skills.md`: Optik. Bei Widerspruch zu `docs/SKILL-labs.md` gilt Design-Skills.md.
4. `docs/SKILL-labs.md`: Technik und Dateikonventionen.
5. `prompts/01-rutherford-lab.md`: Auftrag mit Schritten und Testwerten.

Bei Widersprüchen: nennen und nachfragen, nicht still lösen.

## Festlegungen (2026-11-05)

- Leitton `chemie`, URL-Fach `chemie`, Breadcrumb «Chemie».
- Neue Klassen vorerst in `assets/lab.css` (nur Tokens), als Änderungsbedarf für die Basis-CSS melden.
- Kein Maus-Gradient, kein Glas-Overlay, kein Fortschrittsband. Legal-Overlay bleibt, lädt `/data/legal.json` nur beim Klick.
- Diagramm: Kernmodell `--lab-accent` durchgezogen, Thomson `--data-5` gestrichelt, beide beschriftet. Kein `--data-1` (Zinnober) in der Szene.
- Schätzwerte der Physik (Kernradius, α-Radius, Thomson-Radius, Thomson-Gesamtstreuung) unverändert aus der Demo; nicht selbst ändern.

## Technik

- Vanilla JS, kein Build, kein Framework, keine npm-Abhängigkeiten. Einzige Fremdquelle: Basis-CSS `https://assets.cogniviolabs.com/css/cognivio-common.v1.css` und Schriften unter `https://assets.cogniviolabs.com/fonts/`. Basis-CSS nicht ändern, nicht kopieren.
- Läuft per Doppelklick (`file://`): klassische Skripte mit IIFE-Export (Browser: Global, Node: `module.exports`).
- `src/config.js`: Betriebsart (`BETRIEB`), einzige Stelle. `src/core/`: Physik und Logik ohne DOM, getestet mit `node --test`. `src/ui/`: Oberfläche und Zeichnen.
- Funktionsnamen des Kerns wie in der Demo (`lupeGeom`, `trajectory`, `thomsonTrajectory`, `billard`, `p90`, `run`, `newStats`, `median`).
- Keine Persistenz (kein `localStorage`), keine Netzwerkaufrufe im Lab selbst.

## Design und Bedienung

- Nur Tokens, keine Hex-, `rgb()`- oder `hsl()`-Werte (Test `tests/no-hex.test.js`). Zinnober nur für Bedienbares.
- Szene in `--lab-accent`, Tusche `--color-line`, Hilfslinien `--color-border`. Jede Farbe mit zweiter Information.
- Canvas: Palette von `document.body` lesen, nach Theme-Wechsel neu. Patrick Hand für Szenenbeschriftung, Raleway für Zahlen. `devicePixelRatio` beachten.
- Touch-Ziele mindestens 44 px, alles per Tastatur, `aria-pressed` für Schalter, `role="status"` für Ergebnis, `prefers-reduced-motion`, Hell und Dunkel.
- UI-Texte Deutsch, Schweizer Schreibweise (ss, «»), keine Emojis. Code-Bezeichner Englisch, Kommentare Deutsch.

## Arbeitsweise

- Schritte aus dem Auftrag einzeln; nach jedem Schritt Tests, Commit, Status nach `prompts/status-update.md`, dann auf Rückmeldung warten.
- Kleine Commits im Conventional-Commits-Format (`feat:`, `fix:`, `test:`, `docs:`).
- Keine Zahl und keinen Text erfinden. Bei Unklarheit fragen.

## Nicht in diesem Repo

Klassencode, Auswertung der Vorhersagen, serverseitige Lizenzprüfung, Lehrpersonen-Seite, Arbeitsblätter, Zoomstufen unterhalb der Lupe, Bohr-Lab.
