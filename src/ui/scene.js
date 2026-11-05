/**
 * Hauptansicht: Quelle, Folie, kreisförmiger Schirm, Balken je Richtung, Blitze,
 * Flugbahnen, fliegende Teilchen, Atom-Kärtchen und Diagramm.
 * Farben (Entscheid 2026-11-05): Szene im Leitton (Pflaume): Blitze, Flugbahnen, fliegende
 * Teilchen, Balken. Quelle, Folie und Schirm in Tusche, Hilfslinien als Haarlinie.
 * Starke Ablenkung (über 45°) = grösserer, voller Punkt ohne Ring; die Grösse ist die zweite
 * Information neben der Deckkraft.
 */
(function (root) {
  "use strict";
  var LAYOUTS = {
    wide: {
      name: "wide", W: 960, H: 500, CX: 330, CY: 250, R: 165, SX: 50,
      head: [[14, 20, "Schirm: jeder Punkt ein Blitz."], [14, 37, "Balken aussen: Zahl der Teilchen je Richtung (logarithmisch)."]],
      atom: { x: 668, y: 100, tx: 722 },
      chart: { x0: 650, x1: 925, y0: 240, y1: 440 }
    },
    narrow: {
      name: "narrow", W: 520, H: 880, CX: 285, CY: 285, R: 160, SX: 36,
      head: [[12, 22, "Schirm: jeder Punkt ein Blitz."], [12, 42, "Balken aussen: Zahl der Teilchen"], [12, 62, "je Richtung (logarithmisch)."]],
      atom: { x: 64, y: 540, tx: 118 },
      chart: { x0: 120, x1: 495, y0: 700, y1: 810 }
    }
  };
  var FLIGHT_MS = 1200;

  function pos(L, alpha, r) { r = r || L.R; return [L.CX + r * Math.cos(alpha), L.CY - r * Math.sin(alpha)]; }

  // Rasterton (Punkte im Leitton) in einem Kreis: Thomson-Atom mit verteilter Ladung
  function screentoneCircle(ctx, x, y, r, color) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = color; ctx.globalAlpha = 0.55;
    for (var gx = x - r; gx <= x + r; gx += 5) for (var gy = y - r; gy <= y + r; gy += 5) {
      ctx.beginPath(); ctx.arc(gx + ((gy - y + r) / 5 % 2 ? 2.5 : 0), gy, 1.1, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function draw(stage, pal, v) {
    var ctx = stage.ctx, L = stage.layout;
    stage.begin();
    ctx.textBaseline = "alphabetic";

    // Balken aussen: Zahl der Teilchen je Richtung (logarithmisch). Zeigt auch dann etwas, wenn alle fast gerade durchgehen.
    var st = v.S[v.model];
    ctx.strokeStyle = pal.accent; ctx.lineWidth = 6; ctx.globalAlpha = 0.75;
    for (var a = 0; a < 90; a++) {
      var c = st.ang[a]; if (!c) continue;
      var len = Math.min(64, 9 * Math.log(1 + c) / Math.LN10), al = -Math.PI + (a + 0.5) * 2 * Math.PI / 90;
      var p0 = pos(L, al, L.R + 4), p1 = pos(L, al, L.R + 4 + len);
      ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Schirm
    ctx.strokeStyle = pal.line; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(L.CX, L.CY, L.R, 0, Math.PI * 2); ctx.stroke();

    ctx.fillStyle = pal.soft; ctx.font = stage.ui(12); ctx.textAlign = "left";
    L.head.forEach(function (h) { ctx.fillText(h[2], h[0], h[1]); });
    ctx.textAlign = "center"; ctx.font = stage.ui(12);
    [[0, "0°"], [90, "90°"], [180, "180°"], [270, "90°"]].forEach(function (t) {
      var rad = t[0] * Math.PI / 180, x = L.CX + (L.R - 22) * Math.cos(rad), y = L.CY - (L.R - 22) * Math.sin(rad) + (t[0] === 180 ? 20 : 4);
      ctx.fillText(t[1], x, y);
    });

    // Strahlachse (Hilfslinie)
    ctx.setLineDash([6, 6]); ctx.strokeStyle = pal.soft; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(L.SX + 20, L.CY); ctx.lineTo(L.CX, L.CY); ctx.stroke(); ctx.setLineDash([]);

    // Quelle und Folie (Tusche)
    ctx.fillStyle = pal.line; ctx.fillRect(L.SX - 20, L.CY - 14, 40, 28);
    ctx.fillStyle = pal.text; ctx.font = stage.title(20); ctx.textAlign = "center";
    ctx.fillText("Quelle", L.SX + 4, L.CY + 42);
    var fw = 4 + v.thick * 2;
    ctx.fillStyle = pal.line; ctx.fillRect(L.CX - fw / 2, L.CY - 70, fw, 140);
    ctx.fillStyle = pal.text; ctx.fillText("Folie", L.CX, L.CY - 80);
    ctx.fillStyle = pal.soft; ctx.font = stage.ui(12); ctx.fillText("Klick auf die Folie: Lupe", L.CX, L.CY + 92);

    // Flugbahnen stark abgelenkter Teilchen (schematisch: gerade zur Folie, dort abgelenkt, gerade zum Schirm)
    ctx.lineWidth = 1.6; ctx.strokeStyle = pal.accent; ctx.globalAlpha = 0.7;
    v.tracks.forEach(function (al) { var p = pos(L, al); ctx.beginPath(); ctx.moveTo(L.SX + 20, L.CY); ctx.lineTo(L.CX, L.CY); ctx.lineTo(p[0], p[1]); ctx.stroke(); });
    ctx.globalAlpha = 1;

    // Blitze auf dem Schirm: kleine Punkte, halb deckend, als ein Pfad (schnell auch bei 14 000 Punkten)
    if (v.dots.length) {
      ctx.beginPath();
      for (var i = 0; i < v.dots.length; i++) { var p2 = pos(L, v.dots[i]); ctx.rect(p2[0] - 1.5, p2[1] - 1.5, 3, 3); }
      ctx.fillStyle = pal.accent; ctx.globalAlpha = 0.45; ctx.fill(); ctx.globalAlpha = 1;
    }
    // Starke Ablenkung (über 45°): grösserer, voller Punkt, ohne Ring
    ctx.fillStyle = pal.accent; ctx.beginPath();
    for (var j = 0; j < v.bigs.length; j++) { var q = pos(L, v.bigs[j]); ctx.moveTo(q[0] + 4.5, q[1]); ctx.arc(q[0], q[1], 4.5, 0, Math.PI * 2); }
    ctx.fill();

    // Fliegende Teilchen
    ctx.fillStyle = pal.accent;
    v.flights.forEach(function (f) {
      var ph = (v.now - f.t0) / FLIGHT_MS, x, y;
      if (ph < 0 || ph >= 1) return;
      if (ph < 0.5) { x = L.SX + 20 + (L.CX - L.SX - 20) * ph * 2; y = L.CY; }
      else { var p = pos(L, f.a); x = L.CX + (p[0] - L.CX) * (ph - 0.5) * 2; y = L.CY + (p[1] - L.CY) * (ph - 0.5) * 2; }
      ctx.beginPath(); ctx.arc(x, y, 3.4, 0, Math.PI * 2); ctx.fill();
    });

    // Atom-Kärtchen: gestrichelter Umriss; Kern als Punkt oder verteilte Ladung als Rasterton
    var A = L.atom;
    if (v.model === "thomson") screentoneCircle(ctx, A.x, A.y, 37, pal.accent);
    ctx.strokeStyle = pal.line; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.arc(A.x, A.y, 38, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    if (v.model === "kern") { ctx.fillStyle = pal.text; ctx.beginPath(); ctx.arc(A.x, A.y, 2.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.textAlign = "left"; ctx.fillStyle = pal.text; ctx.font = stage.title(22);
    ctx.fillText(v.model === "kern" ? "Kernmodell" : "Thomson-Modell", A.tx, A.y - 16);
    ctx.fillStyle = pal.soft; ctx.font = stage.ui(12);
    var lh = Math.max(12, 12 / stage.k) * 1.4;   // Zeilenabstand passend zur Mindestgrösse
    [v.model === "kern" ? "positive Ladung im winzigen Kern" : "positive Ladung gleichmässig verteilt",
      "Elektronen nicht gezeichnet,", "nicht massstäblich"].forEach(function (t, i) { ctx.fillText(t, A.tx, A.y + 4 + i * lh); });

    root.RSChart.drawChart(stage, L.chart, v.S, pal);
  }

  root.RSScene = { LAYOUTS: LAYOUTS, draw: draw, FLIGHT_MS: FLIGHT_MS };
})(window);
