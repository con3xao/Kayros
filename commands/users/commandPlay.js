const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'play',
  description: 'Toca uma música do YouTube',
  async execute(messageDetails, sock, args) {
    if (!args.length) {
      return sock.sendMessage(messageDetails.key.remoteJid, { text: '❌ Você precisa digitar o nome da música.' });
    }

    const search = args.join(' ');

    const url = args[0].startsWith('http') ? args[0] : null;
    if (!url) return sock.sendMessage(messageDetails.key.remoteJid, { text: '❌ Por favor, envie uma URL do YouTube válida.' });

    const outputFolder = './temp';
    if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);

    const command = `yt-dlp -x --audio-format mp3 -o "${outputFolder}/%(title)s.%(ext)s" "${url}"`;

    try {
      await sock.sendMessage(messageDetails.key.remoteJid, { text: '🎧 Baixando música, aguarde...' });

      exec(command, async (error, stdout, stderr) => {
        if (error) {
          console.error('Erro ao baixar com yt-dlp:', stderr || error.message);
          return sock.sendMessage(messageDetails.key.remoteJid, { text: '❌ Erro ao baixar a música.' });
        }

        const match = stdout.match(/Destination: (.+\.mp3)/);
        if (!match) {
          return sock.sendMessage(messageDetails.key.remoteJid, { text: '❌ Não foi possível encontrar o arquivo de áudio.' });
        }

        const audioFile = match[1];
        if (!fs.existsSync(audioFile)) {
          return sock.sendMessage(messageDetails.key.remoteJid, { text: '❌ Arquivo de áudio não encontrado.' });
        }

        const audioBuffer = fs.readFileSync(audioFile);

        await sock.sendMessage(messageDetails.key.remoteJid, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: false,
        }, { quoted: messageDetails });

        fs.unlinkSync(audioFile);
      });
    } catch (err) {
      console.error('Erro geral no play:', err);
      await sock.sendMessage(messageDetails.key.remoteJid, { text: '❌ Ocorreu um erro inesperado.' });
    }
  }
};