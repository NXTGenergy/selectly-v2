# Auto-offertes met de Claude API: wat is echt mogelijk?

Een offerte opstellen kost een gemiddelde KMO 4 tot 8 uur per stuk. Vermenigvuldig dat met 20 offertes per maand en je verliest al snel één fulltime werkweek aan een document dat de klant in 30 seconden doorscant.

Dat kan anders. NXTG Energy in Brugge maakte de sprong: van 8 uur naar 47 minuten per offerte. Niet door een goedkopere medewerker aan te nemen. Niet door kwaliteit in te leveren. Door het proces te automatiseren met de Claude API.

Dit artikel legt uit hoe dat werkt, wat het kost, en waar je voorzichtig mee moet zijn.

---

## Wat is de Claude API eigenlijk?

Claude is een taalmodel van Anthropic. De API is de technische brug waarmee je Claude insluit in je eigen tools, je eigen workflow, je eigen data.

Geen chatvenster op een website. Geen losse tool die je nog handmatig moet bedienen. Je bouwt het in.

Concreet betekent dat:
- Je stuurt gestructureerde input naar het model (klantgegevens, productopties, prijsregels)
- Het model genereert een volledig opgemaakte offerte
- Die offerte belandt automatisch in je CRM, je e-mailflow, of je PDF-generator

Dat is het basisprincipe. Wat je ermee doet, hangt af van hoe je het bouwt.

---

## Waarom werkt dit voor offertes?

Een offerte heeft een vaste structuur. Dat is precies het soort taak waar een taalmodel goed in is.

Een standaard B2B-offerte bevat:
- Een aanhef met klantcontext
- Een probleemomschrijving of aanleiding
- Een technische of commerciële oplossing
- Prijsdetail per lijn
- Voorwaarden, leveringstermijnen, geldigheid
- Een afsluitend stuk dat aanstuurt op een handtekening

Al die onderdelen zijn regelmatig. Ze volgen patronen. Een menselijke medewerker doet hetzelfde elke keer opnieuw, met kleine aanpassingen per klant.

De Claude API neemt de repetitieve kern over. De medewerker controleert, verfijnt, en stuurt.

---

## Hoe bouw je zo'n systeem?

### Stap 1: Definieer je input

Het systeem heeft gegevens nodig. Die haal je uit:
- Je CRM (naam, sector, eerdere aankopen, segmentatie)
- Je intake-formulier of salesgesprek
- Je productcatalogus of prijslijst
- Eventuele meetrapporten, behoefteanalyses, of technische specs

Hoe beter de input, hoe beter de output. Dit is geen magie. Het is structuur.

### Stap 2: Schrijf een sterk system prompt

Hier zit de kern van de kwaliteit. De system prompt vertelt Claude wie het is, wat het toonpatroon is, welke informatie altijd in de offerte moet staan, en wat nooit mag ontbreken.

Voorbeeldfragment uit een echte implementatie:

```
Je bent een offerte-assistent voor een installatiebedrijf in de energiesector.
Je schrijft in formeel maar direct Nederlands.
Je gebruikt altijd de bedrijfsnaam van de klant in de aanhef.
Je vermeldt altijd de geldigheidsduur van 30 dagen.
Je prijst nooit af zonder expliciete instructie in de input.
```

Eenvoudig. Maar zonder dit stuk gaat elke offerte in een andere richting.

### Stap 3: Stel je output-formaat vast

Claude kan produceren in platte tekst, markdown, of gestructureerde JSON. Voor offertes is JSON vaak de slimste keuze: je haalt de blokken eruit, formatteert ze in je eigen template, en genereert een PDF via een tool als Puppeteer of Pandoc.

Zo houdt je volledige controle over de opmaak. Het logo, het lettertype, de kleur: dat bepaal jij. Claude levert de inhoud.

### Stap 4: Koppel aan je bestaande tools

Een auto-offerte die je nog handmatig moet kopiëren naar een Word-document is geen automatisering. Het is een extra stap.

Zinvolle koppelingen zijn:
- **CRM-integratie** (HubSpot, Salesforce, Teamleader): offerte wordt automatisch aangemaakt bij een bepaalde fase in de pipeline
- **E-mailflow**: offerte wordt verstuurd via je vaste e-mailadres met persoonlijke aanhef
- **Handtekeningtools** (DocuSign, GetAccept): de klant ondertekent digitaal
- **Facturatiepakket**: goedgekeurde offerte wordt automatisch bon voor de boekhouder

---

## Wat deed NXTG Energy concreet?

NXTG Energy installeert laadpalen en zonnepanelen voor bedrijven in de regio Brugge. Ze hadden een goed salesteam, maar het offerteproces was een bottleneck.

Elke offerte vroeg:
1. Een intake-gesprek verwerken
2. Technische berekeningen invoeren
3. Een tekstdocument schrijven met uitleg
4. Opmaak aanpassen naar huisstijl
5. Controleren, goedkeuren, versturen

Dat was 8 uur werk. Per offerte.

Na implementatie van de Claude API-koppeling:
- Intake-formulier wordt ingevuld na het gesprek (15 minuten)
- Systeem haalt productdata op uit de catalogus
- Claude genereert de offertekst
- Template vult zich automatisch in
- Medewerker controleert en past aan waar nodig (20-30 minuten)
- Offerte is klaar: 47 minuten totaal

Het resultaat was ook commercieel zichtbaar. Ze gingen van 40 naar 80 leads per maand omdat de salesmedewerkers eindelijk tijd hadden om méér gesprekken te voeren. En 90% van de nieuwe leads kreeg een eerste reactie binnen 1 uur.

