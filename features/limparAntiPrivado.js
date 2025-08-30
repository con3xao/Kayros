const fs = require("fs");
const path = require("path");
const { ownerNumber } = require("../../settings.json");

const dbPath = path.join(__dirname, "../../data/usuariosAntiPrivado.json");

async function commandLimparAntiPrivado(sock, messageDetails, commandName, enviarMensagem) {
  const sender = messageDetails.key.participant || messageDetails.key.remoteJid;

  if (!sender.includes(ownerNumber)) {
    await enviarMensagem("❌ Apenas o dono do bot pode limpar os registros.");
    return;
  }

  const dbVazio = { avisados: [], bloqueados: [] };
  fs.writeFileSync(dbPath, JSON.stringify(dbVazio, null, 2));

  await enviarMensagem("✅ Registros de *avisados e bloqueados* do antiPrivado foram limpos!");
}

module.exports = { commandLimparAntiPrivado };