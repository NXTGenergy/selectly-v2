# Vapi vs Retell: welke voicebot past bij jouw bedrijf?

Elke gemiste oproep kost geld. Uit onderzoek van HubSpot blijkt dat 78% van de klanten koopt bij het bedrijf dat als eerste reageert. Toch staat bij de meeste KMO's de telefoon onbeantwoord buiten de kantooruren. Twee platformen veranderen dat: Vapi en Retell. Maar welke kies je?

Dit artikel legt het verschil uit. Zonder blabla, zonder technisch geneuzel.

---

## Wat zijn Vapi en Retell?

Beide platformen laten je AI-agents bouwen die telefonisch praten met klanten. Ze nemen de telefoon op, stellen vragen, geven antwoorden en sturen data door naar je CRM of agenda.

Ze doen dat in real-time. Niet met een chatbot. Niet met een keuzemenu. Met een stem die reageert op wat de beller zegt.

Het verschil zit in hoe ze dat doen, voor wie ze gebouwd zijn en wat ze kosten.

---

## Vapi: gebouwd voor ontwikkelaars

Vapi is in de eerste plaats een developer-platform. De kracht ervan ligt in flexibiliteit.

**Wat je krijgt:**

- Volledige controle over de call-flow via JSON-configuraties
- Ondersteuning voor meerdere LLM-providers (OpenAI, Anthropic, Groq, eigen modellen)
- Eigen speech-to-text en text-to-speech keuze per use case
- Webhooks naar elk systeem dat een API heeft
- Uitgebreide logs en debuggingtools

**Wie dit kiest:**

- Bedrijven met een interne ontwikkelaar
- Bureaus die eigen producten bouwen op de infrastructuur
- Use cases met complexe logica, meerdere talen of hoge call volumes

**Nadeel:** Je bouwt alles zelf. Er is geen visuele interface die je door de setup leidt. Voor een zaakvoerder die zelf zijn voicebot wil opzetten, is de leercurve steil.

**Prijsmodel:** Vapi rekent per minuut. Gemiddeld 0,05 tot 0,15 dollar per minuut, afhankelijk van de modellen die je kiest. Daarboven betaal je voor het onderliggende LLM- en stemgebruik. Wie hoog volume draait, onderhandelt een custom contract.

---

## Retell: gebouwd voor snelheid

Retell kiest een andere aanpak. Het platform legt de nadruk op eenvoud en snelheid van deployment.

**Wat je krijgt:**

- Visuele workflow-builder met drag-and-drop
- Ingebouwde templates voor veelvoorkomende use cases (receptie, afspraken, FAQ)
- Lagere technische drempel om te starten
- Geïntegreerde analyses en call recordings
- Ondersteuning voor meerdere stemmen en talen

**Wie dit kiest:**

- KMO's die snel willen starten zonder ontwikkelaar
- Teams die zelf beheer willen doen na initiële setup
- Use cases met een relatief vaste, voorspelbare call-flow

**Nadeel:** Minder flexibel bij complexe integraties. Wie maatwerk nodig heeft buiten de templates, botst sneller op beperkingen. De LLM-keuze is ook beperkter dan bij Vapi.

**Prijsmodel:** Retell werkt met een abonnement plus gebruik. Instap rond 99 dollar per maand, daarboven per-minuut kosten. Voor lage volumes goedkoper dan Vapi. Voor hoge volumes wordt het snel duurder.

---

## Directe vergelijking

| Criterium | Vapi | Retell |
|---|---|---|
| Technische drempel | Hoog | Laag |
| Flexibiliteit | Zeer hoog | Gemiddeld |
| Snelheid van opzetten | Traag (zonder dev) | Snel |
| LLM-keuze | Breed | Beperkt |
| Prijs bij laag volume | Variabel | Voorspelbaar |
| Prijs bij hoog volume | Voordelig | Duur |
| Visuele editor | Nee | Ja |
| CRM-integraties | Via API | Ingebouwd + API |
| Debuggingtools | Uitstekend | Basis |
| Geschikt voor KMO zonder dev | Nee | Ja |

---

## Wat betekent dit in de praktijk?

Neem NXTG Energy in Brugge. Dit bedrijf in energieoplossingen kreeg maandelijks meer dan 200 inkomende oproepen. Veel ervan waren kwalificatievragen: heeft de klant een geschikt dak, welk vermogen, wat is zijn huidig verbruik?

Vóór de automatisering kostte elke lead-kwalificatie gemiddeld 25 minuten menselijke tijd. De offerte zelf nam 8 uur in beslag.

Na de implementatie van een voicebot op Vapi-infrastructuur:

- **80 leads per maand** worden volledig automatisch gekwalificeerd
- **90% van alle inkomende oproepen** krijgt een antwoord binnen 1 minuut, ook 's nachts en in het weekend
- De offertetijd daalde van **8 uur naar 47 minuten**

