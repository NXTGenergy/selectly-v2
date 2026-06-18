/*
 * OfferteScout Pixel — sector-specifieke Meta tracking
 *
 * Apart van Selectly's B2B Pixel zodat data niet mengt.
 * Voor nu zelfde Pixel-ID (852925924180054) maar custom events per sector.
 *
 * Custom events per sector:
 *   - OfferteScout_View_{sector}    (PageView gequalificeerd)
 *   - OfferteScout_Start            (eerste step gestart)
 *   - OfferteScout_Step             (elke stap voltooid)
 *   - OfferteScout_Lead_{sector}    (form submitted, met value = lead-fee)
 *
 * Lead-fees zoals in installateurs.json:
 *   zonnepanelen: 35 / thuisbatterij: 40 / warmtepomp: 60 / airco: 30 / dakwerken: 45
 *
 * Voor Steffie's optimization: maak in Meta Custom Conversions per
 * OfferteScout_Lead_{sector} event met value-tracking → optimaliseert
 * naar duurste leads.
 *
 * Migratie naar eigen Meta Pixel-ID (later, na eigen domein):
 *   Vervang PIXEL_ID hieronder. State.html + ads campaign moet ook
 *   nieuw Pixel hebben.
 */
(function () {
  var PIXEL_ID = '852925924180054';

  // Lead-fees (sync met installateurs.json)
  var LEAD_FEES = {
    zonnepanelen: 35,
    thuisbatterij: 40,
    warmtepomp: 60,
    airco: 30,
    dakwerken: 45
  };

  // Detect sector from URL
  function getSector() {
    var path = window.location.pathname;
    var match = path.match(/\/vraag\/([a-z]+)\.html/);
    return match ? match[1] : 'unknown';
  }

  function loadPixel() {
    if (window._offerteScoutPixelLoaded) return;
    window._offerteScoutPixelLoaded = true;

    // Standard FB Pixel init
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', PIXEL_ID);

    var sector = getSector();

    // Custom event ipv generic PageView → onderscheid van Selectly traffic
    fbq('trackCustom', 'OfferteScout_View', {
      sector: sector,
      content_category: 'offertescout'
    });

    // Track form-start (eerste click op next button)
    var nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      var startTracked = false;
      nextBtn.addEventListener('click', function () {
        if (!startTracked) {
          startTracked = true;
          fbq('trackCustom', 'OfferteScout_Start', { sector: sector });
        }
        // Track elke stap-progressie (debounced)
        fbq('trackCustom', 'OfferteScout_Step', {
          sector: sector,
          step: parseInt(document.querySelector('.step-pane.active')?.dataset.step || '1', 10)
        });
      });
    }

    // Track form-submit als Lead met value
    document.querySelectorAll('form[data-netlify="true"]').forEach(function (form) {
      form.addEventListener('submit', function () {
        var fee = LEAD_FEES[sector] || 30;
        fbq('track', 'Lead', {
          value: fee,
          currency: 'EUR',
          content_category: 'offertescout_' + sector,
          content_name: sector
        });
        fbq('trackCustom', 'OfferteScout_Lead_' + sector, {
          value: fee,
          currency: 'EUR'
        });
      });
    });
  }

  // GDPR consent gating
  try {
    if (localStorage.getItem('selectly_consent') === 'accepted') {
      loadPixel();
    } else {
      window.addEventListener('selectly-consent-given', loadPixel, { once: true });
    }
  } catch (e) { /* localStorage geblokkeerd → geen tracking */ }
})();
