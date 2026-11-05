# Rutherford-Lab (Goldfolienversuch): Mini-Spezifikation

| | |
| --- | --- |
| Status | Entwurf, Demo gebaut (`demo-rutherford-goldfolie.html`), Lab noch nicht gebaut |
| Einordnung | Eigenes Lab im Atompaket, nach den Aggregatzuständen, vor dem Bohr-Lab |
| Zielgruppe | Sekundarstufe I (obere Stufen) |
| Bezug | Subatomares: Das Lab ist die bewusste Ausnahme zu «kein Subatomares» in Lab 1 |
| Anregung | PhET «Rutherford Scattering» (CC BY) zeigt eine Kernansicht. Eigene Umsetzung ohne übernommenen Code, Grafiken oder Texte; PhET als Anregung nennen |
| Quellen | Rutherford 1911 (Auszug im Chat, Seiten 681 und 682, chemteam.info); Geigers Befunde nach Wikipedia («Rutherford scattering experiments»); beides vor der Veröffentlichung im Original prüfen |

## 1. Kernfrage

Wie muss ein Atom aufgebaut sein, wenn fast alle α-Teilchen durch eine Folie fliegen, aber einzelne fast zurückprallen?

## 2. Lernziele (Sicht der Lernenden)

1. Ich kann vorhersagen, wie α-Teilchen durch eine Folie laufen, wenn das Atom ein «Rosinenkuchen» ist (positive Ladung verteilt) und wenn die positive Ladung in einem winzigen Kern sitzt.
2. Ich kann erklären, warum fast alle Teilchen gerade durchgehen und nur sehr wenige stark abgelenkt werden.
3. Ich kann aus den Messwerten schliessen, dass die positive Ladung auf einen sehr kleinen Kern konzentriert ist.
4. Ich kann beschreiben, wovon die Ablenkung abhängt: Foliendicke, Material und Geschwindigkeit der Teilchen.
5. Ich kann unterscheiden, was gemessen wird (Blitze auf dem Schirm) und was Modell ist (der Kern).

## 3. Stationen

1. **Aufbau und Vorhersage.** Eine Quelle schickt α-Teilchen auf eine dünne Folie, ein Schirm ringsum zeigt jeden Treffer als Blitz. Vor dem Start sagen die Lernenden voraus: alle gerade durch, alle leicht gestreut, oder einige zurück.
2. **Zwei Modelle.** Thomsons «Rosinenkuchen» gegen das Kernmodell. Pro Modell lassen die Lernenden viele Teilchen laufen und sehen die Verteilung auf dem Schirm. Ein Zeitraffer ist nötig, denn die starken Ablenkungen sind sehr selten. Balken ausserhalb des Schirms zeigen die Zahl der Teilchen je Richtung (logarithmisch), damit auch das Thomson-Modell sichtbar etwas zeigt (alle Teilchen nahe 0 Grad). Ein Diagramm stellt beide Modelle nebeneinander (Anteil je Winkelbereich, beide Achsen logarithmisch): Der Kern der Verteilung ist gleich, nur das Kernmodell hat einen langen Auslauf zu grossen Winkeln.
3. **Lupe: ein Atom.** Ein Klick auf die Folie öffnet ein Overlay mit einem einzelnen Atom (Kern als Punkt, Hülle nicht gezeichnet, Massstab in fm, massstabsgetreu). Die Bahnen sind aus der Abstossungskraft gerechnet. Ein Strahl schickt laufend mehrere Teilchen mit zufälligem Stossparameter durch das Bild: Die meisten werden kaum abgelenkt, nur wenige stark (abschaltbar, bei «prefers-reduced-motion» aus). Ein einzelnes Teilchen ist rot hervorgehoben, mit Kraftpfeil, der die Abstossung zeigt. Nach dem Durchflug bleibt seine Bahn kurz stehen, blendet aus, und danach wird eine neue Bahn mit zufälligem Stossparameter (logarithmisch verteilt, beide Seiten) markiert. Der Wechsel ist abschaltbar. Ein Regler wählt den Stossparameter b von Hand. Der Schalter «Billardkugel» zeigt als falsche Vorstellung eine harte Kugel, der Schalter «Zielscheibe» das Band der Stossparameter, die zu Ablenkungen über 90 Grad führen. So sehen die Lernenden: abgestossen, nicht abgeprallt. Im Thomson-Modell zeigt die Lupe stattdessen das Atom mit gleichmässig verteilter positiver Ladung (Massstab in pm): Die Kraft ist überall klein, die Bahnen biegen kaum ab. Die winzige Ablenkung ist für die Zeichnung vergrössert, der Faktor steht gross im Bild; «Billardkugel» und «Zielscheibe» entfallen dort. Der Lupen-Knopf mit Symbol steht neben der Folienwahl.
4. **Das Messergebnis.** Der Anteil der Teilchen mit Ablenkung über 90 Grad wird mit den historischen Messwerten verglichen (Abschnitt 4). Welches Modell passt?
5. **Forschungsauftrag Folie.** Foliendicke, Material und Geschwindigkeit der Teilchen lassen sich verändern. Die Lernenden finden Geigers drei Zusammenhänge selbst heraus, bevor das Lab sie nennt.
6. **Material vergleichen (historische Messreihe).** Die Tabelle von Geiger und Marsden zu dicken Platten aus acht Metallen (Abschnitt 4). Aufgabe: z gegen die Atommasse auftragen und den Zusammenhang finden. Für Fortgeschrittene.
7. **Zoom.** Von der Folie über das Atom zum Kern, mit Massstabsleiste und dem Hinweis «nicht massstäblich». Die Lupe aus Station 3 ist die erste Stufe davon.

