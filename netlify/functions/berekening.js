// Vangt de uitslag van de omzetscan en de ROI-calculator op.
//
// Waarom deze functie bestaat: beide rekentools lieten een bezoeker zijn
// aanvragen per maand, zijn conversie en zijn gemiddelde orderwaarde invullen —
// en gooiden dat daarna weg. Dat is de best gekwalificeerde bezoeker op de site.
// Nu gaat het naar GHL, met de ingevulde waarden als velden en de volledige
// berekening als notitie, plus een Telegram-melding.
//
// Env: GHL_TOKEN, GHL_LOCATION, GHL_PIPELINE, GHL_STAGE,
//      TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (dezelfde als intake.js).

const GHL_TOKEN = process.env.GHL_TOKEN || '';
const GHL_LOCATION = process.env.GHL_LOCATION || '';
const GHL_PIPELINE = process.env.GHL_PIPELINE || '';
const GHL_STAGE = process.env.GHL_STAGE || '';
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || '';
const UA = 'selectly-berekening/1.0';

const EMAIL_RE = /^[\w.+-]+@[\w-]+\.[a-z]{2,}$/i;
const BRONNEN = { omzetscan: 'Omzetscan', roi: 'ROI-calculator' };

// Simpele rem tegen misbruik. Zit in het geheugen van één lambda-container en
// houdt dus minder tegen dan het lijkt — het is een drempel, geen slot.
const tellers = new Map();
const MAX_PER_UUR = 12;
function teVaak(ip) {
  const nu = Date.now();
  const t = tellers.get(ip);
  if (!t || nu - t.start > 3600000) { tellers.set(ip, { start: nu, n: 1 }); return false; }
  t.n += 1;
  if (tellers.size > 5000) tellers.clear();
  return t.n > MAX_PER_UUR;
}

function schoon(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max || 120) : '';
}

async function melden(tekst) {
  if (!TG_TOKEN || !TG_CHAT) return;
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text: tekst, disable_web_page_preview: true }),
    });
  } catch (e) { /* een mislukte melding mag de lead niet breken */ }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, body: JSON.stringify({ ok: false, fout: 'ongeldige aanvraag' }) }; }

  const email = schoon(body.email, 160).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, fout: 'Vul een geldig e-mailadres in.' }) };
  }

  const ip = (event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || 'onbekend');
  if (teVaak(ip)) {
    return { statusCode: 429, body: JSON.stringify({ ok: false, fout: 'Even wachten — te veel aanvragen.' }) };
  }

  const bron = BRONNEN[body.bron] || 'Rekentool';
  const naam = schoon(body.naam, 80);
  const bedrijf = schoon(body.bedrijf, 120);
  const telefoon = schoon(body.telefoon, 40);
  const waarden = (body.waarden && typeof body.waarden === 'object') ? body.waarden : {};
  const samenvatting = schoon(body.samenvatting, 1500);

  // Zonder GHL-token de lead niet laten verdampen: dan gaat hij naar Telegram.
  if (!GHL_TOKEN) {
    await melden(`${bron} — GEEN GHL-TOKEN, lead enkel hier:\n${email}\n${samenvatting}`);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  const HEAD = {
    Authorization: 'Bearer ' + GHL_TOKEN, Version: '2021-07-28',
    'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA,
  };

  try {
    const r = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST', headers: HEAD,
      body: JSON.stringify({
        locationId: GHL_LOCATION,
        firstName: naam || undefined,
        email,
        phone: telefoon || undefined,
        companyName: bedrijf || undefined,
        source: `${bron} (selectly.be)`,
        tags: ['selectly-lead', 'rekentool', body.bron === 'roi' ? 'roi-calculator' : 'omzetscan'],
      }),
    });
    const j = await r.json();
    const cid = (j.contact && j.contact.id) || j.id;

    if (!r.ok || !cid) {
      console.log('[berekening] GHL afgewezen', r.status, JSON.stringify(j).slice(0, 200));
      await melden(`${bron} — GHL ${r.status}, lead NIET opgeslagen:\n${email}\n${samenvatting}`);
      // Naar de bezoeker toe is dit gelukt: hij heeft zijn deel gedaan.
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    // De ingevulde schuifknoppen als velden. Aparte call, zodat een veld dat in
    // GHL anders heet nooit de lead zelf meesleurt.
    const velden = [
      waarden.sector && { key: 'contact.sector', field_value: String(waarden.sector).slice(0, 60) },
      waarden.leads && { key: 'contact.aanvragen_per_maand', field_value: String(waarden.leads) },
      waarden.conversie && { key: 'contact.huidige_conversie', field_value: String(waarden.conversie) },
      waarden.orderwaarde && { key: 'contact.orderwaarde', field_value: String(waarden.orderwaarde) },
    ].filter(Boolean);
    if (velden.length) {
      try {
        await fetch('https://services.leadconnectorhq.com/contacts/' + cid, {
          method: 'PUT', headers: HEAD, body: JSON.stringify({ customFields: velden }),
        });
      } catch (e) { console.log('[berekening] velden', e && e.message); }
    }

    // De volledige berekening als notitie: dat is waarmee je het gesprek opent.
    try {
      const regels = Object.entries(waarden)
        .filter(([, v]) => v !== '' && v != null)
        .map(([k, v]) => `${k}: ${v}`).join('\n');
      await fetch('https://services.leadconnectorhq.com/contacts/' + cid + '/notes', {
        method: 'POST', headers: HEAD,
        body: JSON.stringify({ userId: cid, body: `${bron} op selectly.be\n\n${samenvatting}\n\n${regels}`.slice(0, 5000) }),
      });
    } catch (e) { console.log('[berekening] notitie', e && e.message); }

    if (GHL_PIPELINE && GHL_STAGE) {
      try {
        await fetch('https://services.leadconnectorhq.com/opportunities/', {
          method: 'POST', headers: HEAD,
          body: JSON.stringify({
            locationId: GHL_LOCATION, pipelineId: GHL_PIPELINE, pipelineStageId: GHL_STAGE,
            name: `${bedrijf || naam || email} (${bron.toLowerCase()})`,
            status: 'open', contactId: cid,
          }),
        });
      } catch (e) { console.log('[berekening] opportunity', e && e.message); }
    }

    const kort = [
      `${bron} ingevuld`,
      [bedrijf, naam].filter(Boolean).join(' · ') || null,
      email,
      telefoon || null,
      samenvatting || null,
    ].filter(Boolean).join('\n');
    await melden(kort);

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    console.log('[berekening] fout', e && e.message);
    await melden(`${bron} — GHL onbereikbaar, lead NIET opgeslagen:\n${email}\n${samenvatting}`);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }
};