Dat laatste getal is niet toevallig. Snelheid converteert. Een lead die binnen een uur contact krijgt, koopt drie keer vaker dan een lead die twee dagen wacht.

---

## Vergelijking: manueel vs. geautomatiseerd

| Factor | Manueel | Met Claude API |
|---|---|---|
| Tijd per offerte | 4 tot 8 uur | 45 tot 90 minuten |
| Capaciteit per week | 5 tot 10 offertes | 25 tot 40 offertes |
| Consistentie in toon | Afhankelijk van medewerker | Vast kader |
| Reactietijd na lead | 1 tot 3 dagen | Onder 1 uur haalbaar |
| Schaalbaarheid | Nieuwe aanwerving nodig | Schaling zonder extra kost |
| Foutgevoeligheid | Hoog bij herhaalde taken | Laag bij goede input |

De medewerker verdwijnt niet. Die schuift op: van uitvoerder naar controleur en afwerker.

---

## Wat kost het?

De Claude API werkt met tokengebaseerde pricing. Een token is ruwweg een woord of woorddeel.

Een uitgebreide offerte van 800 woorden kost je ongeveer 0,01 tot 0,04 euro aan API-kosten. Dat is de prijs van een kleine slok koffie.

De echte kost zit in de bouw. Een goede integratie vraagt:
- Analyse van je huidige offerteproces (1 tot 2 dagen)
- Bouwen van de koppeling en prompt-engineering (3 tot 8 dagen afhankelijk van complexiteit)
- Testen en bijsturen (1 tot 2 dagen)
- Documentatie en overdracht (1 dag)

Reken op een eenmalige investering. Daarna zijn de variabele kosten verwaarloosbaar.

De terugverdientijd? Als je 10 offertes per week maakt en elke offerte 4 uur vrijmaakt, heb je na twee weken de investering terugverdiend in capaciteit. Wat je met die capaciteit doet, dat is de echte winst.

---

## Wat NIET te doen

Dit is waar het fout loopt bij bedrijven die het zelf proberen.

### Geen onderscheid maken tussen content en opmaak

Claude genereert tekst. De opmaak is jouw verantwoordelijkheid. Als je Claude vraagt om een "mooie PDF te maken", krijg je teleurstelling. Bouw je template los van het generatieproces.

### De prompt één keer schrijven en nooit meer aanraken

Een system prompt is geen set-and-forget configuratie. Na twee weken gebruik merk je patronen: zinnen die altijd fout zijn, informatie die Claude verzint als ze ontbreekt, formuleringen die je klanten niet begrijpen.

Plan na elke tien offertes een reviewmoment. Pas de prompt aan. Het systeem wordt beter naarmate je het bijstuurt.

### Alles automatisch versturen zonder controle

Verleidelijk. Gevaarlijk.

Claude hallucineert soms. Niet vaak. Maar een offerte met een foute prijs of een verkeerde projectomschrijving is duurder dan de uren die je hebt bespaard.

Bouw altijd een menselijke controle in, al is het vijf minuten. Maak de stap zo klein dat hij altijd gebeurt.

### Starten met het meest complexe offerteproduct

Begin met het eenvoudigste product in je catalogus. Bewijs dat het werkt. Breid dan uit.

Wie meteen het volledige gamma wil automatiseren, bouwt een systeem dat nergens goed werkt.

### Klantdata onbeveiligd doorsturen

Je stuurt klantgegevens naar een externe API. Dat vraagt aandacht voor GDPR. Zorg dat je data processor overeenkomst op orde is, dat je geen overbodige persoonsgegevens meestuurt, en dat je logging bijhoudt van wat er verwerkt wordt.

---

## Voor welke sectoren werkt dit het best?

De Claude API voor offertes werkt het best wanneer:

1. **Je offertes een vaste structuur hebben** maar per klant worden aangepast
2. **Je een productcatalogus of prijslijst** hebt die je kunt digitaliseren
3. **Je meer dan 5 offertes per week** maakt (onder dat volume is de ROI te klein)
4. **Je een CRM of intake-tool** gebruikt waar data al gestructureerd inzit

Sectoren waar we het meeste impact zien:
- Installatiebedrijven (elektriciteit, HVAC, sanitair)
- IT-dienstverleners en consultants
- Bouw en renovatie
- Bedrijven in de logistiek en transport
- Marketing- en communicatiebureaus

---

## Wat je vandaag al kunt doen

Je hoeft niet meteen een volledig systeem te bouwen. Begin hier:

1. **Analyseer je laatste 10 offertes.** Wat is altijd hetzelfde? Wat varieert per klant? Schrijf dat op.
2. **Tijdmeting.** Hoeveel uur besteed je aan één offerte? Vermenigvuldig dat met je maandvolume. Dat getal is je startpunt voor de businesscase.
3. **Breng je productdata in kaart.** Staat je catalogus ergens in een spreadsheet of PDF? Dat is je grondstof.
4. **Identificeer één offertevariant** die je als eerste wilt automatiseren.

Met die vier stappen heb je genoeg om een concreet gesprek te voeren over wat het voor jou kan betekenen.

---

## Klaar om het te bekijken?

NXTG Energy is geen uitzondering. Het is een blauwdruk.

Als je weet hoeveel uren je verliest aan offertes die altijd op hetzelfde neerkomen, dan weet je ook dat er iets te winnen is.

Boek een gratis strategiegesprek van 30 minuten. Geen verkooppraatje. Geen vrijblijvende presentatie. We kijken naar jouw offerteproces, jouw data, jouw tools. En we vertellen je eerlijk of automatisering zinvol is, en zo ja, hoe snel je het terugverdient.

**[Boek je gratis gesprek via selectly.be/#contact](https://selectly.be/#contact)**