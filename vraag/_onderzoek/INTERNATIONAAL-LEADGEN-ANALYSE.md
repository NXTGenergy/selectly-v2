# Internationale lead-gen marktplaatsen — analyse voor OffertesScout

Datum: 2026-08-08 · Onderzoeker: analyst (Selectly) · Bron-scope: live web-fetches (r.jina.ai reader + directe curl + WebFetch), geen geheugenwerk
Doel: OffertesScout = BE B2C lead-gen brand dat consument matcht aan **één** installateur (zonnepanelen, thuisbatterij, warmtepomp, airco, dakwerken).

> Alles hieronder tussen aanhalingstekens is **letterlijk gekopieerde tekst** van de live site op 2026-08-08, tenzij anders vermeld. Niet-geladen items staan onderaan bij "Gaten".

---

## Executive summary (7 punten)

1. **Niemand in de wereldtop verkoopt "1 installateur" als hoofdbelofte.** Aroundhome zegt "bis zu drei", Solvari (BE) "tot 4 offertes", Thumbtack "Get 3 quotes". De enige die het enkelvoud gebruikt is **zolar.de**: *"Dein passender regionaler Fachbetrieb aus dem zolar Netzwerk meldet sich zeitnah bei dir"*. Er ligt dus een **onbezette positionering** open. Dat is het belangrijkste strategische resultaat van dit onderzoek.
2. **De sterkste conversie-truc die iedereen doet en BE niet doet: de gematchte vakman TONEN vóór de contactgegevens.** Thumbtack's `/instant-results/` toont foto, naam, "Top Pro"-badge, "Exceptional 5.0 (15)", "20 hires on Thumbtack", "Responds in about 18 min", klant-quote én "$100/hour Estimated price" — allemaal **vóór** je iets afgeeft.
3. **Hero = 1 of 2 velden, nooit meer.** Aroundhome: "Was steht an?" + "Wo?" → "Suchen". MyBuilder: "What is your job?". Thumbtack: één vrij tekstveld. Otovo FR: "Entrez votre adresse".
4. **Live schaarste-teller werkt en is triviaal na te bouwen.** Aroundhome toont letterlijk *"Hohe Nachfrage: 865 erfolgreiche Anfragen in den letzten 24 Stunden"* (ik zag 808 en 865 op de homepage en 211 en 214 op /solaranlage/ binnen dezelfde sessie → per categorie én dynamisch).
5. **Prijs-transparantie is de SEO-motor, niet een extraatje.** Thumbtack heeft honderden `/p/<dienst>-cost` pagina's, Checkatrade een volledige `/blog/cost-guides/`-sectie met "2026 UK price guide" in de titel, Aroundhome een `/kosten-hausprojekte/` hub met 40+ "X Kosten"-pagina's.
6. **Garantie-cijfer > vage beloftes.** Thumbtack: "up to $2,500 back". Checkatrade: "£1,000 guarantee*". Beide staan in de hero-strip, niet in de footer.
7. **Marktsignaal BE:** Otovo verkoopt in België **geen installaties meer** — otovo.be is nu uitsluitend het Otovo Care™ onderhoudsabonnement (€9 / €29 / €49 per maand). Quotatis.fr en daa.net (nu "TapTapHome") hebben hun hoofddomein omgebouwd tot **installateur-werving**. De pure consumenten-lead-marktplaats consolideert; dat is ruimte, maar ook een waarschuwing over marges.

---

## 1. Site-per-site, letterlijk

### 1.1 Thumbtack (US) — de beste "match tonen vóór submit"

| Element | Letterlijk |
|---|---|
| H1 | "For everything home could be." |
| Sub | "Find local pros for repairs, upgrades, and projects big or small — all in one place." |
| Hero-veld (placeholder) | "Describe your project or problem —be as detailed as you'd like!" |
| CTA | "Find a pro" |
| Micro-copy onder CTA | "No calls or text until you message a pro." |
| Trust-strip | "4.9 from 15M+ reviews" · "300K+ local pros" · "100M+ home projects" |
| Garantie | "A job done right—guaranteed. If the job isn't done as agreed you could get up to $2,500 back." |
| Filter-belofte | "Only see local, trusted pros. We'll only show you pros we're confident can do the job." |

- **Hero = één vrij tekstveld, geen dropdowns.** Geen categorie kiezen; NLP doet de rest.
- **Geo-personalisatie zonder input:** H2 luidde bij mijn fetch "Pros for every project in **North Charleston, South Carolina.**" — dat is IP-gebaseerd ingevuld, ik heb niets ingegeven.
- **Post-search ervaring (`/instant-results/`)** — dit is de goudmijn. De pagina toont eerst filter-vragen die als quiz werken:
  - "When do you want to start?" → *Within 48 hours* / *Within a week* / *Flexible on timeline* / *Specific date(s)*
  - "Estimated hours" → *Less than 2 hours (Simple tasks)* / *2 - 5 hours* / *A full day (Complex or long-term projects)*
  - "Project type" (Repairs/Installation/Maintenance/Assembly/Painting/More), "Work focus", "Project location", "Property type" (Home/Business), plus "Reset filters"
  - Daarna: **"Matching handymen"** → "Get quotes from your top 3 matches — These pros match your project, are highly-rated, and respond quickly." → CTA **"Get 3 quotes"**
  - Elke pro-kaart bevat: **foto · bedrijfsnaam · "Top Pro"-badge · "Exceptional 5.0 (15)" · "20 hires on Thumbtack" · "Serves North Charleston, SC" · "Responds in about 18 min" · letterlijke klant-quote met naam ("Mary J. says, …") · "$100/hour Estimated price"**
- **Kostengids-hub** `/prices`: "Want the price of pretty much any service? We probably know it. We track millions of cost estimates for thousands of projects." + "Nearly 90 million projects have been started on Thumbtack". Honderden losse `/p/…-cost` URLs.

### 1.2 Checkatrade (UK) — trust-stack + instant fixed price

