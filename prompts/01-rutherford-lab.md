# Prompt: Rutherford-Lab (Goldfolienversuch) bauen

**Zweck:** Das Rutherford-Lab von der Referenzdemo in ein Lab im Design-System von Cogniviolabs überführen.
**Vorgehen:** Zuerst nur den Plan (Schritt 1). Kein Code, bis Alain den Plan bestätigt hat.
**Aufruf im Terminal:** `Lies prompts/<diese Datei> und mach zuerst nur den Plan.`

---

## 0. Auftrag in drei Sätzen

Baue das Lab «Goldfolienversuch» (Rutherford) als Standalone-HTML mit Vanilla JS nach den Regeln von `Design-Skills.md` und `SKILL-labs.md`. Die Referenzdemo `docs/referenz/demo-rutherford-goldfolie.html` zeigt, wie das Lab sich anfühlen und verhalten soll. Sie ist die Messlatte für Verhalten, Physik, Texte und Didaktik, aber **nicht** für Farben, CSS, Schriften und Seitenkopf.

**Qualitätsmassstab:** Das fertige Lab muss in Verhalten und Wirkung der Referenzdemo gleichwertig sein. Ein sauberer, aber gewöhnlicher Nachbau, der Funktionen weglässt, vereinfacht oder die Didaktik glättet, ist ein Fehlschlag. Wenn du etwas nicht eins zu eins übernehmen kannst, sag es im Plan und frag nach.

---

## 1. Pflichtlektüre (vor dem Plan lesen)

1. `CLAUDE.md` (Konventionen des Repos)
2. `Design-Skills.md` vollständig. Insbesondere die Abschnitte 4 (Farben), 5.2 (Klassen), 6 (Szene, Canvas, Animation), 10 (Verboten), 12 (Checkliste).
3. `SKILL-labs.md` (HTML-Grundstruktur, Topbar, Legal-Overlay, URL-Konventionen, Checkliste)
4. `docs/rutherford-spec.md` (Mini-Spezifikation, Quelle der Wahrheit für Inhalt und Zahlen)
5. `docs/referenz/demo-rutherford-goldfolie.html` (Referenzdemo, vollständig lesen, auch den Code)
6. `docs/screenshots/` (Ansichten der Referenzdemo in Hell und Dunkel)
7. `PROJECT-STATUS.md` und `prompts/status-update.md` (Protokoll)

Wenn eine dieser Dateien fehlt, sag es sofort und warte.

---

## 2. Was an der Referenzdemo NICHT übernommen wird

Die Demo wurde im Chat gebaut und verletzt an mehreren Stellen die Design-Regeln. Diese Punkte sind verbindlich anders zu lösen. Liste sie im Plan einzeln mit deinem Vorschlag.

| Demo | Im Lab |
| --- | --- |
| Eigene Tokens (`--bg`, `--surface`, `--text`, `--signal` …) mit Hex-Werten im `<style>` | Nur die Tokens aus `cognivio-common.v1.css` (`--color-*`, `--lab-accent`, `--data-*`, `--space-*`, `--radius-*`). Keine Hex-, `rgb()`- oder `hsl()`-Werte im Lab. |
| Zinnober (`--signal`) für rote Bahn, Ringe, Kraftpfeil und Marker in der Szene | **Verboten** («Zinnober nur für Bedienbares»). Szene in `--lab-accent` (Leitton), Tuschelinien in `--color-line`, Hilfslinien in `--color-border`. Datenreihen in `--data-1` bis `--data-5`. |
| Farbe als Träger der markierten Bahn | Zu jeder Farbe eine zweite Information (Linienstärke, Linienart, Form, Beschriftung), siehe 4.3. |
| Eigener Kopf «cognivio labs · Rutherford-Lab» | Seitenkopf nach `Design-Skills.md` 2.3 und Topbar nach `SKILL-labs.md` (Breadcrumb, Theme-Schalter), Lehrpersonen-Link, Footer mit Legal-Overlay. |
| Eigene Klassen für Schalter, Karten, Hinweise | Gemeinsame Klassen: `.btn`, `.btn--secondary`, `.segmented`, `.card`, `.callout`, `.scene`, `.badge`, `.caption`. Neue wiederverwendbare Klassen (z. B. Lupen-Knopf) kommen in die gemeinsame CSS, nicht in die Seite. |
| `getComputedStyle(document.documentElement)` bei jedem Zeichnen | Palette einmal aus dem Element mit `data-lab` (meist `<body>`) lesen, bei Theme-Wechsel neu lesen (siehe `Design-Skills.md` 6.2). |
| Systemschriften im Canvas | `Patrick Hand` für Beschriftungen in der Szene, `Raleway` für Zahlen und Achsen (normale Ziffern). Vor dem Zeichnen `document.fonts.load(...)`. Regeln zu Grössen in 6.2 beachten. |
| Feste Canvas-Grösse 960 × 500 | Skalierbar, scharf auf hochauflösenden Bildschirmen (`devicePixelRatio`), lesbar auf Tablet und Handy. Im Plan vorschlagen, wie die Lupe und die Legende auf schmalen Bildschirmen aussehen. |
| Emojis, Schloss als Text | Keine Emojis. Das Schloss ist ein SVG-Symbol. |

