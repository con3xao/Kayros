
exports.commandLinkGp = async (sock, msg, isGroup, isAdmin, isBotAdmin, enviarMensagem) => {
  if (!isGroup) {
    await enviarMensagem("❌ Esse comando só pode ser usado dentro de um grupo.");
    return;
  }

  if (!isAdmin) {
    await enviarMensagem("❌ Apenas administradores podem usar esse comando.");
    return;
  }

  if (!isBotAdmin) {
    await enviarMensagem("❌ Eu preciso ser admin para gerar o link do grupo.");
    return;
  }

  try {
    const code = await sock.groupInviteCode(msg.key.remoteJid);
    const link = `https://chat.whatsapp.com/${code}`;
    await enviarMensagem(`🔗 *Link do grupo:*\n${link}`);
  } catch (error) {
    console.error("Erro ao gerar link do grupo:", error);
    await enviarMensagem("❌ Ocorreu um erro ao tentar obter o link do grupo.");
  }
};