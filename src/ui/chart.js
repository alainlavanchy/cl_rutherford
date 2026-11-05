/**
 * Diagramm: Anteil der Teilchen je Winkelbereich, beide Achsen logarithmisch, beide Modelle.
 * Kernmodell: Leitton, durchgezogen. Thomson: --data-5, gestrichelt. Beschriftung in der Legende.
 * Achsen: 0,1° bis 180° (24 Bereiche wie RS.fineIdx), Anteil 1 : 10 Mio. bis alle.
 */
(function (root) {
  "use strict";
  var DASH_THOMSON = [6, 4];

  function drawChart(stage, box, S, pal) {
    var ctx = stage.ctx;
    function chX(deg) { return box.x0 + Math.log(deg / 0.1) / Math.log(1800) * (box.x1 - box.x0); }
    function chY(frac) { return box.y1 - (Math.log(frac) / Math.LN10 + 7) / 7 * (box.y1 - box.y0); }

    // f: Faktor, um den die Schrift für die Mindestgrösse wächst; Abstände wachsen mit
    var f = Math.max(1, 1 / stage.k);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = pal.text; ctx.font = stage.ui(13, 600);
    ctx.fillText("Anteil der Teilchen je Winkelbereich", box.x0 - 20, box.y0 - 40 * f);
    ctx.fillStyle = pal.soft; ctx.font = stage.ui(12);
    ctx.fillText("beide Achsen logarithmisch", box.x0 - 20, box.y0 - 24 * f);

    // Raster (Haarlinien) und Achsen (Tusche)
    ctx.strokeStyle = pal.border; ctx.lineWidth = 1;
    [1e-6, 1e-4, 1e-2, 1].forEach(function (f) { ctx.beginPath(); ctx.moveTo(box.x0, chY(f)); ctx.lineTo(box.x1, chY(f)); ctx.stroke(); });
    ctx.strokeStyle = pal.line; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(box.x0, box.y0); ctx.lineTo(box.x0, box.y1); ctx.lineTo(box.x1, box.y1); ctx.stroke();

    ctx.fillStyle = pal.soft; ctx.font = stage.ui(11.5); ctx.textAlign = "right";
    [[1e-6, "1 : 1 Mio."], [1e-4, "1 : 10 000"], [1e-2, "1 : 100"], [1, "alle"]].forEach(function (t) { ctx.fillText(t[1], box.x0 - 6, chY(t[0]) + 4); });
    ctx.textAlign = "center";
    [[0.1, "0,1°"], [1, "1°"], [10, "10°"], [100, "100°"]].forEach(function (t) {
      ctx.fillText(t[1], chX(t[0]), box.y1 + 17 * f);
      ctx.strokeStyle = pal.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(chX(t[0]), box.y1); ctx.lineTo(chX(t[0]), box.y1 + 4); ctx.stroke();
    });
    ctx.fillText("Ablenkwinkel", (box.x0 + box.x1) / 2, box.y1 + 34 * f);

    // 90-Grad-Marke
    ctx.setLineDash([3, 4]); ctx.strokeStyle = pal.soft; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(chX(90), box.y0); ctx.lineTo(chX(90), box.y1); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = pal.soft; ctx.textAlign = "left"; ctx.fillText("90°", chX(90) + 3, box.y0 + 12);

    var series = [
      { key: "kern", color: pal.accent, dash: [], label: "Kernmodell" },
      { key: "thomson", color: pal.series2, dash: DASH_THOMSON, label: "Thomson" }
    ];
    series.forEach(function (m, k) {
      var st = S[m.key];
      ctx.strokeStyle = m.color; ctx.lineWidth = 2.4; ctx.setLineDash(m.dash);
      if (st.n > 0) {
        var pen = false; ctx.beginPath();
        for (var i = 0; i < 24; i++) {
          var c = st.fine[i];
          if (c === 0 || c / st.n < 1e-7) { pen = false; continue; }
          var d = 0.1 * Math.pow(1800, (i + 0.5) / 24), x = chX(d), y = chY(c / st.n);
          if (pen) ctx.lineTo(x, y); else ctx.moveTo(x, y);
          pen = true;
        }
        ctx.stroke();
      }
      // Legende: Linienmuster plus Name (zweite Information neben der Farbe)
      var lx = box.x0 + 6 + k * 150 * f, ly = box.y0 - 6 * f;
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 26, ly); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = pal.text; ctx.font = stage.ui(12); ctx.textAlign = "left";
      ctx.fillText(m.label + (st.n > 0 ? "" : " (leer)"), lx + 31, ly + 4);
    });
    ctx.setLineDash([]);
  }

  root.RSChart = { drawChart: drawChart };
})(window);
