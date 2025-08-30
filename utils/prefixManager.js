const fs = require("fs");
const path = require("path");

// agora apontando para settings.json
const settingsPath = path.join(__dirname, "../settings.json");

function getPREFIX() {
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    return settings.PREFIX || ".";
  } catch (err) {
    console.error("Erro ao ler o prefixo:", err);
    return ".";
  }
}

function setPREFIX(newPREFIX) {
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    settings.PREFIX = newPREFIX;
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (err) {
    console.error("Erro ao salvar o prefixo:", err);
  }
}

module.exports = { getPREFIX, setPREFIX };