**Annahmen, die du im Plan bestätigen lässt (nicht selbst entscheiden):**
- `data-lab`: Vorschlag `chemie` (Pflaume), weil das Lab zum Atompaket gehört. Für Physik gibt es in `Design-Skills.md` noch keinen Leitton (offener Punkt 13).
- URL: `lab/chemie/rutherford/` oder `lab/physik/rutherford/` (Fach-Slug klären).
- Ob der Ordner dieses Repos (`cl_atome_und_molekuele`) das Lab enthält oder ein eigenes Repo angelegt wird.

---

## 3. Architektur

- Standalone-HTML, Vanilla JS, kein Framework, kein Build, kein CDN, kein Tailwind.
- **Physik-Kern ohne DOM** in einer eigenen Datei (z. B. `rutherford-core.js`, in der Demo der Block zwischen `// <sim>` und `// </sim>`). Funktioniert im Browser und unter Node (`node --test`). Namen der Funktionen aus der Demo beibehalten, damit Vergleich und Tests nachvollziehbar bleiben: `lupeGeom`, `trajectory`, `thomsonTrajectory`, `billard`, `p90`, `run`, `newStats`, `median`.
- Oberfläche und Zeichnen getrennt vom Kern.
- Betriebsart und Lizenz an **einer** Stelle am Anfang des Skripts (siehe 6).
- Keine Persistenz, keine Netzwerkaufrufe im Lab selbst.

---

## 4. Funktionsumfang (= Referenzdemo, vollständig)

Details und Texte stehen in `docs/rutherford-spec.md` und im Code der Demo. Übernimm sie vollständig. Stichworte:

