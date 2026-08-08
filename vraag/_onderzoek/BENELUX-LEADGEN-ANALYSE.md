# Benelux lead-gen marktplaatsen — analyse voor OfferteScout
Datum: 2026-08-08 · Bron-scope: live HTTP-fetches (curl + WebFetch) + whois. Alles hieronder is uit de echte HTML gehaald tenzij expliciet gemarkeerd als [SECUNDAIR] of [NIET GEVERIFIEERD].

## Vraag
Wat doen de marktleiders in BE/NL leadgen voor bouw/energie concreet op hun pagina's, wat nemen we over, wat bewust niet, en hoe zit het met offertescout.nl?

## Hoofdbevindingen (TL;DR)
1. **Het BE-veld is aan het leeglopen.** offerte.be is opgeslokt door Solvari ("Offerte.be is nu Solvari!"), Livios.be is gestopt (redirect naar Mijnenergie.be), Tips.be is een Oostends weekblad dat in 2025 stopte, offertes.nl resolvet niet meer (DNS SERVFAIL). Er blijven in BE feitelijk **twee** serieuze spelers over: Bobex en Solvari.
2. **Otovo.be verkoopt in BE niet meer actief zelf** — de homepage is nu volledig "Otovo Care" (onderhoudsabonnement €9/€29/€49 per maand). Alleen de stads-SEO-pagina's (/locator/zonnepanelen-antwerpen/) draaien nog een offerte-funnel.
3. **Trustoo.nl heeft onze positionering al**: H1 = "Leg uit wat je nodig hebt · Wij vinden de beste match voor jou", met een AI-textarea als primaire input. Zij matchen wel nog naar max 4 bedrijven. Onze "één match" is dus de logische volgende stap, niet een uitvinding.
4. **De hele markt gebruikt hetzelfde funnel-recept**: postcode/dakvorm eerst → 4-6 kwalificatievragen → contactgegevens laatst → "tot 4 offertes, gratis, vrijblijvend". Bobex is de uitzondering (één lange formulierpagina zonder stappen).
5. **De sterkste trust-assets zijn niet reviews maar real-time volume-tellers.** Solvari toont naast het formulier letterlijk: "Laatste aanvraag - 2 minuten geleden", "Gemiddeld 919 offerteaanvragen per dag", "2,013,967 mensen gingen je voor", "17+ jaar ervaring". Slimster heeft een ticker "Zojuist vergeleken: 01:16 Hattem / 23:57 Katwijk / 23:22 Amstelveen".
6. **offertescout.nl is een geparkeerd domein**, geen bedrijf. Zero verwarringsrisico. En **offertescout.be is vandaag nog vrij**.

---

## Tabel "wie doet wat"

