const { carregarBancoRPG, salvarBancoRPG } = require('../../utils/rpgBanco');

exports.commandDoarOuro = async (sock, messageDetails, enviarMensagem) => {
  const sender = messageDetails.key.participant || messageDetails.key.remoteJid;
  const body = (messageDetails.message?.conversation) || (messageDetails.message?.extendedTextMessage?.text) || "";

  const usuarios = carregarBancoRPG();
  const id = sender;


  if (!usuarios[id]) {
    await enviarMensagem("❌ Você ainda não iniciou no RPG. Use *!rpg iniciar* para começar.");
    return;
  }

  const partes = body.trim().split(" ");


  if (partes.length < 3 || !messageDetails.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
    await enviarMensagem("❌ Use o comando corretamente:\n*!doarouro @usuário quantidade*\n\nExemplo: *!doarouro @12345678901 10*");
    return;
  }

  const userDoadoId = messageDetails.message.extendedTextMessage.contextInfo.mentionedJid[0];

  if (!usuarios[userDoadoId]) {
    await enviarMensagem("❌ O usuário marcado não está registrado no RPG.");
    return;
  }

  const quantidade = parseInt(partes[2]);
  if (isNaN(quantidade) || quantidade <= 0) {
    await enviarMensagem("❌ Informe uma quantidade válida para doar.");
    return;
  }

  const jogador = usuarios[id];
  const jogadorDestino = usuarios[userDoadoId];


  if (jogador.ouro < quantidade) {
    await enviarMensagem(`❌ Você não tem ouro suficiente. Atualmente você tem ${jogador.ouro} ouros.`);
    return;
  }


  jogador.ouro -= quantidade;
  jogadorDestino.ouro += quantidade;

  salvarBancoRPG(usuarios);

  await enviarMensagem(`🎁 Você doou *${quantidade} ouros* para *${jogadorDestino.nome || "o jogador"}*.\n💰 Seu saldo atual é *${jogador.ouro}* ouros.`);
};