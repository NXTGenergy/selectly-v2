// Leest de bewaarde chatgesprekken (Netlify Blobs, store "chat-gesprekken").
//
// Twee manieren om binnen te raken, verder is alles dicht:
//  - Netlify Identity met rol "admin" (de pagina /portal/chats.html stuurt de JWT mee).
//  - Het geheime export-token in env CHAT_EXPORT_TOKEN, als header
//    "Authorization: Bearer <token>". Bedoeld voor Claude/scripts.
//
// GET  ?                          → lijst van datums met aantal gesprekken
// GET  ?datum=YYYY-MM-DD          → alle gesprekken van die dag
// GET  ?van=YYYY-MM-DD&tot=YYYY-MM-DD → alle gesprekken in dat bereik (max 92 dagen)
//      &zonder_test=1             → testgesprekken weglaten
// POST ?actie=onderhoud           → mail-en-opruimronde nu draaien (enkel met token)
//
// Wist bij elke oproep alles ouder dan 90 dagen (naast de geplande functie).

const crypto = require('crypto');
const chat = require('../lib/chatopslag');

const DATUM_RE = /^\d{4}-\d{2}-\d{2}$/;
const JSONH = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };

function antwoord(code, obj) {
  return { statusCode: code, headers: JSONH, body: JSON.stringify(obj) };
}

function tokenGeldig(event) {
  const verwacht = process.env.CHAT_EXPORT_TOKEN || '';
  if (verwacht.length < 24) return false;
  const h = (event.headers && (event.headers.authorization || event.headers.Authorization)) || '';
  const gekregen = h.replace(/^Bearer\s+/i, '');
  const a = Buffer.from(gekregen);
  const b = Buffer.from(verwacht);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function isAdmin(context) {
  const u = context && context.clientContext && context.clientContext.user;
  const rollen = (u && u.app_metadata && u.app_metadata.roles) || [];
  return rollen.indexOf('admin') !== -1;
}

function dagenTussen(van, tot) {
  const uit = [];
  let t = Date.parse(van + 'T12:00:00Z');
  const eind = Date.parse(tot + 'T12:00:00Z');
  while (t <= eind && uit.length < 93) { uit.push(new Date(t).toISOString().slice(0, 10)); t += 86400000; }
  return uit;
}

async function gesprekkenVan(dagen, zonderTest) {
  const s = chat.store();
  const uit = [];
  for (const dag of dagen) {
    const { blobs } = await s.list({ prefix: dag + '/' });
    const recs = await Promise.all((blobs || []).map((b) => s.get(b.key, { type: 'json' }).catch(() => null)));
    for (const r of recs) if (r && !(zonderTest && r.test)) uit.push(r);
  }
  uit.sort((a, b) => String(b.gestart).localeCompare(String(a.gestart)));
  return uit;
}

exports.handler = async (event, context) => {
  const metToken = tokenGeldig(event);
  if (!metToken && !isAdmin(context)) {
    return antwoord(401, { fout: 'Niet aangemeld of geen admin-rol.' });
  }
  try {
    if (!chat.verbind(event)) return antwoord(503, { fout: 'Geen Blobs-omgeving in deze functie.' });
    const q = event.queryStringParameters || {};

    if (event.httpMethod === 'POST') {
      if (!metToken) return antwoord(403, { fout: 'Enkel met het export-token.' });
      if (q.actie !== 'onderhoud') return antwoord(400, { fout: 'Onbekende actie.' });
      const { onderhoud } = require('../lib/chatonderhoud');
      const stil = q.stil_minuten != null ? Math.max(0, Number(q.stil_minuten) || 0) : undefined;
      return antwoord(200, await onderhoud({ stilMinuten: stil }));
    }
    if (event.httpMethod !== 'GET') return antwoord(405, { fout: 'Enkel GET of POST.' });

    let gewist = 0;
    try { gewist = await chat.ruimOp(); } catch (e) { console.log('[chat-gesprekken] opruimen', e && e.message); }
    const zonderTest = q.zonder_test === '1';

    if (q.datum || q.van || q.tot) {
      const van = q.datum || q.van || q.tot;
      const tot = q.datum || q.tot || q.van;
      if (!DATUM_RE.test(van) || !DATUM_RE.test(tot) || van > tot) return antwoord(400, { fout: 'Datum als YYYY-MM-DD, van ≤ tot.' });
      const dagen = dagenTussen(van, tot);
      if (dagen.length > 92) return antwoord(400, { fout: 'Maximaal 92 dagen per oproep.' });
      const gesprekken = await gesprekkenVan(dagen, zonderTest);
      return antwoord(200, { van, tot, aantal: gesprekken.length, gesprekken });
    }

    // Overzicht per dag.
    const { blobs } = await chat.store().list();
    const perDag = {};
    for (const b of blobs || []) { const d = b.key.slice(0, 10); perDag[d] = (perDag[d] || 0) + 1; }
    const dagen = Object.keys(perDag).sort().reverse().map((d) => ({ datum: d, aantal: perDag[d] }));
    return antwoord(200, { vandaag: chat.datumBE(), bewaardagen: chat.BEWAAR_DAGEN, gewist, dagen });
  } catch (e) {
    console.log('[chat-gesprekken] fout', e && e.message);
    return antwoord(500, { fout: 'Uitlezen mislukt: ' + (e && e.message) });
  }
};
