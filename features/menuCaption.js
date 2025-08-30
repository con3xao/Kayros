const fs = require("fs");
const path = require("path");
const settingsPath = path.join(__dirname, "../settings.json");

function getPREFIX() {
  const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
  return settings.PREFIX || ".";
}

function setPREFIX(novoPrefix) {
  const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
  settings.PREFIX = novoPrefix;
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  return novoPrefix;
}

function menu(nomeUsuario) {
  const prefix = getPREFIX();
  const BOT_NAME = "kayros_bot";
  return `╭︵‿︵‿୨🔥୧‿︵‿︵╮
┃
┃  🤖 Meu nome: ${BOT_NAME}
┃  ⌨️ prefixo: ${prefix}
┃  📡 Status: Online
┃  👤 Usuário: ${nomeUsuario}
┃
╰︶﹏︶﹏୨📍୧︶﹏︶╯
╭─✦〔 🚀 MENU 🚀 〕✦─╮
│
│ ⚡ ${prefix}menuadm
│ ⚡ ${prefix}menucompleto
│ ⚡ ${prefix}menudono
│ ⚡ ${prefix}menubrincadeiras
│ ⚡ ${prefix}menurpg
│ ⚡ ${prefix}menufig
│ ⚡ ${prefix}menuranks
│ ⚡ ${prefix}menuaudio
│ ⚡ ${prefix}menudownloads
│ ⚡ ${prefix}menualeatorio
│
╰─◉───────────────────────◉─╯`;
}

function menuadm(nomeUsuario) {
  const prefix = getPREFIX();
  const BOT_NAME = "kayros_bot";

  return `╭︵‿︵‿୨🔥୧‿︵‿︵╮
┃
┃  🤖 Meu nome: ${BOT_NAME}
┃  ⌨️ prefixo: ${prefix}
┃  📡 Status: Online
┃  👤 Usuário: ${nomeUsuario}
┃
╰︶﹏︶﹏୨📍୧︶﹏︶╯

╭─〔  Menu ADM  〕─⬳
│ ⚡ ${prefix}antispam on/off 
│ ⚡ ${prefix}antifoto on/off  
│ ⚡ ${prefix}antivideo on/off 
│ ⚡ ${prefix}antifig on/off 
│ ⚡ ${prefix}antidoc on/off 
│ ⚡ ${prefix}antiaudio on/off 
│ ⚡ ${prefix}antifake on/off 
│ ⚡ ${prefix}antipalavra on/off 
│ ⚡ ${prefix}antilink on/off
│ ⚡ ${prefix}rpgstatus on/off 
│ ⚡ ${prefix}add (numero)
│ ⚡ ${prefix}aceitarsoli (pendente)
│ ⚡ ${prefix}recusarsoli (pendente)
│ ⚡ ${prefix}solicitacao (lista)
│ ⚡ ${prefix}infogp
│ ⚡ ${prefix}revelar
│ ⚡ ${prefix}linkgp
│ ⚡ ${prefix}grupo a/f
│ ⚡ ${prefix}descgp
│ ⚡ ${prefix}nomegp
│ ⚡ ${prefix}closegp (HH:mm)
│ ⚡ ${prefix}opengp (HH:mm)
│ ⚡ ${prefix}blockcmd
│ ⚡ ${prefix}unblockcmd
│ ⚡ ${prefix}so_adm
│ ⚡ ${prefix}adm
│ ⚡ ${prefix}mutar
│ ⚡ ${prefix}desmutar
│ ⚡ ${prefix}removeradm
│ ⚡ ${prefix}adv
│ ⚡ ${prefix}ban
│ ⚡ ${prefix}deletar
│ ⚡ ${prefix}marcar
│ ⚡ ${prefix}totag
│ ⚡ ${prefix}listfake
│ ⚡ ${prefix}banfake
│ ⚡ ${prefix}bemvindo on/off
│ ⚡ ${prefix}bemvindo text
│ ⚡ ${prefix}blacklist add
│ ⚡ ${prefix}blacklist r
│ ⚡ ${prefix}legendasaiu on/off
│ ⚡ ${prefix}legendasaiu (mensagem)
│ ⚡ ${prefix}blacklist list 
╰───────────────────⭓`;
}

