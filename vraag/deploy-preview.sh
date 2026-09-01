#!/usr/bin/env bash
# Zet Stielkenner als losse Netlify-site online (project offertescout-preview).
#
# Waarom een apart script: op selectly.be redirect /vraag/* sinds 5 augustus met
# een geforceerde 301 naar de homepage, en dat blijft zo — een B2C-leadverkoper
# op het B2B-softwaredomein ondermijnt het prijsanker. De preview draait daarom
# op een eigen Netlify-project met een eigen formulierenbak.
#
# Gebruik:   ./vraag/deploy-preview.sh          (vanuit de repo-root)
#
# Vereist:   netlify-cli, ingelogd op het Selectly-account (beheer-suwie).
#            Controleer met: netlify status

set -euo pipefail

SITE_ID="fbdad8bd-6184-4d9f-92ee-c6caa9600362"   # offertescout-preview
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WERK="$(mktemp -d)"

# Publicatiemap en functiemap staan bewust NAAST elkaar, niet in elkaar. Stonden
# ze in elkaar, dan serveert Netlify de broncode van de functies gewoon mee:
# /netlify/functions/vakman.js gaf 200 met de volledige systeemprompt erin —
# alle grenzen, het feitenblok, het doorstuurmechanisme, vrij te downloaden.
SITE="$WERK/site"
FUNCTIES="$WERK/functies"

trap 'rm -rf "$WERK"' EXIT

mkdir -p "$SITE/vraag" "$FUNCTIES"

# De funnels zelf. .bak-bestanden blijven bewust achter.
cp "$REPO"/vraag/*.html "$SITE/vraag/"
rm -f "$SITE/vraag/tracker.html"   # intern rekenblad met inkoopprijzen, niet publiek
cp "$REPO"/vraag/pixel.js "$SITE/vraag/"
cp "$REPO"/vraag/*.svg "$SITE/vraag/"   # merkteken + logo-eenheid, o.a. voor de favicon
cp "$REPO"/vraag/stielkenner-chat.js "$REPO"/vraag/consent-stielkenner.js "$SITE/vraag/"

# De chat-assistent. Zonder dit bestand is de knop dood.
cp "$REPO"/netlify/functions/vakman.js "$FUNCTIES/"

# De leadafhandeling. Netlify koppelt de naam submission-created.js automatisch
# aan elke inzending, dus die naam moet het zijn — vandaar de hernoeming.
# Zonder dit bestand valt elke aanvraag in een bak die niemand opent.
cp "$REPO"/netlify/functions/stielkenner-submission.js "$FUNCTIES/submission-created.js"

# De pagina's verwijzen naar deze bestanden op de root van selectly.be,
# dus die moeten mee anders zijn het dode links.
cp "$REPO"/privacy.html "$REPO"/voorwaarden.html "$SITE/"
cp "$REPO"/lead-meta.js "$SITE/"

# De site leeft onder /vraag/, dus de root stuurt door.
cat > "$SITE/index.html" <<'HTML'
<!doctype html><meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=/vraag/">
<title>Stielkenner</title>
<a href="/vraag/">Naar Stielkenner</a>
HTML
printf '/  /vraag/  302\n' > "$SITE/_redirects"

# Eigen configuratie. Zonder dit leest de CLI de netlify.toml van de repo-root,
# en daarin staat de geforceerde 301 /vraag/* -> / die voor selectly.be bedoeld is.
# Die regel sloopte de preview volledig: elke funnelpagina gaf een 301.
#
# De beveiligingsheaders ontbraken volledig. Alleen HSTS kwam binnen, en die
# krijgen we gratis omdat netlify.app op de Public Suffix List staat — bij verhuis
# naar een eigen domein valt dat weg. Vandaar hier expliciet.
cat > "$SITE/netlify.toml" <<'TOML'
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https://www.facebook.com; connect-src 'self' https://www.facebook.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=(), payment=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
TOML

echo "Deployen: site=$SITE  functies=$FUNCTIES"
# Vanuit de bouwmap draaien, anders leest de CLI de netlify.toml van de repo-root
# en die bevat de geforceerde 301 /vraag/* -> / die voor selectly.be bedoeld is.
# Dat legt elke funnelpagina plat. De functiemap krijgt een absoluut pad mee.
( cd "$SITE" && netlify deploy --prod --dir . --functions "$FUNCTIES" --site "$SITE_ID" )

echo
echo "Live: https://offertescout-preview.netlify.app"
echo "Inzendingen: https://app.netlify.com/projects/offertescout-preview/forms"
