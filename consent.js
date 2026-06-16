/*
 * Selectly — GDPR cookie consent banner
 * Vanilla JS, geen externe afhankelijkheden.
 * Bij accept dispatcht 'selectly-consent-given' event → Meta Pixel laadt dan pas.
 */
(function () {
  var KEY = 'selectly_consent';
  var existing = null;
  try { existing = localStorage.getItem(KEY); } catch (e) {}
  if (existing === 'accepted' || existing === 'rejected') return;

  function setConsent(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    var el = document.getElementById('selectly-consent-banner');
    if (el) el.remove();
    if (value === 'accepted') {
      window.dispatchEvent(new Event('selectly-consent-given'));
    }
  }

  function render() {
    var style = document.createElement('style');
    style.textContent =
      '#selectly-consent-banner{position:fixed;bottom:0;left:0;right:0;background:#1a2a2a;color:#fff;padding:16px 20px;z-index:9999;box-shadow:0 -4px 20px rgba(0,0,0,0.15);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:14px;line-height:1.5}' +
      '#selectly-consent-banner .wrap{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}' +
      '#selectly-consent-banner p{margin:0;flex:1;min-width:240px}' +
      '#selectly-consent-banner a{color:#7ee5b5;text-decoration:underline}' +
      '#selectly-consent-banner .btns{display:flex;gap:8px;flex-shrink:0}' +
      '#selectly-consent-banner button{font-family:inherit;font-size:14px;font-weight:600;padding:10px 18px;border:none;border-radius:8px;cursor:pointer;transition:opacity .15s}' +
      '#selectly-consent-banner button.accept{background:#34D399;color:#0a1414}' +
      '#selectly-consent-banner button.reject{background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.3)}' +
      '#selectly-consent-banner button:hover{opacity:.85}' +
      '@media(max-width:640px){#selectly-consent-banner{padding:14px 16px}#selectly-consent-banner button{padding:8px 14px;font-size:13px}}';
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'selectly-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie toestemming');
    banner.innerHTML =
      '<div class="wrap">' +
      '<p>We gebruiken cookies en Meta Pixel om je bezoek te meten en onze ads te optimaliseren. Lees onze <a href="/privacy.html">privacy policy</a>.</p>' +
      '<div class="btns">' +
      '<button class="reject" type="button">Weigeren</button>' +
      '<button class="accept" type="button">Akkoord</button>' +
      '</div></div>';
    document.body.appendChild(banner);

    banner.querySelector('.accept').addEventListener('click', function () { setConsent('accepted'); });
    banner.querySelector('.reject').addEventListener('click', function () { setConsent('rejected'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
