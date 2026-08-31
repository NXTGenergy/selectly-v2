// Stielkenner — afhandeling van een binnenkomende aanvraag.
//
// Wordt in de deploy weggeschreven ALS submission-created.js; Netlify koppelt die
// naam automatisch aan elke formulier-inzending. In de repo staat hij onder een
// eigen naam, want selectly.be heeft zijn eigen submission-created.js en die twee
// mogen elkaar niet overschrijven.
//
// Bewust NIET hetzelfde als die van Selectly: die duwt contacten in de B2B-pijplijn
// van Selectly en schrijft een antwoord namens Selectly. Een particulier die een
// dakwerker zoekt hoort daar niet in, en krijgt daar geen mail van.
//
// Wat deze wél doet: Bart meteen verwittigen. Zolang er geen installateurs zijn en
// geen eigen CRM, is dat het enige eerlijke: een mens leest de aanvraag en belt.
// Zodra installateurs.json echte records heeft, komt de matching hier.
//
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || '';

const SECTOR = {
  'offertescout-solar': 'Zonnepanelen',
  'offertescout-thuisbatterij': 'Thuisbatterij',
  'offertescout-warmtepomp': 'Warmtepomp',
  'offertescout-airco': 'Airco',
  'offertescout-dakwerken': 'Dakwerken',
};

// Velden die niets toevoegen in een melding.
const NEGEER = new Set([
  'form-name', 'bot-field', 'all-data', 'consent',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'landing_page', 'page_url', 'referrer', 'submitted_at',
]);

function ontsnap(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function meld(tekst) {
  if (!TG_TOKEN || !TG_CHAT) return;
  try {
    await fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT,
        text: tekst,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
  } catch (e) {
    // Een mislukte melding mag de inzending nooit doen falen.
  }
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const inzending = body.payload || {};
    const naamForm = inzending.form_name || '';

    // Alleen onze eigen formulieren. Netlify vuurt deze functie op elk formulier
    // van het project, en er kunnen er later andere bijkomen.
    if (!SECTOR[naamForm]) return { statusCode: 200, body: 'genegeerd' };

    const d = inzending.data || {};
    const regels = [];
    regels.push('<b>Nieuwe aanvraag &mdash; ' + ontsnap(SECTOR[naamForm]) + '</b>');
    regels.push('');

    // Contact eerst: dat is wat Bart nodig heeft om te bellen.
    for (const veld of ['naam', 'telefoon', 'email', 'postcode']) {
      if (d[veld]) regels.push('<b>' + veld + ':</b> ' + ontsnap(d[veld]));
    }

    const rest = Object.keys(d)
      .filter((k) => !NEGEER.has(k) && !['naam', 'telefoon', 'email', 'postcode'].includes(k))
      .filter((k) => String(d[k] || '').trim());
    if (rest.length) {
      regels.push('');
      for (const k of rest) regels.push(ontsnap(k) + ': ' + ontsnap(d[k]));
    }

    if (d.utm_source || d.utm_campaign) {
      regels.push('');
      regels.push('via: ' + ontsnap([d.utm_source, d.utm_campaign].filter(Boolean).join(' / ')));
    }

    regels.push('');
    regels.push('Deze aanvraag ging naar niemand anders. Bel de aanvrager en koppel hem aan een installateur.');

    await meld(regels.join('\n'));
  } catch (e) {
    // Nooit de inzending laten falen: die staat sowieso al veilig in Netlify Forms.
  }
  return { statusCode: 200, body: 'ok' };
};
