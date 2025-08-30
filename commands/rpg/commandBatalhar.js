const { carregarBancoRPG, salvarBancoRPG } = require('../../utils/rpgBanco');

function calcularPoder(usuario) {
  const sorte = usuario.sorte || 0;
  const escudo = usuario.escudo?.resistencia || 0;
  return Math.floor(Math.random() * (sorte + 10)) + escudo;
}

exports.commandBatalhar = async (sock, messageDetails, enviarMensagem, participant, userName, args) => {
  const usuarios = carregarBancoRPG();
  const id1 = participant;

  if (!usuarios[id1]) {
    await enviarMensagem("❌ Você ainda não está registrado no RPG. Use *!rpg iniciar* para começar.");
    return;
  }

  let mencionado = null;

  if (messageDetails.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
    mencionado = messageDetails.message.extendedTextMessage.contextInfo.mentionedJid[0];
  } else if (args[0]) {
    const numero = args[0].replace(/[^0-9]/g, '');
    mencionado = `${numero}@s.whatsapp.net`;
  }

  if (!mencionado || mencionado === participant) {
    await enviarMensagem("👥 Você precisa mencionar um usuário válido para batalhar.");
    return;
  }

  if (!usuarios[mencionado]) {
    await enviarMensagem("❌ O usuário mencionado ainda não está registrado no RPG.");
    return;
  }

  if (usuarios[id1].ouro < 35) {
    await enviarMensagem("💰 Você precisa de pelo menos *35 ouros* para batalhar.");
    return;
  }

  usuarios[id1].ouro -= 35;

  // Verifica escudo infinito
  const escudo1 = usuarios[id1].escudo?.tipo === "infinito";
  const escudo2 = usuarios[mencionado].escudo?.tipo === "infinito";

  let vencedor, perdedor;
  let poder1 = 0, poder2 = 0;

  if (escudo1 && !escudo2) {
    vencedor = id1;
    perdedor = mencionado;
  } else if (!escudo1 && escudo2) {
    vencedor = mencionado;
    perdedor = id1;
  } else {
    poder1 = calcularPoder(usuarios[id1]);
    poder2 = calcularPoder(usuarios[mencionado]);

    if (poder1 >= poder2) {
      vencedor = id1;
      perdedor = mencionado;
    } else {
      vencedor = mencionado;
      perdedor = id1;
    }
  }

  usuarios[vencedor].ouro += 120;

  salvarBancoRPG(usuarios);

  const nome1 = usuarios[id1].nome || userName || "Jogador 1";
  const nome2 = usuarios[mencionado].nome || "Jogador 2";

  await enviarMensagem(
`⚔️ *Batalha PvP Iniciada!*

👤 ${nome1} VS ${nome2}

🎯 *Poder de ataque*:
- ${nome1}: ${poder1}
- ${nome2}: ${poder2}

🏆 *Vencedor:* ${vencedor === id1 ? nome1 : nome2}
💰 Ganhou: 120 ouros
💸 Perdedor: perdeu 35 ouros (gasto para batalhar)
`);
};