// Selectly — Netlify Forms trigger. Draait automatisch bij ELKE formulier-inzending op selectly.be.
// Maakt/updatet het contact in GHL (Selectly sub-account) + zet een opportunity in "Nieuwe lead".
// Vereist env-vars: GHL_TOKEN, GHL_LOCATION, GHL_PIPELINE, GHL_STAGE (via netlify env:set).
// Faalt nooit de inzending: geeft altijd 200 terug.

const TOKEN = process.env.GHL_TOKEN || '';
const LOCATION = process.env.GHL_LOCATION || '';
const PIPELINE = process.env.GHL_PIPELINE || '';
const STAGE = process.env.GHL_STAGE || '';
const BASE = 'https://services.leadconnectorhq.com';
const HEAD = {
  'Authorization': 'Bearer ' + TOKEN,
  'Version': '2021-07-28',
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
};

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || '';

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';
const BOOKING = 'https://api.leadconnectorhq.com/widget/bookings/selectly-demo';

// De eerste reactie op een aanvraag. Selectly verkoopt dat je géén
// "bedankt voor uw bericht, wij nemen contact op" hoort te sturen — dus mag
// Selectly dat zelf al helemaal niet doen. Deze reactie gaat over wat de
// aanvrager écht schreef, en wordt in GHL gezet zodat de workflow ze verstuurt.
const ANTWOORD_PROMPT = `Je schrijft namens Selectly de eerste reactie op een aanvraag via de website.

Selectly levert digitale medewerkers aan Belgische installateurs (HVAC, warmtepompen,
zonnepanelen, dakwerken): AI die elke aanvraag binnen de minuut beantwoordt, de offerte
klaarzet en blijft opvolgen tot er getekend is. Pakketten vanaf 450 euro per maand.

REGELS
- Schrijf in het Nederlands, Vlaams, en spreek de lezer aan met "u".
- Maximaal 5 zinnen. Kort en zakelijk, geen verkooppraat.
- Ga in op wat deze persoon CONCREET geschreven heeft. Benoem het.
- Schrijf nooit "bedankt voor uw bericht" of "wij nemen zo snel mogelijk contact op".
  Dat is precies wat wij afraden bij onze klanten.
- AANSPREKING: gebruik "Dag" met de voornaam, of begin zonder aanspreking.
  Schrijf NOOIT "Beste heer" of "Beste mevrouw" — je weet het geslacht niet en
  ernaast zitten in de eerste regel kost je het gesprek.
- PRIJS: vraagt iemand wat het kost, geef dan gewoon antwoord. Lite start op
  450 euro per maand plus 750 euro opstart; Starter op 950 plus 1500. De prijzen
  staan gewoon op de site, dus ontwijken leest als iets te verbergen hebben.
  Zeg er wel bij dat welk pakket past, afhangt van hun manier van werken.
- Beloof verder geen termijn en geen resultaat. Geen "dit gaat u X opleveren".
- Sluit af door een demo van 20 minuten voor te stellen via deze link: ${BOOKING}
- Onderteken met "Selectly" — nooit met een persoonsnaam.
- Geef alleen de tekst van het bericht terug. Geen onderwerpregel, geen uitleg.`;

async function schrijfEersteAntwoord(d) {
  if (!ANTHROPIC_KEY) return null;
  const situatie = [
    d.naam && `Naam: ${d.naam}`,
    d.bedrijf && `Bedrijf: ${d.bedrijf}`,
    d.interesse && `Interesse: ${d.interesse}`,
    d.lead_source && `Kwam binnen via: ${d.lead_source}`,
    d.bericht && `Wat hij/zij schreef: ${d.bericht}`,
  ].filter(Boolean).join('\n');
  if (!situatie) return null;

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 400,
        system: ANTWOORD_PROMPT,
        messages: [{ role: 'user', content: situatie }],
      }),
    });
    clearTimeout(t);
    if (!r.ok) { console.log('[ai] antwoord status', r.status); return null; }
    const j = await r.json();
    const tekst = (j.content || []).map((c) => c.text || '').join('').trim();
    return tekst || null;
  } catch (e) {
    console.log('[ai] antwoord fout', e && e.message);
    return null;
  }
}

function splitName(naam) {
  const p = (naam || '').trim().split(/\s+/);
  return { first: p[0] || '', last: p.slice(1).join(' ') || '' };
}

