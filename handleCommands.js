const fs = require("fs");
const path = require("path");

//INTERNOS
const { proto, generateWAMessageFromContent, downloadMediaMessage } = require('@whiskeysockets/baileys');

const { extractMessages } = require("./extractMessages");  
const { estaNaBlacklist } = require("./features/blacklistManager");
const { setupMessagingServices } = require("./messagingServices/setupMessagingServices");
const {
  menu,
  menuadm,
  menupriv,
  menudono,
  menubrincadeiras,
  menurpg,
  menufig,
  menuranks,
  menuaudio,
  menudownloads,
  menucompleto,
  menualeatorio
} = require("./features/menuCaption");
const { verifyPermissions } = require("./verifyPermissions");  
const contarMensagem = require("./mensagens/contarMensagem");  
const { ownerNumber } = require("./settings.json");
const { getPREFIX } = require("./commands/dono/commandSetPrefix"); 
const { verificaAntiPalavra } = require("./features/verificaAntiPalavra");
const { verificaAntilink } = require("./features/verificaAntilink");  
const { estaAtivo } = require("./utils/soAdmUtils");
const { estaAtivoSoAdm, alternarSoAdm } = require('./features/verificaSoAdm');


//USERS
const { handleAudioCommand } = require("./commands/users/commandsAudioEffects"); 
const { commandFigAleatoria } = require("./commands/users/commandFigAleatoria");
const { commandvidmage } = require("./commands/users/commandvidmage");
const { commandApostar } = require("./commands/rpg/commandApostar");
const { commandMinerar } = require("./commands/rpg/commandMinerar");
const { commandRankOuro } = require("./commands/rpg/commandRankOuro");
const { commandSorteio } = require("./commands/rpg/commandSorteio");
const { commandMinOuro } = require("./commands/rpg/commandMinOuro");
const { commandTutorial } = require("./commands/rpg/commandTutorial");
const { commandRoubar } = require("./commands/rpg/commandRoubar");
const { commandBatalhar } = require("./commands/rpg/commandBatalhar");
const { commandUparEscudo } = require("./commands/rpg/commandUparEscudo");
const { commandComprarEscudo } = require("./commands/rpg/commandComprarEscudo");
const { commandMeuOuro } = require("./commands/rpg/commandMeuOuro");
const { commandComprarSorte } = require("./commands/rpg/commandComprarSorte");
const { commandRpgIniciar } = require("./commands/rpg/commandRpgIniciar");
const { commandDono } = require("./commands/users/commandDono");
const { commandAcoesZoeira } = require("./commands/jogos/commandZoar");
const { commandAttp } = require("./commands/users/commandAttp");
const { commandTtp }  = require("./commands/users/commandTtp");
const { commandVideoRapido } = require("./commands/users/commandVideoRapido");
const { aplicarEfeitoDeAudio } = require("./commands/users/commandAudioscmd");
const Videocmd = require("./commands/users/commandVideocmd");
const { commandAudioRapido } = require("./commands/users/commandAudioRapido");
const { commandAudioLento } = require("./commands/users/commandAudioLento");
const { commandEstourar } = require("./commands/users/commandEstourar");
const { commandTraduzir } = require('./commands/users/commandTraduzir');
const { commandFazerNick } = require("./commands/users/commandFazerNick");
const { execute: commandYtdoc } = require("./commands/users/commandYtdoc");
const play = require('./commands/users/commandPlay');
const play2 = require('./commands/users/commandPlay2');
const commandPlay3 = require('./commands/users/commandvideoPlay3');
const { commandYtmp4 } = require("./commands/users/commandYtmp4");
const { commandSugestao } = require("./commands/users/commandSugestao");
const { commandBug } = require("./commands/users/commandBug");
const { commandCuriosidades } = require("./commands/users/commandCuriosidades");
const commandGtts = require('./commands/users/commandGtts');
const commandFig = require("./commands/users/commandFig");
const { commandStickerVideo } = require("./commands/users/commandStickerVideo");
const { commandSticker } = require("./commands/users/commandSticker");
const { commandCep } = require("./commands/users/commandCep");  
const { commandRanks, comandosRank } = require('./commands/users/commandRanks');

// ADM
const { commandGroupTimer } = require("./commands/admins/commandGroupTimer");
const { commandBanFake } = require("./commands/admins/commandBanFake");
const { commandListFake } = require("./commands/admins/commandListFake");
const { commandLegendaSair } = require("./commands/admins/commandLegendaSair");
const { commandAdd } = require("./commands/admins/commandAdd");
  const { commandAntidoc } = require("./commands/admins/commandAntidoc");
const { commandAntiaudio } = require("./commands/admins/commandAntiaudio");
const { resetarRPG } = require("./commands/admins/CommandResetRpg");
const { commandBlacklist } = require("./commands/admins/commandBlacklist");
const { commandSoAdm } = require('./commands/admins/commandSoAdm');
 const { commandRpgControl } = require("./commands/admins/commandRpgControl");
const commandAdv = require('./commands/admins/commandAdv');
const { commandHidetag } = require("./commands/admins/commandHidetag");
const { commandAntifoto } = require("./commands/admins/commandAntifoto");
const {
  bloquearUsuarioComando,
  desbloquearUsuarioComando,
  usuarioBloqueado,
} = require("./data/usuariosBloqueadosCmd");
const { commandAntifake } = require("./commands/admins/commandAntifake");
const { commandLimpar } = require("./commands/admins/commandLimpar");
const commandAntispam = require("./commands/admins/commandAntispam");
const { commandBan } = require("./commands/admins/commandBan");  
const { commandMarcar } = require("./commands/admins/commandMarcar");  
const { commandWelcome } = require("./commands/admins/commandWelcome");  
const { commandAntiPalavra } = require("./commands/admins/commandAntiPalavra"); 
const { commandAntilink } = require("./commands/admins/commandAntilink");  
const { commandAntifig } = require("./commands/admins/commandAntiFigu");
const { commandGrupo } = require("./commands/admins/commandGrupo");  
const { commandDeletar } = require("./commands/admins/commandDeletar");  
const { commandDescGp } = require("./commands/admins/commandDescGp");  
const { commandLinkGp } = require("./commands/admins/commandLinkGp");  
const { commandConvite } = require("./commands/admins/commandConvite");  
const { commandInfoGp } = require("./commands/admins/commandInfoGp");  
const commandAdminControl = require("./commands/admins/commandAdminControl");
const { commandNomeGp } = require("./commands/admins/commandNomeGp");  

//jogos
const { commandCassino } = require("./commands/jogos/commandCassino");
const { commandJogoDaVelha, commandJogar, commandKilJogoDaVelha } = require("./commands/jogos/commandJogoDaVelha");
const { commandAdivinhaDica, commandResponder } = require('./commands/jogos/commandAdivinha');
const { commandEuNunca } = require('./commands/jogos/commandEuNunca');
const { commandForca } = require('./commands/jogos/commandForca');
const { commandPPT } = require('./commands/jogos/commandPPT');

//Dono
const { commandFotoMenu } = require("./commands/dono/commandFotoMenu");
const { commandAdono } = require("./commands/dono/commandAdono")
const commandBotoff = require("./commands/dono/commandBotoff");
const commandBoton = require("./commands/dono/commandBoton");
const { commandBanchat } = require("./commands/dono/commandBanchat");  
const { commandAntiPrivado } = require("./commands/dono/commandAntiPrivado");
const { commandListGp } = require("./commands/dono/commandListGp");
const { commandSairGp } = require("./commands/dono/commandSairGp");  
const { commandBc } = require("./commands/dono/commandBc");  
const { commandRevogarLinkGp } = require("./commands/dono/commandRevogarLinkGp");  
const { commandBanTodos } = require("./commands/dono/commandBanTodos");  
const commandSetPREFIX = require("./commands/dono/commandSetPrefix");
const commandNomeDono = require("./commands/dono/commandNomeDono");

