const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

exports.commandEstourar = async (sock, messageDetails, mediaInfo, enviarAudio) => {
  try {
    if (!mediaInfo || mediaInfo.mimetype !== "audioMessage") {
      await sock.sendMessage(messageDetails.key.remoteJid, { text: "❌ Responda a um áudio com o comando *!estourar*." }, { quoted: messageDetails });
      return;
    }

    const inputPath = path.join(__dirname, "temp_input.ogg");
    const outputPath = path.join(__dirname, "temp_output.mp3");

    fs.writeFileSync(inputPath, mediaInfo.buffer);

    ffmpeg(inputPath)
      .audioFilters([
        "volume=10",
        "bass=g=10:f=110:w=0.3"
      ])
      .audioCodec("libmp3lame")
      .format("mp3")
      .save(outputPath)
      .on("end", async () => {
        await enviarAudio(fs.readFileSync(outputPath), true);
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      })
      .on("error", async (err) => {
        console.error("Erro no ffmpeg:", err);
        await sock.sendMessage(messageDetails.key.remoteJid, { text: "❌ Erro ao estourar o áudio." }, { quoted: messageDetails });
      });

  } catch (error) {
    console.error("Erro no comando !estourar:", error);
    await sock.sendMessage(messageDetails.key.remoteJid, { text: "❌ Algo deu errado ao processar o áudio." }, { quoted: messageDetails });
  }
};