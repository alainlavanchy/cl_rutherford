// Keine Farbliterale im Lab (Design-Skills §4.3, §10). Prüft alle Dateien des Labs, die es gibt.
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
function files(dir, ext) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...files(p, ext)); else if (ext.includes(path.extname(e.name))) out.push(p);
  }
  return out;
}

test("keine Hex-, rgb()- oder hsl()-Farben in index.html, assets/*.css, src/**/*.js", () => {
  const list = [path.join(ROOT, "index.html"), ...files(path.join(ROOT, "assets"), [".css"]), ...files(path.join(ROOT, "src"), [".js"])]
    .filter(f => fs.existsSync(f));
  const bad = [];
  for (const f of list) {
    let inTokens = false;   // Token-Definition des Labs (assets/lab.css) ist erlaubt
    fs.readFileSync(f, "utf8").split(/\r?\n/).forEach((line, i) => {
      if (/Token-Definition \(Lab\)/.test(line)) inTokens = true;
      if (/Ende Token-Definition/.test(line)) { inTokens = false; return; }
      if (inTokens) return;
      // Hex-Farben (#abc, #abcd, #aabbcc, #aabbccdd); HTML-Entitäten wie &#8239; zählen nicht
      if (/(?<![&\w])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/.test(line)) bad.push(f + ":" + (i + 1));
      if (/\b(rgba?|hsla?)\(/.test(line)) bad.push(f + ":" + (i + 1));
    });
  }
  assert.deepEqual(bad, []);
});
