# Projektstatus: Rutherford-Lab (Goldfolienversuch)

Wird nach jeder Sitzung aktualisiert (Anleitung: `prompts/status-update.md`). Festgehalten wird nur, was belegt ist: ein Commit, ein Test oder ein Entscheid.

| | |
| --- | --- |
| Stand | 2026-11-06 |
| Spezifikation | `docs/rutherford-lab-minispec.md` (Entwurf) |
| Auftrag | `prompts/01-rutherford-lab.md` |
| Letzter erfasster Commit | c5d82ff |
| Aktueller Fokus | Auftrag abgeschlossen: alle sechs Schritte gebaut, geprüft und gepusht |
| Nächster Schritt | Offene Punkte mit Alain: Favicon (O-18), Basis-CSS (O-04, O-16, O-19), Handy/Tablet und `file://` (O-05), Firefox/Safari (O-06), echte Bewegungs-Einstellung und Screenreader (O-20), Übersichts- und Lehrpersonen-Seite (O-21) |

## Bauplan (Auftrag, Abschnitt 9)

- [x] 1. Plan (bestätigt 2026-11-05)
- [x] 2. Kern und Tests, ohne Oberfläche
- [x] 3. Hauptansicht
- [x] 4. Lupe
- [x] 5. Betriebsart und Lizenz
- [x] 6. Design-Abnahme (Design-Skills 12) und Barrierefreiheit

## Tests (Auftrag, Abschnitt 5)

| Nr. | Prüfung | Status | Nachweis |
| --- | --- | --- | --- |
| 1 | p90 Gold 1,2 µm 7,7 MeV = 4,86·10⁻⁵ (1 : 20 595); 4 Mio. Teilchen innerhalb 3 σ | erfüllt | `tests/core.test.js` (fc12b4f); Seed 1911: 194 gezählt, 194,4 erwartet |
| 2 | Bahnen gegen Rutherford-Formel, b/d 0 bis 3; Al frontal berührt | erfüllt | `tests/lupe.test.js` (fc12b4f); grösste Abweichung θ 0,0034°, r_min 0,0504 % bei b = 0 |
| 3 | Thomson-Atom: R 128 pm, s 0,0132°, Faktor 2000 / 10 000, Bahn aussen auf 5 % | erfüllt | `tests/lupe.test.js` (fc12b4f); gemessen 0,8 % (b = R) bis 3,0 % (b = 2R) |
| 4 | Thomson-Modell: 4 Mio. Teilchen, keines über 20° | erfüllt | `tests/core.test.js` (fc12b4f) |
| 5 | Median wächst mit Dicke und Z, sinkt mit Energie; Werte auf 15 % | erfüllt | `tests/core.test.js` (fc12b4f) |
| 6 | Gleichmässiger Strom: 200/s bei 60 fps etwa 240 in jedem Bild | erfüllt | `tests/stream.test.js` (fc12b4f); Spanne 236 bis 244 |
| 7 | Messreihe: acht Werte, Durchschnitt 233 | erfüllt | `tests/messreihe.test.js` (fc12b4f); Tabelle vom Original bestätigt (O-01) |
| 8 | Lizenzbetrieb: neun Fälle | erfüllt | Logik `tests/license.test.js` (fc12b4f); Oberfläche `tests/browser/betrieb-ui.js` im Browser, 9 von 9 (1d98d2b) |

## Abnahme (Design-Skills 12, Auftrag §7), Stand 2026-11-06

