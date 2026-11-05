# cl_rutherford: Goldfolienversuch (Rutherford-Lab)

Interaktives Lab von Cogniviolabs für die Sekundarstufe I. α-Teilchen fliegen durch eine dünne Folie; die Lernenden vergleichen das Thomson-Modell mit dem Kernmodell, schauen mit der Lupe ein einzelnes Atom an und vergleichen mit den historischen Messwerten.

- Adresse: `https://www.cogniviolabs.com/lab/chem/rutherford_goldfolie/index.html`
- Spezifikation: `docs/rutherford-lab-minispec.md`
- Auftrag: `prompts/01-rutherford-lab.md`
- Stand, Entscheide und offene Punkte: `PROJECT-STATUS.md`
- Konventionen für Claude Code: `CLAUDE.md`

## Starten

Standalone-HTML ohne Build. `index.html` per Doppelklick öffnen oder über einen lokalen Server:

```sh
python -m http.server 8765
# http://127.0.0.1:8765/
```

Basis-CSS und Schriften kommen von `assets.cogniviolabs.com`. Das Overlay «Rechtliches» lädt `/data/legal.json` und funktioniert nur auf dem Server der Plattform.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `index.html` | Seite: Kopf, Szene, Bedienung, Anzeigen, Hinweise, Fuss |
| `assets/lab.css` | Lab-Klassen und das Token `--lab-flash` (nur Tokens, keine Farbwerte sonst) |
| `src/config.js` | Betriebsart (`BETRIEB.modus`), einzige Stelle |
| `src/core/` | Physik und Logik ohne DOM: Streuung, Lupe, Teilchenstrom, Rechnen in Stücken, Lizenz |
| `src/ui/` | Oberfläche und Zeichnen: Szene, Diagramm, Lupe, Bedienung, Seitenrahmen |
| `tests/` | `node --test` (Kern) und `tests/browser/` (Prüfungen im Browser) |

## Tests

```sh
node --test
```

Im Browser, auf dem lokalen Server, in der Konsole der Seite:

```js
const src = await (await fetch("tests/browser/betrieb-ui.js")).text(); await eval(src);   // Betriebsart, 9 Fälle
const src2 = await (await fetch("tests/browser/a11y.js")).text(); await eval(src2);       // Barrierefreiheit, 15 Prüfungen
```

## Link-Parameter (für Screenshots)

`modell`, `material`, `dicke`, `energie`, `theme`, `start`, `modus=lizenz` (nur verschärfen), `lupe`, `strahl`, `auto`, `b`, `t`, `billard`, `ziel`. Die Wirkung steht im Fuss der Seite.

## Betriebsart

`BETRIEB.modus = "alles_frei"` (Voreinstellung) oder `"lizenz"`. Die umgebende Seite kann `window.COGNIVIO_BETRIEB = { modus: "lizenz", lizenzAktiv: true | false }` vor den Skripten setzen. Sperren im Browser sind nur eine Hürde; der echte Schutz liegt serverseitig.
