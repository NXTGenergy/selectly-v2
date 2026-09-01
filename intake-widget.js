/* Selectly — AI Intake Assistant widget. Zelf-injecterend, geen dependencies.
 * Praat met de bezoeker (Claude-backend via /.netlify/functions/intake), kwalificeert en boekt. */
(function () {
  if (window.__selectlyIntake) return; window.__selectlyIntake = true;
  var API = '/.netlify/functions/intake';
  var GREET = 'Dag! Ik ben de AI-assistent van Selectly. In een paar korte vragen kijk ik of we uw opvolging sneller kunnen maken, en of een demo zin heeft.\n\nWaarmee bent u bezig: HVAC of airco, warmtepompen, dakwerken, renovatie, sanitair — of iets anders?';
  var apiMessages = [];   // wat naar de backend gaat (start met user)
  var pushed = false, gemeld = false, booking = '';

  var css = document.createElement('style');
  css.textContent = [
    '.sl-iw-btn{position:fixed;right:20px;bottom:20px;z-index:99998;display:flex;align-items:center;gap:10px;padding:12px 18px;border:none;border-radius:999px;background:linear-gradient(135deg,#5b8cff,#3a6cf2);color:#fff;font:600 15px/1 -apple-system,Segoe UI,Roboto,sans-serif;cursor:pointer;box-shadow:0 8px 28px -6px rgba(58,108,242,.55);transition:transform .15s}',
    '.sl-iw-btn:hover{transform:translateY(-2px)}',
    'body.sl-consent-open .sl-iw-btn{bottom:150px}',
    'body.sl-consent-open .sl-iw-panel{bottom:150px}',
    '.sl-iw-btn svg{width:20px;height:20px}',
    '.sl-iw-panel{position:fixed;right:20px;bottom:20px;z-index:99999;width:380px;max-width:calc(100vw - 24px);height:560px;max-height:calc(100vh - 40px);background:#fff;border-radius:20px;box-shadow:0 20px 60px -12px rgba(15,23,42,.35);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,Segoe UI,Roboto,sans-serif}',
    '.sl-iw-head{background:linear-gradient(135deg,#5b8cff,#3a6cf2);color:#fff;padding:16px 18px;display:flex;align-items:center;gap:12px}',
    '.sl-iw-head .t{font-weight:700;font-size:15px;line-height:1.2}.sl-iw-head .s{font-size:12px;opacity:.85;display:flex;align-items:center;gap:6px}',
    '.sl-iw-dot{width:7px;height:7px;border-radius:50%;background:#34e4a8;display:inline-block}',
    '.sl-iw-x{margin-left:auto;background:none;border:none;color:#fff;font-size:20px;cursor:pointer;opacity:.85;line-height:1}',
    '.sl-iw-body{flex:1;overflow-y:auto;padding:16px;background:#f4f6fb;display:flex;flex-direction:column;gap:10px}',
    '.sl-iw-msg{max-width:82%;padding:10px 14px;border-radius:14px;font-size:14px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word}',
    '.sl-iw-a{align-self:flex-start;background:#fff;color:#0f172a;border-bottom-left-radius:4px;box-shadow:0 1px 2px rgba(15,23,42,.06)}',
    '.sl-iw-u{align-self:flex-end;background:#3a6cf2;color:#fff;border-bottom-right-radius:4px}',
    '.sl-iw-typing{align-self:flex-start;color:#64748b;font-size:13px;padding:4px 6px}',
    '.sl-iw-book{align-self:flex-start;margin-top:2px;display:inline-block;background:#34e4a8;color:#07231a;font-weight:700;font-size:14px;text-decoration:none;padding:11px 18px;border-radius:12px}',
    '.sl-iw-foot{border-top:1px solid #eef2f7;padding:10px;display:flex;gap:8px;background:#fff}',
    '.sl-iw-foot input{flex:1;border:1px solid #e2e8f0;border-radius:12px;padding:11px 14px;font-size:14px;outline:none}',
    '.sl-iw-foot input:focus{border-color:#5b8cff}',
    '.sl-iw-send{border:none;background:#0f172a;color:#fff;border-radius:12px;padding:0 16px;font-size:15px;cursor:pointer}',
    // Vangnet: valt de assistent uit, dan komt hier een gewoon formulier te staan.
    '.sl-iw-fb{align-self:stretch;background:#fff;border:1px solid #e2e8f0;border-left:3px solid #f59e0b;border-radius:14px;padding:14px;font-size:14px;color:#0f172a}',
    '.sl-iw-fb h4{margin:0 0 6px;font-size:14px;font-weight:700}',
    '.sl-iw-fb p{margin:0 0 10px;font-size:13px;line-height:1.5;color:#475569}',
    '.sl-iw-fb input,.sl-iw-fb textarea{width:100%;box-sizing:border-box;border:1px solid #e2e8f0;border-radius:10px;padding:9px 12px;font:inherit;font-size:14px;margin-bottom:8px;outline:none}',
    '.sl-iw-fb input:focus,.sl-iw-fb textarea:focus{border-color:#5b8cff}',
    '.sl-iw-fb textarea{min-height:70px;resize:vertical}',
    '.sl-iw-fb button{width:100%;border:none;background:#3a6cf2;color:#fff;font:inherit;font-weight:700;font-size:15px;padding:11px;border-radius:10px;cursor:pointer}',
    '.sl-iw-fb .alt{margin:10px 0 0;font-size:12px;color:#64748b}',
    '.sl-iw-fb .alt a{color:#3a6cf2}',
    '.sl-iw-hp{position:absolute;left:-9999px}',
    '@media(max-width:480px){.sl-iw-panel{right:0;bottom:0;width:100vw;height:100dvh;max-height:100dvh;border-radius:0}}'
  ].join('');
  document.head.appendChild(css);

  var launcher = document.createElement('button');
  launcher.className = 'sl-iw-btn';
  launcher.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.4A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Praat met Selectly';
  document.body.appendChild(launcher);

  var panel = document.createElement('div');
  panel.className = 'sl-iw-panel';
  panel.innerHTML =
    '<div class="sl-iw-head"><div><div class="t">Selectly-assistent</div><div class="s"><span class="sl-iw-dot"></span>AI-assistent — antwoordt meteen</div></div><button class="sl-iw-x" aria-label="Sluiten">×</button></div>' +
    '<div class="sl-iw-body" role="log" aria-live="polite"></div>' +
    '<div class="sl-iw-foot"><input type="text" placeholder="Typ uw antwoord…" autocomplete="off"><button class="sl-iw-send">→</button></div>';
  document.body.appendChild(panel);

  var body = panel.querySelector('.sl-iw-body');
  var input = panel.querySelector('.sl-iw-foot input');
  var sendBtn = panel.querySelector('.sl-iw-send');
  var opened = false;

  function addMsg(role, text) {
    var d = document.createElement('div');
    d.className = 'sl-iw-msg ' + (role === 'user' ? 'sl-iw-u' : 'sl-iw-a');
    if (role === 'user') {
      d.textContent = text;
    } else {
      // Https-links klikbaar maken. Elk stuk gaat via textContent/createTextNode,
      // dus wat het model teruggeeft kan nooit als HTML uitgevoerd worden.
      var re = /https:\/\/[^\s<>"')]+/g, m, i = 0;
      while ((m = re.exec(text)) !== null) {
        d.appendChild(document.createTextNode(text.slice(i, m.index)));
        var a = document.createElement('a');
        a.href = m[0]; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.style.cssText = 'color:#3a6cf2;text-decoration:underline;word-break:break-all';
        a.textContent = m[0].indexOf('leadconnectorhq') > -1 ? 'een moment prikken' : m[0];
        d.appendChild(a);
        i = m.index + m[0].length;
      }
      d.appendChild(document.createTextNode(text.slice(i)));
    }
    body.appendChild(d); body.scrollTop = body.scrollHeight; return d;
  }
  function addBooking() {
    if (!booking || body.querySelector('.sl-iw-book')) return;
    var a = document.createElement('a'); a.className = 'sl-iw-book'; a.href = booking; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = 'Kies een moment voor uw demo →'; body.appendChild(a); body.scrollTop = body.scrollHeight;
  }
  function typing(on) {
    var t = body.querySelector('.sl-iw-typing');
    if (on && !t) { t = document.createElement('div'); t.className = 'sl-iw-typing'; t.textContent = 'aan het typen…'; body.appendChild(t); body.scrollTop = body.scrollHeight; }
    if (!on && t) t.remove();
  }

  function open() {
    opened = true;
    launcher.style.display = 'none'; panel.style.display = 'flex';
    if (!body.children.length) addMsg('assistant', GREET);
    input.focus();
  }
  function close() { opened = false; panel.style.display = 'none'; launcher.style.display = 'flex'; }
  launcher.addEventListener('click', open);
  panel.querySelector('.sl-iw-x').addEventListener('click', close);

  // ── Vangnet ───────────────────────────────────────────────────────────────
  // Twee keer na elkaar geen antwoord van de functie = de assistent doet niet
  // meer alsof hij werkt. Anders typt de bezoeker zijn naam en e-mail in een
  // gesprek dat nergens toekomt (het leadlek van augustus, in een nieuwe vorm).
  // Het formulier hieronder is een gewone Netlify-Forms-post: die hangt NIET
  // aan /.netlify/functions/intake vast en werkt dus ook als alle functies
  // plat liggen. Het gebruikt het formulier "contact", dat al in index.html
  // geregistreerd staat — een naam die Netlify niet kent, wordt geweigerd.
  var mislukt = 0, vangnetAan = false;

  function transcriptTekst() {
    return apiMessages
      .map(function (m) { return (m.role === 'user' ? 'Bezoeker: ' : 'Selectly: ') + m.content; })
      .join('\n\n').slice(0, 1500);
  }

  function toonVangnet() {
    if (vangnetAan) return;
    vangnetAan = true;
    panel.querySelector('.sl-iw-foot').style.display = 'none';

    addMsg('assistant', 'Mijn verbinding met het systeem ligt eruit — ik kan uw antwoorden nu niet verwerken. Laat hieronder uw gegevens achter, dan komt uw vraag wél binnen en belt of mailt iemand van het team u terug.');

    var f = document.createElement('form');
    f.className = 'sl-iw-fb';
    f.setAttribute('name', 'contact');
    f.setAttribute('method', 'POST');
    f.setAttribute('action', '/bedankt.html');
    f.setAttribute('data-netlify', 'true');
    f.setAttribute('netlify-honeypot', 'bot-field');
    f.innerHTML =
      '<h4>Uw gegevens, zonder de assistent</h4>' +
      '<p>Dit formulier gaat rechtstreeks naar het team — niet via de assistent.</p>' +
      '<input type="hidden" name="form-name" value="contact">' +
      '<input type="hidden" name="lead_source" value="chatwidget-vangnet">' +
      '<input type="hidden" name="page_url">' +
      '<input type="hidden" name="submitted_at">' +
      '<p class="sl-iw-hp" aria-hidden="true"><label>Niet invullen: <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>' +
      '<input type="text" name="naam" placeholder="Uw naam *" required autocomplete="name">' +
      '<input type="text" name="bedrijf" placeholder="Bedrijf" autocomplete="organization">' +
      '<input type="email" name="email" placeholder="E-mailadres *" required autocomplete="email">' +
      '<input type="tel" name="telefoon" placeholder="Telefoon (optioneel)" autocomplete="tel">' +
      '<textarea name="bericht" placeholder="Waarover gaat het?"></textarea>' +
      '<button type="submit">Versturen</button>' +
      '<p class="alt">Liever mailen? <a href="mailto:info@selectly.be">info@selectly.be</a> — of gebruik het <a href="/#contact">contactformulier</a>.</p>';

    // Waarden apart zetten: zo kan niets uit het gesprek als HTML belanden.
    f.querySelector('[name="page_url"]').value = location.href;
    f.querySelector('[name="submitted_at"]').value = new Date().toISOString();
    var t = transcriptTekst();
    if (t) f.querySelector('[name="bericht"]').value = 'Gesprek met de assistent (afgebroken door een storing):\n\n' + t;

    body.appendChild(f);
    body.scrollTop = body.scrollHeight;
    var eerste = f.querySelector('[name="naam"]');
    if (eerste) eerste.focus();
  }

  var bezig = false;
  function blokkeer(aan) {
    bezig = aan;
    input.disabled = aan;
    sendBtn.disabled = aan;
    sendBtn.style.opacity = aan ? '.5' : '';
  }

  async function send() {
    if (bezig || vangnetAan) return;
    var val = input.value.trim(); if (!val) return;
    input.value = ''; addMsg('user', val);
    apiMessages.push({ role: 'user', content: val });
    typing(true); blokkeer(true);
    try {
      var r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: apiMessages, pushed: pushed, gemeld: gemeld }) });
      // Een 502 geeft ook een respons terug. Zonder deze controle leest de
      // widget een foutpagina als "antwoord" en doet hij alsof alles werkt.
      if (!r.ok) throw new Error('HTTP ' + r.status);
      var j = await r.json();
      if (!j || !j.reply) throw new Error('leeg antwoord');
      typing(false);
      mislukt = 0;
      var reply = j.reply;
      addMsg('assistant', reply);
      apiMessages.push({ role: 'assistant', content: reply });
      if (j.booking) { booking = j.booking; }
      if (j.pushed) pushed = true;
      if (j.gemeld) gemeld = true;
      if (j.data && j.data.klaar_voor_demo) addBooking();
      // De bot noemt de boekingslink soms een beurt vóór klaar_voor_demo true wordt.
      // Dan hoort de knop er al te staan, niet pas achteraf.
      if (booking && reply && reply.indexOf('leadconnectorhq') > -1) addBooking();
      if (j.modus === 'bericht' && booking) addBooking();
    } catch (e) {
      typing(false);
      mislukt += 1;
      console.error('[selectly-intake] aanroep mislukt (' + mislukt + '):', (e && e.message) || e);
      if (mislukt >= 2) {
        // Niet meer om naam en e-mail vragen: dat antwoord zou via net dezelfde
        // kapotte aanroep moeten passeren en verdwijnt dan zonder een spoor.
        toonVangnet();
      } else {
        addMsg('assistant', 'Er ging iets mis bij het versturen van uw bericht — het is niet bij mij geraakt. Stuur het gerust nog eens; lukt het dan nog niet, dan geef ik u een andere manier om ons te bereiken.');
      }
    } finally {
      typing(false);
      if (!vangnetAan) { blokkeer(false); input.focus(); }
    }
  }
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
})();
