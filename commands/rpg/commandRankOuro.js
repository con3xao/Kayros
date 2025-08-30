const { carregarBancoRPG } = require('../../utils/rpgBanco');

exports.commandRankOuro = async (sock, messageDetails, enviarMensagem) => {
  const banco = carregarBancoRPG();
  const usuarios = banco.jogadores || {};

  if (Object.keys(usuarios).length === 0) {
    await enviarMensagem("⚠️ Nenhum jogador cadastrado no RPG.");
    return;
  }

  const ranking = Object.entries(usuarios)
    .map(([id, dados]) => ({
      nome: dados.nome || id.split("@")[0],
      ouro: dados.ouro || 0
    }))
    .sort((a, b) => b.ouro - a.ouro)
    .slice(0, 10);

  let msg = "🏆 *Top 10 Jogadores Mais Ricos*\n\n";
  ranking.forEach((user, i) => {
    const medalha = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔹";
    msg += `${medalha} ${i + 1}. ${user.nome} – 💰 ${user.ouro} ouros\n`;
  });

  await enviarMensagem(msg);
};