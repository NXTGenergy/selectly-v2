/*
 * Stielkenner — cookiebalk.
 *
 * Eigen versie, want de gedeelde consent.js van selectly.be draagt het groen van
 * dat merk en aanpassen daar zou de hoofdsite mee veranderen. Zelfde werking en
 * dezelfde opslagsleutel, alleen het uitzicht en de tekst zijn van Stielkenner.
 *
 * Bij akkoord dispatcht dit 'selectly-consent-given' — pixel.js luistert daarnaar
 * en laadt de Meta-pixel pas dan. Die naam blijft bewust ongewijzigd, anders
 * laadt de pixel nooit meer.
 */
(function () {
  var KEY = 'selectly_consent';
  var INK = '#2b3540', CYAAN = '#22b3d6', CREME = '#f2f5f6';

  var bestaand = null;
  try { bestaand = localStorage.getItem(KEY); } catch (e) {}
  if (bestaand === 'accepted' || bestaand === 'rejected') return;

  function zet(waarde) {
    try { localStorage.setItem(KEY, waarde); } catch (e) {}
    var el = document.getElementById('selectly-consent-banner');
    if (el) el.remove();
    document.body.classList.remove('sl-consent-open');
    if (waarde === 'accepted') window.dispatchEvent(new Event('selectly-consent-given'));
  }

  function toon() {
    var style = document.createElement('style');
    style.textContent =
      '#selectly-consent-banner{position:fixed;bottom:0;left:0;right:0;background:' + INK + ';color:' + CREME + ';padding:16px 20px;z-index:9999;box-shadow:0 -4px 20px rgba(29,43,42,.22);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:14px;line-height:1.5}' +
      '#selectly-consent-banner .wrap{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}' +
      '#selectly-consent-banner p{margin:0;flex:1;min-width:240px}' +
      '#selectly-consent-banner a{color:' + CYAAN + ';text-decoration:underline}' +
      '#selectly-consent-banner .btns{display:flex;gap:8px;flex-shrink:0}' +
      '#selectly-consent-banner button{font-family:inherit;font-size:14px;font-weight:600;padding:10px 18px;border:none;border-radius:8px;cursor:pointer;transition:opacity .15s}' +
      // wit op cyaan haalt de contrastdrempel niet; donkere tekst op cyaan wel
      '#selectly-consent-banner button.accept{background:' + CYAAN + ';color:#08222b}' +
      '#selectly-consent-banner button.reject{background:transparent;color:' + CREME + ';border:1px solid rgba(242,245,246,.35)}' +
      '#selectly-consent-banner button:hover{opacity:.88}' +
      '#selectly-consent-banner button:focus-visible{outline:2px solid ' + CYAAN + ';outline-offset:2px}' +
      '@media(max-width:640px){#selectly-consent-banner{padding:14px 16px}#selectly-consent-banner button{padding:8px 14px;font-size:13px}}';
    document.head.appendChild(style);

    var balk = document.createElement('div');
    balk.id = 'selectly-consent-banner';
    balk.setAttribute('role', 'dialog');
    balk.setAttribute('aria-label', 'Cookietoestemming');
    balk.innerHTML =
      '<div class="wrap">' +
      '<p>We gebruiken cookies en de Meta-pixel om te meten hoe je onze site gebruikt. ' +
      'Weiger je, dan werkt alles gewoon. Lees onze <a href="/privacy.html">privacyverklaring</a>.</p>' +
      '<div class="btns">' +
      '<button class="reject" type="button">Weigeren</button>' +
      '<button class="accept" type="button">Akkoord</button>' +
      '</div></div>';
    document.body.appendChild(balk);
    document.body.classList.add('sl-consent-open');

    balk.querySelector('.accept').addEventListener('click', function () { zet('accepted'); });
    balk.querySelector('.reject').addEventListener('click', function () { zet('rejected'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', toon);
  } else {
    toon();
  }
})();