1. **Aufbau:** Quelle, Folie, kreisförmiger Schirm. Umschalter Thomson-Modell und Kernmodell. Wahl der Folie (Gold, Platin, Silber, Kupfer, Aluminium), Dicke (0,2 bis 3 µm) und Energie (3 bis 8 MeV), Standard Gold, 1,2 µm, 7,7 MeV.
2. **Zeitraffer:** 5 pro Sekunde, 200 pro Sekunde, 20 000 pro Sekunde, 1 Million pro Sekunde, dazu «+ 1 Million sofort» (in Stücken, ohne die Seite zu blockieren), Start/Pause, Zurücksetzen.
3. **Anzeigen:** Schirm mit Punkten (jeder Punkt ein Blitz), Balken ausserhalb des Schirms (Zahl der Teilchen je Richtung, logarithmisch), Ringe für Ablenkungen über 45 Grad, Tabelle der Winkelbereiche mit Anteilen, Satz «Von N Teilchen wurden k um mehr als 90 Grad abgelenkt (etwa 1 von …)», Rechnung und historische Werte darunter, Diagramm rechts (Anteil je Winkelbereich, beide Achsen logarithmisch, beide Modelle zugleich).
4. **Flugbahnen:** schematisch (gerade zur Folie, dort abgelenkt, gerade zum Schirm). Bei bis zu 200 Teilchen pro Sekunde fliegt jedes Teilchen einzeln; der Treffer erscheint bei der Ankunft. Bei grosser Rate nur die Bahnen stark abgelenkter Teilchen.
5. **Lupe: ein Atom** (Knopf mit Symbol neben der Folienwahl, Klick auf die Folie öffnet sie, Escape schliesst):
   - Kernmodell: Kern als Punkt, Massstab in fm, Bahnen aus der Abstossungskraft gerechnet, Strahl mit mehreren Teilchen (zufälliger Stossparameter), eine rot markierte Bahn mit Kraftpfeil, die nach dem Durchflug stehen bleibt, ausblendet und durch eine neue ersetzt wird (abschaltbar), Regler für den Stossparameter, «Teilchen losschicken», Schalter «Billardkugel-Vorstellung (falsch)» und «Zielscheibe». Hinweis bei Aluminium: Das Teilchen kann den Kern erreichen, die Rechnung gilt dann nicht mehr.
   - Thomson-Modell: Atom als Kugel mit gleichmässig verteilter positiver Ladung (Massstab in pm), Bahnen gerechnet, **Ablenkung für die Zeichnung vergrössert, der Faktor steht gross im Bild**. Billardkugel und Zielscheibe entfallen.
   - Die Lupe passt sich beim Modellwechsel sofort an.
6. **Historische Messwerte** (aufklappbar): Platin dicke Platte etwa 1 von 8000, Gold dünne Folie etwa 1 von 20 000 (nicht direkt vergleichbar, so beschriften), Messreihe zu acht Metallen (Rutherford 1911) mit Aufgabe.
7. **Hinweise zum Modell:** Elektronen nicht gezeichnet, nicht massstäblich, «kaum Stoff, aber nicht nichts», kein Billardkugel-Abprall, Zeitraffer, Flugbahn schematisch.
8. **Link-Parameter** für Screenshots (`modell`, `material`, `dicke`, `energie`, `theme`, `start`, `lupe`, `b`, `t`, `billard`, `ziel`, `strahl`, `auto`, `modus`). Liste und Wirkung stehen im Fuss der Demo.

---

## 5. Physik und Tests (verbindlich)

Alle Tests mit `node --test` im Ordner `tests/`. Die Werte stammen aus den Prüfungen der Referenzdemo.

