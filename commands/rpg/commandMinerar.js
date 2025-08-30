const { carregarBancoRPG, salvarBancoRPG } = require('../../utils/rpgBanco');

function getDataAtual() {
  const agora = new Date();
  return `${agora.getDate()}-${agora.getMonth() + 1}-${agora.getFullYear()}`;
}

exports.commandMinerar = async (sock, messageDetails, enviarMensagem, participant, userName) => {
  const dados = carregarBancoRPG();
  const hoje = getDataAtual();

  if (!dados[participant]) {
    dados[participant] = {
      nome: userName || "Jogador",
      data: hoje,
      usos: 0,
      ouro: 0,
      sorte: 0,
      escudo: {
        nivel: 0,
        resistencia: 0
      }
    };
  }

  // Reseta usos se for um novo dia
  if (dados[participant].data !== hoje) {
    dados[participant].data = hoje;
    dados[participant].usos = 0;
  }

  if (dados[participant].usos >= 5) {
    await enviarMensagem(`⛏️ Você já minerou 5 vezes hoje, ${userName}! Volte amanhã.`);
    return;
  }

  dados[participant].usos += 1;

  const resultado = Math.floor(Math.random() * 100); // 0 a 99
  let resposta = `⛏️ Mineração #${dados[participant].usos}/5 de hoje:\n`;

  if (resultado < 10) {
    resposta += "💨 Você tentou minerar, mas não encontrou nada...";
  } else if (resultado < 80) {
    const ouroGanho = Math.floor(Math.random() * 16) + 5; // 5 a 20
    dados[participant].ouro += ouroGanho;
    resposta += `💰 Você encontrou *${ouroGanho} ouros*! Total: ${dados[participant].ouro} ouros.`;
  } else {
    dados[participant].sorte = (dados[participant].sorte || 0) + 1;
    resposta += `🍀 Você achou um *fragmento da sorte*! Agora tem ${dados[participant].sorte} de sorte.`;
  }

  salvarBancoRPG(dados);
  await enviarMensagem(resposta);
};