## 3a. Betriebsart und Lizenzstufen

Das Lab kennt zwei Betriebsarten. Sie stehen als zentrales Setting am Anfang des Skripts (`BETRIEB.modus`):

- **`alles_frei`:** alle Funktionen offen (Testphase an der eigenen Schule, interne Nutzung). Das ist die Voreinstellung.
- **`lizenz`:** Betrieb mit Lizenz. Ohne aktive Lizenz sind gesperrt: weitere Folien (Platin, Silber, Kupfer), Dicke, Energie und die Messreihe zu acht Metallen. Frei bleiben Gold und Aluminium bei fester Dicke (1,2 µm) und Energie (7,7 MeV), beide Modelle, Zeitraffer, Diagramm und die Lupe.

Die umgebende Seite kann vor dem Skript `window.COGNIVIO_BETRIEB = { modus: "lizenz", lizenzAktiv: true | false }` setzen. `lizenzAktiv` soll später aus der serverseitigen Prüfung kommen (Tabelle `cl_entitlements`). Der Link kann mit `?modus=lizenz` die Seite nur verschärfen (zum Prüfen der Vorschau), nie lockern. Gesperrte Elemente tragen ein Schloss-Symbol und sind beschriftet; ein Klick auf eine gesperrte Folie zeigt einen Hinweis. Die Betriebsart steht unten auf der Seite.

Die Sperren im Browser sind nur eine Hürde, weil der Code lesbar ist. Der echte Schutz liegt serverseitig: Lizenzprüfung, Klassencodes mit Auswertung, Lehrpersonen-Seite, Arbeitsblätter und gespeicherte Daten. Zur Lizenz gehören ausserdem (noch nicht gebaut): Klassencode mit Vorhersagen, Lehrpersonen-Seite, Arbeitsblätter.

## 4. Messdaten und Parameter

**Zwei verschiedene historische Aussagen, nicht verwechseln:**

| Aussage | Bedingungen | Quelle |
| --- | --- | --- |
| Etwa 1 von 8000 α-Teilchen von Radium C wird an einer dicken Platte aus Platin in Einfallsrichtung zurückgestreut | Dicke Platte (Rückstreuung). Der Anteil ist aus der Beobachtung bei etwa 90 Grad unter der Annahme gleichmässiger Streuung in alle Richtungen berechnet. Rutherford nennt das Experiment für genaue Rechnungen wenig geeignet. | Geiger und Marsden, zitiert bei Rutherford 1911 |
| Etwa 1 von 20'000 α-Teilchen wird an einer Goldfolie um mehr als 90 Grad abgelenkt | Dünne Folie, Durchstrahlung. Bedingungen und Quelle noch zu nennen. | Angabe von Alain, zu prüfen |