function menudono(nomeUsuario) {
  const prefix = getPREFIX();
  const BOT_NAME = "kayros_bot";
  return `╭︵‿︵‿୨🔥୧‿︵‿︵╮
┃ 
┃  🤖 Meu nome: ${BOT_NAME}
┃  ⌨️ prefixo: ${prefix}
┃  📡 Status: Online
┃  👤 Usuário: ${nomeUsuario}
┃ 
╰︶﹏︶﹏୨📍୧︶﹏︶╯

╭─〔  Menu Dono  〕─⬳
│ ⚡ ${prefix}listgp 
│ ⚡ ${prefix}botoff 
│ ⚡ ${prefix}seradm
│ ⚡ ${prefix}sermemb
│ ⚡ ${prefix}boton 
│ ⚡ ${prefix}sairgp 
│ ⚡ ${prefix}bc 
│ ⚡ ${prefix}criargp
│ ⚡ ${prefix}ping
│ ⚡ ${prefix}antiprivado1 
│ ⚡ ${prefix}antiprivado2 
│ ⚡ ${prefix}revogarlinkgp
╰───────────────────⭓`;
}

function menubrincadeiras(nomeUsuario) {
  const prefix = getPREFIX();
  const BOT_NAME = "kayros_bot";
  return `╭︵‿︵‿୨🔥୧‿︵‿︵╮
┃ 
┃  🤖 Meu nome: ${BOT_NAME}
┃  ⌨️ prefixo: ${prefix}
┃  📡 Status: Online
┃  👤 Usuário: ${nomeUsuario}
┃ 
╰︶﹏︶﹏୨📍୧︶﹏︶╯

╭─〔  Menu Brincadeiras  〕─⬳
│ ⚡ ${prefix}adivinhar 1 a 10
│ ⚡ ${prefix}cep
│ ⚡ ${prefix}forca
│ ⚡ ${prefix}eununca
│ ⚡ ${prefix}jogodavelha
│ ⚡ ${prefix}kiljogodavelha
│ ⚡ ${prefix}cassino
│ ⚡ ${prefix}adivinha
│ ⚡ ${prefix}curiosidades
│ ⚡ ${prefix}ppt
│ ⚡ ${prefix}soco
│ ⚡ ${prefix}tapa
│ ⚡ ${prefix}romance
│ ⚡ ${prefix}chutar
│ ⚡ ${prefix}matar
│ ⚡ ${prefix}reviver
│ ⚡ ${prefix}chance
│ ⚡ ${prefix}beijar
│ ⚡ ${prefix}falso
│ ⚡ ${prefix}bebado
│ ⚡ ${prefix}bonito
│ ⚡ ${prefix}abraco
│ ⚡ ${prefix}perfil
│ ⚡ ${prefix}gay
│ ⚡ ${prefix}fiel
│ ⚡ ${prefix}infiel
│ ⚡ ${prefix}talarico
╰───────────────────⭓`;
}

function menurpg(nomeUsuario) {
  const prefix = getPREFIX();
  const BOT_NAME = "kayros_bot";
  return `╭︵‿︵‿୨🔥୧‿︵‿︵╮
┃ 
┃  🤖 Meu nome: ${BOT_NAME}
┃  ⌨️ prefixo: ${prefix}
┃  📡 Status: Online
┃  👤 Usuário: ${nomeUsuario}
┃ 
╰︶﹏︶﹏୨📍୧︶﹏︶╯

╭─〔  Menu RPG  〕─⬳
│ ⚡ ${prefix}rpg iniciar
│ ⚡ ${prefix}meuouro
│ ⚡ ${prefix}sorte
│ ⚡ ${prefix}escudo
│ ⚡ ${prefix}uparescudo
│ ⚡ ${prefix}batalhar
│ ⚡ ${prefix}roubar
│ ⚡ ${prefix}tutorial
│ ⚡ ${prefix}sorteio
│ ⚡ ${prefix}rankouro
│ ⚡ ${prefix}minerar
│ ⚡ ${prefix}apostar
│ ⚡ ${prefix}recompensa
│ ⚡ ${prefix}doarouro
╰───────────────────⭓`;
}

function menufig(nomeUsuario) {
  const prefix = getPREFIX();
  const BOT_NAME = "kayros_bot";
  return `╭︵‿︵‿୨🔥୧‿︵‿︵╮
┃ 
┃  🤖 Meu nome: ${BOT_NAME}
┃  ⌨️ prefixo: ${prefix}
┃  📡 Status: Online
┃  👤 Usuário: ${nomeUsuario}
┃ 
╰︶﹏︶﹏୨📍୧︶﹏︶╯

╭─〔  Menu Figurinhas  〕─⬳
│ ⚡ ${prefix}s
│ ⚡ ${prefix}sticker
│ ⚡ ${prefix}sv
│ ⚡ ${prefix}fig
│ ⚡ ${prefix}attp
│ ⚡ ${prefix}ttp
│ ⚡ ${prefix}imagem
│ ⚡ ${prefix}rename
│ ⚡ ${prefix}figaleatoria
│ ⚡ ${prefix}rfigu
│ ⚡ ${prefix}qc
╰───────────────────⭓`;
}

