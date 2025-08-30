const { carregarBancoRPG, salvarBancoRPG } = require('../../utils/rpgBanco');

exports.commandSorteio = async (sock, messageDetails, enviarMensagem) => {
  const remoteJid = messageDetails.key.remoteJid || messageDetails.remoteJid;
  if (!remoteJid) {
    await enviarMensagem("❌ Erro: não consegui identificar o grupo.");
    return;
  }

  if (!remoteJid.endsWith("@g.us")) {
    await enviarMensagem("⚠️ Esse comando só pode ser usado em grupos.");
    return;
  }

  const usuarios = carregarBancoRPG();

  let metadata;
  try {
    metadata = await sock.groupMetadata(remoteJid);
  } catch (err) {
    await enviarMensagem("❌ Não consegui acessar os participantes do grupo.");
    return;
  }

  const participantes = metadata.participants.map(p => p.id);

  const jogadoresNoGrupo = Object.keys(usuarios).filter(id => participantes.includes(id));

  if (jogadoresNoGrupo.length === 0) {
    await enviarMensagem("⚠️ Nenhum jogador registrado no RPG foi encontrado neste grupo.");
    return;
  }

  const vencedorId = jogadoresNoGrupo[Math.floor(Math.random() * jogadoresNoGrupo.length)];
  const vencedor = usuarios[vencedorId];

  const premio = 50; 

  vencedor.ouro = (vencedor.ouro || 0) + premio;

  salvarBancoRPG(usuarios);

  const vencedorNome = vencedor.nome || vencedorId.split("@")[0];
  await enviarMensagem(`🎉 O vencedor do sorteio é: *${vencedorNome}*!\n\n🏆 Ele ganhou *${premio} ouros*.\n💰 Saldo atual: *${vencedor.ouro} ouros*.`);
};