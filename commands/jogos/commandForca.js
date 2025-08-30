const fs = require('fs');
const path = require('path');

const palavras = ['abacaxi', 'programador', 'futebol', 'whatsapp', 'maçã', 'Fogueira', 'pizza', 'gato', 'futebol', 'basquete', 'elefante', 'Leão', 'rato', 'pato', 'tablet', 'tetra', 'terra', 'mundo', 'universo', 'lua', 'sol'];
const filePath = path.join(__dirname, 'forcaData.json');

function salvarEstado(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function carregarEstado() {
  if (!fs.existsSync(filePath)) salvarEstado({});
  return JSON.parse(fs.readFileSync(filePath));
}

function desenhar(palavra, letrasCorretas) {
  return palavra
    .split('')
    .map(letra => (letrasCorretas.includes(letra) ? letra : '_'))
    .join(' ');
}

async function commandForca(sock, msg, args, from, enviarMensagem) {
  const estados = carregarEstado();
  const estado = estados[from] || null;

  if (args[0] === 'novo') {
    const palavra = palavras[Math.floor(Math.random() * palavras.length)];
    estados[from] = {
      palavra,
      letrasCorretas: [],
      letrasErradas: [],
      tentativas: 6
    };
    salvarEstado(estados);
    return enviarMensagem(`🎮 *Jogo da Forca iniciado!*\n\n${desenhar(palavra, [])}\n\nTentativas restantes: 6`);
  }

  if (!estado) return enviarMensagem(`❌ Nenhum jogo iniciado. Digite: *${prefix}forca novo*`);

  const letra = args[0]?.toLowerCase();
  if (!letra || letra.length !== 1) return enviarMensagem('❌ Envie apenas uma letra por vez.');

  const { palavra, letrasCorretas, letrasErradas } = estado;

  if (letrasCorretas.includes(letra) || letrasErradas.includes(letra)) {
    return enviarMensagem('⚠️ Você já tentou essa letra.');
  }

  if (palavra.includes(letra)) {
    estado.letrasCorretas.push(letra);
  } else {
    estado.letrasErradas.push(letra);
    estado.tentativas--;
  }

  if (estado.tentativas <= 0) {
    delete estados[from];
    salvarEstado(estados);
    return enviarMensagem(`☠️ Fim de jogo! A palavra era *${palavra}*`);
  }

  if (palavra.split('').every(l => estado.letrasCorretas.includes(l))) {
    delete estados[from];
    salvarEstado(estados);
    return enviarMensagem(`🎉 Parabéns! Você acertou a palavra: *${palavra}*`);
  }

  salvarEstado(estados);
  return enviarMensagem(
    `\`\`\`\n${desenhar(palavra, estado.letrasCorretas)}\n\nErradas: ${estado.letrasErradas.join(', ') || 'nenhuma'}\nTentativas restantes: ${estado.tentativas}\n\`\`\``
  );
}

module.exports = { commandForca };