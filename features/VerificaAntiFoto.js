const fs = require("fs");
const path = require("path");

const SETTINGS_PATH = path.join(__dirname, "../data/antiFotoSettings.json");
const INFRA_PATH = path.join(__dirname, "../data/infraçõesFoto.json");

async function verificaAntifoto(sock, m) {
  const groupId = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;


  if (!groupId.endsWith("@g.us") || !m.message?.imageMessage) return;


  if (m.key.fromMe) return;


  if (!fs.existsSync(SETTINGS_PATH)) return;
  const config = JSON.parse(fs.readFileSync(SETTINGS_PATH));
  if (!config[groupId]) return;


  const metadata = await sock.groupMetadata(groupId);
  const admins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);
  if (admins.includes(sender)) return;


  await sock.sendMessage(groupId, { delete: m.key });


  let infracoes = {};
  if (fs.existsSync(INFRA_PATH)) {
    infracoes = JSON.parse(fs.readFileSync(INFRA_PATH));
  }
  if (!infracoes[groupId]) infracoes[groupId] = {};
  if (!infracoes[groupId][sender]) infracoes[groupId][sender] = 0;

  infracoes[groupId][sender]++;

  if (infracoes[groupId][sender] >= 3) {
    await sock.groupParticipantsUpdate(groupId, [sender], "remove");
    await sock.sendMessage(groupId, {
      text: `🚫 Usuário @${sender.split("@")[0]} foi removido por enviar imagens repetidas.`,
      mentions: [sender],
    });
    infracoes[groupId][sender] = 0;
  } else {
    const chancesLeft = 3 - infracoes[groupId][sender];
    await sock.sendMessage(groupId, {
      text: `⚠️ Imagens não são permitidas neste grupo.\n@${sender.split("@")[0]}, você tem mais ${chancesLeft} chance(s) antes de ser removido.`,
      mentions: [sender],
    });
  }

  fs.writeFileSync(INFRA_PATH, JSON.stringify(infracoes, null, 2));
}

module.exports = { verificaAntifoto };