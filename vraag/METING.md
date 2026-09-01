# Meting — Stielkenner

**Regel: elk merk heeft zijn eigen pixel, eigen analytics en eigen doelgroepen.
Nooit een ID hergebruiken van een andere site.**

Selectly verkoopt aan zaakvoerders van installatiebedrijven, Stielkenner aan
particulieren die een vakman zoeken. Deel je één pixel, dan leert Meta dat
"mensen die een dakwerker zoeken" tot de doelgroep van de B2B-campagne behoren.
Dan verbrand je advertentiebudget op het verkeerde publiek, en de data is achteraf
niet meer te scheiden.

## Stand vandaag

De pixel staat **uit**. In `pixel.js` is `PIXEL_ID` leeg gelaten.

Dat is bewust: tot 31 augustus 2026 draaide deze site op het pixel-ID van
selectly.be (`852925924180054`), op twee plaatsen — in `pixel.js` en nog eens hard
ingebakken in `bedankt.html`. Beide zijn verwijderd. Liever een paar weken zonder
cijfers dan vervuilde doelgroepen.

## Aanzetten

1. Maak in Meta Business Manager een **nieuwe** dataset aan voor Stielkenner. Niet
   de bestaande hergebruiken, niet "voorlopig even dezelfde".
2. Zet het ID in `vraag/pixel.js`, bij `var PIXEL_ID = ''`.
3. Deployen met `./vraag/deploy-preview.sh`.
4. Controleer met de Meta Pixel Helper dat er op selectly.be **geen**
   Stielkenner-events binnenkomen en omgekeerd.

## Wat er gemeten wordt zodra hij aanstaat

| Event | Wanneer |
|---|---|
| `Stielkenner_View` | pagina bekeken, met de sector erbij |
| `Stielkenner_Start` | eerste stap van de funnel gezet |
| `Stielkenner_Step` | elke volgende stap |
| `Stielkenner_Lead_{sector}` | formulier verstuurd |
| `Lead` | standaard-event, voor de optimalisatie |

Er gaat **geen bedrag** mee met die events. Wat een installateur per lead betaalt
is onderhandelingsinformatie en hoort niet in code die iedereen kan lezen — het
stond hier tot 31 augustus wél in. Meta heeft die waarde niet nodig om op
conversies te optimaliseren.

## Toestemming

De pixel laadt pas na akkoord op de cookiebalk. Die draait op
`vraag/consent-stielkenner.js`, een eigen versie in het merkpalet; de gedeelde
`consent.js` van selectly.be blijft ongemoeid. De opslagsleutel
(`selectly_consent`) en het event (`selectly-consent-given`) zijn bewust
ongewijzigd gebleven — hernoem je die, dan laadt de pixel nooit meer.

## Hetzelfde geldt voor de rest

Niet alleen de pixel: ook de formulierenbak, het CRM-sub-account, de
mailafzender en de bewaartermijn horen per merk gescheiden. Verschillende merken
hebben onder de AVG verschillende doelen en rechtsgronden.
