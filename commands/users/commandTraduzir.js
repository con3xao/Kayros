const translate = require('@iamtraction/google-translate');

const idiomasMap = {
  português: 'pt',
  portugues: 'pt',
  inglês: 'en',
  ingles: 'en',
  espanhol: 'es',
  francês: 'fr',
  frances: 'fr',
  alemão: 'de',
  alemao: 'de',
  italiano: 'it',
  japonês: 'ja',
  japones: 'ja',
  chinês: 'zh-CN',
  chines: 'zh-CN',
  russo: 'ru',
  coreano: 'ko',
  hindi: 'hi',
  árabe: 'ar',
  arabe: 'ar',
};

async function commandTraduzir(sock, messageDetails, args, enviarMensagem) {
  if (args.length < 2) {
    await enviarMensagem('❌ Uso correto: !traduzir <idioma> <texto>\nExemplo: !traduzir português Hello world');
    return;
  }

  const idiomaNome = args.shift().toLowerCase();
  const idiomaDestino = idiomasMap[idiomaNome];

  if (!idiomaDestino) {
    await enviarMensagem(`❌ Idioma "${idiomaNome}" não reconhecido. Use Português, Inglês, Espanhol, etc.`);
    return;
  }

  const texto = args.join(' ');

  try {
    const res = await translate(texto, { to: idiomaDestino });
    await enviarMensagem(`🌐 Tradução (auto → ${idiomaNome}):\n${res.text}`);
  } catch (error) {
    console.error('Erro ao traduzir:', error);
    await enviarMensagem('❌ Erro ao tentar traduzir o texto.');
  }
}

module.exports = { commandTraduzir };