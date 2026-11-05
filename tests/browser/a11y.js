/**
 * Browser-Prüfung Barrierefreiheit (Auftrag §7, Design-Skills 12). Aufruf auf dem lokalen Server:
 *   const src = await (await fetch("tests/browser/a11y.js")).text(); await eval(src);
 * Lädt index.html in iframes: normal und mit simulierter reduzierter Bewegung
 * (matchMedia wird vor den Skripten ersetzt). Ergebnis: Liste { pruefung, ok, details }.
 */
(async function () {
  "use strict";
  const html = await (await fetch("index.html")).text();
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function load(query, reduce) {
    return new Promise(function (resolve) {
      const f = document.createElement("iframe");
      f.style.cssText = "position:absolute;left:-9999px;width:1200px;height:900px";
      let doc = html.replace("<head>", "<head><script>history.replaceState(null, '', 'index.html" + query + "');" +
        (reduce ? "var _mm = window.matchMedia.bind(window); window.matchMedia = function (q) { return /reduced-motion/.test(q) ? { matches: true, media: q, addEventListener: function () {}, removeEventListener: function () {} } : _mm(q); };" : "") +
        "</script>");
      let first = true;
      f.onload = function () { if (first) { first = false; const d = f.contentDocument; d.open(); d.write(doc); d.close(); setTimeout(() => resolve(f), 700); } };
      f.src = "index.html";
      document.body.appendChild(f);
    });
  }
  function painted(cv) {
    const d = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data; let h = 0;
    for (let i = 0; i < d.length; i += 64) h = (h * 31 + d[i] + d[i + 3]) | 0;
    return h;
  }
  const out = [], add = (p, ok, details) => out.push({ pruefung: p, ok: !!ok, details: details || "" });

  // ---- normal ----
  let f = await load("?lupe=1", false), d = f.contentDocument, w = f.contentWindow;
  const small = [...d.querySelectorAll("button, input, select, summary, .page-footer a")]
    .filter(e => e.offsetParent !== null)
    .map(e => { const r = e.getBoundingClientRect(); return { e: e.id || e.textContent.trim().slice(0, 20) || e.tagName, h: Math.round(r.height), w: Math.round(r.width) }; })
    .filter(x => x.h < 44 || x.w < 44);
  add("Touch-Ziele mindestens 44 px (Knöpfe, Regler, Aufklapper, Fusslinks)", small.length === 0, JSON.stringify(small));
  const inline = [...d.querySelectorAll(".breadcrumb a, .lp-link")].map(a => Math.round(a.getBoundingClientRect().height));
  add("Textlinks im Fliesstext (zur Kenntnis, WCAG 2.5.8 nimmt sie aus)", true, "Höhen " + inline.join(", ") + " px");
  const toggles = ["runBtn", "lupeBtn", "lupeStream", "lupeAuto", "lupeBil", "lupeTgt"].filter(id => !d.getElementById(id).hasAttribute("aria-pressed"));
  const groups = [...d.querySelectorAll("[data-model],[data-mat],[data-rate]")].filter(b => !b.hasAttribute("aria-pressed"));
  add("Schalter mit aria-pressed", toggles.length === 0 && groups.length === 0, toggles.concat(groups.map(b => b.textContent)).join(", "));
  add("Lupe: Strahl und Bahnwechsel an (normal)", d.getElementById("lupeStream").getAttribute("aria-pressed") === "true" && d.getElementById("lupeAuto").getAttribute("aria-pressed") === "true");
  add("Canvas mit Textalternative", d.getElementById("cv").getAttribute("role") === "img" && d.getElementById("cv").getAttribute("aria-label").length > 40, d.getElementById("cv").getAttribute("aria-label").slice(0, 60));
  add("Ergebnis als role=status", d.getElementById("result").getAttribute("role") === "status");
  const hs = [...d.querySelectorAll("h1, h2, h3")].map(h => h.tagName + ":" + (h.textContent.trim() || "(leer)"));
  add("Überschriften: eine h1, Abschnitte als h2", hs[0].startsWith("H1") && hs.filter(h => h.startsWith("H1")).length === 1, hs.join(" | "));
  add("lang=de", d.documentElement.lang === "de");
  const labels = [...d.querySelectorAll("input[type=range]")].filter(i => !d.querySelector('label[for="' + i.id + '"]'));
  add("Regler mit Beschriftung (label for)", labels.length === 0, labels.map(i => i.id).join(", "));
  // Fokusring: Tastaturfokus simulieren über :focus-visible ist nicht möglich; geprüft wird die Regel der Basis-CSS
  const b = d.getElementById("runBtn"); b.focus();
  add("Fokus setzbar auf Knöpfe", d.activeElement === b);
  // Lauf: Ergebnis ruht während des Laufs, Ansage bei Pause
  b.click(); await sleep(400);
  const liveRun = d.getElementById("result").getAttribute("aria-live");
  b.click(); await sleep(100);
  add("Ergebnis-Ansage ruht im Lauf und kommt bei Pause", liveRun === "off" && d.getElementById("result").getAttribute("aria-live") === "polite", "im Lauf: " + liveRun);
  f.remove();

  // ---- reduzierte Bewegung ----
  f = await load("?lupe=1", true); d = f.contentDocument;
  add("Reduziert: Lupe ohne Strahl und ohne Bahnwechsel", d.getElementById("lupeStream").getAttribute("aria-pressed") === "false" && d.getElementById("lupeAuto").getAttribute("aria-pressed") === "false");
  await sleep(1500);   // Schriften laden, danach wird einmal neu gezeichnet
  const cv = d.getElementById("cv"), series = [];
  // Ein einmaliger Wechsel kurz nach dem Laden ist das Neuzeichnen mit den geladenen Schriften; verlangt ist Stillstand danach
  for (let i = 0; i < 6; i++) { series.push(painted(cv)); await sleep(250); }
  const h1 = series[5];
  add("Reduziert: Lupe steht still (Endzustand)", series.slice(3).every(x => x === h1), series.join(", "));
  d.getElementById("lupeGo").click(); await sleep(900);   /* iframes ausserhalb des Bilds zeichnet Chrome gedrosselt */ const h2 = painted(cv);
  d.getElementById("lupeGo").click(); await sleep(900);   /* iframes ausserhalb des Bilds zeichnet Chrome gedrosselt */ const h3 = painted(cv);
  add("Reduziert: «Teilchen losschicken» geht in Schritten", h2 !== h1 && h3 !== h2);
  d.getElementById("lupeClose").click(); await sleep(100);
  d.querySelector('[data-rate="200"]').click(); d.getElementById("runBtn").click(); await sleep(1000);
  d.getElementById("runBtn").click(); const g0 = painted(cv); await sleep(800); const g1 = painted(cv);
  add("Reduziert: nach Pause keine Bewegung (keine Flüge, kein Verglimmen)", g0 === g1);
  f.remove();
  return out;
})();