Waarom Vapi en niet Retell in dit geval? De integratie met hun CRM en offertesoftware vroeg om maatwerk. De call-flow bevatte conditionele logica op basis van postcode, daktype en energieverbruik. Dat soort vertakking bouw je in Vapi met precisie. In Retell had je snel tegen de grenzen van de templates gebotst.

Maar een tandartspraktijk in Gent die afspraken wil automatiseren? Een Retell-template voor afsprakenbeheer is daar in twee dagen operationeel. Geen ontwikkelaar nodig.

---

## Hoe kies je?

Drie vragen die de beslissing bepalen.

**1. Heb je een technische partner?**

Ja: Vapi geeft je meer mogelijkheden voor minder geld op schaal.
Nee: Retell laat je sneller starten en zelf beheren.

**2. Hoe complex is je call-flow?**

Eenvoudig (afspraken, FAQ, doorverbinden): Retell volstaat.
Complex (meerdere stappen, conditionele logica, externe data opvragen): Vapi.

**3. Hoeveel calls verwacht je per maand?**

Onder de 500 minuten: Retell is voorspelbaar geprijsd.
Boven de 2000 minuten: Vapi wordt goedkoper, zeker met volume-contracten.

---

## Wat NIET te doen

Dit zijn de fouten die Selectly ziet bij bedrijven die zelf beginnen.

**Retell kiezen omdat het goedkoper lijkt**

De instapprijs van Retell is lager. Maar wie een jaar later complexe integraties nodig heeft, moet migreren. Dat kost meer tijd en geld dan het juiste platform van bij het begin kiezen.

**Vapi kopen zonder technisch plan**

Vapi zonder een duidelijke architectuur is een dure sandbox. Het platform is krachtig, maar geeft je ook alle vrijheid om inefficiënte call-flows te bouwen die niemand begrijpt.

**Een voicebot inzetten als chatbot**

Een voicebot is geen FAQ-pagina met een stem. Wie een lijst van 50 vragen en antwoorden in een voicebot propt, maakt een slechte beller-ervaring. Bellers haken af. De kwalificatiedata is waardeloos.

**De stem onderschatten**

De keuze van stem, spreeksnelheid en stiltes bepaalt of een beller ophangt of blijft. Beide platformen bieden ElevenLabs-stemmen. Neem de tijd om dat te testen met echte klanten voor je live gaat.

**Live gaan zonder fallback**

Elke voicebot moet een escalatie-pad hebben. Als de agent de intentie niet begrijpt, moet er een mens bereikbaar zijn. Of toch minstens een duidelijke voicemail. Bellers die in een lus zitten, klagen. En terecht.

**De GDPR-check overslaan**

Beide platformen verwerken stemdata. In België geldt GDPR. Controleer waar de audio-opnames worden opgeslagen, wie toegang heeft en of je bellers informeert dat ze met een geautomatiseerd systeem praten.

---

## De echte keuze is niet het platform

Vapi versus Retell is niet de moeilijkste beslissing. De moeilijkste beslissing is: welke calls ga je automatiseren, met welke logica, en hoe integreer je dat in je bestaande processen?

Een voicebot die slecht ontworpen is, beschadigt je relatie met klanten. Een voicebot die goed ontworpen is, werkt 24/7 en kwalificeert leads terwijl je slaapt.

Het platform is de motor. De strategie is de bestuurder.

---

## Welke cijfers kun je verwachten?

Concrete benchmarks uit projecten van Selectly:

- **Eerste reactietijd:** van gemiddeld 4 uur naar onder de 2 minuten
- **Kwalificatietijd per lead:** van 20-30 minuten naar 4-8 minuten
- **Aandeel oproepen buiten kantooruren dat een antwoord krijgt:** van 0% naar 100%
- **No-show bij afspraken:** daalt gemiddeld 35% door geautomatiseerde bevestiging en herinnering

Deze cijfers zijn geen garanties. Ze hangen af van volume, sector en hoe goed de agent gebouwd is.

---

## Hoe Selectly dit aanpakt

Selectly kiest het platform op basis van het project. Niet op basis van voorkeur.

Voor eenvoudige use cases bij KMO's zonder technisch team: Retell, snel gedeployed, gemakkelijk te beheren.

Voor complexe integraties, hoge volumes of maatwerk: Vapi, gebouwd op een architectuur die meeschaalt.

In beide gevallen:

1. Sessie van 30 minuten om de use case en de call-flow te begrijpen
2. Technische audit van de bestaande tools (CRM, agenda, offertesoftware)
3. Prototype binnen 5 werkdagen
4. Test met echte calls voor livegang
5. Monitoring en optimalisatie na livegang

Geen contract van een jaar voor je weet of het werkt.

---

## Klaar om te starten?

Je weet nu het verschil tussen Vapi en Retell. Je weet welke vragen de keuze bepalen. Je weet wat de valkuilen zijn.

De volgende stap is uitzoeken of een voicebot past bij jouw specifieke situatie. Dat duurt 30 minuten. Geen verplichtingen.

Boek een gratis strategiegesprek via [selectly.be/#contact](https://selectly.be/#contact).