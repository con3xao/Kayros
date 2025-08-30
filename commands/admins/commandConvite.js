async function commandConvite(sock, messageDetails, args, isGroup, isAdmin, isBotAdmin, enviarMensagem) {
  const grupoId = messageDetails.key.remoteJid;

  if (!isGroup) return await enviarMensagem("❌ Esse comando só pode ser usado em grupos.");
  if (!isAdmin) return await enviarMensagem("❌ Apenas admins podem gerar o link do grupo.");
  if (!isBotAdmin) return await enviarMensagem("❌ Eu preciso ser admin para gerar o link do grupo.");

  if (!args[0]) return await enviarMensagem("❌ Envie o número no formato:\n!convite 553199999999");

  const numero = args[0].replace(/\D/g, "");
  if (numero.length < 10) return await enviarMensagem("❌ Número inválido.");

  const jid = `${numero}@s.whatsapp.net`;

  try {
    const code = await sock.groupInviteCode(grupoId);
    const link = `https://chat.whatsapp.com/${code}`;
    const nomeGrupo = await sock.groupMetadata(grupoId).then(meta => meta.subject);

    const mensagem = `👋 Olá! Você foi convidado para entrar no grupo *${nomeGrupo}*.\n\nClique aqui para entrar:\n${link}`;

    await sock.sendMessage(jid, { text: mensagem });

    await enviarMensagem(`✅ Link de convite enviado para @${numero}`, [jid]);
  } catch (err) {
    console.error("❌ Erro ao enviar link:", err);
    await enviarMensagem("❌ Não foi possível enviar o convite. Verifique se o número está no WhatsApp.");
  }
}

module.exports = { commandConvite };