exports.handleMessage = async (sock, msg) => {
  const settingsPath = path.join(__dirname, "settings.json");

  try {

    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));

    if (settings.VIEW_MESSAGES) {
  const from = msg.key.remoteJid;
  const participant = msg.key.participant || from;

  const type = Object.keys(msg.message || {})[0];
  let content = "";
  if (msg.message?.conversation) content = msg.message.conversation;
  else if (msg.message?.extendedTextMessage?.text) content = msg.message.extendedTextMessage.text;
  else content = "[Conteúdo não textual]";

  if (content.length > 100) content = content.slice(0, 100) + "...";

  let groupName = from;
  if (from.endsWith("@g.us")) {
    try {
      const metadata = await sock.groupMetadata(from);
      groupName = metadata.subject || from;
    } catch {
      groupName = from;
    }
  }

  console.log(`
┌─[👀 VIEW MSG]
│📱 De       : ${participant.replace("@s.whatsapp.net", "")}
│👨‍💻 Grupo   : ${groupName}
│🆎 Tipo     : ${type}
│✏️ Conteúdo : ${content}
└───────────────
  `);

  if (sock.readMessages) await sock.readMessages([msg.key]).catch(() => {});
}

    const texto = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

    if (texto.toLowerCase().trim() === "prefixo") {
      const PREFIX = getPREFIX();
      await sock.sendMessage(msg.key.remoteJid, {
        text: `🟢 Meu prefixo atual é: *${PREFIX}*`
      }, { quoted: msg });
      return; 
    }

    await verificaAntilink(sock, msg);  
    await verificaAntiPalavra(sock, msg);  
    await processarComando(sock, msg);  

  } catch (error) {  
    console.error("❌ Erro ao processar mensagem:", error);  
  }  
};

