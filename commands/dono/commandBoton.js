const fs = require("fs");
const path = require("path");

exports.execute = async (sock, messageDetails, enviarMensagem, isOwner) => {
  if (!isOwner) {
    await enviarMensagem("❌ Apenas o dono pode me ligar  novamente!");
    return;
  }

  const statusPath = path.join(__dirname, "../../data/botStatus.json");

  try {
    fs.writeFileSync(statusPath, JSON.stringify({ status: "on" }, null, 2));
    await enviarMensagem("✅ ligado com sucesso!");
  } catch (err) {
    console.error("Erro ao ligar:", err);
    await enviarMensagem("❌ Ocorreu um erro ao ligar o bot.");
  }
};