const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { exec, execSync } = require('child_process');

exports.commandVideoRapido = async (sock, messageDetails, enviarMensagem) => {
  try {
    const quoted = messageDetails.message.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted || !quoted.videoMessage) {
      await enviarMensagem('❌ Responda a um vídeo para acelerar.');
      return;
    }

    const bufferOriginal = await downloadMediaMessage({ message: quoted }, 'buffer');

    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const timestamp = Date.now();
    const tempInput = path.join(tempDir, `input_${timestamp}.mp4`);
    const tempOutput = path.join(tempDir, `output_${timestamp}.mp4`);

    fs.writeFileSync(tempInput, bufferOriginal);

    const cmd = `ffmpeg -y -i "${tempInput}" -filter_complex "[0:v]setpts=0.4*PTS[v];[0:a]atempo=2.0,atempo=1.25[a]" -map "[v]" -map "[a]" -b:v 800k "${tempOutput}"`;

    exec(cmd, async (error) => {
      if (error) {
        console.error('Erro no ffmpeg:', error);
        await enviarMensagem('❌ Erro ao processar o vídeo.');
        if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
        return;
      }

      let duration = 0;
      try {
        const output = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${tempOutput}"`);
        duration = parseInt(parseFloat(output.toString().trim()));
      } catch (err) {
        console.warn("⚠️ Não foi possível obter a duração do vídeo. Usando valor padrão 120s.");
        duration = 120;
      }

      const bufferAcelerado = fs.readFileSync(tempOutput);
      const fileSize = fs.statSync(tempOutput).size;

      await sock.sendMessage(messageDetails.key.remoteJid, {
        document: bufferAcelerado,
        fileName: 'video_rapido.mp4',
        mimetype: 'video/mp4',
        caption: '🎥 Vídeo acelerado 2.5x com áudio',
        fileLength: fileSize,
        contextInfo: { mentionedJid: [messageDetails.key.participant] }
      }, { quoted: messageDetails });

      fs.unlinkSync(tempInput);
      fs.unlinkSync(tempOutput);
    });

  } catch (err) {
    console.error('Erro no comando !videorapido:', err);
    await enviarMensagem('❌ Erro ao tentar enviar o vídeo acelerado.');
  }
};