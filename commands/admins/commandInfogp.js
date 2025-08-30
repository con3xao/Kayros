
exports.commandInfoGp = async (sock, msg, isGroup, isBotAdmin, enviarMensagem) => {
  if (!isGroup) {
    await enviarMensagem("❌ Esse comando só pode ser usado dentro de um grupo.");
    return;
  }

  try {
    const groupId = msg.key.remoteJid;
    const metadata = await sock.groupMetadata(groupId);

    const nome = metadata.subject;
    const descricao = metadata.desc || "Nenhuma descrição definida.";
    const totalMembros = metadata.participants.length;
    const grupoId = metadata.id;

    let linkGrupo = "❌ Eu não sou admin para gerar o link.";
    if (isBotAdmin) {
      try {
        const code = await sock.groupInviteCode(groupId);
        linkGrupo = `https://chat.whatsapp.com/${code}`;
      } catch {
        linkGrupo = "❌ Erro ao gerar link.";
      }
    }

    const info = `
📣 *Informações do Grupo*

📛 *Nome:* ${nome}
📝 *Descrição:* ${descricao}
👥 *Membros:* ${totalMembros}
🆔 *ID:* ${grupoId}
🔗 *Link:* ${linkGrupo}
    `.trim();

    await enviarMensagem(info);
  } catch (error) {
    console.error("Erro ao obter informações do grupo:", error);
    await enviarMensagem("❌ Ocorreu um erro ao tentar obter as informações do grupo.");
  }
};