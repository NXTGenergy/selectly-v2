/*
 * Selectly Portal — auth guard
 *
 * Beveilig portal pages: redirect naar /portal/login.html als user niet ingelogd.
 *
 * Bypass voor sales-demo: ?demo=1, maar ALLEEN op de demo-omgeving (nxtg.html en
 * installateur.html). Voorheen opende die parameter elke pagina, inclusief admin.html
 * met de klantenlijst en de omzet per klant — voor iedereen die de URL kende.
 *
 * Let op: deze controle draait in de browser en is dus geen echte beveiliging. De HTML
 * is al geleverd voor dit script iets doet. Vóór er een echte klant op staat, moet dit
 * afgedwongen worden aan de rand, via role-based redirects in netlify.toml.
 *
 * Voorwaarden:
 *   - Netlify Identity widget moet geladen zijn op de page (zie include voor </body>)
 *   - Selectly moet Identity activeren in Netlify dashboard:
 *       Project → Add-ons & integrations → Netlify Identity → Enable Identity
 *       Settings → Registration preferences → Invite only
 *       Settings → External providers (optioneel: Google/Microsoft SSO)
 */
(function () {
  const PORTAL_LOGIN = "/portal/login.html";

  // Demo-bypass alleen op de demo-omgeving. Nooit op admin, leads, offertes,
  // campagnes, instellingen of een klantportaal.
  const DEMO_TOEGELATEN = ["/portal/nxtg.html", "/portal/installateur.html"];
  const opDemoPagina = DEMO_TOEGELATEN.indexOf(window.location.pathname) !== -1;

  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") === "1" && opDemoPagina) {
    sessionStorage.setItem("selectly_demo", "1");
  }
  if (sessionStorage.getItem("selectly_demo") === "1" && opDemoPagina) {
    return; // demo-omgeving, geen login nodig
  }

  function redirectToLogin() {
    const next = encodeURIComponent(window.location.pathname);
    window.location.href = `${PORTAL_LOGIN}?next=${next}`;
  }

  function check(retries = 30) {
    if (!window.netlifyIdentity) {
      if (retries > 0) {
        setTimeout(() => check(retries - 1), 100);
      } else {
        // Identity widget niet geladen → fall back to login
        console.warn("[Selectly] Netlify Identity widget niet gevonden — redirect naar login");
        redirectToLogin();
      }
      return;
    }
    window.netlifyIdentity.on("init", user => {
      if (!user) redirectToLogin();
    });
  }

  check();
})();
