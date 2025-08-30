const fs = require("fs");
const path = require("path");

const antifiguPath = path.join(__dirname, "../data/antifigu.json");
if (!fs.existsSync(antifiguPath)) fs.writeFileSync(antifiguPath, "{}");

function carregarAntifigu() {
  return JSON.parse(fs.readFileSync(antifiguPath));
}

function salvarAntifigu(json) {
  fs.writeFileSync(antifiguPath, JSON.stringify(json, null, 2));
}

const infracoes = {};

exports.verificaAntifigu = async (sock, msg) => {
  const { remoteJid: from, participant: sender } = msg.key;
  const antifiguData = carregarAntifigu();

  if (!msg.message || !msg.message.stickerMessage) return;
  if (!from.endsWith("@g.us")) return;
  if (!antifiguData[from]) return;

  const metadata = await sock.groupMetadata(from);
  const isBotAdmin = metadata.participants.some(p => p.id === sock.user.id.split(":")[0] + "@s.whatsapp.net" && p.admin);
  const isGroupAdmins = metadata.participants.some(p => p.id === sender && p.admin);

  if (!isBotAdmin) return;
  if (isGroupAdmins) return;

  try {
    await sock.sendMessage(from, {
      delete: {
        remoteJid: from,
        fromMe: false,
        id: msg.key.id,
        participant: sender,
      }
    });

    infracoes[from] ??= {};
    infracoes[from][sender] = (infracoes[from][sender] || 0) + 1;

    if (infracoes[from][sender] >= 2) {
      // Remove o usuário do grupo após 2 infrações
      await sock.groupParticipantsUpdate(from, [sender], "remove");
      await sock.sendMessage(from, {
        text: `🚫 Usuário removido por enviar figurinha mesmo após aviso.`,
        mentions: [sender]
      });
      infracoes[from][sender] = 0; 
    } else {
      const senderId = sender ? sender.split("@")[0] : "usuário";

await sock.sendMessage(from, {
  text: `⚠️ @${senderId}, figurinhas não são permitidas neste grupo.`,
  mentions: sender ? [sender] : []
});
    }
  } catch (err) {
    console.error("Erro ao aplicar antifigu:", err);
  }
};

exports.carregarAntifigu = carregarAntifigu;
exports.salvarAntifigu = salvarAntifigu;
exports.antifiguPath = antifiguPath;