const comandosRank = {
  rankgay: { titulo: '🏳️‍🌈 RANKING DOS MAIS GAYS 🏳️‍🌈' },
  rankgado: { titulo: '🐂 RANKING DOS GADOS 🐂' },
  rankcorno: { titulo: '🕵️‍♂️ RANKING DOS CORNOS 🕵️‍♂️' },
  rankgostoso: { titulo: '🔥 RANKING DOS GOSTOSOS 🔥' },
  rankgostosa: { titulo: '💃 RANKING DAS GOSTOSAS 💃' },
  rankotakus: { titulo: '🎌 RANKING DOS OTAKUS 🎌' }
};

const getRandom = (arr, n) => {
  const result = [];
  const taken = new Set();
  while (result.length < n && result.length < arr.length) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!taken.has(idx)) {
      taken.add(idx);
      result.push(arr[idx]);
    }
  }
  return result;
};

async function commandRanks(sock, msg, command, from) {
  const metadata = await sock.groupMetadata(from);
  const participantes = metadata.participants;


  const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
  const membrosValidos = participantes.filter(p => p.id !== botId);

  const escolhidos = getRandom(membrosValidos, 3);
  const titulo = comandosRank[command]?.titulo || '🏆 RANKING 🏆';

  let texto = `${titulo}\n\n`;
  escolhidos.forEach((m, i) => {
    texto += `${i + 1}° @${m.id.split('@')[0]}\n`;
  });

  await sock.sendMessage(from, {
    text: texto,
    mentions: escolhidos.map(p => p.id)
  });
}

module.exports = {
  commandRanks,
  comandosRank
};