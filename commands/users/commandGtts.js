const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');

const languageMap = {
  portugues: 'pt',
  português: 'pt',
  ingles: 'en',
  inglês: 'en',
  espanhol: 'es',
  francês: 'fr',
  alemao: 'de',
  alemão: 'de',
  italiano: 'it',
  japones: 'ja',
  japonês: 'ja',
  coreano: 'ko',
  chines: 'zh-CN',
  chinês: 'zh-CN',
  hindi: 'hi',
  arabe: 'ar',
  árabe: 'ar',
  russo: 'ru',
};

module.exports = async function (sock, messageDetails, args, enviarMensagem, userName) {
  const remoteJid = messageDetails.key.remoteJid;

  if (args.length < 2) {
    await enviarMensagem('❌ Use: !gtts <idioma> <texto>\nExemplo: !gtts português Olá mundo');
    return;
  }

  let lang = args[0].toLowerCase();
  lang = languageMap[lang] || lang;

  const text = args.slice(1).join(' ');

  const audioDir = path.join(__dirname, '../../assets/audiosgtts');
  const filePath = path.join(audioDir, 'gtts.mp3');

  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  try {
    const gtts = new gTTS(text, lang);
    await new Promise((resolve, reject) => {
      gtts.save(filePath, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    const audioBuffer = fs.readFileSync(filePath);

    await sock.sendMessage(remoteJid, {
      audio: audioBuffer,
      mimetype: 'audio/mp4',
      ptt: false
    });
  } catch (err) {
    console.error('Erro no comando gtts:', err);
    await enviarMensagem('❌ Erro ao gerar o áudio. Verifique se o idioma está correto.');
  }
};