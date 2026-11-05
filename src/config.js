/**
 * Betriebsart des Labs: die einzige Stelle, an der sie eingestellt wird.
 *
 * modus "alles_frei": alle Funktionen offen (Testphase an der eigenen Schule). Voreinstellung.
 * modus "lizenz":     Betrieb mit Lizenz. Ohne aktive Lizenz sind gesperrt: Platin, Silber, Kupfer,
 *                     die Regler für Dicke und Energie und die Messreihe zu acht Metallen.
 *                     Frei bleiben Gold und Aluminium bei 1,2 µm und 7,7 MeV, beide Modelle,
 *                     Zeitraffer, Diagramm und Lupe.
 *
 * Die umgebende Seite kann VOR diesem Skript setzen:
 *   window.COGNIVIO_BETRIEB = { modus: "lizenz", lizenzAktiv: true | false };
 * lizenzAktiv soll später aus der serverseitigen Prüfung kommen (Tabelle cl_entitlements).
 * Diese Prüfung ist hier nicht gebaut, nur der Anschluss.
 * Der Link kann mit ?modus=lizenz nur verschärfen, nie lockern (?modus=frei ändert nichts).
 *
 * SICHERHEIT: Sperren im Browser sind nur eine Hürde, denn der Code ist lesbar und änderbar.
 * Der echte Schutz liegt serverseitig: Lizenzprüfung, Klassencodes, Lehrpersonen-Seite,
 * Arbeitsblätter und gespeicherte Daten.
 */
var BETRIEB = { modus: "alles_frei", lizenzUrl: "" };
if (typeof module !== "undefined" && module.exports) module.exports = BETRIEB;
