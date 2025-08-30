const { ownerNumber } = require("../../settings.json");

exports.commandBc = async (sock, msg, args, enviarMensagem) => {
  const remetente = msg.key.participant || msg.key.remoteJid;
  const numeroLimpo = remetente.replace(/\D/g, "");

  if (!ownerNumber.includes(numeroLimpo)) {
    await enviarMensagem("❌ Apenas o dono pode usar esse comando.");
    return;
  }

  const texto = args.join(" ");
  if (!texto) {
    await enviarMensagem("❌ Escreva a mensagem após o comando.\nEx: !bc Olá, isso é um aviso!");
    return;
  }

  try {
    const grupos = await sock.groupFetchAllParticipating();
    const grupoIds = Object.keys(grupos);

    const maxGrupos = 20;  
    const gruposParaEnviar = grupoIds.slice(0, maxGrupos);

    for (const grupoId of gruposParaEnviar) {
      try {
        await sock.sendMessage(grupoId, { text: `📢 *Mensagem do dono:*\n\n${texto}` });
        await new Promise(r => setTimeout(r, 1500)); 
      } catch (e) {
        console.error(`Erro ao enviar para o grupo ${grupoId}:`, e);
      }
    }

    await enviarMensagem(`✅ Mensagem enviada para ${gruposParaEnviar.length} grupos.`);
  } catch (err) {
    console.error("Erro no broadcast:", err);
    await enviarMensagem("❌ Ocorreu um erro ao enviar as mensagens.");
  }
};