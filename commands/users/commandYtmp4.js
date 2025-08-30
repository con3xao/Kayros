const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');

exports.commandYtmp4 = async (sock, message, args, enviarMensagem) => {
  const url = args[0];

  if (!url || !ytdl.validateURL(url)) {
    await enviarMensagem('❌ Envie um link válido do YouTube.\nExemplo: !ytmp4 https://youtu.be/snndnd');
    return;
  }

  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title.replace(/[^\w\s]/gi, '').slice(0, 30);
  const filePath = path.join(__dirname, `../../assets/${title}.mp4`);

  await enviarMensagem(`📥 Baixando vídeo: *${title}*... Aguarde um momento.`);

  const stream = ytdl(url, {
    filter: (format) => format.container === 'mp4' && format.hasAudio && format.hasVideo,
    quality: '18' 
  });

  const writeStream = fs.createWriteStream(filePath);
  stream.pipe(writeStream);

  writeStream.on('finish', async () => {
    try {
      await sock.sendMessage(message.key.remoteJid, {
        video: { url: filePath },
        caption: title
      }, { quoted: message });

      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(err);
      await enviarMensagem('❌ Erro ao enviar o vídeo.');
    }
  });

  writeStream.on('error', async (err) => {
    console.error('Erro ao salvar o vídeo:', err);
    await enviarMensagem("❌ Erro ao baixar o vídeo.");
  });
};