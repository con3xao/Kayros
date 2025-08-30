const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

async function handleAudioCommand(sock, messageDetails, commandName, enviarMensagem) {
    try {
        const quoted = messageDetails.quoted;
        if (!quoted || !quoted.audioMessage) {
            return enviarMensagem("❌ Responda a um áudio para aplicar o efeito!");
        }


        const audioBuffer = await sock.downloadMediaMessage(quoted);
        const inputPath = path.join(__dirname, "input.ogg");
        const outputPath = path.join(__dirname, "output.ogg");

        fs.writeFileSync(inputPath, audioBuffer);


        let filter = "";
        switch (commandName) {
            case "grave":
                filter = "asetrate=44100*0.8,atempo=1.2,aresample=44100";
                break;
            case "agudo":
                filter = "asetrate=44100*1.25,atempo=1.1,aresample=44100";
                break;
            case "reverse":
                filter = "areverse";
                break;
            case "robo":
                filter = "afftfilt=real='re*0.5':imag='im*0.5'";
                break;
            case "eco":
                filter = "aecho=0.8:0.9:1000:0.3";
                break;
            case "helio":
                filter = "asetrate=44100*1.6,atempo=1.4,aresample=44100";
                break;
            case "caverna":
                filter = "aecho=0.8:0.88:60:0.4";
                break;
            default:
                return enviarMensagem("❌ Efeito não reconhecido.");
        }


        await new Promise((resolve, reject) => {
            exec(`ffmpeg -y -i "${inputPath}" -af "${filter}" "${outputPath}"`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        const processed = fs.readFileSync(outputPath);

        await sock.sendMessage(messageDetails.from, { audio: processed, mimetype: "audio/ogg", ptt: true }, { quoted: messageDetails });


        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);

    } catch (e) {
        console.error(e);
        enviarMensagem("❌ Erro ao processar o áudio.");
    }
}

module.exports = { handleAudioCommand };