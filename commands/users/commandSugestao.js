const { ownerNumber } = require("../../settings.json");

async function commandSugestao(sock, messageDetails, args, enviarMensagem) {
  if (!args.length) {
    await enviarMensagem("💡 Por favor, envie sua sugestão usando:\n!sugestao <sua ideia, melhoria, comando ou imagem>");
    return;
  }

  const sugestaoTexto = args.join(" ");
  const from = messageDetails.key.remoteJid;
  const userName = messageDetails.pushName || "Usuário";
  const senderJid = messageDetails.key.participant || messageDetails.key.remoteJid;

  const isGroup = from.endsWith("@g.us");
  let groupName = "";

  if (isGroup) {
    try {
      const metadata = await sock.groupMetadata(from);
      groupName = metadata.subject || "";
    } catch {
      groupName = "(erro ao obter nome do grupo)";
    }
  }

  const userNumber = senderJid?.split("@")[0] || "desconhecido";
  const groupInfo = isGroup
    ? `👥 Grupo: ${groupName}\n🔗 ID do Grupo: ${from}`
    : "📩 Mensagem privada";

  const texto = `💡 *Nova Sugestão Recebida!*\n\n👤 De: ${userName}\n📱 Número: ${userNumber}\n${groupInfo}\n\n📝 Sugestão:\n${sugestaoTexto}`;

  const ownerJid = ownerNumber + "@s.whatsapp.net";

  await sock.sendMessage(ownerJid, { text: texto });
  await enviarMensagem("✅ Sua sugestão foi enviada com sucesso! Agradecemos sua colaboração 🙌");
}

module.exports = { commandSugestao };