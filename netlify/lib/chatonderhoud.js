// Onderhoud van de chatopslag, elke 15 minuten via de geplande functie chat-onderhoud:
//  1. Elk afgelopen gesprek (≥ 20 min geen nieuwe beurt) één keer volledig mailen naar
//     info@selectly.be. Komt er later nog een beurt bij, dan volgt een bijgewerkte mail.
//  2. Alles ouder dan 90 dagen wissen.
//
// Mailkanaal: hetzelfde als de bevestigingsmail van de intake — GHL
// conversations/messages, verstuurd aan het contact info@selectly.be. Opmaak: het
// Selectly-sjabloon assets/email-template.html (logo, voettekst).
//
// De "gemaild"-vlag staat in een APARTE store (chat-gemaild), niet in het gesprek
// zelf: anders kan deze functie een beurt overschrijven die de intake net schreef.

const chat = require('./chatopslag');

const GHL_TOKEN = process.env.GHL_TOKEN || '';
const GHL_LOCATION = process.env.GHL_LOCATION || '';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36';
const ONTVANGER = 'info@selectly.be';
const STIL_MINUTEN = 20;
const SJABLOON = 'https://selectly.be/assets/email-template.html';
const OVERZICHT = 'https://selectly.be/portal/chats.html';

function vlagStore() {
  return require('@netlify/blobs').getStore('chat-gemaild');
}

function ontsnap(t) {
  return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function tijdBE(iso, metDatum) {
  const d = new Date(iso);
  const opt = { timeZone: 'Europe/Brussels', hour: '2-digit', minute: '2-digit' };
  if (metDatum) Object.assign(opt, { day: '2-digit', month: '2-digit', year: 'numeric' });
  return d.toLocaleString('nl-BE', opt);
}

function duur(rec) {
  const min = Math.round((Date.parse(rec.bijgewerkt) - Date.parse(rec.gestart)) / 60000);
  return min < 1 ? 'minder dan een minuut' : min + ' min';
}

function eersteVraag(rec) {
  const m = (rec.berichten || []).find((b) => b.rol === 'bezoeker');
  return m ? m.tekst.replace(/\s+/g, ' ').trim() : '';
}

function onderwerp(rec, bijgewerkt) {
  const v = eersteVraag(rec);
  const kort = v.length > 60 ? v.slice(0, 57) + '…' : v;
  return (rec.test ? '[TEST] ' : '') + (bijgewerkt ? '[bijgewerkt] ' : '') +
    '💬 Chat selectly.be — ' + tijdBE(rec.gestart, true) + ' — ' + (kort || '(leeg)');
}

// Inhoud die in {{contact.ai_eerste_antwoord}} komt. Die div staat op
// white-space:pre-line, dus geen losse regeleinden tussen de blokken.
function inhoud(rec, bijgewerkt) {
  const feiten = [
    ['Pagina', (rec.paginas && rec.paginas.length ? rec.paginas.join(', ') : rec.pagina) || '?'],
    ['Gestart', tijdBE(rec.gestart, true)],
    ['Duur', duur(rec) + ' · ' + rec.beurten + ' beurten'],
    (rec.voornaam || rec.bedrijf) && ['Naam', [rec.voornaam, rec.bedrijf].filter(Boolean).join(' — ')],
    rec.email && ['E-mail', rec.email],
    rec.telefoon && ['Telefoon', rec.telefoon],
    rec.sector && ['Sector', rec.sector],
    ['Fit-score', (rec.fit_score || 0) + '/100' + (rec.klaar_voor_demo ? ' · boekingslink gekregen' : '')],
    rec.ghl_contact_id && ['GHL', 'contact staat in GHL, gesprek als notitie'],
    rec.storing && ['Let op', 'AI-storing tijdens dit gesprek'],
    rec.test && ['Test', 'dit is een testgesprek'],
  ].filter(Boolean);

  const td = 'font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;padding:3px 0;vertical-align:top;';
  const tabel = '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;">' +
    feiten.map(([k, v]) => `<tr><td style="${td}color:#6b7689;padding-right:14px;white-space:nowrap;">${ontsnap(k)}</td><td style="${td}color:#1b2233;">${ontsnap(v)}</td></tr>`).join('') +
    '</table>';

  const dialoog = (rec.berichten || []).map((m) => {
    const bez = m.rol === 'bezoeker';
    return `<div style="margin:0 0 12px 0;padding:10px 14px;border-radius:10px;background-color:${bez ? '#eef3ff' : '#f4f6fb'};border-left:3px solid ${bez ? '#3a6cf2' : '#10c98c'};">` +
      `<div style="font-size:12px;color:#6b7689;margin:0 0 4px 0;">${bez ? 'Bezoeker' : 'Selectly-assistent'} · ${ontsnap(tijdBE(m.tijd))}</div>` +
      `<div style="font-size:15px;color:#1b2233;white-space:pre-line;">${ontsnap(m.tekst)}</div></div>`;
  }).join('');

  const intro = bijgewerkt
    ? '<p style="margin:0 0 16px 0;">Dit gesprek kreeg na de vorige mail nog nieuwe beurten. Hieronder het volledige gesprek.</p>'
    : '';
  return intro + tabel + dialoog;
}

// Het sjabloon is gemaakt voor de eerste reactie aan een klant. Voor een intern
// verslag: ander label boven de tekst en een knop naar het overzicht in plaats
// van de demo-knop. Logo, merkbalk en voettekst blijven.
async function bouwMail(rec, bijgewerkt) {
  const ctrl = new AbortController();
  const klok = setTimeout(() => ctrl.abort(), 5000);
  let html;
  try {
    const r = await fetch(SJABLOON, { signal: ctrl.signal });
    if (!r.ok) throw new Error('sjabloon HTTP ' + r.status);
    html = await r.text();
  } finally {
    clearTimeout(klok);
  }
  if (!html.includes('{{contact.ai_eerste_antwoord}}')) throw new Error('sjabloon zonder plaatshouder');
  html = html.replace(/<!--[\s\S]*?-->/, ''); // uitlegcommentaar bovenaan weg
  html = html.replace(/(<p[^>]*>\s*)Uw aanvraag(\s*<\/p>)/, '$1Chatgesprek op selectly.be$2');
  html = html.replace('https://api.leadconnectorhq.com/widget/bookings/selectly-demo', OVERZICHT + '?datum=' + rec.datum);
  html = html.replace(/Kies een moment voor uw demo/, 'Open in het chatoverzicht');
  html = html.replace(/20 minuten &middot; online &middot; meteen bevestigd/, 'Enkel voor het team &middot; aanmelden met je Selectly-account');
  html = html.replace('U krijgt deze mail omdat u een aanvraag deed via selectly.be.', 'Intern verslag van de chat-assistent. Chatgesprekken worden 90 dagen bewaard.');
  html = html.replace('{{contact.ai_eerste_antwoord}}', inhoud(rec, bijgewerkt));
  html = html.replace(/<a href="\{\{right_to_be_forgotten\}\}"[^>]*>Uitschrijven<\/a>\s*&middot;/, '');
  return html;
}

async function ghl(method, pad, payload, versie) {
  const ctrl = new AbortController();
  const klok = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch('https://services.leadconnectorhq.com' + pad, {
      method, signal: ctrl.signal,
      headers: { Authorization: 'Bearer ' + GHL_TOKEN, Version: versie || '2021-07-28', 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA },
      body: JSON.stringify(payload),
    });
    const j = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, j };
  } finally {
    clearTimeout(klok);
  }
}

