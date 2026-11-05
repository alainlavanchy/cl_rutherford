/**
 * Strom einzelner Teilchen bei kleiner Rate (bis 200 pro Sekunde), ohne DOM.
 *
 * Jedes Teilchen fliegt FLIGHT_MS lang (Quelle → Folie → Schirm); der Treffer
 * erscheint erst bei der Ankunft. Die Startzeiten der in einem Bild erzeugten
 * Teilchen werden gleichmässig über die Dauer dieses Bildes verteilt. So
 * entsteht ein gleichmässiger Strom ohne Wellen.
 *
 * Bekannter Fehler der ersten Fassung: Eine Obergrenze von 80 gleichzeitigen
 * Teilchen erzeugte Wellen (viele, dann keine). Die Obergrenze CAP liegt darum
 * deutlich über der Zahl, die bei der höchsten Einzelrate gleichzeitig fliegt
 * (200 pro s · 1,2 s = 240).
 */
(function (root) {
  "use strict";
  var FLIGHT_MS = 1200;
  var MAX_SINGLE_RATE = 200;   // bis zu dieser Rate fliegt jedes Teilchen einzeln
  var CAP = 700;

  // Zählt Bruchteile von Teilchen über die Bilder hinweg (Rate · dt ist selten ganzzahlig).
  function createCarry() {
    var carry = 0;
    return {
      take: function (rate, dtSec) { carry += rate * dtSec; var n = Math.floor(carry); carry -= n; return n; },
      reset: function () { carry = 0; }
    };
  }

  function createStream(opts) {
    opts = opts || {};
    var flightMs = opts.flightMs || FLIGHT_MS, cap = opts.cap || CAP;
    var flights = [];
    return {
      flightMs: flightMs,
      cap: cap,
      // Teilchen eines Bildes einreihen. items: [{ a: Richtung, big: bool, x: Zusatz }]; frameMs: Dauer des Bildes.
      emit: function (items, now, frameMs) {
        var span = frameMs > 0 ? frameMs : 16, k = items.length;
        for (var i = 0; i < k; i++) {
          if (flights.length >= cap) break;
          flights.push({ a: items[i].a, big: !!items[i].big, x: items[i].x, t0: now + (i + 0.5) / k * span });
        }
      },
      // Angekommene Teilchen entfernen und an onLand(a, big, x) geben.
      land: function (now, onLand) {
        var keep = [];
        for (var i = 0; i < flights.length; i++) {
          var f = flights[i];
          if (now - f.t0 >= flightMs) { if (onLand) onLand(f.a, f.big, f.x); } else keep.push(f);
        }
        flights = keep;
      },
      // Zahl der Teilchen, die zum Zeitpunkt now sichtbar fliegen.
      active: function (now) {
        var c = 0;
        for (var i = 0; i < flights.length; i++) { var ph = now - flights[i].t0; if (ph >= 0 && ph < flightMs) c++; }
        return c;
      },
      list: function () { return flights; },
      size: function () { return flights.length; },
      clear: function () { flights = []; }
    };
  }

  var Stream = { FLIGHT_MS: FLIGHT_MS, MAX_SINGLE_RATE: MAX_SINGLE_RATE, CAP: CAP, createStream: createStream, createCarry: createCarry };
  if (typeof module !== "undefined" && module.exports) module.exports = Stream;
  else root.RSStream = Stream;
})(typeof window !== "undefined" ? window : this);
