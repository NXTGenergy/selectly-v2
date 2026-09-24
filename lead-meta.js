/* Selectly — lead-attributie (first-touch)
 * Vult verborgen velden op elk Netlify-formulier met bron/UTM/landingspagina/referrer/timestamp,
 * zodat elke lead in Netlify herleidbaar is naar de campagne/bron. Geen externe afhankelijkheden.
 *
 * Doet sinds 24-09-2026 ook twee dingen erbij:
 *  1. Boekingslinks (/demo en directe links naar de GHL-agenda) krijgen de utm-parameters
 *     mee, zodat wie uit een advertentie komt en meteen boekt niet zonder campagne in GHL
 *     belandt. Zie het blok "Boekingslinks" onderaan.
 *  2. window.selectlyLeadMeta staat open voor pagina's die zelf een payload versturen
 *     (de rekenmodule op /roi.html post naar /.netlify/functions/berekening).
 *
 * ⚠️ Selector: NIET op [data-netlify] zoeken. Netlify haalt dat attribuut er bij het bouwen uit
 * (live staat er enkel <form action='/bedankt' method='POST' name='contact'>), waardoor alle
 * UTM-velden leeg binnenkwamen. We zoeken daarom op method="POST" / een form-name-veld, en we
 * maken een ontbrekend verborgen veld zelf aan in plaats van het over te slaan.
 */