1. **Anteil über 90 Grad (Kernmodell):** `p90 = n · t · π · (1,44 MeV·fm · Z / E)²`. Gold, 1,2 µm, 7,7 MeV: 4,86·10⁻⁵ (1 : 20 595). Simulation mit 4 Millionen Teilchen und festem Seed: 210 gezählt gegen 194 ± 14 erwartet. Test: innerhalb von 3 Standardabweichungen.
2. **Bahnen gegen die Formel (Lupe, Kernmodell):** Für `b/d` in `0, 0,05, 0,1, 0,25, 0,5, 1, 2, 3`: `θ = 2 · arctan(d / (2b))` (180° bei b = 0) und `r_min = (d/2) · (1 + √(1 + (2b/d)²))`. Toleranz: 0,01 Grad und 0,1 Prozent. Gold, 7,7 MeV: d = 29,5 fm, Kernradius 7,0 fm (1,2 · A^(1/3)), Berührungsabstand 8,7 fm (mit 1,7 fm für das α-Teilchen), also berührt es den Kern nicht. Aluminium frontal: berührt (Berührungsabstand 5,3 fm), die Bahn endet dort und es wird kein Winkel angezeigt.
3. **Thomson-Atom (Lupe):** Radius R = halber Atomabstand (Gold etwa 128 pm), Kraft innen `s · r`, aussen `s / r²`, grösste Ablenkung `s = 2 · 1,44 · Z / (R · E)` (Gold, 7,7 MeV: 0,0132 Grad). Ausserhalb des Atoms stimmt die numerische Bahn mit `θ = s · R / b` auf 5 Prozent überein (b = R bis 2R). Vergrösserungsfaktor gerundet aus `0,4 / s` (Gold 2000, Aluminium 10 000).
4. **Thomson-Modell (Hauptansicht):** Gauss-Streuung mit demselben Kern wie das Kernmodell. Bei 4 Millionen Teilchen kein Teilchen über 20 Grad.
5. **Geigers Befunde als Trend (nicht als feste Zahl):** Der mittlere Ablenkwinkel (Median) wächst mit der Dicke, wächst mit der Kernladung und sinkt mit der Energie. Referenzwerte der Demo: Gold bei 0,3 / 1,2 / 3 µm: 1,2 / 2,5 / 4,0 Grad. Aluminium, Kupfer, Silber, Gold bei 1,2 µm: 0,4 / 1,1 / 1,4 / 2,5 Grad. Gold bei 3 / 5 / 7,7 MeV: 6,6 / 3,9 / 2,5 Grad. Test: Reihenfolge stimmt, Werte innerhalb von 15 Prozent.
6. **Gleichmässiger Teilchenstrom:** Bei 200 Teilchen pro Sekunde und 60 Bildern pro Sekunde bleibt die Zahl der gleichzeitig fliegenden Teilchen konstant bei etwa 240 (Flugdauer 1,2 s). **Bekannter Fehler der ersten Fassung:** Eine Obergrenze von 80 gleichzeitigen Teilchen erzeugte Wellen (viele, dann keine). Obergrenze nicht so setzen, dass sie bei der höchsten Einzelrate erreicht wird; Startzeitpunkte gleichmässig über das Bild verteilen.
7. **Messreihe:** Die acht Werte und `z / A^(3/2)` stimmen mit der Tabelle in der Spezifikation überein (Durchschnitt 233).
8. **Lizenzbetrieb:** Test der Fälle in Abschnitt 6.

---

## 6. Betriebsart und Lizenz

Ein zentrales Setting am Anfang des Skripts:

- `BETRIEB.modus = "alles_frei"` (Voreinstellung, Testphase an Alains Schule) oder `"lizenz"`.
- Die umgebende Seite kann vor dem Skript `window.COGNIVIO_BETRIEB = { modus: "lizenz", lizenzAktiv: true | false }` setzen. `lizenzAktiv` soll später aus der serverseitigen Prüfung kommen (Tabelle `cl_entitlements`). Diese Prüfung baust du **nicht** in diesem Auftrag, nur den Anschluss.
- Der Link `?modus=lizenz` kann die Seite nur **verschärfen**, nie lockern. Ein Link mit `?modus=frei` ändert nichts.
- Im Lizenzbetrieb ohne aktive Lizenz bleiben **frei**: Gold und Aluminium bei fester Dicke (1,2 µm) und Energie (7,7 MeV), beide Modelle, Zeitraffer, Diagramm, Lupe. **Gesperrt:** Platin, Silber, Kupfer, Regler für Dicke und Energie, Messreihe zu acht Metallen. Gesperrte Elemente tragen ein Schloss-SVG und die Beschriftung «Lizenz»; ein Klick auf eine gesperrte Folie zeigt einen Hinweis. Parameter für Folie, Dicke und Energie im Link werden ohne Lizenz ignoriert. Unten steht die Betriebsart.
- Testfälle (alle automatisieren): Standard; `?modus=lizenz`; Link mit gesperrten Werten; Klick auf gesperrte Folie; Klick auf Aluminium; Seite setzt `lizenz` mit aktiver Lizenz; mit `?modus=lizenz` und aktiver Lizenz (bleibt offen); Seite setzt `lizenz` ohne aktive Lizenz; `?modus=frei` gegen gesetzten Lizenzbetrieb (bleibt gesperrt).
- **Sicherheitshinweis in den Code-Kommentar:** Sperren im Browser sind nur eine Hürde. Der echte Schutz liegt serverseitig (Lizenzprüfung, Klassencodes, Lehrpersonen-Seite, Arbeitsblätter, Daten).

