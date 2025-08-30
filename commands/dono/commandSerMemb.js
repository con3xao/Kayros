const { groupParticipantsUpdate } = require("@whiskeysockets/baileys");
const { ownerNumber } = require("../../settings.json");

exports.execute = async (sock, messageDetails, enviarMensagem, permissions) => {
  const from = messageDetails.key.remoteJid;
  const sender = messageDetails.key.participant || messageDetails.key.remoteJid;

  if (!ownerNumber.includes(sender.replace(/@s.whatsapp.net/g, ""))) {
    await enviarMensagem("🚫 Este comando só pode ser usado pelo dono do bot.");
    return;
  }

 
  const groupMetadata = await sock.groupMetadata(from);
  const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
  const botIsAdmin = groupMetadata.participants.some(p => p.admin && p.id === botNumber);

  if (!botIsAdmin) {
    await enviarMensagem("❌ O bot precisa ser admin para remover o ADM do dono.");
    return;
  }

  try {

    await sock.groupParticipantsUpdate(from, [sender], "demote");
    await enviarMensagem("✅ Seu ADM foi removido com sucesso!");
  } catch (err) {
    console.error("Erro ao tentar remover ADM do dono:", err);
    await enviarMensagem("❌ Não foi possível remover seu ADM. O WhatsApp pode estar lento.");
  }
};