const { carregarBancoRPG } = require('../../utils/rpgBanco');

exports.commandMinOuro = async (sock, messageDetails, enviarMensagem, participant) => {
  const usuarios = carregarBancoRPG();
  const user = usuarios[participant];

  if (!user) {
    await enviarMensagem("❌ Você ainda não está registrado no RPG.");
    return;
  }

  await enviarMensagem(`💰 Você possui *${user.ouro} ouros* no momento.`);
};