| Element | Letterlijk |
|---|---|
| H1 | "Find a tradesperson ready to help you" |
| Hero-trust (3 blokjes) | "**Checked** trades" · "**6M+** real reviews" · "**£1,000** guarantee*" |
| Vetting | "12 checks — Every trade passes up to 12 checks and is continually rechecked" |
| Social proof | "1,350 10* ratings last month" · "Good work speaks for itself — We've got 6M+ examples" |

- **Review-format:** score **/10** (niet /5), plus **"Verified"**-badge, plus **"Posted 1 day ago"**, plus voornaam + **postcode-district**: *"Melisa in NE63"*, *"Lewis in Cv35"*, *"Robert in SL6"*. De postcode maakt het lokaal geloofwaardig zonder GDPR-risico.
- **Checkatrade Express (aparte subdomein `express.checkatrade.com`)** — het meest interessante mechanisme voor BE:
  - Homepage-banner: "**Get it done, for a fixed price.** For simpler jobs, you can skip getting quotes. Just see the price, choose availability and book it in." → CTA "**Book instantly now**"
  - Express-hero: "**Instant prices** on everyday jobs" met de 3 stappen letterlijk als tagline: "**Get a price · Pick a time · Get matched**"
  - Trust: "500+ Express services" · "Vetted trades" · "£1,000 guarantee*" · Trustpilot "**4.6 Excellent — 84,313 Reviews**"
  - Lopende prijs-ticker met echte vanaf-prijzen: "Reseal Bathroom — From £89", "TV Mounting — From £69", "Oven Cleaning — From £69", "Garden Maintenance — From £54", "Boiler Servicing — From £99", "Window Cleaning — From £39", "Door Hanging — From £134"
  - Merk op: **prijs → agenda → match.** De match komt *laatst*, niet eerst. Dat is de omkering die "1 installateur" verkoopbaar maakt.
- Kostengidsen op `/blog/cost-guides/`, titels standaard "How much does X cost?" + "2026 UK price guide".

### 1.3 MyBuilder (UK) — schaal-tellers + autosave-bewijs

| Element | Letterlijk |
|---|---|
| H1 | "The reliable way to hire a tradesperson" |
| Eerste veld | "What is your job?" (+ chips onder "Popular services": Handyman, Gardening & Landscaping, Painting & Decorating, Electrical, …) |
| Tellers | "287,514 tradespeople" · "40+ trade categories" · "2,832,833 reviews" |
| 3 stappen | "STEP 1 Post your job for free" / "STEP 2 Tradespeople respond" / "STEP 3 Review profiles and choose" |
| Vetting-copy | "All tradespeople on MyBuilder undergo checks at registration - such as ID documents, company details, certifications for regulated jobs and skill assessments" |

- **Autosave bevestigd via hun eigen cookie-declaratie:** localStorage-key `postal-code` met omschrijving *"Used to add the postcode the user added into their application or job form."* Ze bewaren dus de postcode over pagina's heen. Ook `POST_A_JOB_SOURCE` (bron-attributie in localStorage).
- **Content-motor:** "Ask a tradesperson" — echte consumentenvragen met datum en aantal antwoorden ("Roofing — Top floor flat roof leak — John 07/08/2026 - 8.00 AM … 2 answers"). Gratis longtail-SEO die tegelijk vertrouwen wekt.
- Exacte tellers (287.514, 2.832.833) i.p.v. afgeronde getallen = geloofwaardiger.

### 1.4 Bark (UK/global)

| Element | Letterlijk |
|---|---|
| H1 | "Find the perfect professional for you" |
| Sub | "Get free quotes within minutes" |
| CTA | "Search" |

- Funnel-UI woorden zichtbaar in de DOM: "**Continue**", "**Get Quotes**", "**Back**" → **back-knop bestaat**.
- **Exit-intent modal** letterlijk aanwezig: "**Are you sure that you want to leave?**" met knoppen "**Quit**" / "**Continue**".
- Juridische micro-copy op de knop i.p.v. een checkbox: "By continuing, you confirm your agreement to our Terms & Conditions."
- Trust = **Trustpilot-quotes met alleen voornaam**, geen cijfers op de homepage: "One of the most honest experiences I've had on the web, ever!" (Barend), "I have used Bark twice now…" (Jayne).
- **Geo×dienst SEO-matrix**: honderden URL's van het type `/web-design/west-midlands/birmingham/`.

### 1.5 Angi (US) — chat-intake

- Homepage **niet geladen** (Cloudflare CAPTCHA, "Performing security verification"). Wel geladen: `request.angi.com/chat` en `/companylist/`.
- De "Find Pros"-knop leidt naar **`request.angi.com/chat`** — dus geen klassiek formulier maar een **chat-funnel**. H1: "**Compare quotes from top‑rated pros**", met voorbeeldprompts als klikbare chips: "Epoxy coat a garage floor", "Clean gutters and downspouts", "Repair a light fixture", "Remove junk and haul it away".
- Kosten-SEO: "How Much Does a Closet Remodel Cost?", "How Much Does It Cost to Build or Replace a Staircase?", "How Much Does Widening a Doorway Cost?"

### 1.6 Houzz

- Homepage-title is nu "**Houzz for Pros and Homeowners | Build and Design Software | Try Free for 30 Days**" — de hero is **B2B-software**, geen consumenten-offerte-funnel. Consumentenzijde zit in `/professionals/…` directory-pagina's. Voor OffertesScout beperkt bruikbaar; niet verder uitgediept.

### 1.7 Aroundhome (DE) — de beste funnel-blueprint die ik vond

| Element | Letterlijk |
|---|---|
| H1 | "Finden Sie die passende Fachfirma für Ihr Hausprojekt" |
| Hero-velden | "Was steht an?" en "Wo?" |
| CTA | "Suchen" |
| Live-teller onder hero | "Hohe Nachfrage: **865** erfolgreiche Anfragen in den letzten 24 Stunden" |
| Badges naast de teller | TÜV Kundenzufriedenheit "**Note 1,8**" · Trustpilot-logo (klikbaar naar hun echte profiel) · "**Nr. 1 Service Champion**" (SILBER 2025) |
| 3 stappen | "Schritt 1 — **Projekt beschreiben**: Starten Sie eine Anfrage zu Ihrem Hausprojekt." / "Schritt 2 — **Fachfirmen finden**: Erhalten Sie passende Firmenempfehlungen." / "Schritt 3 — **Auftrag vergeben**: Angebote vergleichen, auswählen und los geht's." |
| 3 redenen | "**Kostenlos** — Sie bezahlen für unsere Suche nichts. Wir finanzieren uns über die Fachfirmen." · "**Unverbindlich**" · "**Passende Fachfirmen** — Sie erhalten nur Fachfirmen als Vorschlag, die wirklich zu Ihrem Hausprojekt passen." |

