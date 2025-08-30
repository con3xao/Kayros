const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "..", "..", "data", "antiPalavraSettings.json");

const mensagensExecutadas = new Set();

function readSettings() {
  if (!fs.existsSync(filePath)) return {};
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function writeSettings(settings) {
  fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
}

async function commandAntiPalavra(sock, messageDetails) {
  if (!messageDetails || !messageDetails.key) {
    return;
  }

  const from = messageDetails.key.remoteJid;
  const participant = messageDetails.key.participant || messageDetails.participant || from;
  const mensagemID = messageDetails.key.id;


  if (mensagensExecutadas.has(mensagemID)) return;
  mensagensExecutadas.add(mensagemID);
  setTimeout(() => mensagensExecutadas.delete(mensagemID), 10000);

  const messageText =
    messageDetails.message?.conversation ||
    messageDetails.message?.extendedTextMessage?.text ||
    "";

  if (!messageText || !from) return;

  const settings = readSettings();
  if (!settings[from]) settings[from] = { enabled: false };

  const isActivating = messageText.toLowerCase().includes("on");
  const isDeactivating = messageText.toLowerCase().includes("off");

  if (isActivating) {
    settings[from].enabled = true;
    writeSettings(settings);
    await sock.sendMessage(from, {
      text: "✅ Ativei o filtro de palavrões neste grupo.",
    });
  } else if (isDeactivating) {
    settings[from].enabled = false;
    writeSettings(settings);
    await sock.sendMessage(from, {
      text: "❌ Filtro de palavrões *desativado* neste grupo.",
    });
  } else {
    await sock.sendMessage(from, {
      text: "❓ Use:\n!antipalavra on\n!antipalavra off",
    });
  }
}

module.exports = { commandAntiPalavra, readSettings };