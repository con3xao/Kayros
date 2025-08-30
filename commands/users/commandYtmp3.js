const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');

exports.commandYtmp3 = async (sock, message, args, enviarMensagem) => {
  const url = args[0];
  if (!url || !ytdl.validateURL(url)) {
    await enviarMensagem('❌ Envie um link válido do YouTube.\nExemplo: !ytmp3 https://youtu.be/dbdnd');
    return;
  }

  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title.replace(/[^\w\s]/gi, '').slice(0, 30);
  const filePath = path.join(__dirname, `../../assets/${title}.mp3`);

  await enviarMensagem(`🎧 Baixando áudio: *${title}*...`);

  const stream = ytdl(url, { filter: 'audioonly' });
  const writeStream = fs.createWriteStream(filePath);
  stream.pipe(writeStream);

  writeStream.on('finish', async () => {
    await sock.sendMessage(message.key.remoteJid, {
      audio: { url: filePath },
      mimetype: 'audio/mp4'
    }, { quoted: message });

    fs.unlinkSync(filePath);
  });

  writeStream.on('error', async (err) => {
    console.error(err);
    await enviarMensagem("❌ Erro ao baixar o áudio.");
  });
};