function menuranks(nomeUsuario) {
  const prefix = getPREFIX();
  const BOT_NAME = "kayros_bot";
  return `╭︵‿︵‿୨🔥୧‿︵‿︵╮
┃ 
┃  🤖 Meu nome: ${BOT_NAME}
┃  ⌨️ prefixo: ${prefix}
┃  📡 Status: Online
┃  👤 Usuário: ${nomeUsuario}
┃ 
╰︶﹏︶﹏୨📍୧︶﹏︶╯

╭─〔  Menu Ranks  〕─⬳
│ ⚡ ${prefix}rankgay 
│ ⚡ ${prefix}rankgado
│ ⚡ ${prefix}rankcorno 
│ ⚡ ${prefix}rankgostoso 
│ ⚡ ${prefix}rankgostosa 
│ ⚡ ${prefix}rankotakus
│ ⚡ ${prefix}rankcomunista
│ ⚡ ${prefix}rankativo
│ ⚡ ${prefix}rankinativo
╰───────────────────⭓`;
}

function menuaudio(nomeUsuario) {
  const prefix = getPREFIX();
  const BOT_NAME = "kayros_bot";
  return `╭︵‿︵‿୨🔥୧‿︵‿︵╮
┃ 
┃  🤖 Meu nome: ${BOT_NAME}
┃  ⌨️ prefixo: ${prefix}
┃  📡 Status: Online
┃  👤 Usuário: ${nomeUsuario}
┃ 
╰︶﹏︶﹏୨📍୧︶﹏︶╯

╭─〔  Menu videos  〕─⬳
│ ⚡ ${prefix}videoreverse
│ ⚡ ${prefix}videolento
│ ⚡ ${prefix}videorapido
│ ⚡ ${prefix}videorobo
╰───────────────────⭓

╭─〔  Menu Áudios  〕─⬳
│ ⚡ ${prefix}audiorapido
│ ⚡ ${prefix}audiolento
│ ⚡ ${prefix}estourar
│ ⚡ ${prefix}grave
│ ⚡ ${prefix}agudo
│ ⚡ ${prefix}reverse
│ ⚡ ${prefix}robo
│ ⚡ ${prefix}helio
│ ⚡ ${prefix}caverna
│ ⚡ ${prefix}eco
╰───────────────────⭓`;
}

function menudownloads(nomeUsuario) {
  const prefix = getPREFIX();
  const BOT_NAME = "kayros_bot";
  return `╭︵‿︵‿୨🔥୧‿︵‿︵╮
┃ 
┃  🤖 Meu nome: ${BOT_NAME}
┃  ⌨️ prefixo: ${prefix}
┃  📡 Status: Online
┃  👤 Usuário: ${nomeUsuario}
┃ 
╰︶﹏︶﹏୨📍୧︶﹏︶╯

╭─〔  Menu Downloads  〕─⬳
│ ⚡ ${prefix}ytmp4
│ ⚡ ${prefix}ytmp3
│ ⚡ ${prefix}pla3
│ ⚡ ${prefix}play2
│ ⚡ ${prefix}play
│ ⚡ ${prefix}ytdoc
│ ⚡ ${prefix}ytmp4doc
│ ⚡ ${prefix}tiktok
│ ⚡ ${prefix}kwai
│ ⚡ ${prefix}instagram
│ ⚡ ${prefix}youtube
│ ⚡ ${prefix}upload
│ ⚡ ${prefix}upload_doc
╰───────────────────⭓`;
}

function menupriv(nomeUsuario) {
  const prefix = getPREFIX();
  const BOT_NAME = "kayros_bot";
  return `╭︵‿︵‿୨🔥୧‿︵‿︵╮
┃ 
┃  🤖 Meu nome: ${BOT_NAME}
┃  ⌨️ prefixo: ${prefix}
┃  📡 Status: Online
┃  👤 Usuário: ${nomeUsuario}
┃ 
╰︶﹏︶﹏୨📍୧︶﹏︶╯

╭─〔  Menu Privado  〕─⬳
│ ⚡ ${prefix}viewmsg on/off
│ ⚡ ${prefix}Setprefix
│ ⚡ ${prefix}foto_menu
│ ⚡ ${prefix}audio_menu
│ ⚡ ${prefix}banchat 
│ ⚡ ${prefix}nuke
│ ⚡ ${prefix}nome_dono
│ ⚡ ${prefix}numero_dono
╰───────────────────⭓`;
}

