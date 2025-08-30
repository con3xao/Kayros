
async function commandAdd(sock, messageDetails, args, enviarMensagem) {
  try {
    const groupId = messageDetails.key.remoteJid;
    let numero;

    if (args.length > 0) {
      numero = args[0].replace(/[^0-9]/g, "");
    } else if (messageDetails.message?.extendedTextMessage?.contextInfo?.participant) {
      numero = messageDetails.message.extendedTextMessage.contextInfo.participant.replace(/[^0-9]/g, "");
    } else {
      await enviarMensagem("❌ Use: *!add <número>* ou responda a mensagem da pessoa.");
      return;
    }

    if (!numero.startsWith("55")) numero = "55" + numero;
    const jid = numero + "@s.whatsapp.net";


    await sock.groupParticipantsUpdate(groupId, [jid], "add").catch(() => null);


    await new Promise(resolve => setTimeout(resolve, 1000));


    const metadata = await sock.groupMetadata(groupId);
    const participanteExiste = metadata.participants.some(p => p.id === jid);

    if (participanteExiste) {

      await enviarMensagem(`✅ Usuário adicionado com sucesso: @${numero}`, { mentions: [jid] });
    } else {

      const code = await sock.groupInviteCode(groupId);
      const inviteLink = `https://chat.whatsapp.com/${code}`;

      try {
        await sock.sendMessage(jid, { text: `🔗 Você foi convidado para entrar no grupo:\n${inviteLink}` });
        await enviarMensagem(`⚠️ Não consegui adicionar @${numero}, enviei o link no PV.`, { mentions: [jid] });
      } catch {
        await enviarMensagem(``);
      }
    }

  } catch (err) {
    console.error("Erro no comando !add:", err);
    await enviarMensagem("❌ Erro ao tentar adicionar o usuário.");
  }
}

module.exports = { commandAdd };