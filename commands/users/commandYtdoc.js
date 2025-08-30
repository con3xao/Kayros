const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "ytdoc",
  description: "Baixa vídeo do YouTube e envia como documento",
  category: "users",
  async execute(sock, messageDetails, args, enviarMensagem) {
    const url = args[0];
    if (!url || !url.includes("youtube.com") && !url.includes("youtu.be")) {
      return enviarMensagem("❌ Envie um link válido do YouTube.");
    }

    const id = Date.now();
    const outputName = `video_${id}.mp4`;
    const outputPath = path.join(__dirname, "..", "..", "assets", outputName);

    await enviarMensagem("⏳ Baixando o vídeo, aguarde 1 minuto...");

    const comando = `yt-dlp -f 'bv*+ba/b' --merge-output-format mp4 -o "${outputPath}" "${url}"`;

    exec(comando, async (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return enviarMensagem("❌ Erro ao baixar o vídeo com yt-dlp.");
      }

      try {
        await sock.sendMessage(messageDetails.key.remoteJid, {
          document: fs.readFileSync(outputPath),
          fileName: `video_youtube_kayros.mp4`,
          mimetype: "video/mp4"
        }, { quoted: messageDetails });

        fs.unlinkSync(outputPath);
      } catch (e) {
        console.error(e);
        await enviarMensagem("❌ Ocorreu um erro ao enviar o vídeo.");
      }
    });
  }
};