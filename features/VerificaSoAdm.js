const fs = require('fs');
const path = './data/soAdmSettings.json';

function estaAtivo(groupId) {
  if (!fs.existsSync(path)) return false;
  const data = JSON.parse(fs.readFileSync(path));
  return data[groupId] === true;
}

function ativar(groupId) {
  let data = {};
  if (fs.existsSync(path)) {
    data = JSON.parse(fs.readFileSync(path));
  }
  data[groupId] = true;
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function desativar(groupId) {
  let data = {};
  if (fs.existsSync(path)) {
    data = JSON.parse(fs.readFileSync(path));
  }
  data[groupId] = false;
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

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

  // Logs para debug
  console.log("Sender:", sender);
  console.log("Admins:", admins);

  const normalizeJid = jid => (jid || '').replace(/@c.us$/, '@s.whatsapp.net');
  const normalizedSender = normalizeJid(sender);
  const normalizedAdmins = admins.map(normalizeJid);

  // Mais logs
  console.log("Normalized Sender:", normalizedSender);
  console.log("Normalized Admins:", normalizedAdmins);

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

module.exports = { commandSoAdm, ativar, desativar, estaAtivo };