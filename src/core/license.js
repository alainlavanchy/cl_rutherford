/**
 * Betriebsart und Lizenz auflösen (ohne DOM). Regeln wie in der Referenzdemo.
 * Sicherheitshinweis: siehe src/config.js. Sperren im Browser sind nur eine Hürde.
 *
 * resolveBetrieb(betrieb, pageCfg, query)
 *   betrieb: Objekt BETRIEB aus src/config.js
 *   pageCfg: window.COGNIVIO_BETRIEB oder undefined
 *   query:   URLSearchParams oder ein Objekt mit get(name)
 */
(function (root) {
  "use strict";
  var FREI = { folien: ["au", "al"], dicke: 1.2, energie: 7.7 };
  var TEXT = {
    folieGesperrt: "Diese Folie gehört zur Lizenz. Frei sind Gold und Aluminium.",
    angebot: "Mit der Lizenz: weitere Folien (Platin, Silber, Kupfer), Dicke und Energie frei wählen, Messreihe zu acht Metallen, Lehrpersonen-Seite.",
    messreihe: "Die Messreihe zu acht Metallen mit der Aufgabe gehört zur Lizenz.",
    infoBegrenzt: "Betriebsart: Lizenz, ohne aktive Lizenz (Vorschau). Frei: Gold und Aluminium bei fester Dicke und Energie.",
    infoAktiv: "Betriebsart: Lizenz, aktiv. Alle Funktionen offen.",
    infoFrei: "Betriebsart: alles frei (Testphase)."
  };

  function getter(q) {
    if (!q) return function () { return null; };
    if (typeof q.get === "function") return function (k) { return q.get(k); };
    return function (k) { return Object.prototype.hasOwnProperty.call(q, k) ? q[k] : null; };
  }

  function resolveBetrieb(betrieb, pageCfg, query) {
    var cfg = pageCfg || {}, get = getter(query);
    var modus = (cfg.modus || (betrieb && betrieb.modus)) === "lizenz" ? "lizenz" : "alles_frei";
    if (get("modus") === "lizenz") modus = "lizenz";       // der Link kann nur verschärfen
    var aktiv = cfg.lizenzAktiv === true;
    var begrenzt = modus === "lizenz" && !aktiv;

    function folieErlaubt(id) { return !begrenzt || FREI.folien.indexOf(id) >= 0; }
    return {
      modus: modus,
      aktiv: aktiv,
      begrenzt: begrenzt,
      frei: FREI,
      folieErlaubt: folieErlaubt,
      reglerFrei: !begrenzt,
      messreiheFrei: !begrenzt,
      dicke: function (wert) { return begrenzt ? FREI.dicke : wert; },
      energie: function (wert) { return begrenzt ? FREI.energie : wert; },
      // Klick auf eine Folie: { ok, hinweis }
      waehleFolie: function (id) { return folieErlaubt(id) ? { ok: true, hinweis: null } : { ok: false, hinweis: TEXT.folieGesperrt }; },
      // Werte aus dem Link: Folie, Dicke und Energie werden ohne Lizenz ignoriert, wenn sie gesperrt sind.
      linkWerte: function (mats) {
        var out = {}, mat = get("material"), dk = get("dicke"), en = get("energie");
        if (mat && mats && mats[mat] && folieErlaubt(mat)) out.material = mat;
        if (dk && !begrenzt && isFinite(parseFloat(dk))) out.dicke = parseFloat(dk);
        if (en && !begrenzt && isFinite(parseFloat(en))) out.energie = parseFloat(en);
        return out;
      },
      info: begrenzt ? TEXT.infoBegrenzt : (modus === "lizenz" ? TEXT.infoAktiv : TEXT.infoFrei),
      angebot: begrenzt ? TEXT.angebot : null
    };
  }

  var License = { resolveBetrieb: resolveBetrieb, FREI: FREI, TEXT: TEXT };
  if (typeof module !== "undefined" && module.exports) module.exports = License;
  else root.RSLicense = License;
})(typeof window !== "undefined" ? window : this);
