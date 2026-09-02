// Selectly — Netlify Forms trigger. Draait automatisch bij ELKE formulier-inzending op selectly.be.
// Maakt/updatet het contact in GHL, zet een opportunity in "Nieuwe lead" en verstuurt
// zelf de eerste reactie per mail.
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
// aanvrager écht schreef, wordt in GHL bewaard én van hieruit meteen verstuurd.
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
  if (!ANTHROPIC_KEY) { console.log('[ai] geen ANTHROPIC_API_KEY'); return null; }
  const situatie = [
    d.naam && `Naam: ${d.naam}`,
    d.bedrijf && `Bedrijf: ${d.bedrijf}`,
    d.interesse && `Interesse: ${d.interesse}`,
    d.lead_source && `Kwam binnen via: ${d.lead_source}`,
    d.bericht && `Wat hij/zij schreef: ${d.bericht}`,
  ].filter(Boolean).join('\n');
  if (!situatie) { console.log('[ai] geen situatie om over te schrijven'); return null; }

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
    if (!tekst) console.log('[ai] model gaf een leeg antwoord terug');
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

// Het opgemaakte sjabloon staat op de site, zodat er maar één versie van het
// ontwerp bestaat. Is het even niet op te halen, dan gaat het antwoord alsnog
// buiten in een sobere opmaak — een lelijke mail is beter dan geen mail.
const SJABLOON_URL = 'https://selectly.be/assets/email-template.html';

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function bouwMail(antwoord) {
  const alinea = escapeHtml(antwoord)
    .split(/\n{2,}/).map((p) => `<p style="margin:0 0 14px 0;">${p.replace(/\n/g, '<br>')}</p>`).join('');
  try {
    const ctrl = new AbortController();
    const klok = setTimeout(() => ctrl.abort(), 4000);
    const r = await fetch(SJABLOON_URL, { signal: ctrl.signal });
    clearTimeout(klok);
    if (r.ok) {
      const html = await r.text();
      if (html.includes('{{contact.ai_eerste_antwoord}}')) {
        return html.replace('{{contact.ai_eerste_antwoord}}', alinea);
      }
    }
  } catch (e) { console.log('[mail] sjabloon niet opgehaald', e && e.message); }
  return `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#1f2937;">${alinea}</div>`;
}

// Valt de AI weg, dan mag de aanvrager daar niets van merken. Hij heeft net op
// verzenden geduwd en een groen vinkje gezien; dan hoort er een mail te volgen.
// Deze tekst is bewust kort en zegt alleen wat we zeker weten.
function standaardBevestiging(d, voornaam) {
  const feiten = [
    d.bedrijf && `Bedrijf: ${d.bedrijf}`,
    d.interesse && `Interesse: ${d.interesse}`,
    d.telefoon && `Telefoon: ${d.telefoon}`,
  ].filter(Boolean).join('\n');
  return [
    voornaam ? `Dag ${voornaam},` : 'Dag,',
    'Bedankt voor uw aanvraag bij Selectly. Ze is goed aangekomen en iemand van het team bekijkt ze persoonlijk.',
    feiten ? 'Dit hebben we genoteerd:\n' + feiten : '',
    'Klopt er iets niet, antwoord dan gerust op deze mail.',
    'Liever meteen een moment prikken? Een demo van twintig minuten inplannen kan hier: https://selectly.be/demo',
    'Tot binnenkort,\nHet team van Selectly',
  ].filter(Boolean).join('\n\n');
}

