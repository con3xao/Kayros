const fs = require("fs");
const path = require("path");

const welcomeSettingsPath = path.resolve(
  __dirname,
  "../../data/welcomeSettings.json"
);

function readWelcomeSettings() {
  if (!fs.existsSync(welcomeSettingsPath)) return {};
  return JSON.parse(fs.readFileSync(welcomeSettingsPath));
}

function writeWelcomeSettings(data) {
  fs.writeFileSync(welcomeSettingsPath, JSON.stringify(data, null, 2));
}

async function commandWelcome(sock, from, args, enviarMensagem, isAdmin) {
  if (!isAdmin) {
    await enviarMensagem("❌ Apenas admins podem usar esse comando.");
    return;
  }

  if (args.length === 0) {
    await enviarMensagem(
      "❓ Use:\n!bemvindo on/off\n!bemvindo setwelcome <mensagem>"
    );
    return;
  }

  const option = args[0].toLowerCase();
  const settings = readWelcomeSettings();

  if (option === "on") {
    if (!settings[from]) settings[from] = {};
    settings[from].enabled = true;
    writeWelcomeSettings(settings);
    await enviarMensagem("✅ Welcome ativado neste grupo.");
  } else if (option === "off") {
    if (!settings[from]) settings[from] = {};
    settings[from].enabled = false;
    writeWelcomeSettings(settings);
    await enviarMensagem("❌ Welcome desativado neste grupo.");
  } else if (option === "setwelcome") {
    let newMessage = args.slice(1).join(" ");

    if (!newMessage) {
      await enviarMensagem("⚠️ Digite a mensagem de boas-vindas.");
      return;
    }

    // Coloca automaticamente o @{{numero}} depois de "bem vindo"
    newMessage = newMessage.replace(
      /(bem\s+vindo(?:a)?|bem\s+vinda)/i,
      "$1 @{{numero}}"
    );

    // Garante que sempre terá {{grupo}} no final
    if (!newMessage.includes("{{grupo}}")) {
      newMessage += " no grupo *{{grupo}}*";
    }

    if (!settings[from]) settings[from] = { enabled: true };
    settings[from].message = newMessage;
    writeWelcomeSettings(settings);

    await enviarMensagem(
      "✅ Mensagem de boas-vindas atualizada!\n\nExemplo:\n" +
        newMessage
          .replace(/@{{numero}}/g, "@5511999999999")
          .replace(/{{grupo}}/g, "NomeDoGrupo")
    );
  } else {
    await enviarMensagem(
      "❓ Opção inválida. Use:\n!bemvindo on/off\n!bemvindo setwelcome <mensagem>"
    );
  }
}

module.exports = { commandWelcome, readWelcomeSettings };