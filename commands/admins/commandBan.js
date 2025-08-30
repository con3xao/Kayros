exports.commandBan = async (
  isAdmin,
  isBotAdmin,
  userMention,
  enviarMensagem,
  isOwnerGroup,
  participant,
  sock,
  from,
  groupOwner
) => {
  if (!isAdmin) {
    await enviarMensagem("Somente adms podem usar!");
    return;
  }

  if (!isBotAdmin) {
    await enviarMensagem("Eu preciso ser adm!!!");
    return;
  }

  if (!userMention) {
    await enviarMensagem("Marque um usuário!");
    return;
  }


  const botId = sock.user.id?.split(":")[0] + "@s.whatsapp.net";
  if (userMention === botId) {
    await enviarMensagem("Você não pode me remover.");
    return;
  }

  if (userMention === participant) {
    await enviarMensagem("Ué, você quer que eu remova você?");
    return;
  }

  if (userMention === groupOwner) {
    await enviarMensagem("Não vou remover o criador do grupo.");
    return;
  }

  try {
  await sock.groupParticipantsUpdate(from, [userMention], "remove");
  await enviarMensagem("Usuário removido com sucesso!");

  await sock.sendMessage(from, {
    audio: { url: './assets/audios/removido.mp3' },
    mimetype: 'audio/mpeg',
    ptt: true
  });

} catch (error) {
  console.error("Erro ao remover usuário:", error);
  await enviarMensagem("Erro ao remover o usuário.");
}
};