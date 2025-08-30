const { salvarStatusRPG, estaRPGAtivado } = require('../../utils/rpgStatus');

async function commandRpgControl(sock, msg, args, enviarMensagem, isGroup, isGroupAdmins, isOwner) {
  console.log("rpgControl - isGroup:", isGroup);
  console.log("rpgControl - isGroupAdmins:", isGroupAdmins);
  console.log("rpgControl - isOwner:", isOwner);

  const acao = args[0]?.toLowerCase();

  // Apenas admins do grupo ou dono do bot podem alterar status
  if (acao === "on" || acao === "off") {
    if (!isOwner && (!isGroup || !isGroupAdmins)) {
      await enviarMensagem("🚫 Apenas administradores do grupo ou o dono do bot podem alterar o status do RPG.");
      return;
    }
  }

  if (acao === "on") {
    salvarStatusRPG(true);
    await enviarMensagem("✅ O RPG foi *ativado* com sucesso.");
  } else if (acao === "off") {
    salvarStatusRPG(false);
    await enviarMensagem("❌ O RPG foi *desativado* com sucesso.");
  } else {
    const status = estaRPGAtivado();
    await enviarMensagem(`ℹ️ O RPG está atualmente: *${status ? "Ativado ✅" : "Desativado ❌"}*`);
  }
}

module.exports = { commandRpgControl };