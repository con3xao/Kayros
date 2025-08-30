const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

async function baixarVideo(quoted) {
    const stream = await downloadContentFromMessage(quoted.videoMessage, 'video');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

async function aplicarFiltro(sock, messageDetails, enviarMensagem, filtroVideo, filtroAudio) {
    const quoted = messageDetails?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted?.videoMessage) {
        await enviarMensagem("❌ Responda a um vídeo para aplicar esse efeito!");
        return;
    }

    const videoBuffer = await baixarVideo(quoted);

    return new Promise((resolve, reject) => {
        const tempDir = path.join(__dirname, "../../temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const inputPath = path.join(tempDir, `input_${Date.now()}.mp4`);
        const outputPath = path.join(tempDir, `output_${Date.now()}.mp4`);

        fs.writeFileSync(inputPath, videoBuffer);

        const cmd = `ffmpeg -y -i "${inputPath}" -filter_complex "[0:v]${filtroVideo}[v];[0:a]${filtroAudio}[a]" -map "[v]" -map "[a]" "${outputPath}"`;
        exec(cmd, async (err) => {
            fs.unlinkSync(inputPath);
            if (err) {
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                await enviarMensagem("❌ Erro ao processar o vídeo.");
                return reject(err);
            }

            const result = fs.readFileSync(outputPath);
            fs.unlinkSync(outputPath);

            await sock.sendMessage(messageDetails.key.remoteJid, {
                video: result,
                mimetype: "video/mp4"
            }, { quoted: messageDetails });

            resolve();
        });
    });
}

module.exports = {
    videorapido: async (sock, messageDetails, enviarMensagem) =>
        aplicarFiltro(sock, messageDetails, enviarMensagem, "setpts=0.5*PTS", "atempo=2.0"),

    videolento: async (sock, messageDetails, enviarMensagem) =>
        aplicarFiltro(sock, messageDetails, enviarMensagem, "setpts=2.0*PTS", "atempo=0.5"),

    videoreverse: async (sock, messageDetails, enviarMensagem) =>
        aplicarFiltro(sock, messageDetails, enviarMensagem, "reverse", "areverse"),

    videorobo: async (sock, messageDetails, enviarMensagem) =>
        aplicarFiltro(sock, messageDetails, enviarMensagem, "hue=s=0,setpts=0.7*PTS", "atempo=1.4")
};