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

function splitName(naam) {
  const p = (naam || '').trim().split(/\s+/);
  return { first: p[0] || '', last: p.slice(1).join(' ') || '' };
}

exports.handler = async (event) => {
  try {
    if (!TOKEN) { console.log('[ghl] GHL_TOKEN ontbreekt'); return { statusCode: 200, body: 'no-token' }; }
    const body = JSON.parse(event.body || '{}');
    const d = (body.payload && body.payload.data) || {};
    const formName = (body.payload && body.payload.form_name) || d['form-name'] || 'website';
    const { first, last } = splitName(d.naam);

    // 1) Contact upsert (dedupe op e-mail/telefoon)
    const contactBody = {
      locationId: LOCATION,
      firstName: first, lastName: last,
      email: d.email || undefined,
      phone: d.telefoon || undefined,
      companyName: d.bedrijf || undefined,
      source: d.lead_source ? ('website: ' + d.lead_source) : 'selectly.be',
      tags: ['selectly-lead', 'form-' + formName],
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

    // 2) Opportunity in "Nieuwe lead"
    if (contactId && PIPELINE && STAGE) {
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
  } catch (e) {
    console.log('[ghl] handler-fout', e && e.message);
  }
  return { statusCode: 200, body: 'ok' };
};
