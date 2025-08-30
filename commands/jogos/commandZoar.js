// commands/users/commandAcoesZoeira.js
const path = require("path");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const commandAcoesZoeira = async (command, sock, messageDetails, userMention, participant, enviarGifUrl, enviarMensagem) => {
  const senderName = participant.split("@")[0];
  const targetName = userMention ? userMention.split("@")[0] : null;

  if (!userMention) {
    await enviarMensagem("❌ Marque alguém para usar esse comando.");
    return;
  }

  if (userMention === participant) {
    await enviarMensagem("❌ Você não pode fazer isso com você mesmo!");
    return;
  }

  switch (command) {
    case "chutar":
      await enviarGifUrl("assets/audios/gifs/chutar.mp4", `🥾 @${senderName} deu um chutão em @${targetName}!`, [participant, userMention]);
      break;

    case "matar":
      await enviarGifUrl("assets/audios/gifs/matar.mp4", `☠️ @${senderName} eliminou @${targetName}! Que tragédia...`, [participant, userMention]);
      break;

    case "reviver":
      await enviarGifUrl("assets/audios/gifs/reviver.mp4", `🧙 @${senderName} usou um feitiço e reviveu @${targetName}!`, [participant, userMention]);
      break;

    case "chance":
      const chance = randomInt(0, 100);
      await enviarMensagem(`💘 A chance de @${senderName} ficar com @${targetName} é de *${chance}%*!`);
      break;
  }
};

module.exports = { commandAcoesZoeira };