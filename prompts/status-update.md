# Prompt: Status aktualisieren (am Ende jeder Sitzung)

Wiederverwendbar, nicht nummeriert. Aufruf in Claude Code, wenn die Arbeit einer Sitzung abgeschlossen ist:

```text
Lies @prompts/status-update.md und führe den Abschnitt «Prompt» aus.
```

Mit dem Zusatz in `CLAUDE.md` genügt später das Stichwort «Status».

## Prompt

```text
Aktualisiere jetzt PROJECT-STATUS.md für die gerade abgeschlossene Sitzung. Ein grobes Protokoll genügt: je Punkt eine Zeile, keine Erklärungen.

Vorgehen:
1. Lies PROJECT-STATUS.md vollständig, vor allem «Letzter erfasster Commit» im Kopf.
2. Ermittle die Commits dieser Sitzung mit
   git log --oneline --reverse <letzter erfasster Commit>..HEAD
   Steht dort noch «–», nimm git log --oneline --reverse. Ignoriere Commits, deren Nachricht mit «docs: status» beginnt.
   Verwende nur echte Hashes aus dieser Ausgabe (7 Zeichen). Erfinde oder schätze nie einen Hash.
3. Prüfe git status. Nicht committete Änderungen nennst du unter «Nicht erledigt» und committest sie nicht ohne meine Freigabe.
4. Führe die Tests aus (node --test) und trage das Ergebnis ein: Anzahl bestanden und fehlgeschlagen. Ging das nicht, schreibe «nicht ausgeführt».
5. Ergänze direkt unter der Zeile «Neueste Sitzung oben» im Sitzungsprotokoll einen Block nach der Vorlage am Ende der Datei: Sitzungsnummer (letzte Nummer plus 1), Datum, Titel, Prompt-Datei, Erledigt (je Punkt mit Commit-Hash in Klammern), Nicht erledigt oder verschoben, Tests, Commit-Tabelle (Hash und Nachricht).
6. Aktualisiere den Rest der Datei:
   - Kopf: Stand (heutiges Datum), Letzter erfasster Commit (der letzte Arbeitscommit dieser Sitzung), Aktueller Fokus, Nächster Schritt.
   - Bauplan: Checkboxen nur abhaken, wenn der Schritt vollständig erledigt ist.
   - Abnahmekriterien: Status und Nachweis nur setzen, wenn ein Test oder Commit es belegt. «teilweise» ist erlaubt.
   - Offene Punkte: neue ergänzen (fortlaufende Nummer O-xx), erledigte als erledigt markieren mit Datum und Hash. Nichts löschen.
   - Entscheide: nur aufnehmen, was ich in dieser Sitzung ausdrücklich festgelegt habe.
   - Änderungsbedarf an der Spezifikation: eintragen, was beim Bauen von docs/rutherford-lab-minispec.md abwich oder fehlte.
7. Ändere keine andere Datei, besonders nicht docs/rutherford-lab-minispec.md und nicht CLAUDE.md.
8. Zeige mir den Diff von PROJECT-STATUS.md. Committe erst nach meinem OK, mit genau einem Commit nur dieser Datei und der Nachricht
   docs: status nach Sitzung N

Regeln:
- Nur festhalten, was belegt ist (Commit, Test oder meine Aussage). Unsicheres kommt als offener Punkt in die Liste.
- Kurz und sachlich. Keine Bewertungen, keine Wiederholung von Inhalten der Spezifikation.
- Wenn Hashes, Tests oder Dateien nicht zusammenpassen, nenne den Widerspruch und frage nach.
```
