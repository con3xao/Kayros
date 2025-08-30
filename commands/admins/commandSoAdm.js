const { ativar, desativar, estaAtivo } = require("../../utils/soAdmUtils");

const normalizeJid = jid => (jid || '').replace(/@c.us$/, '@s.whatsapp.net');

async function commandSoAdm(sock, msg, enviarMensagem) {
  const grupoId = msg.key.remoteJid;

  if (!grupoId.endsWith("@g.us")) {
    await enviarMensagem("❌ Esse comando só pode ser usado em grupos.");
    return;
  }

  const metadata = await sock.groupMetadata(grupoId);
  const sender = msg.key.participant || msg.key.remoteJid;

  const admins = metadata.participants
    .filter(p => p.admin === "admin" || p.admin === "superadmin")
    .map(p => p.id);

  const normalizedSender = normalizeJid(sender);
  const normalizedAdmins = admins.map(normalizeJid);

  if (!normalizedAdmins.includes(normalizedSender)) {
    await enviarMensagem("🚫 Apenas administradores podem usar esse comando.");
    return;
  }

  if (estaAtivo(grupoId)) {
    desativar(grupoId);
    await enviarMensagem("✅ Modo *só admins* desativado. Todos podem usar o bot.");
  } else {
    ativar(grupoId);
    await enviarMensagem("🚨 Modo *só admins* ativado! Agora apenas administradores podem usar comandos.");
  }
}

module.exports = { commandSoAdm };