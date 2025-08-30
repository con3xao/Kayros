const fs = require("fs");
const axios = require("axios");

exports.setupMessagingServices = (sock, from, messageDetails) => {
  const enviarMensagem = async (text, mention = []) => {
    const mentions = Array.isArray(mention) ? mention : [];
    await sock.sendMessage(
      from,
      { text: `${text}`, mentions },
      { quoted: messageDetails }
    );
  };

  const enviarAudioGravacao = async (arquivo) => {
    const buffer = Buffer.isBuffer(arquivo) ? arquivo : fs.readFileSync(arquivo);
    await sock.sendMessage(
      from,
      { audio: buffer, mimetype: "audio/mp4", ptt: true },
      { quoted: messageDetails }
    );
  };

  const enviarAudio = async (arquivo) => {
    const buffer = Buffer.isBuffer(arquivo) ? arquivo : fs.readFileSync(arquivo);
    await sock.sendMessage(
      from,
      { audio: buffer, mimetype: "audio/mp4", ptt: false },
      { quoted: messageDetails }
    );
  };

  const enviarAudioUrl = async (url, caption = "") => {
    try {
      const res = await axios.get(url, { responseType: "arraybuffer" });
      await sock.sendMessage(
        from,
        { audio: Buffer.from(res.data), mimetype: "audio/mp4", ptt: false, caption },
        { quoted: messageDetails }
      );
    } catch (e) {
      console.error("Erro ao enviar áudio:", e);
      await enviarMensagem("❌ Erro ao baixar ou enviar o áudio.");
    }
  };

  const enviarImagem = async (arquivo, text = "") => {
    await sock.sendMessage(
      from,
      { image: fs.readFileSync(arquivo), caption: text },
      { quoted: messageDetails }
    );
  };

  const enviarImagemUrl = async (url, text = "") => {
    await sock.sendMessage(
      from,
      { image: { url: url }, caption: text },
      { quoted: messageDetails }
    );
  };

  const enviarVideo = async (arquivo, caption = "", isGif = false) => {
  const buffer = Buffer.isBuffer(arquivo) ? arquivo : fs.readFileSync(arquivo);
  const messagePayload = isGif
    ? { video: buffer, mimetype: 'image/webp', caption, gifPlayback: true }
    : { video: buffer, mimetype: 'video/mp4', caption };
  await sock.sendMessage(from, messagePayload, { quoted: messageDetails });
};

  const enviarGifUrl = async (url, caption = "", mention = []) => {
    await sock.sendMessage(
      from,
      { video: { url }, caption, mentions: mention, gifPlayback: true },
      { quoted: messageDetails }
    );
  };

  const reagir = async (emoji) => {
    await sock.sendMessage(from, {
      react: {
        text: emoji,
        key: messageDetails.key,
      },
    });
  };

  return {
    reagir,
    enviarAudioGravacao,
    enviarAudio,
    enviarAudioUrl,
    enviarImagem,
    enviarImagemUrl,
    enviarMensagem,
    enviarGifUrl,
    enviarVideo,
  };
};