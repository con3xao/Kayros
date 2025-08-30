const path = require("path");
const fs = require("fs");
const { ownerNumber } = require("../../settings.json");

const configPath = path.join(__dirname, "../../data/antiPrivado.json");

function salvarModo(modo) {
  fs.writeFileSync(configPath, JSON.stringify({ modo }, null, 2));
}

function carregarModo() {
  if (!fs.existsSync(configPath)) return { modo: "off" };
  return JSON.parse(fs.readFileSync(configPath));
}

async function commandAntiPrivado(sock, messageDetails, commandName, enviarMensagem) {
  const sender = messageDetails.key.participant || messageDetails.key.remoteJid;

  const numeroLimpo = sender.replace(/\D/g, "");
  
  if (!ownerNumber.includes(numeroLimpo)) {
    await enviarMensagem("❌ Apenas o dono do bot pode usar esse comando.");
    return;
  }

  const modo = commandName === "antiprivado1" ? "aviso" : "bloquear";
  salvarModo(modo);

  await enviarMensagem(`✅ Modo *${modo === "aviso" ? "Aviso sem bloqueio" : "Bloqueio imediato"}* ativado com sucesso!`);
}

module.exports = { commandAntiPrivado, carregarModo };