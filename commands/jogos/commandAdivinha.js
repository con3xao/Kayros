const desafios = [
  { dica: 'Sou vermelho por fora e branco por dentro.', resposta: 'maçã' },
  { dica: 'Sou o maior planeta do sistema solar.', resposta: 'júpiter' },
  { dica: 'Tenho asas mas não sou avião. Produzo mel.', resposta: 'abelha' },
  { dica: 'Sou redonda e usada no futebol.', resposta: 'bola' }, 
  { dica: 'Sou usado para escrever e tenho tinta.', resposta: 'caneta' },
  { dica: 'Sou cheio de páginas e trago conhecimento.', resposta: 'livro' },
  { dica: 'Subo e desço, mas não saio do lugar.', resposta: 'escada' },
  { dica: 'Sou pequeno, quadrado e tenho muitas teclas.', resposta: 'teclado' },
  { dica: 'Sou doce, gelado e derreto fácil.', resposta: 'sorvete' },
  { dica: 'Tenho quatro patas e sou o melhor amigo do homem.', resposta: 'cachorro' },
  { dica: 'Sou amarelo por fora e branco por dentro. Sou uma fruta.', resposta: 'banana' },
  { dica: 'Sou usado para cortar alimentos.', resposta: 'faca' },
  { dica: 'Tenho ponteiros e marco o tempo.', resposta: 'relógio' },
  { dica: 'Tenho rodas e levo pessoas para vários lugares.', resposta: 'carro' },
  { dica: 'Sou feito de vidro e deixo o vento entrar.', resposta: 'janela' },
  { dica: 'Sou usado para ver à noite, mas não sou lanterna.', resposta: 'vela' },
  { dica: 'Sou pequeno e moro na tomada. Carrego celulares.', resposta: 'carregador' },
  { dica: 'Tenho tela e boto vídeos, filmes e jogos.', resposta: 'televisão' },
  { dica: 'Fico no céu à noite e brilho, mas não sou o sol.', resposta: 'estrela' },
  { dica: 'Sou branco, quadrado e limpo o corpo.', resposta: 'sabão' },
  { dica: 'Sou de metal, tenho dentes e abro portas.', resposta: 'chave' },
  { dica: 'Sou cheio de água e usado para nadar.', resposta: 'piscina' },
  { dica: 'Tenho rodas e pedais. Ando sem motor.', resposta: 'bicicleta' },
  { dica: 'Sou usado para falar com pessoas mesmo de longe.', resposta: 'celular' }
];

let desafioAtual = null;

async function commandAdivinhaDica(args, enviarMensagem) {
  if (!desafioAtual) {
    desafioAtual = desafios[Math.floor(Math.random() * desafios.length)];
    return enviarMensagem(`🧠 *Adivinhe com dica:*\n${desafioAtual.dica}\n\nResponda com: *!responder sua_resposta*`);
  }

  return enviarMensagem(`⚠️ Já existe uma adivinha ativa!\nDica: ${desafioAtual.dica}`);
}

async function commandResponder(args, enviarMensagem, userName) {
  if (!desafioAtual) return enviarMensagem('❌ Nenhuma adivinha ativa no momento.');

  const resposta = args.join(' ').toLowerCase();
  if (resposta === desafioAtual.resposta.toLowerCase()) {
    const respostaCorreta = desafioAtual.resposta;
    desafioAtual = null;
    return enviarMensagem(`🎉 Parabéns, ${userName}! A resposta correta era: *${respostaCorreta}*`);
  } else {
    return enviarMensagem(`❌ Errado, ${userName}. Tente de novo!`);
  }
}

module.exports = { commandAdivinhaDica, commandResponder };