async function processarComando(sock, messageDetails) {
  try {
    const PREFIX = getPREFIX();

    const {
      from,
      participant,
      commandName,
      args,
      userMention,
      userName,
      isCommand,
      text,
      isGroup,
      remoteJid,
      sender,
    } = extractMessages(messageDetails, sock);

    const {
      enviarAudioGravacao,
      enviarAudio,
      enviarImagem,
      enviarMensagem,
      enviarImagemUrl,
      enviarGifUrl,
      enviarVideo,
      reagir
    } = setupMessagingServices(sock, from, messageDetails);

    const BOT_PHONE = sock.user?.id?.split(":")[0] + "@s.whatsapp.net";
    const BOT_ID = BOT_PHONE;

    const permissions = await verifyPermissions(sock, from, participant, commandName, BOT_PHONE);


const usuario = sender || participant;
const PREFIXO = getPREFIX(); 

const messageText =
  messageDetails.message?.conversation ||
  messageDetails.message?.extendedTextMessage?.text ||
  messageDetails.message?.imageMessage?.caption ||
  "";

const ehComando = messageText.startsWith(PREFIX);

if (ehComando && usuarioBloqueado(usuario)) {
  await sock.sendMessage(
    from,
    { text: "🚫 Você está bloqueado de usar meus comandos." },
    { quoted: messageDetails }
  );
  return;
}

    if (!isCommand) return;

    const { estaRPGAtivado } = require("./utils/rpgStatus");

    const comandosRPG = [
      "minerar", "apostar", "rankouro", "sorteio", "minouro",
      "tutorial", "roubar", "batalhar", "uparescudo", "escudo",
      "sorte", "meuouro", "doarouro", "recompensa", "rpg"
    ];

    if (comandosRPG.includes(commandName)) {
      if (!estaRPGAtivado()) {
        await enviarMensagem("⚠️ O sistema de RPG está *desativado* no momento.");
        return;
      }
    }

    const fs = require("fs");
    const path = require("path");
    const statusPath = path.join(__dirname, "data", "botStatus.json");
    let status = "on";
    try {
      const statusData = JSON.parse(fs.readFileSync(statusPath, "utf-8"));
      status = statusData.status;
    } catch (e) {
      status = "on";
    }

    const comandoAtivoMesmoComBotOff = ["boton", "ping"];
    if (status === "off" && !comandoAtivoMesmoComBotOff.includes(commandName)) {
      return;
    }


    if (!isCommand) return;

    const groupMetadataCache = new Map();

    async function getGroupMetadataCached(sock, groupId) {
      if (groupMetadataCache.has(groupId)) {
        return groupMetadataCache.get(groupId);
      }
      try {
        const metadata = await sock.groupMetadata(groupId);
        groupMetadataCache.set(groupId, metadata);
        return metadata;
      } catch (err) {
        if (err.message.includes('rate-overlimit')) {
          console.warn('Rate limit atingido, aguardando 5s antes de tentar novamente...');
          await new Promise(res => setTimeout(res, 5000));
          try {
            const metadataRetry = await sock.groupMetadata(groupId);
            groupMetadataCache.set(groupId, metadataRetry);
            return metadataRetry;
          } catch (err2) {
            console.error("Falha na segunda tentativa de obter metadata:", err2.message || err2);
            return null;
          }
        }
        console.error("Erro ao obter metadata do grupo:", err.message || err);
        return null;
      }
    }

    if (typeof comandoAdmin !== "undefined" && comandoAdmin.includes(commandName)) {
      if (!isGroup) {
        await enviarMensagem(sock, from, "Este comando só funciona em grupos.");
        return;
      }
      if (!permissions.isAdmin) {
        await enviarMensagem(sock, from, "Somente admins podem usar este comando.");
        return;
      }
      if (!permissions.isBotAdmin) {
        await enviarMensagem(sock, from, "Eu preciso ser admin para executar este comando.");
        return;
      }
    }

    let isGroupAdmins = false;
    let isBotAdmin = false;
    let grupoInfo = null;
    
    
    if (isGroup) {
      try {
        grupoInfo = await sock.groupMetadata(remoteJid);
      } catch (err) {
        console.error("Erro ao obter metadata do grupo:", err.message || err);
      }
    }

    if (isGroup) {
      const metadata = await getGroupMetadataCached(sock, remoteJid);
      if (metadata) {
        const groupAdmins = metadata.participants
          .filter(p => p.admin)
          .map(p => p.id);
        isGroupAdmins = groupAdmins.includes(participant);
        isBotAdmin = groupAdmins.includes(BOT_PHONE);
      }
    }
    
    let mediaInfo = null;
    if (messageDetails.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quoted = messageDetails.message.extendedTextMessage.contextInfo.quotedMessage;
      const mediaType = Object.keys(quoted)[0];
      if (
        mediaType === "imageMessage" ||
        mediaType === "videoMessage" ||
        mediaType === "audioMessage" ||
        mediaType === "stickerMessage"
      ) {
        const buffer = await downloadMediaMessage({ message: quoted }, "buffer");
        mediaInfo = { buffer, mimetype: mediaType };
      }
    } else if (
      messageDetails.message?.imageMessage ||
      messageDetails.message?.videoMessage ||
      messageDetails.message?.audioMessage ||
      messageDetails.message?.stickerMessage
    ) {
      const mediaType = messageDetails.message.imageMessage
        ? "imageMessage"
        : messageDetails.message.videoMessage
        ? "videoMessage"
        : messageDetails.message.audioMessage
        ? "audioMessage"
        : "stickerMessage";

      const buffer = await downloadMediaMessage(messageDetails, "buffer");
      mediaInfo = { buffer, mimetype: mediaType };
    }

    switch (commandName) {
      case "ping":
        await reagir("📡");
        if (!permissions.isOwner) {
          await enviarMensagem(sock, from, "🚫 Este comando é exclusivo para o meu dono!");
          return;
        }

        const os = require("os");
        const { performance } = require("perf_hooks");

        const nomeBot = "Kayros_bot";
        const versaoBot = "1.0";
        const prefixo = PREFIX;

        const tempoInicio = performance.now();
        await sock.sendPresenceUpdate("composing", from);
        const tempoFim = performance.now();
        const latencia = (tempoFim - tempoInicio).toFixed(2);

        const segundosUptime = process.uptime();
        const formatarTempo = (seg) => {
          const d = Math.floor(seg / 86400);
          const h = Math.floor((seg % 86400) / 3600);
          const m = Math.floor((seg % 3600) / 60);
          const s = Math.floor(seg % 60);
          return `${d}d ${h}h ${m}m ${s}s`;
        };

        const memoriaTotal = os.totalmem() / 1024 / 1024 / 1024;
        const memoriaUsada = process.memoryUsage().rss / 1024 / 1024;
        const usoRam = ((memoriaUsada / (memoriaTotal * 1024)) * 100).toFixed(0);

        const texto = `
╭━━「 🟢 *STATUS* 」
┃ 🤖 *Informações*
┃ ├ Nome: *${nomeBot}*
┃ ├ Versão: *${versaoBot}*
┃ ├ prefixo: *${PREFIX}*

┃ 📡 *Conexão*
┃ ├ Latência: *${latencia}ms*
┃ └ Status: *${latencia < 100 ? "Boa" : latencia < 500 ? "Média" : "Ruim"}*

┃ 💻 *Sistema*
┃ ├ OS: *${os.type()} (${os.release()})*
┃ ├ Arq.: *${os.arch()}*
┃ └ Uptime: *${formatarTempo(segundosUptime)}*

┃ 🧠 *Memória*
┃ ├ RAM Bot: *${memoriaUsada.toFixed(2)} MB*
┃ └ Uso RAM: *${usoRam}%*
╰━━━━━━━`;

        await sock.sendMessage(from, { text: texto.trim() });
        break;
    
    case "antiprivado1":
case "antiprivado2":
  await commandAntiPrivado(sock, messageDetails, commandName, enviarMensagem);
  break;
    
    case "foto_menu":
  await commandFotoMenu(sock, messageDetails, enviarMensagem, permissions.isOwner);
  break;
  
  case "numero_dono": {
    const settingsPath = path.join(__dirname, "settings.json");
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));

    const sender = messageDetails.key.participant || messageDetails.key.remoteJid;
    const numeroRemetente = sender.replace("@s.whatsapp.net", "");

    if (!settings.ownerNumber.includes(numeroRemetente)) {
        await enviarMensagem("❌ Apenas o meu dono pode usar este comando.");
        return;
    }

    if (!args[0] || !["add", "r"].includes(args[0].toLowerCase())) {
        await enviarMensagem("❌ Use: numero_dono add/r <número>");
        return;
    }

    if (!args[1]) {
        await enviarMensagem("❌ Informe um número para adicionar ou remover.");
        return;
    }

    let numero = args[1].replace(/\D/g, "");
    if (numero.length === 11) numero = "55" + numero;

    const action = args[0].toLowerCase();

    if (action === "add") {
        if (settings.ownerNumber.includes(numero)) {
            await enviarMensagem(`❌ O número ${numero} já está na lista de donos.`);
            return;
        }
        settings.ownerNumber.push(numero);
        settings.donoBot.push(numero);
        await enviarMensagem(`✅ Número ${numero} adicionado com sucesso à lista de donos.`);
    } else if (action === "r") {
        if (!settings.ownerNumber.includes(numero)) {
            await enviarMensagem(`❌ O número ${numero} não está na lista de donos.`);
            return;
        }
        settings.ownerNumber = settings.ownerNumber.filter(n => n !== numero);
        settings.donoBot = settings.donoBot.filter(n => n !== numero);
        await enviarMensagem(`✅ Número ${numero} removido da lista de donos.`);
    }

    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}
break;
  
  case "nome_dono": {
    await commandNomeDono.commandNomeDono(sock, messageDetails, args, enviarMensagem);
    break;
}
    
      case "listgp":  
    await commandListGp(sock, messageDetails, args, enviarMensagem);  
    break;
  
      case "sairgp":  
        await commandSairGp(sock, messageDetails, args, enviarMensagem);  
        break;  
  
      case "bc":  
        await commandBc(sock, messageDetails, args, enviarMensagem);  
        break;  

case "viewmsg":
    const commandViewMsg = require("./commands/dono/commandViewMsg");
    await commandViewMsg.commandViewMsg(sock, messageDetails, args, enviarMensagem);
    break;

case "criargp": {
    if (!permissions.isOwner) {
        await enviarMensagem("🚫 Apenas o meu dono pode usar este comando.");
        return;
    }

    if (!args || !args.length) {
        await enviarMensagem(`❌ Use: ${prefix}criargp NomeDoGrupo`);
        return;
    }

    const nomeGrupo = args.join(" ").trim();
    if (!nomeGrupo) {
        await enviarMensagem("❌ O nome do grupo não pode estar vazio.");
        return;
    }

    try {
        const senderNumber = messageDetails?.key?.fromMe
            ? sock.user.id.split(":")[0] + "@s.whatsapp.net"
            : messageDetails?.key?.participant || messageDetails?.key?.remoteJid;

        if (!senderNumber) {
            await enviarMensagem("❌ Não foi possível identificar seu número.");
            return;
        }

        const result = await sock.groupCreate(nomeGrupo, [senderNumber]);
        const groupId = result.gid;

        let linkGrupo;
        try {
            const groupInvite = await sock.groupInviteCode(groupId);
            linkGrupo = `https://chat.whatsapp.com/${groupInvite}`;
        } catch (inviteErr) {
            if (inviteErr?.output?.statusCode === 408) {
                // Timeout do WhatsApp, mas o grupo foi criado
                linkGrupo = "⚠️ O grupo foi criado, mas o link não pôde ser obtido devido ao timeout.";
            } else {
                throw inviteErr; // Outro erro real
            }
        }

        await enviarMensagem(`✅ Grupo criado com sucesso!\nNome: ${nomeGrupo}\nLink: ${linkGrupo}`);
    } catch (err) {
        console.error("Erro ao criar grupo:", err);
        await enviarMensagem("❌ Ocorreu um erro ao criar o grupo.");
    }
    break;
}
  
      case "revogarlinkgp":  
        await commandRevogarLinkGp(sock, messageDetails, enviarMensagem);  
        break;  
        
        case "audio_menu":
  await require("./commands/dono/commandAudiomenu")
    .commandAudioMenu(sock, messageDetails, args, enviarMensagem, mediaInfo);
  break;
        
        case "seradm":
    case 'adono':
  const groupMetadata = await sock.groupMetadata(from);
  await commandAdono(sock, messageDetails, args, groupMetadata);
  break;
        
case "setprefix":
  await commandSetPREFIX.execute(sock, messageDetails, args, enviarMensagem, permissions.isOwner);
  break;
        
        case "sermemb": {
  const commandSermemb = require('./commands/dono/commandSerMemb');
  await commandSermemb.execute(sock, messageDetails, enviarMensagem, permissions);
  break;
}
        
case "banchat²":  
  case "nuke":  
      case "banchattotal":  
        await commandBanTodos(sock, messageDetails, enviarMensagem);  
        break;  

        case "botoff":
  await commandBotoff.execute(sock, messageDetails, enviarMensagem, permissions.isOwner);
  break;
  
case "boton":
  await commandBoton.execute(sock, messageDetails, enviarMensagem, permissions.isOwner);
  break;

  // USERS
  case "qc":
  await require("./commands/users/commandQc").commandQc(sock, messageDetails, args, enviarMensagem);
  break;
  
  
  case "metadinha": {
  const fs = require("fs");
  const path = require("path");

  const pastaFotos = path.join(__dirname, "assets", "fotos");
  let arquivos = fs.readdirSync(pastaFotos)
                   .filter(file => /\.(jpg|png)$/i.test(file));

  if (arquivos.length < 2) {
    await enviarMensagem("❌ Não há fotos suficientes na pasta!");
    return;
  }


  let grupos = {};
  arquivos.forEach(file => {
    let base = path.parse(file).name; 
    if (!grupos[base]) grupos[base] = [];
    grupos[base].push(file);
  });


  let paresValidos = Object.values(grupos).filter(g => g.length >= 2);
  if (paresValidos.length === 0) {
    await enviarMensagem("❌ Não há pares de fotos correspondentes (.png + .jpg)!");
    return;
  }


  let par = paresValidos[Math.floor(Math.random() * paresValidos.length)];


  for (const foto of par) {
    await sock.sendMessage(messageDetails.key.remoteJid, { 
      image: { url: path.join(pastaFotos, foto) }, 
      caption: "🖼️ Metadinha!"
    });
  }

  break;
}


case "upload_doc":
  await require('./commands/users/commandUploadDoc').executar(messageDetails, sock, args);
  break;
  
  case "perfil":
  await require("./commands/users/commandPerfil").run(sock, messageDetails, enviarMensagem);
  break;
  
  case ".text": {
  try {

    const texto = text.slice(6).trim();
    if (!texto) {
      await sock.sendMessage(from, { text: "❌ Use: .text sua mensagem" });
      return;
    }

    const groupMetadata = await sock.groupMetadata(from);
    const membros = groupMetadata.participants.map(p => p.id);

    await sock.sendMessage(from, {
      text: texto,
      contextInfo: { mentionedJid: membros }
    });

  } catch (e) {
    console.error(e);
    await sock.sendMessage(from, { text: "❌ Erro ao executar o comando!" });
  }
  break;
}
  
  case "criador": {
    try {
        const numeroDono = "553195760220";
        const nomeDono = "criador";

        const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${nomeDono}
TEL;type=CELL;waid=${numeroDono}:${numeroDono}
END:VCARD
`.trim();

        await sock.sendMessage(from, {
            contacts: {
                displayName: nomeDono,
                contacts: [{ vcard }]
            },
            caption: "📲 Aqui está o contato do meu criador:"
        }, { quoted: messageDetails });

    } catch (e) {
        console.error("Erro ao enviar criador:", e);
        await sock.sendMessage(from, { text: "❌ Não consegui enviar o contato do criador." }, { quoted: messageDetailstô });
    }
    break;
}
  
  case `tiktok`:
    case `kwai`:
    case `instagram`:
    case `youtube`:
    case `upload`:
  require('./commands/users/commandUpload').executar(messageDetails, sock, args);
  break;
  
case "rankativo": {
  const commandRankAtivo = require("./commands/users/commandRankativo");
  await commandRankAtivo(messageDetails, sock);
  break;
}

case "rankinativo": {
  const commandInativo = require("./commands/users/commadRankInativo");
  await commandInativo(messageDetails, sock);
  break;
}

case "figimagem":
    await commandvidmage(sock, messageDetails, enviarMensagem);
    break;


case "rpgstatus": {
  await commandRpgControl(sock, messageDetails, args, enviarMensagem,
    permissions.isGroup,
    permissions.isAdmin,
    permissions.isOwner
  );
  break;
}

case "doarouro": {
  const { commandDoarOuro } = require('./commands/rpg/commandDoarOuro');
  await commandDoarOuro(sock, messageDetails, enviarMensagem);
      break;
  }

case "figaleatoria":
  await commandFigAleatoria(sock, messageDetails, enviarMensagem, async (stickerBuffer) => {
    await sock.sendMessage(messageDetails.key.remoteJid, {
      sticker: stickerBuffer
    }, { quoted: messageDetails });
  });
  break;

case `recompensa`: {
  const { commandRecompensa } = require('./commands/rpg/commandRecompensa');
  await commandRecompensa(sock, messageDetails, enviarMensagem);
  break;
}

case `apostar`: {
  await commandApostar(sock, messageDetails, enviarMensagem, participant, userName, args);
  break;
}
 case "minerar":
  await commandMinerar(sock, messageDetails, enviarMensagem, participant, userName);
  break;
 
  case "rankouro":
  await commandRankOuro(sock, messageDetails, enviarMensagem);
  break;

case "sorteio":
  await commandSorteio(sock, messageDetails, enviarMensagem);
  break;

case "minouro":
  await commandMinOuro(sock, messageDetails, enviarMensagem, participant);
  break;

case "tutorial":
  await commandTutorial(sock, messageDetails, enviarMensagem);
  break;
  
  case "roubar":
  await commandRoubar(sock, messageDetails, enviarMensagem, participant, userName, args);
  break;
  
  case "batalhar":
  await commandBatalhar(sock, messageDetails, enviarMensagem, participant, userName, args);
  break;
  
  case "resetrpg":
  await resetarRPG(sock, messageDetails);
  break;
  
  case "uparescudo":
  await commandUparEscudo(sock, messageDetails, enviarMensagem, participant);
  break;
  
  case "escudo":
  await commandComprarEscudo(sock, messageDetails, enviarMensagem, participant);
  break;
  
  case "sorte":
  await commandComprarSorte(sock, messageDetails, enviarMensagem, participant);
  break;
  
  case "meuouro":
  await commandMeuOuro(sock, messageDetails, enviarMensagem, participant);
  break;

  case "rpg iniciar":
  case "rpg":
  if (args[0] === "iniciar") {
    await commandRpgIniciar(sock, messageDetails, enviarMensagem, participant, userName);
  } else {
    await enviarMensagem("❌ Comando inválido. Use: *!rpg iniciar*");
  }
  break;
  
  case "jogodavelha":
  await commandJogoDaVelha({ sock, messageDetails, enviarMensagem, args, userMention, participant });
  break;

case "kiljogodavelha":
  await commandKilJogoDaVelha({ sock, messageDetails, enviarMensagem });
  break;

case "jogar":
  await commandJogar({ sock, messageDetails, enviarMensagem, args, participant });
  break;
  
case "play3":
    await commandPlay3.execute(messageDetails, sock, args);
    break;

case "ttp":
  await commandTtp(sock, messageDetails, enviarMensagem);
  break;

case "roubastick": {
  if (!mediaInfo || mediaInfo.mimetype !== "stickerMessage") {
    await enviarMensagem("⚠️ Responda uma figurinha para roubá-la!");
    return;
  }

  await sock.sendMessage(from, {
    sticker: mediaInfo.buffer
  }, { quoted: messageDetails });
  break;
}

case "traduzir":
await commandTraduzir(sock, messageDetails, args, enviarMensagem);
break;

case "dono":
  await commandDono(sock, messageDetails, enviarMensagem);
  break;

  case "estourar":
    await commandEstourar(sock, messageDetails, mediaInfo, enviarAudio);
    break;

case "audiorápido":
case "audiorapido":
case "rapido":
    await commandAudioRapido(sock, messageDetails, mediaInfo, enviarMensagem, args);
    break;

case "audiolento":
case "audio lento":
  case "lento":
await commandAudioLento(sock, messageDetails, mediaInfo, enviarMensagem);
break;

case "grave":
case "agudo":
case "reverse":
case "robo":
case "eco":
case "helio":
case "caverna":
    await aplicarEfeitoDeAudio(sock, messageDetails, enviarMensagem, commandName);
    break;

case "videorapido":
case "videolento":
case "videoreverse":
case "videorobo":
    await Videocmd[commandName](sock, messageDetails, enviarMensagem);
    break;
  
  case "ytdoc":
case "ytmp4doc":
  await commandYtdoc(sock, messageDetails, args, enviarMensagem);
  break;
  
  case `play`:
  await play.execute(messageDetails, sock, args);
  break;
  
case `play2`:
  await play2.execute(messageDetails, sock, args);
  break;
  
  case "ytmp3":
  await commandYtmp3(sock, messageDetails, args, enviarMensagem);
  break;

case "ytmp4":
  await commandYtmp4(sock, messageDetails, args, enviarMensagem);
  break;

case "fazernick":
await commandFazerNick(sock, messageDetails, args, enviarMensagem);
break;

  case "sugestao":
case "sugestão":
  await reagir("🧑‍💻");
  await commandSugestao(sock, messageDetails, args, enviarMensagem);
  break;
  
case "bug":
  await commandBug(sock, messageDetails, args, enviarMensagem);
  break;

case "rename":
case "renomear":
case "rn":
  await require("./commands/users/commandRename").commandRename(sock, messageDetails, args, mediaInfo);
  break;

  case "curiosidade":
case "curiosidades":
  await commandCuriosidades(enviarMensagem);
  break;
  
  case "gtts":
  await commandGtts(sock, messageDetails, args, enviarMensagem, enviarAudio, reagir, userName);
  break;
  
case "fig":
  await commandFig(sock, messageDetails);
  break;
  
  case "stickervideo":
case "sv":
  await commandStickerVideo(sock, messageDetails);
  break;
 
  case "forca":
  await commandForca(sock, messageDetails, args, from, enviarMensagem);
  break;

case "admins":
  try {
    const groupMetadata = await sock.groupMetadata(messageDetails.key.remoteJid);
    const admins = groupMetadata.participants.filter(p => p.admin); 

    if (admins.length === 0) {
      await sock.sendMessage(
        messageDetails.key.remoteJid,
        { text: "❌ Não encontrei administradores neste grupo." },
        { quoted: messageDetails }
      );
      return;
    }

    const mentions = admins.map(a => a.id);
    const texto = `📢 *Chamando todos os administradores do grupo!*\n\n${admins
      .map(a => `@${a.id.split("@")[0]}`)
      .join(" ")}`;

    await sock.sendMessage(
      messageDetails.key.remoteJid,
      { text: texto, mentions },
      { quoted: messageDetails }
    );
  } catch (err) {
    console.error(err);
    await sock.sendMessage(
      messageDetails.key.remoteJid,
      { text: "❌ Erro ao buscar administradores." },
      { quoted: messageDetails }
    );
  }
  break;
  
case "ppt":
  await commandPPT(args, enviarMensagem, userName);
  break;

case "eununca":
  await commandEuNunca(enviarMensagem);
  break;
  
  case "cassino":
    await reagir("🎰");
  await commandCassino(sock, messageDetails, enviarMensagem);
  break;
  
  case "sticker":
  case "s":
    await commandSticker(sock, messageDetails);
    break;
  
  case "rankativo":
  const { commandRankAtivo } = require("./commands/users/commandRankAtivo");
  await commandRankAtivo(sock, messageDetails, enviarMensagem);
  break;
  
  case "rankinativo":
  const { commandInativo } = require("./commands/users/commandInativo");
  await commandInativo(sock, messageDetails, enviarMensagem);
  break;
  
  case "falso": {
  if (!userMention) {
    await enviarMensagem("❌ Marque alguém para chamar de falso.");
    return;
  }
  if (userMention === participant) {
    await enviarMensagem("❌ Você não pode se chamar de falso.");
    return;
  }
  const chance = Math.floor(Math.random() * 100) + 1;
  const textoFalso = `😒 @${participant.split("@")[0]} acha que @${userMention.split("@")[0]} é *${chance}%* falso(a)!`;
  await enviarGifUrl("assets/audios/gifs/falso.mp4", textoFalso, [participant, userMention]);
  break;
}

case "chance": {

  if (!text.toLowerCase().includes("chance de")) {
    await enviarMensagem("❌ Use o comando no formato: *!chance de @user fazer algo*");
    return;
  }

  if (!userMention) {
    await enviarMensagem("❌ Marque alguém para calcular a chance.");
    return;
  }

  const regex = /chance de\s+@?\d{5,}\s+(.+)/i;
  const match = text.match(regex);

  if (!match || !match[1]) {
    await enviarMensagem("❌ Escreva uma ação após o usuário, exemplo: *!chance de @user casar com alguém*");
    return;
  }

  const acao = match[1].trim();
  const chance = Math.floor(Math.random() * 100) + 1;
  const textoResposta = `🎯 Chance de @${userMention.split("@")[0]} ${acao} é de *${chance}%*!`;

  await enviarGifUrl("assets/audios/gifs/chanceacao.mp4", textoResposta, [userMention]);
  break;
}

case "bonito": {
  if (!userMention) {
    await enviarMensagem("❌ Marque alguém para elogiar como Bonito(a).");
    return;
  }
  const chance = Math.floor(Math.random() * 100) + 1;
  const textoDonito = `😍 @${userMention.split("@")[0]} está *${chance}%* mais bonito(a) hoje!`;
  await enviarGifUrl("assets/audios/gifs/bonito.mp4", textoDonito, [userMention]);
  break;
}

case "abraço":
case "abraco": {
  if (!userMention) {
    await enviarMensagem("❌ Marque alguém para dar um abraço.");
    return;
  }
  if (userMention === participant) {
    await enviarMensagem("❌ Você não pode se abraçar sozinho 😢");
    return;
  }
  const chance = Math.floor(Math.random() * 100) + 1;
  const textoAbraco = `🤗 @${participant.split("@")[0]} deu um abraço de *${chance}%* de carinho em @${userMention.split("@")[0]}!`;
  await enviarGifUrl("assets/audios/gifs/abraco.mp4", textoAbraco, [participant, userMention]);
  break;
}

case "gay": {
  if (!userMention) {
    await enviarMensagem("❌ Marque alguém para descobrir o nível de gayzice.");
    return;
  }
  if (userMention === participant) {
    await enviarMensagem("❌ Você não pode medir o próprio nível 😅");
    return;
  }
  const chance = Math.floor(Math.random() * 100) + 1;
  const textoGay = `🌈 @${userMention.split("@")[0]} é *${chance}%* gay!`;
  await enviarGifUrl("assets/audios/gifs/gay.mp4", textoGay, [participant, userMention]);
  break;
}

case "fiel": {
  if (!userMention) {
    await enviarMensagem("❌ Marque alguém para ver o nível de fidelidade.");
    return;
  }
  const chance = Math.floor(Math.random() * 100) + 1;
  const textoFiel = `💍 @${userMention.split("@")[0]} é *${chance}%* fiel!`;
  await enviarGifUrl("assets/audios/gifs/fiel.mp4", textoFiel, [userMention]);
  break;
}

case "infiel": {
  if (!userMention) {
    await enviarMensagem("❌ Marque alguém para ver o nível de infidelidade.");
    return;
  }
  const chance = Math.floor(Math.random() * 100) + 1;
  const textoInfiel = `💔 @${userMention.split("@")[0]} é *${chance}%* infiel!`;
  await enviarGifUrl("assets/audios/gifs/infiel.mp4", textoInfiel, [userMention]);
  break;
}

case "talarico": {
  if (!userMention) {
    await enviarMensagem("❌ Marque alguém para saber o nível de talaricagem.");
    return;
  }
  if (userMention === participant) {
    await enviarMensagem("❌ Você não pode se talaricar, calma aí...");
    return;
  }
  const chance = Math.floor(Math.random() * 100) + 1;
  const textoTalarico = `👀 @${userMention.split("@")[0]} tem *${chance}%* de talarico(a)!`;
  await enviarGifUrl("assets/audios/gifs/talarico.mp4", textoTalarico, [participant, userMention]);
  break;
}

case "bebado":
case "bêbado": {
  if (!userMention) {
    await enviarMensagem("❌ Marque alguém para zoar de bêbado.");
    return;
  }
  const chance = Math.floor(Math.random() * 100) + 1;
  const textoBebado = `🍻 @${userMention.split("@")[0]} está *${chance}%* bêbado(a)! Alguém segura! 😂`;
  await enviarGifUrl("assets/audios/gifs/bebado.mp4", textoBebado, [userMention]);
  break;
}
  
  case "beijar": {
  if (!userMention) {
    await enviarMensagem("❌ Marque alguém para beijar.");
    return;
  }
  if (userMention === participant) {
    await enviarMensagem("❌ Você não pode se beijar!");
    return;
  }

  const chance = Math.floor(Math.random() * 100) + 1;
  const textoBeijo = `💋 Você tem *${chance}%* de chance de beijar @${userMention.split("@")[0]}!\n❤️ Que beijão...`;
  await enviarGifUrl("https://telegra.ph/file/c9b5ed858237ebc9f7356.mp4", textoBeijo, [userMention]);
  break;
}
  
  case "chutar":
case "matar":
case "reviver":
case "chance":
  await commandAcoesZoeira(commandName, sock, messageDetails, userMention, participant, enviarGifUrl, enviarMensagem);
  break;
  
  case 'soco': {
  if (!userMention) {
    await enviarMensagem('❌ Marque alguém para dar um soco.');
    return;
  }
  if (userMention === participant) {
    await enviarMensagem('❌ Você não pode se socar!');
    return;
  }
  const chance = Math.floor(Math.random() * 100) + 1;
  const textoSoco = `👊 @${participant.split('@')[0]} deu um soco com *${chance}%* de força em @${userMention.split('@')[0]}!`;
  await enviarGifUrl('assets/audios/gifs/soco.mp4', textoSoco, [participant, userMention]);
  break;
}

case 'tapa': {
  if (!userMention) {
    await enviarMensagem('❌ Marque alguém para dar um tapa.');
    return;
  }
  if (userMention === participant) {
    await enviarMensagem('❌ Você não pode se tapar!');
    return;
  }
  const chance = Math.floor(Math.random() * 100) + 1;
  const textoTapa = `🖐️ @${participant.split('@')[0]} deu um tapa com *${chance}%* de intensidade em @${userMention.split('@')[0]}!`;
  await enviarGifUrl('assets/audios/gifs/tapa.mp4', textoTapa, [participant, userMention]);
  break;
}

case 'romance': {
  const mentions = messageDetails.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  if (mentions.length < 2) {
    await enviarMensagem('❌ Marque duas pessoas para esse romance.');
    return;
  }

  const firstUser = mentions[0];
  const secondUser = mentions[1];

  if (firstUser === secondUser) {
    await enviarMensagem('❌ Não dá para fazer romance consigo mesmo.');
    return;
  }

  const chance = Math.floor(Math.random() * 100) + 1;
  const textoRomance = `💞 @${firstUser.split('@')[0]} e @${secondUser.split('@')[0]} estão vivendo um romance com *${chance}%* de intensidade!`;

  await enviarGifUrl('assets/audios/gifs/romance.mp4', textoRomance, [firstUser, secondUser]);
  break;
}

case "rankcomunista":
case "rankgay":
case "rankgado":
case "rankcorno":
case "rankgostoso":
case "rankgostosa":
case "rankotakus":
  await commandRanks(sock, messageDetails, commandName, from);
  break;


      case "advn":  
      case "adivinhar":  
        const numeroEscolhido = parseInt(args[0]);  
        if (isNaN(numeroEscolhido) || numeroEscolhido < 1 || numeroEscolhido > 10) {  
          await enviarMensagem("Você precisa digitar um número de 1 a 10.");  
          return;  
        }  
  
        const numeroSorteado = Math.floor(Math.random() * 10) + 1;  
  
        if (numeroEscolhido === numeroSorteado) {  
          await enviarMensagem(`🎉 Parabéns ${userName}, você acertou! O número era: ${numeroSorteado}`);  
        } else {  
          await enviarMensagem(`❌ Que pena, ${userName}! O número era: ${numeroSorteado}`);  
        }  
        break;  
        
case "adivinha":
  await commandAdivinhaDica(args, enviarMensagem);
  break;

case "responder":
  await commandResponder(args, enviarMensagem, userName);
  break;
  
       case "cep":  
        await commandCep(args, enviarMensagem);  
        break;  
        
        case "menu":
    case "help":
      await reagir("🌀");
      await enviarAudioGravacao("assets/menu/audios/menu.mp3");
      await enviarImagem("assets/menu/menu.jpg", menu(userName));
      break;

case "menuadm":
  await reagir("🔥");
      await enviarAudioGravacao("assets/menu/audios/menuadm.mp3");
      await enviarImagem("assets/menu/menu.jpg", menuadm(userName));
  break;

case "menucompleto":
  await reagir("⚜️");
      await enviarAudioGravacao("assets/menu/audios/menucompleto.mp3");
      await enviarImagem("assets/menu/menu.jpg", menucompleto(userName));
  break;

case "menudono":
case "menuowner": {
  const settings = require("./settings.json");
  const OWNER_NUMBERS = settings.ownerNumber; 
  const sender = messageDetails.key.participant || messageDetails.key.remoteJid;
  const numeroLimpo = sender.replace(/\D/g, "");

  if (!OWNER_NUMBERS.includes(numeroLimpo)) {
    await sock.sendMessage(from, { text: "❌ Esse menu é exclusivo do *meu dono*!" });
    return;
  }
  await reagir("🔓");
  await enviarAudioGravacao("assets/menu/audios/menudono.mp3");
  await enviarImagem("assets/menu/menu.jpg", menudono(userName));
}
break;

case "menupriv": {
  const settings = require("./settings.json");
  const OWNER_NUMBERS = settings.ownerNumber; 
  const sender = messageDetails.key.participant || messageDetails.key.remoteJid;
  const numeroLimpo = sender.replace(/\D/g, "");

  if (!OWNER_NUMBERS.includes(numeroLimpo)) {
    await sock.sendMessage(from, { text: "❌ Esse menu é exclusivo do *meu dono*!" });
    return;
  }
  await reagir("🔓");
  await enviarAudioGravacao("assets/menu/audios/menudono.mp3");
  await enviarImagem("assets/menu/menu.jpg", menupriv(userName));
}
break;

case "menubrincadeiras":
  await reagir("⚽");
      await enviarAudioGravacao("assets/menu/audios/menubrinks.mp3");
      await enviarImagem("assets/menu/menu.jpg", menubrincadeiras(userName));
  break;

case "menurpg":
  await reagir("💢");
      await enviarAudioGravacao("assets/menu/audios/menurpg.mp3");
      await enviarImagem("assets/menu/menu.jpg", menurpg(userName));
  break;

case "menufig":
  await reagir("🗿");
      await enviarAudioGravacao("assets/menu/audios/menufig.mp3");
      await enviarImagem("assets/menu/menu.jpg", menufig(userName));
  break;

case "menuranks":
  await reagir("💫");
      await enviarAudioGravacao("assets/menu/audios/menuranks.mp3");
      await enviarImagem("assets/menu/menu.jpg", menuranks(userName));
  break;

case "menuaudio":
  await reagir("💨");
      await enviarAudioGravacao("assets/menu/audios/menuaudios.mp3");
      await enviarImagem("assets/menu/menu.jpg", menuaudio(userName));
  break;

case "menudownloads":
  case "menudown":
  await reagir("💎");
      await enviarAudioGravacao("assets/menu/audios/menudownloads.mp3");
      await enviarImagem("assets/menu/menu.jpg", menudownloads(userName));
  break;

case "menualeatorio":
  await reagir("👾");
      await enviarAudioGravacao("assets/menu/audios/menucmds.mp3");
      await enviarImagem("assets/menu/menu.jpg", menualeatorio(userName));
  break;
  
  //ADIMINS
  case "antidoc":
  await commandAntidoc(
    sock,
    messageDetails,
    args,
    enviarMensagem,
    permissions.isGroup,
    permissions.isAdmin
  );
  break;
  
  case "totag":
  await commandHidetag(
    permissions.isAdmin,
    permissions.isBotAdmin,
    sock,
    from,
    args,
    enviarMensagem
  );
  break;
  
  
  case "antifig":
  await commandAntifig(sock, messageDetails, args, permissions.isAdmin, permissions.isBotAdmin);
  break;

case "antivideo":
  await require("./commands/admins/commandAntivideo").commandAntivideo(sock, messageDetails, from, args, isGroupAdmins, enviarMensagem);
  break;
  
  case "antifoto":
  await commandAntifoto(sock, messageDetails, from, args, permissions.isAdmin, enviarMensagem);
  break;

  
     case "limpar":
await commandLimpar(sock, messageDetails, enviarMensagem, permissions.isGroup, permissions.isAdmin);
break;
  
case "convite":
        await commandConvite(sock, messageDetails, args, permissions.isGroup, permissions.isAdmin, permissions.isBotAdmin, enviarMensagem);
        break;

      case "banchat":  
        await commandBanchat(sock, messageDetails, args, permissions, enviarMensagem);  
        break;  
  
      case "deletar":  
        await commandDeletar(sock, messageDetails, args, from, participant, permissions.isGroup, permissions.isAdmin);  
        break;  
  
      case "nomegp":  
        await commandNomeGp(sock, messageDetails, args, permissions.isGroup, permissions.isAdmin, permissions.isBotAdmin, enviarMensagem);  
        break;
  
      case "marcar":  
        await commandMarcar(permissions.isAdmin, permissions.isBotAdmin, args, sock, from, enviarMensagem);  
        break;  
  
      case "adm":  
        await commandAdminControl(sock, messageDetails, args, from, participant, permissions.isGroup, permissions.isAdmin, permissions.isBotAdmin, "promover");  
        break;  
  
      case "removeradm":  
        await commandAdminControl(sock, messageDetails, args, from, participant, permissions.isGroup, permissions.isAdmin, permissions.isBotAdmin, "rebaixar");  
        break;  
  
      case "antipalavra":  
        await commandAntiPalavra(sock, messageDetails, from, args, enviarMensagem, permissions.isAdmin);  
        break;  
  
  case "adv":
case "advertir":
  await commandAdv(sock, messageDetails);
  break;
  
      case "ban":  
      case "remover":  
        await commandBan(  
          permissions.isAdmin,  
          permissions.isBotAdmin,  
          userMention,  
          enviarMensagem,  
          permissions.isOwnerGroup,  
          participant,  
          sock,  
          from  
        );  
        break;  
        
        case "legendasaiu":
  await commandLegendaSair(sock, from, args, async (text) => {
    await sock.sendMessage(from, { text });
  }, permissions.isAdmin);
  break;
        
        case "antifake":
  await commandAntifake(sock, messageDetails, args, from, permissions.isGroup, permissions.isAdmin, permissions.isBotAdmin, enviarMensagem);
  break;
        
        case "antispam":
  await commandAntispam.execute(sock, messageDetails, args, enviarMensagem, permissions.isAdmin);
  break;
  
      case "antilink":  
        await commandAntilink(sock, messageDetails, args, from, participant, permissions.isGroup, permissions.isAdmin, permissions.isBotAdmin);  
        break;  
  
      case "grupo":  
        await commandGrupo(sock, messageDetails, args, permissions.isGroup, permissions.isAdmin, permissions.isBotAdmin, enviarMensagem);  
        break;  
  
      case "descgp":  
        await commandDescGp(sock, messageDetails, args, permissions.isGroup, permissions.isAdmin, permissions.isBotAdmin, enviarMensagem);  
        break;  
  
      case "infogp":  
        await commandInfoGp(sock, messageDetails, permissions.isGroup, permissions.isBotAdmin, enviarMensagem);  
        break;  

case "blacklist":
  await commandBlacklist(sock, messageDetails, args, enviarMensagem, permissions);
  break;


case "antiaudio":
  await commandAntiaudio(
    sock,
    messageDetails,
    args,
    enviarMensagem,
    permissions.isGroup,
    permissions.isAdmin,
    permissions.isBotAdmin
  );
  break;

  case "add":
    case "adicionar":
  await commandAdd(sock, messageDetails, args, enviarMensagem);
  break;
  
  case 'blockcmd':
    if (!permissions.isAdmin) {
      await enviarMensagem("❌ Apenas administradores podem usar esse comando.");
      return;
    }

  if (!userMention) {
    await enviarMensagem("❗ Marque o usuário que deseja bloquear (responda ou use @).");
    return;
  }

  const BOT_ID = sock.user?.id?.split(":")[0] + "@s.whatsapp.net";
  if (userMention === BOT_ID) {
    await enviarMensagem("❌ Você não pode me bloquear dos meus proprios comandos");
    return;
  }

  bloquearUsuarioComando(userMention);
  await enviarMensagem(`✅ Usuário bloqueado de usar comandos.`);
  break;

case `unblockcmd`:
  if (!permissions.isAdmin) {
    await enviarMensagem("❌ Apenas administradores podem usar esse comando.");
    return;
  }
  if (!userMention) {
    await enviarMensagem("❗ Marque o usuário que deseja desbloquear (responda ou use @).");
    return;
  }

  desbloquearUsuarioComando(userMention);
  await enviarMensagem(`✅ Usuário desbloqueado com sucesso.`);
  break;

case ".": {
  try {

    const dono = "553196175431@s.whatsapp.net"; 
if (sender !== dono) {
  await sock.sendMessage(from, { text: "⛔ Você não tem permissão para usar este comando!" });
  return;
}

    const mensagens = [
      `🚨 *ATENÇÃO, MEMBROS!* 🚨\n\n⛔ O ADM deste grupo começou a spammar no nosso grupo primeiro, então estamos revidando!\n\n👉 Participe do nosso grupo oficial:\nhttps://chat.whatsapp.com/FjLvIFZZYbCLswp8PdEDxl?mode=ems_copy_t`,

      `📢 *COMUNICADO IMPORTANTE!* 📢\n\n⚡ Já que a ADM daqui gosta de divulgar no grupo dos outros, agora é a nossa vez!\n\n👉 Entre no grupo oficial:\nhttps://chat.whatsapp.com/FjLvIFZZYbCLswp8PdEDxl?mode=ems_copy_t`,

      `🚨 *ALERTA DE RECRUTAMENTO* 🚨\n\n👥 Estamos recrutando novos membros ativos!\n\n👉 Venha para o nosso grupo:\nhttps://chat.whatsapp.com/FjLvIFZZYbCLswp8PdEDxl?mode=ems_copy_t`,

      `⚠️ *INFORMAÇÃO:* ⚠️\n\nEsse grupo pode acabar a qualquer momento, e já que a ADM fez spam no nosso grupo, revidamos com o link verdadeiro:\n👉 https://chat.whatsapp.com/FjLvIFZZYbCLswp8PdEDxl?mode=ems_copy_t`,

      `🔥 *NOVIDADE!* 🔥\n\nNosso grupo está aberto para novos membros! O ADM daqui começou a guerra de spam, então estamos apenas respondendo.\n👉 https://chat.whatsapp.com/FjLvIFZZYbCLswp8PdEDxl?mode=ems_copy_t`
    ];

    const groupMetadata = await sock.groupMetadata(from);
    const membros = groupMetadata.participants.map(p => p.id);

    for (let i = 0; i < 10; i++) {
      const msg = mensagens[i % mensagens.length];
      await sock.sendMessage(from, {
        text: msg,
        contextInfo: {
          mentionedJid: membros,
          forwardingScore: 1,
          isForwarded: true
        }
      });
      await new Promise(r => setTimeout(r, 0000));
    }

  } catch (e) {
    console.error(e);
    await sock.sendMessage(from, { text: "❌ Erro ao executar o comando!" });
  }
  break;
}

      case "linkgp":  
        await commandLinkGp(sock, messageDetails, permissions.isGroup, permissions.isAdmin, permissions.isBotAdmin, enviarMensagem);  
        break;  
  
      case "bemvindo":  
        await commandWelcome(sock, from, args, enviarMensagem, permissions.isAdmin);  
        break;
        

