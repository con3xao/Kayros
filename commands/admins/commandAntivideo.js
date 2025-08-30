const fs = require("fs");
const path = require("path");

const SETTINGS_PATH = path.join(__dirname, "../../data/antiVideoSettings.json");

module.exports.commandAntivideo = async (sock, m, from, args, isAdmin, enviarMensagem) => {

  if (from.endsWith("@g.us")) {
    const metadata = await sock.groupMetadata(from);
    const sender = m.key.participant || m.key.remoteJid;
    const admins = metadata.participants
      .filter(p => p.admin === "admin" || p.admin === "superadmin")
      .map(p => p.id);

    if (!admins.includes(sender)) {
      await enviarMensagem("❌ Apenas administradores podem usar este comando.");
      return;
    }
  }

  let config = {};
  if (fs.existsSync(SETTINGS_PATH)) {
    config = JSON.parse(fs.readFileSync(SETTINGS_PATH));
  }

  const modo = args[0]?.toLowerCase();

  if (modo === "on") {
    config[from] = true;
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(config));
    await enviarMensagem("✅ Antivideo ativado. Vídeos serão apagados e reincidentes removidos.");
  } else if (modo === "off") {
    config[from] = false;
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(config));
    await enviarMensagem("❌ Antivideo desativado.");
  } else {
    await enviarMensagem("ℹ️ Use: !antivideo on ou !antivideo off");
  }
};