
exports.commandGrupo = async (sock, msg, args, isGroup, isAdmin, isBotAdmin, enviarMensagem) => {
  if (!isGroup) {
    await enviarMensagem("❌ Esse comando só pode ser usado em grupos.");
    return;
  }

  if (!isAdmin) {
    await enviarMensagem("❌ Você precisa ser admin do grupo para usar esse comando.");
    return;
  }

  if (!isBotAdmin) {
    await enviarMensagem("❌ Eu preciso ser admin para alterar as configurações do grupo.");
    return;
  }

  const acao = args[0]?.toLowerCase();

  if (acao === "f") {
    await sock.groupSettingUpdate(msg.key.remoteJid, "announcement"); 
    await enviarMensagem("🔒 Grupo fechado! Apenas administradores podem enviar mensagens.");
  } else if (acao === "a") {
    await sock.groupSettingUpdate(msg.key.remoteJid, "not_announcement"); 
    await enviarMensagem("🔓 Grupo aberto! Todos os membros podem enviar mensagens.");
  } else {
    await enviarMensagem("❌ Comando inválido. Use:\n*!grupo a* para abrir\n*!grupo f* para fechar");
  }
};