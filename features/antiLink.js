const fs = require("fs");
const path = require("path");

const antilinkPath = path.join(__dirname, "..", "data", "antilinkSettings.json");

function carregarGruposAntilink() {
  try {
    return JSON.parse(fs.readFileSync(antilinkPath));
  } catch {
    return {};
  }
}

function salvarGruposAntilink(grupos) {
  fs.writeFileSync(antilinkPath, JSON.stringify(grupos, null, 2));
}

function ativarAntilink(grupoId) {
  const grupos = carregarGruposAntilink();
  grupos[grupoId] = true;
  salvarGruposAntilink(grupos);
}

function desativarAntilink(grupoId) {
  const grupos = carregarGruposAntilink();
  delete grupos[grupoId];
  salvarGruposAntilink(grupos);
}

function estaAtivo(grupoId) {
  const grupos = carregarGruposAntilink();
  return grupos[grupoId] === true;
}


async function ehAdmin(sock, grupoId, participanteId) {
  try {
    const groupMetadata = await sock.groupMetadata(grupoId);
    const admins = groupMetadata.participants
      .filter(p => p.admin !== null)
      .map(p => p.id);
    return admins.includes(participanteId);
  } catch (err) {
    console.error("Erro ao verificar admin:", err);
    return false;
  }
}

module.exports = {
  ativarAntilink,
  desativarAntilink,
  estaAtivo,
  ehAdmin
};