const path = require("path");
const fs = require("fs");
const pino = require("pino");
const { 
    default: makeWASocket, 
    DisconnectReason, 
    useMultiFileAuthState, 
    fetchLatestBaileysVersion 
} = require("@whiskeysockets/baileys");

const { verificaSair } = require("./features/verificarSair");
const { verificaAntidoc } = require("./commands/admins/commandAntidoc");
const { verificaAntiaudio } = require("./commands/admins/commandAntiaudio");
const { verificaAntifigu } = require("./features/verificaAntifigu");
const { verificaAntivideo } = require("./features/verificaAntivideo");
const { verificaAntifoto } = require("./features/verificaAntifoto");
const contarMensagem = require("./mensagens/contarMensagem");
const verificaAntiSpam = require("./features/verificaAntiSpam");
const { verificarAntiPrivado } = require("./features/verificaAntiPrivado");
const { handleMessage } = require("./handleCommands");
const { verificaWelcome } = require("./features/verificaWelcome");

const mutedPath = path.join(__dirname, "data", "mutados.json");
if (!fs.existsSync(mutedPath)) fs.writeFileSync(mutedPath, "{}");

const antiaudioPath = path.join(__dirname, "data", "antiaudio.json");
if (!fs.existsSync(antiaudioPath)) fs.writeFileSync(antiaudioPath, "{}");

function getPrefix() {
 try {
   const settings = JSON.parse(fs.readFileSync(path.joi(__dirname, "settings.json")));
      return settings.prefix || "!";
   } catch {
      return "!";
    }
}

async function startBot() {
    const authPath = path.resolve(__dirname, "assets", "auth", "creds");
    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        printQRInTerminal: false,
        markOnlineOnConnect: true,
    });

    const credsPath = path.join(authPath, "creds.json");
    if (!fs.existsSync(credsPath)) {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.question("Digite seu número do WhatsApp (com DDI, ex: 5511999999999): ", async (numero) => {
            try {
                const pairingCode = await sock.requestPairingCode(numero);
                console.log(`🔗 Código de pareamento: ${pairingCode}`);
    } catch (err) {
                console.error("❌ Erro ao gerar código de pareamento:", err);
            }
            readline.close();
        });
    }

    sock.ev.on("messages.upsert", async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg.message) return;

            const from = msg.key.remoteJid;
            const sender = msg.key.participant || msg.key.remoteJid;

            const mutados = JSON.parse(fs.readFileSync(mutedPath));
            if (mutados[sender]) {
                const msgText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
                if (msgText?.toLowerCase().startsWith("!desmutar")) return;

                await sock.sendMessage(from, {
                    delete: { remoteJid: from, fromMe: false, id: msg.key.id, participant: sender }
                });

                mutados[sender].tentativas = (mutados[sender].tentativas || 0) + 1;

                if (mutados[sender].tentativas >= 2) {
                    await sock.groupParticipantsUpdate(from, [sender], "remove");
                    delete mutados[sender];
                }

                fs.writeFileSync(mutedPath, JSON.stringify(mutados, null, 2));
                return;
            }

            if (from.endsWith("@g.us")) {
                const antiaudioData = JSON.parse(fs.readFileSync(antiaudioPath));
                if (antiaudioData[from] && msg.message.audioMessage) {
                    console.log("📢 Áudio detectado:", sender);

                    await sock.sendMessage(from, {
                        delete: { remoteJid: from, fromMe: false, id: msg.key.id, participant: sender }
                    });

                    antiaudioData[from][sender] = (antiaudioData[from][sender] || 0) + 1;
                    fs.writeFileSync(antiaudioPath, JSON.stringify(antiaudioData, null, 2));

                    if (antiaudioData[from][sender] >= 2) {
                        try {
                            await sock.groupParticipantsUpdate(from, [sender], "remove");
                            delete antiaudioData[from][sender];
                            fs.writeFileSync(antiaudioPath, JSON.stringify(antiaudioData, null, 2));
                            await sock.sendMessage(from, {
                                text: `🚫 @${sender.split("@")[0]} removido por enviar áudio no grupo.`,
                                mentions: [sender]
                            });
                        } catch (err) {
                            console.error("Erro ao remover usuário por áudio:", err);
                        }
                    } else {
                        await sock.sendMessage(from, {
                            text: `⚠️ @${sender.split("@")[0]}, envio de áudio não permitido.`,
                            mentions: [sender]
                        });
                    }

                    return;
                }
            }

            await verificaAntidoc(sock, msg);
            await verificaAntiaudio(sock, msg);
            await contarMensagem(msg, from, sender);
            await verificaAntiSpam(sock, msg);
            await verificarAntiPrivado(sock, msg);
            await handleMessage(sock, msg);
            await verificaAntifoto(sock, msg);
            await verificaAntivideo(sock, msg);
            await verificaAntifigu(sock, msg);
        } catch (err) {
            console.error("Erro no sistema de mensagens:", err);
        }
    });

    sock.ev.on("group-participants.update", async (update) => {
        try {
            await verificaWelcome(sock, update);
            await verificaSair(sock, update);

            const antifakePath = path.join(__dirname, "data", "antifake.json");
            if (!fs.existsSync(antifakePath)) return;

            const settings = JSON.parse(fs.readFileSync(antifakePath, "utf-8"));
            if (!settings[update.id]) return;

            for (const user of update.participants) {
                if (update.action === "add" && !user.startsWith("55")) {
                    try {
                        await sock.groupParticipantsUpdate(update.id, [user], "remove");
                        await sock.sendMessage(update.id, {
                            text: `❌ Removido: @${user.split("@")[0]}\nAntifake ativado. Apenas números com DDI +55 são permitidos.`,
                            mentions: [user],
                        });
                    } catch (err) {
                        console.error("Erro ao remover estrangeiro:", err);
                    }
                }
            }
        } catch (err) {
            console.error("Erro no grupo:", err);
        }
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, pairingCode } = update;

        if (connection === "open") {
            console.log("✅ Conectado com sucesso!");
        } else if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("Conexão encerrada. Reconectando?", shouldReconnect);
            if (shouldReconnect) process.exit(0);
            else console.log("❌ Sessão desconectada. Delete a pasta `creds` para reconectar.");
        } else if (pairingCode) {
            console.log("🔗 Código de pareamento:", pairingCode);
        }
    });
}

startBot();