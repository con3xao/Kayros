
const { verifyPermissions } = require('../../verifyPermissions');

async function commandDeletar(sock, msg, args, from, participant, isGroup, isAdmin) {
  try {

    if (isGroup && !isAdmin) {
      await sock.sendMessage(from, { text: '❌ Você precisa ser admin para usar este comando.' }, { quoted: msg });
      return;
    }

    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted) {
      await sock.sendMessage(from, { text: '⚠️ Responda à mensagem que deseja deletar.' }, { quoted: msg });
      return;
    }

    const keyToDelete = msg.message.extendedTextMessage.contextInfo;

    if (!keyToDelete.stanzaId && !keyToDelete.id && !keyToDelete.key?.id) {
      await sock.sendMessage(from, { text: '❌ Não foi possível identificar a mensagem para deletar.' }, { quoted: msg });
      return;
    }

    const deleteKey = {
      remoteJid: from,
      fromMe: false,
      id: keyToDelete.stanzaId || keyToDelete.id || keyToDelete.key?.id,
      participant: keyToDelete.participant || participant,
    };

    await sock.sendMessage(from, { delete: deleteKey });

    await sock.sendMessage(from, { text: '🗑️ Mensagem deletada com sucesso!' }, { quoted: msg });

  } catch (err) {
    console.error('Erro no comando deletar:', err);
    await sock.sendMessage(from, { text: '❌ Erro ao tentar deletar a mensagem.' }, { quoted: msg });
  }
}

module.exports = { commandDeletar };