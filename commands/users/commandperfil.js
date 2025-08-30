exports.commandPerfil = async (sock, participant, userName, enviarImagemUrl) => {
  let imgPerfil;

  try {
    imgPerfil = await sock.profilePictureUrl(participant, "image");
  } catch (error) {
    console.log("Erro ao buscar foto de perfil:", error?.message || error);
    imgPerfil = "https://telegra.ph/file/b5427ea4b8701bc47e751.jpg";
  }

  const isGrupo = participant.includes("@g.us");

  let nomeGrupo = "";
  if (isGrupo) {
    try {
      const metadata = await sock.groupMetadata(participant);
      nomeGrupo = metadata.subject || "Nome do grupo não encontrado";
    } catch (e) {
      nomeGrupo = "Nome do grupo não disponível";
    }
  }

  const agora = new Date();
  const horario = agora.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  let textPerfil = `📋 *Seu Perfil*\n\n👤 *Nome:* ${userName || "Desconhecido"}\n🧾 *Número:* ${participant}\n💬 *Tipo de chat:* ${isGrupo ? "Grupo" : "Privado"}`;
  
  if (isGrupo) {
    textPerfil += `\n📛 *Nome do grupo:* ${nomeGrupo}`;
  }

  textPerfil += `\n🕒 *Horário:* ${horario}`;

  await enviarImagemUrl(imgPerfil, textPerfil);
};