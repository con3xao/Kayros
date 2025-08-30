exports.commandFazerNick = async (sock, messageDetails, args, enviarMensagem) => {
  if (!args[0]) {
    await enviarMensagem("❌ Digite um nome para gerar nicks personalizados. Exemplo: !fazernick Lucas");
    return;
  }

  const nome = args.join(" ").toLowerCase();
  const nomeDecorado = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
  const nomeCapitalizado = nomeDecorado.charAt(0).toUpperCase() + nomeDecorado.slice(1);

  const modelos = [
    `★彡[${nomeDecorado}]彡★`,
    `⪻${nomeDecorado.toUpperCase()}⪼`,
    `✧･ﾟ:* ${nomeDecorado} *:･ﾟ✧`,
    `꧁༒☬${nomeDecorado}☬༒꧂`,
    `『${nomeDecorado}』`,
    `☾★ ${nomeDecorado} ★☽`,
    `♡ ${nomeDecorado} ♡`,
    `✞ ${nomeDecorado} ✞`,
    `🄳🄴🅂🄸🄶🄽 ${nomeDecorado}`,
    `『★${nomeCapitalizado}★』`,
    `★彡${nomeDecorado.split('').join(' ')}彡★`,

    `☠️💀 ${nomeDecorado} 💀☠️`,
    `【★】${nomeDecorado}【★】`,
    `🜲『${nomeDecorado}』🜲`,
    `(っ◔◡◔)っ ♥ ${nomeDecorado} ♥`,
    `𓂀𓆩${nomeDecorado}𓆪𓂀`,
    `✩⃛ ${nomeDecorado} ✩⃛`,
    `✪︵${nomeDecorado}︵✪`,
    `ღ【${nomeDecorado}】ღ`,
    `🧿 ${nomeDecorado} 🧿`,
    `⋆｡°✩ ${nomeDecorado} ✩°｡⋆`,
    `⚡ ${nomeDecorado} ⚡`,
    `★⌒ ${nomeDecorado} ⌒★`,
    `꧁༒✰${nomeDecorado}✰༒꧂`,
    `ꜰᴀʙᴜʟᴏꜱᴏ ${nomeDecorado}`,
    `꧁𓊈𒆜${nomeDecorado}𒆜𓊉꧂`,
    `🎭 ${nomeDecorado} 🎭`,
    `༼ つ ◕‿◕ ༽ ${nomeDecorado}`,
    `卍 ${nomeDecorado} 卍`,
    `⫷ ${nomeDecorado} ⫸`,
    `⎝⎝✧${nomeDecorado}✧⎠⎠`
  ];

  const resposta = `🎨 *Apelidos com "${nome}":*\n\n${modelos.join('\n')}`;
  await enviarMensagem(resposta);
};