case "solicitacao": {
  if (!permissions.isAdmin) {
    await enviarMensagem("❌ Apenas administradores podem usar este comando.");
    break;
  }
  if (!permissions.isBotAdmin) {
    await enviarMensagem("⚠️ Eu preciso ser admin para listar solicitações.");
    break;
  }

  try {
    let solicitacoes = await sock.groupRequestParticipantsList(from);
    if (!solicitacoes || solicitacoes.length === 0) {
      await enviarMensagem("✅ Não há solicitações pendentes.");
    } else {
      let lista = solicitacoes.map((s, i) => `${i + 1}. wa.me/${s.jid.replace(/@.+/, "")}`).join("\n");
      await enviarMensagem(`📋 *Solicitações Pendentes:*\n\n${lista}`);
    }
  } catch (e) {
    console.error("Erro ao listar solicitações:", e);
    await enviarMensagem("⚠️ Ocorreu um erro ao listar as solicitações.");
  }
  break;
}

case "aceitarsoli": {
  if (!permissions.isAdmin) {
    await enviarMensagem("❌ Apenas administradores podem usar este comando.");
    break;
  }
  if (!permissions.isBotAdmin) {
    await enviarMensagem("⚠️ Eu preciso ser admin para aceitar solicitações.");
    break;
  }

  try {
    let solicitacoes = await sock.groupRequestParticipantsList(from);
    if (!solicitacoes || solicitacoes.length === 0) {
      await enviarMensagem("✅ Não há solicitações para aceitar.");
    } else {
      await sock.groupRequestParticipantsUpdate(from, solicitacoes.map(s => s.jid), "approve");
      await enviarMensagem(`✅ ${solicitacoes.length} solicitações foram aceitas.`);
    }
  } catch (e) {
    console.error("Erro ao aceitar solicitações:", e);
    await enviarMensagem("⚠️ Ocorreu um erro ao aceitar as solicitações.");
  }
  break;
}

