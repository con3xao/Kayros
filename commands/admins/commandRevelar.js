const { downloadMediaMessage } = require("@whiskeysockets/baileys");

async function commandRevelar(sock, messageDetails, enviarMensagem, isGroup, isGroupAdmins) {
  try {
    if (isGroup && !isGroupAdmins) {
      await enviarMensagem("❌ Apenas administradores podem usar este comando.");
      return;
    }

    const quoted = messageDetails.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted) {
      await enviarMensagem("❌ Responda a uma *foto/vídeo de visualização única* com o comando.");
      return;
    }

    const frases = [
      "Aguarde um momento por favor bb 💕",
      "Calma aí que já vou revelar 👀",
      "Segura essa ansiedade 😂",
      "Já tô trazendo a fofoca 📸",
      "Relaxa que tá chegando 🔥",
      "Um segundinho só…",
      "Preparando a revelação 💫",
      "Pera que vou abrir o cofre 🔓",
      "Um instante que já mando 😉",
      "Tá vindo, calma bb 😘"
    ];

    const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
    await enviarMensagem(fraseAleatoria);

    let mediaMsg = null;
    let type = null;

    if (quoted.viewOnceMessageV2?.message) {
      mediaMsg = quoted.viewOnceMessageV2.message;
      type = Object.keys(mediaMsg)[0];
    } else if (quoted.viewOnceMessage?.message) {
      mediaMsg = quoted.viewOnceMessage.message;
      type = Object.keys(mediaMsg)[0];
    } else if (quoted.imageMessage?.viewOnce) {
      mediaMsg = { imageMessage: quoted.imageMessage };
      type = "imageMessage";
    } else if (quoted.videoMessage?.viewOnce) {
      mediaMsg = { videoMessage: quoted.videoMessage };
      type = "videoMessage";
    }

    if (!mediaMsg || !type) {
      await enviarMensagem("❌ Essa mensagem não é de visualização única.");
      return;
    }

    const mediaContent = mediaMsg[type];
    if (!mediaContent?.mediaKey) {
      await enviarMensagem("❌ Não foi possível baixar a mídia (chave de mídia ausente).");
      return;
    }
    
    const buffer = await downloadMediaMessage({ message: mediaMsg }, "buffer");

    if (type === "imageMessage") {
      await sock.sendMessage(messageDetails.key.remoteJid, {
        image: buffer,
        caption: "📸 Revelado!"
      }, { quoted: messageDetails });
    } else if (type === "videoMessage") {
      await sock.sendMessage(messageDetails.key.remoteJid, {
        video: buffer,
        caption: "🎥 Revelado!"
      }, { quoted: messageDetails });
    } else {
      await enviarMensagem("❌ Tipo de mídia não suportado.");
    }

  } catch (err) {
    console.error("Erro no comando revelar:", err);
    await enviarMensagem("❌ Erro ao tentar revelar a mídia.");
  }
}

module.exports = { commandRevelar };