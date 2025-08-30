const {
  estaNaBlacklist,
  adicionarNaBlacklist,
  removerDaBlacklist,
  listarBlacklist,
} = require("../../features/blacklistManager");

const { PREFIX } = require("../../settings.json");

exports.commandBlacklist = async (sock, messageDetails, args, enviarMensagem, permissions) => {
  if (!permissions.isAdmin && !permissions.isOwner) {
    await enviarMensagem("❌ Apenas admins e eu podem usar este comando.");
    return;
  }

  const groupId = messageDetails.key.remoteJid;

  if (args.length === 0) {
    await enviarMensagem(
      `Uso do comando blacklist:\n` +
      `*${PREFIX}blacklist add <número>* - Adiciona número à blacklist do grupo\n` +
      `*${PREFIX}blacklist r <número>* - Remove número da blacklist do grupo\n` +
      `*${PREFIX}blacklist list* - Lista números bloqueados do grupo`
    );
    return;
  }

  const subcomando = args[0].toLowerCase();

  if (subcomando === "add") {
    if (args.length < 2) {
      await enviarMensagem("❌ Informe o número para adicionar na blacklist.");
      return;
    }


    let numero = args[1].replace(/[^\d]/g, "");

    if (numero.length < 10) {
      await enviarMensagem("❌ Número inválido. Informe o número completo com DDD, ex: 5512987050028.");
      return;
    }

    const jid = numero + "@s.whatsapp.net";

    const jaNaBlacklist = estaNaBlacklist(groupId, jid);

    if (jaNaBlacklist) {

      try {
        await sock.groupParticipantsUpdate(groupId, [jid], "remove");
        await enviarMensagem(`⚠️ Número ${numero} já estava na blacklist e foi removido do grupo.`);
      } catch (err) {
        await enviarMensagem(`❌ Não consegui remover o número ${numero} do grupo. Verifique se tenho permissão.`);
        console.error(err);
      }
      return;
    }

    const sucesso = adicionarNaBlacklist(groupId, jid);
    if (sucesso) {
      await enviarMensagem(`✅ Número ${numero} adicionado à blacklist deste grupo.`);
    } else {
      await enviarMensagem(`ℹ️ Número ${numero} já está na blacklist deste grupo.`);
    }

  } else if (subcomando === "r") {
    if (args.length < 2) {
      await enviarMensagem("❌ Informe o número para remover da blacklist.");
      return;
    }
    let numero = args[1].replace(/[^\d]/g, "");

    if (numero.length < 10) {
      await enviarMensagem("❌ Número inválido. Informe o número completo com DDD, ex: 5512987050028.");
      return;
    }

    const jid = numero + "@s.whatsapp.net";

    const sucesso = removerDaBlacklist(groupId, jid);
    if (sucesso) {
      await enviarMensagem(`✅ Número ${numero} removido da blacklist deste grupo.`);
    } else {
      await enviarMensagem(`ℹ️ Número ${numero} não está na blacklist deste grupo.`);
    }

  } else if (subcomando === "list") {
    const lista = listarBlacklist(groupId);
    if (lista.length === 0) {
      await enviarMensagem("A blacklist deste grupo está vazia.");
    } else {
      const texto = lista.map((num, i) => `${i + 1}. ${num}`).join("\n");
      await enviarMensagem(`📋 Números na blacklist deste grupo:\n${texto}`);
    }

  } else {
    await enviarMensagem("❌ Comando inválido. Use add, r ou list.");
  }
};