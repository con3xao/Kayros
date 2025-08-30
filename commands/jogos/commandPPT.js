const jogadas = ['pedra', 'papel', 'tesoura'];

async function commandPPT(args, enviarMensagem, userName) {
  const escolhaUser = args[0]?.toLowerCase();
  if (!jogadas.includes(escolhaUser)) {
    return enviarMensagem(`❌ Escolha inválida!\nDigite: *${prefix}ppt pedra*, *papel* ou *tesoura*`);
  }

  const escolhaBot = jogadas[Math.floor(Math.random() * 3)];
  let resultado = "";

  if (escolhaUser === escolhaBot) resultado = "🤝 Empate!";
  else if (
    (escolhaUser === "pedra" && escolhaBot === "tesoura") ||
    (escolhaUser === "tesoura" && escolhaBot === "papel") ||
    (escolhaUser === "papel" && escolhaBot === "pedra")
  ) resultado = `✅ ${userName}, você venceu!`;
  else resultado = `😢 ${userName}, você perdeu!`;

  await enviarMensagem(`🤖 Bot jogou *${escolhaBot}*\n🧑 Você jogou *${escolhaUser}*\n\n🎮 Resultado: ${resultado}`);
}

module.exports = { commandPPT };