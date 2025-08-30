const fs = require("fs");
const path = require("path");

const antiaudioPath = path.join(__dirname, "../../data/antiaudio.json");
if (!fs.existsSync(antiaudioPath)) fs.writeFileSync(antiaudioPath, "{}");

function carregarAntiaudio() {
  return JSON.parse(fs.readFileSync(antiaudioPath));
}

function salvarAntiaudio(json) {
  fs.writeFileSync(antiaudioPath, JSON.stringify(json, null, 2));
}

async function commandAntiaudio(sock, m, args, enviarMensagem, isGroup, isAdmin, isBotAdmin) {
  const from = m.key.remoteJid;

  if (!isGroup) return enviarMensagem("❌ Este comando só funciona em grupos.");
  if (!isAdmin) return enviarMensagem("❌ Apenas administradores podem ativar ou desativar.");

  const data = carregarAntiaudio();
  const estado = args[0]?.toLowerCase();

  if (estado === "on") {
    data[from] = { ativo: true };
    salvarAntiaudio(data);
    return enviarMensagem("✅ Antiaudio ativado neste grupo.");
  } else if (estado === "off") {
    delete data[from];
    salvarAntiaudio(data);
    return enviarMensagem("🚫 Antiaudio desativado neste grupo.");
  } else {
    return enviarMensagem("ℹ️ Use: !antiaudio on ou !antiaudio off");
  }
}


async function verificaAntiaudio(sock, msg) {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;

  if (!from.endsWith("@g.us")) return; 

  const data = carregarAntiaudio();
  if (!data[from]?.ativo) return; 

  if (msg.message.audioMessage) {
    console.log("📢 Áudio detectado:", sender);


    await sock.sendMessage(from, {
      delete: { remoteJid: from, fromMe: false, id: msg.key.id, participant: sender }
    });

    data[from][sender] = (data[from][sender] || 0) + 1;
    salvarAntiaudio(data);

    if (data[from][sender] >= 2) {
      try {
        await sock.groupParticipantsUpdate(from, [sender], "remove");
        delete data[from][sender];
        salvarAntiaudio(data);
        await sock.sendMessage(from, {
          text: `🚫 @${sender.split("@")[0]} removido por enviar áudio.`,
          mentions: [sender]
        });
      } catch (err) {
        console.error("Erro ao remover usuário:", err);
      }
    } else {
      await sock.sendMessage(from, {
        text: `⚠️ @${sender.split("@")[0]}, envio de áudio não permitido, você tem poucas chances agora. `,
        mentions: [sender]
      });
    }
  }
}

module.exports = { commandAntiaudio, verificaAntiaudio };