| | Bobex.be | Solvari.be | Trustoo.nl | Slimster.nl | Homedeal.nl | Otovo.be | Werkspot.nl |
|---|---|---|---|---|---|---|---|
| Markt | BE | BE+NL | NL | NL | NL | BE | NL |
| Hero-H1 | "Vind de beste vakman of installateur" | "Vind en vergelijk specialisten in jouw buurt" | "Leg uit wat je nodig hebt / Wij vinden de beste match voor jou" | "Vind jouw beste deal" | "Vind de beste vakspecialist voor in en om je huis" | "Zonnepanelen in Antwerpen: Met of zonder thuisbatterij, altijd vakkundig geïnstalleerd" | [GEBLOKKEERD] |
| Hoofd-CTA | "Start uw zoekopdracht" | "Vergelijk offertes" | "Help mij zoeken →" | "Thuisbatterij offerte aanvragen" | "Start jouw project" | "Nu offerte aanvragen!" / "Doe nu een dakscan!" | [GEBLOKKEERD] |
| Eerste veld | vrij zoekveld | **postcode** ("Bv. 9000") | **AI-textarea** of dienst-zoek | **postcode** (+ huisnr. verschijnt daarna) | "Wat is je project?" | **adres** ("bijv. Stationsstraat 72") | [GEBLOKKEERD] |
| Stappen | 1 lange pagina, 6 genummerde vragen | multi-step (JS) | 4 stappen | multi-step (JS) | multi-step | adres → dakscan → offerte | [GEBLOKKEERD] |
| Contact op | ná alle 6 vragen, onderaan | laatste stap | stap 3 van 4 | laatste stap | laatste | ná dakscan | [GEBLOKKEERD] |
| Progressbar | **nee** (geverifieerd in HTML) | stepper-component, geen "stap X van Y" tekst gevonden | [NIET GEVERIFIEERD] | [NIET GEVERIFIEERD] | [NIET GEVERIFIEERD] | [NIET GEVERIFIEERD] | — |
| Aantal offertes | **niet genoemd** op de zonnepanelen-pagina | "Vergelijk tot 4 offertes" | "max 4 installateurs" | "Tot 4 vrijblijvende offertes" | "minimaal 6 offertes" [WEBFETCH, niet raw geverifieerd] | 1 (eigen offerte) | [SECUNDAIR] |
| Volume-trust | "+35.000 mensen per maand", "26 jaar pionier", "Nr. 1 grootste offerteplatform in België" | "2,013,967 mensen gingen je voor", "919 aanvragen/dag", "6.004 vakbedrijven", "2+ miljoen aanvragen", "100+ medewerkers" | "43.000+ bedrijven", "2.200.000+ reviews", "#1 dienstenplatform van Nederland", "1150+ zonnepanelen-installateurs" | "899.000+ Vergelijkingen", "94% beveelt ons aan" | "364.000 opdrachten/jaar", "5.400 vakspecialisten", "181 vakgebieden" | "16.000 installaties in Antwerpen", "30 per 1000 inwoners" | 360.000 klussen/j, 11.000 vakmensen, 268.000 reviews [SECUNDAIR] |
| Reviews zichtbaar | niet op de sectorpagina | 8 installateurs met 5/5 + gemeente; 4.6/5 uit 1629 reviews [WEBFETCH] | 9,0/10 gemiddeld, 4.375 reviews sector | 8,9/96 reviews (sector) + 8,8/1026 (globaal), met naam+gemeente+datum | — | Trustpilot "Geweldig" | 268.000 [SECUNDAIR] |
| Keurmerken | "erkende vakmannen" (tekst) | "Betrouwbare vakspecialisten" (tekst) | **SGZE, Techniek Nederland, InstallQ, STEK** (echte logo's) | "Bekend van"-logostrip, "Genomineerd Website van het Jaar 2025" | — | 20 jaar garantie | — |
| Urgentie/schaarste | **geen** (premie-tekst is zelfs verlopen: "kon nog aangevraagd worden tot einde 2025") | geen | geen | geen | salderingsregeling t/m 2027 | geen | — |
| Calculator | statische tabellen (€1,26/Wp; 12 panelen = €5.800, TVT 10 jaar) | statische tabel per gezinsgrootte (€2.800–10.800) | **interactieve calculator, resultaat direct zichtbaar zónder contactgegevens** (€4.000–€6.000 op schaal €2.500–€8.000) | eigen "Thuisbatterij calculator" (kWh-behoefte) | tabel, geen interactieve tool | prijzen zichtbaar vóór contact (huren/kopen × met/zonder batterij) | kostenpagina's [GEBLOKKEERD] |
| URL-structuur | plat: /nl-be/zonnepanelen/, /nl-be/thuisbatterij/, /nl-be/warmtepomp/, /nl-be/airco/, /nl-be/dakwerken/ | /nl/zonnepanelen + /nl/zonnepanelen/offertes-aanvragen | /nederland/zonnepanelen/ + /kosten/…-kosten/ + /blog/nieuws/ | /thuisbatterij/ + /thuisbatterij/offerte/ + /nieuws/ | /zonnepanelen/ + artikelen eronder | /nl-be/locator/zonnepanelen-{stad}/ | — |
| Ad-tracking in form | gclid, msclkid, fbclid, ttclid, **tblci (Taboola)**, **ob_click_id (Outbrain)**, _fbp | — | — | — | — | — | — |

---

## TOP 15 elementen die wij MOETEN overnemen

### 1. Postcode als eerste en enige zichtbare veld
**Wie:** Solvari (`name="zip_code"`, placeholder "Bv. 9000", `autocomplete="postal-code"`), Slimster (`pattern="[1-9][0-9]{3}\s?[a-zA-Z]{2}"`).
**Waarom:** laagste denkdrempel van alle mogelijke openingsvragen, en het is meteen de belangrijkste routeringsvariabele voor ons (welke installateur is beschikbaar in die zone).
**Bouwen:**
```html
<form action="/start" method="get" class="flex gap-2 max-w-md">
  <input name="pc" inputmode="numeric" pattern="[1-9][0-9]{3}" maxlength="4"
         autocomplete="postal-code" placeholder="Bv. 9000" required
         class="flex-1 h-14 px-4 text-lg rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-0"/>
  <button class="h-14 px-6 rounded-xl bg-emerald-600 text-white font-semibold">Zoek mijn installateur</button>
</form>
```
BE-postcodes zijn 4 cijfers → `inputmode="numeric"` opent het cijfertoetsenbord op mobiel. Dat doet Solvari niet; gratis winst.

### 2. Progressive disclosure van het tweede veld
**Wie:** Slimster — het huisnummer-veld staat in de HTML met `class="... d-none"` en verschijnt pas ná een geldige postcode.
**Waarom:** de gebruiker ziet één vakje, commit, en zit dan al in de flow (sunk-cost).
**Bouwen:** tweede input met `hidden`, en `oninput` op de postcode: bij 4 cijfers → `el.hidden=false` + `el.focus()`.

### 3. Trust-tags náást het formulier, niet in de footer
**Wie:** Solvari's funnelpagina — een `<aside class="lead-form-page__trust-list">` met vier items met icoon.
**Waarom:** het bewijs staat op het moment van twijfel, niet 3 schermen lager.
**Bouwen:** rechts naast het formulier (`lg:grid-cols-[1fr_280px]`), op mobiel eronder als horizontale scroll-rij:
```html
<ul class="grid gap-3 text-sm text-slate-600">
  <li class="flex gap-2"><svg …/>Laatste match — <strong>14 minuten geleden</strong></li>
  <li class="flex gap-2"><svg …/><strong>1 installateur</strong> per aanvraag, nooit meer</li>
  <li class="flex gap-2"><svg …/><strong>RESCERT-gecontroleerd</strong></li>
</ul>
```
⚠️ Alleen echte getallen. Zolang we geen volume hebben: laat de teller weg en gebruik claims die wél waar zijn (zie punt 15).

### 4. Objection-handling microcopy exact op het contactveld
**Wie:** Solvari, letterlijk uit hun taalbundel:
> "Waarom heeft Solvari jouw telefoonnummer nodig?" → *"Vakbedrijven bespreken graag jouw wensen en mogelijkheden om tot een complete offerte te komen. Het is hiervoor handig dat zij telefonisch contact met je kunnen opnemen. Je telefoonnummer wordt uitsluitend gedeeld met de vakbedrijven die wij matchen met jouw aanvraag."

**Waarom:** het telefoonveld is de grootste dropoff. Zij beantwoorden de angst op de plek waar hij ontstaat.
**Bouwen:** `<details>` naast het label — en bij ons is het antwoord veel sterker: *"Je nummer gaat naar één installateur. Niet naar vier. Wij verkopen je gegevens niet door."*

### 5. Live "zojuist"-ticker met tijd + gemeente
**Wie:** Slimster ("Zojuist vergeleken — 01:16 Hattem, 23:57 Katwijk, 23:22 Amstelveen, 23:10 Amsterdam"), Solvari ("Laatste aanvraag - 2 minuten geleden").
**Waarom:** goedkoopste sociale bewijskracht die er is en werkt vanaf lage volumes.
**Bouwen:** JSON-endpoint met de laatste 5 echte aanvragen, alleen `HH:MM` + gemeente, geanonimiseerd. Roteren met een `setInterval` in een `aria-live="polite"` div.
⚠️ Nooit faken. Bij <5 aanvragen/dag: toon "Laatste match: gisteren, Gent" — eerlijk en nog altijd bewijs.

### 6. Sector-specifieke reviewscore boven de globale
**Wie:** Slimster toont op /thuisbatterij/ direct onder de H1: "8,9 gemiddeld, 96 reviews" — dat is de *thuisbatterij*-score, niet de sitescore (8,8 / 1026).
**Waarom:** relevanter en geloofwaardiger dan één sitebrede sterrenscore.
**Bouwen:** per sectorpagina een eigen `data-sector-score` blokje pal onder de H1.

### 7. Installateur-logos mét gemeente en score direct onder de hero
**Wie:** Solvari — carousel van 8 echte bedrijven, en onderaan met detail: "Rensol 5/5 (3 reviews) Asse · BVBA SunElektro 5/5 (1 reviews) Wortegem-Petegem · SOLAR-TEC 5/5 (1 reviews) Ieper · Solarroof 5/5 (1 reviews) Damme".
**Waarom:** "5/5 (1 review)" is een zwak cijfer, maar de **gemeentenaam** maakt het lokaal en dus geloofwaardig. Dat is de echte truc.
**Bouwen:** grid van kaarten met logo, naam, score, gemeente. Filter op postcode-regio zodra die bekend is.

### 8. Calculator die het resultaat GRATIS toont, vóór contactgegevens
**Wie:** Trustoo /kosten/zonnepanelen-kosten/ — dakvorm + locatie in, meteen "Gemiddelde prijs €4.000 - €6.000" op een schaal €2.500–€8.000. Otovo toont zijn prijstabellen ook vóór contact.
**Waarom:** reciprociteit. Je geeft eerst waarde, dan pas vraag je. En het is wat Google's helpful-content-signaal beloont.
**Bouwen:** client-side JS-calculator (verbruik + daktype → range + terugverdientijd), resultaat in een kaart, en pas dáárna de CTA: "Wil je dit voor jouw dak exact weten? → één installateur rekent het gratis na."

### 9. Zeven-cijfer-precisie in plaats van afgeronde claims
**Wie:** Solvari schrijft "2,013,967 mensen gingen je voor" — niet "2 miljoen+".
**Waarom:** een exact getal leest als een systeemuitlezing, een rond getal als marketing.
**Bouwen:** trek het echte aantal uit de DB en render het onafgerond.

### 10. De numbered-question-block met persoonsvertaling
**Wie:** Bobex vraag 1: *"Wat is uw (geschat) jaarlijks elektriciteitsverbruik?"* met opties **"Minder dan 3.000 kWh (1 persoon)", "3.000-4.000 kWh (2-3 personen)", "4.000-5.000 kWh (3-4 personen)", "5.000-6.000 kWh (4-5 personen)", "Meer dan 6.000 kWh (zwembad, warmtepomp, …)"**.
**Waarom:** niemand kent zijn kWh. Door er gezinsgrootte naast te zetten kan iedereen antwoorden. Briljant en gratis over te nemen.
**Bouwen:** radio-cards, geen dropdown:
```html
<label class="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50 cursor-pointer min-h-[56px]">
  <input type="radio" name="verbruik" value="3000-4000" class="sr-only"/>
  <span class="font-medium">3.000–4.000 kWh <span class="text-slate-500 font-normal">(2–3 personen)</span></span>
</label>
```

### 11. De afspraak-vraag als kwalificatiefilter
**Wie:** Bobex vraag 4: *"Wanneer wenst u afspraak te maken (is nodig voor opmetingen en offerte)?"* met opties Voormiddag / Namiddag / Avond (na 17u) / Op een ander moment / **Ik wil geen afspraak**.
**Waarom:** twee dingen tegelijk: het zet de verwachting dat er iemand langskomt (dus geen verrast-zijn later) én "Ik wil geen afspraak" is een gratis lead-scoring-signaal.
**Bouwen:** letterlijk overnemen. Bij "Ik wil geen afspraak" → lagere score, niet doorsturen naar een installateur die alleen op afspraak werkt.

### 12. Foto-upload in het formulier
**Wie:** Bobex — `<input type="file" name="attachments[]" multiple accept="image/jpeg, image/png, image/gif, application/pdf">` bij vraag 6 "Beschrijving van uw project", met drag-and-drop ("Kies een bestand of versleep het hierheen").
**Waarom:** een dakfoto maakt de lead 5× waardevoller voor de installateur en verhoogt de commitment van de aanvrager.
**Bouwen:** optioneel veld, mobile-first (`capture="environment"` opent direct de camera). Dat laatste doet Bobex níet.

### 13. Opt-in met reden, niet met juridische tekst
**Wie:** Bobex: *"Ik wens op de hoogte te blijven van mijn aanvraag en tips te ontvangen (sterk aanbevolen!)"*.
**Waarom:** koppelt de marketing-opt-in aan een service-belofte ("op de hoogte van jouw aanvraag") en duwt met "(sterk aanbevolen!)".
**Bouwen:** overnemen, maar netjes RGPD: statusupdates zijn gerechtvaardigd belang en hoeven geen opt-in; de "tips" moeten apart en niet voorgevinkt. Dus splitsen in twee checkboxes.

### 14. Kosten-hub met 6 tegels per sector
**Wie:** Slimster /thuisbatterij/ heeft direct onder de hero zes doorklik-tegels: Prijzen / Beste / Hoeveel kWh heb ik nodig (calculator) / Offertes / Rendement / Merken — elk naar een eigen subpagina.
**Waarom:** dit is de SEO-motor. Eén sectorpagina wordt zes rankende pagina's, en de interne links versterken de hoofdpagina. Trustoo doet hetzelfde met /kosten/{dienst}-kosten/.
**Bouwen:** per sector `/zonnepanelen/` + `/zonnepanelen/prijs/`, `/zonnepanelen/premies-2026/`, `/zonnepanelen/terugverdientijd/`, `/zonnepanelen/offerte/`. Tegelgrid `grid-cols-2 md:grid-cols-3 gap-3`, elke tegel: kop + één zin + pijl.

### 15. Data-PR als linkbuilding-motor
**Wie:** Slimster publiceert eigen onderzoek als nieuws ("Bijna één op de drie koopwoningen heeft inmiddels airco", "Ruim een op tien koopwoningen met zonnepanelen heeft thuisbatterij, maar interesse is afgenomen"). Trustoo heeft een aparte sectie "Recente persberichten".
**Waarom:** hun aanvraagdata is het onderzoek. Gratis content die door nieuwssites wordt overgenomen = backlinks.
**Bouwen:** vanaf ~200 aanvragen per sector: kwartaalbericht "X% van de Vlaamse zonnepaneel-aanvragen vraagt nu ook naar een thuisbatterij". Wij hebben via NXTG/Bobex al historische leaddata — dat is een voorsprong.

---

## 5 dingen die wij BEWUST NIET doen

1. **Nooit "tot 4 offertes" beloven.** Solvari, Trustoo en Slimster zetten alle drie "tot 4" in de hero. Homedeal claimt zelfs "minimaal 6 offertes". Dat is exact de pijn die wij oplossen. Onze hero-belofte is het spiegelbeeld: *"Eén installateur. Eén telefoon. Geen offerte-bombardement."*
2. **Geen breed dienstenwarenhuis.** Bobex verkoopt naast zonnepanelen ook maaltijdcheques, tankkaarten, uitvaartverzekeringen en fruit op het werk; Trustoo doet boekhouders en verhuizingen. Die breedte maakt het merk generiek en maakt kwaliteitscontrole per installateur onmogelijk. Wij blijven op 5 energie-/dakcategorieën.
3. **Geen "Bespaar tot 40%" / "tot wel 45%".** Trustoo en Slimster leunen zwaar op besparingspercentages die uit prijsdruk tussen 4 offertes komen. Wij hebben geen 4 offertes, dus die claim is bij ons onwaar én ondermijnt onze positionering (wij verkopen rust, geen prijsoorlog).
4. **Geen lead doorverkopen aan meerdere kopers.** Werkspot rekent volgens secundaire bronnen €15–45 per lead aan meerdere vakmensen tegelijk. Ons model moet exclusiviteit zijn — dat rechtvaardigt een hogere prijs per lead én is de enige manier waarop de belofte hard blijft. Zet het ook contractueel vast met de installateur.
5. **Geen verouderde premie-informatie laten staan.** Bobex' zonnepanelenpagina praat in augustus 2026 nog over een retroactieve investeringspremie die "nog aangevraagd kon worden tot het einde van 2025". Dat is precies waar wij ze kunnen verslaan: één zichtbare `Laatst gecontroleerd: {datum}`-stempel per premieblok (Solvari doet dit al met "Laatste update: augustus 2026") plus een kwartaalcheck tegen vlaanderen.be/mijn-verbouwpremie en Fluvius.

---

## Aparte sectie: offertescout.nl

**Conclusie: geen bedrijf, geen risico, geen zichtbaar merkrecht.**

| Wat | Bevinding | Bron |
|---|---|---|
| Status | Geparkeerd. HTTP-header `zxcs: parked`, meta description "Deze domeinnaam is geregistreerd en geparkeerd bij Vimexx". Volledige inhoud = Vimexx-verkooppagina met links naar Google-zoekopdrachten ("Domeinnaam registreren", "VPS server", "Dedicated server"). | curl 2026-08-08 |
| TLS | **Zelfondertekend certificaat**, `CN=localhost`, uitgegeven 2019-11-01. HTTPS geeft dus een browserwaarschuwing. | openssl s_client |
| Server | Apache/2.4.6 (CentOS), **PHP/7.0.30** — end-of-life sinds 2019. | HTTP-headers |
| Registratie | Registrar **ZXCS** (Vondellaan 47, 2332AA Leiden), **creation date 2024-05-16**, nameservers ns.zxcs.nl/.eu/.be, DNSSEC actief, status active. | SIDN whois 2026-08-08 |
| Sectoren / model | **Geen.** Er is niets gebouwd. Geen KvK, geen bedrijfsnaam, geen funnel. | — |
| Grootte/serieusheid | Domeinnaam-belegging. Twee jaar geregistreerd, nooit ontwikkeld. | — |

**Verwarringsrisico voor een Belgische .be:** verwaarloosbaar. Er is geen NL-merk om mee verward te worden, geen verkeer, geen inhoud. Het enige praktische risico is dat de houder ooit alsnog bouwt of het domein duur wil verkopen — koop `offertescout.nl` daarom mee als defensieve registratie zodra je de merknaam vastlegt, of laat het bewust liggen.

**offertescout.be is op 2026-08-08 nog VRIJ** (DNS Belgium whois: `Status: AVAILABLE`). Registreer die vandaag, samen met `.nl` en `.com` als redirect.

**Merkregistratie:** ik vond **geen enkele aanwijzing** van een Benelux- of EU-merk op "Offertescout". Maar dit is **NIET GEVERIFIEERD** — de TMview-API gaf een leeg antwoord en het BOIP-register is JS-only en niet automatisch doorzoekbaar met mijn tools. Doe zelf een gratis check op boip.int/nl/merkenregister (klassen 35 = reclame/bemiddeling en 42 = software) vóór je in branding investeert. Kostprijs Benelux-woordmerk ligt rond €244 voor één klasse — verwaarloosbaar tegenover het risico.

⚠️ **Naamgeving is intern inconsistent:** de opdracht spreekt over "OffertesScout" (met s), maar `/Users/bartvanpoucke/selectly-v2/vraag/index.html` heeft in de `<title>` al "OfferteScout". Kies er één vóór de domeinregistratie — ik raad **OfferteScout** aan (leest vlotter, geen dubbele s-klank).

---

## Wat dit voor Bart betekent

- **Het BE-veld is dunner dan verwacht.** Alleen Bobex en Solvari zijn nog echte concurrenten. Livios, offerte.be, Tips en (grotendeels) Otovo zijn weg. Dat is een opening, geen bedreiging.
- **Bobex is technisch achterop**: één lange formulierpagina zonder stappen, geen progressbar, geen reviews op de sectorpagina, geen aantal-offertes-belofte, en verouderde premie-info. Zij zijn te verslaan op UX en op actualiteit — niet op autoriteit ("26 jaar", "+35.000/maand").
- **Solvari is de UX-benchmark.** Kopieer hun funnel-architectuur (postcode-first, trust-aside, microcopy op de contactvelden) en zet er onze exclusiviteitsbelofte tegenover.
- **Bobex koopt Taboola- en Outbrain-verkeer** (`tblci` en `ob_click_id` in hun verborgen formuliervelden). Dat is een kanaal dat jij nog niet gebruikt en dat blijkbaar rendabel is voor BE-leadgen.

## Wat te doen
1. Vandaag: `offertescout.be` registreren (+ .nl/.com defensief) en de BOIP-check doen. Naam vastklikken op één spelling.
2. Deze week: de bestaande pagina's in `/Users/bartvanpoucke/selectly-v2/vraag/` herbouwen rond punten 1, 2, 3, 4, 10 en 11 — dat is de conversiekern en is in een dag te doen.
3. Daarna pas de SEO-uitbouw (punt 14): per sector 4 subpagina's, te beginnen bij zonnepanelen en thuisbatterij.

## Beperkingen van dit rapport
- **Werkspot.nl en zonnepanelen.nl konden niet worden opgehaald** — Cloudflare geeft 403 op zowel WebFetch als curl met volledige browser-headers. Werkspot-cijfers komen uit een secundaire bron (offerteadviseur.nl) en zijn niet door mij bij de bron geverifieerd. Zonnepanelen.nl is volledig ongeanalyseerd.
- **offertes.nl bestaat niet meer** als bereikbare site: DNS geeft SERVFAIL op zowel `offertes.nl` als `www.offertes.nl`.
- **Mijnenergie.be** (de opvolger van Livios) kon niet worden opgehaald.
- **Mobile-first details (sticky CTA's, thumb-zone, tap targets) zijn grotendeels NIET GEVERIFIEERD.** Ik heb geen browser-rendering, alleen HTML. Een grep op `sticky|fixed bottom|position:fixed` in Solvari's CSS-klassen gaf 0 treffers, maar dat sluit een sticky CTA via een JS-framework niet uit. Doe deze check zelf op een telefoon.
- **Progressbars**: alleen voor Bobex met zekerheid vastgesteld (afwezig, geverifieerd in de ruwe HTML). Voor de JS-gedreven funnels van Solvari/Trustoo/Slimster/Homedeal kon ik de stap-UI niet renderen; een eerdere WebFetch-samenvatting claimde een progressbar bij Bobex — dat was fout en is hier gecorrigeerd.
- Solvari's "4.6/5 uit 1629 geverifieerde reviews" en Homedeal's "minimaal 6 offertes" komen uit de WebFetch-samenvatting en zijn niet door mij in de ruwe HTML teruggevonden.
- Merkregistratie-status van "Offertescout": niet verifieerbaar met mijn tools.

## Bronnen (allemaal geraadpleegd 2026-08-08)
- https://www.bobex.be/nl-be/voor-thuis/ en https://www.bobex.be/nl-be/zonnepanelen/ (ruwe HTML)
- https://www.solvari.be/nl , https://www.solvari.be/nl/zonnepanelen , https://www.solvari.be/nl/zonnepanelen/offertes-aanvragen (ruwe HTML)
- https://www.offerte.be/ → "Offerte.be is nu Solvari!"
- https://www.livios.be/nl/ → "Livios stopt … leeft verder bij Mijnenergie.be"
- https://www.tips.be/ → Tips Weekblad Oostende, gestopt 2025
- https://www.trustoo.nl/ , https://www.trustoo.nl/nederland/zonnepanelen/ , https://www.trustoo.nl/kosten/zonnepanelen-kosten/
- https://www.homedeal.nl/ , https://www.homedeal.nl/zonnepanelen/
- https://slimster.nl/ , https://slimster.nl/thuisbatterij/
- https://www.otovo.be/nl-be/ , https://www.otovo.be/nl-be/locator/zonnepanelen-antwerpen/
- whois offertescout.nl (SIDN), whois offertescout.be (DNS Belgium), openssl s_client offertescout.nl:443
- https://solarmagazine.nl/nieuws-zonne-energie/i42576/otovo-neemt-klanten-en-activa-failliet-soly-over (Otovo neemt Soly over, jan 2026)
- https://www.offerteadviseur.nl/over/leads-kopen/werkspot/ [SECUNDAIR, Werkspot-cijfers]
