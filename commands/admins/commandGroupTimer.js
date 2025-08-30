const moment = require("moment-timezone");
moment.tz.setDefault("America/Sao_Paulo"); 

async function commandGroupTimer(sock, msg, args, commandName, grupoInfo) {
  try {
    const jid = msg.key.remoteJid;

    if (!jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, { text: "❌ Esse comando só pode ser usado em grupos." }, { quoted: msg });
    }


    const admins = grupoInfo.participants
      .filter(p => p.admin !== null)
      .map(p => p.id);

    const sender = msg.key.participant;


    if (!admins.includes(sender)) {
      return sock.sendMessage(jid, { text: "⛔ Apenas administradores podem usar este comando." }, { quoted: msg });
    }


    if (!args[0] || !/^\d{2}:\d{2}$/.test(args[0])) {
      return sock.sendMessage(jid, { text: "❌ Formato inválido. Use: .closegp HH:MM ou .opengp HH:MM" }, { quoted: msg });
    }

    const [hour, minute] = args[0].split(":").map(Number);



    const now = moment();
    let target = moment().hour(hour).minute(minute).second(0);

    if (target.isBefore(now)) {
      target.add(1, "day");
    }

    const diffMs = target.diff(now);
    const diffMin = Math.round(diffMs / 60000);

    if (commandName === "closegp") {
      await sock.sendMessage(jid, {
        text: `🔒 O grupo será fechado às ${target.format("HH:mm")} (daqui ${diffMin} minutos).`
      }, { quoted: msg });

      setTimeout(async () => {
        await sock.groupSettingUpdate(jid, "announcement");
        await sock.sendMessage(jid, { text: "🔒 Grupo fechado pelos administradores!" });
      }, diffMs);
    }

    if (commandName === "opengp") {
      await sock.sendMessage(jid, {
        text: `🔓 O grupo será aberto às ${target.format("HH:mm")} (daqui ${diffMin} minutos).`
      }, { quoted: msg });

      setTimeout(async () => {
        await sock.groupSettingUpdate(jid, "not_announcement");
        await sock.sendMessage(jid, { text: "🔓 Grupo aberto pelos administradores!" });
      }, diffMs);
    }

  } catch (err) {
    console.error("Erro no comando de grupo:", err);
    await sock.sendMessage(msg.key.remoteJid, { text: "❌ Ocorreu um erro inesperado." }, { quoted: msg });
  }
}
module.exports = { commandGroupTimer };