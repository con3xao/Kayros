const { carregarBancoRPG, salvarBancoRPG } = require('../../utils/rpgBanco');

exports.commandRoubar = async (sock, messageDetails, enviarMensagem, participant, userName, args) => {
  const usuarios = carregarBancoRPG();
  const id1 = participant;

  if (!usuarios[id1]) {
    await enviarMensagem("❌ Você não está registrado no RPG. Use *!rpg iniciar*.");
    return;
  }

  if (usuarios[id1].ouro < 20) {
    await enviarMensagem("❌ Você precisa de pelo menos *20 ouros* para tentar roubar.");
    return;
  }

  let mencionado = null;

  if (messageDetails.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
    mencionado = messageDetails.message.extendedTextMessage.contextInfo.mentionedJid[0];
  } else if (args[0]) {
    const numero = args[0].replace(/[^0-9]/g, '');
    mencionado = `${numero}@s.whatsapp.net`;
  }

  if (!mencionado || mencionado === id1) {
    await enviarMensagem("👥 Você precisa mencionar um usuário válido para roubar.");
    return;
  }

  if (!usuarios[mencionado]) {
    await enviarMensagem("❌ O usuário mencionado ainda não está registrado no RPG.");
    return;
  }

  const nomeLadrao = usuarios[id1].nome || "Jogador 1";
  const nomeVitima = usuarios[mencionado].nome || "Jogador 2";

  const chance = Math.random() * 100;

  if (chance < 35) {
    // Sucesso: rouba de 30 a 100 ouros
    const ouroRoubado = Math.floor(Math.random() * 71) + 30;
    const valorReal = Math.min(ouroRoubado, usuarios[mencionado].ouro);

    usuarios[mencionado].ouro -= valorReal;
    usuarios[id1].ouro += valorReal;

    salvarBancoRPG(usuarios);

    await enviarMensagem(
`🕵️ *Roubo Bem-Sucedido!*

👤 ${nomeLadrao} roubou *${valorReal} ouros* de ${nomeVitima}!
💰 Agora ${nomeLadrao} tem *${usuarios[id1].ouro} ouros*.
😡 ${nomeVitima} ficou com *${usuarios[mencionado].ouro} ouros*.`
    );
  } else if (chance < 65) {
    // Falha: perde 20 ouros
    usuarios[id1].ouro -= 20;
    salvarBancoRPG(usuarios);

    await enviarMensagem(
`🚨 *Roubo Falhou!*

❌ ${nomeLadrao} foi pego tentando roubar ${nomeVitima}!
💸 Perdeu *20 ouros* como punição.`
    );
  } else {
    // Nenhum roubo, mas chance de quebrar escudo
    let escudoQuebrado = false;

    if (usuarios[mencionado].escudo && usuarios[mencionado].escudo.resistencia > 0) {
      const quebrar = Math.random() < 0.5; // 50% de chance de quebrar
      if (quebrar) {
        usuarios[mencionado].escudo.resistencia = 0;
        usuarios[mencionado].escudo.nivel = 0;
        escudoQuebrado = true;
      }
    }

    salvarBancoRPG(usuarios);

    if (escudoQuebrado) {
      await enviarMensagem(
`⚠️ *Roubo Frustrado, mas...*

${nomeLadrao} tentou roubar ${nomeVitima}, não conseguiu ouro, *mas quebrou o escudo da vítima*! 🛡️💥`
      );
    } else {
      await enviarMensagem(
`🤷‍♂️ *Roubo Frustrado!*

${nomeLadrao} tentou roubar ${nomeVitima}, mas não conseguiu nada.`
      );
    }
  }
};