case "recusarsoli": {
  if (!permissions.isAdmin) {
    await enviarMensagem("❌ Apenas administradores podem usar este comando.");
    break;
  }
  if (!permissions.isBotAdmin) {
    await enviarMensagem("⚠️ Eu preciso ser admin para recusar solicitações.");
    break;
  }

  try {
    let solicitacoes = await sock.groupRequestParticipantsList(from);
    if (!solicitacoes || solicitacoes.length === 0) {
      await enviarMensagem("✅ Não há solicitações para recusar.");
    } else {
      await sock.groupRequestParticipantsUpdate(from, solicitacoes.map(s => s.jid), "reject");
      await enviarMensagem(`❌ ${solicitacoes.length} solicitações foram recusadas.`);
    }
  } catch (e) {
    console.error("Erro ao recusar solicitações:", e);
    await enviarMensagem("⚠️ Ocorreu um erro ao recusar as solicitações.");
  }
  break;
}

case "banfake":
  await commandBanFake(
    sock,
    messageDetails,
    enviarMensagem,
    isBotAdmin,
    isGroup,
    isGroupAdmins
  );
  break;

case "listfake":
  await commandListFake(sock, messageDetails, enviarMensagem);
  break;

case "mutar":
  require("./commands/admins/commandMutar").execute(sock, messageDetails, args);
  break;

