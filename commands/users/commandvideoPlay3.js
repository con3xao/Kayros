const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const yts = require('yt-search');

module.exports = {
  name: 'play3',
  description: 'Baixa música do YouTube pelo nome',
  async execute(messageDetails, sock, args) {
    if (!args.length) {
      return sock.sendMessage(messageDetails.key.remoteJid, { text: '❌ Você precisa digitar o nome da música.' });
    }

    try {
      const search = args.join(' ');
      const results = await yts(search);

      if (!results || !results.videos.length) {
        return sock.sendMessage(messageDetails.key.remoteJid, { text: '❌ Nenhum resultado encontrado.' });
      }

      const video = results.videos[0];
      const url = video.url;
      const title = video.title;
      const duration = video.timestamp;

      await sock.sendMessage(messageDetails.key.remoteJid, {
        text: `🎶 *${title}*\n⏳ Duração: ${duration}\n🔗 Link: ${url}`
      });


      const outputFolder = './temp';
      if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);

      const filePath = path.join(outputFolder, `${Date.now()}.mp3`);

      const command = `yt-dlp -x --audio-format mp3 -o "${filePath}" "${url}"`;

      await sock.sendMessage(messageDetails.key.remoteJid, { text: 'Enviando sua música, aguarde...' });

      exec(command, async (error, stdout, stderr) => {
        if (error) {
          console.error('Erro ao baixar com yt-dlp:', stderr || error.message);
          return sock.sendMessage(messageDetails.key.remoteJid, { text: '❌ Erro ao baixar a música.' });
        }

        if (!fs.existsSync(filePath)) {
          return sock.sendMessage(messageDetails.key.remoteJid, { text: '❌ Arquivo de áudio não encontrado.' });
        }

        const audioBuffer = fs.readFileSync(filePath);

        await sock.sendMessage(messageDetails.key.remoteJid, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: false,
        }, { quoted: messageDetails });

        fs.unlinkSync(filePath); 
      });
    } catch (err) {
      console.error('Erro no play3:', err);
      await sock.sendMessage(messageDetails.key.remoteJid, { text: '❌ Ocorreu um erro inesperado no play3.' });
    }
  }
};