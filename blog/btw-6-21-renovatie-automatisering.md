# BTW-automaten in de bouw: zo stop je met gokken tussen 6% en 21%

Een verkeerd BTW-tarief kost je gemiddeld 15% marge op één factuur. In de renovatiesector is dat geen uitzondering — het is een patroon. Aannemer A factureert 21% op een badkamerrenovatie van een woning ouder dan 10 jaar. Aannemer B factureert 6% op nieuwbouw. Beiden fout. Beiden betalen de prijs.

De Belgische BTW-wetgeving rond renovatie is complex, maar de beslislogica is dat niet. Het is een reeks harde regels met harde grenzen. Precies het soort probleem dat je kunt automatiseren.

---

## Waarom dit probleem groter is dan je denkt

Zet 10 mensen van hetzelfde aannemersbedrijf aan een tafel. Stel dezelfde casus. Je krijgt 4 verschillende antwoorden over het juiste BTW-tarief.

Dat is geen overdrijving. Het is wat we horen van bouwaannemers die bij ons aankloppen.

De kern van het probleem:

- **Bouwjaar van de woning** moet bewezen worden, niet enkel ingevuld
- **Bestemming van het gebouw** (privéwoning, vakantiewoning, handelszaak) telt mee
- **Type werk** bepaalt of 6% überhaupt van toepassing is
- **Attest van de eigenaar** is verplicht en heeft rechtsgevolg
- **Materialen vs arbeid** worden soms anders behandeld

Elke variabele interageert met de andere. Dat levert tientallen combinaties op. En in de praktijk beslist een medewerker dit in 90 seconden, tussen twee telefoongesprekken in.

---

## De beslislogica: wat de wet eigenlijk zegt

### De basisregel

6% geldt voor **renovatie van privéwoningen ouder dan 10 jaar**, op voorwaarde dat:

1. De woning hoofdzakelijk als privéwoning wordt gebruikt
2. Het werk gefactureerd wordt aan de eindgebruiker (of via een aannemer die dat aantoont)
3. De eigenaar een **renovatieattest** ondertekent

21% geldt voor alles wat daar niet onder valt.

### De uitzonderingen die iedereen vergeet

**Nieuwbouw is altijd 21%.** Geen discussie. Maar wat is nieuwbouw?

- Gebouwen jonger dan 10 jaar op moment van eerste ingebruikname
- Herbouw na sloop van meer dan 60% van de buitenmuren
- Aanhorigheden bij nieuwbouw (garage, carport, tuinmuur) volgen het tarief van de hoofdwoning als ze tegelijk worden opgeleverd

**Gemengd gebruik complicerende factor:**

Als meer dan 10% van de oppervlakte commercieel wordt gebruikt, vervalt het 6%-tarief voor het gehele pand. Niet voor dat deel. Het gehele pand.

**Materialen:**

Materialen die zelfstandig kunnen worden hergebruikt (sanitair, keukens, parketvloeren) vallen in theorie onder 21%, ook als de plaatsing aan 6% gaat. In de praktijk hanteert FOD Financiën een tolerantie: als de materiaalprijs niet meer dan 50% van de totale factuurprijs bedraagt, mag je het geheel aan 6% factureren.

50% is een harde grens. Geen interpretatieruimte.

---

## Wat dit kost als je het handmatig doet

| Scenario | Fout gemaakt | Financieel gevolg |
|---|---|---|
| 6% gefactureerd, 21% verschuldigd | Aannemer betaalt verschil bij | 15% marge weg per factuur |
| 21% gefactureerd, 6% correct | Klant te veel betaald, concurrentie verloren | Reputatieschade + correctienota |
| Attest ontbreekt bij controle | Btw-administratie heft bij aanslag | Boetes + achterstallige BTW |
| Materiaalgrens overschreden, 6% gefactureerd | Controle → herberekening volledige factuur | Gemiddeld €1.200 per dossier |

Dat zijn geen worst-case cijfers. Dat zijn de standaard gevolgen bij een BTW-audit in de bouwsector.

---

## Hoe automatisering dit oplost

De beslislogica is een beslisboom. Geen AI-magie. Gewoon: als X dan Y, anders Z.

Het probleem is niet dat mensen die logica niet kennen. Het probleem is dat ze hem **niet consistent toepassen** onder tijdsdruk, met incomplete informatie.

Een geautomatiseerd systeem doet drie dingen die een mens vergeet:

### 1. Verplicht de juiste input op het juiste moment

Geen bouwjaar ingevuld? Factuur gaat niet door. Attest niet geüpload? Klant krijgt automatisch een herinneringsmail.

Het systeem vraagt de informatie op het moment dat ze beschikbaar is — bij de offertefase — niet drie weken later als de factuur al verstuurd is.

### 2. Berekent het tarief op basis van regels, niet op basis van geheugen

De beslislogica zit in de tool, niet in het hoofd van één medewerker die er misschien volgende maand niet meer is.

Concreet voorbeeld van een automatiseringsflow:

```
Bouwjaar < (huidig jaar - 10)?
  → JA: privéwoning?
      → JA: materiaalkosten < 50% van totaal?
          → JA: 6% op volledige factuur
          → NEE: split factuur of 21% op materialen
      → NEE: 21%
  → NEE: 21% (nieuwbouw)
```

Dat is geen ingewikkelde logica. Het is gewoon logica die consequent uitgevoerd wordt.

### 3. Genereert het attest automatisch

