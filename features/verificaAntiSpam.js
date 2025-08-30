const fs = require("fs");
const path = require("path");

const spamData = new Map(); 

const antiSpamPath = path.join(__dirname, "..", "data", "antiSpam.json");

function carregarConfiguracoes() {
  try {
    return JSON.parse(fs.readFileSync(antiSpamPath));
  } catch {
    return {};
  }
}

function salvarConfiguracoes(configs) {
  fs.writeFileSync(antiSpamPath, JSON.stringify(configs, null, 2));
}

async function verificaAntiSpam(sock, msg) {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;
  const isGroup = from.endsWith("@g.us");

  if (!isGroup) return;

  const config = carregarConfiguracoes();
  const ativado = config[from]?.ativo;

  if (!ativado) return;

  const agora = Date.now();
  const key = `${from}-${sender}`;

  if (!spamData.has(key)) {
    spamData.set(key, []);
  }

  spamData.get(key).push(agora);

  const ultimos = spamData.get(key).filter(ts => agora - ts < 10000);
  spamData.set(key, ultimos);

  if (ultimos.length > 5) {
    await sock.sendMessage(from, {
      text: `🚫 @${sender.split("@")[0]}, pare de flodar o grupo!`,
      mentions: [sender],
    });

    spamData.set(key, []); 
  }
}

module.exports = verificaAntiSpam;