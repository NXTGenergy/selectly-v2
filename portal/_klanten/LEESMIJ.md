# Klantportalen — hoe je er een maakt

Elk klantportaal deelt dezelfde indeling. Dat is bewust: structuur is herkenning.
Wat per klant verschilt is de naam, de aanspreking en de accentkleur — verder niets.

## Een nieuwe klant

1. Kopieer `_voorbeeld.json.txt` naar `<slug>.json` (bv. `van-hoye-sanitair.json`)
2. Vul in: `slug`, `bedrijf`, `voornaam`, `accent`
3. `npm run portalen`
4. Commit `portal/<slug>.html` mee — Netlify bouwt niets, hij serveert het bestand

Het portaal is meteen afgeschermd: `netlify.toml` stuurt alles onder `/portal/*`
naar de login, behalve de inlogpagina en de verkoopdemo. Je hoeft daar niets voor
te doen. Wél nodig: de klant uitnodigen in Netlify Identity (invite only).

## Iets wijzigen aan het dashboard zelf

Bewerk `portal/_sjabloon/portaal.html` en draai `npm run portalen`.
De wijziging landt bij **alle** klanten tegelijk. Bewerk nooit een gegenereerde
`portal/<slug>.html` rechtstreeks — die wordt bij de volgende run overschreven.

## Velden

| Veld | Verplicht | Betekenis |
|---|---|---|
| `slug` | ja | bestandsnaam en URL: `/portal/<slug>.html` |
| `bedrijf` | ja | volledige naam zoals de klant hem schrijft |
| `bedrijf_kort` | nee | korte vorm in de tijdlijn; anders het eerste woord |
| `voornaam` | ja | wie er 's morgens op inlogt |
| `sector` | nee | documentatie, nog niet in het sjabloon gebruikt |
| `initiaal` | nee | letter in het logoblokje; anders de eerste letter van `bedrijf` |
| `plaats` | nee | vestiging in de hoofding, bv. `Damme` |
| `sinds` | nee | jaartal in de hoofding; anders het huidige jaar |
| `accent` | ja | één hex; de generator maakt er zes tinten van |
| `accent_ramp` | nee | de tinten exact vastleggen (voor portalen van vóór de generator) |
| `genereren` | nee | `false` = overslaan, blijft handwerk |

## Controleren zonder te schrijven

`npm run portalen:controleer` meldt wat er zou wijzigen en geeft exitcode 1 als er
iets afwijkt. Bruikbaar in een pre-commit hook of in CI.

## Waarom dit bestaat

Voor deze generator was elk portaal een kopie van 1215 regels. Klant vier kostte
evenveel werk als klant één, en een verbetering aan het dashboard moest in elk
bestand apart. Bij drie klanten was dat een dag per wijziging.
