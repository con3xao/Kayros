module.exports.commandLimpar = async (sock, messageDetails, enviarMensagem, isGroup, isAdmin) => {
  if (!isGroup) {
    await enviarMensagem("❌ Esse comando só pode ser usado em grupos.");
    return;
  }

  if (!isAdmin) {
    await enviarMensagem("❌ Apenas administradores podem usar este comando.");
    return;
  }

  const invisibleChar = "‎"; 
  const bigLine = invisibleChar.repeat(1); 
  const bigMessage = (bigLine + "\n").repeat(200); 
  for (let i = 0; i < 4; i++) {
    await sock.sendMessage(messageDetails.key.remoteJid, { text: bigMessage });
    await new Promise(r => setTimeout(r, 500)); 
  }

  await enviarMensagem(" Limpeza finalizada!");
};