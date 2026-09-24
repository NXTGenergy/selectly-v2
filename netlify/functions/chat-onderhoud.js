// Geplande functie (elke 15 min, zie netlify.toml): mailt afgelopen chatgesprekken
// naar info@selectly.be en wist alles ouder dan 90 dagen. Logica in
// netlify/lib/chatonderhoud.js. Handmatig draaien: POST chat-gesprekken?actie=onderhoud
// met het export-token.
const chat = require('../lib/chatopslag');
const { onderhoud } = require('../lib/chatonderhoud');

exports.handler = async (event) => {
  try {
    if (!chat.verbind(event)) console.log('[chat-onderhoud] geen event.blobs — probeer omgeving');
    const uit = await onderhoud();
    console.log('[chat-onderhoud]', JSON.stringify(uit));
    return { statusCode: 200, body: JSON.stringify(uit) };
  } catch (e) {
    console.log('[chat-onderhoud] fout', e && e.message);
    return { statusCode: 500, body: JSON.stringify({ fout: e && e.message }) };
  }
};
