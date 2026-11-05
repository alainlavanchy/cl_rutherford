// Gleichmässiger Teilchenstrom (Auftrag §5.6) und Rechnen in Stücken.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createStream, createCarry, CAP, FLIGHT_MS, MAX_SINGLE_RATE } = require("../src/core/stream.js");
const { runChunked } = require("../src/core/burst.js");

// Simuliert die Bildschleife der Seite: pro Bild Rate · dt Teilchen erzeugen, landen lassen, zählen.
function simulate(rate, fps, seconds) {
  const s = createStream(), carry = createCarry(), frameMs = 1000 / fps, counts = [];
  for (let f = 0; f < fps * seconds; f++) {
    const now = f * frameMs, n = carry.take(rate, frameMs / 1000);
    s.emit(Array.from({ length: n }, () => ({ a: 0, big: false })), now, frameMs);
    s.land(now);
    counts.push(s.active(now));
  }
  return counts;
}

test("200 pro s bei 60 Bildern pro s: in jedem Bild etwa 240 fliegende Teilchen", () => {
  const counts = simulate(200, 60, 6).slice(60 * 2);   // nach der Anlaufzeit (1,2 s)
  const min = Math.min(...counts), max = Math.max(...counts);
  assert.ok(min >= 236 && max <= 244, "Spanne " + min + " bis " + max);
});

test("5 pro s: etwa 6 gleichzeitig", () => {
  const counts = simulate(5, 60, 6).slice(60 * 2);
  assert.ok(Math.min(...counts) >= 5 && Math.max(...counts) <= 7);
});

test("Obergrenze liegt weit über der höchsten Einzelrate (keine Wellen)", () => {
  assert.ok(CAP >= 2 * MAX_SINGLE_RATE * FLIGHT_MS / 1000, "CAP " + CAP);
});

test("Startzeiten gleichmässig über das Bild verteilt, Ankunft nach 1,2 s", () => {
  const s = createStream();
  s.emit([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }], 1000, 16);
  const t0 = s.list().map(f => f.t0);
  assert.deepEqual(t0, [1002, 1006, 1010, 1014]);
  const landed = [];
  s.land(1000 + FLIGHT_MS + 6, a => landed.push(a));   // t0 1002 und 1006 sind 1,2 s alt
  assert.deepEqual(landed, [1, 2]);
  assert.equal(s.size(), 2);
});

test("Rechnen in Stücken: alle Teilchen, mehrere Stücke, Fortschritt bis 100 %", () => {
  const queue = [];
  let done = 0, steps = 0, last = null, finished = false;
  runChunked({ total: 1000000, step: m => { done += m; steps++; }, schedule: fn => queue.push(fn),
    onProgress: (d, t) => { last = [d, t]; }, onDone: () => { finished = true; }, now: () => 0 });
  while (queue.length) queue.shift()();
  assert.equal(done, 1000000);
  assert.ok(steps >= 5, "Stücke: " + steps);
  assert.deepEqual(last, [1000000, 1000000]);
  assert.equal(finished, true);
});
