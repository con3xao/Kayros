const fs = require('fs');
const path = './data/soAdmSettings.json';

function estaAtivo(groupId) {
  if (!fs.existsSync(path)) return false;
  const data = JSON.parse(fs.readFileSync(path));
  return data[groupId] === true;
}

function ativar(groupId) {
  let data = {};
  if (fs.existsSync(path)) {
    data = JSON.parse(fs.readFileSync(path));
  }
  data[groupId] = true;
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function desativar(groupId) {
  let data = {};
  if (fs.existsSync(path)) {
    data = JSON.parse(fs.readFileSync(path));
  }
  data[groupId] = false;
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = { estaAtivo, ativar, desativar };