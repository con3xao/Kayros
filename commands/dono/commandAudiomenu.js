const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { ownerNumber } = require("../../settings.json");

async function commandAudioMenu(sock, msg, args, enviarMensagem, mediaInfo) {
  const remetente = msg.key.participant || msg.key.remoteJid;
  const numeroLimpo = remetente.replace(/\D/g, "");

  if (!ownerNumber.includes(numeroLimpo)) {
    await enviarMensagem("🚫 Apenas o meu dono pode usar este comando.");
    return;
  }

  const nomeArquivo = args[0];
  if (!nomeArquivo) {
    await enviarMensagem("❌ Use: audio_menu nome_do_arquivo.mp3 (respondendo a um áudio/vídeo/arquivo).");
    return;
  }

  if (!mediaInfo) {
    await enviarMensagem("❌ Você precisa responder ou enviar um arquivo (mp3 ou mp4).");
    return;
  }

  const pastaAudios = path.join(__dirname, "../../assets/menu/audios");
  const destino = path.join(pastaAudios, nomeArquivo);


  if (!fs.existsSync(destino)) {
    await enviarMensagem(`❌ O áudio *${nomeArquivo}* não existe na pasta.`);
    return;
  }

  try {

    if (mediaInfo.mimetype === "audioMessage" || mediaInfo.mimetype.includes("audio")) {
      fs.writeFileSync(destino, mediaInfo.buffer);
      await enviarMensagem(`✅ Áudio *${nomeArquivo}* substituído com sucesso!`);
      return;
    }

    if (mediaInfo.mimetype.includes("video") || mediaInfo.mimetype.includes("mp4")) {
      const tempVideo = path.join(__dirname, "../../temp_input.mp4");
      const tempAudio = path.join(__dirname, "../../temp_output.mp3");

      fs.writeFileSync(tempVideo, mediaInfo.buffer);


      exec(`ffmpeg -i "${tempVideo}" -vn -acodec libmp3lame -q:a 4 "${tempAudio}" -y`, (err) => {
        if (err) {
          console.error("Erro no ffmpeg:", err);
          enviarMensagem("❌ Erro ao processar o vídeo para áudio.");
          return;
        }

        fs.renameSync(tempAudio, destino);


        fs.unlinkSync(tempVideo);

        enviarMensagem(`✅ Áudio extraído do vídeo e salvo como *${nomeArquivo}*!`);
      });
      return;
    }

    await enviarMensagem("❌ Formato não suportado. Envie mp3 ou mp4.");
  } catch (err) {
    console.error("Erro no comando audio_menu:", err);
    await enviarMensagem("❌ Ocorreu um erro ao substituir o áudio.");
  }
}

module.exports = { commandAudioMenu };