const { delay } = require("@whiskeysockets/baileys");

module.exports.commandHidetag = async (isAdmin, isBotAdmin, sock, from, args, enviarMensagem) => {
  try {
    if (!isAdmin) {
      return await enviarMensagem("❌ Você precisa ser administrador!", sock, from);
    }

    if (!isBotAdmin) {
      return await enviarMensagem("❌ O bot precisa ser administrador!", sock, from);
    }

    const metadata = await sock.groupMetadata(from);
    const participantes = metadata.participants.map(p => p.id);

    const mencoesTexto = participantes
      .map(id => `@${id.split("@")[0]}`)
      .join("\n");

    const texto = args.length ? args.join(" ") : "📢 Atenção, membros!";
    const mensagemFinal = `${texto}\n\n${mencoesTexto}`;

    await delay(500);

    await sock.sendMessage(from, {
      text: mensagemFinal,
      mentions: participantes
    });

  } catch (err) {
    console.error("❌ Erro no comando !hidetag:", err);
    await enviarMensagem("❌ Ocorreu um erro ao tentar usar o !hidetag.", sock, from);
  }
};