| Punkt | Ergebnis | Nachweis |
| --- | --- | --- |
| Seitenkopf nach 2.3, `data-lab="chemie"` | erfüllt, ausser Favicon (O-18) | `index.html` |
| Nur Tokens und Klassen der Basis-CSS; Neues in `assets/lab.css` | erfüllt; einziger Farbwert `--lab-flash` im Token-Block | `tests/no-hex.test.js` |
| Ein grosser verspielter Titel | erfüllt (`.lab-title`); Patrick Hand sonst nur in der Szene | Sichtprüfung |
| Zinnober nur für Bedienbares | erfüllt (Knöpfe, Regler, Links, Fokus) | Sichtprüfung, Code |
| Szene ohne Verläufe, Tusche, Leitton | erfüllt | Sichtprüfung |
| Zweite Information zu jeder Farbe | erfüllt: Diagramm Linienart und Name, starke Ablenkung grösser mit Tuschelinie, markierte Bahn dicker mit Pfeil, Sperre mit Schloss, Text und gestricheltem Rand, gedrückt = gefüllt | Sichtprüfung |
| Hell und Dunkel | erfüllt, nur über Tokens | Browser |
| Tastatur, sichtbarer Fokus | erfüllt; Fokusring verstärkt (Lücke plus voller Ring) | Browser, Tab-Taste |
| Schriften Status 200, keine fremden Anfragen | erfüllt (3 Schriften, nur assets.cogniviolabs.com) | Netzwerk-Tab |
| Touch-Ziele 44 px | erfüllt für Knöpfe, Regler, Aufklapper, Fusslinks; Textlinks im Fliesstext 17 px (WCAG 2.5.8 nimmt sie aus) | `tests/browser/a11y.js` |
| `aria-pressed`, Canvas-Text, `role="status"` | erfüllt; Ansage ruht im Lauf, kommt bei Pause | `tests/browser/a11y.js` |
| `prefers-reduced-motion` | erfüllt (simuliert): keine Flüge, kein Verglimmen, Lupe ohne Strahl und Bahnwechsel, Endzustand, Einzelschritte | `tests/browser/a11y.js` |

## Offene Punkte

