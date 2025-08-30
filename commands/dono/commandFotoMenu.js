const fs = require("fs");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

const menuPath = path.join(__dirname, "../../assets/menu/menu.jpg");

async function commandFotoMenu(sock, msg, enviarMensagem, isOwner) {
  try {
    if (!isOwner) {
      await enviarMensagem("⛔ Apenas o meu dono pode alterar a foto do menu.");
      return;
    }


    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const isImage = msg.message?.imageMessage || quoted?.imageMessage;

    if (!isImage) {
      await enviarMensagem("❌ Marque ou envie uma *foto* para definir como menu.");
      return;
    }

    const mediaMessage = isImage || quoted.imageMessage;
    const buffer = await downloadMediaMessage(
      { message: { imageMessage: mediaMessage } },
      "buffer",
      {}
    );

    fs.writeFileSync(menuPath, buffer);

    await enviarMensagem("✅ Foto do menu atualizada com sucesso!");
  } catch (err) {
    console.error("Erro ao atualizar foto do menu:", err);
    await enviarMensagem("❌ Ocorreu um erro ao atualizar a foto do menu.");
  }
}

module.exports = { commandFotoMenu };