let ontvangerId = null;
async function ontvanger() {
  if (ontvangerId) return ontvangerId;
  const r = await ghl('POST', '/contacts/upsert', {
    locationId: GHL_LOCATION, email: ONTVANGER, firstName: 'Selectly', lastName: 'chatverslagen',
    tags: ['intern-chatverslag'],
  });
  const id = (r.j.contact && r.j.contact.id) || r.j.id;
  if (!r.ok || !id) throw new Error('GHL-contact voor ' + ONTVANGER + ' niet gevonden (' + r.status + '): ' + JSON.stringify(r.j).slice(0, 200));
  ontvangerId = id;
  return id;
}

async function verstuur(rec, bijgewerkt) {
  if (!GHL_TOKEN) throw new Error('GHL_TOKEN ontbreekt in deze omgeving');
  const cid = await ontvanger();
  const html = await bouwMail(rec, bijgewerkt);
  const r = await ghl('POST', '/conversations/messages', {
    type: 'Email', contactId: cid, emailTo: ONTVANGER, subject: onderwerp(rec, bijgewerkt), html,
  }, '2021-04-15');
  // Een 200 zonder messageId is geen verzonden mail.
  const mid = r.j && (r.j.messageId || r.j.emailMessageId || r.j.id);
  if (!r.ok || !mid) throw new Error('GHL weigerde de mail (' + r.status + '): ' + JSON.stringify(r.j).slice(0, 300));
  return mid;
}

// Eén ronde. Kijkt enkel naar gesprekken van vandaag en gisteren: wat 20 minuten
// stil ligt, wordt binnen het kwartier opgepikt, dus ouder hoeft niet.
async function onderhoud(opties) {
  const o = opties || {};
  const uit = { bekeken: 0, gemaild: [], fouten: [], gewist: 0 };
  const s = chat.store();
  const vlaggen = vlagStore();
  const nu = Date.now();
  const dagen = [chat.datumBE(), chat.datumBE(new Date(nu - 86400000))];

  for (const dag of dagen) {
    const { blobs } = await s.list({ prefix: dag + '/' });
    for (const b of blobs || []) {
      uit.bekeken += 1;
      try {
        const rec = await s.get(b.key, { type: 'json' });
        if (!rec || !rec.bijgewerkt || !(rec.berichten || []).length) continue;
        const stil = (nu - Date.parse(rec.bijgewerkt)) / 60000;
        if (stil < (o.stilMinuten != null ? o.stilMinuten : STIL_MINUTEN)) continue;
        const vlag = await vlaggen.get(b.key, { type: 'json' });
        if (vlag && vlag.bijgewerkt === rec.bijgewerkt) continue; // al gemaild, niets nieuws
        const mid = await verstuur(rec, !!vlag);
        await vlaggen.setJSON(b.key, { bijgewerkt: rec.bijgewerkt, gemaild: new Date().toISOString(), messageId: mid });
        uit.gemaild.push(b.key);
        console.log('[chat-onderhoud] gemaild', b.key, mid);
      } catch (e) {
        uit.fouten.push(b.key + ': ' + (e && e.message));
        console.log('[chat-onderhoud] mail mislukt', b.key, e && e.message);
      }
    }
  }

  // Opruimen: gesprekken en vlaggen ouder dan 90 dagen.
  try {
    uit.gewist = await chat.ruimOp();
    const grens = chat.grensDatum();
    const { blobs } = await vlaggen.list();
    for (const b of (blobs || []).filter((x) => x.key.slice(0, 10) < grens)) await vlaggen.delete(b.key);
  } catch (e) {
    uit.fouten.push('opruimen: ' + (e && e.message));
  }
  return uit;
}

module.exports = { onderhoud, bouwMail, onderwerp };