Die beiden Zahlen sind nicht direkt vergleichbar. Das Lab sagt nicht, Platin streue stärker als Gold.

**Rechenprobe zur Folie (Einzelstreuung nach Rutherford, α-Energie von Radium C etwa 7,7 MeV):** Der Anteil über 90 Grad ist gleich der Zahl der Atome pro Fläche mal π mal (1,44 MeV·fm · Z / E)². Für Gold mit 1,2 µm Dicke ergibt das 1 : 20'600. Das passt zum genannten Wert 1 : 20'000, wenn die Folie rund 1,2 µm dick war (das Lab stellt den Wert damit als Rechnung dar, nicht als Eingabe). Dicke und Energie der historischen Folie noch prüfen. Bei gleicher Dicke streut Platin rechnerisch nur etwa 9 Prozent stärker als Gold (höhere Dichte, fast gleiche Kernladung). Der Faktor 2,5 zwischen 1 : 8000 und 1 : 20'000 kommt also vom Aufbau (dicke Platte gegen dünne Folie) und nicht vom Material.

**Historische Messreihe zu dicken Schichten (Rutherford 1911, Tabelle):** z ist die relative Zahl der Blitze pro Minute auf einem Zinksulfid-Schirm, gemessen bei diffuser Rückstreuung unter ähnlichen Bedingungen.

| Metall | Atommasse | z | z / A^(3/2) |
| --- | --- | --- | --- |
| Blei | 207 | 62 | 208 |
| Gold | 197 | 67 | 242 |
| Platin | 195 | 63 | 232 |
| Zinn | 119 | 34 | 226 |
| Silber | 108 | 27 | 241 |
| Kupfer | 64 | 14,5 | 225 |
| Eisen | 56 | 10,2 | 250 |
| Aluminium | 27 | 3,4 | 243 |
| Durchschnitt | | | 233 |

Rutherford leitet z / A^(3/2) = konstant aus der Theorie der Einzelstreuung ab (Streuanteil proportional zu n·A²·t, mit nt proportional zu 1 / √A, weil das Bremsvermögen mit √A wächst). Er nimmt dabei die Kernladung proportional zur Atommasse an und schätzt für Platin eine Kernladung von etwa 100 e (heute: 78). Das Lab kann das als Beispiel dafür zeigen, wie sich Modelle durch Messungen verbessern. Die Messweise der Tabelle (Zinksulfid-Schirm, Zählung der Blitze) gehört in die Hinweise.

**Geigers Befunde (Quelle: Wikipedia, im Original zu prüfen):**

- Der wahrscheinlichste Ablenkwinkel wächst mit der Dicke des Materials.
- Der wahrscheinlichste Ablenkwinkel ist proportional zur Atommasse des Stoffs.
- Der wahrscheinlichste Ablenkwinkel sinkt mit der Geschwindigkeit der α-Teilchen.

Die Ursache des zweiten Befunds ist die Kernladungszahl, die mit der Atommasse zusammenhängt. Das Lab rechnet intern mit der Kernladungszahl Z und sagt im Text, dass schwerere Atome stärker ablenken, ohne die Masse als Ursache auszugeben.

**Modellregeln der Simulation (von Alain als Physiker zu prüfen):**

