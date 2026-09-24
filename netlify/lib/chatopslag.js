// Opslag van elk chatgesprek van de intake-assistent in Netlify Blobs.
//
// Waarom: vroeger bleef een gesprek alleen bewaard als de bezoeker een e-mailadres
// gaf (GHL) of het gesprek warm werd (Telegram). Al de rest ging verloren.
//
// Store "chat-gesprekken", sleutel "YYYY-MM-DD/<gespreks-id>" (Belgische datum van
// het eerste bericht). 90 dagen bewaard; opruimen gebeurt door de geplande functie
// chat-opruimen en bij het uitlezen in het overzicht.
//
// Twee valkuilen, al betaald in de Command Center-app (selectly-app/_rapportopslag.js):
// 1. Onze functies zijn klassiek (exports.handler). Dan zet Netlify de Blobs-toegang
//    in event.blobs, niet in de omgeving: zonder connectLambda(event) vindt getStore niets.
// 2. consistency:'strong' gooit in die opstelling een fout. We blijven op de standaard.

const STORE = 'chat-gesprekken';
const BEWAAR_DAGEN = 90;
const ID_RE = /^[a-z0-9-]{12,64}$/i;

function verbind(event) {
  if (!event || !event.blobs) return false;
  require('@netlify/blobs').connectLambda(event);
  return true;
}

function store() {
  return require('@netlify/blobs').getStore(STORE);
}

// Datum in Belgische tijd, als YYYY-MM-DD.
function datumBE(d) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Brussels' }).format(d || new Date());
}

function grensDatum() {
  return datumBE(new Date(Date.now() - BEWAAR_DAGEN * 86400000));
}

// Race tegen een klok: opslag mag het antwoord aan de bezoeker nooit ophouden.
function metKlok(belofte, ms, wat) {
  let klok;
  return Promise.race([
    belofte,
    new Promise((_, nee) => { klok = setTimeout(() => nee(new Error(wat + ': timeout ' + ms + 'ms')), ms); }),
  ]).finally(() => clearTimeout(klok));
}

// Zoekt een bestaand gesprek: eerst onder vandaag, dan onder gisteren (gesprek over
// middernacht). Geeft { sleutel, record } terug; record null = nieuw gesprek.
async function zoek(id) {
  const s = store();
  const vandaag = datumBE();
  const gisteren = datumBE(new Date(Date.now() - 86400000));
  for (const dag of [vandaag, gisteren]) {
    const sleutel = dag + '/' + id;
    const record = await s.get(sleutel, { type: 'json' });
    if (record) return { sleutel, record };
  }
  return { sleutel: vandaag + '/' + id, record: null };
}

async function bewaar(sleutel, record) {
  await store().setJSON(sleutel, record);
}

// Verwijdert alles ouder dan 90 dagen. Sleutels beginnen met de datum, dus een
// tekstvergelijking volstaat.
async function ruimOp() {
  const grens = grensDatum();
  const { blobs } = await store().list();
  const oud = (blobs || []).filter((b) => b.key.slice(0, 10) < grens);
  for (const b of oud) await store().delete(b.key);
  return oud.length;
}

module.exports = { STORE, BEWAAR_DAGEN, ID_RE, verbind, store, datumBE, grensDatum, metKlok, zoek, bewaar, ruimOp };
