const fs = require("fs");
const path = require("path");

const caminhoStatus = path.resolve(__dirname, "../../assets/rpg/rpgStatus.json");
const caminhoDados = path.resolve(__dirname, "../../assets/rpg/rpg.json");

function criarRpgVazio() {
  return {
    jogadores: {
      "554288043966@s.whatsapp.net": { 
        nome: "Vitin",
        ouro: 5000
      }
    },
    config: {
      criadoEm: new Date().toISOString()
    }
  };
}

async function resetarRPG(sock, msg) {
  try {
    // Ativa o RPG
    fs.writeFileSync(caminhoStatus, JSON.stringify({ ativado: true }, null, 2));

    // Cria o arquivo de dados com o saldo inicial
    fs.writeFileSync(caminhoDados, JSON.stringify(criarRpgVazio(), null, 2));

    await sock.sendMessage(
      msg.key.remoteJid,
      { text: "✅ O RPG foi resetado com sucesso." },
      { quoted: msg }
    );
  } catch (err) {
    console.error("Erro ao resetar RPG:", err);
    await sock.sendMessage(
      msg.key.remoteJid,
      { text: "❌ Erro ao resetar o RPG." },
      { quoted: msg }
    );
  }
}

module.exports = { resetarRPG };