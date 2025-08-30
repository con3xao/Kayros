const path = require("path");
const { imageToWebp, writeExif } = require("../../utils/stickerUtilsRename");

async function commandRename(sock, msg, args, mediaInfo) {
  try {
    if (!mediaInfo || !mediaInfo.buffer) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Você precisa enviar ou responder a figurinha!"
      }, { quoted: msg });
      return;
    }

    if (!args.length || !args.join(" ").includes("/")) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Use o comando no formato: pacote / autor"
      }, { quoted: msg });
      return;
    }

    const [pack, author] = args.join(" ")
      .split("/")
      .map(a => a.trim())
      .filter(Boolean);

    if (!pack || !author) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Pacote ou autor inválido."
      }, { quoted: msg });
      return;
    }

    let bufferWebp = mediaInfo.buffer;
    if (!mediaInfo.mimetype.includes("webp")) {
      bufferWebp = await imageToWebp(mediaInfo.buffer);
    }

    const finalBuffer = await writeExif(bufferWebp, { packname: pack, author });

    await sock.sendMessage(msg.key.remoteJid, { sticker: finalBuffer }, { quoted: msg });

  } catch (err) {
    console.error("Erro no rename:", err);
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Ocorreu um erro ao renomear a figurinha."
    }, { quoted: msg });
  }
}

module.exports = { commandRename };