const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const os = require("os");

function acelerarAudio(inputFile, outputFile, speed = 2.5) {
  return new Promise((resolve, reject) => {
    const filtros = calcularFiltrosAtempo(speed);

    ffmpeg(inputFile)
      .audioCodec("libopus")
      .audioChannels(1)
      .audioFrequency(48000)
      .audioBitrate("64k")
      .audioFilter(filtros)
      .format("ogg")
      .on("end", () => resolve(outputFile))
      .on("error", (err) => reject(err))
      .save(outputFile);
  });
}

function calcularFiltrosAtempo(speed) {
  const filtros = [];
  while (speed > 2.0) {
    filtros.push("atempo=2.0");
    speed /= 2.0;
  }
  filtros.push(`atempo=${speed.toFixed(2)}`);
  return filtros.join(",");
}

async function commandAudioRapido(sock, messageDetails, mediaInfo, enviarMensagem, args = []) {
  try {
    if (!mediaInfo || mediaInfo.mimetype !== "audioMessage") {
      await enviarMensagem("❌ Envie ou responda um áudio para acelerar.");
      return;
    }

    const velocidade = Math.min(parseFloat(args[0]) || 2.5, 16.0); 

    const tmpDir = path.join(os.tmpdir(), "audios_temp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const id = messageDetails.key.id;
    const inputPath = path.join(tmpDir, `${id}.ogg`);
    const outputPath = path.join(tmpDir, `${id}_fast.ogg`);

    await fs.promises.writeFile(inputPath, mediaInfo.buffer);
    await acelerarAudio(inputPath, outputPath, velocidade);

    const audioBuffer = await fs.promises.readFile(outputPath);

    await sock.sendMessage(messageDetails.key.remoteJid, {
      audio: audioBuffer,
      mimetype: "audio/ogg; codecs=opus",
      ptt: true,
    }, { quoted: messageDetails });

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
  } catch (err) {
    console.error("Erro ao acelerar áudio:", err);
    await enviarMensagem("❌ Erro ao acelerar o áudio.");
  }
}

module.exports = { commandAudioRapido };