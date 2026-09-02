# BTW-automaten in de bouw: zo stopt u met gokken tussen 6% en 21%

Een verkeerd BTW-tarief kost u 15 procentpunten op één factuur. In de renovatiesector is dat geen uitzondering — het is een patroon. Aannemer A factureert 21% op een badkamerrenovatie van een woning ouder dan 10 jaar. Aannemer B factureert 6% op nieuwbouw. Beiden fout. Beiden betalen de prijs.

De Belgische BTW-wetgeving rond renovatie is complex, maar de beslislogica is dat niet. Het is een reeks harde regels met harde grenzen. Precies het soort probleem dat u kunt automatiseren.

---

## Waarom dit probleem groter is dan u denkt

Zet 10 mensen van hetzelfde aannemersbedrijf aan een tafel. Stel dezelfde casus. U krijgt 4 verschillende antwoorden over het juiste BTW-tarief.

Dat is geen overdrijving. Het is wat we zagen bij de eerste uitrol van Selectly, in een Vlaamse installatiezaak, en wat we horen van aannemers die ons erover aanspreken.

De kern van het probleem:

- **Bouwjaar van de woning** moet bewezen worden, niet enkel ingevuld
- **Bestemming van het gebouw** (privéwoning, vakantiewoning, handelszaak) telt mee
- **Type werk** bepaalt of 6% überhaupt van toepassing is
- **De verplichte verklaring op de factuur** heeft rechtsgevolg
- **Materialen vs arbeid** worden soms anders behandeld

Elke variabele interageert met de andere. Dat levert tientallen combinaties op. En in de praktijk beslist een medewerker dit in 90 seconden, tussen twee telefoongesprekken in.

---

## De beslislogica: wat de wet eigenlijk zegt

### De basisregel

6% geldt voor **renovatie van privéwoningen ouder dan 10 jaar**, op voorwaarde dat:

1. De woning hoofdzakelijk als privéwoning wordt gebruikt
2. Het werk gefactureerd wordt aan de eindgebruiker (of via een aannemer die dat aantoont)
3. De verplichte **verklaring op de factuur** correct vermeld staat — het losse renovatieattest is afgeschaft sinds 2022

21% geldt voor alles wat daar niet onder valt.

### De uitzonderingen die iedereen vergeet

**Nieuwbouw is 21%, met twee uitzonderingen: warmtepompen sinds 1 januari 2026, en afbraak met heropbouw onder voorwaarden.** Geen discussie. Maar wat is nieuwbouw?

- Gebouwen jonger dan 10 jaar op moment van eerste ingebruikname
- Herbouw na sloop van meer dan 60% van de buitenmuren
- Aanhorigheden bij nieuwbouw (garage, carport, tuinmuur) volgen het tarief van de hoofdwoning als ze tegelijk worden opgeleverd

**Gemengd gebruik complicerende factor:**

Is het privégedeelte overwegend, dan geldt 6% op het volledige werk, ook op het beroepsgedeelte. Is het dat niet, dan wordt de factuur opgesplitst: 6% op het privégedeelte, 21% op het beroepsgedeelte. Er vervalt dus niets voor het hele pand.

**Materialen:**

Materialen die u levert én plaatst vallen onder 6%, ook sanitair, keukens en parket — dat staat uitdrukkelijk in KB nr. 20. De wet spreekt van materialen die een beduidend deel vertegenwoordigen, en vult dat limitatief in: cv-ketels in appartementsgebouwen en liftinstallaties. Er is geen algemene 50%-grens op de materiaalprijs.

De uitzonderingen zijn dus beperkt en limitatief opgesomd — niet een percentage dat u per factuur moet inschatten.

---

## Wat dit kost als u het handmatig doet

| Scenario | Fout gemaakt | Financieel gevolg |
|---|---|---|
| 6% gefactureerd, 21% verschuldigd | Aannemer betaalt verschil bij | 15 procentpunten weg per factuur |
| 21% gefactureerd, 6% correct | Klant betaalde te veel, opdracht verloren aan een concurrent | Reputatieschade + correctienota |
| Verplichte factuurvermelding ontbreekt bij controle | Btw-administratie heft bij aanslag | Boetes + achterstallige BTW |
| 6% aangerekend buiten de wettelijke uitzonderingen | Controle → herberekening volledige factuur | Bedrag hangt af van het dossier |

