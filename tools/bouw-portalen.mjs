#!/usr/bin/env node
/*
 * Selectly — portaalgenerator.
 *
 * Eén sjabloon (portal/_sjabloon/portaal.html) plus één json per klant
 * (portal/_klanten/<slug>.json) wordt portal/<slug>.html.
 *
 * Waarom dit bestaat: elk klantportaal was een kopie van 1215 regels die met de
 * hand werd bijgewerkt. Klant vier kostte evenveel werk als klant een, en een
 * verbetering aan het dashboard moest in elk bestand apart. Nu niet meer.
 *
 * Draaien:   node tools/bouw-portalen.mjs
 * Nakijken:  node tools/bouw-portalen.mjs --controleer   (schrijft niets, meldt verschillen)
 *
 * Geen afhankelijkheden. De uitvoer wordt gecommit, zodat Netlify niets moet bouwen.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const wortel = join(dirname(fileURLToPath(import.meta.url)), "..");
const SJABLOON = join(wortel, "portal/_sjabloon/portaal.html");
const KLANTEN = join(wortel, "portal/_klanten");
const alleenControle = process.argv.includes("--controleer");

/* Een accentkleur wordt een volledige ramp: 50/100/400/500/600.
   Zo hoeft een klantbestand maar een kleur te bevatten, niet vijf. */
function ramp(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`ongeldige kleur: ${hex} (verwacht #rrggbb)`);
  const n = parseInt(m[1], 16);
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const meng = (kant, f) => "#" + rgb.map(c => Math.round(c + (kant - c) * f).toString(16).padStart(2, "0")).join("");
  return {
    accent50:  meng(255, 0.94),
    accent100: meng(255, 0.84),
    accent400: meng(255, 0.30),
    accent500: "#" + m[1].toLowerCase(),
    accent600: meng(0, 0.22),
    accent700: meng(0, 0.38),
  };
}

function vulIn(sjabloon, waarden) {
  return sjabloon.replace(/\{\{([a-z_0-9]+)\}\}/g, (heel, sleutel) => {
    if (!(sleutel in waarden)) throw new Error(`token {{${sleutel}}} heeft geen waarde`);
    return String(waarden[sleutel]);
  });
}

if (!existsSync(SJABLOON)) { console.error("! sjabloon ontbreekt:", SJABLOON); process.exit(1); }
const sjabloon = readFileSync(SJABLOON, "utf8").replace(/^<!--[\s\S]*?-->\n/, "");

const bestanden = readdirSync(KLANTEN).filter(f => f.endsWith(".json")).sort();
let gebouwd = 0, overgeslagen = 0, afwijkend = 0;

for (const bestand of bestanden) {
  const klant = JSON.parse(readFileSync(join(KLANTEN, bestand), "utf8"));
  const naam = bestand.replace(/\.json$/, "");

  if (klant.genereren === false) {
    console.log(`  · ${naam.padEnd(24)} overgeslagen (genereren: false)`);
    overgeslagen++; continue;
  }
  for (const vereist of ["slug", "bedrijf", "voornaam", "accent"]) {
    if (!klant[vereist]) { console.error(`! ${bestand}: '${vereist}' ontbreekt`); process.exit(1); }
  }

  /* Een klant mag zijn ramp exact vastleggen. Dat is er voor portalen die al
     bestonden voor deze generator: hun kleuren blijven dan tot op de hex gelijk.
     Nieuwe klanten geven alleen 'accent' en krijgen de berekende ramp. */
  const waarden = {
    bedrijf: klant.bedrijf,
    bedrijf_kort: klant.bedrijf_kort || klant.bedrijf.split(" ")[0],
    voornaam: klant.voornaam,
    initiaal: klant.initiaal || klant.bedrijf.trim()[0].toUpperCase(),
    plaats: klant.plaats || "",
    sinds: klant.sinds || new Date().getFullYear(),
    ...ramp(klant.accent),
    ...(klant.accent_ramp || {}),
  };

  const uit = join(wortel, "portal", `${klant.slug}.html`);
  const nieuw = vulIn(sjabloon, waarden);
  const oud = existsSync(uit) ? readFileSync(uit, "utf8") : null;

  if (oud === nieuw) { console.log(`  = ${naam.padEnd(24)} ongewijzigd`); gebouwd++; continue; }

  if (alleenControle) {
    console.log(`  ! ${naam.padEnd(24)} zou wijzigen (${oud === null ? "bestaat nog niet" : "verschilt van sjabloon"})`);
    afwijkend++; continue;
  }
  writeFileSync(uit, nieuw, "utf8");
  console.log(`  + ${naam.padEnd(24)} geschreven -> portal/${klant.slug}.html`);
  gebouwd++;
}

console.log(`\n${gebouwd} portaal(en), ${overgeslagen} overgeslagen${afwijkend ? `, ${afwijkend} afwijkend` : ""}.`);
if (alleenControle && afwijkend) process.exit(1);
