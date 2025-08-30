const { carregarBancoRPG, salvarBancoRPG } = require('../../utils/rpgBanco');

exports.commandRecompensa = async (sock, messageDetails, enviarMensagem) => {
  const id = messageDetails.key?.participant || messageDetails.sender || messageDetails.key?.remoteJid;
  const usuarios = carregarBancoRPG();

  if (!usuarios[id]) {
    await enviarMensagem("❌ Você ainda não iniciou no RPG. Use *!rpg iniciar* para começar.");
    return;
  }

  const hoje = new Date().toISOString().split('T')[0];
  if (usuarios[id].ultimaRecompensa === hoje) {
    await enviarMensagem("⏳ Você já pegou sua recompensa diária hoje. Volte amanhã!");
    return;
  }

  usuarios[id].ouro = (usuarios[id].ouro || 0) + 20;
  usuarios[id].ultimaRecompensa = hoje;

  salvarBancoRPG(usuarios);

  await enviarMensagem("🎁 Você recebeu sua recompensa diária de *20 ouros*! Use *!meuouro* para ver seu saldo.");
};