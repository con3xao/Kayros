const fs = require("fs");
const path = require("path");
const { ownerNumber } = require("../settings.json");

const configPath = path.join(__dirname, "../data/antiPrivado.json");
const dbPath = path.join(__dirname, "../data/usuariosAntiPrivado.json");

function carregarModo() {
  if (!fs.existsSync(configPath)) return { modo: "off" };
  try {
    return JSON.parse(fs.readFileSync(configPath));
  } catch {
    return { modo: "off" };
  }
}

function carregarDB() {
  if (!fs.existsSync(dbPath)) {
    const initialData = { avisados: [], bloqueados: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    return JSON.parse(fs.readFileSync(dbPath));
  } catch {
    return { avisados: [], bloqueados: [] };
  }
}

function salvarDB(db) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error("Erro ao salvar DB antiPrivado:", err);
  }
}

async function verificarAntiPrivado(sock, msg) {
  if (!msg || !msg.key || !msg.message) return;
  if (msg.key.fromMe) return;

  const jid = msg.key.remoteJid;
  if (!jid || jid.endsWith("@g.us") || jid === "status@broadcast" || jid.includes(ownerNumber)) return;

  const { modo } = carregarModo();
  if (modo === "off") return;

  const db = carregarDB();

  if (modo === "aviso") {
    if (db.avisados.includes(jid)) return;
    try {
      await sock.sendMessage(jid, {
        text: "⚠️ Por favor, não chame no privado. Use um grupo para interagir com o bot.",
      });
      if (!db.avisados.includes(jid)) db.avisados.push(jid);
      salvarDB(db);
    } catch (err) {
      console.error("Erro ao enviar aviso antiPrivado:", err);
    }

  } else if (modo === "bloquear") {
    if (db.bloqueados.includes(jid)) return;
    try {
      await sock.sendMessage(jid, {
        text: "⛔ Você será bloqueado por chamar no privado.",
      });
      await sock.updateBlockStatus(jid, "block");
      if (!db.bloqueados.includes(jid)) db.bloqueados.push(jid);
      salvarDB(db);
    } catch (err) {
      console.error("Erro ao bloquear usuário:", err);
    }
  }
}

module.exports = { verificarAntiPrivado };