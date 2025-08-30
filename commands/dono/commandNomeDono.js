const fs = require("fs");
const path = require("path");
const settingsPath = path.join(__dirname, "../../settings.json");

async function commandNomeDono(sock, messageDetails, args, enviarMensagem) {
    if (!args.length) {
        await enviarMensagem(`❌ Use: ${prefix}nome_dono add|r NomeAqui`);
        return;
    }

    const action = args[0].toLowerCase();
    const name = args.slice(1).join(" ").trim();

    if (!name) {
        await enviarMensagem("❌ Você precisa informar um nome.");
        return;
    }

    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    if (!Array.isArray(settings.DONO_BOT)) settings.DONO_BOT = [settings.DONO_BOT];

    if (action === "add") {
        if (settings.DONO_BOT.includes(name)) {
            await enviarMensagem(`❌ O nome "${name}" já está na lista.`);
            return;
        }
        settings.DONO_BOT.push(name);
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        await enviarMensagem(`✅ Nome "${name}" adicionado aos donos.`);
    } else if (action === "r") {
        if (!settings.DONO_BOT.includes(name)) {
            await enviarMensagem(`❌ O nome "${name}" não está na lista de donos.`);
            return;
        }
        settings.DONO_BOT = settings.DONO_BOT.filter(n => n !== name);
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        await enviarMensagem(`✅ Nome "${name}" removido dos donos.`);
    } else {
        await enviarMensagem("❌ Ação inválida! Use add ou r.");
    }
}

module.exports = { commandNomeDono };