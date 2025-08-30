const path = require("path");
const fs = require("fs");

const antidocPath = path.join(__dirname, "../../data/antidoc.json");
if (!fs.existsSync(antidocPath)) fs.writeFileSync(antidocPath, "{}");

function carregarAntidoc() {
  return JSON.parse(fs.readFileSync(antidocPath));
}

function salvarAntidoc(json) {
  fs.writeFileSync(antidocPath, JSON.stringify(json, null, 2));
}

const infracoes = {};

async function commandAntidoc(sock, m, args, enviarMensagem, isGroup, isAdmin) {
  const from = m.key.remoteJid;

  if (!isGroup) return enviarMensagem("❌ Este comando só funciona em grupos.");
  if (!isAdmin) return enviarMensagem("❌ Apenas administradores podem ativar/desativar o antidoc.");

  const antidocData = carregarAntidoc();
  const estado = args[0]?.toLowerCase();

  if (estado === "on") {
    antidocData[from] = { ativo: true };
    salvarAntidoc(antidocData);
    await enviarMensagem("✅ Antidoc ativado. Documentos serão bloqueados.");
  } else if (estado === "off") {
    delete antidocData[from];
    salvarAntidoc(antidocData);
    await enviarMensagem("🚫 Antidoc desativado.");
  } else {
    await enviarMensagem("ℹ️ Use: !antidoc on ou !antidoc off");
  }
}


async function verificaAntidoc(sock, msg) {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;

  if (!from.endsWith("@g.us")) return;

  const antidocData = carregarAntidoc();
  if (!antidocData[from]?.ativo) return;
  
if (msg.message.documentMessage) {
  console.log("📄 Documento detectado:", sender);

  await sock.sendMessage(from, {
    delete: {
      remoteJid: from,
      fromMe: false,
      id: msg.key.id,
      participant: sender
    }
  });

    infracoes[from] ??= {};
    infracoes[from][sender] = (infracoes[from][sender] || 0) + 1;

    if (infracoes[from][sender] >= 2) {
      try {
        await sock.groupParticipantsUpdate(from, [sender], "remove");
        infracoes[from][sender] = 0;
        await sock.sendMessage(from, {
          text: `🚫 @${sender.split("@")[0]} removido por enviar documentos.`,
          mentions: [sender]
        });
      } catch (err) {
        console.error("Erro ao remover usuário por documento:", err);
      }
    } else {
      await sock.sendMessage(from, {
        text: `⚠️ @${sender.split("@")[0]}, envio de documentos não é permitido.`,
        mentions: [sender]
      });
    }
  }
}

module.exports = { commandAntidoc, verificaAntidoc, carregarAntidoc, salvarAntidoc };