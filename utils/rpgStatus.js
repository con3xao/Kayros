const fs = require("fs");
const path = require("path");

const caminho = path.resolve(__dirname, "../assets/rpg/rpgStatus.json");

function estaRPGAtivado() {
  if (!fs.existsSync(caminho)) return true;
  const conteudo = fs.readFileSync(caminho, "utf-8");
  const json = JSON.parse(conteudo);
  return json.ativado;
}

function salvarStatusRPG(ativado) {
  fs.writeFileSync(caminho, JSON.stringify({ ativado }, null, 2));
}

module.exports = { estaRPGAtivado, salvarStatusRPG };