async function stuurEersteAntwoord(contactId, email, antwoord, voornaam) {
  if (!TOKEN) return 'Mail niet verstuurd (geen token).';
  try {
    const html = await bouwMail(antwoord);
    const onderwerp = voornaam
      ? `${voornaam}, uw aanvraag bij Selectly`
      : 'Uw aanvraag bij Selectly';
    const r = await fetch(BASE + '/conversations/messages', {
      method: 'POST',
      headers: { ...HEAD, Version: '2021-04-15' },
      body: JSON.stringify({ type: 'Email', contactId, emailTo: email, subject: onderwerp, html }),
    });
    if (r.ok) { console.log('[mail] verstuurd naar', email); return 'Eerste antwoord verstuurd.'; }
    const j = await r.json().catch(() => ({}));
    console.log('[mail] mislukt', r.status, JSON.stringify(j).slice(0, 200));
    return `Mail NIET verstuurd (${r.status}) — zelf opvolgen.`;
  } catch (e) {
    console.log('[mail] fout', e && e.message);
    return 'Mail NIET verstuurd — zelf opvolgen.';
  }
}

// Melding onderweg. Twee soorten aanvragen lopen hier binnen en ze vragen een
// heel ander antwoord, dus dat staat in de eerste regel: een OfferteScout-lead
// is een particulier voor een installatie, een websiteformulier is een prospect
// voor Selectly zelf.
async function meldLead(d, formName, isConsument, gelukt, contactId, mailStatus) {
  if (!TG_TOKEN || !TG_CHAT) return;
  const regels = [
    isConsument ? 'Nieuwe OfferteScout-aanvraag (particulier)' : 'Nieuwe aanvraag via de website',
    [d.bedrijf, d.naam].filter(Boolean).join(' · ') || null,
    d.email || null,
    d.telefoon || null,
    'Formulier: ' + formName,
    d.lead_source ? 'Bron: ' + d.lead_source : null,
    gelukt ? null : 'LET OP: niet in GHL geraakt — zelf opvolgen',
    mailStatus || null,
    // Rechtstreekse link: vanaf je gsm meteen bellen of opvolgen, zonder zoeken.
    contactId && LOCATION ? `https://app.gohighlevel.com/v2/location/${LOCATION}/contacts/detail/${contactId}` : null,
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
        // GHL weigert een tweede opportunity voor hetzelfde contact met een 400.
        // Dat is geen storing maar het gewenste gedrag: een terugkerende lead
        // hoort geen tweede kans in de pijplijn te krijgen. Zonder dit
        // onderscheid leest elke herhaalde aanvraag als een fout in de logs.
        if (ro.ok) { console.log('[ghl] opportunity', ro.status); }
        else {
          const jo = await ro.json().catch(() => ({}));
          if (jo.code === 'OPPORTUNITY_NO_DUPLICATE') console.log('[ghl] opportunity bestaat al — geen tweede aangemaakt');
          else console.log('[ghl] opportunity MISLUKT', ro.status, JSON.stringify(jo).slice(0, 200));
        }
      } catch (e) { console.log('[ghl] opportunity fout', e && e.message); }
    }

    // 3) De eerste reactie zelf versturen. Vroeger schreef de AI dit antwoord weg
    //    in een veld en moest een GHL-workflow het versturen. Die workflow stuurde
    //    in de praktijk een algemene "bedankt, wij nemen contact op"-mail — precies
    //    wat Selectly zijn klanten afraadt — en begon met "Dag ," omdat ze afvuurde
    //    voor de voornaam was opgeslagen. Nu vertrekt het echte antwoord hiervandaan.
    // De bevestiging hing vroeger vast aan de AI: mislukte die, dan kreeg de
    // aanvrager niets terwijl hij net een groen vinkje had gezien. De AI maakt
    // de mail persoonlijker, maar ze beslist niet langer of hij vertrekt.
    let mailStatus = '';
    if (contactId && !isConsument && d.email) {
      const tekst = aiAntwoord || standaardBevestiging(d, first);
      if (!aiAntwoord) console.log('[mail] AI gaf niets, standaardbevestiging gebruikt');
      mailStatus = await stuurEersteAntwoord(contactId, d.email, tekst, first);
    }

    await meldLead(d, formName, isConsument, !!contactId, contactId, mailStatus);
  } catch (e) {
    console.log('[ghl] handler-fout', e && e.message);
  }
  return { statusCode: 200, body: 'ok' };
};
