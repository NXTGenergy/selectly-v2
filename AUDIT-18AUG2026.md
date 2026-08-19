# Site-audit 18 augustus 2026 — wat er gebeurd is en wat er nog moet

Zeven specialisten hebben selectly.be van A tot Z doorgelicht (webdev, copy, finance,
IT, analyst, sales, AI). De boardroom heeft de lijst teruggebracht tot wat écht moest.

Volledige rapporten: `.claude/jobs/82104e40/tmp/reports/` (verdwijnen bij opruimen van
de job — kopieer ze als je ze wil houden).

---

## JIJ MOET NOG DRIE DINGEN DOEN — 15 minuten

### 1. Uitgavenlimiet op de Anthropic Console — 2 min
De code noemt dit "de echte rem" tegen misbruik van de chatbot, maar niemand heeft
gecontroleerd of die limiet er ook echt staat. Zet een maandlimiet (bv. €50) met een
waarschuwing op 50%. De rate-limiting in de code zit in het geheugen van één lambda-
container en houdt bij gelijktijdig verkeer dus veel minder tegen dan bedoeld.

### 2. Eén echt testgesprek met de chatbot — 10 min
**Dit is niet optioneel.** Bij de audit gaf het GHL-token een 401 op een read-only
probe. Waarschijnlijk een scope-kwestie, maar als dat token echt verlopen is, sneuvelt
élke chatbot-lead — stil.

Doe dit na de merge:
1. Open de chat op selectly.be, voer een kort gesprek, geef `test-18aug@selectly.be`.
2. Kijk of het contact in GHL verschijnt én of je een Telegram-melding krijgt.
3. Doe daarna een tweede gesprek waarin je expliciet **geen** e-mail geeft, maar wel
   vertelt dat je 6 man hebt en 60 aanvragen per maand. Je hoort nu een Telegram-
   melding te krijgen met het volledige transcript. Dat is de nieuwe vangnet-code.
4. Verwijder de testcontacten.

### 3. De hybride-btw-regel laten bevestigen — 5 min
Ik heb de foute claim rechtgezet: bij een woning ouder dan tien jaar is een hybride
warmtepomp **niet** uitgesloten van 6%, maar wordt er opgesplitst. De analist kon de
circulaire niet rechtstreeks op fisconetplus inzien, alleen via integrale weergaves.
Laat dit even bevestigen door de boekhouder vóór je het in een verkoopgesprek gebruikt.
Het staat nu bewust zonder percentages op de site, precies daarom.

---

## WAT ER NIET MEER MOET (bewust uitgesteld)

De boardroom heeft dit expliciet van tafel geveegd tot na de eerste drie klanten.
Niet vergeten, wel laten liggen:

| Wat | Waarom niet nu |
|---|---|
| Tailwind builden, WebP, CSP | Halve dag. TTFB is 0,09 s. Geen omzetprobleem. |
| Gedeeld CSS/config over 19 pagina's | Zuivere refactor. De config staat 17x gedupliceerd. |
| ROI-model v2 met margeslider | Vervangt een tool die niemand gebruikt door een betere. |
| Homepage herordenen 16 -> 11 secties | Herbouw, geen fix. De twee dubbele secties zijn wel geknipt. |
| u/je harmoniseren over 7 pagina's | 2-3 uur, nul euro. |
| 45x mint-contrast, 39x white/40 | Toegankelijkheid. Reëel, maar niemand haakt hierop af. |
| Bouwsoft/Robaws/Odoo/Peppol-blok | Is een gespreksantwoord, geen webpagina. Pas als drie prospects ernaar vragen. |
| Mobiele nav op 8 pagina's | Die pagina's krijgen geen verkeer uit de outreach. |
| Screenshots + schermopname | Je hebt nog geen echt klantmateriaal. Komt uit Duocar. |

Eén regel zodra de outreach vertrekt: **alleen wat een echte prospect in een echt
gesprek benoemt, komt op de sitelijst.**

---

## NOG NIET GEDAAN UIT HET BOARDROOM-PLAN

Deze stonden in het dinsdagblok en zijn nog open:

- **Identiteitsstrook onder de hero** — BV NXTG Solutions, BTW BE1037.580.195, Brugge,
  telefoonnummer, KBO-link. "Wie zijn jullie" is vraag 1 voor een Belgische zaakvoerder
  en wordt nergens beantwoord. 45 min.
- **Founding-client-aanbod** — tien plaatsen, €0 setup, 90-dagen responstijd-clausule
  (halveren van je reactietijd of je krijgt drie maanden terug). Dit verklaart meteen
  waarom er geen logo's op de site staan: de zwakte wordt het argument. 30 min.
- **Case-affiliatie disclosen** — zeg gewoon "ons eigen installatiebedrijf". Dat haalt
  een juridisch risico weg én het verhaal wordt sterker. 15 min.
- **"Aanbevolen" verplaatsen van Growth (€1.950) naar Starter (€950)** — je duwt nu je
  eigen doelgroep weg. 5 min.
- **`over.html:280`** zegt "We laten alleen echte namen staan" terwijl er nergens een
  naam staat. Op de pagina over eerlijkheid.
- **"€0 setup bij 3 maanden vooraf"** is 35,7% korting op kwartaal 1 om €900 twee
  maanden vroeger te krijgen. Beter: €0 setup bij 6 maanden vooraf.

---

## NIET KUNNEN VERIFIËREN

- **De scroll-naar-formulier bij een ROI-link.** De code klopt en de prefill werkt
  aantoonbaar (inclusief tekst met een %-teken, wat vroeger stukging door een dubbele
  decode). Maar scrollen werd in de testbrowser willekeurig geblokkeerd — dezelfde
  code werkte de ene keer wel en de andere keer niet. Check dit even zelf: open
  `selectly.be/?roi=test#contact` en kijk of je onderaan bij het formulier landt.
- **Responsive op een echt toestel.** Het venster liet zich niet verkleinen in de
  testbrowser. De webdev-agent heeft het uit de breakpoint-klassen gehaald: de nav
  klapt open op 768px maar heeft ~960px nodig, dus die breekt op iPad portrait.
  Dat is nog niet gefixt.
- **GHL en Netlify Forms hosting-locatie.** Ik heb security.html eerlijker gemaakt
  (VS + SCC's in plaats van EU-only), maar bevestig de exacte locaties bij je
  leveranciers vóór je de DPA ondertekent bij een klant.

---

## DE KERN VAN HET BOARDROOM-OORDEEL

> De site is niet de bottleneck. 25 mails geven 1 tot 3 bezoekers. Het verschil tussen
> deze site en een perfecte site is bij drie bezoekers exact nul klanten.
>
> Zeven agents die 150 punten vinden op een site die live staat, werkt, een chatbot
> draait die drie prompt-injecties afslaat en nul hardcoded secrets heeft — dat is een
> bevestiging dat de site af is, niet dat hij stuk is. Een audit vindt altijd 150
> dingen. Dat is wat een audit doet.
>
> Verdeling deze week: 1 dag site, 4 dagen verkoop.
