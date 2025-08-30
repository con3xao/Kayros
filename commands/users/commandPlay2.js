const ytSearch = require('yt-search');

module.exports = {
  name: 'play2',
  description: 'Envia informações do vídeo do YouTube',
  async execute(m, sock, args) {
    if (!args.length) {
      return sock.sendMessage(m.key.remoteJid, { text: '❌ Digite o nome da música.' });
    }

    const search = args.join(' ');

    try {
      const results = await ytSearch(search);
      const video = results.videos.length > 0 ? results.videos[0] : null;

      if (!video) {
        return sock.sendMessage(m.key.remoteJid, { text: '❌ Vídeo não encontrado.' });
      }

      const responseText = 
        `🎧 *${video.title}*\n` +
        `📺 Canal: ${video.author.name}\n` +
        `⏱ Duração: ${video.timestamp}\n` +
        `👁 Visualizações: ${video.views}\n` +
        `🔗 Link: ${video.url}`;

      await sock.sendMessage(m.key.remoteJid, { text: responseText }, { quoted: m });

    } catch (err) {
      console.error('Erro no play2:', err);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ Ocorreu um erro ao buscar a música.' });
    }
  }
};