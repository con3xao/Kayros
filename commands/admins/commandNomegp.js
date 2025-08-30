
exports.commandNomeGp = async (sock, msg, args, isGroup, isAdmin, isBotAdmin, enviarMensagem) => {
  if (!isGroup) {
    await enviarMensagem("❌ Esse comando só pode ser usado dentro de um grupo.");
    return;
  }

  if (!isAdmin) {
    await enviarMensagem("❌ Você precisa ser admin do grupo para usar esse comando.");
    return;
  }

  if (!isBotAdmin) {
    await enviarMensagem("❌ O bot precisa ser admin para alterar o nome do grupo.");
    return;
  }

  const novoNome = args.join(" ").trim();

  if (!novoNome) {
    await enviarMensagem("❌ Você precisa digitar o novo nome do grupo após o comando.");
    return;
  }

  try {
    await sock.groupUpdateSubject(msg.key.remoteJid, novoNome);
    await enviarMensagem("✅ Nome do grupo alterado com sucesso!");
  } catch (error) {
    console.error("Erro ao mudar o nome do grupo:", error);
    await enviarMensagem("❌ Ocorreu um erro ao alterar o nome do grupo.");
  }
};