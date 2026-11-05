// Historische Messreihe (Auftrag §5.7, Spezifikation §4).
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const RS = require("../src/core/rutherford-core.js");

const SPEC = [
  ["Blei", 207, 62, 208], ["Gold", 197, 67, 242], ["Platin", 195, 63, 232], ["Zinn", 119, 34, 226],
  ["Silber", 108, 27, 241], ["Kupfer", 64, 14.5, 225], ["Eisen", 56, 10.2, 250], ["Aluminium", 27, 3.4, 243]
];

test("Acht Werte wie in der Spezifikation", () => {
  assert.deepEqual(RS.MESSREIHE.map(r => [r.metall, r.A, r.z, r.q]), SPEC);
});

// Die Spalte z / A^(3/2) ist aus der Spezifikation übernommen, nicht nachgerechnet.
// Nachgerechnet (·10⁴) stimmen fünf Zeilen auf ±1. Bei Zinn (262 statt 226), Kupfer (283 statt 225)
// und Eisen (243 statt 250) passt die Spalte nicht zu z und A. Von Alain am Original geprüft (2026-11-05):
// Die Tabelle ist so richtig, die Abweichungen stehen im Original.
const ABWEICHUNG = ["Zinn", "Kupfer", "Eisen"];

test("z / A^(3/2) passt zu z und A, ausser bei den bekannten Abweichungen", () => {
  const off = [];
  for (const r of RS.MESSREIHE) {
    const q = r.z / Math.pow(r.A, 1.5) * 1e4;
    if (Math.abs(q - r.q) > 1) off.push(r.metall);
  }
  assert.deepEqual(off, ABWEICHUNG);
});

test("Durchschnitt 233", () => {
  const avg = RS.MESSREIHE.reduce((s, r) => s + r.q, 0) / RS.MESSREIHE.length;
  assert.equal(Math.round(avg), 233);
  assert.equal(RS.MESSREIHE_MITTEL, 233);
});
