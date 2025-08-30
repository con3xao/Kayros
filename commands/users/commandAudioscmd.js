const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

async function processAudioEffect(audioBuffer, effect) {
    return new Promise((resolve, reject) => {
        const tempDir = path.join(__dirname, "../../temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const inputPath = path.join(tempDir, `input_${Date.now()}.mp3`);
        const outputPath = path.join(tempDir, `output_${Date.now()}.mp3`);
        fs.writeFileSync(inputPath, audioBuffer);

        let filter = "";
        switch (effect) {
            case "grave": filter = "asetrate=44100*0.8,atempo=1.2,aresample=44100"; break;
            case "agudo": filter = "asetrate=44100*1.25,atempo=1.1,aresample=44100"; break;
            case "reverse": filter = "areverse"; break;
            case "robo": filter = "afftfilt=real='re*0.5':imag='im*0.5'"; break;
            case "eco": filter = "aecho=0.8:0.9:1000:0.3"; break;
            case "helio": filter = "asetrate=44100*1.6,atempo=1.4,aresample=44100"; break;
            case "caverna": filter = "aecho=0.8:0.88:60:0.4"; break;
            default:
                fs.unlinkSync(inputPath);
                return reject(new Error("❌ Efeito inválido: " + effect));
        }

        exec(`ffmpeg -y -i "${inputPath}" -af "${filter}" "${outputPath}"`, (err) => {
            fs.unlinkSync(inputPath);
            if (err) {
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                return reject(err);
            }

            const processed = fs.readFileSync(outputPath);
            fs.unlinkSync(outputPath);
            resolve(processed);
        });
    });
}

async function aplicarEfeitoDeAudio(sock, messageDetails, enviarMensagem, efeito) {
    try {
        let audioMessageObj;

        const quoted = messageDetails?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quoted?.audioMessage) {
            audioMessageObj = { audioMessage: quoted.audioMessage };
        } 

        else if (messageDetails?.message?.audioMessage) {
            audioMessageObj = { audioMessage: messageDetails.message.audioMessage };
        }

        if (!audioMessageObj) {
            await enviarMensagem("❌ Responda ou envie um áudio/PTT para aplicar o efeito!");
            return;
        }

        const audioBuffer = await downloadMediaMessage({ message: audioMessageObj }, "buffer");


        const processedBuffer = await processAudioEffect(audioBuffer, efeito);

        await sock.sendMessage(messageDetails.key.remoteJid, {
            audio: processedBuffer,
            mimetype: "audio/mpeg",
            ptt: true,
        });

    } catch (err) {
        await enviarMensagem("❌ Ocorreu um erro ao processar o áudio.");
    }
}

module.exports = { aplicarEfeitoDeAudio };