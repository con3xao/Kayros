const { ownerNumber } = require("../../settings.json");

const commandListGp = async (sock, message, args, enviarMensagem) => {
  const sender = message.key.participant || message.key.remoteJid;
  const isGroup = message.key.remoteJid.endsWith("@g.us");

  const numeroRemetente = (isGroup ? sender : message.key.remoteJid).replace(/\D/g, "");

  if (!ownerNumber.includes(numeroRemetente)) {
    await enviarMensagem("❌ Apenas o dono do bot pode usar este comando.");
    return;
  }

  try {
    const grupos = await sock.groupFetchAllParticipating();
    const listaDeGrupos = Object.values(grupos);

    if (listaDeGrupos.length === 0) {
      await enviarMensagem("🤖 O bot não está em nenhum grupo.");
      return;
    }

    let resposta = "📋 *Grupos que o bot está:*\n\n";
    let contador = 1;

    for (const grupo of listaDeGrupos) {
      try {
        const inviteCode = await sock.groupInviteCode(grupo.id);
        const link = `https://chat.whatsapp.com/${inviteCode}`;
        resposta += `*${contador}.* ${grupo.subject}\n🔗 ${link}\n🆔 ${grupo.id}\n\n`;
      } catch (e) {
        resposta += `*${contador}.* ${grupo.subject}\n❌ Sem permissão para gerar link\n🆔 ${grupo.id}\n\n`;
      }
      contador++;
    }

    await enviarMensagem(resposta.trim());
  } catch (error) {
    console.error("Erro ao listar grupos:", error);
    await enviarMensagem("❌ Ocorreu um erro ao listar os grupos.");
  }
};

// Exportação correta!
module.exports = { commandListGp };