| Nr. | Punkt | Quelle | Seit | Stand |
| --- | --- | --- | --- | --- |
| O-01 | Messreihe: Spalte z / A^(3/2) passt bei Zinn (gerechnet 262, Tabelle 226), Kupfer (283 / 225) und Eisen (243 / 250) nicht zu z und A. Übrige fünf auf ±1. Im Original (Rutherford 1911) prüfen. Test hält die drei Abweichungen fest | Sitzung 1 | 2026-11-05 | erledigt 2026-11-05: Alain hat die Tabelle mit dem Original verglichen, sie ist so richtig (Abweichungen stehen im Original) |
| O-02 | Toleranz r_min: Spezifikation §6 nennt 0,05 %, gemessen 0,0504 % bei b = 0. Test mit 0,1 % nach Auftrag §5.2 | Sitzung 1 | 2026-11-05 | erledigt 2026-11-05: 0,1 % bestätigt (Alain); Spezifikation angleichen |
| O-03 | Seed: Die Demo nennt 210 Treffer über 90° bei 4 Mio.; der Kern mit Seed 1911 in einem Lauf ergibt 194. Beides innerhalb 3 σ (194 ± 14); die 210 entstanden vermutlich durch den Ablauf in Stücken in der Demo | Sitzung 1 | 2026-11-05 | zur Kenntnis |
| O-04 | Basis-CSS: neue Klassen (Lupen-Knopf, Schloss, Topbar, Footer, Legal) vorerst in `assets/lab.css` | Plan | 2026-11-05 | offen, Änderungsbedarf Basis-CSS |
| O-05 | `file://` und Tablet prüfen (Browser-Erweiterung öffnet keine Datei-URLs) | Plan | 2026-11-05 | offen (Alain) |
| O-06 | Normale Ziffern im Canvas: Chrome übernimmt `font-feature-settings: "lnum"` vom Canvas-Element (gemessen: «3» ohne Unterlänge). Firefox und Safari ungeprüft | Sitzung 2 | 2026-11-05 | offen (Alain: in Firefox/Safari ansehen) |
| O-07 | Schmale Ansicht nur simuliert (Seitenbreite per Skript auf 358 px), weil sich das Browserfenster nicht verkleinern liess; echte Handy-Ansicht ungeprüft | Sitzung 2 | 2026-11-05 | teilweise: Alain hat das verkleinerte Fenster geprüft (funktioniert); Handy und Tablet offen |
| O-08 | Hinweistext «Flugbahn»: Demo sagt «Die roten Linien», im Lab «Die Linien mit Ring am Schirm» (kein Rot mehr in der Szene) | Sitzung 2 | 2026-11-05 | erledigt 2026-11-05: bestätigt; nach Wegfall der Ringe «Die Linien zu den grossen Punkten am Schirm» (b20002d) |
| O-09 | Fuss nennt «Anregung: PhET «Rutherford Scattering» (CC BY). Eigene Umsetzung ohne übernommenen Code.» nach Spezifikation; rechtliche Prüfung offen | Sitzung 2 | 2026-11-05 | offen (Alain) |
| O-10 | Legal-Overlay lädt `/data/legal.json` (Wurzel der Domain, nach SKILL-labs); lokal und unter `file://` erscheint die Fehlermeldung | Sitzung 2 | 2026-11-05 | zur Kenntnis |
| O-11 | Hinweistext «Lupe»: Demo sagt «Die rot markierte Bahn», im Lab «Die markierte Bahn» (Leitton statt Rot) | Sitzung 3 | 2026-11-05 | erledigt 2026-11-05: bestätigt (Alain) |
| O-12 | Lupe schmal: Legende im Canvas unter der Linse (statt HTML-Liste wie im Plan); der Erklärtext neben der Legende entfällt schmal, er steht im Panel darunter | Sitzung 3 | 2026-11-05 | zur Kenntnis |
| O-13 | `prefers-reduced-motion` in der Lupe (Endzustand, kein Strahl, Einzelschritte mit «Teilchen losschicken») gebaut, im Browser nicht geprüft | Sitzung 3 | 2026-11-05 | erledigt 2026-11-06: simuliert geprüft, dabei Schalterzustand korrigiert (09c0af4, 90c10d2); echte Einstellung siehe O-20 |
| O-14 | Thomson-Lupe: Faktor als grosse Zahl «× 2000» mit der Zeile «Ablenkung so stark vergrössert gezeichnet» (Demo: nur im Untertitel und in der Legende) | Sitzung 3 | 2026-11-05 | zur Kenntnis |
| O-16 | Token `--lab-flash` (#e2ae6c) steht im Token-Block von `assets/lab.css` (Muster wie `--cpk-*` im Nachbarlab); gehört in die Basis-CSS. Kontrast auf hellem Papier etwa 1,9 : 1, darum grosse Blitze mit Tuschelinie | Sitzung 4 | 2026-11-06 | offen, Änderungsbedarf Basis-CSS |
| O-17 | Zeiten der Blitze sind eigene Wahl: klein 1 s sichtbar und 2 s ausblenden, gross 3 s und 1,5 s, höchstens 60 grosse gleichzeitig. Text im Bild «er verglimmt nach kurzer Zeit» neu | Sitzung 4 | 2026-11-06 | offen (Alain: bestätigen) |
| O-15 | Browser-Test der Betriebsart läuft nicht mit `node --test` (keine DOM-Abhängigkeit erlaubt), sondern im Browser auf dem lokalen Server; Aufruf im Kopf von `tests/browser/betrieb-ui.js` | Sitzung 4 | 2026-11-05 | zur Kenntnis |
| O-18 | Favicon fehlt: Design-Skills 8 verlangt `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` lokal, die Vorlage ist dort noch offen (13). Keine `<link rel="icon">` gesetzt, damit kein 404 entsteht | Sitzung 5 | 2026-11-06 | offen (Alain: Vorlage) |
| O-19 | Fokusring der Basis-CSS (halbtransparenter Saum) ist auf gedrückten Knöpfen schwach; im Lab verstärkt (Lücke in `--color-bg`, Ring in `--color-signal`) | Sitzung 5 | 2026-11-06 | offen, Änderungsbedarf Basis-CSS |
| O-20 | Reduzierte Bewegung nur simuliert (`matchMedia` ersetzt); mit echter Systemeinstellung ungeprüft. Ebenso Screenreader nicht geprüft | Sitzung 5 | 2026-11-06 | offen (Alain) |
| O-21 | Fach-Slug `chem` weicht von SKILL-labs §6 ab (`chemie`); das Nachbarlab verlinkt im Breadcrumb `/lab/chemie`. Übersichtsseite `/lab/chem/` und Lehrpersonen-Seite bestehen noch nicht | Sitzung 6 | 2026-11-06 | teilweise 2026-11-06: SKILL-labs (alle drei Kopien) und Breadcrumb im Nachbarlab auf `chem` angeglichen; Übersichts- und Lehrpersonen-Seite fehlen noch |

Erledigte Punkte bleiben stehen und werden mit Datum und Hash als erledigt markiert.

## Entscheide

| Datum | Entscheid |
| --- | --- |
| 2026-11-05 | Spezifikation ist `docs/rutherford-lab-minispec.md`; CLAUDE.md, Status und Protokoll-Prompt nach dem Muster von `lab/atome_und_molekuele` |
| 2026-11-05 | `data-lab="chemie"` (Pflaume), URL `lab/chemie/rutherford/`, Breadcrumb «Chemie» (URL ersetzt am 2026-11-06) |
| 2026-11-05 | Neue Klassen vorerst in `assets/lab.css`, Basis-CSS nicht ändern |
| 2026-11-05 | Kein Maus-Gradient, kein Glas-Overlay, kein Fortschrittsband; Legal-Overlay bleibt (lädt nur beim Klick) |
| 2026-11-05 | Diagramm: Kernmodell `--lab-accent` durchgezogen, Thomson `--data-5` gestrichelt |
| 2026-11-05 | Plan freigegeben; Schätzwerte der Physik unverändert aus der Demo |
| 2026-11-05 | Messreihe wie in der Spezifikation: vom Original bestätigt, Abweichungen bei Zinn, Kupfer, Eisen gehören zum Original |
| 2026-11-05 | Toleranz r_min im Test 0,1 % |
| 2026-11-05 | Farbkonzept A (Ocker für Blitze) umgesetzt und wieder verworfen: passt besonders im Dunkelmodus nicht |
| 2026-11-05 | Szene nur in Pflaume (Blitze, Flugbahnen, fliegende Teilchen, Balken); starke Ablenkung als grösserer voller Punkt ohne Ring (Abweichung vom Auftrag §4.3 «Ringe für Ablenkungen über 45 Grad») |
| 2026-11-05 | Wortlaut der Hinweise «Flugbahn» und «Lupe» ohne «rot» bestätigt |
| 2026-11-06 | URL: `cogniviolabs.com/lab/chem/rutherford_goldfolie/index.html`; Breadcrumb auf `/lab/chem/`, Lehrpersonen-Seite `/lab/chem/rutherford_goldfolie/lehrperson` |
| 2026-11-06 | Lichtblitze in #e2ae6c (Komplementärton) als Lab-Token `--lab-flash`; Blitze verglimmen nach kurzer Zeit, die Verteilung bleibt als Balkenkranz |

## Änderungsbedarf an der Spezifikation

- §6 Toleranz r_min: 0,05 % hält bei b = 0 knapp nicht (0,0504 %); Vorschlag 0,1 % wie im Auftrag (O-02).
- §7.1 «In der Demo ergaben vier Millionen Teilchen 210»: hängt vom Ablauf der Zufallszahlen ab; im Lab mit Seed 1911 194 (O-03).

## Sitzungsprotokoll

Neueste Sitzung oben. Neue Blöcke kommen direkt unter diese Zeile.

### Sitzung 6: 2026-11-06, Adresse, Fach-Slug und Abschluss

- Prompt: Rückmeldungen von Alain (Adresse, Fach-Slug, Abschluss)
- Erledigt:
  - Status Sitzung 5 (06a2229)
  - Links auf `lab/chem/rutherford_goldfolie/` (Breadcrumb, Lehrpersonen-Seite), CLAUDE.md nachgeführt (9c66423); Entscheid und O-21 (0b69a41)
  - Fach-Slug `chem` in SKILL-labs (alle drei Kopien), Status (ae5b15b); im Nachbarlab Breadcrumb und SKILL-labs (f39a127, Repo `cl_atome_und_molekuele`); Kopie im Hauptordner ohne Git geändert
  - README mit Aufbau, Start, Tests, Link-Parametern, Betriebsart (c5d82ff)
- Nicht erledigt oder verschoben:
  - Offene Punkte siehe Kopf (Nächster Schritt)
  - Nachbarlab: Test «Zustand bei 21 °C …» schlägt fehl (16 statt 13 Stoffe mit Werten), vermutlich wegen neuer Stoffwerte (affb908); dort nicht geändert
- Tests: 43 bestanden, 0 fehlgeschlagen (`node --test`)
- Commits:

  | Hash | Nachricht |
  | --- | --- |
  | 9c66423 | fix: Links auf lab/chem/rutherford_goldfolie |
  | 0b69a41 | docs: URL-Entscheid und offener Punkt zum Fach-Slug |
  | ae5b15b | docs: Fach-Slug chem in SKILL-labs, Status nachgeführt |
  | c5d82ff | docs: README mit Aufbau, Start, Tests und Link-Parametern |

### Sitzung 5: 2026-11-06, Startbild und Schritt 6 (Abnahme)

- Prompt: `prompts/01-rutherford-lab.md`, Schritt 6; Rückmeldung von Alain zum leeren Startbild
- Erledigt:
  - Versuchsaufbau beim ersten Laden und nach jeder Grössenänderung sofort gezeichnet, dazu Neuzeichnen bei Laden, Schriften, Sichtbarkeit, Wiederherstellung (6fbe068)
  - Barrierefreiheit: Ergebnis-Ansage ruht im Lauf, Tabelle höchstens 4-mal pro Sekunde, Lupen-Text nicht mehr live, unsichtbare Abschnitts-Überschriften, «Schliessen» 44 px, Fokusring verstärkt, Lupen-Schalter zeigen bei reduzierter Bewegung den echten Zustand, Diagrammlegende mit mehr Abstand (09c0af4)
  - Browser-Prüfung Barrierefreiheit, 15 von 15 (90c10d2); Betriebsart erneut 9 von 9; Netzwerk: Schriften 200
  - Rückmeldung Alain: Bei 5 pro s zeigte der Kranz Teilchen schon beim Start. Bei kleiner Rate zählen Kranz, Tabelle und Diagramm jetzt erst bei der Ankunft am Schirm; Kern um `record` und `particles` ergänzt, `run` unverändert im Ergebnis (Test: gleiche Statistik bei gleichem Seed) (678ce78)
- Nicht erledigt oder verschoben:
  - O-18 Favicon, O-20 echte Bewegungs-Einstellung und Screenreader, O-05 `file://` und Tablet, O-06 Firefox/Safari
- Tests: 43 bestanden, 0 fehlgeschlagen (`node --test`); Browser: Barrierefreiheit 15 von 15, Betriebsart 9 von 9
- Commits:

  | Hash | Nachricht |
  | --- | --- |
  | 6fbe068 | fix: Versuchsaufbau beim ersten Laden und nach Grössenänderung sofort zeichnen |
  | 09c0af4 | fix: Barrierefreiheit: Ansage im Lauf, Abschnitts-Überschriften, Fokusring, Lupen-Schalter bei reduzierter Bewegung |
  | 90c10d2 | test: Browser-Prüfung Barrierefreiheit und reduzierte Bewegung (15 Prüfungen) |
  | 678ce78 | fix: bei kleiner Rate zählen Kranz, Tabelle und Diagramm ein Teilchen erst bei der Ankunft |

### Sitzung 4: 2026-11-05, Schritt 5 (Betriebsart und Lizenz)

- Prompt: `prompts/01-rutherford-lab.md`, Schritt 5
- Erledigt:
  - Gesperrte Folien mit Schloss-SVG, «Lizenz» und gestricheltem Rand; Regler gesperrt auf 1,2 µm und 7,7 MeV mit Abzeichen; Messreihe ersetzt durch Hinweis mit Schloss; Hinweis beim Klick auf gesperrte Folie; Angebotstext; Betriebsart im Fuss; Link-Parameter `modus` in den Hinweisen (307f3bb)
  - Browser-Test der neun Fälle aus Auftrag §6, alle bestanden (1d98d2b)
  - Lichtblitze in `--lab-flash` (#e2ae6c), Blitze verglimmen, höchstens 60 grosse, Text im Bild ergänzt (005b4d4)
- Nicht erledigt oder verschoben:
  - Schritt 6 (Abnahme), O-13
- Tests: 42 bestanden, 0 fehlgeschlagen (`node --test`); Browser-Test Betriebsart 9 von 9
- Commits:

  | Hash | Nachricht |
  | --- | --- |
  | 307f3bb | feat: Lizenzbetrieb in der Oberfläche mit Schloss, gesperrten Reglern und Hinweis |
  | 1d98d2b | test: Browser-Test der Betriebsart, neun Fälle |
  | 005b4d4 | feat: Lichtblitze in --lab-flash, Blitze verglimmen, höchstens 60 grosse |

### Sitzung 3: 2026-11-05, Farbkonzept A und Schritt 4 (Lupe)

- Prompt: `prompts/01-rutherford-lab.md`, Schritt 4; Farbwunsch von Alain
- Erledigt:
  - Farbkonzept A: Blitze in Ocker mit Tuschelinie, Flugbahnen in Tusche (898c8a1); nach Rückmeldung verworfen: Szene wieder in Pflaume, starke Ablenkung als grösserer Punkt ohne Ring, Hinweis «Flugbahn» angepasst, CLAUDE.md nachgeführt (b20002d)
  - Lupe: Knopf mit Symbol neben der Folienwahl, Klick auf die Folie, Escape; Kernmodell mit Strahl, markierter Bahn, Kraftpfeil, Bahnwechsel, Regler b, «Teilchen losschicken», Billardkugel, Zielscheibe, Hinweis bei Aluminium; Thomson-Atom mit Rasterton und Faktor gross im Bild; Modellwechsel passt die Lupe sofort an; Link-Parameter `lupe`, `strahl`, `auto`, `b`, `t`, `billard`, `ziel`; Hinweis «Lupe» (e115bb7)
  - Browserprüfung Chrome (localhost): Gold, Aluminium frontal, Thomson, Billardkugel und Zielscheibe, Hell und Dunkel, breit und schmal (simuliert), Bahnwechsel, Fokus nach Escape, keine Konsolenfehler (ohne Commit)
- Nicht erledigt oder verschoben:
  - Lizenzanzeige (Schritt 5), Abnahme (Schritt 6)
  - O-13
- Tests: 42 bestanden, 0 fehlgeschlagen (`node --test`)
- Commits:

  | Hash | Nachricht |
  | --- | --- |
  | 898c8a1 | feat: Farbkonzept A, Blitze in Ocker mit Tuschelinie, Flugbahnen in Tusche |
  | e115bb7 | feat: Lupe mit Strahl, markierter Bahn, Billardkugel, Zielscheibe und Thomson-Atom |
  | b20002d | fix: Blitze wieder in Pflaume, starke Ablenkung als grösserer Punkt ohne Ring |

### Sitzung 2: 2026-11-05, Schritt 3 (Hauptansicht)

- Prompt: `prompts/01-rutherford-lab.md`, Schritt 3
- Erledigt:
  - Entscheide zu O-01 (Messreihe vom Original bestätigt) und O-02 (0,1 %) (ec53e0e)
  - Hauptansicht: Seitenkopf, Topbar, Theme ohne Speicherung, Modellwahl, Schirm mit Balken und Ringen, Flugbahnen, Einzelteilchen bis 200 pro s, Zeitraffer, «+ 1 Million sofort» in Stücken mit Fortschritt, Tabelle, Ergebnissatz, Vergleich, Diagramm beider Modelle, Hinweise, historische Werte mit Messreihe aus dem Kern, Link-Parameter `modell`, `material`, `dicke`, `energie`, `theme`, `start`, Fuss und Overlay «Rechtliches» (839b9b3)
  - Canvas skalierbar mit Pixeldichte, breit (960 × 500) und schmal (520 × 880, Diagramm unter dem Schirm), Mindestschriftgrösse 12 px bzw. 18 px (839b9b3)
  - Browserprüfung Chrome (localhost, 1280 px): Hell und Dunkel, Thomson und Kern mit 1 Mio., Strom bei 200 pro s, Overlay mit Fokus und Escape, keine Konsolenfehler (ohne Commit)
- Nicht erledigt oder verschoben:
  - Lupe (Schritt 4), Anzeige der Lizenzsperren (Schritt 5)
  - O-06 bis O-08
- Tests: 42 bestanden, 0 fehlgeschlagen (`node --test`)
- Commits:

  | Hash | Nachricht |
  | --- | --- |
  | ec53e0e | test: Messreihe vom Original bestätigt |
  | 839b9b3 | feat: Hauptansicht mit Schirm, Diagramm, Zeitraffer, Tabelle und Historischem |

### Sitzung 1: 2026-11-05, Plan und Schritt 2 (Kern und Tests)

- Prompt: `prompts/01-rutherford-lab.md`
- Erledigt:
  - Plan mit Abweichungen, Dateistruktur, Fragen und Risiken; Fragen 1 bis 4 entschieden (ohne Commit)
  - CLAUDE.md, Auftrag nach `prompts/`, Vorlage für den Status (80dfad6)
  - Physik-Kern aus der Demo ohne DOM, Strom, Rechnen in Stücken, Lizenzlogik, `src/config.js` mit Sicherheitshinweis (1cd78f5)
  - 42 Tests nach Auftrag §5 und Farbliteral-Prüfung (fc12b4f)
- Nicht erledigt oder verschoben:
  - Oberfläche (Schritte 3 bis 6)
- Tests: 42 bestanden, 0 fehlgeschlagen (`node --test`)
- Commits:

  | Hash | Nachricht |
  | --- | --- |
  | 80dfad6 | docs: CLAUDE.md, Auftrag nach prompts/, Vorlage für den Status |
  | 1cd78f5 | feat: Physik-Kern, Strom, Rechnen in Stücken und Lizenzlogik ohne DOM |
  | fc12b4f | test: Kern, Lupe, Strom, Messreihe, Lizenz und Farbliterale (42 Tests) |

### Vorlage für neue Sitzungen (kopieren, hier nicht ändern)

#### Sitzung N: JJJJ-MM-TT, Titel

- Prompt: `prompts/NN-….md`
- Erledigt:
  - Punkt (abc1234)
- Nicht erledigt oder verschoben:
  - Punkt
- Tests: X bestanden, Y fehlgeschlagen (`node --test`)
- Commits:

  | Hash | Nachricht |
  | --- | --- |
  | abc1234 | feat: … |