---

## 7. Zugänglichkeit und Bewegung

- `prefers-reduced-motion`: keine fliegenden Einzelteilchen, kein Strahl, kein automatischer Bahnwechsel, stattdessen Endzustand oder Einzelschritt.
- Alle Knöpfe und Regler per Tastatur bedienbar, sichtbarer Fokus, `aria-pressed` für Schalter, Touch-Ziele mindestens 44 px.
- Das Canvas hat einen Text als Alternative (`aria-label` und die Textzeile mit dem Ergebnis als `role="status"`).
- Hell und Dunkel testen. Der Dunkelmodus entsteht nur durch Tokens.
- Jede Farbkodierung hat eine zweite Information.

---

## 8. Nicht in diesem Auftrag

Klassencode, Auswertung der Vorhersagen, serverseitige Lizenzprüfung, Lehrpersonen-Seite, Arbeitsblätter, Zoomstufen unterhalb der Lupe (Atom zum Kern ist bereits die Lupe), Bohr-Lab. Wenn du dafür Platz im Aufbau brauchst, kennzeichne die Stelle, baue sie nicht.

---

## 9. Reihenfolge

**Schritt 1: Plan (jetzt).** Kein Code. Lies die Pflichtlektüre, dann liefere:
1. Verständnis des Auftrags in fünf Sätzen.
2. Die Abweichungen aus Abschnitt 2 mit deinem Vorschlag je Zeile.
3. Dateistruktur und Aufteilung (Kern, Oberfläche, CSS, Tests).
4. Offene Fragen (höchstens fünf, nach Wichtigkeit).
5. Risiken, vor allem dort, wo das Verhalten der Demo schwer nachzubauen ist (Zeitraffer in Stücken, gleichmässiger Strom, Lupe mit Strahl und Bahnwechsel, Canvas in hoher Auflösung).
6. Wie du das Aussehen selbst prüfst (Browser mit Screenshots in Hell und Dunkel, wenn verfügbar; sonst sag, was Alain prüfen soll).

**Dann warten, bis Alain bestätigt.**

**Schritt 2:** Kern und Tests (Abschnitt 5), noch ohne Oberfläche.
**Schritt 3:** Hauptansicht (Schirm, Anzeigen, Diagramm, Zeitraffer, Historisches).
**Schritt 4:** Lupe.
**Schritt 5:** Betriebsart und Lizenz (Abschnitt 6).
**Schritt 6:** Design-Abnahme gegen `Design-Skills.md` 12 und Barrierefreiheit (Abschnitt 7).

Nach jedem Schritt: Tests laufen lassen, committen, Protokoll nach `prompts/status-update.md` führen und `PROJECT-STATUS.md` aktualisieren (erledigt, offen, Commit-Nummern). Nicht mehrere Schritte ohne Rückmeldung.

---

## 10. Regeln für dich

- Keine Zahl und keinen Text erfinden. Zahlen kommen aus `docs/rutherford-spec.md` oder der Referenzdemo. Unklarheiten: fragen.
- Offene Entscheide (Leitton und Fach-Slug, Preis, serverseitige Lizenzprüfung, Werte des Thomson-Modells, Kernradius und α-Radius als Schätzwerte, rechtliche Prüfung der Anlehnung an PhET) nicht selbst entscheiden. Im Plan als Frage aufführen.
- Schweizer Schreibweise (kein ß, «» als Anführungszeichen), Satzschreibweise, einfache Verben, keine Emojis.
- Kein Code aus PhET oder anderen Quellen übernehmen. Die Physik ist in der Spezifikation beschrieben.
- Wenn die Referenzdemo und `Design-Skills.md` sich widersprechen, gilt `Design-Skills.md`, ausser bei Verhalten, Physik, Didaktik und Texten. Dann gilt die Demo. Jeden solchen Fall im Plan nennen.
