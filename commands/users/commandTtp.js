let API_KEY = "ZR21TPIONfHX16wtefJt";
try {
  const { SPIDERX_API_KEY } = require("../../settings");
  if (SPIDERX_API_KEY) API_KEY = SPIDERX_API_KEY;
} catch {}

function extrairTexto(messageDetails) {
  const q = messageDetails?.quoted;
  const quotedText =
    q?.extendedTextMessage?.text ||
    q?.conversation ||
    q?.message?.conversation ||
    q?.imageMessage?.caption ||
    q?.videoMessage?.caption ||
    "";

  if (quotedText && quotedText.trim()) {
    return quotedText.trim().split("\n")[0];
  }

  const body =
    messageDetails?.body ||
    messageDetails?.message?.conversation ||
    messageDetails?.message?.extendedTextMessage?.text ||
    messageDetails?.text ||
    "";

  if (!body) return "";

  const parts = body.trim().split(/\s+/);
  parts.shift(); 
  const rest = parts.join(" ").trim();

  return (rest || "").split("\n")[0];
}

async function commandTtp(sock, messageDetails, enviarMensagem, textoArg) {
  try {
    const text = (textoArg && textoArg.trim()) || extrairTexto(messageDetails);

    if (!text) {
      await enviarMensagem("❌ Use assim: ttp seu_texto\nEx.: ttp Kayros Bot");
      return;
    }

    const url =
      "https://api.spiderx.com.br/api/stickers/ttp" +
      `?text=${encodeURIComponent(text)}&api_key=${encodeURIComponent(API_KEY)}`;

    const res = await fetch(url);
    if (!res.ok) {
      await enviarMensagem(`❌ Erro na API TTP (${res.status} ${res.statusText}).`);
      return;
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    await sock.sendMessage(
      messageDetails.key.remoteJid,
      { sticker: buffer }, 
      { quoted: messageDetails }
    );
  } catch (e) {
    console.error("Erro em commandTtp:", e);
    await enviarMensagem("❌ Erro ao gerar figurinha TTP.");
  }
}

module.exports = commandTtp;
module.exports.commandTtp = commandTtp;