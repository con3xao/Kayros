async function commandAdminControl(sock, msg, args, from, participant, isGroup, isAdmin, isBotAdmin, action) {
  if (!isGroup) {
    await sock.sendMessage(from, { text: "❌ Esse comando só pode ser usado em grupos." }, { quoted: msg });
    return;
  }

  if (!isAdmin) {
    await sock.sendMessage(from, { text: "❌ Apenas admins podem usar este comando." }, { quoted: msg });
    return;
  }

  if (!isBotAdmin) {
    await sock.sendMessage(from, { text: "❌ Eu preciso ser administrador para isso." }, { quoted: msg });
    return;
  }

  let jid;

  if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
    jid = msg.message.extendedTextMessage.contextInfo.participant;

  } else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
    jid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];

  } else if (args[0] && args[0].match(/^\d+$/)) {
    jid = `${args[0]}@s.whatsapp.net`;

  } else {
    await sock.sendMessage(from, {
      text: "❌ Marque alguém, responda uma mensagem ou use o número: `!adm 5571xxxxxxxx`"
    }, { quoted: msg });
    return;
  }

  try {
    if (action === "promover") {
      await sock.groupParticipantsUpdate(from, [jid], "promote");
      await sock.sendMessage(from, {
        text: `✅ @${jid.split("@")[0]} promovido a Adm.`,
        mentions: [jid]
      }, { quoted: msg });

    } else if (action === "rebaixar") {
      await sock.groupParticipantsUpdate(from, [jid], "demote");
      await sock.sendMessage(from, {
        text: `✅ @${jid.split("@")[0]} rebaixado dos Admins.`,
        mentions: [jid]
      }, { quoted: msg });
    }
  } catch (err) {
    console.error("Erro ao modificar admin:", err);
    await sock.sendMessage(from, {
      text: "❌ Erro ao tentar alterar o status de administrador."
    }, { quoted: msg });
  }
}


module.exports = commandAdminControl;