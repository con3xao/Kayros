const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const { readWelcomeSettings } = require("../commands/admins/commandWelcome");

async function verificaWelcome(sock, update) {
  const { id, participants, action } = update;
  const settings = readWelcomeSettings();

  if (!settings[id]?.enabled) return;

  let nomeGrupo = "";
  try {
    const metadata = await sock.groupMetadata(id);
    nomeGrupo = metadata.subject || "Grupo";
  } catch {
    nomeGrupo = "Grupo";
  }

  for (const participant of participants) {
    const numero = participant.split("@")[0];

    let perfilPic;
    try {
      perfilPic = await sock.profilePictureUrl(participant, "image");
    } catch {
      perfilPic = null;
    }

    if (action === "add") {
      let legenda =
        settings[id]?.message ||
        `👋 Seja bem vindo @{{numero}} ao grupo *{{grupo}}*`;

      legenda = legenda
        .replace(/@{{numero}}/g, `@${numero}`)
        .replace(/{{grupo}}/g, nomeGrupo);

      let mensagem;

      if (perfilPic && perfilPic.startsWith("http")) {
        try {
          const res = await fetch(perfilPic);
          const buffer = Buffer.from(await res.arrayBuffer());
          mensagem = {
            image: buffer,
            caption: legenda,
            mentions: [participant],
          };
        } catch {
          const imgBuffer = fs.readFileSync(
            path.join(__dirname, "../assets/imagens/Welcome.jpg")
          );
          mensagem = {
            image: imgBuffer,
            caption: legenda,
            mentions: [participant],
          };
        }
      } else {
        const imgBuffer = fs.readFileSync(
          path.join(__dirname, "../assets/imagens/Welcome.jpg")
        );
        mensagem = {
          image: imgBuffer,
          caption: legenda,
          mentions: [participant],
        };
      }

      await sock.sendMessage(id, mensagem);
    }
  }
}

module.exports = { verificaWelcome };