async function commandCassino(sock, messageDetails, enviarMensagem) {
  const slots = ["🍒", "🍋", "🍉", "⭐", "💎", "🔔", "7️⃣"];


  function gerarMatriz() {
    let matriz = [];
    for (let i = 0; i < 3; i++) {
      let linha = [];
      for (let j = 0; j < 3; j++) {
        linha.push(slots[Math.floor(Math.random() * slots.length)]);
      }
      matriz.push(linha);
    }
    return matriz;
  }

  function verificarVitoria(matriz) {

    for (let i = 0; i < 3; i++) {
      if (matriz[i][0] === matriz[i][1] && matriz[i][1] === matriz[i][2]) {
        return true;
      }
    }

    for (let j = 0; j < 3; j++) {
      if (matriz[0][j] === matriz[1][j] && matriz[1][j] === matriz[2][j]) {
        return true;
      }
    }

    if (matriz[0][0] === matriz[1][1] && matriz[1][1] === matriz[2][2]) return true;
    if (matriz[0][2] === matriz[1][1] && matriz[1][1] === matriz[2][0]) return true;

    return false;
  }

  let matriz, ganhou;


  if (Math.random() < 0.7) {

    do {
      matriz = gerarMatriz();
      ganhou = verificarVitoria(matriz);
    } while (ganhou); 
  } else {

    do {
      matriz = gerarMatriz();
      ganhou = verificarVitoria(matriz);
    } while (!ganhou); 
  }

  const resultado = matriz.map(linha => linha.join(" | ")).join("\n");

  let msg = ganhou ? "🎉 Você GANHOU no Cassino!" : "😢 Não foi dessa vez...";

  await enviarMensagem(`🎰 *Cassino* 🎰\n${resultado}\n\n${msg}`);
}

module.exports = { commandCassino };