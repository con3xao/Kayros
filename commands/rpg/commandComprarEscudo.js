const { carregarBancoRPG, salvarBancoRPG } = require('../../utils/rpgBanco');

exports.commandComprarEscudo = async (sock, messageDetails, enviarMensagem, participant) => {
  const usuarios = carregarBancoRPG();
  const user = usuarios[participant];

  if (!user) {
    await enviarMensagem("❌ Você não está registrado no RPG. Use *!rpg iniciar* para começar.");
    return;
  }

  const custoEscudo = 50;

  if (user.ouro < custoEscudo) {
    await enviarMensagem(`❌ Você precisa de pelo menos ${custoEscudo} ouros para comprar o escudo.`);
    return;
  }

  user.ouro -= custoEscudo;
  user.escudo = user.escudo || { nivel: 0, resistencia: 0 };
  user.escudo.nivel = 1;
  user.escudo.resistencia = 100;

  salvarBancoRPG(usuarios);

  await enviarMensagem(`🛡️ Você comprou o escudo com sucesso! Agora seu escudo está no nível 1 com 100 de resistência. 💰 Ouro restante: ${user.ouro}`);
};