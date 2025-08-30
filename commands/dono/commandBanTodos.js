
async function commandBanTodos(sock, messageDetails, enviarMensagem) {
  const grupoID = messageDetails.key.remoteJid;

  try {
    const metadata = await sock.groupMetadata(grupoID);
    const participantes = metadata.participants;
    const donoGrupo = metadata.owner || participantes[0]?.id;
    const idBot = sock.user?.id?.split(":")[0] + "@s.whatsapp.net";

    const listaParaRemover = participantes
      .map(p => p.id)
      .filter(jid => jid !== idBot && jid !== donoGrupo);

    if (listaParaRemover.length === 0) {
      await enviarMensagem("❌ Nenhum membro pode ser removido (todos são admins).");
      return;
    }

    for (const jid of listaParaRemover) {
      await sock.groupParticipantsUpdate(grupoID, [jid], "remove");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await enviarMensagem("🚨 Todos os membros foram removidos.");
  } catch (err) {
    console.error("Erro ao banir todos:", err);
    await enviarMensagem("❌ Erro ao remover os membros. O bot precisa ser admin.");
  }
}

module.exports = { commandBanTodos };