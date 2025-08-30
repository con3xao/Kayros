const fs = require('fs');
const path = require('path');
const { carregarBancoRPG, salvarBancoRPG } = require('../../utils/rpgBanco');

exports.commandComprarSorte = async (sock, messageDetails, enviarMensagem, participant) => {
    const usuarios = carregarBancoRPG();
    const id = participant;

    if (!usuarios[id]) {
        await enviarMensagem("❌ Você ainda não está registrado no RPG. Use *!rpg iniciar* para começar.");
        return;
    }

    if (usuarios[id].ouro < 150) {
        await enviarMensagem("❌ Você precisa de pelo menos 150 ouros para comprar sorte.");
        return;
    }

    if (typeof usuarios[id].sorte !== 'number') {
        usuarios[id].sorte = 0;
    }

    usuarios[id].ouro -= 150;
    usuarios[id].sorte += 10;

    let mensagemFinal = `🍀 Você comprou 10% de sorte por 150 ouros!\nAgora você tem ${usuarios[id].sorte}% de sorte e ${usuarios[id].ouro} ouros restantes.`;

    if (usuarios[id].sorte >= 1000) {
        usuarios[id].sorte = 0;
        usuarios[id].ouro += 1000;


        usuarios[id].escudo = {
            tipo: "infinito",
            nivel: 99,
            resistencia: Infinity
        };

        mensagemFinal += `\n\n🎉 PARABÉNS! Sua sorte chegou a 500%!\nVocê ganhou:\n💰 1.000 ouros\n🛡️ ESCUDO INFINITO!\n\nSua sorte foi resetada para 0%.`;
    }

    salvarBancoRPG(usuarios);
    await enviarMensagem(mensagemFinal);
};