- **Transparante verdienmodel-disclosure bovenaan het formulier** (!): *"Wir finanzieren diesen Service über die Fachfirmen und erhalten eine Vergütung für jede vermittelte Kontaktanfrage."* Dit is precies wat in BE het vertrouwensprobleem oplost.
- **De volledige zonnepanelen-vragenlijst** (van `/solaranlage/formular/`, 9 vragen, letterlijk):
  1. "Wo möchten Sie die Photovoltaik-Anlage installieren: auf einem Gebäude oder einer Freilandfläche?"
  2. "Handelt es sich um ein freistehendes Haus, eine Doppelhaushälfte, ein Reihenmittelhaus oder ein Reihenendhaus?"
  3. "Bewohnen Sie die Immobilie selbst?"
  4. "Sind Sie Eigentümer:in der Immobilie?"
  5. "Ist das Dach ein Satteldach, Pultdach, Flachdach oder Walmdach?"
  6. "Wünschen Sie eine Solaranlage mit Speicher oder ohne?"
  7. "Wollen Sie die Photovoltaik-Anlage kaufen oder mieten?"
  8. "Wie alt sind Sie? (relevant für Finanzierungsoptionen)"
  9. "Wann soll die PV-Anlage installiert werden?"
  - Op `/solaranlage/` is stap 1 verkort tot "Wo möchten Sie die Photovoltaikanlage installieren?" met 5 knoppen (Ein-/Zweifamilienhaus · Mehrfamilienhaus · Firmengebäude · Freilandfläche · Sonstiges), gevolgd door "**Ihre PLZ**".
- **Progressbar bevestigd**: `role="progressbar"` staat in de DOM van de funnel-pagina.
- **Volgorde-les**: eerst 8 laagdrempelige keuzes (klikken, geen typen), postcode als 2e stap, **contactgegevens pas op het einde**. Alle vragen zijn keuze-knoppen, alleen postcode en contact zijn typvelden.
- Belofte: "Erhalten Sie **bis zu drei** Angebote von Solaranlagen Fachfirmen aus Ihrer Region" / "**Bis zu drei** von uns empfohlene Solarteure erstellen für Sie maßgeschneiderte Angebote."
- Kosten-hub `/kosten-hausprojekte/`: 40+ pagina's ("Treppenlift Kosten", "Fassade streichen Kosten", "Einbauküche Kosten", …) gegroepeerd per thema.
- **Success-stories met naam + object**: "Marinas Markise", "Nicos Dachfenster", "Familie Albrechts Badezimmer", "Familie Hillers Solaranlage" — met foto van het échte resultaat.

### 1.8 Enpal (DE)

| Element | Letterlijk |
|---|---|
| H1 | "Solaranlage & Wärmepumpe für **0 € Anzahlung**" |
| Subs | "in über **130.000** deutschen Haushalten" · "mit persönlicher Beratung" · "vom Testsieger" |
| CTA | "Jetzt Ersparnis berechnen" |
| Label bij de CTA | "Kostenloser Solarrechner — **Kostenlos in weniger als 2 Minuten!**" |
| TÜV | "TÜV-geprüfte Kundenzufriedenheit: **Gut**", "durch den TÜV Saarland zertifiziert (**SC45293**)" |
| Prijs-anker | "Schon ab **98 € pro Monat**" |

- Het certificaat-**nummer** tonen (SC45293) is een detail dat de claim verifieerbaar maakt. Zeldzaam en sterk.
- De funnel zelf (`/informieren-c1`) is een JS-app — **stappen niet geladen**.

### 1.9 1KOMMA5° (DE)

| Element | Letterlijk |
|---|---|
| H1 / titel | "Immer der günstigste und sauberste Strom" |
| Sub | "**Heartbeat AI** senkt deine Stromkosten um bis zu 80%" |
| Promo-CTA | "Jetzt **2.500€ Rabatt** sichern" (banner, geldig tot 31 augustus) |
| Trust | "**100.000** zufriedene Kundinnen und Kunden" · "über **300.000** 1KOMMA5° Energiesysteme" · "Über **80** regionale Meisterbetriebe" |
| Testimonial | "Mein durchschnittlicher Strompreis im 1. Monat liegt bei **14,6 Cent**." — Torsten aus Greifswald |

- Les: **testimonial met een hard getal** slaat harder dan "zeer tevreden".
- "Über 80 regionale Meisterbetriebe" = het één-installateur-verhaal verkocht als **netwerk-kwaliteit**, niet als beperking.

### 1.10 zolar (DE) — het dichtst bij het één-match model

- Positionering: "**Solaranlage kaufen: von geprüften Fachbetrieben in deiner Region**" / "Wir vernetzen dich mit den passenden Expert:innen für Photovoltaikanlagen, Balkonkraftwerke, Wallboxen und Solarspeicher aus ganz Deutschland."
- CTA's: "Jetzt unverbindliche Angebote erhalten" / "Jetzt Anfrage stellen"
- **3 stappen, met het enkelvoud:**
  1. "Anfrage stellen — Teile uns ein paar Details zu deinem Projekt mit. Wir finden für dich qualifizierte Fachbetriebe in deiner Nähe."
  2. "**Kontaktaufnahme durch lokalen Installationsbetrieb** — **Dein passender regionaler Fachbetrieb** aus dem zolar Netzwerk meldet sich zeitnah bei dir – ob telefonisch, digital oder vor Ort – und berät dich persönlich, ganz nach deinem Wunsch."
  3. "Individuelle Beratung & Planung — Nach erster Kontaktaufnahme von einem unserer Handwerkspartner erhältst du ein individuell auf dich zugeschnittenes Angebot"
