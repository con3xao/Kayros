const fs = require("fs");
const path = require("path");

exports.execute = async (sock, messageDetails, enviarMensagem, isOwner) => {
  if (!isOwner) {
    await enviarMensagem("❌ Apenas o dono pode desligar o bot.");
    return;
  }

  const statusPath = path.join(__dirname, "../../data/botStatus.json");

  try {
    fs.writeFileSync(statusPath, JSON.stringify({ status: "off" }, null, 2));
    await enviarMensagem("🛑 Bot desligado com sucesso!");
  } catch (err) {
    console.error("Erro ao desligar o bot:", err);
    await enviarMensagem("❌ Ocorreu um erro ao desligar o bot.");
  }
};