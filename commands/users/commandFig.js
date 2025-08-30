const fs = require("fs");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { spawn } = require("child_process");

async function commandFig(sock, m, userName = "kayros") {
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const imageMessage = m.message?.imageMessage || (quoted && quoted.imageMessage);

  if (!imageMessage) {
    await sock.sendMessage(
      m.key.remoteJid,
      { text: "❌ Envie uma imagem com o comando !fig (ou responda uma imagem)" },
      { quoted: m }
    );
    return;
  }

  const mediaMsg = quoted ? { message: quoted } : m;
  const buffer = await downloadMediaMessage(mediaMsg, "buffer", {}, { reuploadRequest: sock.updateMediaMessage });

  const tempDir = "./temp";

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const inputPath = tempDir + "/input.jpg";
  const signedPath = tempDir + "/signed.png";
  const outputPath = tempDir + "/sticker.webp";

  fs.writeFileSync(inputPath, buffer);

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i", inputPath,
      "-vf", "drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='feito por @" + userName + "':fontcolor=white:fontsize=24:x=10:y=10:box=1:boxcolor=black@0.5",
      "-y",
      signedPath
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error("Erro ao colocar texto com ffmpeg"));
    });
  });


  await new Promise((resolve, reject) => {
    const cwebp = spawn("cwebp", [signedPath, "-o", outputPath]);
    cwebp.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error("Erro ao converter para webp"));
    });
  });


  const webpBuffer = fs.readFileSync(outputPath);
  await sock.sendMessage(m.key.remoteJid, { sticker: webpBuffer }, { quoted: m });


  fs.unlinkSync(inputPath);
  fs.unlinkSync(signedPath);
  fs.unlinkSync(outputPath);
}

module.exports = commandFig;