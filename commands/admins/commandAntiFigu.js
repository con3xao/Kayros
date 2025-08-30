const { carregarAntifigu, salvarAntifigu } = require("../../features/verificaAntifigu");

exports.commandAntifig = async (sock, m, args, isGroupAdmins, isBotAdmin) => {
  const from = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;

  if (!from.endsWith("@g.us")) {
    return sock.sendMessage(from, { text: "❌ Este comando só funciona em grupos." });
  }

  if (!isGroupAdmins) {
    return sock.sendMessage(from, {
      text: "❌ Apenas administradores podem ativar ou desativar o antifigu.",
      mentions: [sender],
    });
  }

  if (!isBotAdmin) {
    return sock.sendMessage(from, {
      text: "❌ Eu preciso ser admin para remover figurinhas!",
      mentions: [sender],
    });
  }

  const antifiguData = carregarAntifigu();
  const estado = args[0]?.toLowerCase();

  if (estado === "on") {
    antifiguData[from] = true;
    salvarAntifigu(antifiguData);
    await sock.sendMessage(from, { text: "✅ Antifigu ativado. Figurinhas serão apagadas e reincidentes removidos." });
  } else if (estado === "off") {
    delete antifiguData[from];
    salvarAntifigu(antifiguData);
    await sock.sendMessage(from, { text: "🚫 Antifigu desativado. Figurinhas estão liberadas." });
  } else {
    await sock.sendMessage(from, { text: "ℹ️ Use: !antifig on ou !antifig off" });
  }
};