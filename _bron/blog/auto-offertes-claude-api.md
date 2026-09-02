# Auto-offertes met de Claude API: wat is echt mogelijk?

Een offerte opstellen kost een gemiddelde KMO 4 tot 8 uur per stuk. Vermenigvuldig dat met 20 offertes per maand en u verliest al snel één voltijdse werkweek aan een document dat de klant in 30 seconden doorscant.

Dat kan anders. Ons eigen installatiebedrijf maakte de sprong: van 8 uur naar 47 minuten per offerte. Niet door een goedkopere medewerker aan te nemen. Niet door kwaliteit in te leveren. Door het proces te automatiseren met de Claude API.

Dit artikel legt uit hoe dat werkt, wat het kost, en waar u voorzichtig mee moet zijn.

---

## Wat is de Claude API eigenlijk?

Claude is een taalmodel van Anthropic. De API is de technische brug waarmee u Claude inbouwt in uw eigen tools, uw eigen werkwijze, uw eigen data.

Geen chatvenster op een website. Geen losse tool die u nog handmatig moet bedienen. U bouwt het in.

Concreet betekent dat:
- U stuurt gestructureerde input naar het model (klantgegevens, productopties, prijsregels)
- Het model genereert een volledig opgemaakte offerte
- Die offerte belandt automatisch in uw CRM, uw mailopvolging of uw PDF-generator

Dat is het basisprincipe. Wat u ermee doet, hangt af van hoe u het bouwt.

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

## Hoe bouwt u zo'n systeem?

### Stap 1: bepaal uw input

Het systeem heeft gegevens nodig. Die haalt u uit:
- Uw CRM (naam, sector, eerdere aankopen, segmentatie)
- Uw intakeformulier of het verkoopgesprek
- Uw productcatalogus of prijslijst
- Eventuele meetrapporten, behoefteanalyses of technische fiches

Hoe beter de input, hoe beter wat eruit komt. Dit is geen magie. Het is structuur.

### Stap 2: schrijf een sterke system prompt

Hier zit de kern van de kwaliteit. De system prompt vertelt Claude wie het is, welke toon het aanhoudt, welke informatie altijd in de offerte moet staan en wat nooit mag ontbreken.

Voorbeeldfragment uit onze eigen opstelling (een prompt spreekt het model aan, vandaar de je-vorm):

```
Je bent een offerte-assistent voor een installatiebedrijf in de energiesector.
Je schrijft in formeel maar direct Nederlands.
Je gebruikt altijd de bedrijfsnaam van de klant in de aanhef.
Je vermeldt altijd de geldigheidsduur van 30 dagen.
Je prijst nooit af zonder expliciete instructie in de input.
```

Eenvoudig. Maar zonder dit stuk gaat elke offerte een andere kant op.

### Stap 3: leg vast in welke vorm het eruit komt

Claude kan platte tekst, markdown of gestructureerde JSON leveren. Voor offertes is JSON vaak de slimste keuze: u haalt de blokken eruit, giet ze in uw eigen sjabloon en maakt er een PDF van met een tool als Puppeteer of Pandoc.

Zo houdt u volledige controle over de opmaak. Het logo, het lettertype, de kleur: dat bepaalt u. Claude levert de inhoud.

### Stap 4: koppel aan de tools die u al hebt

Een automatische offerte die u nog handmatig naar een Word-document moet kopiëren, is geen automatisering. Dat is een extra stap.

Zinvolle koppelingen zijn:
- **CRM-koppeling** (HubSpot, Salesforce, Teamleader): de offerte wordt automatisch aangemaakt zodra een dossier een bepaalde fase bereikt
- **Mailopvolging**: de offerte vertrekt via uw vaste mailadres met een persoonlijke aanhef
- **Handtekentools** (DocuSign, GetAccept): de klant tekent digitaal
- **Facturatiepakket**: een goedgekeurde offerte wordt automatisch een bon voor de boekhouder

---

## Wat we in ons eigen bedrijf concreet deden

Ons installatiebedrijf plaatst laadpalen en zonnepanelen bij bedrijven in de regio. De verkoop liep goed, maar het offerteproces zat verstopt.

Elke offerte vroeg:
1. Een intakegesprek verwerken
2. Technische berekeningen invoeren
3. Een tekstdocument schrijven met uitleg
4. De opmaak naar de huisstijl trekken
5. Controleren, goedkeuren, versturen

Dat was 8 uur werk. Per offerte.

Nadat we de Claude API eraan gekoppeld hadden:
- Het intakeformulier wordt ingevuld na het gesprek (15 minuten)
- Het systeem haalt de productgegevens uit de catalogus
- Claude schrijft de offertetekst
- Het sjabloon vult zichzelf in
- De medewerker controleert en past aan waar nodig (20 à 30 minuten)
- Offerte klaar: 47 minuten in totaal

Het effect was ook commercieel merkbaar. We gingen van 40 naar 80 aanvragen per maand, gewoon omdat er eindelijk tijd was om meer gesprekken te voeren. En 90% van de nieuwe aanvragen kreeg binnen het uur een eerste reactie.

Dat laatste cijfer is geen toeval. Wie snel antwoordt, blijft in beeld. Iemand die binnen het uur contact krijgt, heeft u nog aan de lijn voor hij drie concurrenten heeft gebeld. Dit zijn onze eigen cijfers, in ons eigen bedrijf gemeten, voor we dit aan iemand anders aanboden.

---

## Vergelijking: manueel vs. geautomatiseerd

