const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

async function commandSticker(sock, msg) {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

  if (!quoted?.imageMessage) {
    await sock.sendMessage(msg.key.remoteJid, { text: '❌ Responda a uma imagem com o comando !sticker' }, { quoted: msg });
    return;
  }

  const mediaBuffer = await downloadMediaMessage({ message: quoted }, "buffer");

  const inputPath = path.join(__dirname, "temp_input.jpg");
  const outputPath = path.join(__dirname, "temp_output.webp");

  fs.writeFileSync(inputPath, mediaBuffer);

  
  exec(`ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=white" -vcodec libwebp -lossless 1 -preset default -qscale 75 -loop 0 -an -vsync 0 ${outputPath}`, async (error) => {
    if (error) {
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ Erro ao converter imagem em figurinha.' }, { quoted: msg });
      return;
    }

    const webpBuffer = fs.readFileSync(outputPath);

    await sock.sendMessage(
      msg.key.remoteJid,
      {
        sticker: webpBuffer,
        packname: "MeuBot",
        author: "Kayros"
      },
      { quoted: msg }
    );


    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
  });
}

module.exports = { commandSticker };