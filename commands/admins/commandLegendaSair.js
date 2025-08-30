const fs = require("fs");
const path = require("path");

const legendaSairPath = path.resolve(__dirname, "../../data/legendaSairSettings.json");

function readLegendaSairSettings() {
  if (!fs.existsSync(legendaSairPath)) return {};
  return JSON.parse(fs.readFileSync(legendaSairPath, "utf-8"));
}

function writeLegendaSairSettings(data) {
  fs.writeFileSync(legendaSairPath, JSON.stringify(data, null, 2));
}

async function commandLegendaSair(sock, from, args, enviarMensagem, isAdmin) {
  if (!isAdmin) {
    await enviarMensagem("❌ Apenas admins podem usar esse comando.");
    return;
  }

  const settings = readLegendaSairSettings();

  if (!settings[from]) {
    settings[from] = {
      enabled: true,
      saiu: "saiu do grupo, adeus."
    };
  }

  if (!args || args.length === 0) {
    await enviarMensagem("❓ Use: !legendasaiu on/off\n!legendasaiu <mensagem>");
    return;
  }

  const texto = args.join(" ");

  if (texto.toLowerCase() === "on") {
    settings[from].enabled = true;
    writeLegendaSairSettings(settings);
    await enviarMensagem("✅ Mensagem de saída ativada!");
    return;
  } else if (texto.toLowerCase() === "off") {
    settings[from].enabled = false;
    writeLegendaSairSettings(settings);
    await enviarMensagem("✅ Mensagem de saída desativada!");
    return;
  }

  settings[from].saiu = texto;
  writeLegendaSairSettings(settings);

  await enviarMensagem(
    "✅ Mensagem de saída atualizada!\n\nExemplo:\n" +
      `@usuaro, ${texto}`
  );
}

module.exports = { commandLegendaSair, readLegendaSairSettings, writeLegendaSairSettings };