- **Ze tonen de installateurs met foto, naam, functie, bedrijf en quote** onder "zolar Installateur-Netzwerk":
  - "Viktor Kushnir, Geschäftsführer von Volt Energie GmbH — „Als lokaler Fachbetrieb kennen wir die regionalen Anforderungen genau und bieten maßgeschneiderte Solarlösungen.""
  - "Holger Kreten, Vertriebsleiter von Schönenergie — „Durch unsere Kundennähe können wir schnell reagieren und persönlichen Service bieten – von der Beratung bis zum Service danach.""
  - "Jonathan Boger, Inhaber & Geschäftsführer Zenrise GmbH — „Unsere regionale Verankerung ermöglicht faire Preise, transparente Kommunikation und nachhaltige Projekte.""
- Drie voordelen-blokken: "Erfahrene Fachkräfte" · "Lokale Expertise" · "Maßgeschneiderte Lösung".
- Noot: hun B2B-tak is opgegaan in Sollit ("Zolar Installer Services sind jetzt Teil von Sollit").

### 1.11 thermondo (DE)

- H1/title: "**Wir sind Ihr Heizungsbauer vor Ort**" — verticaal geïntegreerd, geen marktplaats.
- Wat er wél te stelen valt: een **gigantische Ratgeber-boom** met kosten- en premiepagina's, jaartal in de titel: "Wärmepumpe Kosten: Was kostet eine Wärmepumpe mit Einbau?", "Förderung Wärmepumpe 2026", "Heizungsgesetz 2026: Das bedeutet das GModG für Hausbesitzer", "Wärmepumpe Test: Welche ist die beste Wärmepumpe in 2026?". Alle service-pagina's onder één "Ratgeber"-nav met sub-categorieën.

### 1.12 Otovo (NO/EU)

- **otovo.fr** (het echte funnel-model):
  - H1: "Votre installation photovoltaïque avec Otovo"
  - Sub: "**Recevez un devis personnalisé en moins d'une minute**"
  - CTA: "Obtenez un devis gratuit en 1 minute"
  - **Eerste en enige hero-veld: "Entrez votre adresse"**
  - Trust: "Le choix de **4 000 familles** en France. Et de **30 000 autres** dans toute l'Europe." · "0€ d'acompte" · "2 ans de garantie" · "**10 ans de garantie sur la main-d'œuvre** de l'installation"
- **otovo.be = geen installatie-funnel meer.** De Belgische site is volledig Otovo Care™: onderhoudsabonnement Core €9/maand (€108/jaar), Prime €29/maand (€348/jaar), Ultra €49/maand (€588/jaar). Reactietijden 48u / 24u / 12u. "Ongeveer 80% van onze leden kiest voor Prime."
- **otovo.com (US)** is eveneens omgebouwd tot membership: "POWER. PROTECTED." / "AI monitoring + expert repairs + Texas retail electricity. The only membership you need." / "12hr Response Guarantee Time with the Otovo Care Ultra Plan".
- Satelliet-dakscan: **niet bevestigd op de site zelf**. Externe bronnen beschrijven dat Otovo satellietbeelden gebruikt om vanaf een adres een offerte te genereren; ik kon dat niet op een Otovo-eigen pagina staven. → **zwakke claim, niet als feit gebruiken.**

### 1.13 Effy (FR) — premie als tweede ingang

| Element | Letterlijk |
|---|---|
| H1 | "Votre maison, en mieux." |
| Sub | "Conseils, primes, artisans… Découvrez nos solutions pour rendre votre logement plus économe et plus confortable." |
| **Twee** CTA's | "**J'estime mon projet**" én "**Je demande ma prime Effy**" |
| Trust | Trustpilot **4,4/5 (7.747 beoordelingen, uit schema-data)** · "**100 000 familles** nous font déjà confiance" · "plus de **17 ans**" · "**5 000 artisans partenaire RGE** répartis dans toute la France" |
| Award | "élue Marque de l'Année" |

- Twee gelijkwaardige ingangen: **project** vs. **premie**. In BE is de premie-ingang (Mijn VerbouwPremie / Fluvius) minstens even zoekvolume-rijk als de product-ingang.

### 1.14 Hello Watt (FR)

- H1 "Réduisez vos factures d'énergie", sub "L'énergie plus simple, plus accessible et plus intelligente"
- Trust: "**4,9/5 — 16474 avis Google**" en "**+ de 3 millions de téléchargements ! 4,7 | + de 58 000 avis**"
- Media-logorij als autoriteit: France 3, France 2, TF1, M6, France Inter, Le Figaro, Les Echos, Le Monde, Le Parisien
- Founders bij naam genoemd: "Fondé par Sylvain Le Falher et Xavier Coudert en 2016"
- **Geen** hero-formulier: drie ingangen "Comparer les fournisseurs" / "Passer au solaire" / "Installer une pompe à chaleur". Postcode pas in de deel-comparator.

### 1.15 Quotatis (FR) & DAA (DE) — het waarschuwingssignaal

- **quotatis.fr** hoofddomein is nu **installateur-werving**: "Gagnez plus en devenant Artisan Poseur", "Recevez gratuitement et sans engagement des propositions de poses", "Service gratuit — Aucun abonnement, aucun frais d'inscription", "Paiement sous 15 jours".
- **daa.net** is herbrand naar **TapTapHome** en toont ook alleen B2B: "TapTapHome Fachpartner werden – TapTapHome Leads" / "Finde Projekte, die wirklich zu dir passen" / "Erhalte passgenaue Projektanfragen, die zu deinen Schwerpunkten und deinen Kapazitäten passen – hochwertig, regional und ohne Umwege."
- **Interpretatie:** de klassieke "5 offertes"-marktplaatsen migreren naar een aanbod dat **passendheid** verkoopt aan de installateur, niet volume. Dat is exact het argument achter OffertesScout, maar het betekent ook dat de installateur-kant snel competitief wordt.

### 1.16 Solvari (BE) — de directe tegenstander