| Factor | Manueel | Met Claude API |
|---|---|---|
| Tijd per offerte | 4 tot 8 uur | 45 tot 90 minuten |
| Capaciteit per week | 5 tot 10 offertes | 25 tot 40 offertes |
| Consistentie in toon | Afhankelijk van medewerker | Vast kader |
| Reactietijd na een aanvraag | 1 tot 3 dagen | Onder 1 uur haalbaar |
| Meer volume aankunnen | Nieuwe aanwerving nodig | Groeit mee zonder extra kost |
| Foutgevoeligheid | Hoog bij herhaalde taken | Laag bij goede input |

De medewerker verdwijnt niet. Die schuift op: van uitvoerder naar controleur en afwerker.

---

## Wat kost het?

De Claude API rekent af per token. Een token is ruwweg een woord of een woorddeel.

Een uitgebreide offerte van 800 woorden kost u ongeveer 0,01 tot 0,04 euro aan API-kosten. Minder dan een kop koffie.

De echte kost zit in de bouw. Een goede koppeling vraagt:
- Doorlichten van uw huidige offerteproces (1 tot 2 dagen)
- De koppeling bouwen en de prompts uitwerken (3 tot 8 dagen, afhankelijk van de complexiteit)
- Testen en bijsturen (1 tot 2 dagen)
- Documentatie en overdracht (1 dag)

Reken op een eenmalige opstartkost. Daarna is wat er maandelijks bijkomt verwaarloosbaar. Bij ons betaalt u die opstartkost één keer — €750 bij Lite, €1.500 bij Starter, €3.000 bij Growth — en als founding client de helft daarvan. Lite staat live binnen 72 uur, Starter en Growth binnen twee tot vier weken, afhankelijk van de koppelingen.

De terugverdientijd? Maakt u 10 offertes per week en wint u er telkens 4 uur mee, dan hebt u die opstartkost na twee weken terugverdiend in vrijgekomen uren. Wat u met die uren doet, dat is de echte winst.

---

## Wat NIET te doen

Dit is waar het fout loopt bij bedrijven die het zelf proberen.

### Geen onderscheid maken tussen inhoud en opmaak

Claude levert tekst. De opmaak is uw zaak. Vraagt u Claude om "een mooie PDF te maken", dan wordt dat een ontgoocheling. Bouw uw sjabloon los van het schrijfwerk.

### De prompt één keer schrijven en nooit meer aanraken

Een system prompt zet u niet één keer op om er daarna vanaf te blijven. Na twee weken gebruik ziet u patronen: zinnen die altijd fout zitten, gegevens die Claude invult als ze ontbreken, formuleringen die uw klanten niet begrijpen.

Plan na elke tien offertes een moment om na te kijken. Pas de prompt aan. Het systeem wordt beter naarmate u het bijstuurt.

### Alles automatisch versturen zonder controle

Verleidelijk. Gevaarlijk.

Claude verzint soms iets. Niet vaak. Maar een offerte met een foute prijs of een verkeerde projectomschrijving kost u meer dan de uren die u hebt bespaard.

Bouw altijd een menselijke controle in, al is het vijf minuten. Maak die stap zo klein dat hij altijd gebeurt.

### Beginnen met uw ingewikkeldste offerte

Begin met het eenvoudigste product uit uw catalogus. Bewijs dat het werkt. Breid daarna uit.

Wie meteen het volledige gamma wil automatiseren, bouwt een systeem dat nergens goed werkt.

### Klantgegevens onbeveiligd doorsturen

U stuurt klantgegevens naar een externe API. Dat vraagt aandacht voor GDPR. Zorg dat uw verwerkersovereenkomst in orde is, dat u geen overbodige persoonsgegevens meestuurt, en dat u bijhoudt wat er verwerkt wordt.

---

## Voor welke sectoren werkt dit het best?

De Claude API voor offertes werkt het best wanneer:

1. **Uw offertes een vaste structuur hebben** maar per klant worden aangepast
2. **U een productcatalogus of prijslijst** hebt die u kunt digitaliseren
3. **U meer dan 5 offertes per week** maakt (daaronder weegt het niet op tegen de opzetkost)
4. **U een CRM of intaketool** gebruikt waar de gegevens al geordend in zitten

Sectoren waar dit het zuiverst werkt:
- Installatiebedrijven (elektriciteit, HVAC, sanitair)
- IT-dienstverleners en consultants
- Bouw en renovatie
- Bedrijven in logistiek en transport
- Marketing- en communicatiebureaus

---

## Wat u vandaag al kunt doen

U hoeft niet meteen een volledig systeem te bouwen. Begin hier:

1. **Neem uw laatste 10 offertes door.** Wat is altijd hetzelfde? Wat verschilt per klant? Schrijf dat op.
2. **Meet de tijd.** Hoeveel uur kruipt er in één offerte? Vermenigvuldig dat met uw maandvolume. Dat getal is uw vertrekpunt.
3. **Breng uw productgegevens in kaart.** Staat uw catalogus in een rekenblad of een PDF? Dat is uw grondstof.
4. **Kies één type offerte** dat u als eerste wilt automatiseren.

Met die vier stappen hebt u genoeg om een concreet gesprek te voeren over wat het voor u kan betekenen.

---

## Klaar om het te bekijken?

Dit is geen uitzondering. Het is een blauwdruk — en hij werkt het zuiverst in sectoren met terugkerende posten, zoals bij [HVAC-installateurs](/voor-hvac.html) en [dakwerkers](/voor-dakwerken.html).

Weet u hoeveel uren u verliest aan offertes die altijd op hetzelfde neerkomen, dan weet u ook dat er iets te winnen valt.

Boek een gratis gesprek van 20 minuten. Geen verkooppraatje. Geen vrijblijvende presentatie. We kijken naar uw offerteproces, uw gegevens, uw tools. En we zeggen u eerlijk of automatiseren zinvol is, en zo ja, hoe snel u het terugverdient.

**[Boek een gratis demo →](/demo)**
