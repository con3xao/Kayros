// data/usuariosBloqueadosCmd.js
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "usuariosBloqueadosCmd.json");

// Garante que o arquivo exista
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

function bloquearUsuarioComando(jid) {
  const lista = JSON.parse(fs.readFileSync(filePath));
  if (!lista.includes(jid)) {
    lista.push(jid);
    fs.writeFileSync(filePath, JSON.stringify(lista, null, 2));
  }
}

function desbloquearUsuarioComando(jid) {
  let lista = JSON.parse(fs.readFileSync(filePath));
  lista = lista.filter((u) => u !== jid);
  fs.writeFileSync(filePath, JSON.stringify(lista, null, 2));
}

function usuarioBloqueado(jid) {
  const lista = JSON.parse(fs.readFileSync(filePath));
  return lista.includes(jid);
}

module.exports = {
  bloquearUsuarioComando,
  desbloquearUsuarioComando,
  usuarioBloqueado,
};