- "**Vergelijk tot 4 offertes voor zonnepanelen**" · eerste veld "**Vul je postcode in**" · CTA "**Vergelijk offertes**"
- Onder het formulier: **carrousel van échte partner-logo's met naam en score 5**: Rensol, BVBA SunElektro, SOLAR-TEC, Solarroof, Oasis Energy, Batisol, EECOOTEC, Wopa Saving Energy.
- Telefoon + e-mail + "Chat met Joost!" prominent bovenaan.
- **Dit is letterlijk het contrast waarop OffertesScout moet positioneren: "tot 4 offertes" versus "één installateur".**

---

## 2. TOP 15 overneembare elementen

Volgorde = impact/inspanning. "Bouw" is telkens statisch haalbaar (HTML + Tailwind + vanilla JS).

### 1. Één-veld hero met postcode + directe geo-feedback
- **Wat:** hero met exact één invoerveld en één knop.
- **Wie:** Otovo FR ("Entrez votre adresse"), Aroundhome ("Wo?"), Solvari ("Vul je postcode in"), MyBuilder ("What is your job?").
- **Waarom:** elk extra veld in de hero is een afhaakmoment. Adres/postcode is de laagste drempel én meteen de bruikbaarste data.
- **Bouw:**
```html
<form id="startForm" class="flex flex-col sm:flex-row gap-3 max-w-xl">
  <input id="pc" name="postcode" inputmode="numeric" pattern="[1-9][0-9]{3}" maxlength="4" required
         placeholder="Jouw postcode" autocomplete="postal-code"
         class="flex-1 rounded-xl border border-slate-300 px-5 py-4 text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
  <button class="rounded-xl bg-emerald-600 px-7 py-4 text-lg font-semibold text-white hover:bg-emerald-700">
    Zoek mijn installateur
  </button>
</form>
<p id="geoHint" class="mt-2 text-sm text-slate-500"></p>
```
JS: op `input` bij 4 cijfers → lookup in een lokale `postcodes.json` → `geoHint.textContent = "3 erkende installateurs actief in " + gemeente`.

### 2. De gematchte installateur TONEN vóór de contactgegevens
- **Wat:** na de laatste inhoudelijke vraag, vóór naam/e-mail/telefoon, een kaart met de vakman.
- **Wie:** Thumbtack `/instant-results/` (foto, "Top Pro", "Exceptional 5.0 (15)", "20 hires on Thumbtack", "Responds in about 18 min", "$100/hour Estimated price", klant-quote); zolar (installateurs met naam, functie, foto, quote).
- **Waarom:** je wisselt een abstracte belofte ("wij bellen je") in voor een concreet persoon. Dit is de grootste ongebruikte kans in de Belgische markt — Solvari toont alleen logo's.
- **Bouw:** statische `installateurs.json` per provincie/postcodereeks; JS kiest de match, rendert de kaart, en pas dán verschijnt stap "contact".
```html
<article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <div class="flex gap-4">
    <img src="/img/pros/jan.jpg" alt="" class="h-20 w-20 rounded-full object-cover ring-2 ring-emerald-500" />
    <div>
      <div class="flex items-center gap-2">
        <h3 class="font-semibold text-slate-900">Jan D. — Solar Techniek BV</h3>
        <span class="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">RESCERT-erkend</span>
      </div>
      <p class="text-sm text-slate-600">★ 4,8 (127 beoordelingen) · 14 km van jou · reageert doorgaans binnen 2 uur</p>
      <p class="mt-2 text-sm italic text-slate-500">"Correcte planning, alles opgeruimd achtergelaten." — Els uit 9000</p>
    </div>
  </div>
</article>
```

### 3. Contactgegevens als allerlaatste stap (sunk cost)
- **Wat:** 6-9 klik-vragen, dan pas naam/e-mail/telefoon.
- **Wie:** Aroundhome (8 keuze-vragen + PLZ vóór contact), Thumbtack (filters vóór "Get 3 quotes").
- **Waarom:** commitment & consistency. Wie 8 keer geklikt heeft, vult het laatste veld in.
- **Bouw:** één `<form>` met `data-step`-secties, `hidden` togglen; alleen de laatste sectie heeft de PII-velden. Netlify Forms krijgt bij submit alles in één keer.

### 4. Alles klikbaar, niets typen (behalve postcode + contact)
- **Wat:** grote keuze-knoppen i.p.v. dropdowns of tekstvelden.
- **Wie:** Aroundhome (alle 8 vragen zijn keuzes: "Satteldach, Pultdach, Flachdach oder Walmdach?"), Thumbtack-filters.
- **Waarom:** mobiel is een dropdown een dubbele tap + scroll. Een knop is één tap en advanceert automatisch.
- **Bouw:** `<button type="button" data-value="hellend">` met `peer`/`aria-pressed`-styling; klik = waarde in hidden input + auto-advance naar volgende stap.
```html
<button type="button" data-q="daktype" data-value="zadeldak"
  class="group flex w-full items-center gap-3 rounded-xl border-2 border-slate-200 p-4 text-left hover:border-emerald-500 hover:bg-emerald-50 aria-pressed:border-emerald-600 aria-pressed:bg-emerald-50">
  <img src="/img/dak-zadel.svg" alt="" class="h-10 w-10" />
  <span class="font-medium">Zadeldak</span>
</button>
```

### 5. Progressbar met percentage + expliciete tijdsbelofte
- **Wat:** balk boven de vraag + "Klaar in minder dan 2 minuten".
- **Wie:** Aroundhome (`role="progressbar"` in de DOM), Enpal ("Kostenlos in weniger als 2 Minuten!").
- **Waarom:** onzekerheid over lengte is de #1 reden om niet te starten.
- **Bouw:**
```html
<div class="mb-6">
  <div class="mb-2 flex justify-between text-sm text-slate-500">
    <span>Stap <b id="stepNum">3</b> van 8</span><span id="pct">38%</span>
  </div>
  <div role="progressbar" aria-valuenow="38" aria-valuemin="0" aria-valuemax="100"
       class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
    <div id="bar" class="h-full rounded-full bg-emerald-600 transition-all duration-300" style="width:38%"></div>
  </div>
</div>
```

