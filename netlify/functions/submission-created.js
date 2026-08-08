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
    if (!TOKEN) { console.log('[ghl] GHL_TOKEN ontbreekt'); return { statusCode: 200, body: 'no-token' }; }
    const body = JSON.parse(event.body || '{}');
    const d = (body.payload && body.payload.data) || {};
    const formName = (body.payload && body.payload.form_name) || d['form-name'] || 'website';
    const { first, last } = splitName(d.naam);

    // De /vraag/-funnels zijn OfferteScout: particulieren die een offerte voor hun
    // eigen woning vragen. Die horen NIET in de Selectly-nurture — dat zijn drie
    // B2B-mails over digitale medewerkers naar een gezin, met spamklachten op
    // send.selectly.be tot gevolg. Dat domein draagt de volledige outreach.
    const isConsument = formName.indexOf('offertescout') === 0;
    const tags = isConsument
      ? ['offertescout-lead', 'form-' + formName]
      : ['selectly-lead', 'form-' + formName];

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
