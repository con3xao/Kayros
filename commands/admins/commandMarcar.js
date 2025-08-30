exports.commandMarcar = async (isAdmin, isBotAdmin, args, sock, from, enviarMensagem) => {
  if (!isAdmin) {
    await enviarMensagem("❌ Você precisa ser administrador!");
    return;
  }

  if (!isBotAdmin) {
    await enviarMensagem("❌ O bot precisa ser administrador!");
    return;
  }

  const { participants } = await sock.groupMetadata(from);

  if (!args.length) {
    await enviarMensagem("❌ Digite o motivo de marcar alguém.");
    return;
  }

  const marcarMembros = participants.map(p => p.id);
  const mencoesTexto = marcarMembros.map(id => `@${id.replace(/@s\.whatsapp\.net$/, "")}`).join("\n");

  const texto = `📢 *Atenção*\nMotivo: ${args.join(" ")}\n\n${mencoesTexto}`;

  await sock.sendMessage(from, {
    text: texto,
    mentions: marcarMembros
  });
};