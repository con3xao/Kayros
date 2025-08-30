const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "data", "antiPalavraSettings.json");

const palavrasProibidasGlobais = ["droga", "caramba", "merda", "bosta", "puta", "desgraça", "cacete", "#", "porra", "Pqp"];

async function verificaAntiPalavra(sock, msg) {
  try {
    const grupoId = msg.key.remoteJid;
    if (!grupoId.endsWith("@g.us")) return;

    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const grupoConfig = config[grupoId];
    if (!grupoConfig || !grupoConfig.enabled) return;

    const textoMensagem =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption;

    if (!textoMensagem) return;

    const palavrasProibidas = grupoConfig.palavras || palavrasProibidasGlobais;

    const encontrou = palavrasProibidas.some((palavra) =>
      textoMensagem.toLowerCase().includes(palavra)
    );

    if (encontrou) {
      
      await sock.sendMessage(grupoId, {
        delete: {
          remoteJid: grupoId,
          fromMe: false,
          id: msg.key.id,
          participant: msg.key.participant || msg.key.remoteJid
        }
      });

      await sock.sendMessage(grupoId, {
        text: "🚫 Mensagem removida por conter palavras proibidas.",
      });
    }
  } catch (error) {
    console.error("Erro no filtro de palavrões:", error);
  }
}

module.exports = {
  verificaAntiPalavra
};