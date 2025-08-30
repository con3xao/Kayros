const fs = require("fs");
const path = require("path");
const { imageToWebp } = require("../../utils/stickerUtils");

async function commandFigAleatoria(sock, messageDetails, enviarMensagem, sendSticker) {
    try {
        const figurinhasPath = path.join(__dirname, "../../assets/figurinhas");


        if (!fs.existsSync(figurinhasPath)) {
            return enviarMensagem("❌ Pasta 'assets/figurinhas' não encontrada.");
        }

        const files = fs.readdirSync(figurinhasPath).filter(file =>
            file.endsWith(".png") ||
            file.endsWith(".jpg") ||
            file.endsWith(".jpeg") ||
            file.endsWith(".webp")
        );

        if (files.length === 0) {
            return enviarMensagem("❌ Nenhuma figurinha encontrada em 'assets/figurinhas'.");
        }


        const randomFile = files[Math.floor(Math.random() * files.length)];
        const filePath = path.join(figurinhasPath, randomFile);


        let buffer = fs.readFileSync(filePath);


        if (!randomFile.endsWith(".webp")) {
            buffer = await imageToWebp(buffer);
        }

        await sendSticker(buffer);

    } catch (err) {
        console.error("Erro em commandFigAleatoria:", err);
        enviarMensagem("❌ Erro ao enviar figurinha aleatória.");
    }
}

module.exports = { commandFigAleatoria };