### 6. Back-knop + autosave in localStorage
- **Wat:** terug kunnen zonder verlies; antwoorden overleven een refresh.
- **Wie:** Bark ("Back", "Continue"), MyBuilder (localStorage-key `postal-code`, "Used to add the postcode the user added into their application or job form").
- **Waarom:** mobiel verkeer keert vaak terug; zonder autosave begint iedereen opnieuw en haakt af.
- **Bouw:** `localStorage.setItem('os_lead', JSON.stringify(state))` bij elke wijziging; bij `DOMContentLoaded` inlezen en naar de laatste onvoltooide stap springen. Kies expliciet: **geen PII** in localStorage (alleen antwoorden + postcode), dat houdt het RGPD-verhaal simpel.

### 7. Trust-triplet direct onder de hero-CTA
- **Wat:** drie korte harde claims naast elkaar.
- **Wie:** Checkatrade ("Checked trades · 6M+ real reviews · £1,000 guarantee*"), Thumbtack ("4.9 from 15M+ reviews · 300K+ local pros · 100M+ home projects"), Checkatrade Express ("500+ Express services · Vetted trades · £1,000 guarantee*").
- **Waarom:** de bezoeker heeft 3 seconden. Drie cijfers vullen die beter dan een alinea.
- **Bouw:** `grid grid-cols-3 divide-x divide-slate-200` met per cel een `<b class="text-2xl">`-getal en `text-xs text-slate-500`-label. **Alleen echte cijfers gebruiken** — met een nieuw merk begin je met wat je wél hebt (bv. aantal aangesloten installateurs, RESCERT-nummers, gemiddelde reactietijd).

### 8. Live vraag-teller per categorie
- **Wat:** "Hoge vraag: X aanvragen in de laatste 24 uur", per dienst verschillend.
- **Wie:** Aroundhome — homepage toonde "808" en later "865", `/solaranlage/` toonde "211" en "214" binnen dezelfde sessie.
- **Waarom:** schaarste + sociale bewijskracht in één regel, zonder review-database.
- **Bouw:** genereer bij build (of via een klein Netlify-functietje) een JSON `{zonnepanelen: 41, warmtepomp: 17, ...}` uit je **echte** Netlify Forms-submissies van de laatste 24u. Nooit verzinnen — bij lage volumes toon je gewoon een langer venster ("deze maand"), dat blijft eerlijk.

### 9. Reviews met score, plaats, datum en "geverifieerd"-label
- **Wat:** review-kaart = cijfer + jobtitel + tekst + voornaam + postcode + "Verified" + "Posted 1 day ago".
- **Wie:** Checkatrade ("10 · Posted 1 day ago · Turfing back garden and extending patio area. · … · Melisa in NE63 · Verified").
- **Waarom:** de postcode maakt het lokaal, de datum maakt het levend, het label maakt het echt. Alle drie zonder de achternaam prijs te geven → RGPD-vriendelijk.
- **Bouw:** statische `reviews.json`, gerenderd in een `grid md:grid-cols-3 gap-4`. Voeg per kaart `itemprop`-schema toe (`Review`) voor rich snippets.

### 10. Garantie met een getal in de hero
- **Wat:** één concreet bedrag of belofte.
- **Wie:** Thumbtack ("up to $2,500 back"), Checkatrade ("£1,000 guarantee*"), Otovo FR ("10 ans de garantie sur la main-d'œuvre").
- **Waarom:** "wij werken alleen met betrouwbare partners" = ruis. "Niet tevreden over de match? Wij zoeken binnen 24u een nieuwe, of je hoort ons nooit meer" = een belofte.
- **Bouw:** badge-component + een `/garantie.html`-pagina met de voorwaarden (het sterretje bij Checkatrade linkt óók naar de voorwaarden — doe dat ook).

### 11. Kostengids-hub als SEO-motor
- **Wat:** één hub-pagina + tientallen "Wat kost X in 2026?"-pagina's met echte prijsvorken.
- **Wie:** Thumbtack `/prices` ("We track millions of cost estimates for thousands of projects"), Checkatrade `/blog/cost-guides/` ("2026 UK price guide"), Aroundhome `/kosten-hausprojekte/`, Angi, thermondo.
- **Waarom:** "wat kost een warmtepomp" is een aankoop-intentie-zoekopdracht met hoog volume en lage advertentiedruk. Deze pagina's voeden de funnel gratis.
- **Bouw:** Bart heeft al `build_blog.py` in selectly-v2 — hergebruiken. Template per dienst: prijsvork-tabel, "Wat bepaalt de prijs", "Welke premies", en onderaan **dezelfde funnel-widget** als op de homepage.
- **Belangrijke BE-hoek:** koppel elke kostenpagina aan de actuele Mijn VerbouwPremie / Fluvius-bedragen. Duitse en Britse spelers hebben dat niet; wij hebben een regelgeving die elk jaar wijzigt = jaarlijkse content-vernieuwingsreden.

### 12. Transparantie over het verdienmodel
- **Wat:** één zin die zegt hoe je geld verdient.
- **Wie:** Aroundhome, letterlijk bovenaan het formulier: "Wir finanzieren diesen Service über die Fachfirmen und erhalten eine Vergütung für jede vermittelte Kontaktanfrage" + "Kostenlos — Sie bezahlen für unsere Suche nichts. Wir finanzieren uns über die Fachfirmen."
- **Waarom:** Belgen zijn wantrouwig bij gratis offertesites, precies omdat het verdienmodel verzwegen wordt. Dit uitspreken is een differentiator, geen risico.
- **Bouw:** `<p class="text-sm text-slate-500">` onder de funnel-CTA + een `/hoe-verdienen-wij-geld.html`-pagina.

### 13. Micro-copy die de angst benoemt
- **Wat:** één regel die het bezwaar wegneemt op het moment dat het opkomt.
- **Wie:** Thumbtack, direct onder de hero-CTA: "**No calls or text until you message a pro.**"
- **Waarom:** de #1 reden om géén offerte aan te vragen in BE is "dan word ik door 5 firma's platgebeld". Dit is jullie hele positionering in één zin — en ze staat al bewezen in de markt.
- **Bouw:** letterlijke NL-variant onder elke CTA: *"Eén installateur belt je. Niet vijf. Nooit doorverkocht."*