function menualeatorio(nomeUsuario) {
  const prefix = getPREFIX();
  const BOT_NAME = "kayros_bot";
  return `╭︵‿︵‿୨🔥୧‿︵‿︵╮
┃ 
┃  🤖 Meu nome: ${BOT_NAME}
┃  ⌨️ prefixo: ${prefix}
┃  📡 Status: Online
┃  👤 Usuário: ${nomeUsuario}
┃ 
╰︶﹏︶﹏୨📍୧︶﹏︶╯

╭─〔  Menu Aleatório  〕─⬳
│ ⚡ ${prefix}bug
│ ⚡ ${prefix}sugestao
│ ⚡ ${prefix}dono
│ ⚡ ${prefix}criador
│ ⚡ ${prefix}fazernick
│ ⚡ ${prefix}traduzir
│ ⚡ ${prefix}admins
│ ⚡ ${prefix}metadinha
╰───────────────────⭓`;
}

function menucompleto(nomeUsuario) {
  const prefix = getPREFIX();
  const BOT_NAME = "kayros_bot";
  return `╭︵‿︵‿୨🔥୧‿︵‿︵╮
┃ 
┃  🤖 Meu nome: ${BOT_NAME}
┃  ⌨️ prefixo: ${prefix}
┃  📡 Status: Online
┃  👤 Usuário: ${nomeUsuario}
┃ 
╰︶﹏︶﹏୨📍୧︶﹏︶╯
╭─〔 ⚡ Menu Adm ⚡ 〕─⬳
│ ⚡ ${prefix}antispam on/off 
│ ⚡ ${prefix}antifoto on/off  
│ ⚡ ${prefix}antivideo on/off 
│ ⚡ ${prefix}antifig on/off 
│ ⚡ ${prefix}antidoc on/off 
│ ⚡ ${prefix}antiaudio on/off 
│ ⚡ ${prefix}antifake on/off 
│ ⚡ ${prefix}antipalavra on/off 
│ ⚡ ${prefix}antilink on/off
│ ⚡ ${prefix}rpgstatus on/off 
│ ⚡ ${prefix}add (numero)
│ ⚡ ${prefix}aceitarsoli (pendente)
│ ⚡ ${prefix}recusarsoli (pendente)
│ ⚡ ${prefix}solicitacao (lista)
│ ⚡ ${prefix}infogp
│ ⚡ ${prefix}linkgp
│ ⚡ ${prefix}grupo a/f
│ ⚡ ${prefix}descgp
│ ⚡ ${prefix}nomegp
│ ⚡ ${prefix}closegp (HH:mm)
│ ⚡ ${prefix}opengp (HH:mm)
│ ⚡ ${prefix}blockcmd
│ ⚡ ${prefix}unblockcmd
│ ⚡ ${prefix}so_adm
│ ⚡ ${prefix}adm
│ ⚡ ${prefix}mutar
│ ⚡ ${prefix}desmutar
│ ⚡ ${prefix}removeradm
│ ⚡ ${prefix}adv
│ ⚡ ${prefix}revelar
│ ⚡ ${prefix}ban
│ ⚡ ${prefix}deletar
│ ⚡ ${prefix}marcar
│ ⚡ ${prefix}totag
│ ⚡ ${prefix}listfake
│ ⚡ ${prefix}banfake
│ ⚡ ${prefix}bemvindo on/off
│ ⚡ ${prefix}bemvindo text
│ ⚡ ${prefix}blacklist add
│ ⚡ ${prefix}blacklist r
│ ⚡ ${prefix}legendasaiu on/off
│ ⚡ ${prefix}legendasaiu (mensagem)
│ ⚡ ${prefix}blacklist list 
╰───────────────────⭓

╭─〔 ⚡ Menu Brincadeiras ⚡ 〕─⬳
│ ⚡ ${prefix}adivinhar 1 a 10
│ ⚡ ${prefix}cep
│ ⚡ ${prefix}forca
│ ⚡ ${prefix}eununca
│ ⚡ ${prefix}jogodavelha
│ ⚡ ${prefix}kiljogodavelha
│ ⚡ ${prefix}cassino
│ ⚡ ${prefix}adivinha
│ ⚡ ${prefix}curiosidades
│ ⚡ ${prefix}ppt
╰───────────────────⭓

╭─〔 ⚡ Menu Brincadeiras/Gif ⚡ 〕─⬳
│ ⚡ ${prefix}soco
│ ⚡ ${prefix}tapa
│ ⚡ ${prefix}romance
│ ⚡ ${prefix}chutar
│ ⚡ ${prefix}matar
│ ⚡ ${prefix}reviver
│ ⚡ ${prefix}chance
│ ⚡ ${prefix}beijar
│ ⚡ ${prefix}falso
│ ⚡ ${prefix}bebado
│ ⚡ ${prefix}bonito
│ ⚡ ${prefix}abraco
│ ⚡ ${prefix}perfil
│ ⚡ ${prefix}gay
│ ⚡ ${prefix}fiel
│ ⚡ ${prefix}infiel
│ ⚡ ${prefix}talarico
╰───────────────────⭓

╭─〔 ⚡ Menu RPG ⚡ 〕─⬳
│ ⚡ ${prefix}rpg iniciar
│ ⚡ ${prefix}meuouro
│ ⚡ ${prefix}sorte
│ ⚡ ${prefix}escudo
│ ⚡ ${prefix}uparescudo
│ ⚡ ${prefix}batalhar
│ ⚡ ${prefix}roubar
│ ⚡ ${prefix}tutorial
│ ⚡ ${prefix}sorteio
│ ⚡ ${prefix}rankouro
│ ⚡ ${prefix}minerar
│ ⚡ ${prefix}apostar
│ ⚡ ${prefix}recompensa
│ ⚡ ${prefix}doarouro
╰───────────────────⭓

╭─〔 ⚡ Menu imagens ⚡ 〕─⬳
│ ⚡ ${prefix}imagem
╰───────────────────⭓

╭─〔 ⚡ Menu Figurinhas ⚡ 〕─⬳
│ ⚡ ${prefix}s
│ ⚡ ${prefix}sticker
│ ⚡ ${prefix}sv
│ ⚡ ${prefix}fig
│ ⚡ ${prefix}attp
│ ⚡ ${prefix}ttp
│ ⚡ ${prefix}imagem
│ ⚡ ${prefix}figaleatoria
│ ⚡ ${prefix}rfigu
│ ⚡ ${prefix}rename
│ ⚡ ${prefix}qc
╰───────────────────⭓

╭─〔 ⚡ Menu Ranks ⚡ 〕─⬳
│ ⚡ ${prefix}rankgay 
│ ⚡ ${prefix}rankgado
│ ⚡ ${prefix}rankcorno 
│ ⚡ ${prefix}rankgostoso 
│ ⚡ ${prefix}rankgostosa 
│ ⚡ ${prefix}rankotakus
│ ⚡ ${prefix}rankcomunista
│ ⚡ ${prefix}rankativo
│ ⚡ ${prefix}rankinativo
╰───────────────────⭓

╭─〔  Menu videos  〕─⬳
│ ⚡ ${prefix}videoreverse
│ ⚡ ${prefix}videolento
│ ⚡ ${prefix}videorapido
│ ⚡ ${prefix}videorobo
╰───────────────────⭓

╭─〔  Menu Áudios  〕─⬳
│ ⚡ ${prefix}audiorapido
│ ⚡ ${prefix}audiolento
│ ⚡ ${prefix}estourar
│ ⚡ ${prefix}grave
│ ⚡ ${prefix}agudo
│ ⚡ ${prefix}reverse
│ ⚡ ${prefix}robo
│ ⚡ ${prefix}helio
│ ⚡ ${prefix}caverna
│ ⚡ ${prefix}eco
╰───────────────────⭓

╭─〔 ⚡ Menu Downloads ⚡ 〕─⬳
│ ⚡ ${prefix}ytmp4
│ ⚡ ${prefix}ytmp3
│ ⚡ ${prefix}pla3
│ ⚡ ${prefix}play2
│ ⚡ ${prefix}play
│ ⚡ ${prefix}ytdoc
│ ⚡ ${prefix}ytmp4doc
│ ⚡ ${prefix}tiktok
│ ⚡ ${prefix}kwai
│ ⚡ ${prefix}instagram
│ ⚡ ${prefix}youtube
│ ⚡ ${prefix}upload
│ ⚡ ${prefix}upload_doc
╰───────────────────⭓

╭─〔 ⚡ Menu Aleatório ⚡ 〕─⬳
│ ⚡ ${prefix}bug
│ ⚡ ${prefix}sugestao
│ ⚡ ${prefix}dono
│ ⚡ ${prefix}criador
│ ⚡ ${prefix}fazernick
│ ⚡ ${prefix}traduzir
│ ⚡ ${prefix}admins
│ ⚡ ${prefix}metadinha
╰───────────────────⭓`;
}

module.exports = {
  menu,
  menuadm,
  menudono,
  menubrincadeiras,
  menurpg,
  menufig,
  menuranks,
  menuaudio,
  menudownloads,
  menucompleto,
  menupriv,
  menualeatorio
};