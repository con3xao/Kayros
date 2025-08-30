const { carregarBancoRPG, salvarBancoRPG } = require('../../utils/rpgBanco');

exports.commandRpgIniciar = async (sock, messageDetails, enviarMensagem, participant, userName) => {
  const usuarios = carregarBancoRPG();

  if (usuarios[participant]) {
    await enviarMensagem("📛 Você já está registrado no RPG! Use *!meuouro* para ver seu status.");
    return;
  }

  usuarios[participant] = {
    nome: userName || "Jogador",
    ouro: 70,
    sorte: 0,
    escudo: {
      nivel: 0,
      resistencia: 0
    }
  };

  salvarBancoRPG(usuarios);

  await enviarMensagem(
    `🎮 *Registro feito com sucesso!*\n\n` +
    `💰 Ouro: 70\n🍀 Sorte: 0\n🛡️ Escudo: Nível 0 / Resistência 0\n\n` +
    `Use *!meuouro* para ver seu status.`
  );
};