### 14. Exit-intent bevestigingsmodal in de funnel
- **Wat:** wie wegklikt midden in de funnel krijgt "Weet je zeker dat je wil stoppen?"
- **Wie:** Bark, letterlijk: "Are you sure that you want to leave?" met "Quit" / "Continue".
- **Waarom:** goedkoopste recovery-mechanisme dat bestaat; vraagt geen e-mail.
- **Bouw:** `mouseleave` op `document` (desktop) + `history.pushState`-trap (mobiel back-knop) → `<dialog>` met twee knoppen. Variant met meer opbrengst: "Wil je dat we je antwoorden bewaren? Laat je e-mail achter en je krijgt de link."

### 15. Bedanktpagina met naam, foto en concreet tijdvenster + agenda
- **Wat:** geen "bedankt voor uw aanvraag", wel wie belt, wanneer, en de mogelijkheid zelf een moment te kiezen.
- **Wie:** Checkatrade Express ("Get a price · Pick a time · Get matched", plus review: "described the job I needed doing and was able to choose 3 time slots. My job was booked in less than 24 hours!"), Otovo ("Recevez un devis personnalisé en moins d'une minute").
- **Waarom:** de bedanktpagina is het moment van maximale aandacht; nu is het meestal een dood punt.
- **Bouw:** `bedankt.html` met de matchkaart uit punt 2 (uit `sessionStorage`), een tijdlijn ("vandaag: bevestiging per e-mail → binnen 24u: Jan belt je → binnen 5 werkdagen: plaatsbezoek") en een embedded GHL-boekingslink. Bart heeft de GHL-boekingsmachine al staan.

---

## 3. Vijf "wow"-mechanieken die ons in België zouden onderscheiden

### WOW 1 — Instant premie- en terugverdien-berekening (BE-specifiek, niemand doet dit goed)
Na de postcode + daktype + verbruik toon je meteen: geschat vermogen, geschatte investering, **Mijn VerbouwPremie-bedrag**, terugverdientijd. Effy doet de premie-hoek in FR ("Je demande ma prime Effy") maar niemand in BE koppelt premie + terugverdientijd + één installateur.
**Haalbaar zonder budget: JA.** Puur JS-rekenmodel op basis van een `premies.json` die Bart onderhoudt (bron: vlaanderen.be/mijn-verbouwpremie, staat al in competitors.json als watch-item). Wel: bronvermelding + datum + "richtbedrag, geen belofte" — anders juridisch risico.

### WOW 2 — Satelliet-dakscan met ingetekend dakvlak
Adres invullen → luchtfoto met het dakvlak, geschat bruikbaar oppervlak en aantal panelen. Otovo bouwt hun hele belofte hierop ("un devis personnalisé en moins d'une minute" vanaf enkel een adres), maar ik kon de satelliet-implementatie **niet op hun eigen site bevestigen**.
**Haalbaar zonder budget: DEELS.** In Vlaanderen bestaat de **Zonnekaart** (zonnekaart.be, Vlaamse overheid) en zijn er open orthofoto's + GRB-gebouwcontouren via Informatie Vlaanderen/geopunt WMS. Een statische kaart-tegel met de gebouwcontour is haalbaar; automatische dakvlak-detectie niet. **Aanbevolen v1:** toon de luchtfoto van het adres met het gebouw gemarkeerd + "wij herkennen jouw dak" — visueel effect van 90% tegen 5% van de kost. *Let op: ik heb de licentievoorwaarden en API-limieten van Zonnekaart/geopunt in dit onderzoek niet geverifieerd — dat moet apart.*

