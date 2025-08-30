const { carregarBancoRPG } = require('../../utils/rpgBanco');

exports.commandMeuOuro = async (sock, messageDetails, enviarMensagem, participant) => {
  const usuarios = carregarBancoRPG();
  const user = usuarios[participant];

  if (!user) {
    await enviarMensagem("❌ Você ainda não está registrado no RPG.");
    return;
  }

  const nome = user.nome || "Jogador";
  const ouro = user.ouro || 0;
  const sorte = user.sorte || 0;
  const escudoNivel = user.escudo?.nivel || 0;
  const escudoResistencia = user.escudo?.resistencia || 0;

  let mensagem =
    `🧙 *Status de ${nome}*\n\n` +
    `💰 Ouro: ${ouro}\n` +
    `🍀 Sorte: ${sorte}\n` +
    `🛡️ Escudo: Nível ${escudoNivel} / Resistência ${escudoResistencia}`;

  await enviarMensagem(mensagem);
};