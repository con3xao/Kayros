const fs = require("fs");
const path = require("path");

const SETTINGS_PATH = path.join(__dirname, "../../data/antiFotoSettings.json");

module.exports.commandAntifoto = async (sock, m, from, args, isAdmin, enviarMensagem) => {
  if (!isAdmin) {
    await enviarMensagem("❌ Apenas administradores podem usar este comando.");
    return;
  }

  let config = {};
  if (fs.existsSync(SETTINGS_PATH)) {
    config = JSON.parse(fs.readFileSync(SETTINGS_PATH));
  }

  const modo = args[0]?.toLowerCase();

  if (modo === "on") {
    config[from] = true;
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(config));
    await enviarMensagem("✅ Antifoto ativado. Imagens serão apagadas e reincidentes removidos.");
  } else if (modo === "off") {
    config[from] = false;
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(config));
    await enviarMensagem("❌ Antifoto desativado.");
  } else {
    await enviarMensagem("ℹ️ Use: !antifoto on ou !antifoto off");
  }
};