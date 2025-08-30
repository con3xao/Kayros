const { DONO_BOT } = require("../../settings");

async function commandDono(sock, messageDetails, enviarMensagem) {
    try {
        if (!DONO_BOT || DONO_BOT.length === 0) {
            return enviarMensagem("❌ Nenhum dono cadastrado.");
        }

        const listaDonos = DONO_BOT.map((numero, i) => `${i + 1}. ${numero}`).join("\n");

        await enviarMensagem(`👑 Lista dos meus donos :\n\n${listaDonos}`);
    } catch (err) {
        console.error("Erro em commandDono:", err);
        await enviarMensagem("❌ Ocorreu um erro ao mostrar a lista de donos.");
    }
}

module.exports = { commandDono };