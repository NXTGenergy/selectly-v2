/* Stielkenner — chat-assistent voor de bezoeker.
 * Zelf-injecterend, geen afhankelijkheden. Praat met /.netlify/functions/vakman
 * en stuurt door naar de juiste aanvraagpagina zodra de categorie duidelijk is. */
(function () {
  if (window.__stielkennerChat) return;
  window.__stielkennerChat = true;

  var API = '/.netlify/functions/vakman';
  var GREET = 'Dag! Ik help je de juiste vakman vinden.\n\nWaarvoor zoek je iemand — zonnepanelen, een thuisbatterij, een warmtepomp, airco of dakwerken? Of vertel gewoon wat er moet gebeuren.';

  var INK = '#1d2b2a', AMBER = '#e0a33e', CREME = '#f2efe6';
  var berichten = [];   // wat naar de backend gaat, begint bij de gebruiker
  var bezig = false;

  var css = document.createElement('style');
  css.textContent = [
    '.sk-btn{position:fixed;right:20px;bottom:20px;z-index:99998;display:flex;align-items:center;gap:9px;padding:12px 18px;border:none;border-radius:999px;background:' + INK + ';color:' + CREME + ';font:600 15px/1 -apple-system,Segoe UI,Roboto,sans-serif;cursor:pointer;box-shadow:0 10px 30px -8px rgba(29,43,42,.6);transition:transform .15s}',
    '.sk-btn:hover{transform:translateY(-2px)}',
    '.sk-btn svg{width:19px;height:19px;flex:none}',
    'body.sl-consent-open .sk-btn{bottom:150px}',
    'body.sl-consent-open .sk-panel{bottom:150px}',
    '.sk-panel{position:fixed;right:20px;bottom:20px;z-index:99999;width:376px;max-width:calc(100vw - 24px);height:544px;max-height:calc(100vh - 40px);background:#fff;border-radius:18px;box-shadow:0 22px 60px -14px rgba(29,43,42,.4);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,Segoe UI,Roboto,sans-serif}',
    '.sk-head{background:' + INK + ';color:' + CREME + ';padding:15px 17px;display:flex;align-items:center;gap:11px}',
    '.sk-head .t{font-weight:700;font-size:15px;line-height:1.2}',
    '.sk-head .s{font-size:12px;opacity:.8;display:flex;align-items:center;gap:6px;margin-top:2px}',
    '.sk-dot{width:7px;height:7px;border-radius:50%;background:' + AMBER + ';display:inline-block}',
    '.sk-x{margin-left:auto;background:none;border:none;color:' + CREME + ';font-size:21px;cursor:pointer;opacity:.8;line-height:1;padding:0 2px}',
    '.sk-body{flex:1;overflow-y:auto;padding:15px;background:#f4f6f4;display:flex;flex-direction:column;gap:9px}',
    '.sk-msg{max-width:84%;padding:10px 13px;border-radius:13px;font-size:14px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word}',
    '.sk-a{align-self:flex-start;background:#fff;color:#191d1d;border-bottom-left-radius:4px;box-shadow:0 1px 2px rgba(25,29,29,.07)}',
    '.sk-u{align-self:flex-end;background:' + INK + ';color:' + CREME + ';border-bottom-right-radius:4px}',
    '.sk-typing{align-self:flex-start;color:#7d8785;font-size:13px;padding:3px 5px}',
    '.sk-go{align-self:flex-start;margin-top:1px;display:inline-block;background:' + AMBER + ';color:#2a1c05;font-weight:700;font-size:14px;text-decoration:none;padding:11px 17px;border-radius:11px}',
    '.sk-foot{border-top:1px solid #e4e8e6;padding:10px;display:flex;gap:8px;background:#fff}',
    '.sk-foot input{flex:1;border:1px solid #d3d9d6;border-radius:11px;padding:11px 13px;font-size:14px;outline:none;font-family:inherit;color:#191d1d}',
    '.sk-foot input:focus{border-color:' + INK + '}',
    '.sk-send{border:none;background:' + INK + ';color:' + CREME + ';border-radius:11px;padding:0 15px;font-size:16px;cursor:pointer}',
    '.sk-send:disabled{opacity:.4;cursor:default}',
    '@media(max-width:480px){.sk-panel{right:0;bottom:0;width:100vw;height:100dvh;max-height:100dvh;border-radius:0}}'
  ].join('');
  document.head.appendChild(css);

  var launcher = document.createElement('button');
  launcher.className = 'sk-btn';
  launcher.setAttribute('aria-label', 'Chat openen');
  launcher.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.4A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" stroke="' + CREME + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    'Vraag het ons';
  document.body.appendChild(launcher);

  var panel = document.createElement('div');
  panel.className = 'sk-panel';
  panel.innerHTML =
    '<div class="sk-head">' +
      '<svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true" style="flex:none">' +
        '<rect width="40" height="40" rx="9" fill="' + CREME + '"/>' +
        '<path d="M11 21 L17.5 27.5" stroke="' + AMBER + '" stroke-width="4.5" stroke-linecap="round" fill="none"/>' +
        '<path d="M17.5 27.5 L30 12" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round" fill="none"/>' +
        '<circle cx="17.5" cy="27.5" r="1.7" fill="' + CREME + '"/>' +
      '</svg>' +
      '<div><div class="t">Stielkenner</div><div class="s"><span class="sk-dot"></span>Antwoordt meteen</div></div>' +
      '<button class="sk-x" aria-label="Sluiten">&times;</button>' +
    '</div>' +
    '<div class="sk-body" role="log" aria-live="polite"></div>' +
    '<div class="sk-foot"><input type="text" placeholder="Typ je vraag…" autocomplete="off" aria-label="Je bericht"><button class="sk-send" aria-label="Versturen">&rarr;</button></div>';
  document.body.appendChild(panel);

  var body = panel.querySelector('.sk-body');
  var input = panel.querySelector('.sk-foot input');
  var sendBtn = panel.querySelector('.sk-send');
  var geopend = false;

  function toon(rol, tekst) {
    var d = document.createElement('div');
    d.className = 'sk-msg ' + (rol === 'user' ? 'sk-u' : 'sk-a');
    d.textContent = tekst;   // altijd als tekst, nooit als html
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
    return d;
  }

  function toonKnop(url) {
    var a = document.createElement('a');
    a.className = 'sk-go';
    a.href = url;
    a.textContent = 'Start je aanvraag →';
    body.appendChild(a);
    body.scrollTop = body.scrollHeight;
  }

  function open() {
    panel.style.display = 'flex';
    launcher.style.display = 'none';
    if (!geopend) {
      geopend = true;
      toon('assistant', GREET);
    }
    input.focus();
  }

  function sluit() {
    panel.style.display = 'none';
    launcher.style.display = 'flex';
  }

  async function stuur() {
    var tekst = input.value.trim();
    if (!tekst || bezig) return;
    input.value = '';
    toon('user', tekst);
    berichten.push({ role: 'user', content: tekst });

    bezig = true;
    sendBtn.disabled = true;
    var wacht = document.createElement('div');
    wacht.className = 'sk-typing';
    wacht.textContent = 'aan het typen…';
    body.appendChild(wacht);
    body.scrollTop = body.scrollHeight;

    try {
      var r = await fetch(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: berichten }),
      });
      var data = await r.json();
      wacht.remove();
      var antwoord = (data && data.reply) || 'Daar ging iets mis. Probeer het nog eens.';
      toon('assistant', antwoord);
      berichten.push({ role: 'assistant', content: antwoord });
      if (data && data.funnel) toonKnop(data.funnel);
    } catch (e) {
      wacht.remove();
      toon('assistant', 'Ik krijg even geen verbinding. Probeer het nog eens, of kies je categorie op de startpagina.');
    } finally {
      bezig = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  launcher.addEventListener('click', open);
  panel.querySelector('.sk-x').addEventListener('click', sluit);
  sendBtn.addEventListener('click', stuur);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); stuur(); }
  });
})();
