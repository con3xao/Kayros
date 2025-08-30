const { ativarAntilink, desativarAntilink } = require("../../features/antiLink");

async function commandAntilink(sock, msg, args) {
  const { remoteJid: chatId, participant } = msg.key;

  if (!chatId.endsWith("@g.us")) {
    await sock.sendMessage(chatId, { text: "❌ Este comando só pode ser usado em grupos." });
    return;
  }


  const groupMetadata = await sock.groupMetadata(chatId);
  const admins = groupMetadata.participants
    .filter(p => p.admin !== null)  
    .map(p => p.id);


  if (!admins.includes(participant)) {
    await sock.sendMessage(chatId, { text: "❌ Somente admins podem usar este comando." });
    return;
  }

  const acao = args[0];

  if (acao === "on") {
    ativarAntilink(chatId);
    await sock.sendMessage(chatId, { text: "✅ Anti-link foi *ativado*!" });
  } else if (acao === "off") {
    desativarAntilink(chatId);
    await sock.sendMessage(chatId, { text: "❌ Anti-link foi *desativado*!" });
  } else {
    await sock.sendMessage(chatId, { text: "❓ Use:\n!antilink on\n!antilink off" });
  }
}

module.exports = { commandAntilink };