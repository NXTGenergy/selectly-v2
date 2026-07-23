// Selectly — AI Intake Assistant (dogfooding: de automatisatie die we aan klanten verkopen, op onze eigen site).
// Claude kwalificeert de bezoeker via een natuurlijk gesprek, scoort de fit, zet een gekwalificeerde lead in GHL
// (tag "selectly-lead" → start meteen de nurture-workflow) en leidt naar de demo-agenda.
// Env: ANTHROPIC_API_KEY, GHL_TOKEN, GHL_LOCATION, GHL_PIPELINE, GHL_STAGE.

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';
const GHL_TOKEN = process.env.GHL_TOKEN || '';
const GHL_LOCATION = process.env.GHL_LOCATION || '';
const GHL_PIPELINE = process.env.GHL_PIPELINE || '';
const GHL_STAGE = process.env.GHL_STAGE || '';
const BOOKING = 'https://api.leadconnectorhq.com/widget/bookings/selectly-demo';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36';

const SYSTEM = `Je bent de intake-assistent van Selectly (selectly.be), een Belgisch bedrijf dat installateurs en KMO's helpt om hun binnenkomende aanvragen sneller en beter op te volgen — chatbot, WhatsApp-opvolging, automatische offerteflow en CRM. Selectly converteert bestaande aanvragen beter; het belooft NOOIT nieuwe leads te genereren.

Je doel: de bezoeker in een kort, natuurlijk gesprek kwalificeren en, als het past, naar een gratis demo van 20 minuten leiden. Spreek vlot Vlaams, warm en professioneel, en stel telkens MAAR ÉÉN vraag per bericht. Geen opsommingen van vragen, geen interrogatie. Reageer kort (max 2-3 zinnen) en menselijk op wat ze zeggen vóór je de volgende vraag stelt.

Dek gaandeweg deze punten af (in natuurlijke volgorde, niet als checklist):
- welke sector / wat ze doen (zonnepanelen, warmtepomp/HVAC, dakwerken, ...)
- hoeveel aanvragen ze ongeveer per maand krijgen
- hoe ze vandaag offertes en opvolging aanpakken
- of ze al een CRM/software gebruiken (en welke)
- hoeveel medewerkers
- of ze vooral méér klanten willen of vooral efficiënter werken
Vraag ergens natuurlijk naar hun voornaam, bedrijfsnaam en e-mailadres (zodat je de demo kunt vastleggen) — niet pusherig, gewoon "mag ik je naam en e-mail zodat ik de demo voor je kan klaarzetten?".

Regels: geen overdreven claims, geen "wij zijn de beste", geen leadgeneratie beloven. Case die je mag noemen: een Belgisch installatiebedrijf ging van 35% naar 62% conversie in 4 weken. Als iemand duidelijk geen installateur/KMO is of niet geïnteresseerd, wees vriendelijk en laat los.

Zodra je genoeg weet EN je hebt minstens hun e-mail: vat kort samen wat je begrijpt, zeg eerlijk of Selectly past, en nodig uit om een demo te boeken via deze link: ${BOOKING}

BELANGRIJK — geef bij ELK antwoord op de allerlaatste regel een verborgen JSON-blok met wat je tot nu toe weet, exact in dit formaat (de bezoeker ziet dit niet):
<<DATA>>{"voornaam":"","bedrijf":"","email":"","telefoon":"","sector":"","aanvragen_per_maand":"","crm":"","medewerkers":"","doel":"","fit_score":0,"klaar_voor_demo":false}<<END>>
Vul in wat je weet, laat de rest leeg. fit_score is 0-100 (hoe goed Selectly past). Zet klaar_voor_demo op true zodra je de bezoeker naar de boekingslink hebt verwezen.`;

async function callClaude(messages) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-5', max_tokens: 700, system: SYSTEM, messages }),
  });
  const j = await r.json();
  if (!r.ok) { console.log('[intake] claude fout', r.status, JSON.stringify(j).slice(0, 200)); return null; }
  var block = (j.content || []).find(function (b) { return b.type === 'text'; });
  return block ? block.text : '';
}

function splitData(text) {
  const m = text.match(/<<DATA>>([\s\S]*?)<<END>>/);
  let data = {};
  if (m) { try { data = JSON.parse(m[1]); } catch (e) {} }
  const reply = text.replace(/<<DATA>>[\s\S]*?<<END>>/, '').trim();
  return { reply, data };
}

async function pushToGHL(d) {
  if (!GHL_TOKEN || !d.email || !/@/.test(d.email)) return;
  const HEAD = { Authorization: 'Bearer ' + GHL_TOKEN, Version: '2021-07-28', 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA };
  try {
    const cf = [];
    if (d.sector) cf.push({ key: 'contact.sector', field_value: d.sector });
    const body = {
      locationId: GHL_LOCATION, firstName: d.voornaam || '', email: d.email, phone: d.telefoon || undefined,
      companyName: d.bedrijf || undefined, source: 'AI Intake Assistant (selectly.be)',
      tags: ['selectly-lead', 'intake-chatbot'], customFields: cf,
    };
    const r = await fetch('https://services.leadconnectorhq.com/contacts/upsert', { method: 'POST', headers: HEAD, body: JSON.stringify(body) });
    const j = await r.json();
    const cid = (j.contact && j.contact.id) || j.id;
    console.log('[intake] GHL contact', r.status, cid);
    if (cid && GHL_PIPELINE && GHL_STAGE) {
      await fetch('https://services.leadconnectorhq.com/opportunities/', { method: 'POST', headers: HEAD, body: JSON.stringify({
        locationId: GHL_LOCATION, pipelineId: GHL_PIPELINE, pipelineStageId: GHL_STAGE,
        name: (d.bedrijf || d.voornaam || d.email) + ' (chatbot)', status: 'open', contactId: cid,
      }) });
    }
  } catch (e) { console.log('[intake] GHL fout', e && e.message); }
}

exports.handler = async (event) => {
  try {
    if (!ANTHROPIC_KEY) return { statusCode: 200, body: JSON.stringify({ reply: 'De assistent staat even offline. Vul gerust het formulier in of bel +32 483 81 29 07.' }) };
    const body = JSON.parse(event.body || '{}');
    const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
    let pushed = body.pushed || false;
    const text = await callClaude(messages);
    if (text === null) return { statusCode: 200, body: JSON.stringify({ reply: 'Sorry, er ging even iets mis. Probeer het opnieuw of bel +32 483 81 29 07.' }) };
    const { reply, data } = splitData(text);
    // gekwalificeerde lead met e-mail → 1x in GHL zetten
    if (!pushed && data && data.email && /@/.test(data.email)) { await pushToGHL(data); pushed = true; }
    return { statusCode: 200, body: JSON.stringify({ reply, data, pushed, booking: BOOKING }) };
  } catch (e) {
    console.log('[intake] handler-fout', e && e.message);
    return { statusCode: 200, body: JSON.stringify({ reply: 'Er ging iets mis. Bel gerust +32 483 81 29 07.' }) };
  }
};