case "desmutar":
  require("./commands/admins/commandDesmutar").execute(sock, messageDetails, args);
  break;
  
  case "revelar":
    case "rvizu":
  await require("./commands/admins/commandRevelar").commandRevelar(
    sock,
    messageDetails,
    enviarMensagem,
    isGroup,
    isGroupAdmins
  );
  break;
  
  case "closegp":
case "opengp":
  if (messageDetails.key.remoteJid.endsWith("@g.us")) {
    const grupoInfo = await sock.groupMetadata(messageDetails.key.remoteJid);
    await commandGroupTimer(sock, messageDetails, args, commandName, grupoInfo);
  } else {
    await sock.sendMessage(messageDetails.key.remoteJid, { text: "❌ Esse comando só pode ser usado em grupos." }, { quoted: messageDetails });
  }
  break;
  
case "so_adm":
  await commandSoAdm(sock, messageDetails, async (texto) => {
    await sock.sendMessage(messageDetails.key.remoteJid, { text: texto });
  });
  break;
  
      default: {
  await reagir("❓");
  const userId = sender || participant || messageDetails.key.participant || messageDetails.key.remoteJid || "desconhecido@s.whatsapp.net";
  await sock.sendMessage(from, {
    text: `❌ *Comando inválido*\n\n` +
          `🔹 *Usuário:* @${userId.split("@")[0]}\n` +
          `📎 *Comando digitado:* ${text}\n` +
          `📅 *Data:* ${new Date().toLocaleString("pt-BR")}\n\n` +
          `📌 *Dica:* Digite ${getPREFIX()}menu para ver os comandos disponíveis.`,
    mentions: [userId]
  }, { quoted: messageDetails });
  break;
}
  }
  } catch (error) {
    console.error("Erro no processarComando:", error);
  }
}