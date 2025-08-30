const { carregarBancoRPG, salvarBancoRPG } = require('../../utils/rpgBanco');

exports.commandApostar = async (sock, msg, enviarMensagem, participant, userName, args) => {
  const dados = carregarBancoRPG();
  const valorApostado = parseInt(args[0]);

  if (!valorApostado || isNaN(valorApostado) || valorApostado <= 0) {
    await enviarMensagem("❌ Use: *!apostar <valor>* (ex: !apostar 50)");
    return;
  }

  if (!dados.jogadores[participant]) {
    await enviarMensagem(`⚠️ Você ainda não iniciou o RPG. Use *!rpg iniciar*`);
    return;
  }

  if (dados.jogadores[participant].ouro < valorApostado) {
    await enviarMensagem(`❌ Você não tem ouro suficiente. Seu saldo atual: ${dados.jogadores[participant].ouro} ouros.`);
    return;
  }

  let chance = 0.5;
  if (dados.jogadores[participant].escudo?.tipo === "infinito") {
    chance = 0.9;
  }

  const ganhou = Math.random() < chance;

  if (ganhou) {
    dados.jogadores[participant].ouro += valorApostado * 2; 
    await enviarMensagem(`🎉 Parabéns ${userName}! Você ganhou a aposta e agora tem ${dados.jogadores[participant].ouro} ouros.`);
  } else {
    dados.jogadores[participant].ouro -= valorApostado;
    await enviarMensagem(`💸 Você perdeu a aposta de ${valorApostado} ouros. Agora tem ${dados.jogadores[participant].ouro} ouros.`);
  }

  salvarBancoRPG(dados);
};