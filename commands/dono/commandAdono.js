const { donoBot } = require('../../settings.json');

async function commandAdono(sock, msg, args, groupMetadata) {
  const grupoId = msg.key.remoteJid;

  if (!grupoId.endsWith('@g.us')) {
    return await sock.sendMessage(grupoId, { text: '❌ Este comando só pode ser usado em grupos.' });
  }


  const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
  const botParticipante = groupMetadata.participants.find(p => p.id === botId);

  if (!botParticipante || !['admin', 'superadmin'].includes(botParticipante.admin)) {
  return await sock.sendMessage(grupoId, { text: '❌ Eu preciso ser administrador para promover o dono.' });
}

  const donosJIDs = donoBot.map(num => num + '@s.whatsapp.net');


  const donoNoGrupo = groupMetadata.participants.find(p => donosJIDs.includes(p.id));
  if (!donoNoGrupo) {
    return await sock.sendMessage(grupoId, { text: '❌ O dono do bot não está neste grupo.' });
  }

  const donoJid = donoNoGrupo.id;


  if (donoNoGrupo.admin === 'admin' || donoNoGrupo.admin === 'superadmin') {
    return await sock.sendMessage(grupoId, { text: '⚠️ O dono já é administrador.' });
  }


  await sock.groupParticipantsUpdate(grupoId, [donoJid], 'promote');
  await sock.sendMessage(grupoId, { text: '✅ O Meu  dono agora é administrador do grupo! 👑' });
}

module.exports = { commandAdono };