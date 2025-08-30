exports.commandTutorial = async (sock, messageDetails, enviarMensagem) => {
  await enviarMensagem(
`📖 *Tutorial do RPG Kayros Bot* 🛡️⚔️

Comandos principais:
- !rpg iniciar ➜ Inicia sua jornada com 20 ouros
- !minerar ➜ Tente ganhar mais ouro (chance de falha)
- !roubar @user ➜ Roube outro jogador (com riscos!)
- !comprar escudo ➜ Compre proteção contra roubos
- !uparescudo ➜ Melhore seu escudo
- !doarouro @user 100 ➜ Doe 100 ouros a alguém
- !batalhar @user ➜ Desafie alguém para batalha PvP (custa 35 ouros)
- !rankouro ➜ Ranking dos jogadores mais ricos
- !sorteio ➜ Sorteio aleatório de ouros
- !minouro ➜ Veja quanto ouro você tem
- !recompensa ➜ Coleta diária (+20 ouros)

Boa sorte, aventureiro! 🏹`
  );
};