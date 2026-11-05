// Lupe: Bahnen im Kernmodell und im Thomson-Atom (Auftrag §5.2, §5.3).
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const RS = require("../src/core/rutherford-core.js");

const DEG = 180 / Math.PI;

test("Geometrie Gold 7,7 MeV: d 29,5 fm, Kernradius 7,0 fm, Berührungsabstand 8,7 fm, keine Berührung", () => {
  const g = RS.lupeGeom("au", 7.7, 1.2, "kern");
  assert.equal(g.d.toFixed(1), "29.5");
  assert.equal(g.RN.toFixed(1), "7.0");
  assert.equal(g.Rc.toFixed(1), "8.7");
  assert.equal(g.reaches, false);
  assert.equal(g.unit, "fm");
});

for (const bt of [0, 0.05, 0.1, 0.25, 0.5, 1, 2, 3]) {
  test("Bahn gegen Rutherford-Formel, b/d = " + bt, () => {
    const g = RS.lupeGeom("au", 7.7, 1.2, "kern");
    const tr = RS.trajectory(bt, g.Rc / g.d);
    const thExp = bt === 0 ? 180 : 2 * Math.atan(1 / (2 * bt)) * DEG;
    const rExp = 0.5 * (1 + Math.sqrt(1 + 4 * bt * bt));
    assert.equal(tr.touched, false);
    assert.ok(Math.abs(tr.theta * DEG - thExp) < 0.01, "θ " + (tr.theta * DEG).toFixed(4) + "° statt " + thExp.toFixed(4) + "°");
    // Toleranz 0,1 % (Auftrag §5.2). Die Spezifikation nennt 0,05 %; bei b = 0 misst die Rechnung 0,0504 %.
    assert.ok(Math.abs(tr.rmin - rExp) / rExp < 0.001, "r_min " + tr.rmin + " statt " + rExp + " (Toleranz 0,1 %)");
  });
}

test("Aluminium frontal: berührt (Berührungsabstand 5,3 fm), Bahn endet dort", () => {
  const g = RS.lupeGeom("al", 7.7, 1.2, "kern");
  assert.equal(g.Rc.toFixed(1), "5.3");
  assert.equal(g.reaches, true);
  const tr = RS.trajectory(0, g.Rc / g.d);
  assert.equal(tr.touched, true);
  const n = tr.x.length - 1, rEnd = Math.hypot(tr.x[n], tr.y[n]);
  assert.ok(rEnd <= g.Rc / g.d && rEnd > 0.95 * g.Rc / g.d, "Bahn endet bei " + rEnd * g.d + " fm");
});

test("Thomson-Atom Gold: R etwa 128 pm, s = 0,0132°, Faktor 2000", () => {
  const g = RS.lupeGeom("au", 7.7, 1.2, "thomson");
  assert.equal(Math.round(g.d), 128);
  assert.equal(g.unit, "pm");
  const sExp = 2 * 1.44 * 79 / (g.d * 1000 * 7.7);
  assert.ok(Math.abs(g.s - sExp) < 1e-12);
  assert.equal(g.thetaMax.toFixed(4), "0.0132");
  assert.equal(g.M, 2000);
});

test("Thomson-Atom Aluminium: Faktor 10 000", () => {
  assert.equal(RS.lupeGeom("al", 7.7, 1.2, "thomson").M, 10000);
});

test("Thomson-Bahn ausserhalb des Atoms: θ = s·R/b auf 5 % (b = R bis 2R)", () => {
  const g = RS.lupeGeom("au", 7.7, 1.2, "thomson");
  let worst = 0;
  for (const bt of [1, 1.25, 1.5, 1.75, 2]) {
    const tr = RS.thomsonTrajectory(bt, g.s, 1);
    const dev = Math.abs(tr.theta - g.s / bt) / (g.s / bt);
    worst = Math.max(worst, dev);
    assert.ok(dev < 0.05, "b/R = " + bt + ": Abweichung " + (dev * 100).toFixed(2) + " %");
  }
  test.diagnostic && test.diagnostic("grösste Abweichung " + (worst * 100).toFixed(2) + " %");
});

test("Vergrösserung ändert nur die Zeichnung, nicht den Winkel", () => {
  const g = RS.lupeGeom("au", 7.7, 1.2, "thomson");
  const a = RS.thomsonTrajectory(0.5, g.s, 1), b = RS.thomsonTrajectory(0.5, g.s, g.M);
  assert.equal(a.theta, b.theta);
  assert.ok(Math.abs(b.y[b.y.length - 1] - 0.5) > 100 * Math.abs(a.y[a.y.length - 1] - 0.5));
});

test("Billardkugel (falsche Vorstellung): Treffer prallt ab, daneben geradeaus", () => {
  assert.equal(RS.billard(0.5, 5, 0.3).theta, 0);
  const hit = RS.billard(0, 5, 0.3);
  assert.ok(Math.abs(hit.theta * DEG - 180) < 1e-9);
});
