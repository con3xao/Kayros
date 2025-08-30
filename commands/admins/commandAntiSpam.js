const fs = require("fs");
const path = require("path");
const antiSpamPath = path.join(__dirname, "..", "..", "data", "antiSpam.json");

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

module.exports = {
  name: "antispam",
  async execute(sock, msg, args, enviarMensagem, isGroupAdmin) {
    const from = msg.key.remoteJid;
    if (!from.endsWith("@g.us")) {
      return await enviarMensagem("❌ Esse comando só pode ser usado em grupos.");
    }

    if (!isGroupAdmin) {
      return await enviarMensagem("❌ Apenas admins podem usar este comando.");
    }

    const config = carregarConfiguracoes();
    if (!config[from]) config[from] = { ativo: false };

    const arg = (args[0] || "").toLowerCase();
    if (arg === "on") {
      config[from].ativo = true;
      salvarConfiguracoes(config);
      await enviarMensagem("✅ Anti-spam ativado com sucesso!");
    } else if (arg === "off") {
      config[from].ativo = false;
      salvarConfiguracoes(config);
      await enviarMensagem("❌ Anti-spam desativado.");
    } else {
      await enviarMensagem("⚙️ Use: !antispam on | off");
    }
  }
};