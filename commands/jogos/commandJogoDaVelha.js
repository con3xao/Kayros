
const fs = require('fs');
const path = require('path');

const partidasPath = path.join(__dirname, '../../assets/jogodavelha/partidas.json');
if (!fs.existsSync(partidasPath)) fs.writeFileSync(partidasPath, '{}');

const getPartidas = () => JSON.parse(fs.readFileSync(partidasPath));
const salvarPartidas = (data) => fs.writeFileSync(partidasPath, JSON.stringify(data, null, 2));

const desenharTabuleiro = (tab) => {
  return `
${tab[0]} | ${tab[1]} | ${tab[2]}
---------
${tab[3]} | ${tab[4]} | ${tab[5]}
---------
${tab[6]} | ${tab[7]} | ${tab[8]}
`.replace(/⬜/g, '⬜');
};

const checarVitoria = (tab, simbolo) => {
  const vitorias = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return vitorias.some(comb => comb.every(i => tab[i] === simbolo));
};

const simbolos = ["❌", "⭕"];

async function iniciarPartida({ sock, messageDetails, enviarMensagem, args, userMention, participant }) {
  const partidas = getPartidas();
  const chatId = messageDetails.key.remoteJid;

  if (partidas[chatId]) {
    await enviarMensagem("⚠️ Já existe um jogo em andamento nesse chat.");
    return;
  }

  const contraBot = args[0]?.toLowerCase() === "bot";

  const jogador1 = participant;
  const jogador2 = contraBot ? "bot" : userMention;

  if (`${prefix}jogador2`) {
    await enviarMensagem(`❌ Use: ${prefix}jogodavelha @usuário ou ${prefix}jogodavelha bot`);
    return;
  }

  const novoJogo = {
    tabuleiro: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
    jogador1,
    jogador2,
    atual: jogador1,
    simbolos: {
      [jogador1]: simbolos[0],
      [jogador2]: simbolos[1]
    },
    contraBot
  };

  partidas[chatId] = novoJogo;
  salvarPartidas(partidas);

  const menções = [jogador1];
  if (`${prefix}contraBot`) menções.push(jogador2);

  await enviarMensagem(
    `🎮 Novo jogo da velha iniciado entre @${jogador1.split('@')[0]} e ${contraBot ? "🤖 o Bot" : `@${jogador2.split('@')[0]}`}\n\n` +
    desenharTabuleiro(novoJogo.tabuleiro) +
    `\n🔁 É a vez de @${jogador1.split('@')[0]} (❌)\nEnvie *${prefix}jogar <1-9>*`,
    menções
  );
}

async function encerrarPartida({ enviarMensagem, messageDetails }) {
  const partidas = getPartidas();
  const chatId = messageDetails.key.remoteJid;

  if (partidas[chatId]) {
    delete partidas[chatId];
    salvarPartidas(partidas);
    await enviarMensagem("⚡ O jogo da velha foi encerrado!");
  } else {
    await enviarMensagem("❗ Nenhum jogo da velha em andamento para encerrar.");
  }
}

async function jogar({ sock, messageDetails, enviarMensagem, args, participant }) {
  const partidas = getPartidas();
  const chatId = messageDetails.key.remoteJid;
  const jogo = partidas[chatId];

  if (`${prefix}jogo`) {
    await enviarMensagem("⚠️ Nenhum jogo em andamento. Use jogodavelha para iniciar.");
    return;
  }

  if (jogo.atual !== participant) {
    if (!jogo.contraBot || jogo.jogador2 !== "bot") {
      await enviarMensagem("⏳ Aguarde sua vez.");
      return;
    }
  }

  const pos = parseInt(args[0]) - 1;
  if (isNaN(pos) || pos < 0 || pos > 8 || !/^[1-9]️⃣$/.test(jogo.tabuleiro[pos])) {
    await enviarMensagem("❌ Posição inválida ou ocupada. Escolha de 1 a 9.");
    return;
  }

  jogo.tabuleiro[pos] = jogo.simbolos[participant];
  const venceu = checarVitoria(jogo.tabuleiro, jogo.simbolos[participant]);

  if (venceu) {
    await enviarMensagem(
      `🏆 Vitória de @${participant.split('@')[0]}!\n\n${desenharTabuleiro(jogo.tabuleiro)}`,
      [participant]
    );
    delete partidas[chatId];
    salvarPartidas(partidas);
    return;
  }

  if (jogo.tabuleiro.every(p => !/^[1-9]️⃣$/.test(p))) {
    await enviarMensagem(`🤝 Empate!\n\n${desenharTabuleiro(jogo.tabuleiro)}`);
    delete partidas[chatId];
    salvarPartidas(partidas);
    return;
  }

  if (jogo.contraBot && jogo.jogador2 === "bot") {
    const jogadasPossiveis = jogo.tabuleiro
      .map((v, i) => /^[1-9]️⃣$/.test(v) ? i : null)
      .filter(v => v !== null);
    const posBot = jogadasPossiveis[Math.floor(Math.random() * jogadasPossiveis.length)];
    jogo.tabuleiro[posBot] = jogo.simbolos["bot"];

    const venceuBot = checarVitoria(jogo.tabuleiro, jogo.simbolos["bot"]);
    if (venceuBot) {
      await enviarMensagem(`🤖 O Bot venceu!\n\n${desenharTabuleiro(jogo.tabuleiro)}`);
      delete partidas[chatId];
      salvarPartidas(partidas);
      return;
    }

    if (jogo.tabuleiro.every(p => !/^[1-9]️⃣$/.test(p))) {
      await enviarMensagem(`🤝 Empate!\n\n${desenharTabuleiro(jogo.tabuleiro)}`);
      delete partidas[chatId];
      salvarPartidas(partidas);
      return;
    }

    jogo.atual = jogo.jogador1;
    salvarPartidas(partidas);
    await enviarMensagem(
      `🤖 Bot jogou!\n\n${desenharTabuleiro(jogo.tabuleiro)}\n🔁 Sua vez, @${jogo.jogador1.split('@')[0]}`,
      [jogo.jogador1]
    );
    return;
  }

  jogo.atual = (jogo.atual === jogo.jogador1) ? jogo.jogador2 : jogo.jogador1;
  salvarPartidas(partidas);

  await enviarMensagem(
    `✅ Jogada feita!\n\n${desenharTabuleiro(jogo.tabuleiro)}\n🔁 É a vez de @${jogo.atual.split('@')[0]}`,
    [jogo.atual]
  );
}

module.exports = {
  commandJogoDaVelha: iniciarPartida,
  commandJogar: jogar,
  commandKilJogoDaVelha: encerrarPartida
};