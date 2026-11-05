/**
 * Browser-Test der Betriebsart (Auftrag §6), neun Fälle, in der Oberfläche.
 * Läuft im Browser auf einer Seite desselben Servers wie das Lab (z. B. http://127.0.0.1:8765/):
 *   const src = await (await fetch("tests/browser/betrieb-ui.js")).text(); await eval(src);
 * Jeder Fall lädt index.html in ein iframe; wo die umgebende Seite die Betriebsart setzt,
 * wird window.COGNIVIO_BETRIEB vor src/config.js eingefügt (wie es die Plattform später tut).
 * Ergebnis: Liste { fall, ok, fehler[] }.
 */
(async function () {
  "use strict";
  const html = await (await fetch("index.html")).text();

  function load(query, pageCfg) {
    return new Promise(function (resolve) {
      const f = document.createElement("iframe");
      f.style.cssText = "position:absolute;left:-9999px;width:1200px;height:900px";
      let doc = html;
      if (pageCfg) doc = doc.replace('<script src="src/config.js"></script>',
        "<script>window.COGNIVIO_BETRIEB = " + JSON.stringify(pageCfg) + ";</script>\n<script src=\"src/config.js\"></script>");
      // Erst index.html laden, dann das Dokument neu schreiben. document.open() übernimmt die Adresse
      // der aufrufenden Seite; darum setzt das erste Skript die Adresse mit dem Link-Teil des Falls.
      doc = doc.replace("<head>", "<head><script>history.replaceState(null, '', 'index.html" + query + "');</script>");
      let first = true;
      f.onload = function () {
        if (first) {
          first = false;
          const d = f.contentDocument; d.open(); d.write(doc); d.close();
          setTimeout(function () { resolve(f); }, 600);
        }
      };
      f.src = "index.html" + query;
      document.body.appendChild(f);
    });
  }
  function read(f) {
    const d = f.contentDocument, $ = id => d.getElementById(id);
    const locked = [...d.querySelectorAll("[data-mat]")].filter(b => b.getAttribute("aria-disabled") === "true").map(b => b.dataset.mat);
    const pressed = d.querySelector('[data-mat][aria-pressed="true"]').dataset.mat;
    return {
      locked, pressed,
      lockSvg: [...d.querySelectorAll("[data-mat].is-locked")].every(b => b.querySelector("svg") && /Lizenz/.test(b.textContent)),
      thickDisabled: $("thick").disabled, energyDisabled: $("energy").disabled,
      thick: $("thickOut").textContent, energy: $("energyOut").textContent,
      messreihe: !$("messreihe").hidden, messreiheLock: !$("messreiheLock").hidden,
      info: $("betriebInfo").textContent, hint: $("lizenzHinweis").hidden ? "" : $("lizenzHinweis").textContent
    };
  }
  const OPEN = { locked: [], thickDisabled: false, energyDisabled: false, messreihe: true, messreiheLock: false };
  const SHUT = { locked: ["pt", "ag", "cu"], lockSvg: true, thickDisabled: true, energyDisabled: true, thick: "1,2 µm", energy: "7,7 MeV", messreihe: false, messreiheLock: true };
  const cases = [
    { fall: "1 Standard", q: "", cfg: null, want: Object.assign({ info: /alles frei/ }, OPEN) },
    { fall: "2 ?modus=lizenz", q: "?modus=lizenz", cfg: null, want: Object.assign({ info: /ohne aktive Lizenz/ }, SHUT) },
    { fall: "3 Link mit gesperrten Werten", q: "?modus=lizenz&material=pt&dicke=3&energie=4", cfg: null, want: Object.assign({ pressed: "au" }, SHUT) },
    { fall: "4 Klick auf gesperrte Folie", q: "?modus=lizenz", cfg: null, click: "cu", want: Object.assign({ pressed: "au", hint: /gehört zur Lizenz/ }, SHUT) },
    { fall: "5 Klick auf Aluminium", q: "?modus=lizenz", cfg: null, click: "al", want: Object.assign({ pressed: "al" }, SHUT) },
    { fall: "6 Seite: lizenz, aktiv", q: "", cfg: { modus: "lizenz", lizenzAktiv: true }, want: Object.assign({ info: /Lizenz, aktiv/ }, OPEN) },
    { fall: "7 ?modus=lizenz und aktive Lizenz", q: "?modus=lizenz&material=pt", cfg: { modus: "lizenz", lizenzAktiv: true }, want: Object.assign({ pressed: "pt" }, OPEN) },
    { fall: "8 Seite: lizenz, nicht aktiv", q: "", cfg: { modus: "lizenz", lizenzAktiv: false }, want: Object.assign({ info: /ohne aktive Lizenz/ }, SHUT) },
    { fall: "9 ?modus=frei gegen Lizenzbetrieb", q: "?modus=frei&dicke=3", cfg: { modus: "lizenz", lizenzAktiv: false }, want: SHUT }
  ];
  const out = [];
  for (const c of cases) {
    const f = await load(c.q, c.cfg);
    if (c.click) f.contentDocument.querySelector('[data-mat="' + c.click + '"]').click();
    const got = read(f), fehler = [];
    for (const k of Object.keys(c.want)) {
      const w = c.want[k], g = got[k];
      const ok = w instanceof RegExp ? w.test(g) : JSON.stringify(w) === JSON.stringify(g);
      if (!ok) fehler.push(k + ": " + JSON.stringify(g));
    }
    out.push({ fall: c.fall, ok: fehler.length === 0, fehler });
    f.remove();
  }
  return out;
})();
