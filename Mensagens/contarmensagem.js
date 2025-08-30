const fs = require("fs");
const path = require("path");

const caminhoJson = path.resolve(__dirname, "..", "data", "atividadeGrupos.json");

function carregarAtividades() {
  if (!fs.existsSync(caminhoJson)) return {};
  return JSON.parse(fs.readFileSync(caminhoJson, "utf-8"));
}

function salvarAtividades(dados) {
  fs.writeFileSync(caminhoJson, JSON.stringify(dados, null, 2));
}

function contarMensagem(msg) {
  const grupoId = msg.key.remoteJid;
  const usuarioId = msg.key.participant || msg.key.remoteJid;
  const tipo = msg.message;

  if (!grupoId.endsWith("@g.us")) return;

  const dados = carregarAtividades();

  if (!dados[grupoId]) dados[grupoId] = {};
  if (!dados[grupoId][usuarioId]) {
    dados[grupoId][usuarioId] = {
      mensagens: 0,
      comandos: 0,
      figurinhas: 0,
      audios: 0,
      documentos: 0,
      ligacoes: 0
    };
  }

  const userStats = dados[grupoId][usuarioId];

  if (tipo.conversation || tipo.extendedTextMessage) {
    const texto = tipo.conversation || tipo.extendedTextMessage?.text || "";
    if (texto.startsWith("!")) {
      userStats.comandos++;
    } else {
      userStats.mensagens++;
    }
  }

  if (tipo.stickerMessage) {
    userStats.figurinhas++;
  }

  if (tipo.audioMessage) {
    userStats.audios++;
  }

  if (tipo.documentMessage) {
    userStats.documentos++;
  }

  if (tipo.call) {
    userStats.ligacoes++;
  }

  salvarAtividades(dados);
}

module.exports = contarMensagem;