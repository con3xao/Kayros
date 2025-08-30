const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { writeFileSync, unlinkSync } = require("fs");
const { randomUUID } = require("crypto");

exports.commandAudioLento = async (sock, msg, mediaInfo, enviarMensagem) => {
  try {
    if (!mediaInfo || mediaInfo.mimetype !== "audioMessage") {
      await enviarMensagem("❌ Você precisa responder a um áudio com o comando!");
      return;
    }

    const tempId = randomUUID();
    const inputPath = path.join(__dirname, `temp-${tempId}.ogg`);
    const outputPath = path.join(__dirname, `slow-${tempId}.mp3`);

    writeFileSync(inputPath, mediaInfo.buffer);

    exec(`ffmpeg -i ${inputPath} -filter:a "atempo=0.7" -vn ${outputPath}`, async (error) => {
      if (error) {
        await enviarMensagem("❌ Erro ao processar o áudio.");
        console.error("Erro ao usar ffmpeg:", error);
        return;
      }

      const audioBuffer = fs.readFileSync(outputPath);

      await sock.sendMessage(
        msg.key.remoteJid,
        { audio: audioBuffer, mimetype: "audio/mpeg", ptt: true },
        { quoted: msg }
      );

      unlinkSync(inputPath);
      unlinkSync(outputPath);
    });
  } catch (err) {
    console.error("Erro no comando audioLento:", err);
    await enviarMensagem("❌ Ocorreu um erro ao processar o áudio.");
  }
};