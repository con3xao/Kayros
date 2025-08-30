const { ownerNumber } = require("../../settings.json");

exports.commandRevogarLinkGp = async (sock, msg, enviarMensagem) => {
  const remetente = msg.key.participant || msg.key.remoteJid;
  const numeroLimpo = remetente.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (!ownerNumber.includes(numeroLimpo)) {
    await enviarMensagem("❌ Apenas o dono pode usar esse comando.");
    return;
  }

  try {
    const grupos = await sock.groupFetchAllParticipating();

    for (const id of Object.keys(grupos)) {
      try {
        await sock.groupRevokeInvite(id);
      } catch (err) {
        console.warn(`⚠️ Não consegui revogar o link do grupo: ${id}`);
      }
    }

    await enviarMensagem("🔄 Todos os links dos grupos foram revogados com sucesso.");
  } catch (error) {
    console.error("Erro ao revogar links:", error);
    await enviarMensagem("❌ Ocorreu um erro ao revogar os links.");
  }
};