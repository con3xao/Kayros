const fs = require("fs");
const path = require("path");

const blacklistPath = path.join(__dirname, "blacklist.json");

function carregarBlacklist() {
  try {
    const data = fs.readFileSync(blacklistPath, "utf-8");
    const json = JSON.parse(data);
    return json.blacklists || {};
  } catch {
    return {};
  }
}

function salvarBlacklist(blacklists) {
  const data = { blacklists };
  fs.writeFileSync(blacklistPath, JSON.stringify(data, null, 2));
}

function estaNaBlacklist(groupId, jid) {
  if (!groupId || !jid) return false;
  const numero = jid.split("@")[0];
  const blacklists = carregarBlacklist();
  const lista = blacklists[groupId] || [];
  return lista.includes(numero);
}

function adicionarNaBlacklist(groupId, jid) {
  if (!groupId || !jid) return false;
  const numero = jid.split("@")[0];
  const blacklists = carregarBlacklist();

  if (!blacklists[groupId]) {
    blacklists[groupId] = [];
  }

  if (!blacklists[groupId].includes(numero)) {
    blacklists[groupId].push(numero);
    salvarBlacklist(blacklists);
    return true;
  }
  return false;
}

function removerDaBlacklist(groupId, jid) {
  if (!groupId || !jid) return false;
  const numero = jid.split("@")[0];
  const blacklists = carregarBlacklist();

  if (!blacklists[groupId]) return false;

  if (blacklists[groupId].includes(numero)) {
    blacklists[groupId] = blacklists[groupId].filter(n => n !== numero);
    salvarBlacklist(blacklists);
    return true;
  }
  return false;
}

function listarBlacklist(groupId) {
  if (!groupId) return [];
  const blacklists = carregarBlacklist();
  return blacklists[groupId] || [];
}

module.exports = {
  estaNaBlacklist,
  adicionarNaBlacklist,
  removerDaBlacklist,
  listarBlacklist
};