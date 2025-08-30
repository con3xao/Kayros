const fs = require("fs");
const path = require("path");

const antifakePath = path.join(__dirname, "..", "..", "data", "antifakeSettings.json");

if (!fs.existsSync(antifakePath)) {
  fs.writeFileSync(antifakePath, JSON.stringify({}));
}

async function commandAntifake(sock, messageDetails, args, from, isGroup, isAdmin, isBotAdmin, enviarMensagem) {
  if (!isGroup) {
    await enviarMensagem("❌ Esse comando só pode ser usado em grupos.");
    return;
  }

  if (!isAdmin || !isBotAdmin) {
    await enviarMensagem("❌ Apenas admins e eu podem usar esse comando.");
    return;
  }

  const settings = JSON.parse(fs.readFileSync(antifakePath, "utf-8"));
  const status = args[0]?.toLowerCase();

  if (status === "on") {
    settings[from] = true;
    fs.writeFileSync(antifakePath, JSON.stringify(settings, null, 2));
    await enviarMensagem("✅ Antifake ativado! Apenas números com DDI +55 poderão entrar no grupo.");
  } else if (status === "off") {
    delete settings[from];
    fs.writeFileSync(antifakePath, JSON.stringify(settings, null, 2));
    await enviarMensagem("❌ Antifake desativado! Agora qualquer número pode entrar.");
  } else {
    await enviarMensagem("❗ Use: !antifake on ou !antifake off");
  }
}

module.exports = { commandAntifake, antifakePath };