Het renovatieattest dat de eigenaar moet ondertekenen, wordt automatisch opgemaakt vanuit de projectdata. Naam, adres, kadastergegevens, type werken — allemaal al ingevuld. De klant krijgt een link, tekent digitaal, en het document wordt opgeslagen in het dossier.

Geen losse PDF's in een mailbox. Geen "we zijn het vergeten".

---

## Praktijkgeval: NXTG Energy, Brugge

NXTG Energy installeert zonnepanelen, warmtepompen en laadpalen bij particulieren en bedrijven in de regio Brugge. Precies het type bedrijf waar het BTW-vraagstuk elke week speelt: residentieel vs. commercieel, nieuwe gebouwen vs. renovatie, installatie vs. materialen.

Voor de samenwerking met Selectly:

- Offertes werden handmatig opgemaakt: gemiddeld **8 uur per offerte**
- BTW-tarief werd per medewerker ingeschat, niet systematisch bepaald
- Attesten werden sporadisch opgevraagd
- **80 leads per maand** bleven liggen of wachtten te lang

Na implementatie:

- Offertetijd gedaald naar **47 minuten**
- **90% van de leads** krijgt binnen 1 uur een reactie
- BTW-tarief wordt bepaald door de beslisboom in het systeem, niet door de medewerker
- Attesten worden automatisch gegenereerd en digitaal ondertekend

Het resultaat is niet alleen snelheid. Het is ook consistentie. Elke factuur volgt dezelfde logica. Elke audit kan je dossier per dossier verdedigen.

---

## Wat NIET te doen

Dit is waar het bij de meeste bedrijven fout gaat.

### Niet doen: een Excel-tabel met tarieven bijhouden

Excel heeft geen beslislogica. Excel past geen grenscontroles toe. Excel herinnert niemand aan een ontbrekend attest. Een tabel geeft de illusie van structuur, maar de beslissing ligt nog steeds bij de persoon die de cel invult.

### Niet doen: vertrouwen op de kennis van één persoon

"Onze boekhouder weet dat." Prima. En als die boekhouder ziek is, met vakantie is, of opzegt? Dan weet niemand het meer. Kennis in een hoofd is geen systeem.

### Niet doen: wachten op een BTW-controle om te corrigeren

De Btw-administratie kijkt terug tot 3 jaar. Als je nu systematisch het verkeerde tarief hanteert, zit je mogelijk aan tientallen gecorrigeerde facturen en bijhorende boetes. Corrigeren na een controle is duurder dan automatiseren voor de controle.

### Niet doen: de materiaalgrens negeren

50% is geen richtlijn. Het is een grens die de FOD Financiën actief controleert in de bouwsector. Als je structureel facturen opstelt waarbij materialen meer dan de helft uitmaken maar je toch 6% aanrekent, ben je kwetsbaar.

### Niet doen: één tarief hanteren voor alle projecten "voor de veiligheid"

Sommige aannemers factureren altijd 21% om discussies te vermijden. Dat is duur. Je bent dan systematisch 15% duurder voor klanten die recht hebben op 6%. Je verliest opdrachten die je met het correcte tarief zou winnen.

---

## Welke systemen kunnen dit dragen?

Je hoeft geen nieuw softwarepakket te kopen. De beslislogica kan worden ingebouwd in:

- **Je offertesoftware** (Teamleader, CRM-systemen, maatwerkoplossingen)
- **Je boekhoudkoppeling** (Exact Online, Yuki, Billit)
- **Een standalone intake-flow** die de juiste vragen stelt en de output doorstuurt naar je bestaande tools

De keuze hangt af van waar het probleem zit in je proces. Soms is het de offertefase. Soms de facturatie. Soms het attestbeheer. Vaak alle drie, maar niet in dezelfde mate.

Een analyse van je huidige flow duurt een halve dag. De implementatie duurt gemiddeld 3 tot 6 weken, afhankelijk van wat je al hebt.

---

## De checklist: dit moet je systeem kunnen

Voordat je iets bouwt of koopt, controleer of het volgende geborgd is:

- [ ] Bouwjaar wordt ingevuld en gevalideerd bij de offerte
- [ ] Bestemming van het gebouw wordt systematisch gevraagd
- [ ] Materiaalkosten worden berekend als percentage van het totaal
- [ ] Bij >50% materialen: systeem geeft een waarschuwing of splitst automatisch
- [ ] Renovatieattest wordt automatisch opgemaakt bij 6%-dossiers
- [ ] Attest wordt digitaal ondertekend en opgeslagen per project
- [ ] Alle tariefkeuzes zijn traceerbaar per dossier

Als je vandaag geen antwoord kunt geven op de vraag "waarom is dit project aan 6% gefactureerd?", dan heb je een probleem dat je beter nu oplost dan bij een controle.

---

## Klaar om dit te regelen?

De beslisboom bestaat al. De regels zijn duidelijk. Het enige wat ontbreekt, is een systeem dat ze consequent uitvoert.

Bij Selectly bouwen we dat systeem op maat van jouw bedrijf — gekoppeld aan je bestaande tools, zonder dat je van nul moet beginnen.

Plan een gratis strategiegesprek van 30 minuten via [selectly.be/#contact](https://selectly.be/#contact). We kijken samen naar je huidige offerteflow, je facturatieproces en waar de BTW-beslissing vandaag gemaakt wordt.

Daarna weet je precies wat er moet veranderen — en hoeveel dat kost.