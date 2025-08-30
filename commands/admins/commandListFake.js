const fs = require('fs');
const path = require('path');

async function commandListFake(sock, messageDetails, enviarMensagem) {
  try {
    const remoteJid = messageDetails.key.remoteJid;

    const metadata = await sock.groupMetadata(remoteJid);
    const participantes = metadata.participants.map(p => p.id);

    const numerosFake = participantes
      .filter(id => !id.startsWith("55"))
      .map(id => id.replace("@s.whatsapp.net", ""));

    if (numerosFake.length === 0) {
      await enviarMensagem("✅ Nenhum número fake encontrado neste grupo.");
      return;
    }

    let mensagem = "📋 Lista de números fake do grupo:\n\n";
    numerosFake.forEach((num, i) => {
      mensagem += `${i + 1}. ${num}\n`;
    });

    await enviarMensagem(mensagem);

  } catch (error) {
    console.error("Erro ao listar números fake:", error);
    await enviarMensagem("❌ Ocorreu um erro ao listar os números fake.");
  }
}

module.exports = { commandListFake };