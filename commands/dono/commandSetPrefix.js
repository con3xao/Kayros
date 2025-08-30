const { getPREFIX, setPREFIX } = require("../../utils/prefixManager");

exports.execute = async (sock, messageDetails, args, enviarMensagem, isOwner) => {
  if (!isOwner) {
    await enviarMensagem("⛔ Apenas o meu dono pode usar este comando!");
    return;
  }

  if (!args[0] || args[0].includes(" ")) {
    await enviarMensagem("❌ Formato inválido. Use: *setprefix .*");
    return;
  }

  try {
    setPREFIX(args[0]);
    await enviarMensagem(`Espere 1 minuto por favor, novo prefixo: *${args[0]}*`);
  } catch (err) {
    console.error("Erro ao salvar prefixo:", err);
    await enviarMensagem("❌ Ocorreu um erro ao salvar o prefixo.");
  }
};

exports.getPREFIX = getPREFIX;