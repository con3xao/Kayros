const fs = require("fs");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { exec } = require("child_process");

async function commandStickerVideo(sock, messageDetails) {
  try {
    console.log("Comando stickervideo chamado!");

    let mediaMsgObject = null;

    if (messageDetails.message?.videoMessage) {
      mediaMsgObject = { videoMessage: messageDetails.message.videoMessage };
    } else if (
      messageDetails.message?.documentMessage &&
      messageDetails.message.documentMessage.mimetype?.includes("gif")
    ) {
      mediaMsgObject = { documentMessage: messageDetails.message.documentMessage };
    } else if (
      messageDetails.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage
    ) {
      mediaMsgObject = {
        videoMessage: messageDetails.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage,
      };
    } else if (
      messageDetails.message?.extendedTextMessage?.contextInfo?.quotedMessage?.documentMessage &&
      messageDetails.message.extendedTextMessage.contextInfo.quotedMessage.documentMessage.mimetype?.includes("gif")
    ) {
      mediaMsgObject = {
        documentMessage: messageDetails.message.extendedTextMessage.contextInfo.quotedMessage.documentMessage,
      };
    }

    if (!mediaMsgObject) {
      await sock.sendMessage(messageDetails.key.remoteJid, {
        text: "❌ Envie ou responda uma mensagem com vídeo ou GIF animado para converter em figurinha de vídeo (máx 10 segundos).",
      });
      return;
    }

    console.log("Tentando baixar mídia...");

    const mediaBuffer = await downloadMediaMessage({ message: mediaMsgObject }, "buffer");

    console.log("Mídia baixada, tamanho:", mediaBuffer.length);

    const tempVideoPath = path.join(__dirname, "temp_video");
    const tempWebpPath = path.join(__dirname, "temp_sticker.webp");

    fs.writeFileSync(tempVideoPath, mediaBuffer);


    const ffmpegCmd = `ffmpeg -y -i ${tempVideoPath} -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,fps=15" -t 10 -loop 0 -preset default -an -vsync vfr ${tempWebpPath}`;

    exec(ffmpegCmd, async (error) => {

      fs.unlinkSync(tempVideoPath);

      if (error) {
        console.error("Erro no ffmpeg:", error);
        await sock.sendMessage(messageDetails.key.remoteJid, {
          text: "❌ Erro ao converter o vídeo em figurinha.",
        });
        return;
      }


      const stickerBuffer = fs.readFileSync(tempWebpPath);
      
      fs.unlinkSync(tempWebpPath);

      await sock.sendMessage(messageDetails.key.remoteJid, {
        sticker: stickerBuffer,
        mimetype: "image/webp",
      }, { quoted: messageDetails });

      console.log("Figurinha animada enviada!");
    });

  } catch (err) {
    console.error("Erro no comando stickervideo:", err);
    await sock.sendMessage(messageDetails.key.remoteJid, {
      text: "❌ Ocorreu um erro ao processar sua figurinha de vídeo.",
    });
  }
}

module.exports = { commandStickerVideo };