### WOW 3 — De gematchte installateur mét foto, naam en afstand vóór submit
Zie TOP-15 punt 2. Dit is het mechanisme dat het hele "één installateur"-verhaal geloofwaardig maakt: je zégt niet dat je één matcht, je **laat hem zien**. Thumbtack en zolar bewijzen dat het werkt; geen enkele Belgische speler doet het (Solvari toont enkel logo's).
**Haalbaar zonder budget: JA.** Statische JSON + JS. Vereist wel dat Bart echte installateurs met foto en toestemming heeft — dat is de echte inspanning, niet de code.

### WOW 4 — "Niet doorverkocht"-belofte met verifieerbare lead-code
Elke aanvraag krijgt een code (bv. `OS-2608-4417`) die de consument op de bedanktpagina ziet, en die de installateur ook noemt bij het eerste telefoontje. De consument kan de code op `offertesscout.be/check` invoeren en ziet: aan wie het dossier ging, wanneer, en dat het aan **precies één** partij is bezorgd.
Niemand internationaal doet dit. Het maakt van "wij verkopen je niet door" een controleerbaar feit i.p.v. een slogan, en het lost precies het BE-vertrouwensprobleem op.
**Haalbaar zonder budget: JA.** Code genereren in JS bij submit, opslaan in de Netlify Forms-submissie + GHL. De check-pagina kan v1 gewoon een formulier zijn dat een e-mail met de status triggert; v2 een kleine Netlify Function.

### WOW 5 — Foto-upload van het dak/de technische ruimte in de funnel
Één stap: "Heb je een foto van je dak / je stookruimte / je zekeringkast? Dan kan de installateur meteen correcter inschatten (optioneel)." Dit verhoogt de leadwaarde fors voor de installateur — wat de prijs per lead rechtvaardigt — en verlaagt het aantal nutteloze plaatsbezoeken.
Geen van de onderzochte sites zet foto-upload prominent in de consumentenfunnel.
**Haalbaar zonder budget: JA, met kanttekening.** Netlify Forms ondersteunt file-uploads native (`enctype="multipart/form-data"` + `<input type="file">`), maar er zit een limiet op opslag in het gratis plan. Alternatief: upload via een Cloudinary unsigned preset (gratis tier) en enkel de URL meesturen.

---

## 4. Haalbaarheid op statische Netlify + Netlify Forms + JS

| Mechaniek | Netlify statisch? | Extra nodig |
|---|---|---|
| Één-veld hero + geo-hint | Ja | `postcodes.json` (NL-BE postcodetabel, open data) |
| Multi-step funnel, klik-antwoorden, progressbar | Ja | ~120 regels vanilla JS |
| Back-knop + autosave (localStorage) | Ja | — |
| Exit-intent modal | Ja | `<dialog>` |
| Trust-triplet / reviews / garantie-badge | Ja | echte cijfers |
| Gematchte installateur tonen vóór submit | Ja | `installateurs.json` + foto's + toestemming |
| Kostengids-hub | Ja | hergebruik `build_blog.py` |
| Instant premie-berekening | Ja | `premies.json` + onderhoudsritme |
| Lead-code "niet doorverkocht" | Ja (v1) | Netlify Function voor de check-pagina (v2) |
| Foto-upload | Ja | Cloudinary unsigned preset bij volume |
| Live vraag-teller | **Bijna** | Netlify Function die Forms-API leest, of build-hook 1×/dag |
| Satelliet-dakscan | **Nee, niet volwaardig** | kaart-tegel wél; dakvlak-detectie niet |
| SMS-bevestiging na submit | Nee | via GHL (Bart heeft GHL al draaien) |
| Kalender-boeking op bedanktpagina | Ja (embed) | GHL-boekingslink — staat al |

**Conclusie haalbaarheid:** 11 van de 15 top-elementen en 4 van de 5 wow-mechanieken zijn volledig te bouwen met wat er al staat (Netlify + Forms + GHL). Alleen de satelliet-dakscan vraagt een compromis-versie.

---

## 5. Concrete bouwvolgorde (mijn advies)

1. **Positionering vastleggen in copy** — de zin van Thumbtack in het Nederlands: *"Eén installateur belt je. Niet vijf."* + de Aroundhome-transparantiezin over het verdienmodel. Dit is gratis en bepaalt alles.
2. **Funnel-skelet** (punten 3, 4, 5, 6, 14) — één herbruikbare `funnel.js` + `funnel.html`-partial die op alle 5 dienstpagina's werkt. Bart heeft al `vraag/zonnepanelen.html`, `warmtepomp.html`, `airco.html`, `dakwerken.html`, `thuisbatterij.html` staan — die worden de 5 instanties.
3. **Matchkaart vóór submit** (punt 2 / WOW 3) — dit is de differentiator. Zonder echte installateur-foto's werkt het niet; dat is de eerste sales-taak, niet de eerste code-taak.
4. **Bedanktpagina + lead-code + GHL-boeking** (punt 15 / WOW 4).
5. **Premie-calculator** (WOW 1) op de zonnepanelen- en warmtepomppagina.
6. **Kostengids-hub** (punt 11) — de trage maar samengestelde motor; starten zodra 1-5 live staan.

---

## 6. Gaten en beperkingen van dit rapport

- **Niet geladen — Angi homepage**: Cloudflare-CAPTCHA ("Performing security verification"), zowel direct als via reader-proxy. Wel geladen: `request.angi.com/chat` en `/companylist/`. Angi's hero-copy en trust-cijfers zijn dus **onbekend**.
- **Niet geladen — HomeAdvisor**: niet apart getest; HomeAdvisor is sinds de fusie opgegaan in Angi, dus zou hetzelfde blok geven.
- **Funnel-interne stappen van Enpal, Effy, 1KOMMA5°, zolar en Bark** zijn JS-applicaties waarvan de vragen pas na client-side rendering verschijnen. Ik heb voor die vijf **geen** volledige vragenlijst. De enige volledig geverifieerde vragenlijst is die van Aroundhome (via de server-gerenderde `/solaranlage/formular/`-pagina).
- **Otovo's satelliet-dakscan**: extern beschreven (o.a. otovo.solar), **niet bevestigd** op een Otovo-eigen pagina. Behandel als onbevestigd.
- **Trustpilot-scores**: alleen Checkatrade Express (4.6 / 84.313) en Effy (4,4 / 7.747, uit schema.org-data) waren als getal zichtbaar. Aroundhome en Bark tonen enkel het Trustpilot-logo/quotes zonder cijfer op de pagina zelf.
- **SMS-bevestiging en post-submit e-mailflows** kon ik niet observeren — dat vereist een echte submit met echte gegevens, wat ik niet heb gedaan.
- **Progressbar-percentages**: bij Aroundhome bevestigd via `role="progressbar"` in de DOM, maar de **getoonde percentages/stapaantallen** heb ik niet kunnen aflezen.
- **Zonnekaart / geopunt licentievoorwaarden** voor WOW 2 zijn **niet gecontroleerd** in dit onderzoek.
- **Snapshot-moment**: alles is van 2026-08-08. Hero-copy van dit soort sites wordt continu A/B-getest; Aroundhome toonde binnen één sessie al verschillende tellerwaarden.

---

## 7. Bronnen (alle geraadpleegd 2026-08-08)

- https://www.thumbtack.com/ · https://www.thumbtack.com/prices · https://www.thumbtack.com/instant-results/?category_pk=109125193401647362
- https://www.checkatrade.com/ · https://www.checkatrade.com/blog/cost-guides/ · https://express.checkatrade.com/
- https://www.mybuilder.com/
- https://www.bark.com/ · https://www.bark.com/en/gb/how-it-works/
- https://request.angi.com/chat · https://www.angi.com/companylist/ (homepage geblokkeerd)
- https://www.houzz.com/
- https://www.aroundhome.de/ · https://www.aroundhome.de/solaranlage/ · https://www.aroundhome.de/solaranlage/formular/ · https://www.aroundhome.de/kosten-hausprojekte/ · https://www.aroundhome.de/fachfirmenvermittlung/
- https://www.enpal.de/ · https://www.enpal.de/informieren-c1
- https://1komma5.com/de/ (1komma5grad.com → 301 naar 1komma5.com)
- https://www.zolar.de/
- https://www.thermondo.de/
- https://www.otovo.fr/ · https://www.otovo.be/ · https://www.otovo.com/
- https://www.effy.fr/
- https://www.hellowatt.fr/
- https://www.quotatis.fr/ · https://www.daa.net/ (nu TapTapHome)
- https://www.solvari.be/nl/zonnepanelen (BE-referentie)
- Lokaal: /Users/bartvanpoucke/selectly-agents/competitors.json · /Users/bartvanpoucke/selectly-v2/vraag/
