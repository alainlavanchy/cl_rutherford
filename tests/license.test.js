// Betriebsart und Lizenz: die neun Fälle aus Auftrag §6 (Logik ohne Oberfläche).
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const BETRIEB = require("../src/config.js");
const { resolveBetrieb, FREI, TEXT } = require("../src/core/license.js");
const RS = require("../src/core/rutherford-core.js");

const q = s => new URLSearchParams(s);
const offen = b => { assert.equal(b.begrenzt, false); assert.ok(["au", "pt", "ag", "cu", "al"].every(b.folieErlaubt)); assert.equal(b.reglerFrei, true); assert.equal(b.messreiheFrei, true); };
const gesperrt = b => {
  assert.equal(b.begrenzt, true);
  assert.deepEqual(["au", "pt", "ag", "cu", "al"].filter(b.folieErlaubt), ["au", "al"]);
  assert.equal(b.reglerFrei, false); assert.equal(b.messreiheFrei, false);
  assert.equal(b.dicke(2.5), FREI.dicke); assert.equal(b.energie(4), FREI.energie);
};

test("Voreinstellung der Datei: alles frei", () => {
  assert.equal(BETRIEB.modus, "alles_frei");
});

test("1 Standard: alles frei", () => {
  const b = resolveBetrieb(BETRIEB, undefined, q(""));
  assert.equal(b.modus, "alles_frei"); offen(b); assert.equal(b.info, TEXT.infoFrei);
});

test("2 ?modus=lizenz verschärft: gesperrt", () => {
  const b = resolveBetrieb(BETRIEB, undefined, q("?modus=lizenz"));
  assert.equal(b.modus, "lizenz"); gesperrt(b); assert.equal(b.info, TEXT.infoBegrenzt);
});

test("3 Link mit gesperrten Werten: Folie, Dicke und Energie werden ignoriert", () => {
  const b = resolveBetrieb(BETRIEB, undefined, q("?modus=lizenz&material=pt&dicke=3&energie=4"));
  assert.deepEqual(b.linkWerte(RS.MATS), {});
  const frei = resolveBetrieb(BETRIEB, undefined, q("?material=pt&dicke=3&energie=4"));
  assert.deepEqual(frei.linkWerte(RS.MATS), { material: "pt", dicke: 3, energie: 4 });
});

test("4 Klick auf gesperrte Folie: Hinweis, keine Wahl", () => {
  const b = resolveBetrieb(BETRIEB, undefined, q("?modus=lizenz"));
  assert.deepEqual(b.waehleFolie("cu"), { ok: false, hinweis: TEXT.folieGesperrt });
});

test("5 Klick auf Aluminium: erlaubt", () => {
  const b = resolveBetrieb(BETRIEB, undefined, q("?modus=lizenz"));
  assert.deepEqual(b.waehleFolie("al"), { ok: true, hinweis: null });
  assert.deepEqual(b.linkWerte(RS.MATS), {});
  assert.deepEqual(resolveBetrieb(BETRIEB, undefined, q("?modus=lizenz&material=al")).linkWerte(RS.MATS), { material: "al" });
});

test("6 Seite setzt lizenz mit aktiver Lizenz: offen", () => {
  const b = resolveBetrieb(BETRIEB, { modus: "lizenz", lizenzAktiv: true }, q(""));
  assert.equal(b.modus, "lizenz"); offen(b); assert.equal(b.info, TEXT.infoAktiv);
});

test("7 ?modus=lizenz und aktive Lizenz: bleibt offen", () => {
  const b = resolveBetrieb(BETRIEB, { modus: "lizenz", lizenzAktiv: true }, q("?modus=lizenz"));
  offen(b);
});

test("8 Seite setzt lizenz ohne aktive Lizenz: gesperrt", () => {
  gesperrt(resolveBetrieb(BETRIEB, { modus: "lizenz", lizenzAktiv: false }, q("")));
  gesperrt(resolveBetrieb(BETRIEB, { modus: "lizenz" }, q("")));
});

test("9 ?modus=frei gegen gesetzten Lizenzbetrieb: bleibt gesperrt", () => {
  const b = resolveBetrieb(BETRIEB, { modus: "lizenz", lizenzAktiv: false }, q("?modus=frei"));
  assert.equal(b.modus, "lizenz"); gesperrt(b);
  assert.equal(resolveBetrieb(BETRIEB, undefined, q("?modus=alles_frei")).modus, "alles_frei");
});

test("lizenzAktiv nur bei true (kein Wahrheitswert aus Text)", () => {
  gesperrt(resolveBetrieb(BETRIEB, { modus: "lizenz", lizenzAktiv: "true" }, q("")));
});
