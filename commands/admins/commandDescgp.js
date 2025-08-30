
exports.commandDescGp = async (sock, msg, args, isGroup, isAdmin, isBotAdmin, enviarMensagem) => {
  if (!isGroup) {
    await enviarMensagem("❌ Esse comando só pode ser usado dentro de um grupo.");
    return;
  }

  if (!isAdmin) {
    await enviarMensagem("❌ Você precisa ser admin para usar esse comando.");
    return;
  }

  if (!isBotAdmin) {
    await enviarMensagem("❌ Eu preciso ser admin para alterar a descrição do grupo.");
    return;
  }

  const novaDescricao = args.join(" ").trim();

  if (!novaDescricao) {
    await enviarMensagem("❌ Você precisa escrever a nova descrição do grupo após o comando.");
    return;
  }

  try {
    await sock.groupUpdateDescription(msg.key.remoteJid, novaDescricao);
    await enviarMensagem("✅ Descrição do grupo atualizada com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar descrição:", error);
    await enviarMensagem("❌ Ocorreu um erro ao alterar a descrição do grupo.");
  }
};