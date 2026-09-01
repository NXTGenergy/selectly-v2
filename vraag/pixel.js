/*
 * Stielkenner Pixel — sector-specifieke Meta tracking.
 *
 * STAAT UIT tot er een eigen Meta Pixel-ID is. Twee redenen:
 *
 * 1. Hij draaide op hetzelfde ID als selectly.be (852925924180054), terwijl het
 *    commentaar hierboven al zei dat de data niet mocht mengen. Particulieren die
 *    een dakwerker zoeken kwamen zo in de doelgroepen van een B2B-campagne die
 *    zaakvoerders van installatiebedrijven wil bereiken. Dat vervuilt precies het
 *    publiek waar Selectly's advertentiebudget op mikt.
 * 2. De lead-tarieven stonden hier als platte tekst in een publiek bestand. Wat
 *    een installateur per lead betaalt is onderhandelingsinformatie; die hoort
 *    niet op de site. Ze zijn hier weg en staan enkel nog in de interne configuratie.
 *
 * Aanzetten zodra er een eigen pixel is: zet PIXEL_ID hieronder. De waarde per
 * lead komt dan uit een instelling, niet uit dit bestand.
 *
 * Custom events die hij stuurt zodra hij aanstaat:
 *   Stielkenner_View · Stielkenner_Start · Stielkenner_Step · Stielkenner_Lead_{sector}
 */
(function () {
  // Leeg = uit. Vul hier het eigen Stielkenner-pixel-ID in, niet dat van Selectly.
  var PIXEL_ID = '';

  function getSector() {
    var m = window.location.pathname.match(/\/vraag\/([a-z]+)\.html/);
    return m ? m[1] : 'unknown';
  }

  function loadPixel() {
    if (!PIXEL_ID || window._stielkennerPixelLoaded) return;
    window._stielkennerPixelLoaded = true;

    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', PIXEL_ID);

    var sector = getSector();

    // Custom event in plaats van een gewone PageView, zodat dit verkeer in Meta
    // te onderscheiden blijft van dat van Selectly.
    fbq('trackCustom', 'Stielkenner_View', { sector: sector, content_category: 'stielkenner' });

    var nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      var gestart = false;
      nextBtn.addEventListener('click', function () {
        if (!gestart) {
          gestart = true;
          fbq('trackCustom', 'Stielkenner_Start', { sector: sector });
        }
        fbq('trackCustom', 'Stielkenner_Step', {
          sector: sector,
          step: parseInt(document.querySelector('.step-pane.active')?.dataset.step || '1', 10)
        });
      });
    }

    // Geen bedrag meesturen: de waarde per lead is interne informatie en Meta
    // heeft ze niet nodig om op conversies te optimaliseren.
    document.querySelectorAll('form[data-netlify="true"]').forEach(function (form) {
      form.addEventListener('submit', function () {
        fbq('track', 'Lead', { content_category: 'stielkenner_' + sector, content_name: sector });
        fbq('trackCustom', 'Stielkenner_Lead_' + sector, { sector: sector });
      });
    });
  }

  // Pas laden na toestemming.
  try {
    if (localStorage.getItem('selectly_consent') === 'accepted') {
      loadPixel();
    } else {
      window.addEventListener('selectly-consent-given', loadPixel, { once: true });
    }
  } catch (e) { /* localStorage geblokkeerd -> geen tracking */ }
})();