Dat zijn geen worst-case cijfers. Dat zijn de standaard gevolgen bij een BTW-audit in de bouwsector.

---

## Hoe automatisering dit oplost

De beslislogica is een beslisboom. Geen AI-magie. Gewoon: als X dan Y, anders Z.

Het probleem is niet dat mensen die logica niet kennen. Het probleem is dat ze hem **niet consistent toepassen** onder tijdsdruk, met incomplete informatie.

Een geautomatiseerd systeem doet drie dingen die een mens vergeet:

### 1. Verplicht de juiste input op het juiste moment

Geen bouwjaar ingevuld? Factuur gaat niet door. Bevestiging van de klant nog niet binnen? Die krijgt automatisch een herinneringsmail.

Het systeem vraagt de informatie op het moment dat ze beschikbaar is — bij de offertefase — niet drie weken later als de factuur al verstuurd is.

### 2. Berekent het tarief op basis van regels, niet op basis van geheugen

De beslislogica zit in de tool, niet in het hoofd van één medewerker die er misschien volgende maand niet meer is.

Concreet voorbeeld van zo'n beslisboom:

```
Bouwjaar < (huidig jaar - 10)?
  → JA: hoofdzakelijk privéwoning?
      → JA: cv-ketel in appartementsgebouw of liftinstallatie?
          → JA: 21% op dat onderdeel
          → NEE: 6% op de volledige factuur (levering én plaatsing)
      → NEE: splitsen — 6% privégedeelte, 21% beroepsgedeelte
  → NEE: 21% (nieuwbouw; behalve warmtepomp of afbraak-heropbouw)
```

Dat is geen ingewikkelde logica. Het is gewoon logica die consequent uitgevoerd wordt.

### 3. Zet de verplichte factuurvermelding er automatisch op

Sinds 1 juli 2022 vervangt een verplichte verklaring op de factuur het vroegere attest. Die vermelding wordt automatisch opgemaakt vanuit de projectdata, met de betwistingstermijn van een maand erbij. Naam, adres, kadastergegevens, type werken — allemaal al ingevuld. De klant krijgt een link, tekent digitaal, en het document wordt opgeslagen in het dossier.

Geen losse PDF's in een mailbox. Geen "we zijn het vergeten".

---

## Praktijkgeval: de eerste uitrol van Selectly

Dit draaide eerst vier weken in een gewone installatiezaak, met echte aanvragen en echte offertes — geen klantcase. Die zaak plaatst zonnepanelen, warmtepompen en laadpalen bij particulieren en bedrijven in de regio. Precies het type bedrijf waar het BTW-vraagstuk elke week speelt: residentieel tegenover commercieel, nieuwbouw tegenover renovatie, installatie tegenover materialen.

Hoe het daar liep voor we het automatiseerden:

- Offertes werden handmatig opgemaakt: gemiddeld **8 uur per offerte**
- Het BTW-tarief werd per medewerker ingeschat, niet systematisch bepaald
- De verplichte factuurvermelding werd er soms wel, soms niet op gezet
- **80 aanvragen per maand** bleven liggen of wachtten te lang

Nadat het systeem er gebouwd was:

- De tijd per offerte zakte naar **47 minuten**
- **90% van de aanvragen** krijgt binnen het uur een reactie
- Het BTW-tarief wordt bepaald door de beslisboom in het systeem, niet door de medewerker
- De verplichte vermelding staat automatisch op elke 6%-factuur

Het resultaat is niet alleen snelheid, het is vooral gelijkvormigheid. Elke factuur volgt dezelfde logica. Bij een controle kunt u elk dossier apart verdedigen. Deze cijfers zijn daar gemeten, voor we het aan iemand anders aanboden.

---

## Wat NIET te doen

Dit is waar het bij de meeste bedrijven fout gaat.

### Niet doen: een Excel-tabel met tarieven bijhouden

Excel heeft geen beslislogica. Excel past geen grenscontroles toe. Excel herinnert niemand aan een ontbrekende factuurvermelding. Een tabel geeft de illusie van structuur, maar de beslissing ligt nog steeds bij de persoon die de cel invult.