(function () {
  var LS = 'selectly_first_touch';

  function params() {
    var p = {};
    try { new URLSearchParams(location.search).forEach(function (v, k) { p[k] = v; }); } catch (e) {}
    return p;
  }

  // First-touch bewaren (eerste bezoek bepaalt de bron; blijft over paginanavigatie heen).
  // Dit script hoort daarom op élke landingspagina te staan, niet enkel op de pagina met het
  // formulier: wie uit een advertentie op /roi landt en pas later naar de homepage klikt, had
  // anders selectly.be als referrer.
  var UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  // Klik-ID's van de advertentieplatformen. GHL leest deze op zijn boekingswidget
  // even goed als de utm's, dus bewaren we ze mee.
  var KLIK = ['fbclid', 'gclid', 'msclkid', 'ttclid'];

  var ft;
  try { ft = JSON.parse(localStorage.getItem(LS) || 'null'); } catch (e) { ft = null; }
  if (!ft) {
    var p = params();
    ft = {
      utm_source: p.utm_source || '', utm_medium: p.utm_medium || '', utm_campaign: p.utm_campaign || '',
      utm_content: p.utm_content || '', utm_term: p.utm_term || '',
      landing_page: location.pathname + location.search,
      referrer: document.referrer || '',
      first_seen: new Date().toISOString(),
      klik: (function () {
        var k = {};
        KLIK.forEach(function (naam) { if (p[naam]) k[naam] = p[naam]; });
        return k;
      })()
    };
    try { localStorage.setItem(LS, JSON.stringify(ft)); } catch (e) {}
  }
  if (!ft.klik) ft.klik = {}; // opgeslagen vóór 24-09-2026: geen klik-ID's bewaard

  function bron() {
    if (ft.utm_source) return ft.utm_source;
    if (ft.referrer) { try { return new URL(ft.referrer).hostname.replace(/^www\./, ''); } catch (e) {} }
    return 'direct';
  }

  // De volledige set attributie-velden. Formulieren krijgen ze als verborgen velden,
  // de rekenmodule stuurt ze mee in zijn JSON-payload.
  function velden() {
    return {
      lead_source: bron(),
      utm_source: ft.utm_source || '', utm_medium: ft.utm_medium || '', utm_campaign: ft.utm_campaign || '',
      utm_content: ft.utm_content || '', utm_term: ft.utm_term || '',
      landing_page: ft.landing_page || '', referrer: ft.referrer || '',
      page_url: location.pathname, submitted_at: new Date().toISOString()
    };
  }

  function fill(form) {
    var map = velden();
    Object.keys(map).forEach(function (name) {
      var el = form.querySelector('[name="' + name + '"]');
      if (!el) {
        // Ontbreekt het veld in de HTML? Dan maken we het aan, zodat de waarde toch meegaat.
        el = document.createElement('input');
        el.type = 'hidden';
        el.name = name;
        form.appendChild(el);
      }
      el.value = map[name] || '';
    });
  }

  function formulieren() {
    var uit = [];
    var kandidaten = document.querySelectorAll('form');
    Array.prototype.forEach.call(kandidaten, function (f) {
      var method = (f.getAttribute('method') || '').toUpperCase();
      var isNetlify = f.hasAttribute('data-netlify') || f.hasAttribute('netlify') ||
                      !!f.querySelector('input[name="form-name"]') || method === 'POST';
      if (isNetlify) uit.push(f);
    });
    return uit;
  }

  // -------------------------------------------------------------------------
  // Boekingslinks
  // -------------------------------------------------------------------------
  // "Boek een gratis demo" wijst naar /demo, en dat is een 302 naar de agenda van
  // GHL (api.leadconnectorhq.com/widget/bookings/selectly-demo). Die knop is de
  // prominentste call-to-action van de site, maar droeg geen herkomst mee: wie uit
  // een advertentie kwam en meteen boekte, kwam zonder campagne in GHL binnen.
  //
  // Waarom we de link in de pagina aanvullen en niet de redirect aanpassen: Netlify
  // geeft de querystring wél door aan de externe bestemming (nagekeken met curl:
  // /demo?utm_source=meta → location bevat ?utm_source=meta), maar de klik zelf
  // heeft meestal geen querystring. Wie op /?utm_source=meta landt en drie pagina's
  // later boekt, klikt op een kale /demo. De herkomst moet dus uit
  // localStorage.selectly_first_touch komen, en dat kan alleen in de browser.
  // De redirect blijft zoals hij is en geeft door wat wij eraan hangen.
  //
  // Welke namen GHL leest: de boekingswidget neemt utm_source, utm_medium,
  // utm_campaign, utm_content, utm_term en de klik-ID's (fbclid, gclid, msclkid)
  // over uit de URL. Andere parameters negeert hij, dus sturen we de overige
  // first-touch-gegevens (landingspagina, referrer, eerste bezoek) hier niet mee —
  // die gaan wel mee op de formulieren en in de payload van de rekenmodule.
  var BOEK = /(^\/demo(?:[?#]|$))|(api\.leadconnectorhq\.com\/widget\/bookings)/;

  function boekingsParams() {
    var nu = params();
    var uit = {};
    // De utm's van de huidige URL krijgen voorrang op first-touch: staan ze in de
    // URL, dan is dat de campagne waar hij nú op klikt.
    UTM.forEach(function (k) {
      var v = nu[k] || ft[k] || '';
      if (v) uit[k] = v;
    });
    KLIK.forEach(function (k) {
      var v = nu[k] || ft.klik[k] || '';
      if (v) uit[k] = v;
    });
    // Geen utm's, maar wel een verwijzende site? Dan die als bron, zodat een boeking
    // uit Google Zoeken of LinkedIn niet als "direct" in GHL landt.
    if (!uit.utm_source) {
      var b = bron();
      if (b && b !== 'direct') {
        uit.utm_source = b;
        if (!uit.utm_medium) uit.utm_medium = 'referral';
      }
    }
    return uit;
  }

  function isBoeking(a) {
    return BOEK.test(a.getAttribute('href') || '');
  }

  function verrijk(a) {
    var raw = a.getAttribute('href') || '';
    var extra = boekingsParams();
    var namen = Object.keys(extra);
    if (!namen.length) return;
    var u;
    try { u = new URL(raw, location.href); } catch (e) { return; }
    // Staat een parameter al op de link zelf, dan blijft die staan.
    namen.forEach(function (k) { if (!u.searchParams.has(k)) u.searchParams.set(k, extra[k]); });
    var nieuw = raw.charAt(0) === '/' ? u.pathname + u.search + u.hash : u.toString();
    if (nieuw !== raw) a.setAttribute('href', nieuw);
  }

  function boekingslinks() {
    Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (a) {
      if (a.dataset.boekMetaDone || !isBoeking(a)) return;
      a.dataset.boekMetaDone = '1';
      verrijk(a);
    });
  }

  // Vangnet voor links die pas later in de DOM komen (Alpine-menu's, widgets):
  // vlak voor de navigatie nog eens aanvullen.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || a.dataset.boekMetaDone || !isBoeking(a)) return;
    a.dataset.boekMetaDone = '1';
    verrijk(a);
  }, true);

  function start() {
    formulieren().forEach(function (f) {
      if (f.dataset.leadMetaDone) return;
      f.dataset.leadMetaDone = '1';
      fill(f);
      f.addEventListener('submit', function () { fill(f); }); // verse submitted_at bij verzenden
    });
    boekingslinks();
  }

  // Voor pagina's die hun lead zelf versturen in plaats van via een formulier.
  window.selectlyLeadMeta = {
    firstTouch: ft,
    bron: bron,
    velden: velden,
    boekingsParams: boekingsParams
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
