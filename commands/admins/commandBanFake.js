const fs = require('fs');
const path = require('path');

async function commandBanFake(sock, messageDetails, enviarMensagem, isBotAdmin, isGroup, isAdmin) {
  try {
    const remoteJid = messageDetails.key.remoteJid;


    const isFromGroup = remoteJid.endsWith("@g.us");

    if (typeof comandoAdmin !== "undefined" && comandoAdmin.includes(commandName)) {
  if (!isGroup) {
    await enviarMensagem(sock, from, "Este comando só funciona em grupos.");
    return;
  }
  if (!isGroupAdmins) {
    await enviarMensagem(sock, from, "🚫 Apenas administradores podem usar este comando.");
    return;
  }
  if (!isBotAdmin) {
    await enviarMensagem(sock, from, "🚫 Eu preciso ser admin para executar este comando.");
    return;
  }
}

    const metadata = await sock.groupMetadata(remoteJid);
    const participantes = metadata.participants.map(p => p.id);

    const fakeNumbers = participantes.filter(id => !id.startsWith("55"));

    if (fakeNumbers.length === 0) {
      await enviarMensagem("✅ Nenhum número fake encontrado para banir.");
      return;
    }

    await enviarMensagem(`🚨 Removendo ${fakeNumbers.length} números fake...`);

    for (const fake of fakeNumbers) {
      try {
        await sock.groupParticipantsUpdate(remoteJid, [fake], "remove");
        await new Promise(res => setTimeout(res, 1500));
      } catch (err) {
        console.error("Erro ao remover fake:", fake, err.message || err);
      }
    }

    await enviarMensagem("✅ Todos os fakes foram removidos do grupo.");

  } catch (error) {
    console.error("Erro no comando banfake:", error);
    await enviarMensagem("❌ Ocorreu um erro ao banir os fakes.");
  }
}

module.exports = { commandBanFake };