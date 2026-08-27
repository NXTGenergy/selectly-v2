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

  var bezig = false;
  function blokkeer(aan) {
    bezig = aan;
    input.disabled = aan;
    sendBtn.disabled = aan;
    sendBtn.style.opacity = aan ? '.5' : '';
  }

  async function send() {
    if (bezig) return;
    var val = input.value.trim(); if (!val) return;
    input.value = ''; addMsg('user', val);
    apiMessages.push({ role: 'user', content: val });
    typing(true); blokkeer(true);
    try {
      var r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: apiMessages, pushed: pushed, gemeld: gemeld }) });
      var j = await r.json();
      typing(false);
      var reply = (j && j.reply) || 'Ik noteer het even zelf. Wat is uw naam en e-mailadres?';
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
      addMsg('assistant', 'De verbinding viel even weg — geen probleem, ik noteer het gewoon zelf. Wat is uw naam en e-mailadres of gsm-nummer? Dan neemt iemand van het team vandaag nog contact op.');
    } finally { typing(false); blokkeer(false); input.focus(); }
  }
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
})();
