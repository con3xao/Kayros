const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const { readLegendaSairSettings } = require("../commands/admins/commandLegendaSair");

async function verificaSair(sock, update) {
  const { id, participants, action } = update;
  if (action !== "remove") return;

  const settings = readLegendaSairSettings();
  if (!settings[id]?.enabled) return;

  for (const participant of participants) {
    const numero = participant.split("@")[0];
    let nome = numero;


    try {
      const contact = await sock.onWhatsApp(participant);
      if (contact && contact[0]?.notify) nome = contact[0].notify;
    } catch {}


    let buffer;
    try {
      const url = await sock.profilePictureUrl(participant, "image");
      const res = await fetch(url);
      buffer = Buffer.from(await res.arrayBuffer());
    } catch {
      buffer = fs.readFileSync(path.join(__dirname, "../assets/imagens/Sair.jpg"));
    }

    let mensagemBase = settings[id]?.saiu || "saiu do grupo, adeus.";

    const mensagem = `@${nome} ${mensagemBase}`
      .replace(/{{nome}}/g, nome)
      .replace(/{{numero}}/g, numero);

    await sock.sendMessage(id, {
      image: buffer,
      caption: mensagem,
      mentions: [participant],
    });
  }
}

module.exports = { verificaSair };