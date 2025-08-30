const fs = require("fs");

module.exports = async function commandAdv(sock, messageDetails) {
  try {
    if (!messageDetails || !messageDetails.key || !messageDetails.key.remoteJid) {
      console.error("❌ messageDetails ou remoteJid não definido");
      return;
    }

    const remoteJid = messageDetails.key.remoteJid;
    const sender = messageDetails.key.participant || remoteJid;

    const seuJid = "5531996175431@s.whatsapp.net";

    const botJid = sock.user?.id?.split(":")[0] + "@s.whatsapp.net";

    const isGroup = remoteJid.endsWith("@g.us");
    if (!isGroup) {
      await sock.sendMessage(remoteJid, { text: "❌ Esse comando só pode ser usado em grupos." });
      return;
    }

    const groupMetadata = await sock.groupMetadata(remoteJid);
    const isAdmin = groupMetadata.participants
      .filter(p => p.admin)
      .some(p => p.id === sender);

    if (!isAdmin) {
      await sock.sendMessage(remoteJid, { text: "❌ Apenas administradores podem usar esse comando." });
      return;
    }

    let targetJid = messageDetails.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!targetJid) {
      targetJid = messageDetails.message?.extendedTextMessage?.contextInfo?.participant;
    }

    if (!targetJid) {
      await sock.sendMessage(remoteJid, { text: "❌ Você precisa mencionar ou responder a mensagem de quem deseja advertir." });
      return;
    }

    if (targetJid === sender) {
      await sock.sendMessage(remoteJid, { text: "❌ Você não pode se auto-advertir." });
      return;
    }

    if (targetJid === seuJid) {
      await sock.sendMessage(remoteJid, { text: "❌ Você não pode dar advertência para esse usuário." });
      return;
    }


    if (targetJid === botJid) {
      await sock.sendMessage(remoteJid, { text: "❌ Você não pode me dar advertência." });
      return;
    }

    const advFile = "./data/advertencias.json";
    let advs = {};

    if (fs.existsSync(advFile)) {
      advs = JSON.parse(fs.readFileSync(advFile));
    }

    if (!advs[remoteJid]) advs[remoteJid] = {};
    if (!advs[remoteJid][targetJid]) advs[remoteJid][targetJid] = 0;

    advs[remoteJid][targetJid] += 1;
    fs.writeFileSync(advFile, JSON.stringify(advs, null, 2));

    await sock.sendMessage(remoteJid, {
      text: `⚠️ O usuário @${targetJid.split("@")[0]} recebeu uma advertência. Total: ${advs[remoteJid][targetJid]}`,
      mentions: [targetJid]
    });

    if (advs[remoteJid][targetJid] >= 3) {
      await sock.sendMessage(remoteJid, {
        text: `⛔ O usuário @${targetJid.split("@")[0]} foi removido por atingir 3 advertências.`,
        mentions: [targetJid]
      });
      await sock.groupParticipantsUpdate(remoteJid, [targetJid], "remove");
      advs[remoteJid][targetJid] = 0;
      fs.writeFileSync(advFile, JSON.stringify(advs, null, 2));
    }
  } catch (err) {
    console.error("Erro no comando !adv:", err);
  }
};