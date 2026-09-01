#!/usr/bin/env bash
# Controleert de live site van buitenaf. Draai dit na elke deploy en zeker
# voor je advertenties aanzet.
#
#   bash tools/controleer-live.sh
#
# Rode regels zijn blokkerend. Groene niet. De test doet geen enkele
# inzending die als echte lead in GHL terechtkomt (het honeypot-veld is
# ingevuld, dus Netlify markeert het als spam).

SITE="${SITE:-https://selectly.be}"
rood=0; groen=0

R='\033[0;31m'; G='\033[0;32m'; Y='\033[0;33m'; B='\033[1m'; N='\033[0m'

ok()   { printf "  ${G}ok${N}    %s\n" "$1"; groen=$((groen+1)); }
fout() { printf "  ${R}FOUT${N}  %s\n" "$1"; rood=$((rood+1)); }
kop()  { printf "\n${B}%s${N}\n" "$1"; }

code() { curl -s -o /dev/null -w '%{http_code}' -m 20 "$@"; }

kop "1. Functies — hier komen de leads binnen"

for f in intake berekening; do
  c=$(curl -s -o /tmp/_ctl.txt -w '%{http_code}' -m 25 -X POST "$SITE/.netlify/functions/$f" \
        -H 'Content-Type: application/json' \
        -d '{"messages":[{"role":"user","content":"test"}]}')
  case "$c" in
    200|400) ok "$f draait (HTTP $c)" ;;
    502)     fout "$f geeft 502 — de functie crasht. Leads komen NIET binnen." ;;
    *)       fout "$f geeft HTTP $c" ;;
  esac
done

# vakman weigert bewust op selectly.be (host-allowlist in de functie zelf).
c=$(code -X POST "$SITE/.netlify/functions/vakman" -H 'Content-Type: application/json' -d '{}')
[ "$c" = "404" ] && ok "vakman weigert op dit domein (host-allowlist, zo bedoeld)" \
                 || fout "vakman geeft HTTP $c — verwacht 404 op selectly.be"

kop "2. Formulier — het vangnet onder de chatbot"

c=$(code -X POST "$SITE/" \
      -H 'Content-Type: application/x-www-form-urlencoded' \
      --data-urlencode 'form-name=contact' \
      --data-urlencode 'bot-field=controle-script-geen-echte-lead')
[ "$c" = "200" ] && ok "contactformulier is geregistreerd bij Netlify" \
                 || fout "contactformulier geeft HTTP $c — inzendingen komen nergens aan"

kop "3. Interne bestanden mogen niet publiek zijn"

for pad in AUDIT-18AUG2026.md package.json tools/bouw-portalen.mjs \
           _bron/blog/ai-chatbot-voor-website.md netlify/functions/intake.js \
           index.html.bak-stack .git/config; do
  c=$(code "$SITE/$pad")
  [ "$c" = "404" ] || [ "$c" = "301" ] || [ "$c" = "302" ] \
    && ok "$pad afgeschermd ($c)" \
    || fout "$pad staat PUBLIEK (HTTP $c)"
done

kop "4. Klantportaal zit dicht"

for pad in portal/admin.html portal/favorcool.html portal/mertens.html \
           portal/leads.html portal/_klanten/favorcool.json onboarding/index.html; do
  c=$(code "$SITE/$pad")
  [ "$c" = "302" ] && ok "$pad → login ($c)" \
                   || fout "$pad geeft HTTP $c — verwacht 302 naar login"
done

kop "5. Publieke pagina's laden"

for pad in "" pakketten.html vergelijken.html roi.html over.html case-installateur.html \
           security.html voor-hvac.html voor-dakwerken.html voor-zonnepanelen.html \
           calculator.html demo-ai.html privacy.html voorwaarden.html bedankt.html \
           blog/ sitemap.xml robots.txt; do
  c=$(code "$SITE/$pad")
  [ "$c" = "200" ] && ok "/$pad" || fout "/$pad geeft HTTP $c"
done

kop "6. Pagina's die uit de lucht moeten"

for pad in omzetscan.html status.html roadmap.html; do
  c=$(code "$SITE/$pad")
  [ "$c" = "301" ] && ok "/$pad omgeleid ($c)" \
                   || fout "/$pad geeft HTTP $c — verwacht 301"
done

kop "7. Beveiligingsheaders"

h=$(curl -sI -m 20 "$SITE/")
for header in "strict-transport-security" "content-security-policy" \
              "x-frame-options" "x-content-type-options" "referrer-policy"; do
  echo "$h" | grep -qi "^$header" && ok "$header" || fout "$header ontbreekt"
done

echo "$h" | grep -qi '^HTTP.*200' && ok "homepage 200" || fout "homepage laadt niet"

kop "8. Geen sporen van de zaakvoerder in publieke pagina's"

for term in "Van Poucke" "bartvanpoucke" "beheer.suwie"; do
  if curl -s -m 20 "$SITE/" "$SITE/over.html" "$SITE/privacy.html" | grep -qi "$term"; then
    fout "'$term' staat op een publieke pagina"
  else
    ok "'$term' komt niet voor"
  fi
done

kop "9. Publieke verkoopdemo bevat geen echte klantgegevens"

demo=$(curl -s -m 20 "$SITE/portal/demo.html" "$SITE/portal/installateur.html")
for naam in Mertens Favorcool Duocar; do
  echo "$demo" | grep -q "$naam" \
    && fout "'$naam' staat op een publiek bereikbare portaalpagina" \
    || ok "'$naam' staat niet op de publieke demo"
done

kop "10. Privacybeleid noemt de verwerkers die er echt zijn"

priv=$(curl -s -m 20 "$SITE/privacy.html")
for verwerker in Telegram Anthropic Netlify Meta; do
  echo "$priv" | grep -qi "$verwerker" \
    && ok "$verwerker staat in het privacybeleid" \
    || fout "$verwerker ontbreekt in het privacybeleid (AVG art. 13)"
done

kop "11. Chatwidget heeft een vangnet"

wid=$(curl -s -m 20 "$SITE/intake-widget.js")
echo "$wid" | grep -q 'toonVangnet' \
  && ok "vangnet aanwezig in de widget" \
  || fout "vangnet ontbreekt — bij een storing verdwijnen leads stil"
curl -s -m 20 "$SITE/" | grep -q 'name="form-name" value="contact"' \
  && ok "formuliernaam 'contact' staat statisch in de homepage (vangnet werkt)" \
  || fout "formuliernaam 'contact' ontbreekt — Netlify weigert de vangnet-inzendingen stil"

printf "\n${B}Uitslag:${N} ${G}%s ok${N}, ${R}%s fout${N}\n" "$groen" "$rood"

if [ "$rood" -gt 0 ]; then
  printf "${R}Niet activeren zolang er rode regels staan.${N}\n"
  exit 1
fi

printf "${G}Alles wat van buitenaf te controleren valt, staat goed.${N}\n"
printf "${Y}Dit script kan drie dingen NIET zien — die moet je zelf nakijken:${N}\n"
printf "  1. Of het GHL-token nog geldig is (een lead kan 200 geven en toch nergens aankomen)\n"
printf "  2. Of de Telegram-melding binnenkomt\n"
printf "  3. Of het uitgavenplafond op de Anthropic Console staat\n"
exit 0
