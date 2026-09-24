/* Selectly — lead-attributie (first-touch)
 * Vult verborgen velden op elk Netlify-formulier met bron/UTM/landingspagina/referrer/timestamp,
 * zodat elke lead in Netlify herleidbaar is naar de campagne/bron. Geen externe afhankelijkheden.
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
  var ft;
  try { ft = JSON.parse(localStorage.getItem(LS) || 'null'); } catch (e) { ft = null; }
  if (!ft) {
    var p = params();
    ft = {
      utm_source: p.utm_source || '', utm_medium: p.utm_medium || '', utm_campaign: p.utm_campaign || '',
      utm_content: p.utm_content || '', utm_term: p.utm_term || '',
      landing_page: location.pathname + location.search,
      referrer: document.referrer || '',
      first_seen: new Date().toISOString()
    };
    try { localStorage.setItem(LS, JSON.stringify(ft)); } catch (e) {}
  }

  function bron() {
    if (ft.utm_source) return ft.utm_source;
    if (ft.referrer) { try { return new URL(ft.referrer).hostname.replace(/^www\./, ''); } catch (e) {} }
    return 'direct';
  }

  function fill(form) {
    var map = {
      lead_source: bron(),
      utm_source: ft.utm_source, utm_medium: ft.utm_medium, utm_campaign: ft.utm_campaign,
      utm_content: ft.utm_content, utm_term: ft.utm_term,
      landing_page: ft.landing_page, referrer: ft.referrer,
      page_url: location.pathname, submitted_at: new Date().toISOString()
    };
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

  function start() {
    formulieren().forEach(function (f) {
      if (f.dataset.leadMetaDone) return;
      f.dataset.leadMetaDone = '1';
      fill(f);
      f.addEventListener('submit', function () { fill(f); }); // verse submitted_at bij verzenden
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
