# Selectly v2 — Deploy Instructions

3 bestanden, 0 build steps. Drag & drop deployment.

```
selectly-v2/
├── index.html          ← landing page
├── privacy.html        ← privacy policy
└── voorwaarden.html    ← algemene voorwaarden
```

---

## OPTIE A — Netlify (recommended, gratis)

### Stap 1: deploy
1. Ga naar **app.netlify.com**
2. Login met je bestaande account
3. Vind je huidige site `astounding-taffy-1116b2`
4. **Klik op de site** → tab **"Deploys"**
5. Sleep de **hele `selectly-v2/` folder** naar het deploy-vak ("Drag and drop your site output folder here")
6. Wacht ~30 sec → nieuwe versie staat live op je Netlify URL

### Stap 2: connect selectly.be
1. Site overview → **"Domain settings"** → **"Add custom domain"**
2. Typ: `selectly.be` → Verify
3. Add subdomain ook: `www.selectly.be`
4. Netlify geeft je 2 mogelijkheden:
   - **Optie 1 (eenvoudigst):** wijs je DNS naar Netlify nameservers (full delegation)
   - **Optie 2 (behoud SiteGround voor email):** wijs alleen A-record + CNAME

### Stap 3 (mét SiteGround voor email)

In je **SiteGround DNS panel** (Site Tools → Domain → DNS):

```
Type    Name      Value                          TTL
─────────────────────────────────────────────────────
A       @         75.2.60.5                      300
CNAME   www       jouw-site-naam.netlify.app     300
MX      @         (laat staan zoals het is)      300
TXT     @         (laat SPF record staan)        300
```

> **Belangrijk:** raak je MX en TXT records NIET aan — anders breekt je email.

In **Netlify**: domain settings → "Set up Netlify DNS" → kies "I'll use my existing DNS provider" → bevestig de Verify-stap.

HTTPS-certificaat wordt **automatisch geactiveerd** door Netlify binnen ~5 min na DNS propagatie.

### Stap 4: forms enable
Netlify Forms is automatisch geactiveerd omdat `data-netlify="true"` in de form staat.

Inkomende submissions zie je in:
**Site overview → Forms → contact**

Notificaties instellen:
- Forms → contact → **Settings & notifications** → Add notification → Email → vul `info@selectly.be` in
- Bij elke nieuwe lead krijg jij + Steffie een mail

---

## OPTIE B — SiteGround (alleen als je per se daar wil hosten)

Niet ideaal voor statische sites, maar werkbaar.

### Stap 1: upload
1. SiteGround → Site Tools → **File Manager**
2. Navigeer naar `/home/customer/www/selectly.be/public_html`
3. Verwijder eventuele bestaande WordPress/index bestanden (back-up eerst!)
4. Upload de 3 bestanden uit `selectly-v2/`
5. Site staat live op `selectly.be`

### Stap 2: form werkt NIET out-of-the-box
SiteGround heeft geen native form handling. Je moet kiezen:
- **Optie B1:** Gebruik [Formspree](https://formspree.io) (gratis tot 50 submissions/mnd) — vervang in `index.html` het `<form>` element met Formspree configuratie
- **Optie B2:** Switch back naar Netlify alleen voor de form (subdomain `forms.selectly.be`)
- **Optie B3:** Custom backend bouwen (overkill voor MVP)

> **Mijn advies blijft Netlify** — gratis, geen extra config voor forms, super snel.

---

## DNS Records uitleg (eenvoudig)

Stel je hebt 2 dingen op selectly.be:
1. **Website** = Netlify
2. **Email** (info@selectly.be) = SiteGround

DNS records gaan dan zo:

```
Wat                     Type    Waar het naartoe wijst
────────────────────────────────────────────────────────
selectly.be             A       75.2.60.5 (Netlify edge)
www.selectly.be         CNAME   xxx.netlify.app
mail.selectly.be        MX      SiteGround mailserver
*.selectly.be (rest)    -       blijft bij SiteGround
```

DNS-verandering propageert: 5 min - 24u (meestal binnen het uur in BE).

---

## Na deployment — checklist

- [ ] Site laadt op selectly.be (probeer in incognito)
- [ ] HTTPS werkt (groen slotje in browser)
- [ ] /privacy.html en /voorwaarden.html laden correct
- [ ] Contact form versturen test (vul in met test-data, check of het in Netlify Forms verschijnt)
- [ ] Form notificatie komt aan in info@selectly.be
- [ ] Mobile check — open op je telefoon, test menu + form
- [ ] Email selectly.be werkt nog (stuur test naar info@selectly.be)

---

## Toekomstige updates

Wanneer ik (Claude Code) de site aanpas:
1. Ik update de bestanden in `~/selectly-v2/`
2. Jij ziet de wijziging via "Open with → Browser" lokaal
3. Goedkeur → sleep opnieuw de folder naar Netlify deploys
4. Of: connect Netlify aan een GitHub repo voor auto-deploy

---

## Wat ontbreekt nog (toekomstige iteraties)

| Item | Prioriteit | Wie |
|---|---|---|
| Echte logo bestand (PNG/SVG) ipv mijn inline SVG | Medium | Bart/Steffie design beslissing |
| Foto's van Bart + Steffie voor "Over ons" sectie | Medium | Eigen foto's |
| Echte case study cijfers NXTG (zodra Phase 1 live is) | Hoog | Wachten op data |
| Echte testimonials van verdere klanten | Hoog | Na 2-3 succesvolle implementaties |
| Cookie banner (GDPR) | Medium | Ik kan toevoegen |
| Google Analytics 4 of Plausible | Laag | Privacy-vriendelijk alternatief |
| Booking calendar embed (Cal.com / GHL) | Hoog | Wanneer kalender klaar |
| Multi-language (FR voor Wallonië) | Laag | Pas later |
| Blog / Resources sectie | Medium | Voor SEO long-tail |