- **Kernmodell:** Einzelstreuung nach Rutherford. Die Zahl der Begegnungen mit Ablenkung über dem kleinsten Winkel (0,5 Grad) ist poissonverteilt. Der Winkel jeder Begegnung folgt cot(θ/2) = cot(θmin/2) · √U mit gleichverteiltem U. Die Richtungen werden vektoriell addiert. Der Anteil über 90 Grad folgt aus Z, Dicke und Energie: p90 = n · t · π · (1,44 · Z / E)², mit E in MeV und dem Ergebnis in fm².
- **Kleinwinkelanteil:** Unter 0,5 Grad wirkt die Abschirmung durch die Elektronen. Dieser Anteil wird als Gauss-Streuung genähert, mit dem mittleren Winkelquadrat je Achse 4 · p90 · ln(θmin / θAbschirm) und θAbschirm = ħ / (p · a_TF) (Thomas-Fermi-Radius). Für Gold mit 1,2 µm und 7,7 MeV ergibt die Rechnung einen mittleren Ablenkwinkel (Median) von etwa 2,5 Grad. Geigers gemessenen Wert dazu prüfen.
- **Thomson-Atom in der Lupe:** Die positive Ladung ist gleichmässig in einer Kugel mit dem Radius R verteilt (R = halber Atomabstand im Festkörper, Gold etwa 128 pm). Die Kraft auf das α-Teilchen wächst innen linear mit dem Abstand von der Mitte und fällt ausserhalb wie 1/r². Die grösste Ablenkung ist etwa s = Z·2·e² / (4π ε0 · R · E), für Gold bei 7,7 MeV etwa 0,013 Grad (die Grössenordnung 0,01 Grad nennt auch die Geschichte des Versuchs). Ausserhalb des Atoms stimmt die Rechnung auf 1 bis 3 Prozent mit der Punktladungsformel überein. Für die Zeichnung wird die Querabweichung mit einem Faktor von etwa 0,4 / s (gerundet auf 1, 2, 5 oder 10 mal Zehnerpotenz; Gold: 2000, Aluminium: 10 000) vergrössert und als solche beschriftet.
- **Thomson-Modell:** Die Gesamtstreuung ist gaussverteilt, mit demselben Kern wie im Kernmodell (Rutherfords Argument: Kleine Winkel unterscheiden die Modelle nicht, grosse schon). Es fehlen die seltenen grossen Winkel: Über 20 Grad tritt auch bei vier Millionen Teilchen nichts auf. Diese Modellannahme ist vereinfacht und noch zu prüfen.
- **Zähler:** «Von N Teilchen kamen k zurück», mit Zeitraffer. Einzelne Blitze nur für die ersten Teilchen, danach Verteilung über Winkelbereiche.

## 5. Darstellung und Wortwahl

- Wie in den anderen Labs: Hinweis «Modell», Hintergrund in flachen Tönen statt Verlauf, Atome ohne Farbe.
- Das Atom erscheint als gestrichelter Umriss mit dem Kern als sehr kleinem Punkt. Die Elektronen werden nicht gezeichnet (sie lenken α-Teilchen kaum ab), und die Beschriftung sagt es. Keine Bahnen, damit das Bohr-Lab nicht vorweggenommen wird.
- «Leerer Raum – Nichts» gilt hier nur eingeschränkt: Die Ablenkung geschieht durch die elektrische Abstossung, also durch ein Feld. Der Hinweis heisst «kaum Stoff, aber nicht nichts».
- Das α-Teilchen prallt nicht wie eine Billardkugel am Kern ab. Es berührt ihn nie und wird abgestossen. Der Text sagt es ausdrücklich.
- **Flugbahnen** sind schematisch: gerade zur Folie, dort abgelenkt, gerade zum Schirm. Bei kleiner Rate fliegen einzelne Teilchen als Punkte durch das Bild, bei grosser Rate zeigt das Lab nur die Bahnen der stark abgelenkten Teilchen (über 45 Grad). Der Hinweis sagt, dass die Abstossung die Bahn nahe am Kern in Wirklichkeit krümmt.
- **Lupe:** Kleinster Abstand bei frontalem Stoss d = 2 · 1,44 MeV·fm · Z / E (Gold, 7,7 MeV: etwa 29,5 fm), Kernradius etwa 1,2 · A^(1/3) fm (Gold: etwa 7 fm), Radius des α-Teilchens etwa 1,7 fm. Das Teilchen berührt den Kern nicht, solange d grösser ist als der Berührungsabstand. Bei Aluminium und 7,7 MeV ist das nicht der Fall: Die Lupe sagt dann, dass Kernkräfte wirken und die Rechnung nicht mehr gilt. Die falsche Vorstellung (harte Kugel) ist klar als falsch gekennzeichnet.
- Der Kern ist etwa hunderttausendmal kleiner als das Atom. Der Zoom kennzeichnet jede Stufe als nicht massstäblich.

## 6. Technik

