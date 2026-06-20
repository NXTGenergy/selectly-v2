# OfferteScout — B2C lead-gen brand

**Werknaam.** Selectly kiest definitieve naam + domein later.

Tijdelijk gehost op `/vraag/*` binnen Selectly's Netlify deploy.
Migratiepad: nieuwe Netlify-site + eigen domein → kopieer /vraag/* naar root.

## Wat dit IS

Een onafhankelijk B2C lead-gen brand naast Selectly's B2B-aanbod.
Doel: leads vangen via Meta/Instagram/Google ads, doorverkopen aan installateurs.

**Differentiator vs Bobex/Solvari:** "Eén match, niet 5 telefoons".

## Wat dit NIET is

- Selectly (= B2B SaaS voor installateur-zaakvoerders)
- Een installateur-bedrijf zelf

## Live pages

| URL | Doel |
|---|---|
| `/vraag/` | Brand-landing + sector-keuze (1 actief, 5 "binnenkort") |
| `/vraag/zonnepanelen.html` | 5-step consumer funnel |
| `/vraag/bedankt.html` | Bevestiging na form-submit + "geen match? we zoeken nieuwe" garantie |

## Volgende stappen (het team's keuzes)

### 1. Brand-naam + domein
Werknaam "OfferteScout" is in alle pages aanwezig. Voorbeelden:
- `OfferteScout.be` — direct beschikbaar? check
- `PremieScout.be` — premie-driven
- `1-installateur.be` — direct de USP in naam
- `MijnOfferte.be` — eigenaarschap-vibe

Ik kan met 1 vind+vervang alle pages migreren zodra je de naam vast hebt.

### 2. Tracking
Geen Pixel/consent in v1 (om data niet te mengen met Selectly).
Wanneer brand definitief: aparte Meta Pixel-ID aanmaken → installeren via pixel_install.py
met `--dir vraag/` flag.

### 3. Form-notifications
Submissions komen binnen via Netlify Forms onder form-name "offertescout-solar".
Aparte notification-email instellen (eigen mailbox of zelfde Proton-fallback).

### 4. Extra sectoren
Templates voor warmtepomp/isolatie/dakwerken/airco/batterij staan klaar in
`zonnepanelen.html` als basis. Per sector:
- Wijzig stap-vragen (type-specifiek)
- Wijzig premie-berekening
- Wijzig kleuren accent (sun voor zonnepanelen, sky voor HVAC, etc.)

### 5. Match-engine
Eerste leads handmatig: jij of Steffie matcht aan installateur.
Later: Python script dat Netlify Forms watcht + matched aan installateur-database.

## Ad-targeting test

Voor Steffie's eerste test-budget naar OfferteScout:
- Doelgroep: BE woningeigenaars 30-65, interesse "Renovation"/"Solar energy"
- Platform: Meta + Instagram
- Budget: €5-10/dag (klein test)
- Doelpagina: `/vraag/zonnepanelen.html`
- Vergelijk met Selectly's bestaande €18/dag B2B-campagne:
  - Verwachte CPL B2C: €3-8 (lager dan B2B)
  - Verwachte conversie: 8-15% form-fill (hoger dan B2B)

Doel: bewijzen dat lead-gen model werkt VOOR Selectly verkocht wordt aan klanten als product.

## Business model (concept)

| Wie betaalt | Aan wie | Voor wat |
|---|---|---|
| Niemand | OfferteScout | Klant vult formulier in (gratis) |
| Installateur | OfferteScout | €30-60 per gekwalificeerde match (1× per lead) |
| NXTG Solutions BV | Meta/Google | €5-10/lead voor ads-acquisitie |
| Netto marge | | €15-50 per lead |

Bij 50 leads/maand: €750-2.500 netto. Bij 500 leads/maand: €7.500-25.000 netto.

## Migratie naar eigen domein (later)

Wanneer brand-naam definitief + domein gekocht:
1. Nieuwe Netlify-site aanmaken
2. Push een nieuwe repo (offertescout-v2) met /vraag/* als root
3. Custom domain `offertescout.be` koppelen
4. Bij selectly.be: redirect `/vraag/*` → `offertescout.be/*` via netlify.toml
5. Eigen Pixel, eigen Analytics, eigen Identity

Geschatte tijd: 1 werkdag.