// Melding onderweg. Twee soorten aanvragen lopen hier binnen en ze vragen een
// heel ander antwoord, dus dat staat in de eerste regel: een OfferteScout-lead
// is een particulier voor een installatie, een websiteformulier is een prospect
// voor Selectly zelf.
async function meldLead(d, formName, isConsument, gelukt) {
  if (!TG_TOKEN || !TG_CHAT) return;
  const regels = [
    isConsument ? 'Nieuwe OfferteScout-aanvraag (particulier)' : 'Nieuwe aanvraag via de website',
    [d.bedrijf, d.naam].filter(Boolean).join(' · ') || null,
    d.email || null,
    d.telefoon || null,
    'Formulier: ' + formName,
    d.lead_source ? 'Bron: ' + d.lead_source : null,
    gelukt ? null : 'LET OP: niet in GHL geraakt — zelf opvolgen',
  ].filter(Boolean);
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text: regels.join('\n'), disable_web_page_preview: true }),
    });
  } catch (e) { console.log('[ghl] telegram', e && e.message); }
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const d = (body.payload && body.payload.data) || {};
    const formName = (body.payload && body.payload.form_name) || d['form-name'] || 'website';
    const { first, last } = splitName(d.naam);

    // Zonder GHL-token kan de lead niet in het CRM landen. Toch eerst melden:
    // een lead die nergens toekomt en waar niemand van weet, is een verloren lead.
    if (!TOKEN) {
      console.log('[ghl] GHL_TOKEN ontbreekt');
      await meldLead(d, formName, formName.indexOf('offertescout') === 0, false);
      return { statusCode: 200, body: 'no-token' };
    }

    // De /vraag/-funnels zijn OfferteScout: particulieren die een offerte voor hun
    // eigen woning vragen. Die horen NIET in de Selectly-nurture — dat zijn drie
    // B2B-mails over digitale medewerkers naar een gezin, met spamklachten op
    // send.selectly.be tot gevolg. Dat domein draagt de volledige outreach.
    const isConsument = formName.indexOf('offertescout') === 0;
    const tags = isConsument
      ? ['offertescout-lead', 'form-' + formName]
      : ['selectly-lead', 'form-' + formName];

    // 0) De AI schrijft de eerste reactie terwijl de bezoeker nog op de
    //    bedankpagina staat. Alleen voor B2B: een OfferteScout-particulier
    //    krijgt geen Selectly-verkooppraat. Mislukt dit, dan gaat de rest
    //    gewoon door — een lead zonder mooi antwoord is nog altijd een lead.
    const aiAntwoord = isConsument ? null : await schrijfEersteAntwoord(d);
    if (aiAntwoord) console.log('[ai] eerste antwoord klaar', aiAntwoord.length, 'tekens');

    // 1) Contact upsert (dedupe op e-mail/telefoon)
    const contactBody = {
      locationId: LOCATION,
      firstName: first, lastName: last,
      email: d.email || undefined,
      phone: d.telefoon || undefined,
      companyName: d.bedrijf || undefined,
      source: d.lead_source ? ('website: ' + d.lead_source) : 'selectly.be',
      tags,
      customFields: [
        d.utm_campaign ? { key: 'contact.utm_campagne', field_value: d.utm_campaign } : null,
        d.lead_source ? { key: 'contact.lead_bron', field_value: d.lead_source } : null,
        aiAntwoord ? { key: 'contact.ai_eerste_antwoord', field_value: aiAntwoord } : null,
      ].filter(Boolean),
    };
    let contactId = null;
    try {
      const r = await fetch(BASE + '/contacts/upsert', { method: 'POST', headers: HEAD, body: JSON.stringify(contactBody) });
      const j = await r.json();
      contactId = (j.contact && j.contact.id) || j.id || null;
      console.log('[ghl] contact upsert', r.status, contactId);
    } catch (e) { console.log('[ghl] contact fout', e && e.message); }

    // 2) Opportunity in "Nieuwe lead" — alleen voor B2B. Een OfferteScout-aanvraag
    //    is geen Selectly-verkoopkans en zou de pijplijn en de tellingen vervuilen.
    if (contactId && PIPELINE && STAGE && !isConsument) {
      try {
        const oppBody = {
          locationId: LOCATION, pipelineId: PIPELINE, pipelineStageId: STAGE,
          name: (d.bedrijf || d.naam || d.email || 'Nieuwe aanvraag'),
          status: 'open', contactId,
        };
        const ro = await fetch(BASE + '/opportunities/', { method: 'POST', headers: HEAD, body: JSON.stringify(oppBody) });
        console.log('[ghl] opportunity', ro.status);
      } catch (e) { console.log('[ghl] opportunity fout', e && e.message); }
    }

    await meldLead(d, formName, isConsument, !!contactId);
  } catch (e) {
    console.log('[ghl] handler-fout', e && e.message);
  }
  return { statusCode: 200, body: 'ok' };
};