- Standalone-HTML, Vanilla JS, Basis-CSS und Schriften zentral, Canvas 2D.
- Zufallsstreuung mit Zeitraffer, Kern ohne DOM.
- Tests mit `node --test`: Der Anteil über 90 Grad liegt für Gold (1,2 µm, 7,7 MeV) innerhalb der statistischen Streuung bei 1 : 20'600. Die Winkelhäufigkeit folgt 1 / sin⁴(θ / 2). Der wahrscheinlichste Winkel wächst mit Dicke und Z und sinkt mit der Energie. Thomson liefert bei vier Millionen Teilchen keine Ablenkung über 20 Grad. Die Bahnen der Lupe stimmen mit der Rutherford-Formel überein (Winkel θ = 2 · arctan(d / (2b)) und kleinster Abstand r = (d / 2) · (1 + √(1 + (2b / d)²)); Abweichung in der Demo unter 0,01 Grad und 0,05 Prozent).

## 7. Abnahmekriterien (Entwurf)

1. Mit dem Kernmodell ergibt eine Million Teilchen auf Gold (1,2 µm, 7,7 MeV) etwa 49 Ablenkungen über 90 Grad (1 : 20'600, innerhalb der statistischen Streuung). In der Demo ergaben vier Millionen Teilchen 210 gegen 194 ± 14 erwartete.
2. Mit dem Thomson-Modell gibt es auch bei vier Millionen Teilchen keine Ablenkung über 20 Grad.
3. Der mittlere Ablenkwinkel wächst mit der Dicke, wächst mit Z und sinkt mit der Energie (Test). Die Demo bestätigt das: Gold bei 0,3, 1,2 und 3 µm: 1,2, 2,5 und 4,0 Grad. Aluminium, Kupfer, Silber, Gold bei 1,2 µm: 0,4, 1,1, 1,4 und 2,5 Grad. Gold bei 3, 5 und 7,7 MeV: 6,6, 3,9 und 2,5 Grad.
4. Die Vorhersage steht vor dem Start, danach erscheinen Vorhersage und Ergebnis nebeneinander.
5. Die historischen Messwerte stehen mit ihren Bedingungen da (dicke Platte oder dünne Folie).
   Bei kleiner Rate (bis 200 Teilchen pro Sekunde) fliegen die Teilchen als gleichmässiger Strom ohne Pausen: Die Zahl der gleichzeitig sichtbaren Teilchen bleibt über die Zeit konstant (Test über 60 Bilder pro Sekunde: 240 bei 200 pro Sekunde).
6. Jede Zoomstufe ist als nicht massstäblich gekennzeichnet.
7. Kein Elektron und keine Bahn wird gezeichnet.
8. Tastatur, `prefers-reduced-motion`, Hell und Dunkel, Ziehziele mindestens 44 px, keine Farbe als Träger.

## 8. Offene Entscheide

| Frage | Stand |
| --- | --- |
| Quelle und Bedingungen des Werts 1 : 20'000 für Gold | offen (Alain) |
| Dicke und Energie der historischen Goldfolie | offen |
| Thomson-Modell: Zahlen für die Ablenkung pro Atom und die Gesamtstreuung | offen, in der Demo illustrativ |
| Welche Folien zur Wahl stehen | Demo: Gold, Platin, Silber, Kupfer, Aluminium |
| Messreihe zu dicken Platten (Station 5) für Sek I oder nur für Fortgeschrittene | offen |
| Elektronen nicht zeichnen oder als Hinweis andeuten | Entwurf: nicht zeichnen |
| Werte der Lupe (Kernradius 1,2 · A^(1/3) fm, α-Radius 1,7 fm, Thomson-Atomradius = halber Atomabstand) | Schätzwerte, zu prüfen |
| Rechtliche Prüfung der Anlehnung an PhET vor dem Verkauf | offen |
| Aufteilung frei oder Lizenz (Gold und Aluminium mit fester Dicke frei, Rest Lizenz) | entschieden; Preis und serverseitige Prüfung offen |
| Platz im Paket und Verhältnis zum Bohr-Lab | Entwurf: nach Lab 2, vor Bohr |
| Wortwahl zur Atommasse (Ursache ist die Kernladungszahl) | Entwurf: siehe Abschnitt 4 |
