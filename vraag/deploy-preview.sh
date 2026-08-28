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
BUILD="$(mktemp -d)/offertescout"

trap 'rm -rf "$(dirname "$BUILD")"' EXIT

mkdir -p "$BUILD/vraag"

# De funnels zelf. .bak-bestanden blijven bewust achter.
cp "$REPO"/vraag/*.html "$BUILD/vraag/"
cp "$REPO"/vraag/pixel.js "$BUILD/vraag/"
cp "$REPO"/vraag/*.svg "$BUILD/vraag/"   # merkteken + logo-eenheid, o.a. voor de favicon
cp "$REPO"/vraag/stielkenner-chat.js "$BUILD/vraag/"

# De chat-assistent draait als Netlify-functie. Zonder deze map is de knop dood.
mkdir -p "$BUILD/netlify/functions"
cp "$REPO"/netlify/functions/vakman.js "$BUILD/netlify/functions/"

# De pagina's verwijzen naar deze bestanden op de root van selectly.be,
# dus die moeten mee anders zijn het dode links.
cp "$REPO"/privacy.html "$REPO"/voorwaarden.html "$BUILD/"
cp "$REPO"/consent.js "$REPO"/lead-meta.js "$BUILD/"

# De site leeft onder /vraag/, dus de root stuurt door.
cat > "$BUILD/index.html" <<'HTML'
<!doctype html><meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=/vraag/">
<title>Stielkenner</title>
<a href="/vraag/">Naar Stielkenner</a>
HTML
printf '/  /vraag/  302\n' > "$BUILD/_redirects"

# Eigen configuratie. Zonder dit leest de CLI de netlify.toml van de repo-root,
# en daarin staat de geforceerde 301 /vraag/* -> / die voor selectly.be bedoeld is.
# Die regel sloopte de preview volledig: elke funnelpagina gaf een 301.
cat > "$BUILD/netlify.toml" <<'TOML'
[build]
  publish = "."
  functions = "netlify/functions"
TOML

echo "Deployen vanuit $BUILD"
( cd "$BUILD" && netlify deploy --prod --dir . --site "$SITE_ID" )

echo
echo "Live: https://offertescout-preview.netlify.app"
echo "Inzendingen: https://app.netlify.com/projects/offertescout-preview/forms"
