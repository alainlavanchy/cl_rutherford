# Projektstatus: Rutherford-Lab (Goldfolienversuch)

Wird nach jeder Sitzung aktualisiert (Anleitung: `prompts/status-update.md`). Festgehalten wird nur, was belegt ist: ein Commit, ein Test oder ein Entscheid.

| | |
| --- | --- |
| Stand | 2026-11-05 |
| Spezifikation | `docs/rutherford-lab-minispec.md` (Entwurf) |
| Auftrag | `prompts/01-rutherford-lab.md` |
| Letzter erfasster Commit | fc12b4f |
| Aktueller Fokus | Schritt 2 erledigt: Kern und Tests |
| Nächster Schritt | Schritt 3: Hauptansicht (Schirm, Anzeigen, Diagramm, Zeitraffer, Historisches) |

## Bauplan (Auftrag, Abschnitt 9)

- [x] 1. Plan (bestätigt 2026-11-05)
- [x] 2. Kern und Tests, ohne Oberfläche
- [ ] 3. Hauptansicht
- [ ] 4. Lupe
- [ ] 5. Betriebsart und Lizenz (Logik und Tests bereits in Schritt 2; Oberfläche offen)
- [ ] 6. Design-Abnahme (Design-Skills 12) und Barrierefreiheit

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
| 8 | Lizenzbetrieb: neun Fälle | teilweise | Logik in `tests/license.test.js` (fc12b4f); Oberfläche in Schritt 5 |

## Offene Punkte

| Nr. | Punkt | Quelle | Seit | Stand |
| --- | --- | --- | --- | --- |
| O-01 | Messreihe: Spalte z / A^(3/2) passt bei Zinn (gerechnet 262, Tabelle 226), Kupfer (283 / 225) und Eisen (243 / 250) nicht zu z und A. Übrige fünf auf ±1. Im Original (Rutherford 1911) prüfen. Test hält die drei Abweichungen fest | Sitzung 1 | 2026-11-05 | erledigt 2026-11-05: Alain hat die Tabelle mit dem Original verglichen, sie ist so richtig (Abweichungen stehen im Original) |
| O-02 | Toleranz r_min: Spezifikation §6 nennt 0,05 %, gemessen 0,0504 % bei b = 0. Test mit 0,1 % nach Auftrag §5.2 | Sitzung 1 | 2026-11-05 | erledigt 2026-11-05: 0,1 % bestätigt (Alain); Spezifikation angleichen |
| O-03 | Seed: Die Demo nennt 210 Treffer über 90° bei 4 Mio.; der Kern mit Seed 1911 in einem Lauf ergibt 194. Beides innerhalb 3 σ (194 ± 14); die 210 entstanden vermutlich durch den Ablauf in Stücken in der Demo | Sitzung 1 | 2026-11-05 | zur Kenntnis |
| O-04 | Basis-CSS: neue Klassen (Lupen-Knopf, Schloss, Topbar, Footer, Legal) vorerst in `assets/lab.css` | Plan | 2026-11-05 | offen, Änderungsbedarf Basis-CSS |
| O-05 | `file://` und Tablet prüfen (Browser-Erweiterung öffnet keine Datei-URLs) | Plan | 2026-11-05 | offen (Alain), ab Schritt 3 |

Erledigte Punkte bleiben stehen und werden mit Datum und Hash als erledigt markiert.

## Entscheide

| Datum | Entscheid |
| --- | --- |
| 2026-11-05 | Spezifikation ist `docs/rutherford-lab-minispec.md`; CLAUDE.md, Status und Protokoll-Prompt nach dem Muster von `lab/atome_und_molekuele` |
| 2026-11-05 | `data-lab="chemie"` (Pflaume), URL `lab/chemie/rutherford/`, Breadcrumb «Chemie» |
| 2026-11-05 | Neue Klassen vorerst in `assets/lab.css`, Basis-CSS nicht ändern |
| 2026-11-05 | Kein Maus-Gradient, kein Glas-Overlay, kein Fortschrittsband; Legal-Overlay bleibt (lädt nur beim Klick) |
| 2026-11-05 | Diagramm: Kernmodell `--lab-accent` durchgezogen, Thomson `--data-5` gestrichelt |
| 2026-11-05 | Plan freigegeben; Schätzwerte der Physik unverändert aus der Demo |
| 2026-11-05 | Messreihe wie in der Spezifikation: vom Original bestätigt, Abweichungen bei Zinn, Kupfer, Eisen gehören zum Original |
| 2026-11-05 | Toleranz r_min im Test 0,1 % |

## Änderungsbedarf an der Spezifikation

- §6 Toleranz r_min: 0,05 % hält bei b = 0 knapp nicht (0,0504 %); Vorschlag 0,1 % wie im Auftrag (O-02).
- §7.1 «In der Demo ergaben vier Millionen Teilchen 210»: hängt vom Ablauf der Zufallszahlen ab; im Lab mit Seed 1911 194 (O-03).

## Sitzungsprotokoll

Neueste Sitzung oben. Neue Blöcke kommen direkt unter diese Zeile.

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
