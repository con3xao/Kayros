const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage, toBuffer } = require('@whiskeysockets/baileys');

async function commandvidmage(sock, messageDetails, enviarMensagem) {
  try {
    const ctxInfo = messageDetails.message?.extendedTextMessage?.contextInfo;
    if (!ctxInfo || !ctxInfo.quotedMessage || !ctxInfo.quotedMessage.stickerMessage) {
      return enviarMensagem("❌ Responda a uma figurinha para transformar em imagem.");
    }

    const stickerMessage = ctxInfo.quotedMessage.stickerMessage;

    const stream = await downloadContentFromMessage(stickerMessage, 'image');
    const buffer = await toBuffer(stream);

    const outputPath = path.join(__dirname, "../../temp", `sticker_${Date.now()}.png`);
    fs.writeFileSync(outputPath, buffer);

    await sock.sendMessage(
      messageDetails.key.remoteJid,
      { image: { url: outputPath }, caption: "🖼️ Figurinha convertida em imagem" },
      { quoted: messageDetails }
    );

    setTimeout(() => {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }, 5000);

  } catch (err) {
    console.error("Erro em commandvidmage:", err);
    enviarMensagem("❌ Erro ao converter figurinha em imagem.");
  }
}

module.exports = { commandvidmage };