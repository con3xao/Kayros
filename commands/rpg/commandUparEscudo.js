const { carregarBancoRPG, salvarBancoRPG } = require('../../utils/rpgBanco');

exports.commandUparEscudo = async (sock, messageDetails, enviarMensagem, participant) => {
  const usuarios = carregarBancoRPG();
  const user = usuarios[participant];

  if (!user) {
    await enviarMensagem("❌ Você ainda não está registrado no RPG. Use *!rpg iniciar* para começar.");
    return;
  }

  const custoUp = 75;

  if (user.ouro < custoUp) {
    await enviarMensagem(`💰 Você precisa de pelo menos ${custoUp} ouros para upar seu escudo.`);
    return;
  }

  user.ouro -= custoUp;
  user.escudo = user.escudo || { nivel: 0, resistencia: 0 };
  user.escudo.nivel += 1;
  user.escudo.resistencia += 35;

  salvarBancoRPG(usuarios);

  await enviarMensagem(
    `🛡️ Seu escudo foi upado para o nível ${user.escudo.nivel}!\n` +
    `📈 Resistência agora é ${user.escudo.resistencia}\n` +
    `💸 Ouro restante: ${user.ouro}`
  );
};