// Hauptansicht: Anteil über 90 Grad, Thomson-Modell, Geigers Befunde (Auftrag §5.1, §5.4, §5.5).
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const RS = require("../src/core/rutherford-core.js");

const AU = RS.MATS.au;

test("p90 Gold 1,2 µm 7,7 MeV: 4,86e-5 (1 : 20 595)", () => {
  const p = RS.p90(AU, 1.2, 7.7);
  assert.ok(Math.abs(p - 4.86e-5) / 4.86e-5 < 0.005, "p90 = " + p);
  assert.equal(Math.round(1 / p), 20595);
});

test("Kernmodell, 4 Mio. Teilchen, fester Seed: Zahl über 90° innerhalb 3 σ von 194", () => {
  RS.setSeed(1911);
  const st = RS.newStats();
  RS.run("kern", "au", 1.2, 7.7, 4000000, st, 0);
  const expected = 4000000 * RS.p90(AU, 1.2, 7.7), sigma = Math.sqrt(expected), k = st.counts[5];
  assert.ok(Math.abs(expected - 194.4) < 0.5, "erwartet " + expected);
  assert.ok(Math.abs(k - expected) <= 3 * sigma, "gezählt " + k + ", erwartet " + expected.toFixed(1) + " ± " + sigma.toFixed(1));
  assert.equal(st.n, 4000000);
});

test("Thomson-Modell, 4 Mio. Teilchen: kein Teilchen über 20°", () => {
  RS.setSeed(1911);
  const st = RS.newStats();
  RS.run("thomson", "au", 1.2, 7.7, 4000000, st, 0);
  assert.ok(st.max < 20, "grösster Winkel " + st.max);
  assert.equal(st.counts[3] + st.counts[4] + st.counts[5], 0);
});

// Median mit festem Seed; Referenzwerte der Demo (Spezifikation §7.3), Toleranz 15 %.
function med(mat, t, E) { RS.setSeed(1911); return RS.median("kern", mat, t, E, 40000); }
function near(v, ref) { assert.ok(Math.abs(v - ref) / ref <= 0.15, v.toFixed(2) + "° statt etwa " + ref + "°"); }
function rising(a) { for (let i = 1; i < a.length; i++) assert.ok(a[i] > a[i - 1], "Reihenfolge: " + a.map(x => x.toFixed(2)).join(" / ")); }

test("Median wächst mit der Dicke (Gold 0,3 / 1,2 / 3 µm: 1,2 / 2,5 / 4,0°)", () => {
  const v = [0.3, 1.2, 3].map(t => med("au", t, 7.7));
  rising(v); [1.2, 2.5, 4.0].forEach((r, i) => near(v[i], r));
});

test("Median wächst mit der Kernladung (Al, Cu, Ag, Au bei 1,2 µm: 0,4 / 1,1 / 1,4 / 2,5°)", () => {
  const v = ["al", "cu", "ag", "au"].map(m => med(m, 1.2, 7.7));
  rising(v); [0.4, 1.1, 1.4, 2.5].forEach((r, i) => near(v[i], r));
});

test("Median sinkt mit der Energie (Gold 3 / 5 / 7,7 MeV: 6,6 / 3,9 / 2,5°)", () => {
  const v = [3, 5, 7.7].map(E => med("au", 1.2, E));
  rising(v.slice().reverse()); [6.6, 3.9, 2.5].forEach((r, i) => near(v[i], r));
});

test("Winkelbereiche und Indizes", () => {
  assert.equal(RS.binOf(0.5), 0); assert.equal(RS.binOf(1), 1); assert.equal(RS.binOf(90.1), 5); assert.equal(RS.binOf(180), 5);
  assert.equal(RS.fineIdx(0.05), 0); assert.equal(RS.fineIdx(180), 23);
  assert.equal(RS.angIdx(-Math.PI), 0); assert.equal(RS.angIdx(Math.PI), 89);
  assert.equal(RS.LABELS.length, 6);
});
