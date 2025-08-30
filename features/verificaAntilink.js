const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "data", "antiLinkSettings.json");

function carregarConfiguracoes() {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(configPath));
}

async function verificaAntilink(sock, message) {
  const chatId = message?.key?.remoteJid;
  if (!message || !chatId || !chatId.endsWith("@g.us")) return;

  const settings = carregarConfiguracoes();
  if (!settings[chatId]) return; 

  const texto = message.message?.conversation ||
                message.message?.extendedTextMessage?.text || "";
  
  const remetente = message.key.participant;
  if (!remetente) return; // ignora se não tiver remetente válido

  // ✅ Ignorar administradores e o bot
  const groupMetadata = await sock.groupMetadata(chatId);
  const admins = groupMetadata.participants
    .filter(p => p.admin !== null)
    .map(p => p.id);

  const botNumber = sock.user.id;

  if (admins.includes(remetente) || remetente.includes(botNumber)) {
    return; // Ignora admin ou o próprio bot
  }

  const contemLink =
    texto.includes("https://") ||
    texto.includes("http://") ||
    texto.includes("wa.me/") ||
    texto.includes("https://www.") ||
    texto.includes("www.") ||
    texto.includes("@g.us") ||
    texto.includes(".com") ||
    texto.includes("https://Xvideos.com") ||
    texto.includes("chat.whatsapp.com");

  if (contemLink) {
    await sock.sendMessage(chatId, {
      text: `🚫 *Link detectado!* @${remetente.split("@")[0]}, você será removido!`,
      mentions: [remetente]
    });

    await sock.groupParticipantsUpdate(chatId, [remetente], "remove");
  }
}

module.exports = { verificaAntilink };