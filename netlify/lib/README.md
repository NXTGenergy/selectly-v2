# Chatgesprekken van de assistent op selectly.be

Elk gesprek met de chatwidget (`intake-widget.js` → `netlify/functions/intake.js`) wordt
bij elke beurt bewaard, ongeacht e-mail of score. Waarom: vroeger bleef alleen bewaard wat
in GHL of Telegram belandde; de rest ging verloren.

- **Opslag**: Netlify Blobs, store `chat-gesprekken`, sleutel `YYYY-MM-DD/<gespreks-id>`
  (Belgische datum van het eerste bericht). Het id komt van de widget (sessionStorage).
  90 dagen bewaard.
- **Telegram**: één melding bij het eerste bericht van een gesprek; verder de bestaande
  meldingen (nieuwe lead, warm gesprek zonder e-mail, storingen).
- **GHL**: zodra er een contact is, staat het volledige gesprek als één notitie op de fiche
  en wordt die bij elke beurt bijgewerkt.
- **Mail**: `chat-onderhoud` (gepland, elk kwartier) mailt elk gesprek dat 20 minuten stil
  ligt naar info@selectly.be via GHL, in het Selectly-sjabloon. Komt er nadien nog een beurt
  bij, dan volgt een bijgewerkte mail. De vlag staat in store `chat-gemaild`. Dezelfde run
  wist alles ouder dan 90 dagen.
- **Lezen als mens**: https://selectly.be/portal/chats.html — Netlify Identity, rol `admin`.
- **Lezen als script/Claude**: `chat-gesprekken` met het export-token (env
  `CHAT_EXPORT_TOKEN` op de Netlify-site; lokale kopie in `~/.config/selectly/chat-export.env`,
  buiten elke repo).

```sh
source ~/.config/selectly/chat-export.env   # zet CHAT_EXPORT_TOKEN, niets anders
curl -s -H "Authorization: Bearer $CHAT_EXPORT_TOKEN" \
  "https://selectly.be/.netlify/functions/chat-gesprekken?van=2026-09-01&tot=2026-09-30&zonder_test=1"
# zonder parameters: lijst van dagen met aantallen
# POST ...?actie=onderhoud[&stil_minuten=0] draait de mail-en-opruimronde meteen
```

Testgesprekken: begin het eerste bericht met `TEST` (hoofdletters). Ze krijgen een label in
het overzicht, in Telegram en in de mail.
