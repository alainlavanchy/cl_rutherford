/**
 * Hauptansicht: Zustand, Bedienung, Zeitraffer, Tabelle, Ergebnis, Link-Parameter, Bildschleife.
 * Verhalten wie in der Referenzdemo. Anzeige der Lizenzsperren folgt in Schritt 5.
 */
(function () {
  "use strict";
  var RS = window.RS, Stream = window.RSStream, Burst = window.RSBurst;
  var q = new URLSearchParams(location.search);
  var betrieb = window.RSLicense.resolveBetrieb(window.BETRIEB, window.COGNIVIO_BETRIEB, q);
  var reduce = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

  var state = { model: "kern", mat: "au", rate: 20000, running: false, bursting: false };
  var S = { kern: RS.newStats(), thomson: RS.newStats() };
  var dots = [], bigs = [], tracks = [], DOT_CAP = 14000, BIG_CAP = 400, TRACK_CAP = 10;
  var stream = Stream.createStream(), carry = Stream.createCarry();

  function $(id) { return document.getElementById(id); }
  function de(v, d) { return Number(v).toFixed(d).replace(".", ","); }
  function fmtN(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function thick() { return betrieb.dicke(parseFloat($("thick").value)); }
  function energy() { return betrieb.energie(parseFloat($("energy").value)); }
  function cur() { return S[state.model]; }

  // ----- Zeichnen -----
  var pal = window.RSPalette.createPalette(window.RSPalette.bodyResolver(document));
  var dirty = true;
  var stage = window.RSCanvas.createStage($("cv"), $("stage"), window.RSScene.LAYOUTS, function () { dirty = true; kick(); });
  function applyFonts() { stage.setFonts(pal.colors.fontUi, pal.colors.fontTitle); }
  applyFonts();
  var CV_LABEL = $("cv").getAttribute("aria-label");
  var lupe = window.RSLupe.createLupe({
    stage: stage, reduce: reduce,
    params: function () { return { mat: state.mat, E: energy(), t: thick(), model: state.model }; },
    onInfo: function (html, bText) { $("lupeInfo").innerHTML = html; $("lupeBOut").textContent = bText; },
    onToggles: function (o) {
      $("lupeBil").hidden = o.thomson; $("lupeTgt").hidden = o.thomson;
      var sl = $("lupeB"); sl.max = String(o.max); sl.step = String(o.step); sl.value = String(o.b);
      $("cv").setAttribute("aria-label", o.thomson
        ? "Lupe: ein Atom im Thomson-Modell. Die positive Ladung ist gleichmässig verteilt, die Bahnen biegen kaum ab. Die Ablenkung ist vergrössert gezeichnet."
        : "Lupe: ein einzelnes Atom mit Kern als Punkt. Bahnen von α-Teilchen werden vom Kern abgestossen, eine Bahn ist markiert.");
    }
  });
  function lupeOpen(on, resetB) {
    lupe.open(on, resetB);
    $("lupePanel").hidden = !on;
    $("lupeBtn").setAttribute("aria-pressed", String(on));
    if (!on) $("cv").setAttribute("aria-label", CV_LABEL);
    kick();
  }
  function draw(now) {
    if (lupe.state.open) { lupe.draw(pal.colors, now); dirty = false; return; }
    window.RSScene.draw(stage, pal.colors, {
      model: state.model, thick: thick(), S: S, dots: dots, bigs: bigs, tracks: tracks,
      flights: stream.list(), now: now
    });
    dirty = false;
  }

  // ----- Treffer -----
  function land(a, big) {
    if (big) { if (bigs.length < BIG_CAP) bigs.push(a); tracks.push(a); while (tracks.length > TRACK_CAP) tracks.shift(); }
    else { dots.push(a); if (dots.length > DOT_CAP) dots.splice(0, dots.length - DOT_CAP); }
    dirty = true;
  }
  // Bei kleiner Rate fliegt jedes Teilchen einzeln; der Treffer erscheint bei der Ankunft (stream.js).
  function add(res, fly, frameMs, now) {
    if (fly && !reduce) {
      var items = res.hits.map(function (a) { return { a: a, big: false }; })
        .concat(res.big.map(function (a) { return { a: a, big: true }; }));
      stream.emit(items, now, frameMs);
      return;
    }
    res.hits.forEach(function (a) { land(a, false); });
    res.big.forEach(function (a) { land(a, true); });
  }
  function clearHits() { dots = []; bigs = []; tracks = []; stream.clear(); carry.reset(); dirty = true; }
  function reset() { S = { kern: RS.newStats(), thomson: RS.newStats() }; clearHits(); table(); lupe.recalc(false); kick(); }

  // «+ 1 Million sofort»: in Stücken, ohne die Seite zu blockieren
  function burst(n) {
    if (state.bursting) return;
    state.bursting = true; $("burstBtn").disabled = true;
    var model = state.model, mat = state.mat, t = thick(), E = energy(), stats = S[model];
    Burst.runChunked({
      total: n,
      step: function (m) { add(RS.run(model, mat, t, E, m, stats, 400), false); },
      onProgress: function (d, tot) {
        $("burstInfo").textContent = d < tot ? "Rechne: " + fmtN(d) + " von " + fmtN(tot) + " Teilchen." : "";
        table(); kick();
      },
      onDone: function () { state.bursting = false; $("burstBtn").disabled = false; $("burstInfo").textContent = fmtN(n) + " Teilchen gerechnet."; }
    });
  }

  // ----- Tabelle und Ergebnis -----
  function table() {
    var st = cur(), html = "";
    for (var i = 0; i < 6; i++) {
      var c = st.counts[i], sh = st.n ? c / st.n * 100 : 0;
      html += "<tr" + (i === 5 ? ' class="is-big"' : "") + "><td>" + RS.LABELS[i] + "</td><td>" + fmtN(c) + "</td><td>" +
        (st.n ? (sh < 0.01 && c > 0 ? "< 0,01" : de(sh, sh >= 1 ? 1 : 3)) + " %" : "–") + "</td></tr>";
    }
    $("tbl").innerHTML = html;
    var k = st.counts[5], n = st.n;
    $("result").textContent = n === 0 ? "Noch kein Teilchen gerechnet." :
      "Von " + fmtN(n) + " Teilchen wurden " + fmtN(k) + " um mehr als 90 Grad abgelenkt" + (k > 0 ? " (etwa 1 von " + fmtN(Math.round(n / k)) + ")." : ".");
    var p = RS.p90(RS.MATS[state.mat], thick(), energy());
    $("compare").textContent = state.model === "kern"
      ? "Rechnung im Kernmodell für diese Folie: etwa 1 von " + fmtN(Math.round(1 / p)) + ". Historisch: Gold, dünne Folie, etwa 1 von 20 000. Platin, dicke Platte, etwa 1 von 8000 (anderer Aufbau)."
      : "Das Thomson-Modell erwartet praktisch keine Ablenkung über 90 Grad. Historisch gemessen: etwa 1 von 20 000 bei Gold. Lass beide Modelle laufen: Das Diagramm rechts zeigt beide.";
  }
  function messreihe() {
    $("messreiheBody").innerHTML = RS.MESSREIHE.map(function (r) {
      return "<tr><td>" + r.metall + "</td><td>" + r.A + "</td><td>" + String(r.z).replace(".", ",") + "</td><td>" + r.q + "</td></tr>";
    }).join("") + "<tr><td>Durchschnitt</td><td></td><td></td><td>" + RS.MESSREIHE_MITTEL + "</td></tr>";
  }
  function sliders() {
    $("thickOut").textContent = de(thick(), 1) + " µm";
    $("energyOut").textContent = de(energy(), 1) + " MeV";
  }

  // ----- Bedienung -----
  function group(sel, attr, val) {
    document.querySelectorAll(sel).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute(attr) === val)); });
  }
  function setModel(m) { state.model = m; group("[data-model]", "data-model", m); clearHits(); table(); lupe.recalc(true); kick(); }
  function toggle(btn, on) { btn.setAttribute("aria-pressed", String(on)); }
  function setRun(on) {
    state.running = on; var b = $("runBtn");
    b.setAttribute("aria-pressed", String(on)); b.textContent = on ? "Pause" : "Start";
    kick();
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-model")) setModel(b.getAttribute("data-model"));
    else if (b.hasAttribute("data-mat")) {
      var r = betrieb.waehleFolie(b.getAttribute("data-mat"));
      if (!r.ok) return;   // Hinweis zur Lizenz folgt in Schritt 5
      state.mat = b.getAttribute("data-mat"); group("[data-mat]", "data-mat", state.mat); reset();
    }
    else if (b.hasAttribute("data-rate")) { state.rate = parseInt(b.getAttribute("data-rate"), 10); group("[data-rate]", "data-rate", String(state.rate)); }
    else if (b.id === "runBtn") setRun(!state.running);
    else if (b.id === "burstBtn") burst(1000000);
    else if (b.id === "resetBtn") reset();
    else if (b.id === "lupeBtn") lupeOpen(!lupe.state.open, true);
    else if (b.id === "lupeClose") { lupeOpen(false); $("lupeBtn").focus(); }
    else if (b.id === "lupeStream") { lupe.setStream(!lupe.state.stream); toggle(b, lupe.state.stream); kick(); }
    else if (b.id === "lupeAuto") { lupe.setAuto(!lupe.state.auto); toggle(b, lupe.state.auto); kick(); }
    else if (b.id === "lupeGo") { lupe.go(); kick(); }
    else if (b.id === "lupeBil") { lupe.setBil(!lupe.state.showBil); toggle(b, lupe.state.showBil); kick(); }
    else if (b.id === "lupeTgt") { lupe.setTgt(!lupe.state.showTgt); toggle(b, lupe.state.showTgt); kick(); }
  });
  $("lupeB").addEventListener("input", function () { lupe.setB(parseFloat(this.value)); kick(); });
  // Klick auf die Folie öffnet die Lupe
  function onFoil(e) {
    var L = stage.layout, p = stage.toLogical(e.clientX, e.clientY);
    return Math.abs(p[0] - L.CX) < 26 && Math.abs(p[1] - L.CY) < 76;
  }
  $("cv").addEventListener("click", function (e) { if (!lupe.state.open && onFoil(e)) lupeOpen(true, true); });
  $("cv").addEventListener("mousemove", function (e) { this.classList.toggle("is-foil", !lupe.state.open && onFoil(e)); });
  ["thick", "energy"].forEach(function (id) { $(id).addEventListener("input", function () { sliders(); reset(); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (window.RSShell.closeLegal()) return;          // zuerst das Overlay, dann die Lupe
    if (lupe.state.open) { lupeOpen(false); $("lupeBtn").focus(); }
  });

  window.RSShell.onThemeChange(function () { pal.refresh(); applyFonts(); dirty = true; kick(); });
  window.RSShell.initTheme(q.get("theme"));
  window.RSShell.initLegal();

  // ----- Startwerte aus dem Link (für Screenshots) -----
  if (q.get("modell") === "thomson") { state.model = "thomson"; group("[data-model]", "data-model", "thomson"); }
  var lw = betrieb.linkWerte(RS.MATS);
  if (lw.material) { state.mat = lw.material; group("[data-mat]", "data-mat", state.mat); }
  if (lw.dicke !== undefined) $("thick").value = lw.dicke;
  if (lw.energie !== undefined) $("energy").value = lw.energie;
  messreihe(); sliders(); table();
  if (q.get("lupe") === "1") {
    lupe.state.showBil = q.get("billard") === "1"; lupe.state.showTgt = q.get("ziel") === "1";
    if (q.get("strahl") === "0") lupe.state.stream = false;
    if (q.get("auto") === "0") lupe.state.auto = false;
    toggle($("lupeStream"), lupe.state.stream); toggle($("lupeAuto"), lupe.state.auto);
    toggle($("lupeBil"), lupe.state.showBil); toggle($("lupeTgt"), lupe.state.showTgt);
    lupeOpen(true, true);
    if (q.get("b")) lupe.setB(parseFloat(q.get("b")));
    if (q.get("t") !== null && q.get("t") !== "") lupe.setFixed(Math.max(0, Math.min(1, parseFloat(q.get("t")))));
  }
  // start=N: N Teilchen für das gewählte und für das andere Modell sofort rechnen
  var n0 = parseInt(q.get("start"), 10);
  if (!isNaN(n0) && n0 > 0) {
    var other = state.model === "kern" ? "thomson" : "kern";
    RS.run(other, state.mat, thick(), energy(), n0, S[other], 0);
    burst(n0);
  }

  // ----- Bildschleife: läuft nur, solange sich etwas bewegt -----
  var last = null, rafId = null;
  function frame(ts) {
    rafId = null;
    if (last === null) last = ts;
    var dtMs = Math.min(100, ts - last); last = ts;
    var now = performance.now();
    if (state.running) {
      var n = carry.take(state.rate, dtMs / 1000), single = state.rate <= Stream.MAX_SINGLE_RATE;
      if (n > 0) { add(RS.run(state.model, state.mat, thick(), energy(), n, cur(), single ? n : 300), single, dtMs, now); table(); dirty = true; }
    }
    stream.land(now, land);
    lupe.tick(dtMs / 1000, now);
    var moving = state.running || stream.size() > 0 || lupe.animating(now);
    if (moving || dirty) draw(now);
    if (moving) rafId = requestAnimationFrame(frame); else last = null;
  }
  function kick() { dirty = true; if (rafId === null) rafId = requestAnimationFrame(frame); }

  window.RSCanvas.loadFonts(['20px "Patrick Hand"', '12px "Raleway"', '600 12px "Raleway"'], 1500).then(kick);
  kick();
})();
