const fs = require("fs");
const path = require("path");
const mutedPath = path.join(__dirname, "..", "..", "data", "mutados.json");

const seuJid = "5531996175431@s.whatsapp.net";

module.exports = {
  name: "mutar",
  comando: ["mutar"],
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;

    if (!from.endsWith("@g.us")) {
      await sock.sendMessage(from, {
        text: "❌ Esse comando só pode ser usado em grupos.",
      });
      return;
    }

    let isAdmin = false;
    try {
      const metadata = await sock.groupMetadata(from);
      const participant = metadata.participants.find(p => p.id === sender);
      isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
    } catch (err) {
      console.error("Erro ao verificar se é admin:", err);
    }

    if (!isAdmin) {
      await sock.sendMessage(from, {
        text: "❌ Você precisa ser ADM para usar esse comando.",
      });
      return;
    }

    let alvo;
    if (msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      alvo = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (msg.message.extendedTextMessage?.contextInfo?.participant) {
      alvo = msg.message.extendedTextMessage.contextInfo.participant;
    } else {
      await sock.sendMessage(from, { text: "❌ Marque ou responda uma mensagem da pessoa que deseja mutar." });
      return;
    }

    if (alvo === sender) {
      await sock.sendMessage(from, { text: "❌ Você não pode mutar a si mesmo." });
      return;
    }

    if (alvo === seuJid) {
      await sock.sendMessage(from, { text: "❌ Você não pode me mutar." });
      return;
    }

    if (!fs.existsSync(mutedPath)) fs.writeFileSync(mutedPath, JSON.stringify({}));
    const mutados = JSON.parse(fs.readFileSync(mutedPath));

    mutados[alvo] = { tentativas: 0 };
    fs.writeFileSync(mutedPath, JSON.stringify(mutados, null, 2));

    await sock.sendMessage(from, {
      text: `🔇 @${alvo.split("@")[0]} foi mutado. Será removido se insistir em mandar mensagens.`,
      mentions: [alvo],
    });
  }
};