### Niet doen: vertrouwen op de kennis van één persoon

"Onze boekhouder weet dat." Prima. En als die boekhouder ziek is, met vakantie is, of opzegt? Dan weet niemand het meer. Kennis in een hoofd is geen systeem.

### Niet doen: wachten op een BTW-controle om te corrigeren

De Btw-administratie kijkt terug tot 3 jaar. Als u nu systematisch het verkeerde tarief hanteert, zit u mogelijk aan tientallen gecorrigeerde facturen en bijhorende boetes. Corrigeren na een controle is duurder dan automatiseren voor de controle.

### Niet doen: rekenen met een materiaalgrens die niet bestaat

De vaak genoemde 50%-materiaalgrens staat niet in de wet. Wat wél telt, zijn de limitatief opgesomde uitzonderingen uit KB nr. 20 — cv-ketels in appartementsgebouwen en liftinstallaties. Rekent u met een percentage in plaats van met die lijst, dan bouwt u uw dossier op een regel die niet bestaat.

### Niet doen: één tarief hanteren voor alle projecten "voor de veiligheid"

Sommige aannemers factureren altijd 21% om discussies te vermijden. Dat is duur. U bent dan systematisch 15 procentpunten duurder voor klanten die recht hebben op 6%, en u verliest opdrachten die u met het correcte tarief zou winnen.

---

## Welke systemen kunnen dit dragen?

U hoeft geen nieuw softwarepakket te kopen. De beslislogica kan worden ingebouwd in:

- **Uw offertesoftware** (Teamleader, CRM-systemen, maatwerkoplossingen)
- **Uw boekhoudkoppeling** (Exact Online, Yuki, Billit)
- **Een apart intakeformulier** dat de juiste vragen stelt en de antwoorden doorstuurt naar de tools die u al gebruikt

De keuze hangt af van waar het probleem in uw proces zit. Soms is het de offertefase. Soms de facturatie. Soms de factuurvermeldingen. Vaak alle drie, maar niet in dezelfde mate.

In 20 minuten leggen we samen bloot waar het bij u misloopt. Daarna gaat het snel: Lite staat live binnen 72 uur, Starter en Growth binnen twee tot vier weken, afhankelijk van de koppelingen.

---

## De checklist: dit moet uw systeem kunnen

Voordat u iets bouwt of koopt, controleer of het volgende geregeld is:

- [ ] Bouwjaar wordt ingevuld en gecontroleerd bij de offerte
- [ ] Bestemming van het gebouw wordt systematisch gevraagd
- [ ] Bij gemengd gebruik splitst het systeem privé- en beroepsgedeelte
- [ ] Bij een cv-ketel in een appartementsgebouw of een liftinstallatie: systeem waarschuwt of splitst automatisch
- [ ] De verplichte verklaring staat automatisch op elke 6%-factuur
- [ ] De bevestiging van de klant wordt digitaal getekend en per project bewaard
- [ ] Alle tariefkeuzes zijn achteraf traceerbaar per dossier

Kunt u vandaag geen antwoord geven op de vraag "waarom is dit project aan 6% gefactureerd?", dan hebt u een probleem dat u beter nu oplost dan bij een controle.

---

## Klaar om dit te regelen?

De beslisboom bestaat al. De regels zijn duidelijk. Het enige wat ontbreekt, is een systeem dat ze consequent uitvoert.

Bij Selectly bouwen we dat systeem op maat van uw bedrijf — gekoppeld aan de tools die u al hebt, zonder dat u van nul moet beginnen. De BTW-logica zit standaard mee ingebouwd bij [dakwerkers](/voor-dakwerken.html) en [HVAC-installateurs](/voor-hvac.html); wat dat kost, staat op de [pakkettenpagina](/pakketten.html). Als founding client betaalt u de helft van de opstartkost.

In 20 minuten kijken we samen hoe uw offertes lopen, hoe u factureert en waar de BTW-beslissing vandaag genomen wordt.

**[Boek een gratis demo →](/demo)**

Daarna weet u precies wat er moet veranderen — en hoeveel dat kost.
