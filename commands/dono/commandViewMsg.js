const fs = require("fs");
const path = require("path");
const { ownerNumber } = require("../../settings.json");

const settingsPath = path.join(__dirname, "../../settings.json");

async function commandViewMsg(sock, messageDetails, args, enviarMensagem) {
    try {
        const sender = messageDetails?.key?.participant || messageDetails?.key?.remoteJid;
        if (!ownerNumber.includes(sender?.replace(/@s.whatsapp.net/, ""))) {
            await enviarMensagem("❌ Apenas o meu dono podem usar este comando.");
            return;
        }

        if (!args.length || !["on", "off"].includes(args[0].toLowerCase())) {
            await enviarMensagem(`❌ Use: ${prefix}viewmsg on/off`);
            return;
        }

        const newValue = args[0].toLowerCase() === "on";
        
        const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
        settings.VIEW_MESSAGES = newValue;

        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

        await enviarMensagem(`✅  visualização de mensagens agora está *${newValue ? "ON" : "OFF"}*`);

    } catch (err) {
        console.error("Erro no comando viewmsg:", err);
        await enviarMensagem("❌ Ocorreu um erro ao executar o comando.");
    }
}

module.exports = { commandViewMsg };