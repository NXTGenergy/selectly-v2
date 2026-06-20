/*
 * Selectly Portal — auth guard
 *
 * Beveilig portal pages: redirect naar /portal/login.html als user niet ingelogd.
 *
 * Bypass voor sales-demo: ?demo=1 in URL (Steffie kan tijdens prospect-calls portal
 * tonen zonder login). Demo-vlag wordt in sessionStorage bewaard zodat tab-navigation
 * werkt.
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

  // Demo bypass via URL ?demo=1 — persist in sessionStorage
  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") === "1") {
    sessionStorage.setItem("selectly_demo", "1");
  }
  if (sessionStorage.getItem("selectly_demo") === "1") {
    console.info("[Selectly] Demo-mode actief — login bypass");
    return; // no auth-check, allow access
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
