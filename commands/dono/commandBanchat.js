const settings = require("../../settings.json");
const OWNER_NUMBERS = settings.ownerNumber; 

const normalizeJid = (jid) => jid.replace(/@c\.us$/, "@s.whatsapp.net");

exports.commandBanchat = async (sock, messageDetails, args, permissions, enviarMensagem) => {
  const from = messageDetails.key.remoteJid;
  const sender = normalizeJid(messageDetails.key.participant || messageDetails.key.remoteJid);

  const isOwnerBot = OWNER_NUMBERS.some(num => sender === num + "@s.whatsapp.net");

  if (!isOwnerBot) {
    await enviarMensagem("❌ Somente o dono do bot pode usar esse comando.");
    return;
  }

  if (!from.endsWith("@g.us")) {
    await enviarMensagem("❌ Esse comando só pode ser usado em grupos.");
    return;
  }

  if (!args[0] || args[0].toLowerCase() !== "confirmar") {
    await enviarMensagem(
      "⚠️ Esse comando vai remover todos os membros do grupo, inclusive *admins*.\n\n" +
      "Se tiver certeza, envie:\n*!banchat confirmar*"
    );
    return;
  }

  if (!permissions.isBotAdmin) {
    await enviarMensagem("❌ Eu preciso ser *admin* para remover os membros.");
    return;
  }

  const metadata = await sock.groupMetadata(from);
  const participantes = metadata.participants || [];

  const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";

  const remover = participantes
    .filter((p) => {
      const id = normalizeJid(p.id);
      const ehOwner = OWNER_NUMBERS.some(num => id === num + "@s.whatsapp.net");
      const ehBot = id === botId;
      const ehCriador = id === metadata.owner;
      return !ehOwner && !ehBot && !ehCriador;
    })
    .map(p => p.id);

  if (remover.length === 0) {
    await enviarMensagem("⚠️ Nenhum membro para remover.");
    return;
  }

  await enviarMensagem(`⚠️ Removendo ${remover.length} membros (exceto criador, dono e bot)...`);

  for (const jid of remover) {
    try {
      await sock.groupParticipantsUpdate(from, [jid], "remove");
    } catch {}
  }

  await enviarMensagem("✅ Remoção concluída.");
};