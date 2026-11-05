/**
 * Physik-Kern des Rutherford-Labs (ohne DOM).
 *
 * Herkunft: Block zwischen «// <sim>» und «// </sim>» der Referenzdemo
 * (docs/referenz/demo-rutherford-goldfolie.html). Rechnung und Funktionsnamen
 * sind unverändert übernommen, damit Vergleich und Tests nachvollziehbar bleiben.
 * Neu: MESSREIHE (historische Tabelle, eine Quelle für Seite und Test) und der
 * Export für Browser (window.RS) und Node (module.exports).
 *
 * Schätzwerte (Spezifikation §8, noch zu prüfen): Kernradius 1,2·A^(1/3) fm,
 * Radius des α-Teilchens 1,7 fm, Thomson-Atomradius = halber Atomabstand,
 * Thomson-Gesamtstreuung (illustrativ).
 */
(function (root) {
  "use strict";
  var MATS = {
    au: { name: "Gold", Z: 79, A: 196.97, rho: 19.3 },
    pt: { name: "Platin", Z: 78, A: 195.08, rho: 21.45 },
    ag: { name: "Silber", Z: 47, A: 107.87, rho: 10.49 },
    cu: { name: "Kupfer", Z: 29, A: 63.55, rho: 8.96 },
    al: { name: "Aluminium", Z: 13, A: 26.98, rho: 2.70 }
  };
  var NA = 6.02214e23, KE2 = 1.44;            // KE2 = e²/(4π ε0) in MeV·fm
  var THMIN = 0.5 * Math.PI / 180, COTMIN = 1 / Math.tan(THMIN / 2);
  var EDGES = [0, 1, 5, 20, 45, 90, 180];
  var LABELS = ["unter 1°", "1° bis 5°", "5° bis 20°", "20° bis 45°", "45° bis 90°", "über 90°"];

  // Historische Messreihe zu dicken Schichten (Rutherford 1911, Spezifikation §4).
  // z: relative Zahl der Blitze pro Minute; q: z / A^(3/2) wie in der Tabelle angegeben.
  var MESSREIHE = [
    { metall: "Blei", A: 207, z: 62, q: 208 },
    { metall: "Gold", A: 197, z: 67, q: 242 },
    { metall: "Platin", A: 195, z: 63, q: 232 },
    { metall: "Zinn", A: 119, z: 34, q: 226 },
    { metall: "Silber", A: 108, z: 27, q: 241 },
    { metall: "Kupfer", A: 64, z: 14.5, q: 225 },
    { metall: "Eisen", A: 56, z: 10.2, q: 250 },
    { metall: "Aluminium", A: 27, z: 3.4, q: 243 }
  ];
  var MESSREIHE_MITTEL = 233;

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var rnd = rng(1911);
  function setSeed(s) { rnd = rng(s); }
  function gauss() { var u = 1 - rnd(), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function poisson(l) {
    if (l > 30) { var k = Math.round(l + Math.sqrt(l) * gauss()); return k < 0 ? 0 : k; }
    var L = Math.exp(-l), k2 = 0, p = 1;
    do { k2++; p *= rnd(); } while (p > L);
    return k2 - 1;
  }
  // Atome pro cm² für die Dicke t (µm)
  function nt(m, t) { return m.rho * NA / m.A * t * 1e-4; }
  // Anteil mit Ablenkung über 90 Grad bei Einzelstreuung: n·t·π·(1,44·Z/E)², Fläche in fm² → cm²
  function p90(m, t, E) { var b = KE2 * m.Z / E; return nt(m, t) * Math.PI * b * b * 1e-26; }

  function rotate(d, th, ph) {
    var dx = d[0], dy = d[1], dz = d[2], ax, ay, az;
    if (Math.abs(dz) < 0.9) { ax = 0; ay = 0; az = 1; } else { ax = 1; ay = 0; az = 0; }
    var e1x = ay * dz - az * dy, e1y = az * dx - ax * dz, e1z = ax * dy - ay * dx;
    var l = Math.sqrt(e1x * e1x + e1y * e1y + e1z * e1z); e1x /= l; e1y /= l; e1z /= l;
    var e2x = dy * e1z - dz * e1y, e2y = dz * e1x - dx * e1z, e2z = dx * e1y - dy * e1x;
    var ct = Math.cos(th), st = Math.sin(th), cp = Math.cos(ph), sp = Math.sin(ph);
    d[0] = dx * ct + (e1x * cp + e2x * sp) * st;
    d[1] = dy * ct + (e1y * cp + e2y * sp) * st;
    d[2] = dz * ct + (e1z * cp + e2z * sp) * st;
  }
  var dir = [0, 0, 1];

  // Kleinwinkelanteil: Begegnungen unterhalb von THMIN (Abschirmung durch die Elektronen) als Gauss-Streuung.
  // Mittleres Winkelquadrat je Achse: 4 · p90 · ln(THMIN / θAbschirm); θAbschirm = ħ / (p · a_TF) (Thomas-Fermi-Radius).
  function sigmaSmall(m, t, E) {
    var pc = Math.sqrt(2 * 3727.4 * E), aTF = 0.885 * 52917.7 / Math.cbrt(m.Z), thScr = 197.327 / (pc * aTF);
    return Math.sqrt(4 * p90(m, t, E) * Math.log(THMIN / thScr));
  }
  // Kernmodell: Begegnungen mit Ablenkung über THMIN, poissonverteilt, Winkel nach Rutherford, dazu der Kleinwinkelanteil.
  function kern(m, t, E, out) {
    var lam = p90(m, t, E) * COTMIN * COTMIN, k = poisson(lam), sg = sigmaSmall(m, t, E);
    dir[0] = 0; dir[1] = 0; dir[2] = 1;
    var gx = gauss() * sg, gy = gauss() * sg;
    rotate(dir, Math.sqrt(gx * gx + gy * gy), Math.atan2(gy, gx));
    for (var i = 0; i < k; i++) {
      var c = COTMIN * Math.sqrt(rnd()), th = 2 * Math.atan(1 / c);
      rotate(dir, th, 2 * Math.PI * rnd());
    }
    out.theta = Math.acos(dir[2] > 1 ? 1 : (dir[2] < -1 ? -1 : dir[2]));
    out.alpha = Math.atan2(dir[0], dir[2]);
  }
  // Thomson-Modell: Gesamtstreuung gaussverteilt. Der Kern der Verteilung ist derselbe wie im Kernmodell
  // (Rutherfords Argument: kleine Winkel unterscheiden die Modelle nicht), aber ohne seltene grosse Winkel.
  function thomson(m, t, E, out) {
    var sig = sigmaSmall(m, t, E);
    var tx = gauss() * sig, ty = gauss() * sig, th = Math.sqrt(tx * tx + ty * ty), ph = Math.atan2(ty, tx);
    out.theta = th;
    out.alpha = Math.atan2(Math.sin(th) * Math.cos(ph), Math.cos(th));
  }
  function binOf(deg) {
    for (var i = 1; i < EDGES.length; i++) if (deg < EDGES[i]) return i - 1;
    return EDGES.length - 2;
  }
  // fine: 24 logarithmische Winkelbereiche von 0,1° bis 180°; ang: 90 Richtungen rund um die Folie.
  // max: grösster bisher aufgetretener Winkel in Grad (für den Test «Thomson nie über 20°»).
  function newStats() { return { n: 0, counts: [0, 0, 0, 0, 0, 0], fine: new Array(24).fill(0), ang: new Array(90).fill(0), max: 0 }; }
  function fineIdx(deg) { return deg < 0.1 ? 0 : Math.min(23, Math.floor(Math.log(deg / 0.1) / Math.log(1800) * 24)); }
  function angIdx(alpha) { return Math.min(89, Math.max(0, Math.floor((alpha + Math.PI) / (2 * Math.PI) * 90))); }
  // Zählt ein Teilchen mit Ablenkwinkel deg (Grad) und Richtung alpha in die Statistik.
  function record(stats, deg, alpha) {
    stats.counts[binOf(deg)]++; stats.n++; stats.fine[fineIdx(deg)]++; stats.ang[angIdx(alpha)]++;
    if (deg > stats.max) stats.max = deg;
  }
  // Rechnet n Teilchen. sample: Zahl der Treffer, die für die Zeichnung zurückgegeben werden.
  function run(model, matId, t, E, n, stats, sample) {
    var m = MATS[matId], f = model === "kern" ? kern : thomson, o = { theta: 0, alpha: 0 }, hits = [], big = [];
    var step = Math.max(1, Math.floor(n / Math.max(1, sample)));
    for (var i = 0; i < n; i++) {
      f(m, t, E, o);
      var deg = o.theta * 180 / Math.PI;
      record(stats, deg, o.alpha);
      if (deg > 45) big.push(o.alpha); else if (i % step === 0) hits.push(o.alpha);
    }
    return { hits: hits, big: big };
  }
  // Rechnet n einzelne Teilchen, ohne zu zählen: [{ alpha, deg }]. Für kleine Raten, bei denen
  // erst die Ankunft am Schirm gezählt wird (record).
  function particles(model, matId, t, E, n) {
    var m = MATS[matId], f = model === "kern" ? kern : thomson, o = { theta: 0, alpha: 0 }, out = [];
    for (var i = 0; i < n; i++) { f(m, t, E, o); out.push({ alpha: o.alpha, deg: o.theta * 180 / Math.PI }); }
    return out;
  }
  function median(model, matId, t, E, n) {
    var m = MATS[matId], f = model === "kern" ? kern : thomson, o = {}, a = [];
    for (var i = 0; i < n; i++) { f(m, t, E, o); a.push(o.theta * 180 / Math.PI); }
    a.sort(function (x, y) { return x - y; }); return a[Math.floor(n / 2)];
  }
  // Geometrie für die Lupe (Längen in fm). d: kleinster Abstand bei frontalem Stoss. RN: Kernradius (1,2·A^(1/3)).
  // Rc: Berührungsabstand von Kern und α-Teilchen (Radius des α-Teilchens etwa 1,7 fm). V: halbe Breite des Lupenbilds.
  function niceM(x) { var e = Math.pow(10, Math.floor(Math.log(x) / Math.LN10)), mant = x / e; return e * (mant < 1.5 ? 1 : mant < 3.5 ? 2 : mant < 7.5 ? 5 : 10); }
  // Thomson-Atom: positive Ladung gleichmässig in einer Kugel mit dem Radius R (halber Atomabstand im Festkörper).
  // Längen in pm. s = Z1·Z2·e²/(4π ε0 · R · E) ist zugleich die grösste Ablenkung in Bogenmass. M: Vergrösserung der Ablenkung für die Zeichnung.
  function lupeGeomThomson(m, E, tUm) {
    var n = m.rho * NA / m.A, Rpm = 0.5 * Math.pow(n, -1 / 3) * 1e10, s = 2 * KE2 * m.Z / (Rpm * 1000 * E);
    return { model: "thomson", unit: "pm", d: Rpm, RN: 0, Rc: 0, V: 1.5 * Rpm, b90: 0, layers: tUm * 1e-4 * Math.cbrt(n), pLayer: 0, pTotal: 0, reaches: false, s: s, M: niceM(0.4 / s), thetaMax: s * 180 / Math.PI };
  }
  function lupeGeom(matId, E, tUm, model) {
    if (model === "thomson") return lupeGeomThomson(MATS[matId], E, tUm);
    var m = MATS[matId], d = 2 * KE2 * m.Z / E, RN = 1.2 * Math.cbrt(m.A), Rc = RN + 1.7;
    var V = Math.max(40, Math.min(130, 4 * d));
    var n = m.rho * NA / m.A, layers = tUm * 1e-4 * Math.cbrt(n), b90 = d / 2;
    var areaAtom = Math.pow(n, -2 / 3) * 1e26;                       // fm² je Atom in einer Lage
    var pLayer = Math.PI * b90 * b90 / areaAtom;
    return { model: "kern", unit: "fm", d: d, RN: RN, Rc: Rc, V: V, b90: b90, layers: layers, pLayer: pLayer, pTotal: pLayer * layers, reaches: d < Rc };
  }
  // Bahn eines α-Teilchens im Feld eines ruhenden Kerns. Einheiten: Länge d, Energie E (im Unendlichen), Masse 1, Kraft 1/r².
  // bt: Stossparameter in Einheiten von d. rc: Berührungsabstand in Einheiten von d. Start weit entfernt (60 d);
  // Energie und Drehimpuls werden am Startpunkt so gesetzt, dass sie den Werten im Unendlichen entsprechen.
  function trajectory(bt, rc) {
    var X0 = 60, x = -X0, y = bt, r0 = Math.sqrt(x * x + y * y), vtot = Math.sqrt(2 * (1 - 1 / r0));
    var vy = bt * (Math.SQRT2 - vtot) / X0, vx = Math.sqrt(Math.max(0, vtot * vtot - vy * vy)), t = 0;
    var xs = [x], ys = [y], ts = [0], rmin = r0, touched = false, lastX = x, lastY = y, step = 0;
    function acc(px, py) { var r2 = px * px + py * py, r = Math.sqrt(r2), a = 1 / r2; return [a * px / r, a * py / r]; }
    var a0 = acc(x, y), ax = a0[0], ay = a0[1];
    while (step < 400000) {
      var r = Math.sqrt(x * x + y * y), sp = Math.sqrt(vx * vx + vy * vy), dt = 0.01 * Math.min(r / sp, 20);
      vx += 0.5 * ax * dt; vy += 0.5 * ay * dt;
      x += vx * dt; y += vy * dt; t += dt;
      var an = acc(x, y); ax = an[0]; ay = an[1];
      vx += 0.5 * ax * dt; vy += 0.5 * ay * dt;
      r = Math.sqrt(x * x + y * y); if (r < rmin) rmin = r;
      step++;
      if (rc && r < rc) { touched = true; xs.push(x); ys.push(y); ts.push(t); break; }
      if (Math.hypot(x - lastX, y - lastY) > Math.max(0.01, 0.04 * r)) { xs.push(x); ys.push(y); ts.push(t); lastX = x; lastY = y; }
      if (x > X0 || r > 1.6 * X0) { xs.push(x); ys.push(y); ts.push(t); break; }
    }
    var theta = Math.acos(Math.max(-1, Math.min(1, vx / Math.sqrt(vx * vx + vy * vy))));
    return { x: xs, y: ys, t: ts, theta: theta, rmin: rmin, touched: touched };
  }
  // Bahn durch ein Thomson-Atom. Einheiten: Länge R, Energie E, Masse 1 (v0 = √2). Kraft innen s·r, aussen s/r².
  // Die Querabweichung wird für die Zeichnung um den Faktor M vergrössert (theta bleibt der echte Winkel).
  function thomsonTrajectory(bt, s, M) {
    var X0 = 8, x = -X0, y = bt, vx = Math.SQRT2, vy = 0, t = 0, dt = 0.02, step = 0, rmin = Math.sqrt(x * x + y * y);
    var xs = [x], ys = [bt], ts = [0];
    function acc(px, py) { var r = Math.sqrt(px * px + py * py); if (r < 1e-9) return [0, 0]; var a = r < 1 ? s * r : s / (r * r); return [a * px / r, a * py / r]; }
    var a0 = acc(x, y), ax = a0[0], ay = a0[1];
    while (step < 20000) {
      vx += 0.5 * ax * dt; vy += 0.5 * ay * dt; x += vx * dt; y += vy * dt; t += dt;
      var an = acc(x, y); ax = an[0]; ay = an[1]; vx += 0.5 * ax * dt; vy += 0.5 * ay * dt; step++;
      var r = Math.sqrt(x * x + y * y); if (r < rmin) rmin = r;
      if (step % 3 === 0) { xs.push(x); ys.push(bt + M * (y - bt)); ts.push(t); }
      if (x > X0) break;
    }
    xs.push(x); ys.push(bt + M * (y - bt)); ts.push(t);
    return { x: xs, y: ys, t: ts, theta: Math.abs(Math.atan2(vy, vx)), rmin: rmin, touched: false };
  }
  // Harter Kern (falsche Vorstellung): Gerade, an einer Kugel mit Radius rc gespiegelt.
  function billard(bt, x0, rc) {
    if (Math.abs(bt) >= rc) return { x: [-x0, x0], y: [bt, bt], theta: 0 };
    var hx = -Math.sqrt(rc * rc - bt * bt), nx = hx / rc, ny = bt / rc, vx = 1, vy = 0, dot = vx * nx + vy * ny;
    var rx = vx - 2 * dot * nx, ry = vy - 2 * dot * ny, len = x0 * 1.2;
    return { x: [-x0, hx, hx + rx * len], y: [bt, bt, bt + ry * len], theta: Math.acos(Math.max(-1, Math.min(1, rx))) };
  }

  var RS = {
    MATS: MATS, LABELS: LABELS, EDGES: EDGES, MESSREIHE: MESSREIHE, MESSREIHE_MITTEL: MESSREIHE_MITTEL,
    lupeGeom: lupeGeom, trajectory: trajectory, thomsonTrajectory: thomsonTrajectory, billard: billard,
    p90: p90, run: run, record: record, particles: particles, newStats: newStats, setSeed: setSeed, median: median,
    binOf: binOf, fineIdx: fineIdx, angIdx: angIdx, niceM: niceM
  };
  if (typeof module !== "undefined" && module.exports) module.exports = RS;
  else root.RS = RS;
})(typeof window !== "undefined" ? window : this);
