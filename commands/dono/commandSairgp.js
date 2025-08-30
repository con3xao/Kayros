const { ownerNumber } = require("../../settings.json");

exports.commandSairGp = async (sock, msg, args, enviarMensagem) => {
  const sender = msg.key.remoteJid;
  const remetente = msg.key.participant || sender;
  const numeroLimpo = remetente.replace(/\D/g, ""); // Remove símbolos do número

  // Suporte a múltiplos donos
  if (!ownerNumber.includes(numeroLimpo)) {
    await enviarMensagem("❌ Apenas o dono pode usar esse comando.");
    return;
  }

  const groupId = args[0];
  if (!groupId || !groupId.endsWith("@g.us")) {
    await enviarMensagem("❌ Use o comando assim:\n!sairgp [ID do grupo]");
    return;
  }

  try {
    await sock.groupLeave(groupId);
    await enviarMensagem("✅ Sai do grupo com sucesso.");
  } catch (e) {
    console.error("Erro ao sair do grupo:", e);
    await enviarMensagem("❌ Erro ao tentar sair do grupo.");
  }
};