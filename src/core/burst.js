/**
 * Viele Teilchen in Stücken rechnen, ohne die Seite zu blockieren (ohne DOM).
 *
 * step(m) rechnet m Teilchen. Nach jedem Stück ruft runChunked onProgress(done, total)
 * und plant das nächste Stück mit schedule(fn) (im Browser setTimeout(fn, 0)).
 * Die Stückgrösse passt sich an, damit ein Stück etwa TARGET_MS dauert.
 */
(function (root) {
  "use strict";
  var START_CHUNK = 100000, MIN_CHUNK = 5000, MAX_CHUNK = 200000, TARGET_MS = 30;

  function runChunked(opts) {
    var total = opts.total, left = total, chunk = opts.chunk || START_CHUNK, cancelled = false;
    var schedule = opts.schedule || function (fn) { setTimeout(fn, 0); };
    var clock = opts.now || function () { return Date.now(); };
    function go() {
      if (cancelled) return;
      var m = Math.min(chunk, left), t0 = clock();
      opts.step(m);
      left -= m;
      var ms = clock() - t0;
      if (ms > 0) chunk = Math.max(MIN_CHUNK, Math.min(MAX_CHUNK, Math.round(chunk * TARGET_MS / ms)));
      if (opts.onProgress) opts.onProgress(total - left, total);
      if (left > 0) schedule(go);
      else if (opts.onDone) opts.onDone();
    }
    go();
    return { cancel: function () { cancelled = true; } };
  }

  var Burst = { runChunked: runChunked, START_CHUNK: START_CHUNK, TARGET_MS: TARGET_MS };
  if (typeof module !== "undefined" && module.exports) module.exports = Burst;
  else root.RSBurst = Burst;
})(typeof window !== "undefined" ? window : this);
