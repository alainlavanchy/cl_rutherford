/**
 * Lupe: ein einzelnes Atom. Verhalten und Zeitkonstanten wie in der Referenzdemo.
 * Kernmodell: Kern als Punkt, Massstab in fm, Bahnen aus der Abstossungskraft (RS.trajectory).
 * Thomson-Modell: Atom mit verteilter Ladung, Massstab in pm, Ablenkung um M vergrössert gezeichnet.
 * Farben: markierte Bahn im Leitton (dick, mit Teilchen und Kraftpfeil); übrige Bahnen Tinte weich;
 * Strahlteilchen und Kraftpfeil Tusche; Thomson-Ladung und Zielscheibe als Rasterton im Leitton.
 */
(function (root) {
  "use strict";
  var RS = root.RS;
  // Zeitkonstanten der Demo
  var PX_PER_S = 90;          // weit vom Kern etwa 90 Bildpunkte pro Sekunde
  var HOLD_S = 1.2;           // markierte Bahn bleibt nach dem Durchflug stehen
  var FADE_S = 1;             // dann blendet sie aus
  var NEXT_AFTER_S = 2.2;     // danach wird eine neue Bahn markiert
  var SPAWN_S = 0.35;         // alle 0,35 s ein neues Strahlteilchen
  var STREAM_MAX = 24;        // höchstens 24 Strahlteilchen gleichzeitig
  var FAN = [0.06, 0.14, 0.26, 0.42, 0.62, 0.85];   // feste Bahnen (Anteil der Bildbreite)

  var GEO = {
    // legend: [x, y Kernmodell, y Thomson]; notes: Erklärtext unter der Legende (schmal steht er nur im Panel darunter)
    wide: { LX: 470, LY: 250, LR: 185, title: [16, 34], sub: [16, 54], mini: true, legend: [690, 120, 150], factor: [690, 80], notes: true },
    narrow: { LX: 260, LY: 350, LR: 210, title: [14, 34], sub: [14, 62], mini: false, legend: [24, 650, 730], factor: [24, 650], notes: false }
  };

  function de(v, d) { return Number(v).toFixed(d).replace(".", ","); }
  function fmtN(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function fd(v) { return String(Number(v.toPrecision(2))).replace(".", ","); }

  function createLupe(opts) {
    // opts: stage, reduce, params() → { mat, E, t, model }, onInfo(html), onToggles(state)
    var stage = opts.stage, reduce = opts.reduce;
    var L = { open: false, b: 15, geom: null, fan: [], sel: null, bil: null, showBil: false, showTgt: false,
      t0: 0, fixed: null, iw: [0, 1], stream: !reduce, fl: [], acc: 0, cache: {}, auto: !reduce, sgn: 1, step: 0 };
    if (reduce) L.fixed = 1;   // ohne Bewegung: Endzustand der markierten Bahn

    function G() { return GEO[stage.layout.name] || GEO.wide; }
    function now() { return performance.now(); }

    function lupeTraj(bu) { var g = L.geom; return g.model === "thomson" ? RS.thomsonTrajectory(bu, g.s, g.M) : RS.trajectory(bu, g.Rc / g.d); }
    // Bahn zu einem Stossparameter (in 0,5-Stufen zwischengespeichert), mit Zeitfenster im Bild
    function pathFor(bAbs) {
      var g = L.geom, key = Math.round(bAbs * 2) / 2, c = L.cache[key];
      if (!c) {
        var tr = lupeTraj(key / g.d), rv = g.V / g.d, a = -1, z = -1;
        for (var i = 0; i < tr.x.length; i++) if (Math.hypot(tr.x[i], tr.y[i]) <= rv * 1.02) { if (a < 0) a = i; z = i; }
        c = L.cache[key] = { tr: tr, a: Math.max(0, a), z: z < 0 ? tr.x.length - 1 : z };
      }
      return c;
    }
    function posAt(c, tt) {
      var tr = c.tr; if (tt > tr.t[c.z]) return null;
      var idx = c.a; while (idx < c.z - 1 && tr.t[idx + 1] <= tt) idx++;
      var j = Math.min(idx + 1, tr.x.length - 1), f = tr.t[j] > tr.t[idx] ? Math.max(0, Math.min(1, (tt - tr.t[idx]) / (tr.t[j] - tr.t[idx]))) : 0;
      return [tr.x[idx] + f * (tr.x[j] - tr.x[idx]), tr.y[idx] + f * (tr.y[j] - tr.y[idx])];
    }
    // Sekunden je Zeiteinheit der Rechnung
    function spu() { var g = L.geom, k = G().LR / g.V; return Math.SQRT2 * k * g.d / PX_PER_S; }
    function dur() { var tr = L.sel; return Math.max(0.001, tr.t[L.iw[1]] - tr.t[L.iw[0]]) * spu(); }
    function fade(t) {
      if (!L.auto || L.fixed !== null) return 1;
      var after = (t - L.t0) / 1000 - dur();
      return after <= HOLD_S ? 1 : Math.max(0, 1 - (after - HOLD_S) / FADE_S);
    }
    function next() {
      var g = L.geom, lo = Math.log(Math.max(0.5, 0.1 * g.d)), hi = Math.log(g.V * 0.9);
      L.b = Math.round(Math.exp(lo + Math.random() * (hi - lo)) * 2) / 2; L.sgn = Math.random() < 0.5 ? -1 : 1;
      recalc(false, true); L.t0 = now();
    }
    function seed() {
      L.fl = []; L.acc = 0; var t = now(), g = L.geom;
      for (var i = 0; i < 10; i++) { var u = (i * 0.618034) % 1, bb = (u * 2 - 1) * g.V * 0.9; L.fl.push({ b: Math.abs(bb), s: bb < 0 ? -1 : 1, t0: t - i * 450 }); }
    }
    function recalc(resetB, keepStream) {
      var p = opts.params(), g = RS.lupeGeom(p.mat, p.E, p.t, p.model), tm = g.model === "thomson";
      L.geom = g;
      if (!keepStream) { L.cache = {}; if (L.stream) seed(); else L.fl = []; }
      var max = Math.floor(g.V * 0.9);
      if (resetB) L.b = tm ? Math.round(0.9 * g.d) : Math.round(g.b90 * 2) / 2;
      if (L.b > max) L.b = max;
      L.fan = FAN.map(function (f) { return lupeTraj(f * g.V / g.d); });
      L.sel = lupeTraj(L.b / g.d);
      L.bil = tm ? null : RS.billard(L.b / g.d, g.V / g.d * 1.3, g.Rc / g.d);
      var tr = L.sel, rv = g.V / g.d, a = -1, z = -1;
      for (var i = 0; i < tr.x.length; i++) if (Math.hypot(tr.x[i], tr.y[i]) <= rv) { if (a < 0) a = i; z = i; }
      L.iw = a < 0 ? [0, tr.x.length - 1] : [a, z];
      if (opts.onToggles) opts.onToggles({ thomson: tm, max: max, step: tm ? 1 : 0.5, b: L.b });
      info();
    }

    function info() {
      var g = L.geom, tr = L.sel, th = tr.theta * 180 / Math.PI, rmin = tr.rmin * g.d, p = opts.params(), h;
      if (g.model === "thomson") {
        h = "<p>Stossparameter b = <strong>" + de(L.b, 0) + " pm</strong> (Atomradius etwa " + de(g.d, 0) + " pm). Ablenkwinkel (Rechnung): <strong>" + fd(th) + "°</strong>. Grösste Ablenkung an diesem Atom: etwa <strong>" + fd(g.thetaMax) + "°</strong>. In der Zeichnung ist die Ablenkung <strong>" + fmtN(g.M) + "-fach vergrössert</strong>.</p>" +
          "<p>Die positive Ladung ist über das ganze Atom verteilt, deshalb ist die Kraft überall klein: Innen wächst sie mit dem Abstand von der Mitte, ausserhalb nimmt sie ab. Ein einzelnes Atom lenkt das Teilchen nur minimal ab. Erst viele Atome hintereinander ergeben wenige Grad. Eine Ablenkung über 90° ist in diesem Modell nicht möglich.</p>";
        opts.onInfo(h, de(L.b, 1) + " pm"); return;
      }
      h = "<p>Stossparameter b = <strong>" + de(L.b, 1) + " fm</strong>. " +
        (tr.touched ? "Das Teilchen erreicht hier den Berührungsabstand, danach gilt die Rechnung nicht mehr. " : "Ablenkwinkel (Rechnung): <strong>" + de(th, 1) + "°</strong>. Kleinster Abstand zum Kern: <strong>" + de(rmin, 1) + " fm</strong>. ") +
        "Kernradius etwa " + de(g.RN, 1) + " fm, Berührungsabstand etwa " + de(g.Rc, 1) + " fm.</p>";
      if (g.reaches) h += "<p>Bei diesem Material und dieser Energie kann ein frontal fliegendes Teilchen den Kern erreichen. Dann wirken Kernkräfte, und die Rutherford-Rechnung gilt nicht mehr.</p>";
      else h += "<p>Das Teilchen kommt dem Kern bei frontalem Stoss nie näher als " + de(g.d, 1) + " fm und berührt ihn nicht: Es wird abgestossen, es prallt nicht ab.</p>";
      if (L.showBil) h += "<p>Harte Kugel (falsche Vorstellung): " + (L.b >= g.Rc ? "Bei diesem b flöge das Teilchen geradeaus, nichts würde abgelenkt." : "Das Teilchen würde um " + de(L.bil.theta * 180 / Math.PI, 0) + "° abprallen.") + " Nur Teilchen mit b unter " + de(g.Rc, 1) + " fm würden überhaupt abgelenkt. Das passt weder zu den vielen kleinen Winkeln noch zur gemessenen Verteilung.</p>";
      if (L.showTgt) h += "<p>Zielscheibe: Teilchen mit b unter " + de(g.b90, 1) + " fm werden um mehr als 90° abgelenkt. Pro Atomlage trifft das etwa 1 von " + fmtN(Math.round(1 / g.pLayer)) + " Teilchen. In " + de(p.t, 1) + " µm Folie liegen etwa " + fmtN(Math.round(g.layers)) + " Atomlagen: zusammen etwa 1 von " + fmtN(Math.round(1 / g.pTotal)) + ".</p>";
      opts.onInfo(h, de(L.b, 1) + " fm");
    }

    // ----- Zeichnen -----
    function lpx(xd, yd) { var o = G(), k = o.LR / L.geom.V * L.geom.d; return [o.LX + xd * k, o.LY - yd * k]; }
    function drawPath(ctx, tr, sign, upTo) {
      var n = upTo === undefined ? tr.x.length : upTo; if (n < 2) return;
      ctx.beginPath();
      for (var i = 0; i < n; i++) { var p = lpx(tr.x[i], sign * tr.y[i]); if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); }
      ctx.stroke();
    }
    function screentone(ctx, color, clipFn) {
      ctx.save(); clipFn(); ctx.clip(); ctx.fillStyle = color; ctx.globalAlpha = 0.5;
      var o = G();
      for (var gx = o.LX - o.LR; gx <= o.LX + o.LR; gx += 6) for (var gy = o.LY - o.LR; gy <= o.LY + o.LR; gy += 6) {
        ctx.beginPath(); ctx.arc(gx + ((gy - o.LY) / 6 % 2 ? 3 : 0), gy, 1.2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    function arrow(ctx, x0, y0, x1, y1, color, w) {
      var dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - ux * 6, y1 - uy * 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - ux * 10 + uy * 5.5, y1 - uy * 10 - ux * 5.5); ctx.lineTo(x1 - ux * 10 - uy * 5.5, y1 - uy * 10 + ux * 5.5); ctx.closePath(); ctx.fill();
    }

    function draw(pal, t) {
      var ctx = stage.ctx, g = L.geom, o = G(), LX = o.LX, LY = o.LY, LR = o.LR, k = LR / g.V, tm = g.model === "thomson";
      var f = Math.max(1, 1 / stage.k);   // Abstände wachsen mit der Mindestschrift
      stage.begin(); ctx.textBaseline = "alphabetic";

      ctx.textAlign = "left"; ctx.fillStyle = pal.text; ctx.font = stage.title(24);
      ctx.fillText(tm ? "Lupe: ein Atom im Thomson-Modell" : "Lupe: ein einzelnes Atom", o.title[0], o.title[1]);
      ctx.fillStyle = pal.soft; ctx.font = stage.ui(12);
      var sub = tm ? ["Positive Ladung gleichmässig verteilt.", "Elektronen nicht gezeichnet. Massstab unten."]
        : ["Modell, Ausschnitt um den Kern.", "Atomhülle und Elektronen nicht gezeichnet. Massstab unten."];
      // breit eine Zeile, schmal zwei Zeilen
      if (o.mini) ctx.fillText(sub.join(" "), o.sub[0], o.sub[1]);
      else sub.forEach(function (line, i) { ctx.fillText(line, o.sub[0], o.sub[1] + i * 17 * f); });

      // Mini-Folie mit Verbindung zur Lupe (nur breit)
      if (o.mini) {
        ctx.fillStyle = pal.line; ctx.fillRect(66, LY - 70, 8, 140);
        ctx.strokeStyle = pal.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(70, LY, 15, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = pal.text; ctx.textAlign = "center"; ctx.font = stage.title(20); ctx.fillText("Folie", 70, LY - 82);
        var a1 = 140 * Math.PI / 180;
        ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]); ctx.strokeStyle = pal.soft;
        ctx.beginPath(); ctx.moveTo(78, LY - 13); ctx.lineTo(LX + LR * Math.cos(a1), LY - LR * Math.sin(a1)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(78, LY + 13); ctx.lineTo(LX + LR * Math.cos(a1), LY + LR * Math.sin(a1)); ctx.stroke(); ctx.setLineDash([]);
      }

      // Linse
      ctx.save(); ctx.beginPath(); ctx.arc(LX, LY, LR, 0, Math.PI * 2); ctx.fillStyle = pal.surface2; ctx.fill(); ctx.clip();
      if (L.showTgt && !tm) {
        screentone(ctx, pal.accent, function () { ctx.beginPath(); ctx.rect(LX - LR, LY - g.b90 * k, 2 * LR, 2 * g.b90 * k); });
        ctx.strokeStyle = pal.line; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
        ctx.beginPath(); ctx.moveTo(LX - LR, LY - g.b90 * k); ctx.lineTo(LX + LR, LY - g.b90 * k); ctx.moveTo(LX - LR, LY + g.b90 * k); ctx.lineTo(LX + LR, LY + g.b90 * k); ctx.stroke(); ctx.setLineDash([]);
      }
      if (tm) {
        screentone(ctx, pal.accent, function () { ctx.beginPath(); ctx.arc(LX, LY, g.d * k, 0, Math.PI * 2); });
        ctx.strokeStyle = pal.line; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(LX, LY, g.d * k, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = pal.soft; ctx.lineWidth = 1.2; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(LX, LY, g.d * k, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        ctx.setLineDash([1.5, 3]); ctx.beginPath(); ctx.arc(LX, LY, g.Rc * k, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      }
      // Bahnen anderer Teilchen
      ctx.strokeStyle = pal.soft; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.8;
      L.fan.forEach(function (tr) { drawPath(ctx, tr, 1); drawPath(ctx, tr, -1); });
      ctx.globalAlpha = 1;
      var fa = fade(t);
      if (L.showBil && !tm && L.bil) {
        ctx.fillStyle = pal.soft; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.arc(LX, LY, g.Rc * k, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = fa;
        ctx.strokeStyle = pal.text; ctx.lineWidth = 2; ctx.setLineDash([7, 5]); ctx.beginPath();
        var bl = L.bil; for (var i = 0; i < bl.x.length; i++) { var pb = lpx(bl.x[i], L.sgn * bl.y[i]); if (i === 0) ctx.moveTo(pb[0], pb[1]); else ctx.lineTo(pb[0], pb[1]); }
        ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      }
      // Markierte Bahn
      var tr = L.sel, sg = L.sgn, prog = L.fixed !== null ? L.fixed : Math.min(1, (t - L.t0) / 1000 / dur());
      var showP = L.fixed !== null || prog < 1;
      var tw0 = tr.t[L.iw[0]], tw1 = tr.t[L.iw[1]], tt = tw0 + prog * (tw1 - tw0), idx = L.iw[0];
      while (idx < L.iw[1] - 1 && tr.t[idx + 1] <= tt) idx++;
      var n1 = Math.min(idx + 1, tr.x.length - 1);
      var fr = tr.t[n1] > tr.t[idx] ? Math.max(0, Math.min(1, (tt - tr.t[idx]) / (tr.t[n1] - tr.t[idx]))) : 0;
      var px = tr.x[idx] + fr * (tr.x[n1] - tr.x[idx]), py = sg * (tr.y[idx] + fr * (tr.y[n1] - tr.y[idx]));
      ctx.strokeStyle = pal.accent; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.35 * fa; drawPath(ctx, tr, sg); ctx.globalAlpha = fa;
      ctx.lineWidth = 3.2; ctx.beginPath();
      for (var j = 0; j <= idx; j++) { var pj = lpx(tr.x[j], sg * tr.y[j]); if (j === 0) ctx.moveTo(pj[0], pj[1]); else ctx.lineTo(pj[0], pj[1]); }
      var pc = lpx(px, py); ctx.lineTo(pc[0], pc[1]); ctx.stroke(); ctx.globalAlpha = 1;
      // Strahl: mehrere Teilchen mit zufälligem Stossparameter
      if (L.stream) {
        var s = spu(), live = [];
        L.fl.forEach(function (fl) {
          var c = pathFor(fl.b), t2 = c.tr.t[c.a] + (t - fl.t0) / 1000 / s, P = posAt(c, t2);
          if (!P) return; live.push(fl);
          ctx.fillStyle = pal.line;
          for (var s2 = 0; s2 < 4; s2++) {
            var Q = posAt(c, t2 - s2 * 0.12); if (!Q) break;
            var qp = lpx(Q[0], fl.s * Q[1]); ctx.globalAlpha = 0.65 - s2 * 0.15; ctx.beginPath(); ctx.arc(qp[0], qp[1], 3.6 - s2 * 0.6, 0, Math.PI * 2); ctx.fill();
          }
          ctx.globalAlpha = 1;
          if (L.showTgt && fl.b < g.b90) { var pp = lpx(P[0], fl.s * P[1]); ctx.strokeStyle = pal.accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(pp[0], pp[1], 7, 0, Math.PI * 2); ctx.stroke(); }
        });
        L.fl = live;
      }
      // Kern (nur im Kernmodell)
      if (!tm) { ctx.fillStyle = pal.text; ctx.beginPath(); ctx.arc(LX, LY, Math.max(3, g.RN * k), 0, Math.PI * 2); ctx.fill(); }
      // Teilchen und Kraftpfeil (Abstossung, vom Kern weg)
      if (showP) {
        var r = Math.max(1e-6, Math.hypot(px, py)), ux = px / r, uy = py / r, rr = Math.max(1e-6, Math.hypot(px, L.b / g.d));
        var len = tm ? 8 + 62 * (rr < 1 ? rr : 1 / (rr * rr)) : Math.min(70, 10 + 40 * Math.pow(1 / r, 2));
        ctx.fillStyle = pal.accent; ctx.strokeStyle = pal.line; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(pc[0], pc[1], 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        arrow(ctx, pc[0] + ux * 7, pc[1] - uy * 7, pc[0] + ux * (len + 6), pc[1] - uy * (len + 6), pal.line, 2.5);
      }
      ctx.restore();
      ctx.strokeStyle = pal.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(LX, LY, LR, 0, Math.PI * 2); ctx.stroke();

      // Massstab
      var nice = tm ? [10, 20, 50, 100, 200] : [5, 10, 20, 50, 100], M = nice[nice.length - 1];
      for (var m = 0; m < nice.length; m++) if (nice[m] * k >= 60) { M = nice[m]; break; }
      var sx0 = LX - LR, sy = LY + LR + 24 * f;
      ctx.strokeStyle = pal.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx0, sy); ctx.lineTo(sx0 + M * k, sy); ctx.moveTo(sx0, sy - 4); ctx.lineTo(sx0, sy + 4); ctx.moveTo(sx0 + M * k, sy - 4); ctx.lineTo(sx0 + M * k, sy + 4); ctx.stroke();
      ctx.fillStyle = pal.text; ctx.textAlign = "left"; ctx.font = stage.ui(12.5);
      ctx.fillText(tm ? M + " pm  (1 pm = 10⁻¹² m)" : M + " fm  (1 fm = 10⁻¹⁵ m)", sx0 + M * k + 10, sy + 4);

      // Thomson: Vergrösserung gross im Bild
      if (tm) {
        ctx.fillStyle = pal.text; ctx.font = stage.title(40); ctx.textAlign = "left";
        ctx.fillText("× " + fmtN(g.M), o.factor[0], o.factor[1]);
        ctx.font = stage.ui(13, 600); ctx.fillText("Ablenkung so stark vergrössert gezeichnet", o.factor[0], o.factor[1] + 22 * f);
      }

      // Legende
      var lx = o.legend[0], ly = tm ? o.legend[2] : o.legend[1], step = 28 * f;
      ctx.font = stage.ui(12.5); ctx.textAlign = "left";
      function leg(label, sample) { sample(); ctx.fillStyle = pal.text; ctx.fillText(label, lx + 38, ly + 4); ly += step; }
      function line(color, w, dash) { return function () { ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 28, ly); ctx.stroke(); ctx.setLineDash([]); }; }
      leg("Bahnen (Rechnung), Punkte: Strahl", line(pal.soft, 1.4));
      leg("markierte Bahn, Pfeil: Abstossung", function () { line(pal.accent, 3.2)(); arrow(ctx, lx + 6, ly - 9, lx + 26, ly - 9, pal.line, 2); });
      if (tm) leg("Atom: positive Ladung verteilt", function () { ctx.save(); ctx.beginPath(); ctx.rect(lx, ly - 7, 28, 14); ctx.clip(); ctx.fillStyle = pal.accent; ctx.globalAlpha = 0.5; for (var a = 0; a < 28; a += 6) for (var b = 0; b < 14; b += 6) { ctx.beginPath(); ctx.arc(lx + a + 2, ly - 6 + b, 1.2, 0, 7); ctx.fill(); } ctx.restore(); ctx.strokeStyle = pal.line; ctx.lineWidth = 1; ctx.setLineDash([5, 5]); ctx.strokeRect(lx, ly - 7, 28, 14); ctx.setLineDash([]); });
      if (!tm) leg("kleinster Abstand (frontal)", line(pal.soft, 1.2, [5, 5]));
      if (!tm) leg("Berührungsabstand", line(pal.soft, 1.2, [1.5, 3]));
      if (L.showBil && !tm) leg("harte Kugel (falsch)", line(pal.text, 2, [7, 5]));
      if (L.showTgt && !tm) leg("Zielscheibe (über 90°)", function () { ctx.strokeStyle = pal.line; ctx.lineWidth = 1; ctx.setLineDash([2, 4]); ctx.strokeRect(lx, ly - 7, 28, 14); ctx.setLineDash([]); ctx.fillStyle = pal.accent; ctx.globalAlpha = 0.5; for (var a = 2; a < 28; a += 6) for (var b = -4; b < 7; b += 6) { ctx.beginPath(); ctx.arc(lx + a, ly + b, 1.2, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; });
      ctx.fillStyle = pal.soft; ctx.font = stage.ui(12.5);
      var txt = tm ? ["Die Kraft ist überall klein:", "Ein Atom lenkt höchstens um", "etwa " + fd(g.thetaMax) + "° ab."]
        : g.reaches ? ["Bei diesem leichten Kern und dieser", "Energie kann das Teilchen den Kern", "erreichen. Dann wirken Kernkräfte,", "die Rechnung gilt nicht mehr."]
          : ["Der Kern ist ein Punkt aus Stoff,", "die Abstossung ein Feld. Das Teilchen", "wird umgelenkt, ohne den Kern", "zu berühren."];
      if (o.notes) txt.forEach(function (s3, i) { ctx.fillText(s3, lx, ly + 16 * f + i * 18 * f); });
    }

    // ----- Ablauf pro Bild -----
    function tick(dtSec, t) {
      if (!L.open) return;
      if (L.auto && L.fixed === null && L.sel && (t - L.t0) / 1000 - dur() > NEXT_AFTER_S) next();
      if (L.stream && L.geom) {
        L.acc += dtSec / SPAWN_S;
        while (L.acc >= 1) {
          L.acc -= 1;
          if (L.fl.length < STREAM_MAX) { var bb = (Math.random() * 2 - 1) * L.geom.V * 0.9; L.fl.push({ b: Math.abs(bb), s: bb < 0 ? -1 : 1, t0: t }); }
        }
      }
    }
    function animating(t) {
      if (!L.open) return false;
      if (L.stream) return true;
      if (L.fixed !== null) return false;
      return L.auto || (t - L.t0) / 1000 < dur() + 0.05;
    }

    return {
      state: L,
      open: function (on, resetB) { L.open = on; if (on) { recalc(resetB !== false); L.t0 = now(); } },
      recalc: function (resetB) { if (L.open) { recalc(resetB); L.t0 = now(); } },
      setB: function (b) { L.b = b; L.sgn = 1; recalc(false, true); if (!reduce) L.fixed = null; L.t0 = now(); },
      setStream: function (on) { L.stream = on; if (on) seed(); else L.fl = []; },
      setAuto: function (on) { L.auto = on; },
      // «Teilchen losschicken»: mit Bewegung neu starten; ohne Bewegung in Schritten von einem Viertel
      go: function () {
        if (reduce) { L.step = (L.step + 1) % 5; L.fixed = L.step / 4; }
        else { L.fixed = null; L.t0 = now(); }
      },
      setFixed: function (v) { L.fixed = v; },
      setBil: function (on) { L.showBil = on; info(); },
      setTgt: function (on) { L.showTgt = on; info(); },
      tick: tick, draw: draw, animating: animating
    };
  }

  root.RSLupe = { createLupe: createLupe };
})(window);
