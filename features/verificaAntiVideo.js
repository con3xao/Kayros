const fs = require("fs");
const path = require("path");

const SETTINGS_PATH = path.join(__dirname, "../data/antiVideoSettings.json");
const INFRA_PATH = path.join(__dirname, "../data/infraçõesVideo.json");

async function verificaAntivideo(sock, m) {
  const groupId = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;

  // Ignorar se não for grupo ou não for vídeo
  if (!groupId.endsWith("@g.us") || !m.message?.videoMessage) return;

  // Ignorar mensagens do próprio bot
  if (m.key.fromMe) return;

  // Verifica se antivideo está ativado
  if (!fs.existsSync(SETTINGS_PATH)) return;
  const config = JSON.parse(fs.readFileSync(SETTINGS_PATH));
  if (!config[groupId]) return;

  // Verifica se é admin
  const metadata = await sock.groupMetadata(groupId);
  const admins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);
  if (admins.includes(sender)) return;

  // Apaga o vídeo
  await sock.sendMessage(groupId, { delete: m.key });

  // Lê infrações
  let infracoes = {};
  if (fs.existsSync(INFRA_PATH)) {
    infracoes = JSON.parse(fs.readFileSync(INFRA_PATH));
  }

  if (!infracoes[groupId]) infracoes[groupId] = {};
  if (!infracoes[groupId][sender]) infracoes[groupId][sender] = 0;

  infracoes[groupId][sender]++;

  const chancesRestantes = 3 - infracoes[groupId][sender];

  if (infracoes[groupId][sender] >= 3) {
    await sock.sendMessage(groupId, {
      text: `🚫 Usuário @${sender.split("@")[0]} foi removido por enviar vídeos repetidamente.`,
      mentions: [sender],
    });
    await sock.groupParticipantsUpdate(groupId, [sender], "remove");
    infracoes[groupId][sender] = 0;
  } else {
    await sock.sendMessage(groupId, {
      text: `⚠️ Vídeos não são permitidos neste grupo.\n@${sender.split("@")[0]}, você tem mais ${chancesRestantes} chance(s) antes de ser removido.`,
      mentions: [sender],
    });
  }

  fs.writeFileSync(INFRA_PATH, JSON.stringify(infracoes, null, 2));
}

module.exports = { verificaAntivideo };