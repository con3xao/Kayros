const { ownerNumber } = require("../../settings.json");

async function commandBug(sock, messageDetails, args, enviarMensagem) {
  if (!args.length) {
    await enviarMensagem("❌ Por favor, descreva o problema usando: !bug <descrição do problema>");
    return;
  }

  const bugMessage = args.join(" ");
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
      groupName = "(erro ao obter nome)";
    }
  }

  const userNumber = senderJid?.split("@")[0] || "desconhecido";
  const groupId = isGroup ? from : "Não está em grupo";
  const groupInfo = isGroup ? `📍 Grupo: ${groupName}\n🔗 ID: ${groupId}` : "📍 Mensagem privada";

  const texto = `🐞 *Relatório de Bug*\n\n👤 De: ${userName}\n📱 Número: ${userNumber}\n${groupInfo}\n\n📝 Problema reportado:\n${bugMessage}`;

  const ownerJid = ownerNumber + "@s.whatsapp.net";

  await sock.sendMessage(ownerJid, { text: texto });
  await enviarMensagem("✅ Obrigado por reportar! Seu relato foi enviado para o meu dono!");
}

module.exports = { commandBug };