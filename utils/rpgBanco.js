const fs = require('fs');
const path = require('path');

const caminhoArquivo = path.resolve(__dirname, '../assets/rpg/rpg.json');

function carregarBancoRPG() {
  if (!fs.existsSync(caminhoArquivo)) {
    return {};
  }
  const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
  return JSON.parse(conteudo);
}

function salvarBancoRPG(dados) {
  fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2));
}

module.exports = {
  carregarBancoRPG,
  salvarBancoRPG
};